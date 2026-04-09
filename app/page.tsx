"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useEvents } from "@/lib/EventsContext";
import { useAnnouncements } from "@/lib/AnnouncementsContext";
import BlackjackGame from "./components/BlackjackGame";

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */

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

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ═══════════════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════════════ */

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const DURATION = 2000;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(onComplete, 380);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-black flex flex-col"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
    >
      {/* Content — bottom-left editorial layout */}
      <div className="flex-1 flex flex-col justify-end px-8 md:px-14 pb-10">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{
            display: "block",
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "clamp(5rem, 18vw, 11rem)",
            lineHeight: 1,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.02em",
          }}
        >
          {String(count).padStart(2, "0")}
        </motion.span>
        <motion.div
          className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <span
            style={{
              fontSize: "0.48rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            The Mathematics Society &middot; Mahindra University
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.48rem",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            e^(iπ) + 1 = 0
          </span>
        </motion.div>
      </div>

      {/* Thin progress line at bottom */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }}>
        <div
          style={{
            height: "100%",
            width: `${count}%`,
            background: "rgba(255,255,255,0.18)",
            transition: "width 0.05s linear",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════ */

function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "fade" | "scale";
}) {
  const initial: Record<string, number> = { opacity: 0 };
  const animate: Record<string, number> = { opacity: 1 };
  if (direction === "up") { initial.y = 50; animate.y = 0; }
  if (direction === "left") { initial.x = -50; animate.x = 0; }
  if (direction === "right") { initial.x = 50; animate.x = 0; }
  if (direction === "scale") { initial.scale = 0.92; animate.scale = 1; }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════
   FLOATING MATH SYMBOLS
═══════════════════════════════════════════════ */

const FLOATERS = ["∑", "∫", "π", "√", "∞", "∂", "∇", "Δ", "∀", "ℝ", "θ", "ℂ"];

function FloatingSymbols() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {FLOATERS.map((sym, i) => {
        const x = 5 + (i * 83 + 17) % 90;
        const y = 5 + (i * 67 + 31) % 85;
        const dur = 12 + (i * 3.7) % 10;
        const delay = (i * 1.1) % 5;
        return (
          <motion.span
            key={sym + i}
            className="absolute select-none"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: `${1 + (i % 3) * 0.4}rem`,
              color: "rgba(255,255,255,0.03)",
              fontWeight: 700,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.03, 0.06, 0.03],
            }}
            transition={{
              duration: dur,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {sym}
          </motion.span>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════ */

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { events: allEvents } = useEvents();
  const { announcements } = useAnnouncements();
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  const eventPhoto = (() => {
    const ev = allEvents.find((e) => e.photo);
    return ev?.photo ? { photo: ev.photo, full: ev.full } : null;
  })();

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [loading]);

  const handleLoadingComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* ═══ HERO — Split: Brand (left) + Blackjack (right) ═══ */}
      <section className="relative overflow-x-hidden">
        {/* Full-hero dot grid — stays full-bleed via absolute */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Both sides constrained to same max-width as Events/Resources */}
        <div className="relative z-10 min-h-screen px-7 md:px-14 max-w-6xl mx-auto flex flex-col md:flex-row">

          {/* ── LEFT: Branding ── */}
          <div className="relative flex-1 flex flex-col justify-center pt-32 pb-10 md:py-0 min-h-[60vh] md:min-h-0 md:pr-14">
            {/* Floating symbols on the left only */}
            <FloatingSymbols />

            {/* Eyebrow */}
            <motion.div
              className="flex items-center gap-4 mb-10"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.8, duration: 0.7, ease }}
            >
              <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
              <span
                style={{
                  fontSize: "0.48rem",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "var(--font-jetbrains-mono)",
                }}
              >
                Mathematics Society · Est. 2023
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="font-bold select-none"
              style={{
                fontSize: "clamp(3rem, 8vw, 7.5rem)",
                letterSpacing: "-0.02em",
                lineHeight: 0.95,
                color: "rgba(255,255,255,0.96)",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.9, duration: 0.9, ease }}
            >
              The<br />Mathematics<br />
              <span style={{ color: "rgba(255,255,255,0.45)" }}>Society</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="mt-8"
              style={{
                fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
                lineHeight: 1.85,
                color: "rgba(255,255,255,0.65)",
                maxWidth: "34ch",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2, duration: 0.8 }}
            >
              Where curiosity meets rigor. A community for mathematicians,
              problem-solvers, and thinkers at Mahindra University.
            </motion.p>

            {/* Quick links */}
            <motion.div
              className="flex items-center gap-8 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.4, duration: 0.7 }}
            >
              {[
                { label: "Events", href: "/events" },
                { label: "Team", href: "/team" },
                { label: "Gallery", href: "/gallery" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  style={{
                    fontSize: "0.5rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.48)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.18)",
                    paddingBottom: "3px",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.85)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.48)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.18)";
                  }}
                >
                  {label} ↗
                </Link>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="mt-14 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.7, duration: 1 }}
            >
              <motion.div
                style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.38)" }}
                animate={{ opacity: [0.35, 0.75, 0.35] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span style={{ fontSize: "0.44rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                Scroll to explore
              </span>
            </motion.div>
          </div>

          {/* ── VERTICAL RULE (desktop only) ── */}
          <motion.div
            className="hidden md:block self-center"
            style={{ width: 1, height: 220, background: "rgba(255,255,255,0.05)", flexShrink: 0 }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 3.1, duration: 0.8, ease }}
          />

          {/* ── RIGHT: Blackjack ── */}
          <div className="flex flex-col justify-center items-center pb-14 md:py-0 md:pl-12 md:w-[40%]">
            <motion.div
              className="w-full"
              style={{ maxWidth: 300 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.0, duration: 0.9, ease }}
            >
              {/* Label */}
              <div
                className="flex items-center gap-3 mb-5"
                style={{ opacity: 0.85 }}
              >
                <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.12)" }} />
                <span style={{ fontSize: "0.44rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-jetbrains-mono)", flexShrink: 0 }}>
                  Play a round
                </span>
                <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.12)" }} />
              </div>
              <BlackjackGame />
            </motion.div>
          </div>

        </div>
      </section>

      {/* ═══ ALERT BANNER ═══ */}
      {announcements.length > 0 && (
        <section
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.015)",
          }}
        >
          <div className="px-7 md:px-14 max-w-6xl mx-auto py-6">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
                style={{ lineHeight: 1.6 }}
              >
                {/* Badge */}
                <span
                  style={{
                    fontSize: "0.42rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(255,200,210,0.7)",
                    fontWeight: 700,
                    flexShrink: 0,
                    border: "1px solid rgba(255,200,210,0.2)",
                    padding: "2px 8px",
                    borderRadius: 2,
                    alignSelf: "flex-start",
                  }}
                >
                  Upcoming
                </span>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
                    {a.title}
                  </span>
                  <div
                    className="flex items-center gap-2 flex-wrap mt-1"
                    style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-jetbrains-mono)", letterSpacing: "0.04em" }}
                  >
                    <span>{a.date}</span>
                    <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                    <span>{a.time}</span>
                    <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                    <span>{a.location}</span>
                    {a.prizePool && (
                      <>
                        <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                        <span style={{ color: "rgba(255,200,210,0.65)" }}>Prize: {a.prizePool}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Link */}
                {a.link && (
                  <a
                    href={a.link.startsWith("http") ? a.link : `https://${a.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "0.56rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.55)",
                      fontFamily: "var(--font-jetbrains-mono)",
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.18)",
                      paddingBottom: 2,
                      flexShrink: 0,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.85)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)"; }}
                  >
                    {a.link.replace(/^https?:\/\//, "")} ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ WHO WE ARE ═══ */}
      <section
        className="px-7 md:px-14 py-32 md:py-48"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-6 mb-14">
              <span
                style={{
                  fontSize: "0.56rem",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Who We Are
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>
          </Reveal>

          {/* Top — statement + CTA */}
          <div className="mb-20">
            <Reveal delay={0.1}>
              <p
                style={{
                  fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.82)",
                  fontWeight: 400,
                  maxWidth: "38ch",
                }}
              >
                We&apos;re{" "}
                <span style={{ color: "rgba(255,255,255,0.96)", fontWeight: 600 }}>MathSoc</span>{" "}
                — the Mathematics Society at Mahindra University. A community
                united by curiosity, rigor, and a passion for mathematical
                sciences beyond the classroom.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link
                href="/events"
                className="inline-flex items-center gap-3 mt-10 group"
                style={{ textDecoration: "none" }}
              >
                <span
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                    fontWeight: 600,
                    transition: "color 0.2s",
                  }}
                  className="group-hover:text-white"
                >
                  View Our Events
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    color: "rgba(255,255,255,0.4)",
                    transition: "transform 0.3s, color 0.2s",
                  }}
                  className="group-hover:translate-x-1 group-hover:text-white inline-block"
                >
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          {/* Bottom — event photo (full-width, cinematic) */}
          {eventPhoto && (
            <Reveal direction="fade" delay={0.15}>
              <Link href="/events" className="block group">
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "21/9",
                    overflow: "hidden",
                    position: "relative",
                    background: "rgba(255,255,255,0.018)",
                    borderRadius: 3,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={eventPhoto.photo}
                    alt={eventPhoto.full}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                    }}
                    className="group-hover:scale-[1.03]"
                  />
                </div>
                <p
                  className="mt-4"
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {eventPhoto.full}
                </p>
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      {/* ═══ FOCUS AREAS ═══ */}
      <section
        className="px-7 md:px-14 py-32 md:py-48"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto">
          <Reveal direction="left">
            <div className="flex items-center gap-6 mb-16">
              <span
                style={{
                  fontSize: "0.56rem",
                  letterSpacing: "0.4em",
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                }}
              >
                What We Explore
              </span>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-8 max-w-3xl">
              <p style={{ fontSize: "1.05rem", lineHeight: 2, color: "rgba(255,255,255,0.65)" }}>
                We&apos;ve sat through enough lectures to know that math
                isn&apos;t about memorizing formulas — it&apos;s about the
                thrill of understanding. We explore the beauty and power of
                mathematics beyond the classroom.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.04)" }}>
            {[
              {
                symbol: "∫",
                title: "Pure Mathematics",
                desc: "Abstract algebra, real analysis, topology, and number theory — chasing elegance in structure and proof.",
              },
              {
                symbol: "∇",
                title: "Applied Mathematics",
                desc: "Differential equations, optimization, and numerical methods — turning theory into tools that solve real problems.",
              },
              {
                symbol: "Σ",
                title: "Data Science",
                desc: "Probability, statistics, and machine learning — finding patterns and making predictions from raw data.",
              },
              {
                symbol: "⊕",
                title: "Cryptography",
                desc: "Number theory meets information security — designing codes that keep the digital world safe.",
              },
            ].map((area, i) => (
              <Reveal key={area.title} delay={i * 0.1}>
                <motion.div
                  style={{
                    background: "#000",
                    padding: "clamp(2rem, 4vw, 3.5rem)",
                    position: "relative",
                    cursor: "default",
                  }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  transition={{ duration: 0.35 }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "clamp(1.5rem, 3vw, 2.5rem)",
                      right: "clamp(1.5rem, 3vw, 2.5rem)",
                      fontSize: "clamp(2.5rem, 5vw, 4rem)",
                      color: "rgba(255,255,255,0.04)",
                      fontWeight: 700,
                      lineHeight: 1,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {area.symbol}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.48rem",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.38)",
                      marginBottom: 16,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <h3
                    className="font-semibold"
                    style={{
                      fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                      color: "rgba(255,255,255,0.85)",
                      marginBottom: 12,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {area.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      lineHeight: 1.8,
                    color: "rgba(255,255,255,0.55)",
                      maxWidth: "32ch",
                    }}
                  >
                    {area.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div
        className="overflow-hidden py-5"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="marquee-track whitespace-nowrap">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center"
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {item}
              <span className="mx-7" style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ CTA SECTION ═══ */}
      <section
        className="overflow-hidden"
        style={{
          background: "linear-gradient(175deg, #110008 0%, #1e0515 50%, #110008 100%)",
        }}
      >
        <div className="px-7 md:px-14 py-40 md:py-56 max-w-5xl mx-auto text-center">
          <Reveal direction="scale">
            <h2
              className="font-medium uppercase"
              style={{
                fontSize: "clamp(0.95rem, 2.2vw, 1.45rem)",
                letterSpacing: "0.3em",
                color: "rgba(255,200,210,0.75)",
                lineHeight: 2.5,
                marginBottom: "3rem",
              }}
            >
              If you love the language of the universe, join the ones who are
              already fluent in it. 🧮
            </h2>
          </Reveal>

          <Reveal delay={0.25}>
            <p
              className="max-w-2xl mx-auto"
              style={{
                color: "rgba(255,200,210,0.6)",
                fontSize: "0.98rem",
                lineHeight: 2,
                marginBottom: "3rem",
              }}
            >
              We grew up obsessing over unsolved problems, filling whiteboards
              past midnight, and arguing about whether 0.999... really equals 1.
              Today we channel that same energy into building a community that
              thinks in theorems and ships proofs. Membership is open to all
              students. No GPA cutoff. No gatekeeping.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <motion.a
              href="/contact"
              className="inline-block font-semibold"
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                borderBottom: "1px solid rgba(255,200,210,0.45)",
                paddingBottom: "6px",
                color: "rgba(255,200,210,0.7)",
              }}
              whileHover={{ opacity: 0.7 }}
              whileTap={{ scale: 0.97 }}
            >
              Get in Touch →
            </motion.a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
