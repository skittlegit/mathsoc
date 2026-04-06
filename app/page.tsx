"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */

const MEMBERS = [
  {
    name: "Alex Chen",
    role: "PRESIDENT",
    rank: "12th-Level Group Theorist",
    initials: "AC",
    symbol: "∑",
  },
  {
    name: "Priya Sharma",
    role: "VICE PRESIDENT",
    rank: "15th-Level Analyst",
    initials: "PS",
    symbol: "∫",
  },
  {
    name: "Jordan Kim",
    role: "EVENTS LEAD",
    rank: "9th-Level Combinatorialist",
    initials: "JK",
    symbol: "∂",
  },
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

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ═══════════════════════════════════════════════
   LOADING SCREEN
   Full-viewport overlay. Slides up after 2.4s.
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
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.06, delayChildren: 0.3 },
          },
        }}
        className="flex"
      >
        {"MathSoc".split("").map((ch, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease },
              },
            }}
            className="text-white font-bold uppercase select-none"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
              letterSpacing: "0.3em",
              display: "inline-block",
            }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          fontSize: "0.5rem",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          marginTop: "1.5rem",
        }}
      >
        Mathematics Society
      </motion.p>
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
  if (direction === "up") {
    initial.y = 50;
    animate.y = 0;
  }
  if (direction === "left") {
    initial.x = -50;
    animate.x = 0;
  }
  if (direction === "right") {
    initial.x = 50;
    animate.x = 0;
  }
  if (direction === "scale") {
    initial.scale = 0.92;
    animate.scale = 1;
  }

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
          initial={{ opacity: 0.06 }}
          animate={isInView ? { opacity: 0.55 } : { opacity: 0.06 }}
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
   MEMBER CARD — hover flip
═══════════════════════════════════════════════ */

function MemberCard({
  member,
  index,
}: {
  member: (typeof MEMBERS)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={index * 0.12}>
      <div
        className="cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="w-full mb-7 relative overflow-hidden"
          style={{ aspectRatio: "3/4", perspective: "1000px" }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ rotateY: hovered ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(175deg, #000510 0%, #000a25 100%)",
                borderRadius: "3px",
                border: "1px solid rgba(255,255,255,0.04)",
                backfaceVisibility: "hidden",
              }}
            >
              <span
                className="absolute inset-0 flex items-center justify-center font-bold select-none"
                style={{
                  fontSize: "clamp(5rem, 12vw, 10rem)",
                  color: "rgba(255,255,255,0.025)",
                  lineHeight: 1,
                }}
              >
                {member.initials}
              </span>
            </div>

            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
              style={{
                background:
                  "linear-gradient(175deg, #000a25 0%, #001050 100%)",
                borderRadius: "3px",
                border: "1px solid rgba(255,255,255,0.06)",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <span
                className="select-none mb-5"
                style={{
                  fontSize: "3.5rem",
                  color: "rgba(255,255,255,0.1)",
                }}
              >
                {member.symbol}
              </span>
              <p
                className="text-center font-medium text-white mb-2"
                style={{ fontSize: "0.9rem" }}
              >
                {member.name}
              </p>
              <p
                className="text-center"
                style={{
                  fontSize: "0.56rem",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                }}
              >
                {member.role}
              </p>
              <p
                className="text-center mt-3"
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "var(--font-jetbrains-mono)",
                }}
              >
                {member.rank}
              </p>
            </div>
          </motion.div>
        </div>

        <p
          className="font-semibold text-white"
          style={{
            fontSize: "1.1rem",
            letterSpacing: "-0.01em",
            marginBottom: "4px",
          }}
        >
          {member.name}
        </p>
        <p
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          {member.role}
        </p>
        <p
          style={{
            fontSize: "0.78rem",
            color: "rgba(255,255,255,0.18)",
            fontFamily: "var(--font-jetbrains-mono)",
          }}
        >
          {member.rank}
        </p>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════ */

export default function Home() {
  const [loading, setLoading] = useState(true);
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  /* Lock body scroll during loading */
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  /* Hero scroll-driven shrink */
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroWidth = useTransform(heroProgress, [0, 0.45], ["100%", "93%"]);
  const heroHeight = useTransform(heroProgress, [0, 0.45], ["100vh", "72vh"]);
  const heroBorderRadius = useTransform(heroProgress, [0, 0.45], [0, 20]);
  const heroContentOpacity = useTransform(heroProgress, [0, 0.3], [1, 0]);
  const heroContentY = useTransform(heroProgress, [0, 0.3], [0, -60]);

  const handleLoadingComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* ═══ HERO — shrinks on scroll ═══ */}
      <section ref={heroRef} style={{ height: "190vh" }}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            className="relative overflow-hidden flex items-center justify-center"
            style={{
              width: heroWidth,
              height: heroHeight,
              borderRadius: heroBorderRadius,
              background:
                "linear-gradient(175deg, #000000 0%, #000510 40%, #000c2d 100%)",
              border: "1px solid rgba(255,255,255,0.03)",
            }}
          >
            {/* Subtle dot grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Year badge */}
            <motion.span
              className="absolute top-8 left-8 md:left-12"
              style={{
                fontSize: "0.56rem",
                letterSpacing: "0.4em",
                color: "rgba(255,255,255,0.15)",
                textTransform: "uppercase",
                opacity: heroContentOpacity,
              }}
            >
              2026
            </motion.span>

            {/* Center content */}
            <motion.div
              className="flex flex-col items-center"
              style={{ opacity: heroContentOpacity, y: heroContentY }}
            >
              <motion.h1
                className="text-center font-bold uppercase select-none"
                style={{
                  fontSize: "clamp(4.5rem, 15vw, 14rem)",
                  letterSpacing: "0.35em",
                  lineHeight: 0.85,
                  color: "rgba(255,255,255,0.95)",
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.8, duration: 1, ease }}
              >
                MathSoc
              </motion.h1>
              <motion.p
                className="mt-8"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.5em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2, duration: 0.8 }}
              >
                Mathematics Society
              </motion.p>
            </motion.div>

            {/* Location bottom-right */}
            <motion.span
              className="absolute bottom-8 right-8 md:right-12"
              style={{
                fontSize: "0.5rem",
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.1)",
                textTransform: "uppercase",
                opacity: heroContentOpacity,
              }}
            >
              University Chapter
            </motion.span>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ delay: 3.6, duration: 1 }}
            >
              <span
                style={{
                  fontSize: "0.48rem",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                }}
              >
                Scroll
              </span>
              <motion.div
                style={{
                  width: 1,
                  height: 36,
                  background: "rgba(255,255,255,0.4)",
                }}
                animate={{ scaleY: [1, 0.35, 1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ INTRO ═══ */}
      <section className="px-7 md:px-14 py-24 md:py-36">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-12 items-start">
          <Reveal>
            <p
              style={{
                fontSize: "clamp(1rem, 1.7vw, 1.15rem)",
                lineHeight: 2,
                color: "rgba(255,255,255,0.42)",
              }}
            >
              We&apos;re MathSoc. A community of students and math enthusiasts,
              pushing through elegant proofs, exploring deep theory, and building
              real problem-solving skills — without any gatekeeping.
            </p>
          </Reveal>
          <Reveal
            direction="fade"
            delay={0.3}
            className="hidden md:flex justify-end"
          >
            <span
              className="select-none"
              style={{
                fontSize: "7rem",
                color: "rgba(255,255,255,0.025)",
                lineHeight: 1,
              }}
            >
              ∑
            </span>
          </Reveal>
        </div>
      </section>

      {/* ═══ MANIFESTO ═══ */}
      <section
        className="px-7 md:px-14 py-32 md:py-48"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-6xl mx-auto">
          <ManifestoText text="No spectators. Just mathematicians rolling initiative and making bold moves for elegant proofs and beautiful problems." />
        </div>
      </section>

      {/* ═══ LEADERSHIP ═══ */}
      <section
        className="px-7 md:px-14 py-32 md:py-48"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-6xl mx-auto">
          <Reveal direction="left">
            <div className="flex items-center gap-6 mb-8">
              <span
                style={{
                  fontSize: "0.56rem",
                  letterSpacing: "0.4em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                }}
              >
                Leadership
              </span>
              <span
                style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.1)",
                  textTransform: "uppercase",
                }}
              >
                Mathematics Society
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mt-20">
            {MEMBERS.map((m, i) => (
              <MemberCard key={m.name} member={m} index={i} />
            ))}
          </div>

          <Reveal>
            <div className="mt-28 max-w-3xl">
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 2,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                We&apos;ve sat through enough lectures to know that math
                isn&apos;t about memorizing formulas — it&apos;s about the
                thrill of understanding. We formed MathSoc to be the antidote to
                isolation.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-16 md:mt-24 flex flex-wrap gap-x-12 md:gap-x-16 gap-y-3">
              {["PURE MATH", "APPLIED MATH", "OLYMPIAD TRAINING"].map((s) => (
                <motion.span
                  key={s}
                  className="font-bold uppercase"
                  style={{
                    fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
                    letterSpacing: "-0.01em",
                    color: "rgba(255,255,255,0.045)",
                  }}
                  whileHover={{ color: "rgba(255,255,255,0.15)" }}
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
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
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
                color: "rgba(255,255,255,0.13)",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {item}
              <span
                className="mx-7"
                style={{ color: "rgba(255,255,255,0.05)" }}
              >
                ·
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ ACCENT / PINK SECTION ═══ */}
      <section
        className="overflow-hidden"
        style={{
          background:
            "linear-gradient(175deg, #110008 0%, #1e0515 50%, #110008 100%)",
        }}
      >
        <div className="px-7 md:px-14 py-40 md:py-56 max-w-5xl mx-auto text-center">
          <Reveal direction="scale">
            <h2
              className="font-medium uppercase"
              style={{
                fontSize: "clamp(0.95rem, 2.2vw, 1.45rem)",
                letterSpacing: "0.3em",
                color: "rgba(255,200,210,0.55)",
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
                color: "rgba(255,200,210,0.3)",
                fontSize: "0.95rem",
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
                borderBottom: "1px solid rgba(255,200,210,0.3)",
                paddingBottom: "6px",
                color: "rgba(255,200,210,0.5)",
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
