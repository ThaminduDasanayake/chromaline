"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookmarkSimpleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ══ Save ═════════════════════════════════════════════════
A bookmark and a count. Press it and the bookmark vanishes,
a disc blooms where it was and hollows out into a ring, six
pairs of coloured dots burst off the ring, and the bookmark
springs back filled and past its size — while the count
rolls up one. Press again and it empties and the count
rolls back down.

── ONLY THE DIGITS THAT CHANGE ROLL ────────────────────
Same odometer mechanism as Like: 1,284 to 1,285 turns only
the last wheel; a carry ripples right-to-left. Every digit
is keyed by its place and value so unchanged digits never
move.

── UP FOR MORE, DOWN FOR LESS ─────────────────────────
Saving rolls the new digit in from below and the old one
out the top; un-saving runs the other way. ═══════════════ */

const H = 44;
const AMBER = "#f59e0b";

/* Confetti palette: bookmark tones — ambers, purples, teals */
const CONFETTI = ["#f59e0b", "#a78bfa", "#34d399", "#60a5fa", "#fb923c", "#e879f9", "#2dd4bf"];

export const SAVE_EFFECTS = ["Bloom", "Firework"] as const;
export type SaveEffect = (typeof SAVE_EFFECTS)[number];
export type SaveColor = "Amber" | "Ink";
export type SaveFill = "light" | "dark" | "auto";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const fmt = (n: number) => n.toLocaleString("en-US");

const jit = (k: number, seed: number) => {
  const x = Math.sin(k * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/* ── Roll (odometer digit strip) ─────────────────────────── */
export interface SaveRollProps {
  value: number;
  up: boolean;
  className?: string;
}

export function SaveRoll({ value, up, className }: SaveRollProps) {
  const chars = fmt(value).split("");
  return (
    <span className={cn("sv-count", className)} aria-hidden="true">
      {chars.map((c, i) => {
        const place = chars.length - 1 - i;
        if (c === ",")
          return (
            <span key={`c${place}`} className="sv-comma">
              ,
            </span>
          );
        return (
          <span key={`p${place}`} className="sv-wheel">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={c}
                className="sv-digit"
                initial={{ y: up ? "100%" : "-100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: up ? "-100%" : "100%", opacity: 0 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: place * 0.04 }}
              >
                {c}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
}

/* ── Burst (particle effects) ─────────────────────────────── */
export interface SaveBurstProps {
  fx: SaveEffect;
  fly: number;
  ink: boolean;
}

export function SaveBurst({ fx, fly, ink }: SaveBurstProps) {
  const c = (k: number) => (ink ? "var(--sv-on)" : CONFETTI[k % CONFETTI.length]);
  const style = (o: Record<string, string | number>) => o as React.CSSProperties;

  if (fx === "Firework") {
    return (
      <>
        {Array.from({ length: 12 }, (_, k) => {
          const a = -Math.PI / 2 + (k / 11 - 0.5) * Math.PI * 1.25;
          const v = 22 + fly * 22 + jit(k, 7) * 10;
          return (
            <span
              key={k}
              className="sv-fw"
              style={style({
                "--x": `${Math.cos(a) * v}px`,
                "--d": `${jit(k, 8) * 60}ms`,
              })}
            >
              <i style={style({ "--y": `${Math.sin(a) * v}px`, background: c(k) })} />
            </span>
          );
        })}
      </>
    );
  }

  /* Bloom: a disc that hollows into a ring, and pairs of confetti */
  return (
    <>
      <span className="sv-bloom" />
      {Array.from({ length: 6 }, (_, k) => (
        <span key={k} className="sv-spoke" style={style({ "--a": `${k * (360 / 6) - 90}deg` })}>
          <i style={style({ "--c": c(k) })} />
          <i style={style({ "--c": c(k + 3) })} />
        </span>
      ))}
    </>
  );
}

/* ── Save component ───────────────────────────────────────── */
export interface SaveProps {
  /** The count before you press (default: 840) */
  start?: number;
  /** Current count (controlled mode) */
  count?: number;
  /** Saved state (controlled mode) */
  saved?: boolean;
  /** Initial saved state when uncontrolled (default: false) */
  defaultSaved?: boolean;
  /** Callback fired when saved state changes */
  onSaveChange?: (saved: boolean, count: number) => void;
  /** How the save lands: "Bloom" | "Firework" (default: "Bloom") */
  effect?: SaveEffect;
  /** How far the particles fly, 0..100 (default: 50) */
  burst?: number;
  /** Color palette of the save icon: "Amber" | "Ink" (default: "Amber") */
  color?: SaveColor;
  /** Corner radius in pixels, 0..22 (default: 22) */
  corner?: number;
  /** Surface fill mode: "light" | "dark" | "auto" (default: "auto") */
  fill?: SaveFill;
  /** Subtle border outline stroke (default: false) */
  stroke?: boolean;
  /** Custom wrapper class */
  className?: string;
  /** Custom button class */
  buttonClassName?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export function Save({
  start = 840,
  count: controlledCount,
  saved: controlledSaved,
  defaultSaved = false,
  onSaveChange,
  effect = "Bloom",
  burst = 50,
  color = "Amber",
  corner = H / 2,
  fill = "auto",
  stroke = false,
  className,
  buttonClassName,
  style,
}: SaveProps) {
  const isControlled = controlledSaved !== undefined;
  const [internalSaved, setInternalSaved] = useState(defaultSaved);
  const [beat, setBeat] = useState(0);

  const isSaved = isControlled ? controlledSaved : internalSaved;
  const base = Math.max(0, Math.round(start));
  const currentCount = controlledCount !== undefined ? controlledCount : base + (isSaved ? 1 : 0);

  const fly = clamp(burst, 0, 100) / 100;
  const r = clamp(corner, 0, H / 2);
  const ink = color === "Ink";
  const fx = (SAVE_EFFECTS as readonly string[]).includes(effect) ? effect : "Bloom";

  const getInkColor = () => {
    if (fill === "light") return "#17181a";
    if (fill === "dark") return "#ffffff";
    return "var(--color-ink, #17181a)";
  };

  const getPillBg = () => {
    if (fill === "light") return "#ffffff";
    if (fill === "dark") return "#262626";
    return undefined;
  };

  const getPillColor = () => {
    if (fill === "light") return "#17181a";
    if (fill === "dark") return "#ffffff";
    return undefined;
  };

  const svOnColor = ink ? getInkColor() : AMBER;

  const press = () => {
    const nextSaved = !isSaved;
    const nextCount = nextSaved ? currentCount + 1 : Math.max(0, currentCount - 1);

    if (!isControlled) {
      setInternalSaved(nextSaved);
    }

    if (nextSaved) {
      setBeat((b) => b + 1);
    }

    onSaveChange?.(nextSaved, nextCount);
  };

  return (
    <div className={cn("sv-frame", className)}>
      <button
        type="button"
        className={cn(
          "sv",
          fill === "light" && "!bg-white !text-[#17181a] shadow-xs",
          fill === "dark" && "!bg-[#262626] !text-white shadow-xs",
          fill === "auto" &&
            "bg-white text-[#17181a] shadow-xs dark:!bg-[#262626] dark:!text-white",
          buttonClassName
        )}
        data-saved={isSaved || undefined}
        data-color={color}
        data-fx={fx}
        data-fill={fill !== "auto" ? fill : undefined}
        data-stroke={stroke ? "on" : "off"}
        aria-pressed={isSaved}
        aria-label={`Save. ${fmt(currentCount)} saves`}
        style={
          {
            height: H,
            "--r": `${r}px`,
            "--sv-on": svOnColor,
            borderRadius: `${r}px`,
            backgroundColor: getPillBg(),
            color: getPillColor(),
            boxShadow: stroke
              ? fill === "dark"
                ? "inset 0 0 0 1px rgba(255, 255, 255, 0.12)"
                : fill === "light"
                  ? "inset 0 0 0 1px rgba(0, 0, 0, 0.08)"
                  : undefined
              : undefined,
            ...style,
          } as React.CSSProperties
        }
        onClick={press}
      >
        <span className="sv-mark">
          {/* Keyed by the press, so every save plays freshly */}
          <span
            key={isSaved ? `on${beat}` : "off"}
            className="sv-glyph"
            data-on={isSaved || undefined}
            style={{ color: isSaved ? svOnColor : undefined }}
          >
            <BookmarkSimpleIcon
              size={20}
              weight={isSaved ? "fill" : "regular"}
              className="transition-colors duration-150"
            />
          </span>
          {isSaved && fly > 0 && (
            <span
              key={beat}
              className="sv-burst"
              style={{ "--fly": fly } as React.CSSProperties}
              aria-hidden="true"
            >
              <SaveBurst fx={fx} fly={fly} ink={ink} />
            </span>
          )}
        </span>
        <SaveRoll value={currentCount} up={isSaved} />
      </button>
    </div>
  );
}
