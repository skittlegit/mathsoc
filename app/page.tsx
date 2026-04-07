"use client";

import { useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
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
              color: "rgba(255,255,255,0.2)",
            }}
          >
            The Mathematics Society &middot; Mahindra University
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.48rem",
              color: "rgba(255,255,255,0.1)",
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
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

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
      <section className="relative min-h-screen flex flex-col md:flex-row overflow-x-hidden">
        {/* Full-hero dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* ── LEFT: Branding ── */}
        <div className="relative z-10 md:w-[46%] flex flex-col justify-center px-7 md:px-14 pt-32 pb-10 md:py-0">
          {/* Floating symbols on the left only */}
          <FloatingSymbols />

          {/* Title */}
          <motion.h1
            className="font-bold select-none"
            style={{
              fontSize: "clamp(2rem, 5.2vw, 4.8rem)",
              letterSpacing: "0.02em",
              lineHeight: 1.05,
              color: "rgba(255,255,255,0.95)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.9, duration: 0.9, ease }}
          >
            The Mathematics<br />Society
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="mt-5"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.32)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 0.8 }}
          >
            @ Mahindra University
          </motion.p>

          {/* Est. */}
          <motion.p
            className="mt-2"
            style={{
              fontSize: "0.44rem",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.14)",
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.4, duration: 0.8 }}
          >
            Est. 2023
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.7, duration: 1 }}
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            <span style={{ fontSize: "0.44rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>
              Scroll to explore
            </span>
            <motion.div
              style={{ width: 32, height: 1, background: "rgba(255,255,255,0.2)" }}
              animate={{ scaleX: [1, 0.4, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* Thin vertical divider */}
        <div
          className="hidden md:block self-stretch w-px my-24"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />

        {/* ── RIGHT: Blackjack ── */}
        <div className="relative z-10 md:flex-1 flex flex-col justify-center items-center px-7 md:px-14 pb-14 md:py-0">
          <motion.div
            className="w-full"
            style={{ maxWidth: 540 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0, duration: 0.9, ease }}
          >
            <BlackjackGame />
          </motion.div>
        </div>
      </section>

      {/* ═══ WHO WE ARE ═══ */}
      <section
        className="px-7 md:px-14 py-36 md:py-56"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <span
              style={{
                display: "block",
                fontSize: "0.52rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.18)",
                marginBottom: "2rem",
              }}
            >
              Who We Are
            </span>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              style={{
                fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.72)",
                fontWeight: 400,
                maxWidth: "28ch",
              }}
            >
              We&apos;re{" "}
              <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>MathSoc</span>{" "}
              — the Mathematics Society at Mahindra University. A community united by
              curiosity, rigor, and a passion for mathematical sciences beyond the classroom.
            </p>
          </Reveal>
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
              <p style={{ fontSize: "1rem", lineHeight: 2, color: "rgba(255,255,255,0.55)" }}>
                We&apos;ve sat through enough lectures to know that math
                isn&apos;t about memorizing formulas — it&apos;s about the
                thrill of understanding. We formed MathSoc at Mahindra University
                to explore the beauty and power of mathematics beyond the classroom.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-16 md:mt-24 flex flex-wrap gap-x-12 md:gap-x-16 gap-y-3">
              {["PURE MATH", "APPLIED MATH", "DATA SCIENCE", "CRYPTOGRAPHY"].map((s) => (
                <motion.span
                  key={s}
                  className="font-bold uppercase"
                  style={{
                    fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
                    letterSpacing: "-0.01em",
                    color: "rgba(255,255,255,0.08)",
                  }}
                  whileHover={{ color: "rgba(255,255,255,0.3)" }}
                  transition={{ duration: 0.3 }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </Reveal>
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
                color: "rgba(255,255,255,0.28)",
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
                color: "rgba(255,200,210,0.5)",
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
