"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * ══ Checklist ═════════════════════════════════════════════════════
 * A tactile task checklist where checking a row runs off a single harmonic
 * spring with four simultaneous physical readings:
 * 1. Raw Overshoot Fill: Checkbox fill expands from the center and swells past 1.0.
 * 2. Clamped Tick Drawing: The checkmark path stroke walks forward without overshooting.
 * 3. Strikethrough Rule: Delayed line scales horizontally from the text start.
 * 4. Word Ink Fade: Text opacity yields in lockstep with the rule progression.
 *
 * Finishing Kinematics:
 * - When every item is checked, the floor drops out and rows collapse into a natural,
 *   gravity-driven heap with dynamic overhang tilt calculated from text lengths.
 * - Rebounds on impact and auto-resets after 3 seconds, or smoothly interrupts
 *   if any item is unchecked during the fall.
 * ═════════════════════════════════════════════════════════════════
 */

export type ChecklistTheme = "light" | "dark";

export interface ChecklistItem {
  text: string;
  done: boolean;
}

export interface ChecklistProps {
  /** Outer slab corner radius in pixels (default: 20) */
  corner?: number;
  /** Checkbox bounce overshoot amplitude 0..100 (default: 50) */
  bounce?: number;
  /** Checkbox square dimensions in pixels (default: 18) */
  box?: number;
  /** Visual theme mode (default: "light") */
  theme?: ChecklistTheme;
  /** Initial tasks list */
  initialItems?: ChecklistItem[] | string[];
  /** Controlled tasks list */
  items?: ChecklistItem[];
  /** Callback fired when items update */
  onItemsChange?: (items: ChecklistItem[]) => void;
  /** Callback fired when all items are checked and collapse triggers */
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const springOf = (tune: number) => ({
  k: 0.08 + (tune / 100) * 0.16,
  d: 0.62 + (tune / 100) * 0.2,
});

function useSpring(target: number, tune = 50, instant = false) {
  const [at, setAt] = useState(target);
  const cur = useRef(target);
  const vel = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    if (instant) {
      cur.current = target;
      vel.current = 0;
      return;
    }
    const { k, d } = springOf(tune);
    let prev = 0;
    const tick = (t: number) => {
      const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1;
      prev = t;
      vel.current += (target - cur.current) * k * dt;
      vel.current *= Math.pow(d, dt);
      cur.current += vel.current * dt;
      if (Math.abs(target - cur.current) < 0.02 && Math.abs(vel.current) < 0.02) {
        cur.current = target;
        vel.current = 0;
        setAt(target);
        raf.current = 0;
        return;
      }
      setAt(cur.current);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [target, tune, instant]);

  return instant ? target : at;
}

const stillness = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const W = 300;
const PAD = 14;
const ROW = 40;
const BOX = 18;
const CORNER = 20;
const BOUNCE = 50;
const LAG = 0.12;
const RUN = 0.72;
const DROP_MS = 0.46;
const REBOUND = 8;
const FALL_EASE = ["easeIn", "easeOut", "easeIn"] as const;
const HOLD = 3000;
const MAX_LEAN = 6;
const REACH = 40;
const leanOf = (over: number) => MAX_LEAN * (1 - Math.exp(-over / REACH));
const DRIFT = [-5, 4, -2, 5, -3];
const SPAN = W - PAD * 2;
const MID = SPAN / 2;
const sin = (deg: number) => Math.sin((deg * Math.PI) / 180);
const gapFor = (leans: number[], runs: number[]) =>
  1 +
  Math.max(
    0,
    ...leans.slice(1).map((below, i) => {
      const ink = Math.max(runs[i] ?? MID, runs[i + 1] ?? MID);
      return Math.max(0, (ink - MID) * (sin(leans[i]) - sin(below)));
    })
  );

const DEFAULT_TASKS: ChecklistItem[] = [
  { text: "Book the studio", done: false },
  { text: "Send the estimate", done: false },
  { text: "Pick a typeface", done: false },
];
const MAX = 5;

export function Checklist({
  corner = CORNER,
  bounce = BOUNCE,
  box = BOX,
  theme = "light",
  initialItems,
  items: controlledItems,
  onItemsChange,
  onComplete,
  className = "",
  style,
}: ChecklistProps) {
  const isControlled = controlledItems !== undefined;
  const [internalItems, setInternalItems] = useState<ChecklistItem[]>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems.map((item) =>
        typeof item === "string" ? { text: item, done: false } : item
      );
    }
    return DEFAULT_TASKS;
  });

  const items = isControlled ? controlledItems : internalItems;
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [runs, setRuns] = useState<number[]>([]);
  const [line, setLine] = useState(20);

  const measure = useCallback((i: number, px: number, tall: number) => {
    setRuns((v) => (v[i] === px ? v : Object.assign([...v], { [i]: px })));
    setLine((v) => (v === tall ? v : tall));
  }, []);

  const still = stillness();
  const r = clamp(corner, 0, 40);
  const side = clamp(Math.round(box), 14, 28);
  const isDark = theme === "dark";

  const fell = items.length > 0 && items.every((t) => t.done);
  const spare = items.length < MAX;

  // Auto-reset when complete after HOLD duration
  useEffect(() => {
    if (!fell) return;
    onComplete?.();
    const id = window.setTimeout(() => {
      const reset = DEFAULT_TASKS.map((t) => ({ ...t, done: false }));
      if (!isControlled) {
        setInternalItems(reset);
      }
      onItemsChange?.(reset);
    }, HOLD);
    return () => window.clearTimeout(id);
  }, [fell, isControlled, onComplete, onItemsChange]);

  const updateItems = (next: ChecklistItem[]) => {
    if (!isControlled) {
      setInternalItems(next);
    }
    onItemsChange?.(next);
  };

  const slack = (ROW - side) / 2;
  const padV = Math.max(0, PAD - slack);
  const body = Math.max(side, line);
  const inset = (ROW - body) / 2;
  const slots = items.length + (spare ? 1 : 0);
  const floor = padV + ROW * slots;

  const leans = items.map(() => 0);
  for (let i = items.length - 2; i >= 0; i--) {
    const over = Math.max(0, (runs[i] ?? 0) - (runs[i + 1] ?? 0));
    leans[i] = clamp(leans[i + 1] + leanOf(over), 0, MAX_LEAN);
  }
  const touch = gapFor(leans, runs);
  const seat = floor - inset - body;
  const restTop = (i: number) => padV + i * ROW;
  const pileTop = (i: number) => seat - (items.length - 1 - i) * (body + touch);
  const drops = items.map((_, i) => Math.max(0, pileTop(i) - restTop(i)));
  const longest = Math.max(...drops, 1);

  const add = () => {
    const text = draft.trim();
    setAdding(false);
    setDraft("");
    if (!text || items.length >= MAX) return;
    updateItems([...items, { text, done: false }]);
  };

  return (
    <div
      className={cn(
        "relative box-border overflow-hidden font-sans transition-[height,background-color,color,box-shadow] duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] select-none",
        isDark
          ? "bg-[#1b1b1b] text-[#ffffff] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
          : "bg-[#ffffff] text-[#18181b] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
        className
      )}
      data-theme={theme}
      style={{
        width: W,
        height: padV * 2 + ROW * slots,
        padding: `${padV}px ${PAD}px`,
        borderRadius: r,
        ...style,
      }}
    >
      <AnimatePresence initial={false}>
        {items.map((task, i) => (
          <Row
            key={`${i}-${task.text}`}
            label={task.text}
            on={task.done}
            side={side}
            bounce={bounce}
            still={still}
            fell={fell}
            drop={drops[i]}
            secs={DROP_MS * Math.sqrt(drops[i] / longest)}
            inset={inset}
            drift={DRIFT[i] ?? 0}
            tilt={leans[i] ?? 0}
            index={i}
            isDark={isDark}
            onRun={measure}
            layer={fell ? items.length - i : undefined}
            onToggle={() => {
              updateItems(items.map((t, k) => (k === i ? { ...t, done: !t.done } : t)));
            }}
          />
        ))}
      </AnimatePresence>

      {spare && (
        <div
          className={cn(
            "flex w-full items-center gap-3 text-[14px] font-normal tracking-[-0.01em] transition-opacity duration-220 ease-out",
            fell && "pointer-events-none opacity-0"
          )}
          style={{ height: ROW }}
          onClick={(e) => e.stopPropagation()}
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex-none",
              isDark
                ? "shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.2)]"
                : "shadow-[inset_0_0_0_1.5px_rgba(24,24,27,0.16)]"
            )}
            style={{ width: side, height: side, borderRadius: side * 0.32 }}
          />
          {adding ? (
            <input
              className={cn(
                "font-inherit tracking-inherit min-w-0 flex-1 border-0 bg-transparent p-0 text-inherit outline-none",
                isDark
                  ? "placeholder:text-[rgba(255,255,255,0.32)]"
                  : "placeholder:text-[rgba(24,24,27,0.32)]"
              )}
              autoFocus
              value={draft}
              placeholder="New task"
              maxLength={40}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  add();
                }
                if (e.key === "Escape") {
                  e.stopPropagation();
                  setAdding(false);
                  setDraft("");
                }
              }}
              onBlur={add}
            />
          ) : (
            <button
              type="button"
              className="font-inherit tracking-inherit cursor-pointer border-0 bg-transparent p-0 text-left text-inherit opacity-[0.38] transition-opacity duration-160 ease-out hover:opacity-[0.72]"
              onClick={() => {
                setAdding(true);
              }}
            >
              Add new task
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  on,
  side,
  bounce,
  still,
  fell,
  drop,
  secs,
  inset,
  drift,
  tilt,
  layer,
  index,
  isDark,
  onRun,
  onToggle,
}: {
  label: string;
  on: boolean;
  side: number;
  bounce: number;
  still: boolean;
  fell: boolean;
  drop: number;
  secs: number;
  inset: number;
  drift: number;
  tilt: number;
  layer?: number;
  index: number;
  isDark: boolean;
  onRun: (i: number, px: number, tall: number) => void;
  onToggle: () => void;
}) {
  const say = useRef<HTMLSpanElement | null>(null);
  useIsomorphicLayoutEffect(() => {
    const el = say.current;
    if (el) onRun(index, el.offsetLeft + el.offsetWidth, el.offsetHeight);
  }, [label, side, index, onRun]);

  const t = useSpring(on ? 1 : 0, clamp(bounce, 0, 100), still);
  const held = clamp(t, 0, 1);
  const cut = clamp((held - LAG) / RUN, 0, 1);

  const run = still ? 0 : secs;
  const up = Math.min(REBOUND, drop * 0.22);
  const land = {
    duration: run,
    times: [0, 0.66, 0.84, 1],
    ease: [...FALL_EASE],
  };
  const lean = { duration: run, ease: "easeIn" as const };

  return (
    <motion.button
      type="button"
      className={cn(
        "group font-inherit relative flex w-full cursor-pointer items-center gap-3 rounded-[10px] border-0 bg-transparent p-0 text-left text-inherit outline-none [-webkit-tap-highlight-color:transparent]",
        isDark
          ? "focus-visible:shadow-[0_0_0_2px_rgba(255,255,255,0.4)]"
          : "focus-visible:shadow-[0_0_0_2px_rgba(24,24,27,0.3)]"
      )}
      role="checkbox"
      aria-checked={on}
      onClick={onToggle}
      style={{
        height: ROW,
        zIndex: layer,
      }}
      initial={false}
      exit={{ opacity: 0, transition: { duration: 0.16 } }}
      animate={
        fell ? { y: [0, drop, drop - up, drop], x: drift, rotate: tilt } : { y: 0, x: 0, rotate: 0 }
      }
      transition={
        fell
          ? { y: land, x: lean, rotate: lean }
          : { type: "spring", stiffness: 380, damping: 34, mass: 0.9 }
      }
    >
      {fell && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 -z-10 rounded-[10px]",
            isDark ? "bg-[#1b1b1b]" : "bg-[#ffffff]"
          )}
          style={{ top: inset, bottom: inset }}
        />
      )}

      <span
        className={cn(
          "relative grid flex-none place-items-center overflow-hidden",
          isDark
            ? "shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.32)]"
            : "shadow-[inset_0_0_0_1.5px_rgba(24,24,27,0.28)]"
        )}
        style={{
          width: side,
          height: side,
          borderRadius: side * 0.32,
        }}
      >
        <span
          className={cn("absolute inset-0 origin-center", isDark ? "bg-[#ffffff]" : "bg-[#18181b]")}
          style={{
            borderRadius: side * 0.32,
            transform: `scale(${t.toFixed(4)})`,
          }}
        />
        <svg
          className={cn(
            "relative h-[68%] w-[68%] overflow-visible fill-none stroke-[2.6] [stroke-linecap:round] [stroke-linejoin:round]",
            isDark ? "stroke-[#1b1b1b]" : "stroke-[#ffffff]"
          )}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M6 12.4 L10.3 16.7 L18 7.6"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - held}
          />
        </svg>
      </span>

      <span
        className="relative inline-block text-[14px] leading-[1.2] font-normal tracking-[-0.01em]"
        ref={say}
      >
        <span className="inline-block" style={{ opacity: mix(1, 0.42, held) }}>
          {label}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[46%] h-[1.5px] origin-left rounded-xs bg-current"
          style={{ transform: `scaleX(${cut.toFixed(4)})` }}
        />
      </span>
    </motion.button>
  );
}
