"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

/* ══ Toggle (Liquid Goo Switch) ═════════════════════════════
   Two blobs, not one, and ONE POSITION between them.
   The thumb's x is a motion value — a finger writes it,
   a spring settles it — and the drop is a spring FOLLOWING
   that value rather than the same target with a delay on it.

   When moving fast, the drop lags behind and the SVG goo
   filter necks out between them like liquid mercury.
   ─────────────────────────────────────────────────────────── */

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
  /** Size preset ('xs' | 'sm' | 'default' | 'lg') or arbitrary track height in pixels (e.g. 24, 32). Default: 'default' */
  size?: ToggleSize;
  /** Custom track width in pixels (optional override) */
  width?: number;
  /** Custom track height in pixels (optional override) */
  height?: number;
  /** Color theme variant. Default: 'default' */
  variant?: ToggleVariant;
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
  dropSize: number;
  pad: number;
  blur: number;
}

const PRESET_CONFIGS: Record<ToggleSizePreset, ComputedSizeConfig> = {
  xs: {
    trackWidth: 52,
    trackHeight: 26,
    thumbSize: 20,
    dropSize: 14,
    pad: 3,
    blur: 4,
  },
  sm: {
    trackWidth: 72,
    trackHeight: 36,
    thumbSize: 28,
    dropSize: 20,
    pad: 4,
    blur: 5.5,
  },
  default: {
    trackWidth: 92,
    trackHeight: 46,
    thumbSize: 36,
    dropSize: 26,
    pad: 5,
    blur: 7,
  },
  lg: {
    trackWidth: 112,
    trackHeight: 56,
    thumbSize: 44,
    dropSize: 32,
    pad: 6,
    blur: 8.5,
  },
};

const VARIANTS: Record<
  ToggleVariant,
  {
    trackOff: string;
    trackOn: string;
    thumbOff: string;
    thumbOn: string;
    borderOff: string;
    borderOn: string;
  }
> = {
  default: {
    trackOff: "#ffffff",
    trackOn: "#18181b",
    thumbOff: "#d3d3d4",
    thumbOn: "#ffffff",
    borderOff: "rgba(0, 0, 0, 0.08)",
    borderOn: "rgba(0, 0, 0, 0.15)",
  },
  light: {
    trackOff: "#ffffff",
    trackOn: "#18181b",
    thumbOff: "#d3d3d4",
    thumbOn: "#ffffff",
    borderOff: "rgba(0, 0, 0, 0.08)",
    borderOn: "rgba(0, 0, 0, 0.15)",
  },
  dark: {
    trackOff: "#1b1b1b",
    trackOn: "#ffffff",
    thumbOff: "#464646",
    thumbOn: "#1b1b1b",
    borderOff: "rgba(255, 255, 255, 0.12)",
    borderOn: "rgba(0, 0, 0, 0.08)",
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
  variant = "default",
  disabled = false,
  ariaLabel = "Liquid toggle",
  className = "",
  style = {},
}: ToggleProps) {
  const instanceId = useId().replace(/:/g, "");
  const filterId = `liq-goo-${instanceId}`;

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
    const dropSize = Math.max(6, Math.round(thumbSize * 0.72));
    const blur = Math.max(2.2, Number((thumbSize * 0.195).toFixed(1)));

    return {
      trackWidth: finalWidth,
      trackHeight: finalHeight,
      thumbSize,
      dropSize,
      pad,
      blur,
    };
  }, [size, width, height]);

  const colors = VARIANTS[variant] || VARIANTS.default;

  const SHUT_X = cfg.pad;
  const OPEN_X = cfg.trackWidth - cfg.thumbSize - cfg.pad;
  const MID_X = (SHUT_X + OPEN_X) / 2;

  // The thumb leading position
  const x = useMotionValue<number>(on ? OPEN_X : SHUT_X);

  // The drop follows x on a spring — stretch knob controls how much it lags behind
  const chaseStiffness = 260 - (clamp(stretch, 0, 100) / 100) * 140; // 120 (stretchy) .. 260 (tight)
  const chaseDamping = 18 + (1 - clamp(stretch, 0, 100) / 100) * 8; // 18 .. 26
  const chase = useSpring(x, {
    stiffness: chaseStiffness,
    damping: chaseDamping,
    mass: 1,
  });

  // Concentric horizontal offset when resting
  const dropOffset = (cfg.thumbSize - cfg.dropSize) / 2;
  const dropX = useTransform(chase, (v) => v + dropOffset);

  // Subtle velocity-driven stretch along travel
  const vel = useVelocity(x);
  const eased = useSpring(vel, { stiffness: 380, damping: 34, mass: 0.6 });

  const lengthen = useCallback(
    (v: number) => 1 + Math.min(0.28, Math.abs(v) / 600) * (clamp(stretch, 0, 100) / 100),
    [stretch]
  );

  // Hover swell composed into scale
  const swell = useSpring(hot && !disabled ? 1.03 : 1, {
    stiffness: 380,
    damping: 34,
    mass: 0.6,
  });

  const wide = useTransform([eased, swell], ([v, s]: number[]) => lengthen(v) * s);
  const tall = useTransform([eased, swell], ([v, s]: number[]) => s / lengthen(v));

  // Settle physics when landing
  const settle = useMemo(
    () => ({
      type: "spring" as const,
      stiffness: 170 + ((clamp(speed, 0, 100) - 50) / 50) * 70,
      damping: 21.5,
      mass: 0.9,
    }),
    [speed]
  );

  // Sync animation when target changes (not holding)
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
  const currentBorder = on ? colors.borderOn : colors.borderOff;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={style}
    >
      {/* Self-contained SVG Goo Filter Definition */}
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <defs>
          <filter
            id={filterId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation={cfg.blur} result="smear" />
            <feColorMatrix
              in="smear"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            />
          </filter>
        </defs>
      </svg>

      <button
        ref={rail}
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={ariaLabel}
        disabled={disabled}
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
          boxShadow: `inset 0 0 0 1px ${currentBorder}`,
        }}
      >
        {/* Layer 1: Filtered Liquid Goo Layer (Underneath for trail & necking) */}
        <span
          className="pointer-events-none absolute inset-0 block overflow-visible"
          aria-hidden="true"
          style={{ filter: `url(#${filterId})` }}
        >
          {/* Secondary trailing droplet chasing on spring */}
          <motion.span
            className="pointer-events-none absolute top-1/2 left-0 rounded-full transition-colors duration-[420ms] ease-out motion-reduce:duration-[160ms]"
            style={{
              width: `${cfg.dropSize}px`,
              height: `${cfg.dropSize}px`,
              marginTop: `${-cfg.dropSize / 2}px`,
              backgroundColor: currentThumbBg,
              x: dropX,
            }}
          />

          {/* Liquid bridge anchor underneath thumb */}
          <motion.span
            className="pointer-events-none absolute top-1/2 left-0 rounded-full transition-colors duration-[420ms] ease-out motion-reduce:duration-[160ms]"
            style={{
              width: `${cfg.thumbSize - 2}px`,
              height: `${cfg.thumbSize - 2}px`,
              marginTop: `${-(cfg.thumbSize - 2) / 2}px`,
              backgroundColor: currentThumbBg,
              x,
              scaleX: wide,
              scaleY: tall,
            }}
          />
        </span>

        {/* Layer 2: Pristine Unfiltered Vector Thumb (On top in exact register - ZERO blur) */}
        <motion.span
          className="pointer-events-none absolute top-1/2 left-0 rounded-full shadow-2xs transition-colors duration-[420ms] ease-out motion-reduce:duration-[160ms]"
          style={{
            width: `${cfg.thumbSize}px`,
            height: `${cfg.thumbSize}px`,
            marginTop: `${-cfg.thumbSize / 2}px`,
            backgroundColor: currentThumbBg,
            x,
            scaleX: wide,
            scaleY: tall,
          }}
        />
      </button>
    </div>
  );
}
