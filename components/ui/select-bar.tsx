"use client";

/**
 * SelectBar
 *
 * Elastic kinetic segmented pill and color swatch selector engineered with
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
  color?: string; // Color swatch hex
  darkOutline?: string; // Color swatch border
  icon?: React.ReactNode;
  showLabel?: boolean; // Set to true to show label next to icon (defaults to false)
}

export interface SelectBarProps<T extends string = string> {
  items: SelectBarItem<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  axis?: "row" | "column";
  size?: "xs" | "sm" | "default";
  dilate?: number; // 0..100: how far the indicator stretches across slots
  bounce?: number; // 0..100: overshoot elasticity on landing
  speed?: number; // 0..100: animation speed multiplier
  hug?: number; // inset padding in px
  corner?: number; // border radius in px (default: 999 for pill)
  variant?: "glass" | "swatches" | "pill";
  className?: string;
  ariaLabel?: string;
}

export function SelectBar<T extends string = string>({
  items,
  value,
  defaultValue,
  onChange,
  axis = "row",
  size = "sm",
  dilate = 100,
  bounce = 50,
  speed = 50,
  hug,
  corner,
  variant = "glass",
  className = "",
  ariaLabel = "Main",
}: SelectBarProps<T>) {
  const vertical = axis === "column";
  const initialKey = value ?? defaultValue ?? items[0]?.key;
  const [active, setActive] = useState<T>(initialKey);

  const trackRef = useRef<HTMLElement | null>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ind, setInd] = useState<Ind | null>(null);
  const [phase, setPhase] = useState<"idle" | "stretch" | "settle">("idle");
  const indRef = useRef<Ind | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const defaultHug = variant === "swatches" ? 3 : size === "xs" ? 3 : size === "sm" ? 4 : 6;
  const actualHug = hug !== undefined ? hug : defaultHug;

  const measure = useCallback(
    (k: string): Ind | null => {
      const el = refs.current[k];
      if (!el) return null;
      return vertical
        ? { p: el.offsetTop, s: el.offsetHeight }
        : { p: el.offsetLeft, s: el.offsetWidth };
    },
    [vertical]
  );

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

      /* The full union of both slots is as far as it can go —
         past that it is a pill reaching for somewhere neither
         end is. Dilate scales back from there toward simply
         moving, so 0 is a slide and 100 is the stretch. */
      const start = Math.min(from.p, to.p);
      const end = Math.max(from.p + from.s, to.p + to.s);
      const grow = dilate / 100;

      setPhase("stretch");
      setInd({
        p: to.p + (start - to.p) * grow,
        s: to.s + (end - start - to.s) * grow,
      });

      /* The handoff rides the same clock as the phases */
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

  // Initial mount measurement & ResizeObserver (only settles on mount/resize, never cancels active glide)
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
  }, [vertical]);

  const curveStyles = settle(bounce);
  const actualRadius = corner !== undefined ? `${corner}px` : "999px";

  const vars = {
    "--nav-pad": `${actualHug}px`,
    "--gnav-r": actualRadius,
    "--ind-stretch": `${Math.round(190 * rate(speed))}ms`,
    "--ind-settle": `${Math.round(420 * rate(speed))}ms`,
    "--ind-move": curveStyles.move,
    "--ind-size": curveStyles.size,
  } as React.CSSProperties;

  const style: React.CSSProperties = ind
    ? vertical
      ? { transform: `translate3d(0, ${ind.p}px, 0)`, height: ind.s }
      : { transform: `translate3d(${ind.p}px, 0, 0)`, width: ind.s }
    : { opacity: 0 };

  return (
    <>
      <style>{`
        /* ── glass navigation ──────────────────────────────────────
           Exact recipe: 60% white, soft frost, lit inner edge,
           top specular catch, floating depth shadow. */
        .gnav {
          position: relative;
          background: var(--pane, rgba(255, 255, 255, 0.6));
          -webkit-backdrop-filter: blur(var(--g-blur, 8px)) saturate(var(--g-sat, 150%)) brightness(var(--g-bright, 100%));
          backdrop-filter: blur(var(--g-blur, 8px)) saturate(var(--g-sat, 150%)) brightness(var(--g-bright, 100%));
          isolation: isolate;
          color: var(--ink, #0f172a);
          display: inline-flex;
          gap: var(--bar-gap, 2px);
          padding: var(--nav-pad);
          border-radius: var(--gnav-r, 999px);
          user-select: none;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, var(--g-spec, 0.9)),
            0 10px 40px rgba(var(--shadow-rgb, 15, 23, 42), var(--g-lift, 0.08));
        }

        .gnav[data-orientation="vertical"] {
          flex-direction: column;
          border-radius: var(--gnav-r, 30px);
        }

        /* Prismatic graded lit rim */
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
              rgba(255, 255, 255, var(--g-edge-hi, 0.7)) 0%,
              rgba(255, 255, 255, var(--g-edge-lo, 0.15)) 26%,
              rgba(255, 255, 255, var(--g-edge-lo, 0.05)) 62%,
              rgba(255, 255, 255, var(--g-edge-far, 0.4)) 100%
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

        /* ── the two phase indicator ─────────────────────────────
           Just a wash — no border, no inset highlight, no penumbra,
           and no frost of its own. Pure slot tint. */
        .gnav-ind {
          position: absolute;
          top: var(--nav-pad);
          left: 0;
          height: calc(100% - var(--nav-pad) * 2);
          border-radius: var(--gnav-r, 999px);
          background: var(--pane-thumb, rgba(0, 0, 0, 0.06));
          border: 0;
          box-shadow: none;
          pointer-events: none;
          will-change: transform, width, height;
          z-index: 1;
        }

        .gnav[data-orientation="vertical"] .gnav-ind {
          top: 0;
          left: var(--nav-pad);
          width: calc(100% - var(--nav-pad) * 2);
          height: auto;
        }

        /* Phase one: leading edge jumps, pill dilates */
        .gnav-ind[data-phase="stretch"] {
          --d: var(--ind-stretch, 190ms);
          transition:
            transform var(--d) cubic-bezier(0.32, 0.72, 0.24, 1),
            width var(--d) cubic-bezier(0.32, 0.72, 0.24, 1),
            height var(--d) cubic-bezier(0.32, 0.72, 0.24, 1);
        }

        /* Phase two: trailing edge catches up, overshoots */
        .gnav-ind[data-phase="settle"] {
          --d: var(--ind-settle, 420ms);
          transition:
            transform var(--d) var(--ind-move, cubic-bezier(0.28, 1.28, 0.36, 1)),
            width var(--d) var(--ind-size, cubic-bezier(0.24, 1.34, 0.38, 1)),
            height var(--d) var(--ind-size, cubic-bezier(0.24, 1.34, 0.38, 1));
        }

        .gnav-ind[data-phase="idle"] {
          transition: none;
        }

        /* ── flat slots ────────────────────────────────────────── */
        .gnav-item {
          position: relative;
          z-index: 2;
          border: 0;
          border-radius: var(--gnav-r, 999px);
          background: none;
          color: var(--ink, #0f172a);
          opacity: 0.48;
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

        .gnav-item[data-active="true"] {
          opacity: 1;
        }

        .gnav[data-variant="swatches"] .gnav-item,
        .gnav-item[data-swatch="true"] {
          opacity: 1;
        }

        .gnav-item:focus-visible {
          outline: 1.5px solid var(--ink, #0f172a);
          outline-offset: 2px;
        }
      `}</style>

      <nav
        ref={trackRef as React.RefObject<HTMLElement>}
        className={`gnav ${className}`}
        data-orientation={vertical ? "vertical" : "horizontal"}
        data-variant={variant}
        style={vars}
        aria-label={ariaLabel}
      >
        <span className="gnav-ind" data-phase={phase} style={style} aria-hidden />

        {items.map((item) => {
          const isSelected = active === item.key;
          const isSwatch = Boolean(item.color || variant === "swatches");
          const isIconOnly = Boolean(item.icon && (!item.label || item.showLabel === false));

          let slotStyle: React.CSSProperties = {};
          if (isSwatch || isIconOnly) {
            const dim = size === "xs" ? 26 : size === "default" ? 36 : 30;
            slotStyle = {
              width: `${dim}px`,
              height: `${dim}px`,
              minWidth: `${dim}px`,
              padding: 0,
              flexShrink: 0,
            };
          } else {
            const h = size === "xs" ? 26 : size === "default" ? 36 : 30;
            const padH = size === "xs" ? 11 : size === "default" ? 16 : 13;
            slotStyle = {
              width: "auto",
              minWidth: `${h}px`,
              height: `${h}px`,
              padding: `0 ${padH}px`,
              whiteSpace: "nowrap",
              flexShrink: 0,
            };
          }

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
              aria-label={item.label || item.key}
              title={item.label || item.key}
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
