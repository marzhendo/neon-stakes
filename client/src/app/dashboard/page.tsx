"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const startingBalance = 10500000;
const anchoredDeposit = 500000;

const navItems = [
  ["NS", "NEON STAKES"],
  ["SL", "Slots"],
  ["TB", "Table Games"],
  ["CR", "Crash Games"],
  ["SB", "Sportsbook"],
  ["VIP", "VIP Club"],
  ["SP", "Support"],
  ["PR", "Promotions"],
  ["LG", "VIP Lounge"],
];

const categories = ["Hot Games", "Slots", "Crash", "Live", "Table Games"];

const games = [
  {
    title: "Gates of Olympus",
    group: "Hot Simulations",
    badge: "HOT",
    gradient: "from-slate-950 via-purple-950 to-cyan-900",
    symbol: "ZEUS",
  },
  {
    title: "Sweet Bonanza",
    group: "Live Casino",
    badge: "RTP 98%",
    gradient: "from-purple-950 via-fuchsia-900 to-indigo-950",
    symbol: "CANDY",
  },
  {
    title: "Spaceman",
    group: "New Games",
    badge: "HOT",
    gradient: "from-slate-950 via-teal-950 to-emerald-900",
    symbol: "RUSH",
  },
  {
    title: "Neon Blackjack",
    group: "New Games",
    badge: "LIVE",
    gradient: "from-zinc-950 via-red-950 to-slate-900",
    symbol: "21",
  },
  {
    title: "Live Casino",
    group: "Hot Simulations",
    badge: "HOT",
    gradient: "from-rose-950 via-stone-900 to-amber-950",
    symbol: "LIVE",
  },
  {
    title: "New Casino",
    group: "Live Casino",
    badge: "HOT",
    gradient: "from-cyan-950 via-slate-900 to-purple-950",
    symbol: "VIP",
  },
  {
    title: "Wine Bonanza",
    group: "New Games",
    badge: "HOT",
    gradient: "from-sky-800 via-pink-700 to-yellow-500",
    symbol: "777",
  },
  {
    title: "King Blackjack",
    group: "New Games",
    badge: "RTP 97%",
    gradient: "from-emerald-950 via-slate-900 to-yellow-900",
    symbol: "KING",
  },
  {
    title: "Vivo Qian",
    group: "Hot Simulations",
    badge: "HOT",
    gradient: "from-fuchsia-950 via-orange-700 to-yellow-500",
    symbol: "100%",
  },
];

const liveWins = [
  "User Budi just won Rp 2.000.000 on Sweet Bonanza!",
  "User Cici just won Rp 150.000 on Spaceman!",
  "User Asep_Gacor just won Rp 2.000.000 on Sweet Bonanza!",
  "User Rani77 just won Rp 900.000 on Neon Blackjack!",
  "User Dimas just won Rp 350.000 on Wine Bonanza!",
  "User Lila88 just won Rp 1.200.000 on Gates of Olympus!",
];

const depositAmounts = [500000, 250000, 100000, 50000];

const paymentGroups = [
  { title: "E-Wallet", items: ["QRIS", "DANA", "OVO", "GOPAY"] },
  { title: "Virtual Account", items: ["BCA VA", "MANDIRI VA"] },
  { title: "Bank Transfer", items: ["BCA", "MANDIRI"] },
];

export default function DashboardPage() {
  const [balance, setBalance] = useState(startingBalance);
  const [depositOpen, setDepositOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(anchoredDeposit);

  const marqueeText = useMemo(
    () =>
      [
        "User Asep_Gacor just won Rp 2.000.000 on Sweet Bonanza!",
        "User Budi99 won Rp 50.000.000!",
        "User Cici deposited Rp 50.000 via QRIS",
      ].join("   |   "),
    [],
  );

  function handleDeposit() {
    setBalance((current) => current + selectedAmount);
    setDepositOpen(false);
  }

  return (
    <main className="min-h-screen bg-casino-bg text-white">
      <Header balance={balance} onDeposit={() => setDepositOpen(true)} />

      <div className="flex">
        <Sidebar />

        <section className="min-w-0 flex-1 border-x border-gold-300/20 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.18),transparent_22rem),linear-gradient(180deg,#111827,#08111f)] pb-10 lg:ml-[250px] lg:mr-[260px]">
          <div className="sticky top-20 z-10 overflow-hidden border-b border-white/10 bg-white/10 py-2 backdrop-blur-md">
            <motion.p
              animate={{ x: ["100%", "-100%"] }}
              className="whitespace-nowrap font-mono text-sm text-zinc-100"
              transition={{ duration: 22, ease: "linear", repeat: Infinity }}
            >
              <span className="mr-4 text-gold-300">WIN FEED</span>
              {marqueeText}
            </motion.p>
          </div>

          <div className="mx-auto max-w-[980px] px-5 py-7 sm:px-8">
            <PromoBanner />
            <CategoryPills />
            <GameGrid />
          </div>
        </section>

        <LiveRtpFeed />
      </div>

      <AnimatePresence>
        {depositOpen && (
          <TopUpModal
            onClose={() => setDepositOpen(false)}
            onDeposit={handleDeposit}
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function Header({
  balance,
  onDeposit,
}: {
  balance: number;
  onDeposit: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 h-20 border-b border-gold-300/30 bg-[#111827]/95 shadow-[0_1px_28px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-full border border-gold-200/60 bg-gradient-to-br from-cyan-500/30 to-purple-neon/30 font-display text-lg text-gold-100 shadow-[0_0_18px_rgba(250,204,21,0.22)]">
            AS
          </div>
          <div className="hidden sm:block">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-300">
              User Profile
            </p>
            <p className="font-display text-lg uppercase text-white">Asep_Gacor</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          <p className="font-mono text-xl font-bold tracking-widest text-green-neon drop-shadow-[0_0_12px_rgba(34,197,94,0.7)] sm:text-3xl">
            {formatRupiah(balance)}
          </p>
          <motion.button
            className="rounded-md bg-[linear-gradient(90deg,#ef4444,#e11d48)] px-6 py-3 font-display text-sm uppercase tracking-wide text-white shadow-[0_0_24px_rgba(244,63,94,0.65)] sm:px-10"
            onClick={onDeposit}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Deposit
          </motion.button>
          <button className="hidden rounded-md bg-white/20 px-8 py-3 font-display text-sm uppercase tracking-wide text-white sm:block">
            Withdraw
          </button>
        </div>
      </div>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-20 z-30 hidden w-[250px] border-r border-gold-300/20 bg-[#182132]/95 px-6 py-6 shadow-[8px_0_32px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:block">
      <h1 className="font-display text-3xl uppercase text-gold-300 text-gold-emboss">
        Neon Stakes
      </h1>

      <div className="mt-7 flex items-center gap-3">
        <div className="grid size-14 place-items-center rounded-full border-2 border-purple-neon bg-cyan-500/20 font-display text-gold-100">
          VIP
        </div>
        <div>
          <p className="font-mono text-sm uppercase text-white">VIP Diamond</p>
          <p className="text-xs text-zinc-300">Next Level: 84%</p>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.slice(1).map(([icon, label], index) => (
          <a
            className={`flex items-center gap-4 rounded-md px-2 py-3 font-mono text-sm text-zinc-100 transition hover:bg-white/10 hover:text-gold-100 ${
              index === 0 ? "text-gold-100" : ""
            }`}
            href="#games"
            key={label}
          >
            <span className="grid size-6 place-items-center rounded border border-white/20 text-[10px]">
              {icon}
            </span>
            {label}
          </a>
        ))}
      </nav>

      <button className="absolute bottom-8 left-6 right-6 rounded bg-gold-cta px-4 py-3 font-display text-sm uppercase text-[#2d2100] shadow-[0_0_20px_rgba(250,204,21,0.42)]">
        Claim Daily Bonus
      </button>
    </aside>
  );
}

function PromoBanner() {
  return (
    <section className="relative overflow-hidden rounded-lg bg-[radial-gradient(circle_at_78%_40%,rgba(250,204,21,0.72),transparent_9rem),linear-gradient(110deg,#4c1d95,#2e1065_46%,#111827)] px-6 py-8 shadow-[0_0_34px_rgba(168,85,247,0.18)]">
      <div className="absolute -right-10 -top-16 size-56 rounded-full border-[18px] border-gold-300/70 bg-gold-200/20 shadow-[0_0_40px_rgba(250,204,21,0.45)]" />
      <div className="absolute right-24 top-5 size-16 rotate-12 rounded bg-gold-300/70 blur-sm" />
      <p className="relative font-display text-4xl uppercase text-gold-300 sm:text-5xl">
        100% Welcome Bonus!
      </p>
      <button className="relative mt-5 rounded-md bg-gold-cta px-7 py-3 font-display text-sm uppercase text-[#332300] shadow-[0_0_18px_rgba(250,204,21,0.42)]">
        Claim Now
      </button>
    </section>
  );
}

function CategoryPills() {
  return (
    <div className="mt-7 flex gap-3 overflow-x-auto pb-2">
      {categories.map((category, index) => (
        <button
          className={`shrink-0 rounded-full border px-6 py-3 font-mono text-sm text-zinc-100 ${
            index === 0
              ? "border-gold-300 bg-gold-300/10 text-gold-100 shadow-[0_0_18px_rgba(250,204,21,0.26)]"
              : "border-white/15 bg-white/10"
          }`}
          key={category}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

function GameGrid() {
  return (
    <section className="mt-6" id="games">
      <div className="grid gap-6 md:grid-cols-3">
        {["Hot Simulations", "Live Casino", "New Games"].map((heading) => (
          <h2
            className="font-display text-2xl uppercase text-zinc-200 md:first:col-span-1"
            key={heading}
          >
            {heading}
          </h2>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
        {games.map((game, index) => (
          <Link href="/game/slots" key={game.title}>
            <motion.article
              className={`group relative aspect-[0.78] overflow-hidden rounded-lg bg-gradient-to-br ${game.gradient} shadow-[0_10px_28px_rgba(0,0,0,0.35)]`}
              initial={{ opacity: 0, y: 18 }}
              transition={{ delay: index * 0.04 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="absolute inset-0 bg-carbon opacity-35" />
              <span
                className={`absolute right-2 top-2 rounded px-2 py-1 font-mono text-[10px] font-bold uppercase ${
                  game.badge.includes("RTP")
                    ? "bg-purple-neon text-white"
                    : "bg-gold-300 text-[#332300]"
                }`}
              >
                {game.badge}
              </span>
              <div className="absolute inset-x-3 top-10 grid h-24 place-items-center rounded-lg border border-white/10 bg-white/10 font-display text-4xl text-gold-100 shadow-inner shadow-white/10">
                {game.symbol}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 pt-16">
                <p className="font-display text-xl uppercase leading-none text-white">
                  {game.title}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase text-gold-100/80">
                  {game.group}
                </p>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LiveRtpFeed() {
  return (
    <aside className="fixed bottom-0 right-0 top-20 z-30 hidden w-[260px] border-l border-gold-300/20 bg-[#182132]/95 px-5 py-7 backdrop-blur-xl lg:block">
      <h2 className="font-display text-3xl uppercase text-zinc-100">Live RTP</h2>
      <div className="mt-4 divide-y divide-white/10">
        {liveWins.map((win, index) => (
          <motion.div
            animate={{ opacity: [0.72, 1, 0.72] }}
            className="py-4 font-mono text-sm leading-relaxed text-zinc-100"
            key={win}
            transition={{ delay: index * 0.18, duration: 2.8, repeat: Infinity }}
          >
            <span className="mr-2 text-gold-300">ALERT</span>
            {win}
          </motion.div>
        ))}
      </div>
    </aside>
  );
}

function TopUpModal({
  onClose,
  onDeposit,
  selectedAmount,
  setSelectedAmount,
}: {
  onClose: () => void;
  onDeposit: () => void;
  selectedAmount: number;
  setSelectedAmount: (amount: number) => void;
}) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-md"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-gold-200/70 bg-[linear-gradient(145deg,rgba(25,31,47,0.98),rgba(5,8,13,0.98))] p-5 shadow-[0_0_44px_rgba(250,204,21,0.34)] sm:p-7"
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Close deposit modal"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-white/20 bg-white/10 font-mono text-sm text-white"
          onClick={onClose}
        >
          X
        </button>

        <div className="mb-5 rounded-md border border-gold-200/70 bg-gold-300/5 px-4 py-3 text-center font-mono text-sm text-gold-100 shadow-[0_0_18px_rgba(250,204,21,0.18)]">
          Deposit within 10 minutes to claim your daily cashback!
        </div>

        <h2 className="text-center font-display text-5xl uppercase text-gold-100 text-gold-emboss">
          Isi Saldo
        </h2>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {depositAmounts.map((amount) => {
            const isAnchored = amount === anchoredDeposit;
            const isSelected = amount === selectedAmount;

            return (
              <button
                className={`relative rounded-lg border px-5 py-6 font-display text-2xl uppercase transition ${
                  isSelected
                    ? "border-gold-200 text-gold-100 shadow-[0_0_28px_rgba(250,204,21,0.62),inset_0_0_30px_rgba(250,204,21,0.12)]"
                    : "border-gold-200/50 text-zinc-100 hover:border-gold-200"
                }`}
                key={amount}
                onClick={() => setSelectedAmount(amount)}
              >
                {isAnchored && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-cta px-5 py-1 font-mono text-xs font-bold text-[#2d2100] shadow-[0_0_18px_rgba(250,204,21,0.8)]">
                    HOT / BONUS +20%
                  </span>
                )}
                {formatRupiah(amount)}
              </button>
            );
          })}
        </div>

        <label className="mt-6 block">
          <span className="font-mono text-sm uppercase text-gold-100/80">
            Atau nominal lain
          </span>
          <span className="mt-2 flex h-12 items-center rounded-md border border-gold-300/70 bg-black/35 px-4 font-mono text-sm shadow-[0_0_16px_rgba(250,204,21,0.18)]">
            Rp
            <input
              className="ml-3 h-full w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
              placeholder="0"
              type="text"
            />
          </span>
        </label>

        <div className="mt-7">
          <p className="font-mono text-sm uppercase text-gold-100/80">
            Metode Pembayaran
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            {paymentGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 flex items-center justify-between font-mono text-sm uppercase text-zinc-200">
                  {group.title}
                  <span className="text-xs normal-case text-green-neon">Online</span>
                </p>
                <div className="grid gap-3">
                  {group.items.map((item) => (
                    <button
                      className="rounded-md border border-gold-200/60 bg-white px-3 py-3 font-display text-lg uppercase text-[#1f2937] shadow-inner shadow-gold-300/30"
                      key={item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.button
          className="mt-8 w-full rounded-lg bg-gold-cta px-5 py-4 font-display text-3xl uppercase tracking-wide text-[#201600] shadow-[0_0_28px_rgba(250,204,21,0.55)]"
          onClick={onDeposit}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          Proses Deposit -&gt;
        </motion.button>
      </motion.section>
    </motion.div>
  );
}

function formatRupiah(value: number) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
}
