"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FILTERS = ["All", "Competition", "Academic", "Orientation"];

const EVENTS = [
  /* ── 2025 ── */
  {
    year: 2025,
    date: "APR 5, 2025",
    title: "MCSE",
    full: "Math Club Stock Exchange",
    location: "mcse.in",
    desc: "The flagship event of MathSoc and the showstopper of MU's first-ever techfest, AEON. A full-scale stock market simulation where MU clubs acted as companies — participants traded shares based on live news, IPOs, and real-time market shifts.",
    tag: "Competition",
  },
  {
    year: 2025,
    date: "MAR 19, 2025",
    title: "Speed Trading",
    full: "Speed Trading",
    location: "ECR-5",
    desc: "A teaser for MCSE. Participants reacted to rapid news updates and made quick investment choices with virtual money — testing analytical thinking, foresight, and risk-taking in a timed, intense format.",
    tag: "Competition",
  },
  {
    year: 2025,
    date: "FEB 5, 2025",
    title: "Proof by Deceit 2.0",
    full: "Proof by Deceit 2.0",
    location: "ECR-4",
    desc: "Teams tackled absurd mathematical statements using logic, creativity, and custom super-axioms. Fast-paced rounds with intense debates — one team proves, the other disproves, judges score on wordplay, arguments, and the elegance of the proof.",
    tag: "Competition",
  },
  /* ── 2024 ── */
  {
    year: 2024,
    date: "NOV 13, 2024",
    title: "Subject Group Primer",
    full: "Subject Group Primer",
    location: "ECR-2",
    desc: "Introductory sessions on Data Science & ML, Cryptography, and Financial Mathematics. Designed to plant interest, recruit bright minds, and set the stage for the society's specialized research groups.",
    tag: "Academic",
  },
  {
    year: 2024,
    date: "SEP 24, 2024",
    title: "Euler's Quest",
    full: "Euler's Quest — Treasure Hunt",
    location: "Campus-wide",
    desc: "A campus treasure hunt combining cryptic clues, calculus puzzles, and map coordinates. Teams competed for a ₹10,000 prize pool, navigating an Euler line hidden across campus landmarks.",
    tag: "Orientation",
  },
  {
    year: 2024,
    date: "MAR 12, 2024",
    title: "Pi Day '23",
    full: "Pi Day Celebration",
    location: "ELT-2",
    desc: "A three-day celebration featuring a Pi Recitation Challenge (100+ digits!), a tabletop RPG where players embodied famous mathematicians, and a presentation on Pi approximation methods judged by the Department HOD.",
    tag: "Competition",
  },
  {
    year: 2024,
    date: "FEB 14, 2024",
    title: "Proof by Deceit 1.0",
    full: "Proof by Deceit 1.0",
    location: "ECR-1",
    desc: "Four rounds of deception and deduction. Teams used ultraxioms — special axioms irrespective of truth — to prove or disprove absurd mathematical statements. A blend of logic, philosophy, and strategy.",
    tag: "Competition",
  },
  /* ── 2023 ── */
  {
    year: 2023,
    date: "OCT 3, 2023",
    title: "Iota's Quest",
    full: "Iota's Quest — Orientation",
    location: "Campus-wide",
    desc: "The founding orientation of MathSoc: a three-day treasure hunt with origami puzzles, calculus clues, and Desmos challenges. 47 teams. A final hidden reveal at the orientation. The beginning of it all.",
    tag: "Orientation",
  },
];

const YEARS = [2025, 2024, 2023];

function EventRow({ ev, index }: { ev: (typeof EVENTS)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease }}
      whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.012)" }}
      className="group flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 py-8"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      {/* Date + location column */}
      <div className="shrink-0 w-36">
        <p
          className="font-semibold mb-1"
          style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)" }}
        >
          {ev.date}
        </p>
        <p
          style={{
            fontSize: "0.62rem",
            color: "rgba(255,255,255,0.38)",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-jetbrains-mono)",
          }}
        >
          {ev.location}
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h3
            className="font-semibold group-hover:text-white transition-colors duration-300"
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.82)",
              letterSpacing: "-0.01em",
            }}
          >
            {ev.full}
          </h3>
          <span
            style={{
              fontSize: "0.48rem",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.35)",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "2px 8px",
              textTransform: "uppercase",
            }}
          >
            {ev.tag}
          </span>
        </div>
        <p
          style={{
            fontSize: "0.88rem",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.75,
          }}
        >
          {ev.desc}
        </p>
      </div>

      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8h10M8 3l5 5-5 5"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? EVENTS
      : EVENTS.filter((e) => e.tag === activeFilter);

  return (
    <div className="pt-32 md:pt-44 pb-24">
      {/* Page Hero */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto mb-16">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease }}
          style={{
            fontSize: "0.56rem",
            letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
          }}
        >
          Competitions, Workshops & More
        </motion.span>

        <motion.h1
          className="font-bold uppercase mt-6"
          style={{
            fontSize: "clamp(3.5rem, 11vw, 9rem)",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.9)",
            lineHeight: 0.9,
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease }}
        >
          Events
        </motion.h1>
      </div>

      {/* Filters */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto mb-10">
        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span
            style={{
              fontSize: "0.5rem",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.12)",
              textTransform: "uppercase",
              lineHeight: "28px",
            }}
          >
            Filter:
          </span>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="cursor-pointer bg-transparent transition-all duration-300"
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "5px 14px",
                color:
                  activeFilter === f
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(255,255,255,0.2)",
                border:
                  activeFilter === f
                    ? "1px solid rgba(255,255,255,0.15)"
                    : "1px solid rgba(255,255,255,0.05)",
                borderRadius: "2px",
              }}
            >
              {f}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Year sections */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {YEARS.map((year) => {
              const yearEvents = filtered.filter((e) => e.year === year);
              if (yearEvents.length === 0) return null;
              return (
                <div key={year} className="mb-16">
                  {/* Year label */}
                  <div
                    className="flex items-center gap-6 mb-4 pt-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <span
                      className="font-bold"
                      style={{
                        fontSize: "clamp(3rem, 8vw, 6rem)",
                        color: "rgba(255,255,255,0.03)",
                        letterSpacing: "0.1em",
                        lineHeight: 1,
                      }}
                    >
                      {year}
                    </span>
                  </div>
                  {yearEvents.map((ev, i) => (
                    <EventRow key={ev.title} ev={ev} index={i} />
                  ))}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
