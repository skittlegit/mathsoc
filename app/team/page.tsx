"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const MEMBERS = [
  {
    name: "Alex Chen",
    role: "PRESIDENT",
    rank: "12th-Level Group Theorist",
    initials: "AC",
    symbol: "∑",
    bio: "Algebraist by day, problem-setter by night. Led MathSoc to its first inter-university competition win.",
  },
  {
    name: "Priya Sharma",
    role: "VICE PRESIDENT",
    rank: "15th-Level Analyst",
    initials: "PS",
    symbol: "∫",
    bio: "Real analysis enthusiast. Runs our weekly proof-writing workshops and mentors first-year members.",
  },
  {
    name: "Jordan Kim",
    role: "EVENTS LEAD",
    rank: "9th-Level Combinatorialist",
    initials: "JK",
    symbol: "∂",
    bio: "If there's a math event happening, Jordan organized it. Combinatorics nerd with a talent for logistics.",
  },
];

const FOCUS_AREAS = [
  {
    title: "Pure Mathematics",
    items: [
      "Abstract Algebra & Group Theory",
      "Real & Complex Analysis",
      "Topology & Geometry",
      "Number Theory",
      "Measure Theory",
      "Functional Analysis",
    ],
  },
  {
    title: "Applied Mathematics",
    items: [
      "Differential Equations",
      "Numerical Methods",
      "Mathematical Modelling",
      "Probability & Statistics",
      "Optimization Theory",
      "Computational Mathematics",
    ],
  },
  {
    title: "Competition Training",
    items: [
      "AMC / AIME Preparation",
      "Putnam Exam Training",
      "IMO Problem-Solving",
      "Proof Techniques Workshop",
      "Speed Mathematics",
      "Mathematical Olympiad Strategy",
    ],
  },
  {
    title: "Community",
    items: [
      "Weekly Study Groups",
      "Guest Lecture Series",
      "Peer Mentoring Program",
      "Social Events & Mixers",
      "Research Opportunities",
      "Career Networking",
    ],
  },
];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MemberCard({
  member,
  index,
}: {
  member: (typeof MEMBERS)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={index * 0.1}>
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
                className="select-none mb-4"
                style={{ fontSize: "3rem", color: "rgba(255,255,255,0.1)" }}
              >
                {member.symbol}
              </span>
              <p
                className="text-center text-sm"
                style={{ color: "rgba(255,255,255,0.35)", lineHeight: 1.8 }}
              >
                {member.bio}
              </p>
            </div>
          </motion.div>
        </div>

        <p
          className="font-semibold text-white"
          style={{ fontSize: "1.1rem", marginBottom: "4px" }}
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

function FocusArea({
  area,
  index,
}: {
  area: (typeof FOCUS_AREAS)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="py-16"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease }}
    >
      <h3
        className="font-semibold mb-8"
        style={{
          fontSize: "1.3rem",
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.02em",
        }}
      >
        {area.title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
        {area.items.map((item, i) => (
          <motion.p
            key={item}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}
            style={{
              fontSize: "0.88rem",
              color: "rgba(255,255,255,0.25)",
              lineHeight: 2,
            }}
          >
            {item}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
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
          About Us
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
          Team
        </motion.h1>
      </div>

      {/* Intro */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto mb-24">
        <Reveal>
          <p
            className="max-w-3xl"
            style={{
              fontSize: "clamp(1rem, 1.7vw, 1.15rem)",
              lineHeight: 2,
              color: "rgba(255,255,255,0.42)",
            }}
          >
            We are the lean, no-overhead math community built for students who
            want more than textbook learning. We merge competition training,
            research mentorship, and social connection in one tight unit —
            pairing rigorous thinking with genuine enthusiasm and no-nonsense
            collaboration.
          </p>
        </Reveal>
      </div>

      {/* Focus Areas */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto mb-32">
        <Reveal>
          <span
            style={{
              fontSize: "0.56rem",
              letterSpacing: "0.4em",
              color: "rgba(255,255,255,0.15)",
              textTransform: "uppercase",
            }}
          >
            Our Focus
          </span>
        </Reveal>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }} className="mt-8">
          {FOCUS_AREAS.map((area, i) => (
            <FocusArea key={area.title} area={area} index={i} />
          ))}
        </div>
      </div>

      {/* Leadership */}
      <div
        className="px-7 md:px-14 max-w-6xl mx-auto"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="pt-32">
          <Reveal>
            <div className="flex items-center gap-6 mb-20">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {MEMBERS.map((m, i) => (
              <MemberCard key={m.name} member={m} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
