"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ═══════════════════════════════════════════════
   TYPES & DECK
═══════════════════════════════════════════════ */

type Suit = "♠" | "♥" | "♦" | "♣";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

interface Card {
  suit: Suit;
  rank: Rank;
  id: string; // unique per deal for animation key
}

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const RED_SUITS = new Set<Suit>(["♥", "♦"]);

function makeDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, id: `${suit}${rank}-${Math.random()}` });
    }
  }
  return shuffle(deck);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rankValue(rank: Rank): number {
  if (rank === "A") return 11;
  if (["J", "Q", "K"].includes(rank)) return 10;
  return parseInt(rank);
}

function handValue(cards: Card[]): number {
  let total = cards.reduce((s, c) => s + rankValue(c.rank), 0);
  let aces = cards.filter((c) => c.rank === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function isBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && handValue(cards) === 21;
}

type Phase = "idle" | "playing" | "dealer" | "done";
type Result = "blackjack" | "win" | "push" | "bust" | "dealer-bust" | "lose" | null;

/* ═══════════════════════════════════════════════
   CARD COMPONENT
═══════════════════════════════════════════════ */

function PlayingCard({
  card,
  hidden,
  delay = 0,
}: {
  card: Card;
  hidden?: boolean;
  delay?: number;
}) {
  const isRed = RED_SUITS.has(card.suit);

  if (hidden) {
    return (
      <motion.div
        initial={{ y: -60, opacity: 0, rotateY: 90 }}
        animate={{ y: 0, opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.4, delay, ease }}
        className="shrink-0 rounded-md border select-none"
        style={{
          width: 72,
          height: 108,
          background: "linear-gradient(135deg, #0a0f2e 0%, #111840 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.8rem",
          color: "rgba(255,255,255,0.06)",
        }}
      >
        ?
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: -60, opacity: 0, rotateY: 90 }}
      animate={{ y: 0, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.4, delay, ease }}
      className="shrink-0 rounded-md select-none relative"
      style={{
        width: 72,
        height: 108,
        background: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(255,255,255,0.15)",
        display: "flex",
        flexDirection: "column",
        padding: "6px 7px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      {/* Top-left rank + suit */}
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: isRed ? "#c0322d" : "#111" }}>
          {card.rank}
        </div>
        <div style={{ fontSize: "0.75rem", color: isRed ? "#c0322d" : "#111", marginTop: "-1px" }}>
          {card.suit}
        </div>
      </div>

      {/* Center suit */}
      <div
        className="absolute"
        style={{
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          color: isRed ? "#c0322d" : "#111",
          opacity: 0.75,
        }}
      >
        {card.suit}
      </div>

      {/* Bottom-right (rotated) */}
      <div style={{ lineHeight: 1, position: "absolute", bottom: "6px", right: "7px", transform: "rotate(180deg)" }}>
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: isRed ? "#c0322d" : "#111" }}>
          {card.rank}
        </div>
        <div style={{ fontSize: "0.75rem", color: isRed ? "#c0322d" : "#111", marginTop: "-1px" }}>
          {card.suit}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   HAND DISPLAY
═══════════════════════════════════════════════ */

function Hand({
  label,
  cards,
  hideSecond,
  score,
}: {
  label: string;
  cards: Card[];
  hideSecond?: boolean;
  score: number | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span style={{ fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
          {label}
        </span>
        {score !== null && (
          <AnimatePresence>
            <motion.span
              key={score}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: score > 21 ? "#e84040" : "rgba(255,255,255,0.65)",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              {hideSecond ? "?" : score}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {cards.map((card, i) => (
          <PlayingCard
            key={card.id}
            card={card}
            hidden={hideSecond && i === 1}
            delay={i * 0.1}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   RESULT BADGE
═══════════════════════════════════════════════ */

const RESULT_COPY: Record<NonNullable<Result>, { label: string; sub: string; color: string }> = {
  blackjack: { label: "Blackjack!", sub: "Natural 21 — you win 🃏", color: "#f5d06e" },
  win: { label: "You Win", sub: "Higher hand wins", color: "#4ade80" },
  push: { label: "Push", sub: "It's a tie", color: "rgba(255,255,255,0.6)" },
  bust: { label: "Bust", sub: "Over 21 — dealer wins", color: "#e84040" },
  "dealer-bust": { label: "Dealer Busts!", sub: "You win 🎉", color: "#4ade80" },
  lose: { label: "Dealer Wins", sub: "Better luck next time", color: "#e84040" },
};

function ResultBadge({ result, wins, losses }: { result: Result; wins: number; losses: number }) {
  if (!result) return null;
  const { label, sub, color } = RESULT_COPY[result];
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="text-center"
      >
        <p className="font-bold" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color, letterSpacing: "-0.01em" }}>
          {label}
        </p>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>{sub}</p>
        <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.18)", marginTop: "12px", fontFamily: "var(--font-jetbrains-mono)", textTransform: "uppercase" }}>
          W {wins} · L {losses}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════
   GAME LOGIC
═══════════════════════════════════════════════ */

export default function BlackjackPage() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result>(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const drawFrom = useCallback(
    (d: Card[]): [Card, Card[]] => {
      const [top, ...rest] = d;
      return [top, rest];
    },
    []
  );

  const deal = useCallback(() => {
    const fresh = makeDeck();
    const [c1, d1] = drawFrom(fresh);
    const [c2, d2] = drawFrom(d1);
    const [c3, d3] = drawFrom(d2);
    const [c4, d4] = drawFrom(d3);

    const pHand = [c1, c2];
    const dHand = [c3, c4];

    setDeck(d4);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setResult(null);

    // Check player blackjack immediately
    if (isBlackjack(pHand)) {
      setPhase("done");
      if (isBlackjack(dHand)) {
        setResult("push");
      } else {
        setResult("blackjack");
        setWins((w) => w + 1);
      }
    } else {
      setPhase("playing");
    }
  }, [drawFrom]);

  const hit = useCallback(() => {
    if (phase !== "playing" || deck.length === 0) return;
    const [card, rest] = drawFrom(deck);
    const newHand = [...playerHand, card];
    setDeck(rest);
    setPlayerHand(newHand);

    if (handValue(newHand) > 21) {
      setPhase("done");
      setResult("bust");
      setLosses((l) => l + 1);
    }
  }, [phase, deck, playerHand, drawFrom]);

  const stand = useCallback(() => {
    if (phase !== "playing") return;
    setPhase("dealer");

    // Dealer plays to 17+ synchronously (show result after)
    let d = [...dealerHand];
    let remaining = [...deck];

    while (handValue(d) < 17) {
      const [card, ...rest] = remaining;
      d = [...d, card];
      remaining = rest;
    }

    setDealerHand(d);
    setDeck(remaining);
    setPhase("done");

    const pv = handValue(playerHand);
    const dv = handValue(d);

    if (dv > 21) {
      setResult("dealer-bust");
      setWins((w) => w + 1);
    } else if (dv === pv) {
      setResult("push");
    } else if (pv > dv) {
      setResult("win");
      setWins((w) => w + 1);
    } else {
      setResult("lose");
      setLosses((l) => l + 1);
    }
  }, [phase, dealerHand, deck, playerHand]);

  const playerScore = playerHand.length > 0 ? handValue(playerHand) : null;
  const dealerScore =
    phase === "done" || phase === "dealer"
      ? dealerHand.length > 0
        ? handValue(dealerHand)
        : null
      : dealerHand.length > 0
      ? rankValue(dealerHand[0].rank)
      : null;

  const hideSecond = phase === "playing";

  return (
    <div className="pt-32 md:pt-44 pb-24 min-h-screen">
      <div className="px-7 md:px-14 max-w-4xl mx-auto">
        {/* Header */}
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease }}
          style={{ fontSize: "0.56rem", letterSpacing: "0.4em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}
        >
          MathSoc · Game Room
        </motion.span>

        <motion.h1
          className="font-bold uppercase mt-6 mb-4"
          style={{
            fontSize: "clamp(3.5rem, 11vw, 9rem)",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.92)",
            lineHeight: 0.9,
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease }}
        >
          Blackjack
        </motion.h1>

        <motion.p
          style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: "3rem" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Get closer to 21 than the dealer without going over. Aces count as 1 or 11.
        </motion.p>

        {/* Game Table */}
        <motion.div
          className="rounded-lg p-6 md:p-10 flex flex-col gap-10"
          style={{
            background: "linear-gradient(160deg, #020b1a 0%, #030f22 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            minHeight: 480,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease }}
        >
          {phase === "idle" && (
            <div className="flex flex-col items-center justify-center flex-1 gap-6 py-10">
              <span
                className="select-none"
                style={{ fontSize: "4rem", color: "rgba(255,255,255,0.04)" }}
              >
                🃏
              </span>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Press Deal to start
              </p>
            </div>
          )}

          {phase !== "idle" && (
            <>
              {/* Dealer hand */}
              <Hand
                label="Dealer"
                cards={dealerHand}
                hideSecond={hideSecond}
                score={dealerScore}
              />

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(255,255,255,0.04)" }} />

              {/* Player hand */}
              <Hand
                label="You"
                cards={playerHand}
                score={playerScore}
              />

              {/* Result */}
              {result && (
                <ResultBadge result={result} wins={wins} losses={losses} />
              )}
            </>
          )}
        </motion.div>

        {/* Controls */}
        <div className="flex gap-4 mt-6 flex-wrap">
          {/* Deal / New Game */}
          <motion.button
            onClick={deal}
            className="cursor-pointer font-semibold uppercase"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              padding: "14px 32px",
              background: "rgba(255,255,255,0.9)",
              color: "#000",
              border: "none",
              borderRadius: "3px",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {phase === "idle" ? "Deal" : "New Game"}
          </motion.button>

          {/* Hit */}
          <motion.button
            onClick={hit}
            disabled={phase !== "playing"}
            className="cursor-pointer font-semibold uppercase"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              padding: "14px 32px",
              background: "transparent",
              color: phase === "playing" ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.18)",
              border: `1px solid ${phase === "playing" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: "3px",
              cursor: phase !== "playing" ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
            whileHover={phase === "playing" ? { scale: 1.03 } : {}}
            whileTap={phase === "playing" ? { scale: 0.97 } : {}}
          >
            Hit
          </motion.button>

          {/* Stand */}
          <motion.button
            onClick={stand}
            disabled={phase !== "playing"}
            className="cursor-pointer font-semibold uppercase"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              padding: "14px 32px",
              background: "transparent",
              color: phase === "playing" ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.18)",
              border: `1px solid ${phase === "playing" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: "3px",
              cursor: phase !== "playing" ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
            whileHover={phase === "playing" ? { scale: 1.03 } : {}}
            whileTap={phase === "playing" ? { scale: 0.97 } : {}}
          >
            Stand
          </motion.button>
        </div>

        {/* Score tally outside the table */}
        {(wins > 0 || losses > 0) && (
          <motion.div
            className="mt-8 flex gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div>
              <p style={{ fontSize: "0.45rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "4px" }}>
                Wins
              </p>
              <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "#4ade80", lineHeight: 1 }}>
                {wins}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "0.45rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "4px" }}>
                Losses
              </p>
              <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "#e84040", lineHeight: 1 }}>
                {losses}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "0.45rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "4px" }}>
                Win Rate
              </p>
              <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "rgba(255,255,255,0.65)", lineHeight: 1 }}>
                {wins + losses === 0 ? "—" : `${Math.round((wins / (wins + losses)) * 100)}%`}
              </p>
            </div>
          </motion.div>
        )}

        {/* Rules reference */}
        <div
          className="mt-14"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem" }}
        >
          <p style={{ fontSize: "0.48rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)", marginBottom: "1rem" }}>
            Rules
          </p>
          <ul
            style={{
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.3)",
              lineHeight: 2.2,
              fontFamily: "var(--font-jetbrains-mono)",
              listStyleType: "none",
              padding: 0,
            }}
          >
            <li>— Aces count as 1 or 11 (auto-optimized)</li>
            <li>— Face cards (J, Q, K) are worth 10</li>
            <li>— Dealer hits on soft 16 or below, stands on 17+</li>
            <li>— Natural Blackjack (A + 10-value in 2 cards) beats regular 21</li>
            <li>— Bust (over 21) is an automatic loss</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
