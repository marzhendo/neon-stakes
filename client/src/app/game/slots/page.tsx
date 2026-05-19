"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type SpinResult = {
  isWin: boolean;
  payout: number;
  symbols: string[];
  message: string;
  resultType: string;
};

type BackendSpinResponse = {
  is_win?: boolean;
  isWin?: boolean;
  payout_amount?: number;
  payoutAmount?: number;
  updated_balance?: number;
  newBalance?: number;
  updatedBalance?: number;
  symbols?: string[];
  result_type?: string;
  resultType?: string;
  multiplier?: number;
  error?: string;
};

const apiUrl = "http://localhost:8080/api/spin";
const demoUserId = "123e4567-e89b-12d3-a456-426614174000";
const initialBalance = 10500000;
const minBet = 10000;
const maxBet = 500000;

const diamond = "\u{1F48E}";
const crown = "\u{1F451}";
const cherry = "\u{1F352}";
const miss = "\u274C";
const seven = "7";

const reelCycle = [diamond, crown, cherry, seven, miss];
const initialGrid = [
  diamond,
  crown,
  cherry,
  seven,
  crown,
  cherry,
  diamond,
  seven,
  crown,
  cherry,
  crown,
  seven,
  diamond,
  cherry,
  seven,
];

const recentWinners = [
  "Player123 won Rp 500.000 on Diamond Rush",
  "User Budi won Rp 2.000.000 on Sweet Bonanza",
  "Ana88 won Rp 150.000 on Neon Slots",
  "Cici77 won Rp 900.000 on Crown Link",
  "Asep_Gacor won Rp 1.200.000 on Zeus Grid",
  "Rani won Rp 350.000 on Cherry Pop",
];

export default function SlotsGamePage() {
  const [balance, setBalance] = useState(initialBalance);
  const [betAmount, setBetAmount] = useState(50000);
  const [grid, setGrid] = useState(initialGrid);
  const [isSpinning, setIsSpinning] = useState(false);
  const [autoSpin, setAutoSpin] = useState(false);
  const [lastResult, setLastResult] = useState<SpinResult | null>(null);
  const [showWinOverlay, setShowWinOverlay] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canSpin = balance >= betAmount && !isSpinning;

  const handleSpin = useCallback(async () => {
    if (isSpinning || balance < betAmount) return;

    setIsSpinning(true);
    setShowWinOverlay(false);
    setLastResult(null);
    setErrorMessage("");

    let frame = 0;
    const spinFrames = window.setInterval(() => {
      setGrid(createAnimatedGrid(frame));
      frame += 1;
    }, 90);

    const startedAt = Date.now();

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: getActiveUserId(),
          bet_amount: betAmount,
        }),
      });

      const payload = (await response.json()) as BackendSpinResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "Spin request failed");
      }

      const result = normalizeSpinResponse(payload);
      const remainingAnimation = Math.max(0, 650 - (Date.now() - startedAt));

      window.setTimeout(() => {
        window.clearInterval(spinFrames);
        setGrid(createResultGrid(result.spinResult.symbols));
        setBalance(result.updatedBalance);
        setLastResult(result.spinResult);

        if (result.spinResult.isWin) {
          setShowWinOverlay(true);
          window.setTimeout(() => setShowWinOverlay(false), 1400);
        }

        setIsSpinning(false);
      }, remainingAnimation);
    } catch (error) {
      window.clearInterval(spinFrames);
      setGrid(initialGrid);
      setErrorMessage(error instanceof Error ? error.message : "Unable to reach spin API");
      setIsSpinning(false);
    }
  }, [balance, betAmount, isSpinning]);

  useEffect(() => {
    if (!autoSpin || isSpinning || balance < betAmount) return;

    const timer = window.setTimeout(() => {
      handleSpin();
    }, 1300);

    return () => window.clearTimeout(timer);
  }, [autoSpin, balance, betAmount, handleSpin, isSpinning]);

  const statusText = useMemo(() => {
    if (errorMessage) return errorMessage;
    if (isSpinning) return "Waiting for secure backend result...";
    if (!lastResult) return "Server-authoritative RTP and near-miss simulation";
    return lastResult.message;
  }, [errorMessage, isSpinning, lastResult]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.15),transparent_22rem),linear-gradient(180deg,#101827,#050914)] text-white">
      <header className="sticky top-0 z-40 border-b border-gold-300/40 bg-[#101827]/95 shadow-[0_1px_28px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-8">
          <Link
            className="rounded-md border border-gold-200/60 bg-white/10 px-4 py-3 font-display text-sm uppercase text-gold-100 transition hover:bg-gold-300/15"
            href="/dashboard"
          >
            Back to Lobby
          </Link>
          <h1 className="hidden font-display text-3xl uppercase text-gold-100 text-gold-emboss sm:block">
            Neon Stakes Casino
          </h1>
          <p className="font-mono text-lg font-bold tracking-widest text-green-neon drop-shadow-[0_0_12px_rgba(34,197,94,0.7)] sm:text-3xl">
            {formatRupiah(balance)}
          </p>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[1fr_250px]">
        <section className="flex min-w-0 flex-col px-4 pb-36 pt-8 sm:px-8 lg:pb-32">
          <div className="mx-auto w-full max-w-4xl">
            <div className="relative overflow-hidden rounded-[1.5rem] border-[10px] border-gold-300/70 bg-[#070e1d] p-3 shadow-[0_0_42px_rgba(250,204,21,0.42),inset_0_0_36px_rgba(250,204,21,0.14)] sm:p-5">
              <div className="absolute inset-0 bg-carbon opacity-30" />
              <div className="relative grid grid-cols-5 gap-2 sm:gap-3">
                {grid.map((symbol, index) => (
                  <motion.div
                    animate={
                      isSpinning
                        ? { y: [0, -10, 10, 0], opacity: [0.65, 1, 0.75, 1] }
                        : { y: 0, opacity: 1 }
                    }
                    className="grid aspect-square place-items-center rounded-lg border border-white/10 bg-[linear-gradient(180deg,#182132,#0b1220)] text-4xl shadow-inner shadow-white/10 sm:text-6xl"
                    key={`${symbol}-${index}`}
                    transition={
                      isSpinning
                        ? {
                            delay: (index % 5) * 0.03,
                            duration: 0.38,
                            repeat: Infinity,
                          }
                        : { duration: 0.2 }
                    }
                  >
                    {symbol}
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {showWinOverlay && lastResult && (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 grid place-items-center bg-black/45 backdrop-blur-sm"
                    exit={{ opacity: 0, scale: 1.08 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="text-center">
                      <p className="font-display text-7xl uppercase text-gold-100 text-gold-emboss sm:text-8xl">
                        Win
                      </p>
                      <p className="font-mono text-xl text-green-neon">
                        +{formatRupiah(lastResult.payout)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center font-mono text-sm uppercase text-zinc-300">
              <div>
                <p>Total Bet</p>
                <strong className="text-white">{formatRupiah(betAmount)}</strong>
              </div>
              <div>
                <p>Lines</p>
                <strong className="text-white">20</strong>
              </div>
              <div>
                <p>Last Payout</p>
                <strong className="text-gold-100">
                  {formatRupiah(lastResult?.payout ?? 0)}
                </strong>
              </div>
            </div>

            <div
              className={`mt-5 rounded-lg border px-4 py-3 font-mono text-sm ${
                errorMessage
                  ? "border-red-400/50 bg-red-500/10 text-red-100"
                  : "border-purple-neon/30 bg-white/[0.06] text-zinc-200"
              }`}
            >
              <span className="mr-2 text-gold-300">SERVER LOG:</span>
              {statusText}
            </div>
          </div>
        </section>

        <RecentWinners />
      </div>

      <ControlPanel
        autoSpin={autoSpin}
        betAmount={betAmount}
        canSpin={canSpin}
        isSpinning={isSpinning}
        onBetChange={setBetAmount}
        onSpin={handleSpin}
        onToggleAuto={() => setAutoSpin((value) => !value)}
      />
    </main>
  );
}

function ControlPanel({
  autoSpin,
  betAmount,
  canSpin,
  isSpinning,
  onBetChange,
  onSpin,
  onToggleAuto,
}: {
  autoSpin: boolean;
  betAmount: number;
  canSpin: boolean;
  isSpinning: boolean;
  onBetChange: (amount: number) => void;
  onSpin: () => void;
  onToggleAuto: () => void;
}) {
  function adjustBet(delta: number) {
    onBetChange(Math.min(maxBet, Math.max(minBet, betAmount + delta)));
  }

  return (
    <section className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-300/40 bg-[#07101f]/95 px-4 py-4 shadow-[0_-10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-5xl items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center justify-center gap-3 sm:justify-start">
          <button className="rounded-full border border-gold-200/70 px-7 py-3 font-display text-sm uppercase text-gold-100">
            Max Bet
          </button>
          <button
            className="grid size-11 place-items-center rounded-full bg-gold-100 font-display text-2xl text-[#2d2100]"
            onClick={() => adjustBet(-10000)}
          >
            -
          </button>
          <div className="min-w-32 text-center">
            <p className="font-mono text-xs uppercase text-zinc-400">Bet Amount</p>
            <p className="font-mono text-sm text-white">{formatRupiah(betAmount)}</p>
          </div>
          <button
            className="grid size-11 place-items-center rounded-full bg-gold-100 font-display text-2xl text-[#2d2100]"
            onClick={() => adjustBet(10000)}
          >
            +
          </button>
        </div>

        <motion.button
          className="mx-auto grid size-28 place-items-center rounded-full border-[8px] border-gold-200 bg-[radial-gradient(circle,#fff7d7,#facc15_58%,#7c4a00)] font-display text-3xl uppercase text-[#392800] shadow-[0_0_30px_rgba(250,204,21,0.85),inset_0_0_22px_rgba(255,255,255,0.8)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!canSpin}
          onClick={onSpin}
          whileHover={canSpin ? { scale: 1.04 } : undefined}
          whileTap={canSpin ? { scale: 0.92 } : undefined}
        >
          {isSpinning ? "..." : "Spin"}
        </motion.button>

        <div className="flex items-center justify-center gap-4 sm:justify-end">
          <button
            className={`flex items-center gap-3 rounded-full border px-5 py-3 font-display text-sm uppercase ${
              autoSpin
                ? "border-green-neon bg-green-neon/15 text-green-neon"
                : "border-white/15 bg-white/10 text-zinc-200"
            }`}
            onClick={onToggleAuto}
          >
            Auto-Spin
            <span className="relative h-6 w-11 rounded-full bg-black/55">
              <span
                className={`absolute top-1 size-4 rounded-full bg-gold-100 transition ${
                  autoSpin ? "left-6" : "left-1"
                }`}
              />
            </span>
          </button>
          <div className="hidden font-mono text-xs uppercase text-zinc-400 sm:block">
            Info/Paytable
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentWinners() {
  return (
    <aside className="hidden border-l border-gold-300/25 bg-[#111827]/95 px-5 py-8 lg:block">
      <div className="rounded-lg border border-white/10 bg-white/[0.04] shadow-[0_0_24px_rgba(0,0,0,0.28)]">
        <h2 className="border-b border-white/10 px-5 py-4 text-center font-display text-xl uppercase text-gold-100">
          Recent Winners
        </h2>
        <div className="divide-y divide-white/10">
          {recentWinners.map((winner, index) => (
            <motion.div
              animate={{ opacity: [0.72, 1, 0.72] }}
              className="border-l-4 border-gold-300 px-5 py-4 font-mono text-sm leading-relaxed text-zinc-100"
              key={winner}
              transition={{ delay: index * 0.16, duration: 2.7, repeat: Infinity }}
            >
              {winner}
            </motion.div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function normalizeSpinResponse(payload: BackendSpinResponse) {
  const isWin = payload.is_win ?? payload.isWin ?? false;
  const payout = payload.payout_amount ?? payload.payoutAmount ?? 0;
  const updatedBalance =
    payload.updated_balance ?? payload.updatedBalance ?? payload.newBalance;
  const resultType = payload.result_type ?? payload.resultType ?? "unknown";

  if (!Array.isArray(payload.symbols) || payload.symbols.length === 0) {
    throw new Error("Backend response did not include symbols");
  }

  if (typeof updatedBalance !== "number") {
    throw new Error("Backend response did not include updated balance");
  }

  return {
    updatedBalance,
    spinResult: {
      isWin,
      payout,
      symbols: payload.symbols,
      resultType,
      message: `Backend result: ${resultType}, payout ${formatRupiah(payout)}.`,
    },
  };
}

function createResultGrid(symbols: string[]) {
  if (symbols.length >= 15) return symbols.slice(0, 15);
  return [...symbols, ...initialGrid].slice(0, 15);
}

function createAnimatedGrid(frame: number) {
  return Array.from(
    { length: 15 },
    (_, index) => reelCycle[(frame + index + (index % 5)) % reelCycle.length],
  );
}

function getActiveUserId() {
  const storedUser = localStorage.getItem("neon_stakes_user");
  if (!storedUser) return demoUserId;

  try {
    const parsed = JSON.parse(storedUser) as { userId?: string };
    return parsed.userId || demoUserId;
  } catch {
    return demoUserId;
  }
}

function formatRupiah(value: number) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
}
