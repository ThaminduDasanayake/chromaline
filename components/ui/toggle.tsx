"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ══ 1 · Liquid Toggle ═══════════════════════════════════════════════
   One crisp droplet body that dynamically stretches and thins into
   its own travel direction with area-preserving kinematics:
   scaleY = 1 / scaleX.

   Black and white inverted ramp with NO borders or strokes:
   - Off: Track is the slab (#262626 dark / #ffffff light),
          thumb is a 19% ink mix (#4f4f4f dark / #d4d4d4 light).
   - On:  Track is full ink (#ffffff dark / #17181a light),
          thumb is the slab (#262626 dark / #ffffff light).
   ═══════════════════════════════════════════════════════════════════ */

export type ToggleSizePreset = "xs" | "sm" | "default" | "lg";
export type ToggleSize = ToggleSizePreset | number;
export type ToggleVariant = "default" | "light" | "dark";

export interface ToggleProps {
  /** Controlled checked state */
  checked?: boolean;
  /** Initial checked state when uncontrolled */
  defaultChecked?: boolean;
  /** Callback fired when checked state changes */
  onChange?: (checked: boolean) => void;
  /** Droplet stretch intensity into its travel (0..100). Default: 36 */
  stretch?: number;
  /** Spring crossing speed (0..100). Default: 50 */
  speed?: number;
  /** Size preset ('xs' | 'sm' | 'default' | 'lg') or arbitrary track height in pixels. Default: 'default' */
  size?: ToggleSize;
  /** Custom track width in pixels (optional override) */
  width?: number;
  /** Custom track height in pixels (optional override) */
  height?: number;
  /** Color theme variant. Default: 'default' */
  variant?: ToggleVariant;
  /** Visual theme mode ('light' | 'dark') */
  theme?: "light" | "dark";
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Accessible label */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface ComputedSizeConfig {
  trackWidth: number;
  trackHeight: number;
  thumbSize: number;
  pad: number;
}

const PRESET_CONFIGS: Record<ToggleSizePreset, ComputedSizeConfig> = {
  xs: {
    trackWidth: 52,
    trackHeight: 26,
    thumbSize: 20,
    pad: 3,
  },
  sm: {
    trackWidth: 72,
    trackHeight: 36,
    thumbSize: 28,
    pad: 4,
  },
  default: {
    trackWidth: 92,
    trackHeight: 46,
    thumbSize: 36,
    pad: 5,
  },
  lg: {
    trackWidth: 112,
    trackHeight: 56,
    thumbSize: 44,
    pad: 6,
  },
};

const VARIANTS: Record<
  ToggleVariant,
  {
    trackOff: string;
    trackOn: string;
    thumbOff: string;
    thumbOn: string;
  }
> = {
  default: {
    trackOff: "var(--fill-slab, #262626)",
    trackOn: "var(--fill-on, #ffffff)",
    thumbOff: "color-mix(in srgb, var(--fill-on, #ffffff) 19%, var(--fill-slab, #262626))",
    thumbOn: "var(--fill-slab, #262626)",
  },
  light: {
    trackOff: "#ffffff",
    trackOn: "#17181a",
    thumbOff: "color-mix(in srgb, #17181a 19%, #ffffff)",
    thumbOn: "#ffffff",
  },
  dark: {
    trackOff: "#262626",
    trackOn: "#ffffff",
    thumbOff: "color-mix(in srgb, #ffffff 19%, #262626)",
    thumbOn: "#262626",
  },
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function Toggle({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  stretch = 36,
  speed = 50,
  size = "default",
  width,
  height,
  variant,
  theme,
  disabled = false,
  ariaLabel = "Liquid toggle",
  className = "",
  style = {},
}: ToggleProps) {
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const on = isControlled ? controlledChecked : internalChecked;

  const [held, setHeld] = useState(false);
  const [hot, setHot] = useState(false);

  const rail = useRef<HTMLButtonElement | null>(null);
  const grip = useRef<{ id: number; grab: number | null; moved: boolean } | null>(null);

  const cfg = useMemo<ComputedSizeConfig>(() => {
    if (
      typeof size === "string" &&
      size in PRESET_CONFIGS &&
      width === undefined &&
      height === undefined
    ) {
      return PRESET_CONFIGS[size as ToggleSizePreset];
    }

    const baseHeight =
      typeof size === "number"
        ? size
        : typeof size === "string" && size in PRESET_CONFIGS
          ? PRESET_CONFIGS[size as ToggleSizePreset].trackHeight
          : 46;

    const finalHeight = Math.max(16, height ?? baseHeight);
    const finalWidth = Math.max(finalHeight * 1.5, width ?? Math.round(finalHeight * 2));
    const pad = Math.max(2, Math.round(finalHeight * 0.1));
    const thumbSize = Math.max(8, finalHeight - pad * 2);

    return {
      trackWidth: finalWidth,
      trackHeight: finalHeight,
      thumbSize,
      pad,
    };
  }, [size, width, height]);

  const activeVariant: ToggleVariant = theme
    ? theme === "dark"
      ? "dark"
      : "light"
    : variant || "default";

  const colors = VARIANTS[activeVariant] || VARIANTS.default;

  const SHUT_X = cfg.pad;
  const OPEN_X = cfg.trackWidth - cfg.thumbSize - cfg.pad;
  const MID_X = (SHUT_X + OPEN_X) / 2;

  // The thumb motion value
  const x = useMotionValue<number>(on ? OPEN_X : SHUT_X);

  // Velocity-driven area-preserving stretch: scaleY = 1 / scaleX
  const vel = useVelocity(x);
  const eased = useSpring(vel, { stiffness: 380, damping: 34, mass: 0.6 });

  const lengthen = useCallback(
    (v: number) => 1 + Math.min(0.4, Math.abs(v) / 600) * (clamp(stretch, 0, 100) / 100),
    [stretch]
  );

  // Hover swell composed into transform
  const swell = useSpring(hot && !disabled ? 1.035 : 1, {
    stiffness: 380,
    damping: 34,
    mass: 0.6,
  });

  const wide = useTransform([eased, swell], ([v, s]: number[]) => lengthen(v) * s);
  const tall = useTransform([eased, swell], ([v, s]: number[]) => s / lengthen(v));

  // Spring settle physics when landing
  const settle = useMemo(
    () => ({
      type: "spring" as const,
      stiffness: 170 - (50 - speed) * 1.1,
      damping: 21.5,
      mass: 0.9,
    }),
    [speed]
  );

  // Settle animation when target state changes (not held)
  useEffect(() => {
    if (held) return;
    const run = animate(x, on ? OPEN_X : SHUT_X, settle);
    return () => run.stop();
  }, [on, held, x, settle, OPEN_X, SHUT_X]);

  const setToggle = useCallback(
    (nextState: boolean) => {
      if (disabled) return;
      if (!isControlled) {
        setInternalChecked(nextState);
      }
      onChange?.(nextState);
    },
    [disabled, isControlled, onChange]
  );

  const local = (clientX: number) => {
    const el = rail.current;
    if (!el) return 0;
    const b = el.getBoundingClientRect();
    const k = b.width / (el.offsetWidth || b.width) || 1;
    return (clientX - b.left) / k;
  };

  const down = (e: React.PointerEvent) => {
    if (disabled || e.button !== 0) return;
    grip.current = { id: e.pointerId, grab: null, moved: false };
    setHeld(true);
    try {
      rail.current?.setPointerCapture(e.pointerId);
    } catch {
      /* ignore non-live */
    }
  };

  const move = (e: React.PointerEvent) => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId || disabled) return;
    const at = local(e.clientX);
    if (g.grab === null) g.grab = at - x.get();
    const next = clamp(at - g.grab, SHUT_X, OPEN_X);
    if (Math.abs(next - x.get()) > 0.4) g.moved = true;
    x.set(next);

    const past = next > MID_X;
    if (past !== on) {
      setToggle(past);
    }
  };

  const up = (e: React.PointerEvent) => {
    const g = grip.current;
    if (!g || disabled) return;
    grip.current = null;
    try {
      rail.current?.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }

    if (!g.moved) {
      setToggle(!on);
    }
    setHeld(false);
  };

  const currentTrackBg = on ? colors.trackOn : colors.trackOff;
  const currentThumbBg = on ? colors.thumbOn : colors.thumbOff;

  return (
    <div
      data-theme={activeVariant !== "default" ? activeVariant : undefined}
      className={cn("relative inline-flex items-center justify-center select-none", className)}
      style={style}
    >
      <button
        ref={rail}
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={ariaLabel}
        disabled={disabled}
        data-on={on}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerEnter={() => setHot(true)}
        onPointerLeave={() => setHot(false)}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            setToggle(!on);
          }
        }}
        className="relative block cursor-pointer touch-none rounded-full border-0 p-0 transition-colors duration-[420ms] ease-out outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:duration-[160ms]"
        style={{
          width: `${cfg.trackWidth}px`,
          height: `${cfg.trackHeight}px`,
          backgroundColor: currentTrackBg,
          border: 0,
          boxShadow: "none",
        }}
      >
        <span className="pointer-events-none absolute inset-0 block" aria-hidden="true">
          <motion.span
            className="pointer-events-none absolute top-1/2 left-0 rounded-full transition-colors duration-[420ms] ease-out motion-reduce:duration-[160ms]"
            style={{
              width: `${cfg.thumbSize}px`,
              height: `${cfg.thumbSize}px`,
              marginTop: `${-cfg.thumbSize / 2}px`,
              backgroundColor: currentThumbBg,
              border: 0,
              boxShadow: "none",
              x,
              scaleX: wide,
              scaleY: tall,
            }}
          />
        </span>
      </button>
    </div>
  );
}
