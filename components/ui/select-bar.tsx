"use client";

/**
 * SelectBar (Glass Bar)
 *
 * A refined physical frosted glass selector and navigation dock with
 * two-phase mercury stretch dilation and overshoot landing kinematics.
 */

import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ── Elastic motion tuning (two-phase mercury dilation with overshoot landing) ── */
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

  const transitionString =
    phase === "stretch"
      ? `transform ${Math.round(190 * rate(speed))}ms cubic-bezier(0.32, 0.72, 0.24, 1), width ${Math.round(
          190 * rate(speed)
        )}ms cubic-bezier(0.32, 0.72, 0.24, 1)`
      : phase === "settle"
        ? `transform ${Math.round(420 * rate(speed))}ms ${curveStyles.move}, width ${Math.round(
            420 * rate(speed)
          )}ms ${curveStyles.size}`
        : "none";

  const indStyle: React.CSSProperties = ind
    ? {
        transform: `translate3d(${ind.p}px, 0, 0)`,
        width: `${ind.s}px`,
        top: `${actualHug}px`,
        height: `calc(100% - ${actualHug * 2}px)`,
        transition: transitionString,
      }
    : { opacity: 0 };

  return (
    <nav
      ref={trackRef as React.RefObject<HTMLElement>}
      className={`relative isolate inline-flex items-center gap-0.5 rounded-full bg-white/60 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-md backdrop-saturate-150 select-none ${className}`}
      style={{ padding: `${actualHug}px` }}
      aria-label={ariaLabel}
    >
      {/* Prismatic specular lit rim */}
      <span
        className="pointer-events-none absolute inset-0 z-3 rounded-full border border-transparent [mask-composite:exclude] [-webkit-mask-composite:xor] [-webkit-mask:linear-gradient(#000_0_0)_padding-box,linear-gradient(#000_0_0)] [background:linear-gradient(142deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0.15)_26%,rgba(255,255,255,0.05)_62%,rgba(255,255,255,0.4)_100%)_border-box] [mask:linear-gradient(#000_0_0)_padding-box,linear-gradient(#000_0_0)]"
        aria-hidden="true"
      />

      {/* Two-phase mercury indicator wash */}
      <span
        className="pointer-events-none absolute left-0 z-1 rounded-full border-0 bg-black/6 shadow-none will-change-[transform,width]"
        style={indStyle}
        aria-hidden="true"
      />

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
            className={`relative z-2 flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent leading-none text-slate-900 transition-opacity duration-260 ease-[cubic-bezier(0.32,0.72,0.24,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
              isSelected || isSwatch ? "opacity-100" : "opacity-50 hover:opacity-85"
            }`}
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
  );
}

export {
  SelectBar as GlassBar,
  type SelectBarItem as GlassBarItem,
  type SelectBarProps as GlassBarProps,
};
