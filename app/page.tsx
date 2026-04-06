import Image from "next/image";

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */

const MEMBERS = [
  { name: "Alex Chen", role: "PRESIDENT", rank: "12th-Level Group Theorist", initials: "AC" },
  { name: "Priya Sharma", role: "VICE PRESIDENT", rank: "15th-Level Analyst", initials: "PS" },
  { name: "Jordan Kim", role: "EVENTS LEAD", rank: "9th-Level Combinatorialist", initials: "JK" },
];

const EVENTS = [
  {
    date: "APR 20",
    title: "Integration Bee",
    desc: "Speed through improper, definite, and path integrals. Top 3 scorers earn legendary status.",
    tag: "COMPETITION",
  },
  {
    date: "MAY 03",
    title: "Linear Algebra Workshop",
    desc: "Deep-dive into eigenvalues, SVD, and why your intuition about n-dimensional space is probably wrong.",
    tag: "WORKSHOP",
  },
  {
    date: "MAY 15",
    title: "Math Olympiad Prep Camp",
    desc: "Intensive problem-solving bootcamp. AMC, AIME, and Putnam strategies from past champions.",
    tag: "TRAINING",
  },
  {
    date: "MAY 22",
    title: "Guest Lecture: Topology in the Wild",
    desc: "Prof. Miriam Hayes on how topological data analysis is reshaping biology and ML.",
    tag: "LECTURE",
  },
  {
    date: "JUN 07",
    title: "End-of-Year Proof Slam",
    desc: "3-minute lightning proofs. Elegance judged by the audience. The most beautiful proof wins.",
    tag: "SHOWCASE",
  },
];

const GALLERY = [
  { label: "Integration Bee 2025", symbol: "∫", aspect: "aspect-[4/3]" },
  { label: "Pi Day Celebration", symbol: "π", aspect: "aspect-square" },
  { label: "Proof Slam 2025", symbol: "∑", aspect: "aspect-[3/4]" },
  { label: "Workshop Series", symbol: "Δ", aspect: "aspect-[4/3]" },
  { label: "Guest Lectures", symbol: "∇", aspect: "aspect-square" },
  { label: "Olympiad Night", symbol: "∞", aspect: "aspect-[3/4]" },
];

const MARQUEE_ITEMS = [
  "∑ Summation",
  "π Number Theory",
  "∫ Real Analysis",
  "√ Algebra",
  "Δ Combinatorics",
  "∞ Topology",
  "θ Trigonometry",
  "∇ Vector Calculus",
  "∂ Differential Eq.",
  "∀ Logic",
  "ℝ Real Numbers",
  "ℂ Complex Analysis",
];

/* ═══════════════════════════════════════════════
   SPACED TEXT — Righteous-style letter spacing
═══════════════════════════════════════════════ */

function SpacedText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((ch, i) => (
        <span key={i} style={ch === " " ? { width: "0.5em", display: "inline-block" } : { letterSpacing: "0.28em" }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */

export default function Home() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="relative" style={{ background: "#000" }}>

      {/* ──────── GLOBAL GRADIENT OVERLAY (screenshot match) ──────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, #000000 0%, #000000 30%, #000510 50%, #000c2d 75%, #001060 100%)",
        }}
      />

      {/* ──────── NAV ──────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20 px-8 md:px-16">
        {/* Backdrop */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        />
        {/* Left: Logo */}
        <a href="#" className="flex items-center gap-3">
          <div className="w-8 h-8 relative shrink-0">
            <Image
              src="/logo.svg"
              alt="MathSoc"
              fill
              style={{ objectFit: "contain", filter: "invert(1)" }}
            />
          </div>
          <span
            className="text-white font-medium hidden sm:block"
            style={{ fontSize: "0.72rem", letterSpacing: "0.35em", textTransform: "uppercase" }}
          >
            <SpacedText text="MathSoc" />
          </span>
        </a>

        {/* Center: Location tag (like Righteous "ATLANTA + ST. LOUIS") */}
        <span
          className="absolute left-1/2 -translate-x-1/2 hidden lg:block"
          style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}
        >
          Mathematics Society
        </span>

        {/* Right: Menu */}
        <div className="flex items-center gap-8">
          {["About", "Members", "Events", "Gallery"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="hidden md:block transition-colors duration-200 hover:text-white"
              style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}
            >
              {l}
            </a>
          ))}
          <a
            href="#about"
            className="text-white transition-opacity hover:opacity-70"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Menu
          </a>
        </div>
      </nav>

      {/* ──────── HERO ──────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 overflow-hidden">
        {/* Year badge (like Righteous "2026" floating) */}
        <div
          className="absolute top-28 left-8 md:left-16"
          style={{ fontSize: "0.6rem", letterSpacing: "0.35em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}
        >
          2026
        </div>

        {/* Giant title */}
        <h1
          className="text-center font-bold uppercase select-none"
          style={{
            fontSize: "clamp(4rem, 16vw, 14rem)",
            letterSpacing: "0.22em",
            lineHeight: 0.9,
            color: "rgba(255,255,255,0.95)",
          }}
        >
          <SpacedText text="Math" />
          <br className="md:hidden" />
          <SpacedText text="Soc" />
        </h1>

        {/* Subtitle image-grid area (mimicking Righteous rotating image stack) */}
        <div className="mt-12 md:mt-16 flex gap-3 md:gap-4">
          {["∫", "∑", "π", "∞"].map((sym, i) => (
            <div
              key={i}
              className="relative overflow-hidden"
              style={{
                width: "clamp(80px, 18vw, 200px)",
                height: "clamp(100px, 22vw, 260px)",
                background: `linear-gradient(${135 + i * 25}deg, #000510 0%, #001050 50%, #0018aa ${60 + i * 10}%)`,
                borderRadius: "4px",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span
                className="absolute inset-0 flex items-center justify-center font-light select-none"
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 5rem)",
                  color: "rgba(255,255,255,0.06)",
                }}
              >
                {sym}
              </span>
            </div>
          ))}
        </div>

        {/* Scroll line */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3" style={{ opacity: 0.2 }}>
          <span style={{ fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: "#fff" }} />
        </div>
      </section>

      {/* ──────── MANIFESTO (like Righteous "No NPCs..." spaced-out section) ──────── */}
      <section id="about" className="relative z-10 px-8 md:px-16 py-32 md:py-48">
        <div className="max-w-6xl mx-auto">
          {/* Giant spaced statement */}
          <h2
            className="font-medium leading-snug"
            style={{
              fontSize: "clamp(1.1rem, 2.8vw, 2rem)",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.6)",
              textTransform: "uppercase",
              lineHeight: 2,
            }}
          >
            <SpacedText text="No spectators. Just mathematicians rolling initiative and making bold moves for elegant proofs and beautiful problems." />
          </h2>
        </div>
      </section>

      {/* ──────── ABOUT + MEMBERS (Righteous "Leadership" section) ──────── */}
      <section id="members" className="relative z-10 px-8 md:px-16 py-24 md:py-36" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-6xl mx-auto">
          {/* "Leadership" spaced header (exactly like Righteous) */}
          <div className="mb-6">
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.35em",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
              }}
            >
              <SpacedText text="Leadership" />
            </span>
          </div>

          {/* Large ghost text heading */}
          <h2
            className="font-bold uppercase leading-none mb-24"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.04)",
            }}
          >
            <SpacedText text="The Crew" />
          </h2>

          {/* Member cards — horizontal layout like Righteous (3 members side by side) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {MEMBERS.map((m) => (
              <div key={m.name} className="group">
                {/* Avatar placeholder */}
                <div
                  className="w-full aspect-[3/4] mb-8 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, #000510 0%, #000d30 100%)",
                    borderRadius: "2px",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  {/* Big initial watermark */}
                  <span
                    className="absolute inset-0 flex items-center justify-center font-bold select-none"
                    style={{
                      fontSize: "clamp(6rem, 14vw, 12rem)",
                      color: "rgba(255,255,255,0.03)",
                      lineHeight: 1,
                    }}
                  >
                    {m.initials}
                  </span>
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "radial-gradient(ellipse at bottom center, rgba(0,48,204,0.12) 0%, transparent 70%)",
                    }}
                  />
                </div>

                {/* Info */}
                <p className="font-semibold text-white mb-1" style={{ fontSize: "1.15rem", letterSpacing: "-0.01em" }}>
                  {m.name}
                </p>
                <p
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.25em",
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    marginBottom: "0.4rem",
                  }}
                >
                  {m.role}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  {m.rank}
                </p>
              </div>
            ))}
          </div>

          {/* About blurb (like Righteous: "We've done time inside big agencies...") */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <p
              className="font-normal leading-relaxed"
              style={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem", lineHeight: 1.9 }}
            >
              MathSoc is a community of students who believe mathematics is more than
              a subject — it&apos;s a way of seeing the world. We host competitions,
              workshops, guest lectures, and social events that turn abstract theory
              into lived experience.
            </p>
            <p
              className="font-normal leading-relaxed"
              style={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem", lineHeight: 1.9 }}
            >
              Whether you&apos;re chasing a Putnam fellowship or just love the elegant
              terror of a well-posed problem, there&apos;s a proof here with your name on it.
              The only way we know to do it is to push past the obvious.
            </p>
          </div>

          {/* Focus areas row (like Righteous "PRODUCT · MARKETING · KICKFLIPS") */}
          <div className="mt-20 flex flex-wrap gap-x-16 gap-y-4">
            {["PURE MATH", "APPLIED MATH", "OLYMPIAD TRAINING"].map((s) => (
              <span
                key={s}
                className="font-semibold"
                style={{
                  fontSize: "clamp(1.6rem, 4vw, 3rem)",
                  letterSpacing: "-0.02em",
                  color: "rgba(255,255,255,0.07)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── MARQUEE (like Righteous client logo scroll) ──────── */}
      <div
        className="relative z-10 overflow-hidden py-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="marquee-track flex whitespace-nowrap items-center">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center shrink-0"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.18)",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {item}
              <span className="mx-8" style={{ color: "rgba(255,255,255,0.08)" }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ──────── EVENTS ──────── */}
      <section id="events" className="relative z-10 px-8 md:px-16 py-28 md:py-40">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.35em",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
              }}
            >
              <SpacedText text="Upcoming" />
            </span>
          </div>
          <h2
            className="font-bold uppercase leading-none mb-20"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.04)",
            }}
          >
            <SpacedText text="Events" />
          </h2>

          {/* Event list */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            {EVENTS.map((ev) => (
              <div
                key={ev.title}
                className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 py-7 cursor-pointer"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                {/* Date */}
                <div className="shrink-0 w-20">
                  <p className="font-bold text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {ev.date}
                  </p>
                </div>

                {/* Title + tag */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3
                      className="font-semibold group-hover:text-white transition-colors"
                      style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.7)", letterSpacing: "-0.01em" }}
                    >
                      {ev.title}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.55rem",
                        letterSpacing: "0.15em",
                        color: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        padding: "2px 8px",
                        textTransform: "uppercase",
                      }}
                    >
                      {ev.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>
                    {ev.desc}
                  </p>
                </div>

                {/* Arrow */}
                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M8 3l5 5-5 5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── GALLERY ──────── */}
      <section id="gallery" className="relative z-10 px-8 md:px-16 py-28 md:py-40" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.35em",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
              }}
            >
              <SpacedText text="Captured" />
            </span>
          </div>
          <h2
            className="font-bold uppercase leading-none mb-20"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.04)",
            }}
          >
            <SpacedText text="Gallery" />
          </h2>

          {/* Masonry-like grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {GALLERY.map((item, i) => (
              <div
                key={i}
                className={`${item.aspect} relative overflow-hidden group cursor-pointer break-inside-avoid`}
                style={{
                  background: `linear-gradient(${180 + i * 30}deg, #000510 0%, #000d30 60%, #001050 100%)`,
                  borderRadius: "2px",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {/* Symbol watermark */}
                <span
                  className="absolute inset-0 flex items-center justify-center select-none font-light"
                  style={{ fontSize: "clamp(4rem, 10vw, 8rem)", color: "rgba(255,255,255,0.025)" }}
                >
                  {item.symbol}
                </span>
                {/* Hover label */}
                <div
                  className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 60%)" }}
                >
                  <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── BIG STATEMENT (like Righteous "If you want to vibe..." section) ──────── */}
      <section className="relative z-10 px-8 md:px-16 py-32 md:py-48" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2
            className="font-medium leading-snug mb-12"
            style={{
              fontSize: "clamp(1rem, 2.6vw, 1.8rem)",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              lineHeight: 2.1,
            }}
          >
            <SpacedText text="If you want to speak the language of the universe, join the ones who already do." />
          </h2>

          <p
            className="max-w-xl mx-auto mb-14"
            style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.95rem", lineHeight: 1.9 }}
          >
            We grew up obsessing over unsolved problems, filling whiteboards past midnight,
            and arguing about whether 0.999... really equals 1. Today we channel that same
            energy into building a community that thinks in theorems and ships proofs.
            Membership is open to all students. No GPA cutoff. No gatekeeping.
          </p>

          <a
            href="mailto:mathsoc@university.edu"
            className="inline-block font-semibold text-white transition-opacity hover:opacity-60"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              borderBottom: "1px solid rgba(255,255,255,0.3)",
              paddingBottom: "4px",
            }}
          >
            Get in Touch →
          </a>
        </div>
      </section>

      {/* ──────── FOOTER (like Righteous footer) ──────── */}
      <footer className="relative z-10 px-8 md:px-16 pt-20 pb-14" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-6xl mx-auto">
          {/* Top */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-16 mb-20">
            {/* Logo + tagline */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 relative">
                  <Image
                    src="/logo.svg"
                    alt="MathSoc"
                    fill
                    style={{ objectFit: "contain", filter: "invert(1)" }}
                  />
                </div>
                <span
                  className="font-medium"
                  style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}
                >
                  MathSoc
                </span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.82rem", maxWidth: 260, lineHeight: 1.7 }}>
                Where curiosity becomes proof and problems become art.
              </p>
            </div>

            {/* Link columns */}
            <div className="flex gap-20">
              <div>
                <p
                  className="mb-4 font-semibold"
                  style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase" }}
                >
                  Site Stuff
                </p>
                <ul className="space-y-2.5">
                  {["About", "Members", "Events", "Gallery"].map((l) => (
                    <li key={l}>
                      <a
                        href={`#${l.toLowerCase()}`}
                        className="transition-colors hover:text-white"
                        style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p
                  className="mb-4 font-semibold"
                  style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase" }}
                >
                  Social
                </p>
                <ul className="space-y-2.5">
                  {["Instagram", "Discord", "LinkedIn", "GitHub"].map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="transition-colors hover:text-white"
                        style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>
              © 2026 MathSoc. All rights reserved.
            </p>
            <p
              style={{
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.08)",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              ∑(n=1→∞) 1/n² = π²/6
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
