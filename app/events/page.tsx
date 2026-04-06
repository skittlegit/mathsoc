"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FILTERS = ["All", "Competition", "Workshop", "Lecture", "Social"];

const EVENTS = [
  {
    date: "APR 20",
    title: "Integration Bee",
    desc: "Speed through improper, definite, and path integrals. Top 3 scorers earn legendary status.",
    tag: "Competition",
  },
  {
    date: "MAY 03",
    title: "Linear Algebra Workshop",
    desc: "Deep-dive into eigenvalues, SVD, and why your intuition about n-dimensional space is probably wrong.",
    tag: "Workshop",
  },
  {
    date: "MAY 10",
    title: "Pi Day Social",
    desc: "Pie, puzzles, and the annual recitation contest. Last year's record: 314 digits.",
    tag: "Social",
  },
  {
    date: "MAY 15",
    title: "Math Olympiad Prep Camp",
    desc: "Intensive problem-solving bootcamp. AMC, AIME, and Putnam strategies from past champions.",
    tag: "Competition",
  },
  {
    date: "MAY 22",
    title: "Guest Lecture: Topology",
    desc: "Prof. Miriam Hayes on how topological data analysis is reshaping biology and ML.",
    tag: "Lecture",
  },
  {
    date: "MAY 28",
    title: "LaTeX & Proof Writing",
    desc: "From messy scratch work to publication-ready proofs. Bring your laptop.",
    tag: "Workshop",
  },
  {
    date: "JUN 01",
    title: "Combinatorics Crash Course",
    desc: "Generating functions, Burnside's lemma, and Polya counting in three hours flat.",
    tag: "Lecture",
  },
  {
    date: "JUN 07",
    title: "End-of-Year Proof Slam",
    desc: "3-minute lightning proofs. Elegance judged by the audience. The most beautiful proof wins.",
    tag: "Competition",
  },
  {
    date: "JUN 14",
    title: "Summer Kickoff BBQ",
    desc: "Celebrate the semester. Board games, food, and math trivia under the stars.",
    tag: "Social",
  },
];

function EventRow({
  ev,
  index,
}: {
  ev: (typeof EVENTS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease }}
      whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.015)" }}
      className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 py-7"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="shrink-0 w-20">
        <p
          className="font-bold"
          style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}
        >
          {ev.date}
        </p>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h3
            className="font-semibold group-hover:text-white transition-colors duration-300"
            style={{
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "-0.01em",
            }}
          >
            {ev.title}
          </h3>
          <span
            style={{
              fontSize: "0.5rem",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "2px 8px",
              textTransform: "uppercase",
            }}
          >
            {ev.tag}
          </span>
        </div>
        <p
          style={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.2)",
            lineHeight: 1.6,
          }}
        >
          {ev.desc}
        </p>
      </div>
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8h10M8 3l5 5-5 5"
            stroke="rgba(255,255,255,0.3)"
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
      <div className="px-7 md:px-14 max-w-6xl mx-auto mb-20">
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
          Upcoming & Past
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
      <div className="px-7 md:px-14 max-w-6xl mx-auto mb-12">
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span
            style={{
              fontSize: "0.5rem",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.15)",
              textTransform: "uppercase",
              marginRight: "0.5rem",
              lineHeight: "28px",
            }}
          >
            Filter:
          </span>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="cursor-pointer bg-transparent border-none transition-all duration-300"
              style={{
                fontSize: "0.56rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "4px 12px",
                color:
                  activeFilter === f
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(255,255,255,0.2)",
                border:
                  activeFilter === f
                    ? "1px solid rgba(255,255,255,0.15)"
                    : "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {f}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Event List */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto">
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((ev, i) => (
                <EventRow key={ev.title} ev={ev} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
