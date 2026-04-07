"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────── Types & Deck ─────────── */
type Suit = "♠" | "♥" | "♦" | "♣";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
interface Card { suit: Suit; rank: Rank; id: string }
type Phase = "idle" | "playing" | "done";
type Result = "blackjack" | "win" | "push" | "bust" | "dealer-bust" | "lose" | null;

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const RED = new Set<Suit>(["♥", "♦"]);
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

function makeDeck(): Card[] {
  const d: Card[] = [];
  for (const s of SUITS) for (const r of RANKS)
    d.push({ suit: s, rank: r, id: `${s}${r}-${Math.random()}` });
  return shuffle(d);
}
function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
function rankValue(r: Rank): number {
  if (r === "A") return 11;
  if (["J", "Q", "K"].includes(r)) return 10;
  return parseInt(r);
}
function handValue(cs: Card[]): number {
  let t = cs.reduce((s, c) => s + rankValue(c.rank), 0);
  let a = cs.filter(c => c.rank === "A").length;
  while (t > 21 && a-- > 0) t -= 10;
  return t;
}
function isBlackjack(cs: Card[]) { return cs.length === 2 && handValue(cs) === 21; }

/* ─────────── Card sizes ─────────── */
const W = 56, H = 84;

/* ─────────── Placeholder card (idle) ─────────── */
function PlaceholderCard() {
  return (
    <div style={{
      width: W, height: H, flexShrink: 0,
      background: "linear-gradient(145deg, #060e25 0%, #0c1738 100%)",
      border: "1px solid rgba(255,255,255,0.055)",
      borderRadius: 5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        width: "52%", height: "52%",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.06)" }}>?</span>
      </div>
    </div>
  );
}

/* ─────────── Face-down card ─────────── */
function HiddenCard({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ y: -24, opacity: 0, rotateY: 90 }}
      animate={{ y: 0, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.35, delay, ease }}
      style={{
        width: W, height: H, flexShrink: 0,
        background: "linear-gradient(145deg, #060e25, #0c1738)",
        border: "1px solid rgba(255,255,255,0.055)",
        borderRadius: 5,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.4rem", color: "rgba(255,255,255,0.04)",
      }}
    >
      ✦
    </motion.div>
  );
}

/* ─────────── Playing card (face-up) ─────────── */
function HeroCard({ card, delay = 0 }: { card: Card; delay?: number }) {
  const isRed = RED.has(card.suit);
  return (
    <motion.div
      initial={{ y: -24, opacity: 0, rotateY: 90 }}
      animate={{ y: 0, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.35, delay, ease }}
      style={{
        width: W, height: H, flexShrink: 0,
        background: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 5,
        padding: "5px 6px",
        position: "relative",
        boxShadow: "0 4px 18px rgba(0,0,0,0.6)",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontSize: "0.76rem", fontWeight: 700, color: isRed ? "#c0322d" : "#111" }}>{card.rank}</div>
        <div style={{ fontSize: "0.6rem", color: isRed ? "#c0322d" : "#111" }}>{card.suit}</div>
      </div>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.5rem", color: isRed ? "#c0322d" : "#111", opacity: 0.6,
      }}>{card.suit}</div>
      <div style={{ position: "absolute", bottom: 5, right: 6, transform: "rotate(180deg)", lineHeight: 1.1 }}>
        <div style={{ fontSize: "0.76rem", fontWeight: 700, color: isRed ? "#c0322d" : "#111" }}>{card.rank}</div>
        <div style={{ fontSize: "0.6rem", color: isRed ? "#c0322d" : "#111" }}>{card.suit}</div>
      </div>
    </motion.div>
  );
}

/* ─────────── Score badge ─────────── */
function Score({ value, bust }: { value: number; bust?: boolean }) {
  return (
    <span style={{
      fontSize: "0.68rem",
      fontFamily: "var(--font-jetbrains-mono)",
      fontWeight: 600,
      color: bust ? "#e84040" : "rgba(255,255,255,0.35)",
      letterSpacing: "0.04em",
      minWidth: 20,
    }}>
      {value}
    </span>
  );
}

/* ─────────── Button ─────────── */
function GameBtn({
  children, onClick, disabled, primary,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="game-btn"
      style={{
        padding: "8px 20px",
        fontSize: "0.5rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        fontWeight: 600,
        background: primary && !disabled ? "rgba(255,255,255,0.09)" : "transparent",
        color: disabled ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.65)",
        border: `1px solid ${disabled ? "rgba(255,255,255,0.05)" : primary ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 3,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.18s ease",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

/* ─────────── Hand row ─────────── */
function HandRow({
  label,
  cards,
  phase,
  showHidden,
  score,
}: {
  label: string;
  cards: Card[];
  phase: Phase;
  showHidden?: boolean; // second card face-down
  score: number;
}) {
  const isIdle = phase === "idle";
  const isBust = score > 21;

  return (
    <div>
      {/* Label + score */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: "0.42rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>
          {label}
        </span>
        <Score value={score} bust={isBust} />
      </div>

      {/* Cards */}
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {isIdle ? (
          <>
            <PlaceholderCard />
            <PlaceholderCard />
          </>
        ) : (
          cards.map((c, i) => (
            showHidden && i === 1
              ? <HiddenCard key={c.id} delay={i * 0.08} />
              : <HeroCard key={c.id} card={c} delay={i * 0.08} />
          ))
        )}
      </div>
    </div>
  );
}

/* ─────────── Result banner ─────────── */
const RESULTS: Record<NonNullable<Result>, { text: string; color: string }> = {
  blackjack: { text: "Blackjack!", color: "#f0c040" },
  win: { text: "You win", color: "rgba(80,220,140,0.9)" },
  push: { text: "Push", color: "rgba(255,255,255,0.35)" },
  bust: { text: "Bust", color: "#e84040" },
  "dealer-bust": { text: "Dealer busts — you win", color: "rgba(80,220,140,0.9)" },
  lose: { text: "Dealer wins", color: "#e84040" },
};

/* ─────────── Main ─────────── */
export default function BlackjackGame() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [player, setPlayer] = useState<Card[]>([]);
  const [dealer, setDealer] = useState<Card[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result>(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const resolve = useCallback((p: Card[], d: Card[], w: number, l: number) => {
    const pv = handValue(p), dv = handValue(d);
    let r: Result;
    if (isBlackjack(p)) r = "blackjack";
    else if (pv > 21) r = "bust";
    else if (dv > 21) r = "dealer-bust";
    else if (pv > dv) r = "win";
    else if (pv === dv) r = "push";
    else r = "lose";
    const won = r === "blackjack" || r === "win" || r === "dealer-bust";
    const lost = r === "bust" || r === "lose";
    setResult(r);
    setPhase("done");
    setWins(won ? w + 1 : w);
    setLosses(lost ? l + 1 : l);
  }, []);

  const deal = useCallback(() => {
    const d = makeDeck();
    const p = [d[0], d[2]];
    const dl = [d[1], d[3]];
    setDeck(d.slice(4));
    setPlayer(p);
    setDealer(dl);
    setResult(null);
    if (isBlackjack(p)) { resolve(p, dl, wins, losses); }
    else setPhase("playing");
  }, [wins, losses, resolve]);

  const hit = useCallback(() => {
    if (phase !== "playing") return;
    const [card, ...rest] = deck;
    const p = [...player, card];
    setPlayer(p); setDeck(rest);
    if (handValue(p) > 21) resolve(p, dealer, wins, losses);
  }, [phase, deck, player, dealer, wins, losses, resolve]);

  const stand = useCallback(() => {
    if (phase !== "playing") return;
    let d = [...dealer], rem = [...deck];
    while (handValue(d) < 17) { const [c, ...r] = rem; d = [...d, c]; rem = r; }
    setDealer(d); setDeck(rem);
    resolve(player, d, wins, losses);
  }, [phase, dealer, deck, player, wins, losses, resolve]);

  const pv = phase === "idle" ? 0 : player.length ? handValue(player) : 0;
  const dv = phase === "done" && dealer.length ? handValue(dealer) : 0;

  return (
    <div style={{ width: "100%", maxWidth: 440 }}>
      {/* Title row */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: "0.44rem", letterSpacing: "0.35em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.18)",
            lineHeight: 1,
          }}>Blackjack</span>
        </div>
        <span style={{
          fontSize: "0.56rem",
          fontFamily: "var(--font-jetbrains-mono)",
          color: "rgba(255,255,255,0.14)",
          letterSpacing: "0.06em",
        }}>
          W {wins} · L {losses}
        </span>
      </div>

      {/* Game panel */}
      <div style={{
        border: "1px solid rgba(255,255,255,0.065)",
        borderRadius: 8,
        padding: "22px 24px",
        background: "rgba(2,6,20,0.7)",
        backdropFilter: "blur(12px)",
      }}>
        {/* Dealer */}
        <HandRow
          label="Dealer"
          cards={dealer}
          phase={phase}
          showHidden={phase === "playing"}
          score={dv}
        />

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "18px 0" }} />

        {/* Player */}
        <HandRow
          label="Your Hand"
          cards={player}
          phase={phase}
          score={pv}
        />

        {/* Result */}
        <div style={{ minHeight: 28, marginTop: 10 }}>
          <AnimatePresence mode="wait">
            {result && (
              <motion.p
                key={result}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: RESULTS[result].color,
                }}
              >
                {RESULTS[result].text}
              </motion.p>
            )}
            {phase === "idle" && !result && (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  fontSize: "0.46rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.1)",
                }}
              >
                Deal to start a new game
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <GameBtn onClick={deal} primary>
          {phase === "idle" ? "Deal" : "New Game"}
        </GameBtn>
        <GameBtn onClick={hit} disabled={phase !== "playing"}>Hit</GameBtn>
        <GameBtn onClick={stand} disabled={phase !== "playing"}>Stand</GameBtn>
      </div>
    </div>
  );
}
