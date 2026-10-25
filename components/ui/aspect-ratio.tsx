"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * ══ Aspect (Equal-Area Crop Switcher) ═════════════════════════════
 * An image container and three format crops: 4:3 (land), 1:1 (square), and 3:4 (tall).
 *
 * Architecture & Mathematics:
 * - Constant Surface Area: Rather than pinning width and distorting scale, all three formats
 *   maintain the same surface area (within 0.02%):
 *   - Landscape (4:3): 276 x 207 px (~57,132 px²)
 *   - Square (1:1):    239 x 239 px (~57,121 px²)
 *   - Portrait (3:4):  207 x 276 px (~57,132 px²)
 * - Stable Bounding Stage: Every format fits inside a fixed 276x276 px stage, preventing layout shift.
 * - Non-destructive CSS Cover: Changing crops animates width & height independently, preserving corner radius.
 * - Leading Indicator Thumb: The slider thumb travels ahead of the frame transition to convey causation.
 * ═════════════════════════════════════════════════════════════════
 */

/** Multiplier for kinematic morph rate (0: ~1.6x slower, 50: 1.0x baseline 520ms, 100: ~0.4x faster) */
const rate = (speed: number) => 1.6 - (speed / 100) * 1.2;

/* Default 3:4 portrait image for tactile preview */
const DEFAULT_IMAGE = "/mountain.webp";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const W = 276; // Bounding stage width & max dimension
const GAP = 16;
const BAR = 36;

export type AspectRatioType = "land" | "square" | "tall";

export const SHAPES = [
  { id: "land" as const, w: 276, h: 207, label: "Landscape, 4 by 3" },
  { id: "square" as const, w: 239, h: 239, label: "Square, 1 by 1" },
  { id: "tall" as const, w: 207, h: 276, label: "Portrait, 3 by 4" },
] as const;

/** Exact-ratio SVG viewport coordinates matching the three equal-area formats */
const MARK = {
  land: { x: 1.5, y: 3.38, w: 15, h: 11.25 },
  square: { x: 2.5, y: 2.5, w: 13, h: 13 },
  tall: { x: 3.38, y: 1.5, w: 11.25, h: 15 },
} as const;

const BASE = 520;

export type AspectTheme = "light" | "dark";

export interface AspectProps {
  /** Optional image URL (recommended 3:4 portrait source) */
  src?: string;
  /** Image alt text */
  alt?: string;
  /** Corner radius in px (0..40, default: 20) */
  corner?: number;
  /** Morph speed tuning from 0 to 100 — 50 is the tuned 520ms */
  morph?: number;
  /** Active ratio format ("land" | "square" | "tall") */
  ratio?: AspectRatioType;
  /** Default ratio format when uncontrolled (default: "square") */
  defaultRatio?: AspectRatioType;
  /** Visual theme mode (default: "light") */
  theme?: AspectTheme;
  /** Callback fired when format changes */
  onRatioChange?: (ratio: AspectRatioType) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function Aspect({
  src,
  alt = "Cropped aspect view",
  corner = 20,
  /* how quickly the frame changes shape, 0..100 — 50 is the tuned 520ms */
  morph = 50,
  ratio,
  defaultRatio = "square",
  theme = "light",
  onRatioChange,
  className = "",
  style,
}: AspectProps = {}) {
  const getIndexFromId = (id: AspectRatioType): number => {
    const idx = SHAPES.findIndex((s) => s.id === id);
    return idx !== -1 ? idx : 1;
  };

  const isControlled = ratio !== undefined;
  const [internalAt, setInternalAt] = useState(() => getIndexFromId(defaultRatio));
  const at = isControlled ? getIndexFromId(ratio) : internalAt;

  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const ms = Math.round(BASE * rate(clamp(morph, 0, 100)));
  const shape = SHAPES[at];
  const imageSrc = src || DEFAULT_IMAGE;

  const pick = (i: number, focus = false) => {
    if (i === at) return;
    if (!isControlled) {
      setInternalAt(i);
    }
    onRatioChange?.(SHAPES[i].id);
    if (focus) tabs.current[i]?.focus();
  };

  /* ── arrows move the choice ──────────────────────────────
     One of the three is always chosen, which makes this a
     radio group rather than a row of buttons — and a radio
     group is driven with the arrow keys, with only the
     chosen one in the tab order. Tab reaches the control,
     arrows choose inside it. */
  const key = (e: React.KeyboardEvent) => {
    const d =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!d) return;
    e.preventDefault();
    pick((at + d + SHAPES.length) % SHAPES.length, true);
  };

  const isDark = theme === "dark";

  return (
    <div
      className={cn("relative flex flex-col items-center gap-4 font-sans select-none", className)}
      style={{
        width: W,
        height: W + GAP + BAR,
        ...style,
      }}
    >
      {/* Fixed square bounding stage prevents layout shift when formats switch */}
      <div className="grid w-full place-items-center" style={{ height: W }}>
        {/* Frame width and height animate directly to maintain consistent corner radius */}
        <div
          className={cn(
            "bg-cover bg-center transition-shadow duration-300 motion-reduce:transition-none",
            isDark
              ? "bg-zinc-800 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.12)]"
              : "bg-slate-100 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.06)]"
          )}
          role="img"
          aria-label={alt}
          style={{
            width: shape.w,
            height: shape.h,
            borderRadius: clamp(corner, 0, 40),
            backgroundImage: `url(${imageSrc})`,
            transition: `width ${ms}ms cubic-bezier(0.22, 1, 0.36, 1), height ${ms}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        />
      </div>

      <div
        className={cn(
          "relative grid grid-cols-[repeat(3,40px)] rounded-full p-[2px] transition-colors duration-300",
          isDark ? "bg-white/[0.08]" : "bg-slate-900/[0.06]"
        )}
        role="radiogroup"
        aria-label="Aspect ratio"
        onKeyDown={key}
      >
        {/* Sliding thumb indicator travels ahead (55% duration) to communicate causality */}
        <span
          className={cn(
            "pointer-events-none absolute top-[2px] left-[2px] h-[calc(100%-4px)] w-[calc((100%-4px)/3)] rounded-full transition-colors duration-300 motion-reduce:transition-none",
            isDark
              ? "bg-[#27272a] shadow-[0_1px_3px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)]"
              : "bg-white shadow-[0_1px_3px_rgba(15,23,42,0.1),0_1px_2px_rgba(15,23,42,0.06)]"
          )}
          aria-hidden="true"
          style={{
            transform: `translateX(${at * 100}%)`,
            transition: `transform ${Math.round(ms * 0.55)}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        />
        {SHAPES.map((s, i) => {
          const m = MARK[s.id];
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className={cn(
                "relative grid h-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 transition-[color,transform] duration-160 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-96 motion-reduce:transition-none",
                isDark
                  ? "text-zinc-400 hover:text-zinc-100 focus-visible:ring-white/30 focus-visible:ring-offset-zinc-900 aria-checked:text-zinc-100"
                  : "text-slate-500 hover:text-slate-900 focus-visible:ring-slate-900/25 focus-visible:ring-offset-white aria-checked:text-slate-900"
              )}
              role="radio"
              aria-checked={i === at}
              aria-label={s.label}
              tabIndex={i === at ? 0 : -1}
              onClick={() => pick(i)}
            >
              <svg width={18} height={18} viewBox="0 0 18 18" aria-hidden="true">
                <rect
                  x={m.x}
                  y={m.y}
                  width={m.w}
                  height={m.h}
                  rx={2}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { Aspect as AspectRatio };
