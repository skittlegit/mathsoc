"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  AnimatePresence,
} from "framer-motion";

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
  useEffect(() => {
    const t = setTimeout(onComplete, 2400);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-20 h-20 relative">
          <Image
            src="/mathsoclogowhite.png"
            alt="MathSoc"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-white font-semibold"
          style={{ fontSize: "1.1rem", letterSpacing: "0.08em" }}
        >
          MathSoc
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          style={{
            fontSize: "0.5rem",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Mathematics Society
        </motion.p>
      </motion.div>
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
   MANIFESTO TEXT — word-by-word opacity
═══════════════════════════════════════════════ */

function ManifestoText({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.25 });
  const words = text.split(" ");

  return (
    <h2
      ref={ref}
      style={{
        fontSize: "clamp(1rem, 2.2vw, 1.5rem)",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        lineHeight: 2.5,
        fontWeight: 500,
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.08 }}
          animate={isInView ? { opacity: 0.72 } : { opacity: 0.08 }}
          transition={{ duration: 0.45, delay: i * 0.04, ease: "easeOut" }}
          style={{ display: "inline-block", marginRight: "0.45em" }}
        >
          {word}
        </motion.span>
      ))}
    </h2>
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

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Floating math symbols */}
        <FloatingSymbols />

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          {/* Logo */}
          <motion.div
            className="mb-10 w-24 h-24 md:w-32 md:h-32 relative"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.6, duration: 1, ease }}
          >
            <Image
              src="/mathsoclogowhite.png"
              alt="MathSoc"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-bold select-none"
            style={{
              fontSize: "clamp(4rem, 14vw, 13rem)",
              letterSpacing: "0.04em",
              lineHeight: 0.9,
              color: "rgba(255,255,255,0.95)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.9, duration: 0.9, ease }}
          >
            MathSoc
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="mt-7"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.45em",
              color: "rgba(255,255,255,0.38)",
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.3, duration: 0.8 }}
          >
            Mathematics Society · Mahindra University
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="mt-20 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.7, duration: 1 }}
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            <span style={{ fontSize: "0.48rem", letterSpacing: "0.35em", textTransform: "uppercase" }}>
              Scroll
            </span>
            <motion.div
              style={{ width: 1, height: 40, background: "rgba(255,255,255,0.25)" }}
              animate={{ scaleY: [1, 0.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* Year badge */}
        <motion.span
          className="absolute top-28 left-7 md:left-14"
          style={{
            fontSize: "0.52rem",
            letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.0, duration: 0.7 }}
        >
          Est. 2023
        </motion.span>

        {/* Location badge */}
        <motion.span
          className="absolute bottom-8 right-7 md:right-14"
          style={{
            fontSize: "0.48rem",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.18)",
            textTransform: "uppercase",
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.1, duration: 0.7 }}
        >
          Mahindra University
        </motion.span>
      </section>

      {/* ═══ INTRO ═══ */}
      <section className="px-7 md:px-14 py-24 md:py-36">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-12 items-start">
          <Reveal>
            <p
              style={{
                fontSize: "clamp(1rem, 1.7vw, 1.2rem)",
                lineHeight: 2,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              We&apos;re MathSoc. The Mathematics Society at{" "}
              <span style={{ color: "rgba(255,255,255,0.9)" }}>Mahindra University</span>.
              A community of passionate individuals united by their love for mathematical
              sciences — fostering curiosity, excellence, and exploration beyond the
              classroom.
            </p>
          </Reveal>
          <Reveal direction="fade" delay={0.3} className="hidden md:flex justify-end">
            <span className="select-none" style={{ fontSize: "7rem", color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>
              ∑
            </span>
          </Reveal>
        </div>
      </section>

      {/* ═══ MANIFESTO ═══ */}
      <section
        className="px-7 md:px-14 py-32 md:py-48"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto">
          <ManifestoText text="No spectators. Just passionate mathematicians fostering curiosity, proving theorems, and making bold moves for beautiful problems and mathematical discovery." />
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
