"use client";

/**
 * SelectBar (Glass Bar)
 *
 * A refined physical frosted glass selector and navigation dock with
 * two-phase mercury stretch dilation and overshoot landing kinematics.
 */

import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ── elastic motion tuning (exact curves from lab/motion) ── */
const rate = (speed: number) => 1.6 - (speed / 100) * 1.2;

const overshoot = (bounce: number, tuned: number) =>
  Number((1 + (bounce / 100) * (tuned - 1) * 2).toFixed(3));

const curve = (bounce: number, tuned: number, x1 = 0.28, x2 = 0.36) =>
  `cubic-bezier(${x1}, ${overshoot(bounce, tuned)}, ${x2}, 1)`;

const settle = (bounce: number) => ({
  move: curve(bounce, 1.28, 0.28, 0.36),
  size: curve(bounce, 1.34, 0.24, 0.38),
});

type Ind = { p: number; s: number };

export interface SelectBarItem<T extends string = string> {
  key: T;
  label?: string;
  icon?: React.ReactNode;
  color?: string;
  darkOutline?: string;
  title?: string;
  showLabel?: boolean;
}

export interface SelectBarProps<T extends string = string> {
  items: SelectBarItem<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  size?: "xs" | "sm" | "default";
  dilate?: number;
  bounce?: number;
  speed?: number;
  hug?: number;
  className?: string;
  ariaLabel?: string;
  // Backward compatibility props
  variant?: "glass" | "swatches" | "pill";
  axis?: "row" | "column";
  corner?: number;
}

export function SelectBar<T extends string = string>({
  items,
  value,
  defaultValue,
  onChange,
  size = "sm",
  dilate = 100,
  bounce = 50,
  speed = 50,
  hug,
  className = "",
  ariaLabel = "Navigation",
}: SelectBarProps<T>) {
  const initialKey = value ?? defaultValue ?? items[0]?.key;
  const [active, setActive] = useState<T>(initialKey);

  const trackRef = useRef<HTMLElement | null>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ind, setInd] = useState<Ind | null>(null);
  const [phase, setPhase] = useState<"idle" | "stretch" | "settle">("idle");
  const indRef = useRef<Ind | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const hasSwatches = items.some((item) => Boolean(item.color));
  const defaultHug = hasSwatches ? 3 : size === "xs" ? 3 : size === "sm" ? 4 : 6;
  const actualHug = hug !== undefined ? hug : defaultHug;

  const measure = useCallback((k: string): Ind | null => {
    const el = refs.current[k];
    if (!el) return null;
    return { p: el.offsetLeft, s: el.offsetWidth };
  }, []);

  const activeRef = useRef<T>(initialKey);
  const prevValueRef = useRef<T | undefined>(value);

  // Exact 2-phase elastic stretch and settle glide
  const select = useCallback(
    (k: T) => {
      if (k === activeRef.current) return;
      activeRef.current = k;
      prevValueRef.current = k;
      const to = measure(k);
      const from = indRef.current;
      setActive(k);

      if (!to) return;
      window.clearTimeout(timer.current);

      if (!from) {
        indRef.current = to;
        setPhase("settle");
        setInd(to);
        return;
      }

      /* Leading edge dilates across the union of slots */
      const start = Math.min(from.p, to.p);
      const end = Math.max(from.p + from.s, to.p + to.s);
      const grow = dilate / 100;

      setPhase("stretch");
      setInd({
        p: to.p + (start - to.p) * grow,
        s: to.s + (end - start - to.s) * grow,
      });

      /* Trailing edge catches up and overshoots on landing */
      timer.current = window.setTimeout(
        () => {
          indRef.current = to;
          setPhase("settle");
          setInd(to);
        },
        150 * rate(speed)
      );
    },
    [dilate, measure, speed]
  );

  // Controlled sync from props.value
  useEffect(() => {
    if (value !== undefined && value !== activeRef.current) {
      select(value);
    }
  }, [value, select]);

  // Initial mount measurement & ResizeObserver
  useIsomorphicLayoutEffect(() => {
    const settleInd = () => {
      const next = measure(activeRef.current);
      if (!next) return;
      indRef.current = next;
      setPhase("idle");
      setInd(next);
    };
    settleInd();

    const ro = new ResizeObserver(settleInd);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const curveStyles = settle(bounce);

  const vars = {
    "--nav-pad": `${actualHug}px`,
    "--ind-stretch": `${Math.round(190 * rate(speed))}ms`,
    "--ind-settle": `${Math.round(420 * rate(speed))}ms`,
    "--ind-move": curveStyles.move,
    "--ind-size": curveStyles.size,
  } as React.CSSProperties;

  const style: React.CSSProperties = ind
    ? { transform: `translate3d(${ind.p}px, 0, 0)`, width: ind.s }
    : { opacity: 0 };

  return (
    <>
      <style>{`
        /* ── signature frosted glass dock ──────────────────────── */
        .gnav {
          position: relative;
          background: rgba(255, 255, 255, 0.6);
          -webkit-backdrop-filter: blur(8px) saturate(150%) brightness(100%);
          backdrop-filter: blur(8px) saturate(150%) brightness(100%);
          isolation: isolate;
          color: #0f172a;
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: var(--nav-pad);
          border-radius: 999px;
          user-select: none;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            0 10px 40px rgba(15, 23, 42, 0.08);
        }

        /* Prismatic specular lit rim */
        .gnav::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 1px solid transparent;
          pointer-events: none;
          z-index: 3;
          background:
            linear-gradient(
              142deg,
              rgba(255, 255, 255, 0.7) 0%,
              rgba(255, 255, 255, 0.15) 26%,
              rgba(255, 255, 255, 0.05) 62%,
              rgba(255, 255, 255, 0.4) 100%
            ) border-box;
          -webkit-mask:
            linear-gradient(#000 0 0) padding-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask:
            linear-gradient(#000 0 0) padding-box,
            linear-gradient(#000 0 0);
          mask-composite: exclude;
        }

        /* ── two-phase indicator wash ──────────────────────────── */
        .gnav-ind {
          position: absolute;
          top: var(--nav-pad);
          left: 0;
          height: calc(100% - var(--nav-pad) * 2);
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.06);
          border: 0;
          box-shadow: none;
          pointer-events: none;
          will-change: transform, width;
          z-index: 1;
        }

        /* Phase one: leading edge jumps, pill dilates */
        .gnav-ind[data-phase="stretch"] {
          --d: var(--ind-stretch, 190ms);
          transition:
            transform var(--d) cubic-bezier(0.32, 0.72, 0.24, 1),
            width var(--d) cubic-bezier(0.32, 0.72, 0.24, 1);
        }

        /* Phase two: trailing edge catches up, overshoots */
        .gnav-ind[data-phase="settle"] {
          --d: var(--ind-settle, 420ms);
          transition:
            transform var(--d) var(--ind-move, cubic-bezier(0.28, 1.28, 0.36, 1)),
            width var(--d) var(--ind-size, cubic-bezier(0.24, 1.34, 0.38, 1));
        }

        .gnav-ind[data-phase="idle"] {
          transition: none;
        }

        /* ── slots ─────────────────────────────────────────────── */
        .gnav-item {
          position: relative;
          z-index: 2;
          border: 0;
          border-radius: 999px;
          background: none;
          color: #0f172a;
          opacity: 0.5;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 260ms cubic-bezier(0.32, 0.72, 0.24, 1);
          line-height: 1;
        }

        .gnav-item:hover {
          opacity: 0.85;
        }

        .gnav-item[data-active="true"],
        .gnav-item[data-swatch="true"] {
          opacity: 1;
        }

        .gnav-item:focus-visible {
          outline: 1.5px solid #0f172a;
          outline-offset: 2px;
        }
      `}</style>

      <nav
        ref={trackRef as React.RefObject<HTMLElement>}
        className={`gnav ${className}`}
        style={vars}
        aria-label={ariaLabel}
      >
        <span className="gnav-ind" data-phase={phase} style={style} aria-hidden />

        {items.map((item) => {
          const isSelected = active === item.key;
          const isSwatch = Boolean(item.color);
          const isIconOnly = Boolean(item.icon && (!item.label || item.showLabel === false));
          const slotTitle = item.title || item.label || item.key;

          const dim = size === "xs" ? 26 : size === "default" ? 36 : 30;
          const padH = size === "xs" ? 11 : size === "default" ? 16 : 13;

          const slotStyle: React.CSSProperties =
            isSwatch || isIconOnly
              ? {
                  width: `${dim}px`,
                  height: `${dim}px`,
                  minWidth: `${dim}px`,
                  padding: 0,
                  flexShrink: 0,
                }
              : {
                  width: "auto",
                  minWidth: `${dim}px`,
                  height: `${dim}px`,
                  padding: `0 ${padH}px`,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                };

          return (
            <button
              key={item.key}
              ref={(el) => {
                refs.current[item.key] = el;
              }}
              type="button"
              className="gnav-item"
              data-active={isSelected}
              data-swatch={isSwatch}
              aria-label={slotTitle}
              title={slotTitle}
              aria-current={isSelected ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                select(item.key);
                onChange?.(item.key);
              }}
              style={slotStyle}
            >
              {item.color ? (
                <span
                  className={`block rounded-full border transition-transform duration-150 ${
                    isSelected ? "scale-110" : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: item.color,
                    borderColor: item.darkOutline || item.color,
                    width: size === "xs" ? "12px" : size === "default" ? "16px" : "14px",
                    height: size === "xs" ? "12px" : size === "default" ? "16px" : "14px",
                  }}
                />
              ) : isIconOnly ? (
                <span className="flex items-center justify-center text-current">{item.icon}</span>
              ) : (
                <span
                  className={`inline-flex items-center justify-center gap-1.5 font-sans ${
                    size === "xs"
                      ? "text-[11.5px] font-medium"
                      : size === "default"
                        ? "text-[13px] font-medium"
                        : "text-xs font-medium"
                  }`}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {item.icon && (
                    <span className="inline-flex shrink-0 items-center justify-center">
                      {item.icon}
                    </span>
                  )}
                  {item.label && <span className="shrink-0">{item.label}</span>}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}

export {
  SelectBar as GlassBar,
  type SelectBarItem as GlassBarItem,
  type SelectBarProps as GlassBarProps,
};
