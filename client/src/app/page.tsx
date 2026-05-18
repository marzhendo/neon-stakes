"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

const jackpotItems = [
  "User Budi99 won Rp 50.000.000!",
  "User Joko** won Rp 12.500.000!",
  "User Ana88 just won Rp 20.000.000!",
  "User Rani77 won Rp 8.750.000!",
  "User Dewa12 won Rp 31.000.000!",
];

const providers = {
  payments: ["BCA", "MANDIRI", "DANA", "OVO", "LINKAJA", "GOPAY"],
  games: ["PRAGMATIC PLAY", "PG SOFT", "HABANERO", "SPADEGAMING"],
};

export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Registration is deliberately frictionless for the dark-pattern study,
    // but this client never creates balance, odds, or outcomes. The backend
    // will become the only source of truth in later phases.
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-casino-bg text-white">
      <JackpotMarquee />

      <nav className="relative z-20 border-b border-gold-300/35 bg-[#171b22]/95 shadow-[0_1px_22px_rgba(250,204,21,0.18)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1365px] items-center justify-between px-4 sm:px-8 lg:px-14">
          <div className="flex h-full items-center gap-1 sm:gap-3">
            {["Home", "Slots", "Live Casino", "Sports", "Promotions"].map(
              (item, index) => (
                <a
                  className={`hidden h-full items-center px-4 font-display text-sm uppercase text-zinc-300 transition hover:text-gold-100 sm:flex lg:px-6 ${
                    index === 0
                      ? "bg-gold-300/10 text-gold-100 shadow-[inset_0_-2px_0_#facc15]"
                      : ""
                  }`}
                  href="#registration"
                  key={item}
                >
                  {item}
                </a>
              ),
            )}
            <span className="font-display text-2xl uppercase tracking-wide text-gold-100 sm:hidden">
              Neon Stakes
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-md border border-white/25 bg-white/10 px-7 py-2 font-display text-sm uppercase text-white shadow-inner shadow-white/10 transition hover:border-gold-200 hover:text-gold-100 sm:block">
              Login
            </button>
            <a
              className="rounded-md bg-gold-cta px-7 py-2 font-display text-sm uppercase text-[#332300] shadow-[0_0_24px_rgba(250,204,21,0.55)] transition hover:scale-[1.02]"
              href="#registration"
            >
              Join Now
            </a>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[calc(100vh-146px)] border-b border-gold-300/30 bg-[radial-gradient(circle_at_18%_8%,rgba(255,236,185,0.26),transparent_12rem),radial-gradient(circle_at_72%_22%,rgba(168,85,247,0.16),transparent_18rem),linear-gradient(90deg,#05070a_0%,#111827_48%,#05070a_100%)]">
        <div className="absolute inset-0 bg-carbon opacity-65" />
        <div className="absolute -left-20 top-0 h-96 w-64 rotate-12 bg-white/20 blur-3xl" />
        <div className="absolute right-0 top-4 h-96 w-64 -rotate-12 bg-white/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr_0.86fr] lg:px-0 lg:py-16">
          <CasinoHost />

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p className="font-mono text-sm uppercase tracking-[0.34em] text-gold-100/80">
              New Member
            </p>
            <h1 className="mt-2 font-display text-[4.8rem] uppercase leading-[0.9] text-gold-100 text-gold-emboss sm:text-[7rem] lg:text-[8.4rem]">
              Bonus
            </h1>
            <p className="font-display text-[2.55rem] uppercase leading-none text-white sm:text-[3.5rem]">
              New Member
            </p>
            <p className="font-display text-[5.2rem] uppercase leading-[0.9] text-gold-100 text-gold-emboss sm:text-[7.2rem]">
              100%
            </p>
            <p className="mt-3 text-xl text-zinc-100 sm:text-2xl">
              Mainkan Game Slot Gacor Hari Ini!
            </p>

            <motion.div
              animate={{ boxShadow: "0 0 24px rgba(250,204,21,0.36)" }}
              className="mx-auto mt-6 flex w-fit items-center gap-4 rounded-full border border-gold-200/70 bg-black/30 px-9 py-3 font-mono text-xs uppercase tracking-[0.16em] text-gold-100 lg:mx-10"
              transition={{ duration: 1.4, repeat: Infinity, repeatType: "reverse" }}
            >
              <span className="grid size-7 place-items-center rounded-full border border-gold-200/70">
                ⏱
              </span>
              <span>
                Promo Ends In
                <strong className="ml-3 text-white">08:23</strong>
              </span>
            </motion.div>
          </motion.div>

          <RegistrationCard submitted={submitted} onSubmit={handleRegister} />
        </div>
      </section>

      <ProviderStrip />
      <button
        aria-label="Back to top"
        className="fixed bottom-4 right-4 z-30 grid size-12 place-items-center rounded-full bg-red-700 text-2xl text-white shadow-[0_0_22px_rgba(220,38,38,0.55)]"
      >
        ↑
      </button>
    </main>
  );
}

function JackpotMarquee() {
  const content = [...jackpotItems, ...jackpotItems];

  return (
    <div className="relative z-30 h-10 overflow-hidden bg-marquee shadow-[0_1px_18px_rgba(127,29,29,0.65)]">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        className="flex h-full w-max items-center gap-7 whitespace-nowrap font-medium text-zinc-100"
        transition={{ duration: 24, ease: "linear", repeat: Infinity }}
      >
        {content.map((item, index) => (
          <span className="text-sm sm:text-base" key={`${item}-${index}`}>
            {index % jackpotItems.length === 0 && (
              <strong className="mr-3 font-display uppercase text-gold-100">
                Recent Jackpots:
              </strong>
            )}
            {item}
            <span className="ml-7 text-gold-100">|</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function CasinoHost() {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="relative mx-auto hidden h-[420px] w-[330px] lg:block"
      initial={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="absolute bottom-5 left-3 h-28 w-72 rounded-full bg-gold-300/35 blur-3xl" />
      <div className="absolute bottom-5 left-12 h-28 w-52 rounded-[50%] bg-gold-200/30 blur-xl" />
      <div className="absolute bottom-0 left-10 flex h-44 w-56 items-end justify-center gap-2">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            className="w-8 rounded-t-sm border border-gold-100/50 bg-[linear-gradient(180deg,#ffe8a3,#c78912_55%,#5b3400)] shadow-[0_0_16px_rgba(250,204,21,0.35)]"
            key={index}
            style={{ height: `${48 + (index % 4) * 18}px` }}
          />
        ))}
      </div>
      <div className="absolute left-20 top-24 h-52 w-40 rounded-t-[4rem] bg-[linear-gradient(160deg,#fff2ce,#f0b95b_42%,#111827_43%,#05070a)] shadow-[0_0_30px_rgba(250,204,21,0.35)]" />
      <div className="absolute left-[112px] top-14 h-24 w-24 rounded-full border-4 border-[#3a1f16] bg-[linear-gradient(145deg,#ffd8b0,#b96d48)] shadow-[0_0_28px_rgba(250,204,21,0.4)]" />
      <div className="absolute left-[96px] top-4 h-24 w-32 rounded-[50%_50%_42%_42%] bg-[linear-gradient(145deg,#5b2c17,#1f120d)]" />
      <div className="absolute left-[118px] top-[88px] flex gap-8">
        <span className="size-2 rounded-full bg-[#2b160e]" />
        <span className="size-2 rounded-full bg-[#2b160e]" />
      </div>
      <div className="absolute left-[135px] top-[119px] h-2 w-8 rounded-full bg-[#743928]" />
      <div className="absolute left-[58px] top-[188px] flex -rotate-12 gap-1">
        {["A", "A", "A", "A"].map((card, index) => (
          <div
            className="grid h-24 w-16 place-items-center rounded-md border border-gold-100 bg-[#fff5d6] font-display text-3xl text-[#111827] shadow-xl"
            key={index}
            style={{ transform: `rotate(${index * 8 - 10}deg)` }}
          >
            {card}
          </div>
        ))}
      </div>
      {Array.from({ length: 7 }).map((_, index) => (
        <motion.span
          animate={{ y: [0, -12, 0], rotate: [0, 18, 0] }}
          className="absolute grid size-11 place-items-center rounded-full border-2 border-gold-100 bg-[radial-gradient(circle,#ffe8a3,#c78912)] text-[#5f3700] shadow-[0_0_18px_rgba(250,204,21,0.7)]"
          key={index}
          style={{
            left: `${18 + ((index * 43) % 260)}px`,
            top: `${84 + ((index * 53) % 220)}px`,
          }}
          transition={{ delay: index * 0.15, duration: 2.4, repeat: Infinity }}
        >
          $
        </motion.span>
      ))}
    </motion.div>
  );
}

function RegistrationCard({
  submitted,
  onSubmit,
}: {
  submitted: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const fields = [
    { label: "Username", placeholder: "Enter your ID", type: "text", icon: "♟" },
    { label: "Password", placeholder: "••••••••", type: "password", icon: "🔒" },
    {
      label: "Konfirmasi Password",
      placeholder: "••••••••",
      type: "password",
      icon: "🔒",
    },
    { label: "Nomor Telepon", placeholder: "Nomor Telepon", type: "tel", icon: "☎" },
  ];

  return (
    <motion.form
      animate={{ opacity: 1, x: 0 }}
      className="relative mx-auto w-full max-w-[322px] overflow-hidden rounded-lg border border-gold-200/70 bg-black/50 p-5 shadow-[0_0_30px_rgba(250,204,21,0.34),inset_0_0_36px_rgba(255,255,255,0.06)] backdrop-blur-xl"
      id="registration"
      initial={{ opacity: 0, x: 24 }}
      onSubmit={onSubmit}
      transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-28 rotate-12 bg-white/20 blur-sm" />
      <h2 className="relative mb-5 text-center font-mono text-sm font-bold uppercase tracking-[0.2em] text-gold-100">
        Secure Registration
      </h2>

      <div className="relative space-y-3">
        {fields.map((field) => (
          <label className="block" key={field.label}>
            <span className="font-mono text-[11px] font-semibold text-gold-100/90">
              {field.label}
            </span>
            <span className="mt-1 flex h-9 items-center border-b border-gold-200/80 bg-white/[0.07] px-3 text-sm shadow-inner shadow-black/40 focus-within:border-purple-neon focus-within:shadow-[0_8px_22px_rgba(168,85,247,0.26)]">
              <span className="mr-2 text-gold-100/90">{field.icon}</span>
              <input
                className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-400"
                placeholder={field.placeholder}
                required
                type={field.type}
              />
            </span>
          </label>
        ))}
      </div>

      <motion.button
        className="relative mt-5 w-full rounded-md bg-gold-cta px-4 py-4 font-display text-2xl uppercase text-[#3a2a00] shadow-[0_0_25px_rgba(250,204,21,0.7)]"
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Daftar Sekarang
      </motion.button>

      <div
        aria-live="polite"
        className={`mt-3 h-5 text-center font-mono text-xs uppercase tracking-widest text-green-neon transition-opacity ${
          submitted ? "opacity-100" : "opacity-0"
        }`}
      >
        Registration queued
      </div>
    </motion.form>
  );
}

function ProviderStrip() {
  return (
    <footer className="relative z-10 bg-[#20242b] px-5 py-4 text-center text-sm text-zinc-200 shadow-[0_-1px_18px_rgba(250,204,21,0.13)]">
      <div className="mx-auto grid max-w-[900px] gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div>
          <p className="mb-3 text-zinc-300">Payment providers</p>
          <div className="flex flex-wrap justify-center gap-3">
            {providers.payments.map((provider) => (
              <span
                className="rounded bg-white/10 px-2 py-1 font-display text-base text-gold-100"
                key={provider}
              >
                {provider}
              </span>
            ))}
          </div>
        </div>
        <span className="hidden h-10 w-px bg-white/20 sm:block" />
        <div>
          <p className="mb-3 text-zinc-300">Game providers</p>
          <div className="flex flex-wrap justify-center gap-4">
            {providers.games.map((provider) => (
              <span className="font-display text-base text-zinc-100" key={provider}>
                {provider}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-zinc-300">Licensed and Secured</p>
    </footer>
  );
}
