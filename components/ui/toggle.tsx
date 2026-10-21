"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
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

export type ToggleSize = "sm" | "default" | "lg";
export type ToggleVariant = "default" | "emerald" | "orange" | "indigo" | "dark";

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
  /** Size preset. Default: 'default' */
  size?: ToggleSize;
  /** Color theme variant. Default: 'default' */
  variant?: ToggleVariant;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Accessible label */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_CONFIGS: Record<
  ToggleSize,
  {
    trackWidth: number;
    trackHeight: number;
    thumbSize: number;
    dropSize: number;
    pad: number;
  }
> = {
  sm: {
    trackWidth: 72,
    trackHeight: 36,
    thumbSize: 28,
    dropSize: 20,
    pad: 4,
  },
  default: {
    trackWidth: 92,
    trackHeight: 46,
    thumbSize: 36,
    dropSize: 26,
    pad: 5,
  },
  lg: {
    trackWidth: 112,
    trackHeight: 56,
    thumbSize: 44,
    dropSize: 32,
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
    borderOff: string;
    borderOn: string;
  }
> = {
  default: {
    trackOff: "#e2e8f0",
    trackOn: "#0f172a",
    thumbOff: "#64748b",
    thumbOn: "#ffffff",
    borderOff: "rgba(148, 163, 184, 0.4)",
    borderOn: "rgba(15, 23, 42, 0.2)",
  },
  emerald: {
    trackOff: "#e2e8f0",
    trackOn: "#059669",
    thumbOff: "#64748b",
    thumbOn: "#ffffff",
    borderOff: "rgba(148, 163, 184, 0.4)",
    borderOn: "rgba(5, 150, 105, 0.25)",
  },
  orange: {
    trackOff: "#e2e8f0",
    trackOn: "#ea580c",
    thumbOff: "#64748b",
    thumbOn: "#ffffff",
    borderOff: "rgba(148, 163, 184, 0.4)",
    borderOn: "rgba(234, 88, 12, 0.25)",
  },
  indigo: {
    trackOff: "#e2e8f0",
    trackOn: "#4f46e5",
    thumbOff: "#64748b",
    thumbOn: "#ffffff",
    borderOff: "rgba(148, 163, 184, 0.4)",
    borderOn: "rgba(79, 70, 229, 0.25)",
  },
  dark: {
    trackOff: "#1e293b",
    trackOn: "#ffffff",
    thumbOff: "#94a3b8",
    thumbOn: "#0f172a",
    borderOff: "rgba(255, 255, 255, 0.12)",
    borderOn: "rgba(0, 0, 0, 0.1)",
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

  const cfg = SIZE_CONFIGS[size] || SIZE_CONFIGS.default;
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
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="smear" />
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
        className="relative block cursor-pointer p-0 border-0 rounded-full outline-none touch-none transition-colors duration-300 ease-out motion-reduce:duration-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          width: `${cfg.trackWidth}px`,
          height: `${cfg.trackHeight}px`,
          backgroundColor: currentTrackBg,
          boxShadow: `inset 0 0 0 1px ${currentBorder}`,
        }}
      >
        {/* Layer 1: Filtered Goo Metaballs (Thumb + Chasing Drop) */}
        <span
          className="absolute inset-0 block overflow-visible pointer-events-none"
          aria-hidden="true"
          style={{ filter: `url(#${filterId})` }}
        >
          {/* Main leading droplet */}
          <motion.span
            className="absolute left-0 top-1/2 rounded-full pointer-events-none transition-colors duration-300 ease-out motion-reduce:duration-100"
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

          {/* Secondary trailing droplet chasing on spring */}
          <motion.span
            className="absolute left-0 top-1/2 rounded-full pointer-events-none transition-colors duration-300 ease-out motion-reduce:duration-100"
            style={{
              width: `${cfg.dropSize}px`,
              height: `${cfg.dropSize}px`,
              marginTop: `${-cfg.dropSize / 2}px`,
              backgroundColor: currentThumbBg,
              x: dropX,
            }}
          />
        </span>
      </button>
    </div>
  );
}
