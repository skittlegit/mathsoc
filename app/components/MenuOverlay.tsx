"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/types";

const MENU_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Team", href: "/team" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export default function MenuOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "rgba(0, 0, 0, 0.98)" }}
          initial={{ clipPath: "circle(0% at calc(100% - 48px) 48px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 48px) 48px)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 48px) 48px)" }}
          transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
        >
          <button
            onClick={onClose}
            className="absolute top-8 right-8 md:top-5 md:right-14 w-8 h-8 flex items-center justify-center text-white font-semibold cursor-pointer bg-transparent border-none"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Close
          </button>

          <nav className="flex flex-col items-center gap-3">
            {MENU_LINKS.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  delay: 0.12 + i * 0.07,
                  duration: 0.6,
                  ease: EASE,
                }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="text-white font-bold uppercase hover:opacity-40 transition-opacity duration-300"
                  style={{
                    fontSize: "clamp(2.2rem, 7vw, 4.5rem)",
                    letterSpacing: "0.12em",
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.p
            className="absolute bottom-10"
            style={{
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.06)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            e^(iπ) + 1 = 0
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
