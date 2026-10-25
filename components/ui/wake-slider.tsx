"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * ══ Wake Slider ═════════════════════════════════════════════════
 * A tactile range control with no thumb: a row of thin vertical bars that
 * are solid up to the current value and faint after it.
 *
 * Architecture & Physics:
 * - Dynamic Energy Wake: Crossing a bar transfers kinetic energy from the pointer's
 *   instantaneous drag speed through a saturating curve:
 *   push = (1 - exp(-speed / 900)) * (wake / 60)
 * - Exponential Decay: In each animation frame, accumulated energy decays at rate 6.5/s:
 *   energy[i] *= exp(-dt * 6.5)
 * - Direct Transform Writing: Height scales (scaleY(1 + energy[i] * 1.6)) are applied
 *   directly to DOM node transforms via refs to eliminate React re-render overhead at 60–120fps.
 * - Keyboard & Touch Accessible: Supports drag, wheel, pointer capture, and standard ARIA slider controls.
 * ═════════════════════════════════════════════════════════════════
 */

const H = 20; // Rest height of each bar in pixels
const GAP = 4; // Spacing gap between bars
const BAR = 3; // Width of each bar

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export type WakeSliderTheme = "light" | "dark";

export interface WakeSliderProps {
  /** How many bars make up the track (12..64, default: 36) */
  bars?: number;
  /** Kinetic wake rise amplitude (0..100, default: 60) */
  wake?: number;
  /** Controlled slider value (0..100) */
  value?: number;
  /** Default uncontrolled value (default: 50) */
  defaultValue?: number;
  /** Minimum range value (default: 0) */
  min?: number;
  /** Maximum range value (default: 100) */
  max?: number;
  /** Step increment for keyboard navigation (default: 1) */
  step?: number;
  /** Visual theme mode (default: "light") */
  theme?: WakeSliderTheme;
  /** Whether the numeric readout is visible (default: true) */
  showValue?: boolean;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Accessible label for screen readers */
  ariaLabel?: string;
  /** Callback fired when the value changes */
  onChange?: (value: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function WakeSlider({
  bars = 36,
  wake = 60,
  value: controlledValue,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  theme = "light",
  showValue = true,
  disabled = false,
  ariaLabel = "Value",
  onChange,
  className = "",
  style,
}: WakeSliderProps) {
  const n = Math.round(clamp(bars, 12, 64));
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(
    clamp(isControlled ? controlledValue : defaultValue, min, max)
  );

  const currentValue = isControlled ? clamp(controlledValue, min, max) : internalValue;
  const isDark = theme === "dark";

  const track = useRef<HTMLDivElement | null>(null);
  const els = useRef<(HTMLSpanElement | null)[]>([]);
  const st = useRef({
    energy: new Float32Array(n),
    down: false,
    lastX: 0,
    lastT: 0,
    speed: 0,
    raf: 0,
    at: (currentValue - min) / (max - min || 1),
    lastBar: -1,
  });

  const knob = useRef(wake);
  useEffect(() => {
    knob.current = wake;
  }, [wake]);

  // Keep internal energy array in sync if bar count changes
  useEffect(() => {
    st.current.energy = new Float32Array(n);
  }, [n]);

  // Sync external controlled value
  useEffect(() => {
    if (isControlled) {
      st.current.at = (controlledValue - min) / (max - min || 1);
    }
  }, [controlledValue, isControlled, min, max]);

  const loop = () => {
    const s = st.current;
    if (s.raf) return;
    let prev = performance.now();

    const run = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      let live = false;
      const fall = Math.exp(-dt * 6.5);

      for (let i = 0; i < s.energy.length; i++) {
        s.energy[i] *= fall;
        if (s.energy[i] < 0.002) {
          s.energy[i] = 0;
        } else {
          live = true;
        }

        const b = els.current[i];
        if (b) {
          b.style.transform = `scaleY(${(1 + s.energy[i] * 1.6).toFixed(3)})`;
        }
      }

      s.raf = live || s.down ? requestAnimationFrame(run) : 0;
    };

    s.raf = requestAnimationFrame(run);
  };

  useEffect(() => {
    const s = st.current;
    return () => {
      if (s.raf) {
        cancelAnimationFrame(s.raf);
      }
    };
  }, []);

  const to = (f: number, speed: number) => {
    const s = st.current;
    f = clamp(f, 0, 1);
    const from = s.at;
    s.at = f;

    const a = Math.round(from * (n - 1));
    const b = Math.round(f * (n - 1));

    // Speed saturation curve scaled by wake amplitude
    const push = (1 - Math.exp(-speed / 900)) * (knob.current / 60);
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);

    for (let i = lo; i <= hi; i++) {
      s.energy[i] = Math.max(s.energy[i], push);
    }

    if (b !== s.lastBar) {
      s.lastBar = b;
    }

    const nextVal = Math.round((min + f * (max - min)) / step) * step;
    const clampedNext = clamp(nextVal, min, max);

    if (!isControlled) {
      setInternalValue(clampedNext);
    }
    onChange?.(clampedNext);
    loop();
  };

  const frac = (clientX: number) => {
    if (!track.current) return 0;
    const r = track.current.getBoundingClientRect();
    return (clientX - r.left) / r.width;
  };

  const totalSteps = max - min || 1;
  const currentFraction = (currentValue - min) / totalSteps;
  const lit = Math.round(currentFraction * (n - 1));

  return (
    <div
      className={cn(
        "relative flex items-center gap-4 select-none transition-colors duration-300",
        isDark ? "text-[#c2c2c2]" : "text-[#0f172a]",
        disabled && "opacity-40 pointer-events-none",
        className
      )}
      style={style}
    >
      <div
        ref={track}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        className={cn(
          "relative flex items-center cursor-ew-resize touch-none select-none rounded-md outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-4 [-webkit-tap-highlight-color:transparent]",
          isDark
            ? "focus-visible:ring-[#ffffff]/40 focus-visible:ring-offset-[#1b1b1b]"
            : "focus-visible:ring-[#0f172a]/30 focus-visible:ring-offset-white"
        )}
        style={{
          width: n * (BAR + GAP) - GAP,
          height: H * 2.6,
          gap: `${GAP}px`,
        }}
        onPointerDown={(e) => {
          if (disabled) return;
          const s = st.current;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // Scripted pointer
          }
          s.down = true;
          s.lastX = e.clientX;
          s.lastT = performance.now();
          s.speed = 0;
          to(frac(e.clientX), 0);
        }}
        onPointerMove={(e) => {
          const s = st.current;
          if (!s.down || disabled) return;
          const now = performance.now();
          const dt = Math.max(0.008, (now - s.lastT) / 1000);
          const v = Math.abs(e.clientX - s.lastX) / dt;
          s.speed = s.speed * 0.5 + v * 0.5;
          s.lastX = e.clientX;
          s.lastT = now;
          to(frac(e.clientX), s.speed);
        }}
        onPointerUp={(e) => {
          st.current.down = false;
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {
            // Never captured
          }
        }}
        onPointerCancel={() => {
          st.current.down = false;
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          const jump = e.shiftKey ? step * 10 : step;
          let next: number | null = null;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") next = currentValue + jump;
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = currentValue - jump;
          if (e.key === "Home") next = min;
          if (e.key === "End") next = max;
          if (next === null) return;
          e.preventDefault();
          const targetFraction = (clamp(next, min, max) - min) / totalSteps;
          to(targetFraction, 600);
        }}
      >
        {Array.from({ length: n }, (_, i) => {
          const isLit = currentValue > min && i <= lit;
          return (
            <span
              key={i}
              ref={(b) => {
                els.current[i] = b;
              }}
              data-on={isLit || undefined}
              className={cn(
                "flex-none rounded-full origin-center transition-colors duration-160 will-change-transform",
                isLit
                  ? isDark
                    ? "bg-[#ffffff]"
                    : "bg-[#0f172a]"
                  : isDark
                    ? "bg-[#6b6b6b]"
                    : "bg-[#0f172a]/25"
              )}
              style={{
                width: `${BAR}px`,
                height: `${H}px`,
              }}
            />
          );
        })}
      </div>

      {showValue && (
        <span
          className={cn(
            "min-w-[3ch] font-mono text-sm font-medium tabular-nums tracking-tight transition-colors duration-300",
            isDark ? "text-[#c2c2c2]" : "text-[#475569]"
          )}
        >
          {currentValue}
        </span>
      )}
    </div>
  );
}

export { WakeSlider as Slider };
