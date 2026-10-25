"use client";

import React, { useEffect, useRef, useState } from "react";
import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * ══ Rolling Counter ═════════════════════════════════════════════
 * Tactile rolling odometer counter with spring physics and kinetic drag.
 *
 * Architecture & Physics:
 * - Column Rolling (Modulo 10): Target is the full count at that place (e.g., 128 for tens, 1284 for ones)
 *   so transitions like 9 → 10 continuously roll forward rather than cycling backwards.
 * - Staggered Carry Ripples: Changes propagate from the lowest place upward with configurable stagger delay.
 * - Dynamic Damping Spring: Second-order spring with stiffness (k) and decay (d):
 *   zeta = -ln(d) / (2 * sqrt(k))
 *   Where tune=0 gives heavy critically-damped arrival (zeta ~0.85) and tune=100 gives lively rebound (zeta ~0.20).
 * - Velocity Smear: Spinning digits dynamically blur with instantaneous velocity:
 *   filter = min(3, |vel| * 2.4) * (blur / 50)
 * - Inertial Coasting: Dragging decelerates exponentially at 0.94x per animation frame on release.
 * ═════════════════════════════════════════════════════════════════
 */

/**
 * Computes spring stiffness (k) and frame velocity decay (d) from a 0..100 tune value.
 * Damping ratio: zeta = -ln(d) / (2 * sqrt(k))
 */
const springOf = (tune: number) => ({
  k: 0.08 + (tune / 100) * 0.16,
  d: 0.62 + (tune / 100) * 0.2,
});

/** Detects user prefers-reduced-motion accessibility preference */
const stillness = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const PLACES = 5;
const MAX = 10 ** PLACES - 1;
const CELL = 46; // Digit cell and button height in pixels
const PX = 12; // Drag sensitivity threshold in pixels per count step
const PAD = 5; // Slab inset padding around buttons and numbers
const BTN = CELL;
const H = BTN + PAD * 2;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Col = { pos: number; vel: number; target: number; due: number[]; next: number[] };

export type CounterTheme = "light" | "dark";

export interface CounterProps {
  /** How lively a digit lands, 0..100 (default: 45) */
  bounce?: number;
  /** Milliseconds between one column moving and the next, 0..120 (default: 45) */
  stagger?: number;
  /** How much a spinning digit smears, 0..100 (default: 50) */
  blur?: number;
  /** Slab container corner radius in pixels (default: 16) */
  corner?: number;
  /** Initial count when uncontrolled (default: 22) */
  start?: number;
  /** Controlled count value */
  value?: number;
  /** Visual theme mode (default: "light") */
  theme?: CounterTheme;
  /** Callback fired when count changes */
  onChange?: (value: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function Counter({
  /* how lively a digit lands, 0..100 */
  bounce = 45,
  /* ms between one column moving and the next, 0..120 */
  stagger = 45,
  /* how much a spinning digit smears, 0..100 */
  blur = 50,
  /* the slab's corner, px */
  corner = 16,
  start = 22,
  theme = "light",
  value: controlledValue,
  onChange,
  className = "",
  style,
}: CounterProps = {}) {
  const still = stillness();
  const isControlled = controlledValue !== undefined;
  const initialValue = isControlled ? controlledValue : start;

  const [internalValue, setInternalValue] = useState(initialValue);
  const val = useRef(initialValue);
  const strips = useRef<(HTMLDivElement | null)[]>([]);
  const cols = useRef<Col[]>(
    Array.from({ length: PLACES }, (_, p) => {
      const n = Math.floor(initialValue / 10 ** p);
      return { pos: n, vel: 0, target: n, due: [], next: [] };
    })
  );
  const raf = useRef(0);
  const knobs = useRef({ bounce, stagger, blur });
  useEffect(() => {
    knobs.current = { bounce, stagger, blur };
  }, [bounce, stagger, blur]);

  /* ── paint ─────────────────────────────────────────────── */
  const paint = () => {
    cols.current.forEach((c, p) => {
      const el = strips.current[p];
      if (!el) return;
      const m = ((c.pos % 10) + 10) % 10;
      const smear = Math.min(3, Math.abs(c.vel) * 2.4) * (knobs.current.blur / 50);
      el.style.transform = `translateY(${-m * CELL}px)`;
      el.style.filter = smear > 0.15 ? `blur(${smear.toFixed(2)}px)` : "";
    });
  };

  const run = () => {
    if (raf.current) return;
    let prev = 0;
    const tick = (t: number) => {
      const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1;
      prev = t;
      const { k, d } = springOf(knobs.current.bounce);
      const now = performance.now();
      let busy = false;
      for (const c of cols.current) {
        /* targets that have waited their turn */
        while (c.due.length && c.due[0] <= now) {
          c.due.shift();
          c.target = c.next.shift()!;
        }
        if (c.due.length) busy = true;
        /* a column far from home jumps most of the way in whole
           turns first — it looks the same, and a flick does not
           leave the ones column spinning for a second */
        const gap = c.target - c.pos;
        if (Math.abs(gap) > 24) c.pos += Math.round((gap - Math.sign(gap) * 24) / 10) * 10;
        c.vel += (c.target - c.pos) * k * dt;
        c.vel *= Math.pow(d, dt);
        c.pos += c.vel * dt;
        if (Math.abs(c.target - c.pos) < 0.004 && Math.abs(c.vel) < 0.004) {
          c.pos = c.target;
          c.vel = 0;
        } else busy = true;
      }
      paint();
      raf.current = busy ? requestAnimationFrame(tick) : 0;
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    paint();
  }, [blur]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    },
    []
  );

  /* ── the one way the number changes ────────────────────── */
  const bump = (n: number) => {
    const v = clamp(val.current + n, 0, MAX);
    if (v === val.current) return;
    val.current = v;
    if (!isControlled) {
      setInternalValue(v);
    }
    onChange?.(v);
    const now = performance.now();
    cols.current.forEach((c, p) => {
      const to = Math.floor(v / 10 ** p);
      if (still) {
        c.pos = c.target = to;
        c.vel = 0;
        c.due = [];
        c.next = [];
        return;
      }
      c.due.push(now + p * knobs.current.stagger);
      c.next.push(to);
    });
    if (still) paint();
    else run();
  };

  const bumpRef = useRef(bump);
  useEffect(() => {
    bumpRef.current = bump;
  });

  /* React to external controlled value changes */
  useEffect(() => {
    if (isControlled && controlledValue !== val.current) {
      bumpRef.current(controlledValue - val.current);
    }
  }, [controlledValue, isControlled]);

  /* ── holding a button ──────────────────────────────────── */
  const hold = useRef({ t: 0, since: 0 });
  const release = () => {
    clearTimeout(hold.current.t);
    hold.current.t = 0;
  };
  useEffect(() => release, []);
  const press = (dir: 1 | -1) => {
    release();
    bump(dir);
    hold.current.since = performance.now();
    const repeat = () => {
      const held = performance.now() - hold.current.since;
      /* ones, then tens after a second and a half */
      bump(dir * (held > 1500 ? 10 : 1));
      hold.current.t = window.setTimeout(repeat, held > 900 ? 55 : 90);
    };
    hold.current.t = window.setTimeout(repeat, 380);
  };

  /* ── taking the number itself ──────────────────────────── */
  const drag = useRef<{ y: number; acc: number; v: number; t: number } | null>(null);
  const fling = useRef(0);
  useEffect(() => () => cancelAnimationFrame(fling.current), []);
  const steps = (acc: number) => {
    const n = acc > 0 ? Math.floor(acc / PX) : Math.ceil(acc / PX);
    if (n) bump(n);
    return acc - n * PX;
  };

  const onDown = (e: React.PointerEvent) => {
    cancelAnimationFrame(fling.current);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* a scripted pointer */
    }
    drag.current = { y: e.clientY, acc: 0, v: 0, t: performance.now() };
  };
  const onMove = (e: React.PointerEvent) => {
    const g = drag.current;
    if (!g) return;
    const now = performance.now();
    /* up is more */
    const dy = g.y - e.clientY;
    g.y = e.clientY;
    const dt = Math.max(1, now - g.t);
    g.t = now;
    g.v = g.v * 0.6 + (dy / dt) * 0.4;
    g.acc = steps(g.acc + dy);
  };
  const onUp = (e: React.PointerEvent) => {
    const g = drag.current;
    drag.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* never captured */
    }
    if (!g || still) return;
    /* a hand that stopped before letting go threw nothing */
    let v = performance.now() - g.t > 90 ? 0 : g.v * 16.67;
    if (Math.abs(v) < 2) return;
    let acc = g.acc;
    const coast = () => {
      acc = steps(acc + v);
      v *= 0.94;
      if (Math.abs(v) > 0.4) fling.current = requestAnimationFrame(coast);
    };
    fling.current = requestAnimationFrame(coast);
  };

  const displayValue = isControlled ? controlledValue : internalValue;
  const shown = Math.max(1, String(displayValue).length);
  const r = clamp(corner, 0, H / 2);
  const inner = Math.max(0, r - PAD);
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "relative flex items-center gap-0 p-[5px] font-sans transition-colors duration-300 select-none",
        isDark
          ? "bg-[#18181b] text-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_4px_20px_-4px_rgba(0,0,0,0.6)]"
          : "bg-white text-slate-900 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(15,23,42,0.06)]",
        className
      )}
      style={{
        borderRadius: `${r}px`,
        ...style,
      }}
    >
      <button
        type="button"
        className={cn(
          "grid w-10 shrink-0 cursor-pointer place-items-center border-0 p-0 text-inherit transition-[transform,background-color] duration-[200ms] ease-[cubic-bezier(0.3,0.9,0.4,1)] [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-90 active:duration-[110ms]",
          isDark
            ? "bg-white/[0.08] hover:bg-white/[0.14] focus-visible:ring-white/30 focus-visible:ring-offset-[#18181b]"
            : "bg-slate-900/[0.06] hover:bg-slate-900/[0.1] focus-visible:ring-slate-900/25 focus-visible:ring-offset-white"
        )}
        style={{
          height: `${CELL}px`,
          borderRadius: `${inner}px`,
        }}
        aria-label="Less"
        onPointerDown={() => press(-1)}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            bump(-1);
          }
        }}
      >
        <MinusIcon size={16} weight="bold" />
      </button>

      <div
        className={cn(
          "flex cursor-ns-resize touch-none justify-center rounded-lg [mask-image:linear-gradient(transparent,#000_20%,#000_80%,transparent)] px-3.5 text-[30px] font-medium tracking-[-0.02em] tabular-nums select-none [-webkit-mask-image:linear-gradient(transparent,#000_20%,#000_80%,transparent)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          isDark
            ? "focus-visible:ring-white/30 focus-visible:ring-offset-[#18181b]"
            : "focus-visible:ring-slate-900/25 focus-visible:ring-offset-white"
        )}
        style={{
          height: `${CELL}px`,
          lineHeight: `${CELL}px`,
        }}
        role="spinbutton"
        aria-valuenow={displayValue}
        aria-valuemin={0}
        aria-valuemax={MAX}
        aria-label="Count. Drag up or down to change it."
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            bump(1);
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            bump(-1);
          }
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {Array.from({ length: PLACES }, (_, i) => {
          const p = PLACES - 1 - i;
          return (
            <span key={p} className="flex">
              <span
                className={cn(
                  "overflow-hidden transition-[width,opacity] duration-[320ms] ease-[cubic-bezier(0.3,1.2,0.4,1)]",
                  p < shown ? "w-[0.64em] opacity-100" : "w-0 opacity-0"
                )}
                style={{ height: `${CELL}px` }}
              >
                <span
                  className="flex flex-col items-center will-change-transform"
                  ref={(el) => {
                    strips.current[p] = el as HTMLDivElement | null;
                  }}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, j) => (
                    <span key={j} style={{ height: `${CELL}px` }}>
                      {d}
                    </span>
                  ))}
                </span>
              </span>
              {p === 3 && (
                <span
                  className={cn(
                    "overflow-hidden transition-[width,opacity] duration-[320ms] ease-[cubic-bezier(0.3,1.2,0.4,1)]",
                    shown > 3 ? "w-[0.26em] opacity-100" : "w-0 opacity-0"
                  )}
                >
                  ,
                </span>
              )}
            </span>
          );
        })}
      </div>

      <button
        type="button"
        className={cn(
          "grid w-10 shrink-0 cursor-pointer place-items-center border-0 p-0 text-inherit transition-[transform,background-color] duration-[200ms] ease-[cubic-bezier(0.3,0.9,0.4,1)] [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-90 active:duration-[110ms]",
          isDark
            ? "bg-white/[0.08] hover:bg-white/[0.14] focus-visible:ring-white/30 focus-visible:ring-offset-[#18181b]"
            : "bg-slate-900/[0.06] hover:bg-slate-900/[0.1] focus-visible:ring-slate-900/25 focus-visible:ring-offset-white"
        )}
        style={{
          height: `${CELL}px`,
          borderRadius: `${inner}px`,
        }}
        aria-label="More"
        onPointerDown={() => press(1)}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            bump(1);
          }
        }}
      >
        <PlusIcon size={16} weight="bold" />
      </button>
    </div>
  );
}
