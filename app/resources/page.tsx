"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const RESOURCES = [
  {
    category: "Books",
    items: [
      {
        title: "How to Solve It",
        author: "George Pólya",
        desc: "The classic guide to mathematical problem-solving heuristics.",
        url: "https://en.wikipedia.org/wiki/How_to_Solve_It",
      },
      {
        title: "Proofs from THE BOOK",
        author: "Aigner & Ziegler",
        desc: "Beautiful proofs that Erdős would say came from God's own book.",
        url: "https://en.wikipedia.org/wiki/Proofs_from_THE_BOOK",
      },
      {
        title: "The Art and Craft of Problem Solving",
        author: "Paul Zeitz",
        desc: "Essential for competition preparation and mathematical thinking.",
        url: "https://www.wiley.com/en-us/The+Art+and+Craft+of+Problem+Solving%2C+3rd+Edition-p-9781119239901",
      },
      {
        title: "Linear Algebra Done Right",
        author: "Sheldon Axler",
        desc: "The elegant, determinant-free approach to linear algebra.",
        url: "https://linear.axler.net/",
      },
      {
        title: "Principles of Mathematical Analysis",
        author: "Walter Rudin",
        desc: "Baby Rudin. The rite of passage for every analysis student.",
        url: "https://en.wikipedia.org/wiki/Principles_of_Mathematical_Analysis",
      },
      {
        title: "Concrete Mathematics",
        author: "Graham, Knuth, Patashnik",
        desc: "A foundation for computer science, grounded in discrete math.",
        url: "https://en.wikipedia.org/wiki/Concrete_Mathematics",
      },
    ],
  },
  {
    category: "Online Platforms",
    items: [
      {
        title: "Art of Problem Solving",
        author: "aops.com",
        desc: "Community, courses, and the legendary MATHCOUNTS/AMC resources.",
        url: "https://artofproblemsolving.com/",
      },
      {
        title: "Project Euler",
        author: "projecteuler.net",
        desc: "Math + programming challenges. 800+ problems and counting.",
        url: "https://projecteuler.net/",
      },
      {
        title: "3Blue1Brown",
        author: "youtube.com",
        desc: "Grant Sanderson's visual, intuitive math explanations.",
        url: "https://www.youtube.com/@3blue1brown",
      },
      {
        title: "MIT OpenCourseWare",
        author: "ocw.mit.edu",
        desc: "Full MIT math courses, problem sets, and lecture videos — free.",
        url: "https://ocw.mit.edu/",
      },
    ],
  },
  {
    category: "Tools",
    items: [
      {
        title: "LaTeX / Overleaf",
        author: "overleaf.com",
        desc: "The standard for typesetting mathematical documents.",
        url: "https://www.overleaf.com/",
      },
      {
        title: "Desmos",
        author: "desmos.com",
        desc: "Beautiful, fast graphing calculator. Essential for visualization.",
        url: "https://www.desmos.com/calculator",
      },
      {
        title: "GeoGebra",
        author: "geogebra.org",
        desc: "Dynamic geometry, algebra, and calculus — all in one place.",
        url: "https://www.geogebra.org/",
      },
      {
        title: "Wolfram Alpha",
        author: "wolframalpha.com",
        desc: "Computational knowledge engine. The Swiss army knife of math.",
        url: "https://www.wolframalpha.com/",
      },
    ],
  },
];

function ResourceSection({
  section,
  index,
}: {
  section: (typeof RESOURCES)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      className="mb-14 md:mb-24"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease }}
    >
      <h2
        className="font-semibold mb-10"
        style={{
          fontSize: "1.3rem",
          color: "rgba(255,255,255,0.6)",
          letterSpacing: "0.02em",
        }}
      >
        {section.category}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {section.items.map((item, i) => (
          <motion.a
            key={item.title}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease }}
            className="group p-6 transition-colors duration-300 block"
            style={{
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.01)",
              textDecoration: "none",
            }}
          >
            <h3
              className="font-semibold mb-1 group-hover:text-white transition-colors duration-300"
              style={{
                fontSize: "1rem",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {item.title}
            </h3>
            <p
              className="mb-3"
              style={{
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.15)",
                letterSpacing: "0.1em",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              {item.author}
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.22)",
                lineHeight: 1.7,
              }}
            >
              {item.desc}
            </p>
            <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span style={{ fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Open</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M8 3l5 5-5 5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}

export default function ResourcesPage() {
  return (
    <div className="pt-24 md:pt-44 pb-24 overflow-x-hidden">
      {/* Page Hero */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto mb-10 md:mb-20">
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
          Learn & Explore
        </motion.span>

        <motion.h1
          className="font-bold uppercase mt-6 mb-10"
          style={{
            fontSize: "clamp(2rem, 9.5vw, 9rem)",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.9)",
            lineHeight: 0.9,
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease }}
        >
          Resources
        </motion.h1>

        <motion.p
          className="max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            fontSize: "clamp(1rem, 1.7vw, 1.15rem)",
            lineHeight: 2,
            color: "rgba(255,255,255,0.35)",
          }}
        >
          Our curated collection of books, platforms, and tools. Whether
          you&apos;re preparing for competitions, diving into research, or just
          exploring — start here.
        </motion.p>
      </div>

      {/* Resource Sections */}
      <div className="px-7 md:px-14 max-w-6xl mx-auto">
        {RESOURCES.map((section, i) => (
          <ResourceSection key={section.category} section={section} index={i} />
        ))}
      </div>
    </div>
  );
}
