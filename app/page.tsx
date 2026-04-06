import Image from "next/image";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   DATA
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Members", href: "#members" },
  { label: "Events", href: "#events" },
  { label: "Gallery", href: "#gallery" },
];

const TICKER_ITEMS = [
  "âˆ‘ SUMMATION",
  "Ï€ NUMBER THEORY",
  "âˆ« REAL ANALYSIS",
  "âˆš ALGEBRA",
  "Î” COMBINATORICS",
  "âˆž TOPOLOGY",
  "Î¸ TRIGONOMETRY",
  "âˆ‡ VECTOR CALCULUS",
  "âˆ‚ DIFFERENTIAL EQUATIONS",
  "â‰  ABSTRACT ALGEBRA",
  "âˆ€ LOGIC",
  "âˆƒ SET THEORY",
  "â„ REAL NUMBERS",
  "â„‚ COMPLEX ANALYSIS",
];

const FLOATING_SYMBOLS = [
  { symbol: "âˆ‘", top: "12%", left: "8%", size: "5rem", cls: "float-a", delay: "0s" },
  { symbol: "Ï€", top: "22%", left: "88%", size: "4.5rem", cls: "float-b", delay: "1.2s" },
  { symbol: "âˆ«", top: "60%", left: "6%", size: "5.5rem", cls: "float-c", delay: "0.4s" },
  { symbol: "âˆš", top: "70%", left: "91%", size: "4rem", cls: "float-a", delay: "2s" },
  { symbol: "Î”", top: "38%", left: "4%", size: "3.5rem", cls: "float-b", delay: "0.8s" },
  { symbol: "âˆž", top: "48%", left: "92%", size: "3.5rem", cls: "float-c", delay: "1.6s" },
  { symbol: "Î¸", top: "82%", left: "14%", size: "3rem", cls: "float-a", delay: "2.4s" },
  { symbol: "âˆ‡", top: "78%", left: "85%", size: "3rem", cls: "float-b", delay: "0.3s" },
  { symbol: "âˆ‚", top: "16%", left: "76%", size: "3rem", cls: "float-c", delay: "1.8s" },
  { symbol: "â‰ˆ", top: "54%", left: "84%", size: "2.8rem", cls: "float-a", delay: "3s" },
];

const MEMBERS = [
  {
    name: "Alex Chen",
    role: "PRESIDENT",
    rank: "12th-Level Group Theorist",
    initials: "AC",
    hue: "#1e3a8a",
  },
  {
    name: "Priya Sharma",
    role: "VICE PRESIDENT",
    rank: "15th-Level Analyst",
    initials: "PS",
    hue: "#1e1b4b",
  },
  {
    name: "Jordan Kim",
    role: "EVENTS LEAD",
    rank: "9th-Level Combinatorialist",
    initials: "JK",
    hue: "#0c1445",
  },
  {
    name: "Sam Rivera",
    role: "DESIGN DIRECTOR",
    rank: "11th-Level Topologist",
    initials: "SR",
    hue: "#172554",
  },
  {
    name: "Taylor Wong",
    role: "SECRETARY",
    rank: "10th-Level Number Theorist",
    initials: "TW",
    hue: "#1e3a8a",
  },
  {
    name: "Morgan Lee",
    role: "TREASURER",
    rank: "8th-Level Statistician",
    initials: "ML",
    hue: "#1e1b4b",
  },
];

const EVENTS = [
  {
    date: "APR 20",
    year: "2026",
    title: "Integration Bee",
    description:
      "Speed through improper, definite, and path integrals. Top 3 scorers earn legendary status.",
    tag: "COMPETITION",
  },
  {
    date: "MAY 03",
    year: "2026",
    title: "Linear Algebra Workshop",
    description:
      "Deep-dive into eigenvalues, SVD, and why your intuition about n-dimensional space is probably wrong.",
    tag: "WORKSHOP",
  },
  {
    date: "MAY 15",
    year: "2026",
    title: "Math Olympiad Prep Camp",
    description:
      "Intensive problem-solving bootcamp. AMC, AIME, and Putnam strategies from past champions.",
    tag: "TRAINING",
  },
  {
    date: "MAY 22",
    year: "2026",
    title: "Guest Lecture: Topology in the Wild",
    description:
      "Prof. Miriam Hayes on how topological data analysis is reshaping biology and machine learning.",
    tag: "LECTURE",
  },
  {
    date: "JUN 07",
    year: "2026",
    title: "End-of-Year Proof Slam",
    description:
      "3-minute lightning proofs. Elegance judged by the audience. The most beautiful proof wins.",
    tag: "SHOWCASE",
  },
];

const GALLERY_CELLS = [
  { span: "col-span-2 row-span-2", label: "Integration Bee 2025", shade: "#0d1a45" },
  { span: "col-span-1 row-span-1", label: "Workshop", shade: "#091233" },
  { span: "col-span-1 row-span-1", label: "Pi Day", shade: "#0c1840" },
  { span: "col-span-1 row-span-2", label: "Lecture Series", shade: "#0a1535" },
  { span: "col-span-2 row-span-1", label: "Proof Slam 2025", shade: "#0e1d50" },
  { span: "col-span-1 row-span-1", label: "Study Session", shade: "#081130" },
  { span: "col-span-1 row-span-1", label: "Olympiad Night", shade: "#0f2060" },
];

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SUB-COMPONENTS (kept inline â€” no real images needed yet)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-9 h-9 relative">
        <Image src="/logo.svg" alt="MathSoc logo" fill style={{ objectFit: "contain", filter: "invert(1)" }} />
      </div>
      <span className="text-white font-bold tracking-[0.18em] text-sm uppercase">
        MathSoc
      </span>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{ border: "1px solid rgba(34,80,255,0.4)", color: "#5578ff" }}
      className="text-[10px] tracking-[0.15em] uppercase font-semibold px-2 py-0.5 rounded-sm"
    >
      {label}
    </span>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   PAGE
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export default function Home() {
  const tickerFull = [...TICKER_ITEMS, ...TICKER_ITEMS]; // doubled for seamless loop

  return (
    <div style={{ background: "#040817", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          NAV
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <nav
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          background: "rgba(4,8,23,0.8)",
        }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 h-16"
      >
        <Logo />
        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                style={{ color: "#94a3b8", letterSpacing: "0.1em" }}
                className="text-xs uppercase font-medium tracking-widest hover:text-white transition-colors duration-200"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#events"
          style={{
            background: "#2250ff",
            borderRadius: "2px",
            letterSpacing: "0.12em",
          }}
          className="hidden md:flex text-white text-xs uppercase font-bold tracking-widest px-5 py-2.5 hover:opacity-80 transition-opacity"
        >
          Join Us
        </a>
      </nav>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          HERO
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 110%, rgba(34,80,255,0.28) 0%, transparent 65%), #040817",
        }}
      >
        {/* Floating math symbols */}
        {FLOATING_SYMBOLS.map(({ symbol, top, left, size, cls, delay }) => (
          <span
            key={`${symbol}-${top}`}
            className={`${cls} absolute select-none pointer-events-none font-light`}
            style={{
              top,
              left,
              fontSize: size,
              animationDelay: delay,
              color: "rgba(255,255,255,0.15)",
              lineHeight: 1,
            }}
          >
            {symbol}
          </span>
        ))}

        {/* Glow orb */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "80vw",
            height: "40vh",
            background: "radial-gradient(ellipse, rgba(34,80,255,0.22) 0%, transparent 70%)",
            animation: "glowPulse 6s ease-in-out infinite",
          }}
        />

        {/* Main content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          {/* Year tag */}
          <div
            className="inline-flex items-center gap-3 mb-10"
            style={{ opacity: 0.5 }}
          >
            <span style={{ width: 32, height: 1, background: "currentColor", display: "inline-block" }} />
            <span className="text-xs tracking-[0.3em] uppercase font-medium">Est. 2019 Â· Mathematics Society</span>
            <span style={{ width: 32, height: 1, background: "currentColor", display: "inline-block" }} />
          </div>

          {/* Hero headline */}
          <h1
            className="font-bold leading-none tracking-[0.22em] uppercase mb-8"
            style={{
              fontSize: "clamp(3.5rem, 13vw, 11rem)",
              background: "linear-gradient(160deg, #ffffff 30%, rgba(255,255,255,0.55) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Math
            <span style={{ color: "#2250ff", WebkitTextFillColor: "#2250ff" }}>S</span>
            oc
          </h1>

          {/* Heroic equation line */}
          <p
            className="font-light mb-10 tracking-widest"
            style={{
              fontFamily: "var(--font-geist-mono)",
              color: "rgba(255,255,255,0.35)",
              fontSize: "clamp(0.7rem, 1.4vw, 1rem)",
              letterSpacing: "0.35em",
            }}
          >
            e
            <sup style={{ fontSize: "0.65em" }}>iÏ€</sup>
            {" "}+{" "}1{" "}={" "}0{" "}Â·{" "}âˆ€Îµ&gt;0 âˆƒÎ´&gt;0 Â· P(Aâˆ©B)=P(A)P(B)
          </p>

          {/* Subheading */}
          <p
            className="max-w-xl mx-auto mb-14 font-normal leading-relaxed"
            style={{ color: "#94a3b8", fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
          >
            No spectators. Just mathematicians who think in equations, argue in proofs,
            and find beauty in the infinite.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#events"
              style={{ background: "#2250ff", borderRadius: "2px", letterSpacing: "0.14em" }}
              className="px-8 py-3.5 text-white text-sm uppercase font-bold hover:opacity-80 transition-opacity"
            >
              See Events
            </a>
            <a
              href="#about"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "2px",
                letterSpacing: "0.14em",
                color: "#94a3b8",
              }}
              className="px-8 py-3.5 text-sm uppercase font-bold hover:border-white hover:text-white transition-all"
            >
              Who We Are
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0.3 }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div style={{ width: 1, height: 48, background: "currentColor" }} />
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MARQUEE TICKER
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#070f2b",
          overflow: "hidden",
          padding: "16px 0",
        }}
        className="relative"
      >
        <div className="marquee-track flex whitespace-nowrap">
          {tickerFull.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center"
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {item}
              <span style={{ margin: "0 28px", color: "#2250ff", opacity: 0.7 }}>Â·</span>
            </span>
          ))}
        </div>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          ABOUT / MANIFESTO
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="about" className="relative px-8 md:px-16 py-32 md:py-48 max-w-7xl mx-auto">
        {/* Decorative large symbol */}
        <span
          className="absolute -top-8 right-0 md:right-8 select-none pointer-events-none font-bold"
          style={{
            fontSize: "clamp(8rem, 22vw, 18rem)",
            color: "rgba(34,80,255,0.04)",
            lineHeight: 1,
            zIndex: 0,
          }}
        >
          âˆ‘
        </span>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left: big statement */}
          <div>
            <p
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-6"
              style={{ color: "#2250ff" }}
            >
              Who We Are
            </p>
            <h2
              className="font-bold leading-tight mb-8"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", letterSpacing: "-0.01em" }}
            >
              No NPCs.
              <br />
              Just mathematicians
              <br />
              <span style={{ color: "#2250ff" }}>who think in equations.</span>
            </h2>
            <div
              style={{ width: 48, height: 2, background: "#2250ff", marginBottom: "2rem" }}
            />
          </div>

          {/* Right: body copy + stats */}
          <div>
            <p
              className="leading-relaxed mb-8"
              style={{ color: "#94a3b8", fontSize: "1.0625rem", lineHeight: 1.85 }}
            >
              MathSoc is a community of students who believe mathematics is more than
              a subject â€” it&apos;s a way of seeing the world. We host competitions,
              workshops, guest lectures, and social events that turn abstract theory
              into lived experience.
            </p>
            <p
              className="leading-relaxed mb-12"
              style={{ color: "#94a3b8", fontSize: "1.0625rem", lineHeight: 1.85 }}
            >
              Whether you&apos;re chasing a Putnam fellowship or just love the elegant
              terror of a well-posed problem, there&apos;s a proof here with your name on it.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { num: "200+", label: "Members" },
                { num: "40+", label: "Events / yr" },
                { num: "7", label: "Years running" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <p
                    className="font-bold leading-none mb-1"
                    style={{ fontSize: "2rem", color: "#fff" }}
                  >
                    {num}
                  </p>
                  <p className="text-xs tracking-widest uppercase" style={{ color: "#475569" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services row (like Righteous "PRODUCT Â· MARKETING Â· KICKFLIPS") */}
        <div
          className="mt-24 pt-10 flex flex-wrap gap-x-16 gap-y-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {["PURE MATH", "APPLIED MATH", "OLYMPIAD TRAINING", "SOCIAL EVENTS", "RESEARCH TALKS"].map((s) => (
            <span
              key={s}
              className="text-xs tracking-[0.25em] font-semibold uppercase"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MEMBERS
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        id="members"
        className="px-8 md:px-16 py-32 md:py-40"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#070f2b" }}
      >
        {/* Section header */}
        <div className="max-w-7xl mx-auto mb-20">
          <p
            className="text-xs uppercase tracking-[0.3em] font-semibold mb-5"
            style={{ color: "#2250ff" }}
          >
            The Crew
          </p>
          <h2
            className="font-bold tracking-[0.18em] uppercase leading-none"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)", color: "rgba(255,255,255,0.08)" }}
          >
            {"L e a d e r s h i p".split("").map((ch, i) => (
              <span key={i} style={ch === " " ? { marginRight: "0.2em" } : {}}>
                {ch}
              </span>
            ))}
          </h2>
        </div>

        {/* Member grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
          {MEMBERS.map((m) => (
            <div
              key={m.name}
              className="group relative flex flex-col p-8 md:p-10 overflow-hidden cursor-default"
              style={{ background: "#070f2b" }}
            >
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-sm mb-6 flex items-center justify-center font-bold text-lg"
                style={{
                  background: `linear-gradient(135deg, ${m.hue} 0%, #2250ff22 100%)`,
                  border: "1px solid rgba(34,80,255,0.2)",
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.05em",
                }}
              >
                {m.initials}
              </div>

              {/* Name & role */}
              <p
                className="font-bold mb-1"
                style={{ fontSize: "1.25rem", letterSpacing: "-0.01em" }}
              >
                {m.name}
              </p>
              <p
                className="text-xs tracking-[0.2em] uppercase font-semibold mb-3"
                style={{ color: "#2250ff" }}
              >
                {m.role}
              </p>
              <p
                className="text-sm"
                style={{ color: "#475569", fontFamily: "var(--font-geist-mono)" }}
              >
                {m.rank}
              </p>

              {/* Hover border accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: "linear-gradient(90deg, transparent, #2250ff, transparent)" }}
              />
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="max-w-7xl mx-auto mt-20 text-center">
          <blockquote
            className="font-light italic"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.4rem)", color: "rgba(255,255,255,0.2)", letterSpacing: "0.02em" }}
          >
            &ldquo;Mathematics is the art of giving the same name to different things.&rdquo;
          </blockquote>
          <cite className="block mt-4 text-xs tracking-widest uppercase not-italic" style={{ color: "#475569" }}>
            â€” Henri PoincarÃ©
          </cite>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          EVENTS
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="events" className="px-8 md:px-16 py-32 md:py-40 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <p
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-4"
              style={{ color: "#2250ff" }}
            >
              Upcoming
            </p>
            <h2
              className="font-bold leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.01em" }}
            >
              Events
            </h2>
          </div>
          <p className="max-w-sm" style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.7 }}>
            From intense olympiad training to laid-back proof jams â€” there&apos;s always
            something on the board.
          </p>
        </div>

        {/* Event list */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {EVENTS.map((ev, i) => (
            <div
              key={ev.title}
              className="group flex flex-col sm:flex-row sm:items-center gap-6 py-8 cursor-pointer"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {/* Date */}
              <div className="shrink-0 w-24">
                <p className="font-bold text-lg leading-none" style={{ color: "#fff" }}>
                  {ev.date}
                </p>
                <p className="text-xs tracking-widest" style={{ color: "#475569" }}>
                  {ev.year}
                </p>
              </div>

              {/* Title & desc */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                  <h3
                    className="font-semibold text-lg group-hover:text-blue-400 transition-colors"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {ev.title}
                  </h3>
                  <Tag label={ev.tag} />
                </div>
                <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.7 }}>
                  {ev.description}
                </p>
              </div>

              {/* Arrow */}
              <div
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                style={{ background: "rgba(34,80,255,0.15)", color: "#5578ff" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          GALLERY
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        id="gallery"
        className="px-8 md:px-16 py-32 md:py-40"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#070f2b" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <p
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-4"
              style={{ color: "#2250ff" }}
            >
              Captured Moments
            </p>
            <h2
              className="font-bold leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.01em" }}
            >
              Gallery
            </h2>
          </div>

          {/* Mosaic grid */}
          <div className="grid grid-cols-3 grid-rows-3 gap-2" style={{ height: "min(70vh, 640px)" }}>
            {GALLERY_CELLS.map((cell, i) => (
              <div
                key={i}
                className={`${cell.span} relative overflow-hidden group cursor-pointer rounded-sm`}
                style={{ background: cell.shade }}
              >
                {/* Math symbol watermark */}
                <span
                  className="absolute inset-0 flex items-center justify-center select-none font-bold"
                  style={{
                    fontSize: "clamp(4rem, 8vw, 7rem)",
                    color: "rgba(34,80,255,0.08)",
                    lineHeight: 1,
                  }}
                >
                  {["âˆ«", "âˆ‘", "Ï€", "Î”", "âˆš", "âˆž", "Î¸"][i % 7]}
                </span>

                {/* Label */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(0deg, rgba(4,8,23,0.9) 0%, transparent 100%)" }}
                >
                  <p className="text-xs tracking-widest uppercase font-semibold" style={{ color: "#94a3b8" }}>
                    {cell.label}
                  </p>
                </div>

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "rgba(34,80,255,0.06)", border: "1px solid rgba(34,80,255,0.3)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          JOIN CTA BAND
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        className="relative px-8 md:px-16 py-32 text-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(34,80,255,0.18) 0%, transparent 70%), #040817",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ animation: "scanline 4s ease-in-out infinite" }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${(i / 40) * 100}%`,
                height: 1,
                background: "rgba(255,255,255,0.03)",
              }}
            />
          ))}
        </div>

        <p
          className="text-xs uppercase tracking-[0.35em] font-semibold mb-6"
          style={{ color: "#2250ff" }}
        >
          Ready to level up?
        </p>
        <h2
          className="font-bold leading-tight mb-8 max-w-2xl mx-auto"
          style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "-0.02em" }}
        >
          The proof is in the participation.
        </h2>
        <p
          className="max-w-md mx-auto mb-12"
          style={{ color: "#94a3b8", lineHeight: 1.8 }}
        >
          Membership is open to all students. No GPA cutoff. No gatekeeping.
          Just a shared obsession with beautiful problems.
        </p>
        <a
          href="mailto:mathsoc@university.edu"
          style={{
            background: "#2250ff",
            borderRadius: "2px",
            letterSpacing: "0.14em",
            fontSize: "0.85rem",
          }}
          className="inline-flex px-10 py-4 text-white uppercase font-bold hover:opacity-80 transition-opacity"
        >
          Get In Touch
        </a>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          FOOTER
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <footer
        className="px-8 md:px-16 py-16"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "#040817",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 mb-16">
            {/* Logo + tagline */}
            <div className="max-w-xs">
              <Logo className="mb-5" />
              <p style={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>
                Where curiosity becomes proof and problems become art.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-x-16 gap-y-8">
              <div>
                <p
                  className="text-xs tracking-[0.25em] uppercase font-semibold mb-4"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  Site
                </p>
                <ul className="flex flex-col gap-2.5">
                  {NAV_LINKS.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm hover:text-white transition-colors"
                        style={{ color: "#475569" }}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p
                  className="text-xs tracking-[0.25em] uppercase font-semibold mb-4"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  Social
                </p>
                <ul className="flex flex-col gap-2.5">
                  {[
                    { label: "Instagram", href: "#" },
                    { label: "Discord", href: "#" },
                    { label: "LinkedIn", href: "#" },
                    { label: "GitHub", href: "#" },
                  ].map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        className="text-sm hover:text-white transition-colors"
                        style={{ color: "#475569" }}
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p style={{ color: "#1e293b", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
              Â© 2026 MATHSOC. ALL RIGHTS RESERVED.
            </p>
            <p
              style={{
                color: "#1e293b",
                fontSize: "0.75rem",
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              âˆ‘(n=1 to âˆž) 1/nÂ² = Ï€Â²/6
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
