"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AdminStats = {
  total_wagered: number;
  total_payout: number;
  house_profit: number;
  total_spins: number;
  profit_margin_bp: number;
};

const emptyStats: AdminStats = {
  total_wagered: 0,
  total_payout: 0,
  house_profit: 0,
  total_spins: 0,
  profit_margin_bp: 0,
};

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>(emptyStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost:8080/api/admin/stats", {
          headers: {
            "X-User-Role": getActiveRole(),
          },
        });
        const payload = (await response.json()) as Partial<AdminStats> & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to load admin stats");
        }

        setStats({
          total_wagered: payload.total_wagered ?? 0,
          total_payout: payload.total_payout ?? 0,
          house_profit: payload.house_profit ?? 0,
          total_spins: payload.total_spins ?? 0,
          profit_margin_bp: payload.profit_margin_bp ?? 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load stats");
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  const payoutRatio = useMemo(() => {
    if (stats.total_wagered <= 0) return 0;
    return Math.min(100, Math.max(0, (stats.total_payout / stats.total_wagered) * 100));
  }, [stats.total_payout, stats.total_wagered]);

  const profitRatio = useMemo(() => {
    if (stats.total_wagered <= 0) return 0;
    return Math.min(100, Math.max(0, (stats.house_profit / stats.total_wagered) * 100));
  }, [stats.house_profit, stats.total_wagered]);

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#111827]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              House Operations
            </p>
            <h1 className="text-xl font-semibold text-slate-950">
              Neon Stakes Control Room
            </h1>
          </div>
          <Link
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            href="/dashboard"
          >
            Player Lobby
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Financial Exposure
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Aggregated view of bet logs from the server-side wallet engine.
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            {isLoading ? "Syncing ledger..." : "Ledger snapshot live"}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="TOTAL WAGERED" value={formatRupiah(stats.total_wagered)} />
          <MetricCard label="TOTAL PAYOUT" value={formatRupiah(stats.total_payout)} />
          <MetricCard
            label="HOUSE PROFIT"
            tone={stats.house_profit >= 0 ? "positive" : "negative"}
            value={formatRupiah(stats.house_profit)}
          />
          <MetricCard label="TOTAL SPINS" value={formatInteger(stats.total_spins)} />
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  Wager Allocation
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Payout liability compared with retained house margin.
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Margin {(stats.profit_margin_bp / 100).toFixed(2)}%
              </p>
            </div>

            <div className="mt-8 space-y-5">
              <Bar
                label="Payout"
                value={payoutRatio}
                amount={formatRupiah(stats.total_payout)}
                color="bg-slate-500"
              />
              <Bar
                label="House Profit"
                value={profitRatio}
                amount={formatRupiah(stats.house_profit)}
                color={stats.house_profit >= 0 ? "bg-emerald-600" : "bg-red-500"}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Risk Note
            </p>
            <h3 className="mt-3 text-2xl font-semibold">House Perspective</h3>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              This dashboard shows why server-side logs matter: every spin is
              captured after the locked wallet transaction, making wager,
              payout, and profit calculations auditable from the backend.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-700"
      : tone === "negative"
        ? "text-red-700"
        : "text-slate-950";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className={`mt-4 text-3xl font-semibold tracking-tight ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}

function Bar({
  label,
  value,
  amount,
  color,
}: {
  label: string;
  value: number;
  amount: string;
  color: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{amount}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function formatRupiah(value: number) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function getActiveRole() {
  const storedUser = localStorage.getItem("neon_stakes_user");
  if (!storedUser) return "";

  try {
    const parsed = JSON.parse(storedUser) as { role?: string };
    return parsed.role ?? "";
  } catch {
    return "";
  }
}
