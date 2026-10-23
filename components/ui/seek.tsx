"use client";

import React, { useEffect, useRef, useState } from "react";

/* ══ Seek ═══════════════════════════════════════════════════
   A search icon that springs into a search field.
   ONE OBJECT, NOT TWO.
   Continuous physics, cursor magnetic pull, and tactile yield.
   Ported & adapted for Chromaline design system.
   ─────────────────────────────────────────────────────────── */

export interface SeekProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  width?: number;
  size?: "sm" | "default" | "lg";
  give?: number; // 0..100 cursor magnet pull
  spring?: number; // 0..100 spring overshoot & settling rate
  corner?: number;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const stillness = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

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

const SIZE_CONFIGS = {
  sm: { shut: 44, lens: 20, font: 14, clearSize: 14 },
  default: { shut: 56, lens: 24, font: 15, clearSize: 16 },
  lg: { shut: 64, lens: 28, font: 16, clearSize: 18 },
};

export function Seek({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onSearch,
  onOpenChange,
  placeholder = "Search",
  width,
  size = "default",
  give = 50,
  spring = 50,
  corner,
  className = "",
  disabled = false,
  autoFocus = false,
}: SeekProps) {
  const cfg = SIZE_CONFIGS[size] || SIZE_CONFIGS.default;
  const shut = cfg.shut;
  const lens = cfg.lens;
  const inset = (shut - lens) / 2;
  const maxCorner = shut / 2;
  const actualCorner = corner !== undefined ? clamp(corner, 0, maxCorner) : maxCorner;

  const [snug, setSnug] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches
  );
  const [touch, setTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  );

  useEffect(() => {
    const room = window.matchMedia("(max-width: 760px)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const read = () => {
      setSnug(room.matches);
      setTouch(coarse.matches);
    };
    room.addEventListener("change", read);
    coarse.addEventListener("change", read);
    return () => {
      room.removeEventListener("change", read);
      coarse.removeEventListener("change", read);
    };
  }, []);

  const span = width ?? (snug ? 240 : size === "sm" ? 220 : 280);

  const frameRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const beatTimer = useRef(0);
  const busyTimer = useRef(0);

  const [open, setOpenState] = useState(autoFocus);
  const [press, setPress] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [lean, setLean] = useState({ x: 0, y: 0 });
  const still = stillness();

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const setOpen = (next: boolean) => {
    setOpenState(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(beatTimer.current);
      window.clearTimeout(busyTimer.current);
    };
  }, []);

  const target = open ? Math.max(shut, span) : shut;
  const w = useSpring(target, clamp(spring, 0, 100), still);
  const p = clamp((w - shut) / Math.max(1, Math.max(shut, span) - shut), 0, 1);

  // Magnetic cursor lean when hovering nearby while closed
  useEffect(() => {
    const el = frameRef.current;
    if (!el || open || still || disabled) return;
    let raf = 0;
    let at = { x: 0, y: 0 };
    const publish = () => {
      raf = 0;
      setLean(at);
    };
    const read = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      const k = b.width / (el.offsetWidth || b.width) || 1;
      const dx = (e.clientX - (b.left + b.width / 2)) / k;
      const dy = (e.clientY - (b.top + b.height / 2)) / k;
      const d = Math.hypot(dx, dy);
      const R = 110;
      if (d > R) {
        if (at.x || at.y) {
          at = { x: 0, y: 0 };
          if (!raf) raf = requestAnimationFrame(publish);
        }
        return;
      }
      const pull = (1 - d / R) ** 1.4 * (2 + (give / 100) * 5);
      at = { x: (dx / (d || 1)) * pull, y: (dy / (d || 1)) * pull };
      if (!raf) raf = requestAnimationFrame(publish);
    };
    const gone = () => {
      at = { x: 0, y: 0 };
      if (!raf) raf = requestAnimationFrame(publish);
    };
    document.addEventListener("pointermove", read, { passive: true });
    document.addEventListener("pointerleave", gone);
    return () => {
      document.removeEventListener("pointermove", read);
      document.removeEventListener("pointerleave", gone);
      cancelAnimationFrame(raf);
    };
  }, [open, give, still, disabled]);

  // Tactile yield beat before expansion
  const start = () => {
    if (open || disabled) return;
    setPress(true);
    window.clearTimeout(beatTimer.current);
    beatTimer.current = window.setTimeout(
      () => {
        setPress(false);
        setOpen(true);
        inputRef.current?.focus();
      },
      still ? 0 : 90
    );
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Prevent collapsing if focus moved to clear button
    if (frameRef.current?.contains(e.relatedTarget as Node)) return;
    if (currentValue.trim()) return;
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isControlled) setUncontrolledValue("");
    onChange?.("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (!isControlled) setUncontrolledValue("");
      onChange?.("");
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter") {
      onSearch?.(currentValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isControlled) setUncontrolledValue(val);
    onChange?.(val);
    setBusy(true);
    window.clearTimeout(busyTimer.current);
    busyTimer.current = window.setTimeout(() => setBusy(false), 340);
  };

  const sayProgress = clamp((p - 0.55) / 0.45, 0, 1);

  return (
    <div
      ref={frameRef}
      className={`relative inline-grid place-items-center select-none ${className}`}
      style={{
        width: `${Math.max(shut, span) + 24}px`,
        height: `${shut + 24}px`,
      }}
      data-open={open}
      data-press={press}
      data-busy={busy}
    >
      <div
        className={`group/seek relative isolate overflow-hidden bg-white/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_32px_rgba(15,23,42,0.08)] backdrop-blur-md backdrop-saturate-150 ${
          !open ? "[@media(hover:hover)]:hover:scale-[1.04]" : ""
        }`}
        style={{
          width: `${w.toFixed(2)}px`,
          height: `${shut}px`,
          borderRadius: `${actualCorner}px`,
          transform: `translate(${lean.x.toFixed(2)}px, ${lean.y.toFixed(2)}px) scale(${press ? 0.93 : 1})`,
          transition: `transform ${press ? "160ms" : "220ms"} cubic-bezier(0.22, 1, 0.36, 1), background 220ms ease`,
        }}
      >
        {/* Prismatic specular lit rim */}
        <span
          className="pointer-events-none absolute inset-0 z-2 rounded-full border border-transparent mask-exclude [-webkit-mask-composite:xor] [-webkit-mask:linear-gradient(#000_0_0)_padding-box,linear-gradient(#000_0_0)] [background:linear-gradient(142deg,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0.18)_26%,rgba(255,255,255,0.06)_62%,rgba(255,255,255,0.45)_100%)_border-box] [mask:linear-gradient(#000_0_0)_padding-box,linear-gradient(#000_0_0)]"
          style={{ borderRadius: `${actualCorner}px` }}
          aria-hidden="true"
        />

        {/* Custom continuous vector lens */}
        <svg
          className={`pointer-events-none absolute top-1/2 z-3 fill-none transition-[stroke,stroke-width] duration-220 ease-out ${
            busy ? "stroke-slate-900" : "stroke-slate-500 group-hover/seek:stroke-slate-900"
          }`}
          viewBox="0 0 18 18"
          aria-hidden="true"
          style={{
            left: `${inset}px`,
            width: `${lens}px`,
            height: `${lens}px`,
            marginTop: `${-lens / 2}px`,
            strokeWidth: busy ? 2.0 : 1.75,
            strokeLinecap: "round",
          }}
        >
          <circle cx="7.6" cy="7.6" r="5.4" />
          <path d="M11.6 11.6 L15.4 15.4" />
        </svg>

        {/* Expandable Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={currentValue}
          placeholder={placeholder}
          aria-label={placeholder}
          inputMode={touch ? "none" : undefined}
          tabIndex={open ? 0 : -1}
          disabled={disabled}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="absolute top-0 z-3 h-full border-0 bg-transparent font-sans font-medium tracking-tight text-slate-900 outline-none placeholder:text-slate-400"
          style={{
            left: `${inset + lens + (size === "sm" ? 8 : 11)}px`,
            right: `${open && currentValue ? (size === "sm" ? 34 : 40) : 16}px`,
            fontSize: `${cfg.font}px`,
            opacity: Number(sayProgress.toFixed(3)),
            transform: `translateX(${(1 - sayProgress) * -6}px)`,
            pointerEvents: open ? "auto" : "none",
          }}
        />

        {/* Clear button when field has content */}
        {open && currentValue && (
          <button
            type="button"
            className="absolute top-1/2 z-5 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-slate-900/7 text-slate-600 transition-all duration-150 hover:bg-slate-900/14 hover:text-slate-900"
            aria-label="Clear search"
            onClick={handleClear}
            style={{
              right: `${size === "sm" ? 10 : 13}px`,
              width: `${size === "sm" ? 20 : 24}px`,
              height: `${size === "sm" ? 20 : 24}px`,
              opacity: sayProgress > 0.8 ? 1 : 0,
            }}
          >
            <svg
              width={cfg.clearSize}
              height={cfg.clearSize}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 4 L12 12 M12 4 L4 12" />
            </svg>
          </button>
        )}

        {/* Target button when closed */}
        {!open && (
          <button
            type="button"
            className="rounded-inherit absolute inset-0 z-4 cursor-pointer border-0 bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            aria-label={placeholder}
            onClick={start}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}
