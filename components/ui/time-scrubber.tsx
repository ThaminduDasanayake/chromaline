"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "./time-scrubber.css";

/**
 * ══ Time Scrubber ═════════════════════════════════════════════════
 * A tactile time picker with a sliding ruler dial and inertia snapping.
 *
 * Architecture & Physics:
 * - Unified Throw & Snap Spring: On drag release, the landing target is calculated
 *   from release velocity: land = round((pos + v * carry) / step) * step.
 *   A single damped harmonic spring smoothly carries the ruler there starting at
 *   the pointer's release velocity, eliminating any seam between coasting and snapping.
 * - Front-Facing Dial Projection: Ticks at the center stand tall and solid; toward the
 *   edges they fall away in height (scaleY(0.55 + 0.45 * f)) and opacity (0.18 + 0.82 * f)
 *   according to quadratic drop-off f = 1 - (|x| / HALF)^2, creating a convincing
 *   cylindrical wheel appearance on a flat surface.
 * - Rolling Digit Windows: Digits roll through masked fading apertures with subtle
 *   velocity blur smearing on value transitions.
 * ═════════════════════════════════════════════════════════════════
 */

export type TimeScrubberTheme = "light" | "dark";
export type TimeScrubberFormat = "12h" | "24h";

export interface TimeScrubberProps {
  /** Snap resolution in minutes (e.g. 1, 5, 15, 30; default: 15) */
  step?: number | string;
  /** Kinetic throw momentum carry factor (0..100; default: 50) */
  momentum?: number;
  /** Time display format (default: "12h") */
  format?: TimeScrubberFormat;
  /** Border radius in pixels (default: 20) */
  corner?: number;
  /** Controlled time in minutes from midnight (0..1439) */
  value?: number;
  /** Initial uncontrolled time in minutes (default: 570 = 9:30 AM) */
  defaultValue?: number;
  /** Legacy alias for defaultValue */
  start?: number;
  /** Visual theme mode (default: "light") */
  theme?: TimeScrubberTheme;
  /** Whether the scrubber is disabled */
  disabled?: boolean;
  /** Callback fired when the time changes */
  onChange?: (minutes: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const W = 300;
const PX = 2; // px per minute along the ruler
const HALF = (W - 36) / 2;
const DAY = 1440;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const wrap = (m: number) => ((m % DAY) + DAY) % DAY;

const stillness = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Digit component that rolls through a vertically faded mask
 * with blur smearing on each digit transition.
 */
function Digit({ d }: { d: string }) {
  const [lastDigit, setLastDigit] = useState(d);
  const [flip, setFlip] = useState<"a" | "b" | null>(null);

  if (d !== lastDigit) {
    setLastDigit(d);
    setFlip((prev) => (prev === "a" ? "b" : "a"));
  }

  return (
    <span className="tms-col">
      <span
        className="tms-strip"
        data-flip={flip ?? undefined}
        style={{ transform: `translateY(${-Number(d) * 1.5}em)` }}
      >
        {"0123456789".split("").map((n) => (
          <span key={n}>{n}</span>
        ))}
      </span>
    </span>
  );
}

function formatLabel(m: number, h24: boolean) {
  const t = wrap(Math.round(m));
  const h = Math.floor(t / 60);
  const mm = String(t % 60).padStart(2, "0");
  if (h24) return { time: `${String(h).padStart(2, "0")}:${mm}`, mer: "" };
  return { time: `${h % 12 || 12}:${mm}`, mer: h < 12 ? "AM" : "PM" };
}

export function TimeScrubber({
  step = 15,
  momentum = 50,
  format = "12h",
  corner = 20,
  value: controlledValue,
  defaultValue,
  start = 570,
  theme = "light",
  disabled = false,
  onChange,
  className = "",
  style,
}: TimeScrubberProps) {
  const initialTime = controlledValue ?? defaultValue ?? start;
  const isControlled = controlledValue !== undefined;
  const [pos, setPos] = useState(initialTime);

  const parsedStep = Math.max(1, Number(step) || 15);
  const isDark = theme === "dark";
  const h24 = format === "24h";

  const p = useRef({ x: initialTime, v: 0, to: initialTime });
  const raf = useRef(0);
  const knobs = useRef({ step: parsedStep, momentum });
  knobs.current = { step: parsedStep, momentum };
  const ruler = useRef<HTMLDivElement>(null);
  const lastStep = useRef(Math.floor(initialTime / parsedStep));
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Haptic/audio step trigger
  const hear = (x: number) => {
    const s = knobs.current.step;
    const k = Math.floor(x / s);
    if (k === lastStep.current) return;
    lastStep.current = k;
  };

  const set = (x: number, notify = true) => {
    p.current.x = x;
    hear(x);
    setPos(x);
    if (notify) {
      onChangeRef.current?.(wrap(Math.round(x)));
    }
  };

  const run = () => {
    if (raf.current) return;
    let prev = 0;
    const tick = (t: number) => {
      const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1;
      prev = t;
      const c = p.current;
      // Damped harmonic settling
      c.v += ((c.to - c.x) * 0.022 - c.v * 0.26) * dt;
      const x = c.x + c.v * dt;
      if (Math.abs(c.to - x) < 0.01 && Math.abs(c.v) < 0.01) {
        c.v = 0;
        set(c.to);
        raf.current = 0;
        return;
      }
      set(x);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, []);

  const goTo = (to: number, v = p.current.v) => {
    p.current.to = to;
    p.current.v = v;
    if (stillness()) {
      p.current.v = 0;
      set(to);
      return;
    }
    run();
  };

  // Sync external controlled value
  useEffect(() => {
    if (isControlled && Math.abs(controlledValue - p.current.x) > 0.01) {
      goTo(controlledValue, 0);
    }
  }, [controlledValue, isControlled]);

  /* ── Pointer Drag Handling ────────────────────────────── */
  const drag = useRef<null | { x: number; t: number; v: number; k: number }>(null);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Scripted pointer
    }
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    const k = e.currentTarget.getBoundingClientRect().width / e.currentTarget.offsetWidth || 1;
    drag.current = { x: e.clientX, t: performance.now(), v: 0, k };
    p.current.v = 0;
  };

  const onMove = (e: React.PointerEvent) => {
    const g = drag.current;
    if (!g || disabled) return;
    const now = performance.now();
    // Left drag moves forward in time (ruler scrolls left under fixed pointer)
    const dm = -(e.clientX - g.x) / g.k / PX;
    const dt = Math.max(1, now - g.t) / 16.67;
    g.v = g.v * 0.5 + (dm / dt) * 0.5;
    g.x = e.clientX;
    g.t = now;
    set(p.current.x + dm);
  };

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = drag.current;
    drag.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Never captured
    }
    if (!g || disabled) return;
    const v = performance.now() - g.t > 80 ? 0 : clamp(g.v, -14, 14);
    const s = knobs.current.step;
    const carry = 6 + (clamp(knobs.current.momentum, 0, 100) / 100) * 30;
    const land = Math.round((p.current.x + v * carry) / s) * s;
    goTo(land, v * 0.6);
  };

  /* Horizontal trackpad wheel navigation */
  useEffect(() => {
    const el = ruler.current;
    if (!el || disabled) return;
    let idle = 0;
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      set(p.current.x + e.deltaX / PX);
      clearTimeout(idle);
      idle = window.setTimeout(() => {
        const s = knobs.current.step;
        goTo(Math.round(p.current.x / s) * s, 0);
      }, 120);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", wheel);
      clearTimeout(idle);
    };
  }, [disabled]);

  /* ── Dial Ticks Calculation ────────────────────────────── */
  const ticks: { m: number; x: number; f: number; kind: "hour" | "quarter" | "five" }[] = [];
  const span = HALF / PX + 10;
  for (let m = Math.ceil((pos - span) / 5) * 5; m <= pos + span; m += 5) {
    const x = (m - pos) * PX;
    const f = clamp(1 - Math.pow(Math.abs(x) / HALF, 2), 0, 1);
    const w = wrap(m);
    ticks.push({ m, x, f, kind: w % 60 === 0 ? "hour" : w % 15 === 0 ? "quarter" : "five" });
  }

  const { time, mer } = formatLabel(pos, h24);
  const currentStep = parsedStep;

  return (
    <div
      className={cn(
        "tms font-sans transition-colors duration-300",
        isDark
          ? "bg-[#1b1b1b] text-[#ffffff] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
          : "bg-[#ffffff] text-[#18181b] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
        disabled && "opacity-40 pointer-events-none",
        className
      )}
      style={{
        ...style,
        "--tms-r": `${Math.max(0, corner)}px`,
      } as React.CSSProperties}
    >
      <div className="tms-read" aria-live="polite" aria-label={`${time} ${mer}`}>
        <span className="tms-time">
          {time.split("").map((c, i) =>
            c === ":" ? (
              <span key={`c${i}`} className="tms-colon">
                :
              </span>
            ) : (
              <Digit key={time.length - i} d={c} />
            )
          )}
        </span>
        {mer && (
          <span className={cn("tms-mer", isDark ? "text-[#a1a1aa]" : "text-[#71717a]")}>
            {mer}
          </span>
        )}
      </div>

      <div
        ref={ruler}
        className="tms-ruler"
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label="Time scrubber"
        aria-valuetext={`${time} ${mer}`}
        aria-valuenow={wrap(Math.round(pos))}
        aria-valuemin={0}
        aria-valuemax={DAY - 1}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={(e) => {
          if (disabled) return;
          const d = e.key === "ArrowRight" ? currentStep : e.key === "ArrowLeft" ? -currentStep : 0;
          if (!d) return;
          e.preventDefault();
          goTo(Math.round(p.current.to / currentStep) * currentStep + d, 0);
        }}
      >
        <div className="tms-track">
          {ticks.map((t) => (
            <span
              key={t.m}
              className={cn("tms-tick", isDark ? "bg-[#ffffff]" : "bg-[#18181b]")}
              data-kind={t.kind}
              style={{
                transform: `translateX(${t.x.toFixed(2)}px) scaleY(${(0.55 + 0.45 * t.f).toFixed(3)})`,
                opacity: 0.18 + 0.82 * t.f,
              }}
            />
          ))}
          {ticks
            .filter((t) => t.kind === "hour")
            .map((t) => {
              const h = Math.floor(wrap(t.m) / 60);
              return (
                <span
                  key={`l${t.m}`}
                  className={cn("tms-hour", isDark ? "text-[#a1a1aa]" : "text-[#71717a]")}
                  style={{
                    transform: `translateX(${t.x.toFixed(2)}px) translateX(-50%)`,
                    opacity: 0.15 + 0.85 * t.f,
                  }}
                >
                  {h24 ? String(h).padStart(2, "0") : `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`}
                </span>
              );
            })}
        </div>
        <span className="tms-mark bg-[#e5484d]" aria-hidden="true" />
      </div>
    </div>
  );
}

// User requested alias: import { Scrub } from "./Scrub"
export { TimeScrubber as Scrub };
