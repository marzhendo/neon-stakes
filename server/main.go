package main

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log"
	"math"
	"math/big"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

const (
	defaultPort        = "8080"
	maxRequestBytes    = 1 << 20
	targetRTP          = 0.965
	jackpotChance      = 0.005
	smallWinChance     = 0.345
	jackpotMultiplier  = 50.0
	smallWinMultiplier = (targetRTP - (jackpotChance * jackpotMultiplier)) / smallWinChance
)

var (
	errInsufficientBalance = errors.New("insufficient balance")
	errInvalidBet          = errors.New("bet_amount must be greater than zero")

	baseSymbols = []string{"\U0001F48E", "\U0001F451", "\U0001F352", "7"}
	allSymbols  = []string{"\U0001F48E", "\U0001F451", "\U0001F352", "7", "\u274C"}
)

type server struct {
	db *sql.DB
}

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type loginResponse struct {
	UserID   string `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
}

type adminStatsResponse struct {
	TotalWagered   int64 `json:"total_wagered"`
	TotalPayout    int64 `json:"total_payout"`
	HouseProfit    int64 `json:"house_profit"`
	TotalSpins     int64 `json:"total_spins"`
	ProfitMarginBP int64 `json:"profit_margin_bp"`
}

type spinRequest struct {
	UserID    string `json:"user_id"`
	BetAmount int64  `json:"bet_amount"`
}

type spinResponse struct {
	UserID         string   `json:"user_id"`
	BetAmount      int64    `json:"bet_amount"`
	PayoutAmount   int64    `json:"payout_amount"`
	UpdatedBalance int64    `json:"updated_balance"`
	IsWin          bool     `json:"is_win"`
	ResultType     string   `json:"result_type"`
	Multiplier     float64  `json:"multiplier"`
	Symbols        []string `json:"symbols"`
}

type spinOutcome struct {
	resultType string
	multiplier float64
	payout     int64
	symbols    []string
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("no .env file loaded: %v", err)
	}

	db, err := openDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	app := &server{db: db}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", app.handleHealth)
	mux.HandleFunc("POST /api/login", app.handleLogin)
	mux.HandleFunc("POST /api/spin", app.handleSpin)
	mux.HandleFunc("GET /api/admin/stats", app.handleAdminStats)

	port := envOrDefault("PORT", defaultPort)
	log.Printf("Neon Stakes educational backend listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, withCORS(mux)))
}

func openDB() (*sql.DB, error) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return nil, errors.New("DATABASE_URL is required")
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(30 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, err
	}

	return db, nil
}

func (s *server) handleHealth(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *server) handleLogin(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, maxRequestBytes)

	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON request")
		return
	}

	username := strings.TrimSpace(req.Username)
	if username == "" || req.Password == "" {
		writeError(w, http.StatusBadRequest, "username and password are required")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var resp loginResponse
	var storedHash string
	err := s.db.QueryRowContext(
		ctx,
		`SELECT id::text, username, role, password_hash
		 FROM users
		 WHERE username = $1`,
		username,
	).Scan(&resp.UserID, &resp.Username, &resp.Role, &storedHash)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			writeError(w, http.StatusUnauthorized, "invalid username or password")
			return
		}
		log.Printf("login lookup failed: %v", err)
		writeError(w, http.StatusInternalServerError, "failed to login")
		return
	}

	if !strings.EqualFold(storedHash, hashPassword(req.Password)) {
		writeError(w, http.StatusUnauthorized, "invalid username or password")
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (s *server) handleAdminStats(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("X-User-Role") != "admin" {
		writeError(w, http.StatusForbidden, "admin role required")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var stats adminStatsResponse
	err := s.db.QueryRowContext(
		ctx,
		`SELECT
			COALESCE(SUM(bet_amount), 0)::bigint AS total_wagered,
			COALESCE(SUM(payout_amount), 0)::bigint AS total_payout,
			(COALESCE(SUM(bet_amount), 0) - COALESCE(SUM(payout_amount), 0))::bigint AS house_profit,
			COUNT(*)::bigint AS total_spins
		 FROM bet_logs`,
	).Scan(&stats.TotalWagered, &stats.TotalPayout, &stats.HouseProfit, &stats.TotalSpins)
	if err != nil {
		log.Printf("admin stats query failed: %v", err)
		writeError(w, http.StatusInternalServerError, "failed to load admin stats")
		return
	}

	if stats.TotalWagered > 0 {
		stats.ProfitMarginBP = (stats.HouseProfit * 10000) / stats.TotalWagered
	}

	writeJSON(w, http.StatusOK, stats)
}

func (s *server) handleSpin(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, maxRequestBytes)

	var req spinRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON request")
		return
	}

	req.UserID = strings.TrimSpace(req.UserID)
	if req.UserID == "" {
		writeError(w, http.StatusBadRequest, "user_id is required")
		return
	}
	if req.BetAmount <= 0 {
		writeError(w, http.StatusBadRequest, errInvalidBet.Error())
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	result, err := s.processSpin(ctx, req.UserID, req.BetAmount)
	if err != nil {
		switch {
		case errors.Is(err, errInsufficientBalance):
			writeError(w, http.StatusPaymentRequired, err.Error())
		case errors.Is(err, errInvalidBet):
			writeError(w, http.StatusBadRequest, err.Error())
		default:
			log.Printf("process spin failed: %v", err)
			writeError(w, http.StatusInternalServerError, "failed to process spin")
		}
		return
	}

	writeJSON(w, http.StatusOK, result)
}

func (s *server) processSpin(ctx context.Context, userID string, betAmount int64) (*spinResponse, error) {
	if betAmount <= 0 {
		return nil, errInvalidBet
	}

	tx, err := s.db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
	if err != nil {
		return nil, err
	}
	defer rollbackIfOpen(tx)

	var balance int64
	// Zero client trust starts here: the wallet row is locked before any balance
	// decision, RNG outcome, deduction, payout, or log write can happen. This
	// prevents simultaneous requests from spending the same balance twice.
	err = tx.QueryRowContext(
		ctx,
		`SELECT balance::bigint FROM wallets WHERE user_id = $1 FOR UPDATE`,
		userID,
	).Scan(&balance)
	if err != nil {
		return nil, err
	}

	if balance < betAmount {
		return nil, errInsufficientBalance
	}

	outcome, err := calculateSpinResult(betAmount)
	if err != nil {
		return nil, err
	}

	updatedBalance := balance - betAmount + outcome.payout

	_, err = tx.ExecContext(
		ctx,
		`UPDATE wallets SET balance = $2 WHERE user_id = $1`,
		userID,
		updatedBalance,
	)
	if err != nil {
		return nil, err
	}

	_, err = tx.ExecContext(
		ctx,
		`INSERT INTO bet_logs (user_id, bet_amount, payout_amount, is_win)
		 VALUES ($1, $2, $3, $4)`,
		userID,
		betAmount,
		outcome.payout,
		outcome.payout > 0,
	)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &spinResponse{
		UserID:         userID,
		BetAmount:      betAmount,
		PayoutAmount:   outcome.payout,
		UpdatedBalance: updatedBalance,
		IsWin:          outcome.payout > 0,
		ResultType:     outcome.resultType,
		Multiplier:     outcome.multiplier,
		Symbols:        outcome.symbols,
	}, nil
}

func calculateSpinResult(betAmount int64) (spinOutcome, error) {
	roll, err := secureInt(10000)
	if err != nil {
		return spinOutcome{}, err
	}

	// Weighted PRNG for educational RTP/house-edge study:
	// 0.5% jackpot, 34.5% small win, 65% loss. The small-win multiplier is
	// derived from the target RTP, so the long-run profile is 96.5% instead of
	// uniform randomness. The final client must only render this server result.
	switch {
	case roll < 50:
		symbol, err := securePick([]string{"\U0001F48E", "\U0001F451", "7"})
		if err != nil {
			return spinOutcome{}, err
		}

		return spinOutcome{
			resultType: "jackpot",
			multiplier: jackpotMultiplier,
			payout:     int64(float64(betAmount) * jackpotMultiplier),
			symbols:    repeatSymbol(symbol, 15),
		}, nil

	case roll < 3500:
		symbol, err := securePick(baseSymbols)
		if err != nil {
			return spinOutcome{}, err
		}

		symbols, err := smallWinSymbols(symbol)
		if err != nil {
			return spinOutcome{}, err
		}

		return spinOutcome{
			resultType: "small-win",
			multiplier: smallWinMultiplier,
			payout:     int64(math.Round(float64(betAmount) * smallWinMultiplier)),
			symbols:    symbols,
		}, nil

	default:
		nearMissRoll, err := secureInt(100)
		if err != nil {
			return spinOutcome{}, err
		}

		if nearMissRoll < 30 {
			almost, err := securePick([]string{"\U0001F48E", "\U0001F451", "7"})
			if err != nil {
				return spinOutcome{}, err
			}
			symbols, err := nearMissSymbols(almost)
			if err != nil {
				return spinOutcome{}, err
			}

			// Near-miss is an intentionally manipulative visual pattern used here
			// only for studying dark UX. It pays nothing while returning symbols
			// that look close to a winning line.
			return spinOutcome{
				resultType: "near-miss",
				multiplier: 0,
				payout:     0,
				symbols:    symbols,
			}, nil
		}

		symbols, err := randomGrid(allSymbols)
		if err != nil {
			return spinOutcome{}, err
		}

		return spinOutcome{
			resultType: "loss",
			multiplier: 0,
			payout:     0,
			symbols:    symbols,
		}, nil
	}
}

func rollbackIfOpen(tx *sql.Tx) {
	_ = tx.Rollback()
}

func randomGrid(pool []string) ([]string, error) {
	symbols := make([]string, 15)
	for i := range symbols {
		symbol, err := securePick(pool)
		if err != nil {
			return nil, err
		}
		symbols[i] = symbol
	}
	return symbols, nil
}

func smallWinSymbols(symbol string) ([]string, error) {
	return fillPattern([]string{
		symbol, symbol, "", symbol, "",
		"", symbol, symbol, "", "",
		"", "", symbol, "", symbol,
	})
}

func nearMissSymbols(almost string) ([]string, error) {
	return fillPattern([]string{
		almost, almost, "\u274C", "", almost,
		"", almost, "\u274C", almost, "",
		"\u274C", almost, almost, "", "\u274C",
	})
}

func fillPattern(pattern []string) ([]string, error) {
	symbols := make([]string, len(pattern))
	for i, symbol := range pattern {
		if symbol != "" {
			symbols[i] = symbol
			continue
		}

		filler, err := securePick(baseSymbols)
		if err != nil {
			return nil, err
		}
		symbols[i] = filler
	}
	return symbols, nil
}

func repeatSymbol(symbol string, count int) []string {
	symbols := make([]string, count)
	for i := range symbols {
		symbols[i] = symbol
	}
	return symbols
}

func securePick(items []string) (string, error) {
	index, err := secureInt(int64(len(items)))
	if err != nil {
		return "", err
	}
	return items[index], nil
}

func secureInt(max int64) (int64, error) {
	if max <= 0 {
		return 0, errors.New("max must be positive")
	}

	n, err := rand.Int(rand.Reader, big.NewInt(max))
	if err != nil {
		return 0, err
	}
	return n.Int64(), nil
}

func hashPassword(password string) string {
	sum := sha256.Sum256([]byte(password))
	return hex.EncodeToString(sum[:])
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		log.Printf("write response failed: %v", err)
	}
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := os.Getenv("CLIENT_ORIGIN")
		if origin == "" {
			origin = "http://localhost:3000"
		}

		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-User-Role")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func envOrDefault(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func init() {
	// Ensure crypto/rand is reachable at process start. This is not used for
	// seeding; it is a fail-fast health check for the OS entropy source.
	var scratch [8]byte
	if _, err := rand.Read(scratch[:]); err != nil {
		log.Fatalf("secure randomness unavailable: %v", err)
	}
}
