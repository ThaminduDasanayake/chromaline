"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeartIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ══ Like ═════════════════════════════════════════════════
A heart and a count. Press it and the heart vanishes, a disc
blooms where it was and hollows out into a ring, seven pairs
of coloured dots burst off the ring, and the heart springs
back in red and past its size — while the count rolls up one.
Press again and it empties and the count rolls back down.

── ONLY THE DIGITS THAT CHANGE ROLL ────────────────────
An odometer, not a number being replaced: 1,284 to 1,285
turns the last wheel and leaves the rest where they are,
and 1,299 to 1,300 turns three, each a beat after the one
to its right, the way a carry travels. Every digit is keyed
by its place and its value, so a digit that did not change
is the same element and never moves.

── UP FOR MORE, DOWN FOR LESS ─────────────────────────
Liking rolls the new digit in from below and the old one out
the top; unliking runs the other way. Direction is the whole
difference between a count going up and a count being
replaced. ═════════════════════════════════════════════════ */

const H = 44;
const RED = "#e5484d";
/* Confetti palette: a pair of dots per spoke, never the same colour twice in a pair */
const CONFETTI = ["#f48ea7", "#cc8ef5", "#8ce8c3", "#91d2fa", "#f5a524", "#e5484d", "#9fc7fa"];

export const EFFECTS = ["Bloom", "Firework"] as const;
export type LikeEffect = (typeof EFFECTS)[number];
export type LikeColor = "Red" | "Ink";
export type LikeFill = "light" | "dark" | "auto";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const fmt = (n: number) => n.toLocaleString("en-US");

/* A spread of fixed pseudo-random numbers, one per particle */
const jit = (k: number, seed: number) => {
  const x = Math.sin(k * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export interface RollProps {
  value: number;
  up: boolean;
  className?: string;
}

export function Roll({ value, up, className }: RollProps) {
  const chars = fmt(value).split("");
  /* Places counted from the right, so a new leading digit does
     not shift the keys of the ones already there */
  return (
    <span className={cn("lk-count", className)} aria-hidden="true">
      {chars.map((c, i) => {
        const place = chars.length - 1 - i;
        if (c === ",") return <span key={`c${place}`} className="lk-comma">,</span>;
        return (
          <span key={`p${place}`} className="lk-wheel">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={c}
                className="lk-digit"
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

export interface BurstProps {
  fx: LikeEffect;
  fly: number;
  ink: boolean;
}

export function Burst({ fx, fly, ink }: BurstProps) {
  const c = (k: number) => (ink ? "var(--lk-on)" : CONFETTI[k % CONFETTI.length]);
  const style = (o: Record<string, string | number>) => o as React.CSSProperties;

  if (fx === "Firework") {
    /* Thrown up and out, then they fall: x is steady, y is its own element on a rise-then-drop curve */
    return (
      <>
        {Array.from({ length: 12 }, (_, k) => {
          const a = -Math.PI / 2 + (k / 11 - 0.5) * Math.PI * 1.25;
          const v = 22 + fly * 22 + jit(k, 7) * 10;
          return (
            <span
              key={k}
              className="lk-fw"
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
      <span className="lk-bloom" />
      {Array.from({ length: 7 }, (_, k) => (
        <span
          key={k}
          className="lk-spoke"
          style={style({ "--a": `${k * (360 / 7) - 90}deg` })}
        >
          <i style={style({ "--c": c(k) })} />
          <i style={style({ "--c": c(k + 3) })} />
        </span>
      ))}
    </>
  );
}

export interface LikeProps {
  /** The count before you press (default: 1300) */
  start?: number;
  /** Current count (controlled mode) */
  count?: number;
  /** Liked state (controlled mode) */
  liked?: boolean;
  /** Initial liked state when uncontrolled (default: false) */
  defaultLiked?: boolean;
  /** Callback fired when liked state changes */
  onLikeChange?: (liked: boolean, count: number) => void;
  /** How the like lands: "Bloom" | "Firework" (default: "Bloom") */
  effect?: LikeEffect;
  /** How far the particles fly, 0..100 (default: 50) */
  burst?: number;
  /** Color palette of the like icon: "Red" | "Ink" (default: "Red") */
  color?: LikeColor;
  /** Corner radius in pixels, 0..22 (default: 22) */
  corner?: number;
  /** Surface fill mode: "light" | "dark" | "auto" (default: "auto") */
  fill?: LikeFill;
  /** Subtle border outline stroke (default: false) */
  stroke?: boolean;
  /** Custom wrapper class */
  className?: string;
  /** Custom button class */
  buttonClassName?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export function Like({
  start = 1300,
  count: controlledCount,
  liked: controlledLiked,
  defaultLiked = false,
  onLikeChange,
  effect = "Bloom",
  burst = 50,
  color = "Red",
  corner = H / 2,
  fill = "auto",
  stroke = false,
  className,
  buttonClassName,
  style,
}: LikeProps) {
  const isControlled = controlledLiked !== undefined;
  const [internalLiked, setInternalLiked] = useState(defaultLiked);
  const [beat, setBeat] = useState(0);

  const isLiked = isControlled ? controlledLiked : internalLiked;
  const base = Math.max(0, Math.round(start));
  const currentCount = controlledCount !== undefined ? controlledCount : base + (isLiked ? 1 : 0);

  const fly = clamp(burst, 0, 100) / 100;
  const r = clamp(corner, 0, H / 2);
  const ink = color === "Ink";
  const fx = (EFFECTS as readonly string[]).includes(effect) ? effect : "Bloom";

  const getInkColor = () => {
    if (fill === "light") return "#17181a";
    if (fill === "dark") return "#ffffff";
    return "var(--color-ink, #17181a)";
  };

  const lkOnColor = ink ? getInkColor() : RED;

  const press = () => {
    const nextLiked = !isLiked;
    const nextCount = nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1);

    if (!isControlled) {
      setInternalLiked(nextLiked);
    }

    if (nextLiked) {
      setBeat((b) => b + 1);
    }

    onLikeChange?.(nextLiked, nextCount);
  };

  return (
    <div className={cn("lk-frame", className)}>
      <button
        type="button"
        className={cn(
          "lk",
          fill === "light" && "bg-white text-[#17181a] shadow-xs",
          fill === "dark" && "bg-[#18181b] text-white shadow-xs",
          fill === "auto" && "bg-white text-[#17181a] dark:bg-[#18181b] dark:text-white shadow-xs",
          buttonClassName
        )}
        data-liked={isLiked || undefined}
        data-color={color}
        data-fx={fx}
        data-fill={fill !== "auto" ? fill : undefined}
        data-stroke={stroke ? "on" : "off"}
        aria-pressed={isLiked}
        aria-label={`Like. ${fmt(currentCount)} likes`}
        style={
          {
            height: H,
            "--r": `${r}px`,
            "--lk-on": lkOnColor,
            borderRadius: `${r}px`,
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
        <span className="lk-heart">
          {/* Keyed by the press, so every like plays freshly */}
          <span
            key={isLiked ? `on${beat}` : "off"}
            className="lk-glyph"
            data-on={isLiked || undefined}
            style={{ color: isLiked ? lkOnColor : undefined }}
          >
            <HeartIcon
              size={20}
              weight={isLiked ? "fill" : "bold"}
              className="transition-colors duration-150"
            />
          </span>
          {isLiked && fly > 0 && (
            <span
              key={beat}
              className="lk-burst"
              style={{ "--fly": fly } as React.CSSProperties}
              aria-hidden="true"
            >
              <Burst fx={fx} fly={fly} ink={ink} />
            </span>
          )}
        </span>
        <Roll value={currentCount} up={isLiked} />
      </button>
    </div>
  );
}
