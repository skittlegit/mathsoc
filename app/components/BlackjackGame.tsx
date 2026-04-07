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

/* ─────────── Card dimensions ─────────── */
const W = 52, H = 76;
const STACK_OFFSET = 24;

/* ─────────── Placeholder card ─────────── */
function PlaceholderCard() {
  return (
    <div style={{
      width: W, height: H, flexShrink: 0,
      background: "rgba(255,255,255,0.02)",
      border: "1px dashed rgba(255,255,255,0.06)",
      borderRadius: 6,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.06)", fontWeight: 300 }}>?</span>
    </div>
  );
}

/* ─────────── Face-down card ─────────── */
function HiddenCard({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0, rotateY: 90 }}
      animate={{ y: 0, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.35, delay, ease }}
      style={{
        width: W, height: H, flexShrink: 0,
        background: "linear-gradient(145deg, #0a1530, #0d1a3d)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div style={{
        width: 22, height: 22,
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 3,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.08)" }}>?</span>
      </div>
    </motion.div>
  );
}

/* ─────────── Playing card (face-up) ─────────── */
function FaceCard({ card, delay = 0 }: { card: Card; delay?: number }) {
  const isRed = RED.has(card.suit);
  const col = isRed ? "#c0322d" : "#1a1a2e";
  return (
    <motion.div
      initial={{ y: -20, opacity: 0, rotateY: 90 }}
      animate={{ y: 0, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.35, delay, ease }}
      style={{
        width: W, height: H, flexShrink: 0,
        background: "#f5f5f0",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 6,
        padding: "4px 5px",
        position: "relative",
        boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: col }}>{card.rank}</div>
        <div style={{ fontSize: "0.55rem", color: col, marginTop: -1 }}>{card.suit}</div>
      </div>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.35rem", color: col, opacity: 0.5,
      }}>{card.suit}</div>
      <div style={{ position: "absolute", bottom: 4, right: 5, transform: "rotate(180deg)", lineHeight: 1 }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: col }}>{card.rank}</div>
        <div style={{ fontSize: "0.55rem", color: col, marginTop: -1 }}>{card.suit}</div>
      </div>
    </motion.div>
  );
}

/* ─────────── GameBtn ─────────── */
function GameBtn({
  children, onClick, disabled, variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "primary";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 22px",
        fontSize: "0.5rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontWeight: 600,
        background: variant === "primary" && !disabled ? "rgba(255,255,255,0.08)" : "transparent",
        color: disabled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.6)",
        border: `1px solid ${disabled ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 4,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.18s ease",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

/* ─────────── Result banner ─────────── */
const RESULTS: Record<NonNullable<Result>, { text: string; color: string }> = {
  blackjack: { text: "Blackjack!", color: "#f0c040" },
  win: { text: "You win", color: "rgba(80,220,140,0.9)" },
  push: { text: "Push", color: "rgba(255,255,255,0.35)" },
  bust: { text: "Bust", color: "#e84040" },
  "dealer-bust": { text: "Dealer busts", color: "rgba(80,220,140,0.9)" },
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
    <div style={{
      width: "100%",
      background: "rgba(255,255,255,0.016)",
      border: "1px solid rgba(255,255,255,0.055)",
      borderRadius: 10,
      padding: "20px 18px 18px",
    }}>
      {/* Header — idle shows "Start a new game", playing shows score */}
      <div style={{ marginBottom: 18, textAlign: "center" }}>
        <AnimatePresence mode="wait">
          {phase === "idle" && !result && (
            <motion.p
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: "0.52rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.18)",
              }}
            >
              Start a new game
            </motion.p>
          )}
          {result && (
            <motion.p
              key={result}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
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
          {phase === "playing" && (
            <motion.p
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: "0.46rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.14)",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              W {wins} · L {losses}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Dealer hand */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{
            fontSize: "0.42rem", letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.18)",
          }}>Dealer</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
          <span style={{
            fontSize: "0.65rem", fontFamily: "var(--font-jetbrains-mono)",
            fontWeight: 600, color: dv > 21 ? "#e84040" : "rgba(255,255,255,0.25)",
            minWidth: 16, textAlign: "right",
          }}>{dv}</span>
        </div>
        <div style={{ position: "relative", height: H + STACK_OFFSET * 3 }}>
          {phase === "idle" ? (
            <>
              <div style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}><PlaceholderCard /></div>
              <div style={{ position: "absolute", left: STACK_OFFSET, top: 0, zIndex: 2 }}><PlaceholderCard /></div>
            </>
          ) : (
            dealer.map((c, i) => (
              <div key={c.id} style={{ position: "absolute", left: i * STACK_OFFSET, top: 0, zIndex: i + 1 }}>
                {phase === "playing" && i === 1
                  ? <HiddenCard delay={i * 0.08} />
                  : <FaceCard card={c} delay={i * 0.08} />}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Player hand */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{
            fontSize: "0.42rem", letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.18)",
          }}>Your Hand</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
          <span style={{
            fontSize: "0.65rem", fontFamily: "var(--font-jetbrains-mono)",
            fontWeight: 600, color: pv > 21 ? "#e84040" : "rgba(255,255,255,0.25)",
            minWidth: 16, textAlign: "right",
          }}>{pv}</span>
        </div>
        <div style={{ position: "relative", height: H + STACK_OFFSET * 3 }}>
          {phase === "idle" ? (
            <>
              <div style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}><PlaceholderCard /></div>
              <div style={{ position: "absolute", left: STACK_OFFSET, top: 0, zIndex: 2 }}><PlaceholderCard /></div>
            </>
          ) : (
            player.map((c, i) => (
              <div key={c.id} style={{ position: "absolute", left: i * STACK_OFFSET, top: 0, zIndex: i + 1 }}>
                <FaceCard card={c} delay={i * 0.08} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {phase === "idle" || phase === "done" ? (
          <GameBtn onClick={deal} variant="primary">
            {phase === "idle" ? "Deal Cards" : "New Game"}
          </GameBtn>
        ) : (
          <>
            <GameBtn onClick={hit} variant="primary">Hit</GameBtn>
            <GameBtn onClick={stand}>Stand</GameBtn>
          </>
        )}
      </div>
    </div>
  );
}
