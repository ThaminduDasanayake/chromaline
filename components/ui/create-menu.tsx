"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import {
  FileTextIcon,
  FolderIcon,
  GridFourIcon,
  PlusIcon,
  TableIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ══ Create ═══════════════════════════════════════════════
   One shape, not two. The pill does not open a panel next to
   itself and it does not grow a chin — it IS the panel, seen
   small. Pressing it makes it spread: the pill goes, and what
   is left standing in the same spot is the window. */

export interface CreateMenuItem {
  icon: React.ComponentType<{ size?: number; weight?: "bold" | "regular" | "light" | "thin" | "fill" | "duotone" }>;
  label: string;
}

const DEFAULT_ITEMS: CreateMenuItem[] = [
  { icon: FileTextIcon, label: "Document" },
  { icon: TableIcon, label: "Spreadsheet" },
  { icon: GridFourIcon, label: "Board" },
  { icon: FolderIcon, label: "Folder" },
];

export interface CreateProps {
  /** Outer corner radius in open state (default: 20) */
  corner?: number;
  /** Custom menu items */
  items?: CreateMenuItem[];
  /** Callback fired when an item is selected */
  onItemSelect?: (label: string) => void;
  /** Visual theme mode (default: inherits from context) */
  theme?: "light" | "dark";
  /** Additional CSS class name */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

export function Create({
  corner = 20,
  items = DEFAULT_ITEMS,
  onItemSelect,
  theme,
  className = "",
  style,
}: CreateProps) {
  const [open, setOpen] = useState(false);
  const [sink, setSink] = useState(false);
  const [over, setOver] = useState<number | null>(null);
  const [moving, setMoving] = useState(false);

  const panel = useRef<HTMLDivElement | null>(null);
  const moveTimer = useRef<number | null>(null);
  const pressTimer = useRef<number | null>(null);

  const rawId = useId();
  const filterId = `liq-goo-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  /* The press lands first: the pill simply gets smaller. Going
     straight to the expansion skips the acknowledgement and the
     panel seems to arrive slightly before it was asked for.

     The two overlap on purpose. The shrink takes 120ms and the
     spread starts at 95, so it is still on its way down as it
     begins to widen. Waiting for the shrink to land leaves a
     stretch where nothing moves at all, and thirty still
     milliseconds in the middle of a gesture reads as a
     stutter. */
  const press = () => {
    setSink(true);
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => {
      setSink(false);
      setOpen(true);
    }, 95);
  };

  /* No close button and no title bar — anywhere but the menu
     puts it away. Registered only while it is open, and in an
     effect, so the very press that opened it (whose pointerdown
     has already been and gone) cannot close it on the same
     click.

     AND IT ASKS THE VISIBLE BOX, NOT THE ELEMENT. contains() is
     the obvious test and it was wrong here: the ref is the STAGE,
     the square this block reserves so opening the menu does not
     resize what is under it. The stage is 305 square, the menu
     inside it is 265x208, and every press in between counted as
     a press on the menu — 48px of dead ground above it and 49
     below, where clicking did nothing at all. */
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      const b = panel.current?.querySelector(".crt-panel")?.getBoundingClientRect();
      const on =
        b &&
        e.clientX >= b.left &&
        e.clientX <= b.right &&
        e.clientY >= b.top &&
        e.clientY <= b.bottom;
      if (!on) {
        setOpen(false);
        setOver(null);
        setMoving(false);
      }
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  useEffect(() => {
    return () => {
      if (pressTimer.current) window.clearTimeout(pressTimer.current);
      if (moveTimer.current) window.clearTimeout(moveTimer.current);
    };
  }, []);

  /* ── Traveling liquid hover ──────────────────────────────────
     Into the stretch fast and out of it slowly. At equal speeds
     it straightened while still travelling, which is exactly
     what made the hover feel wrong.
     Only a move between rows stretches it; arriving from
     nowhere has no direction to stretch along. */
  const handleItemEnter = (i: number) => {
    if (over !== null && over !== i) {
      setMoving(true);
      if (moveTimer.current) window.clearTimeout(moveTimer.current);
      moveTimer.current = window.setTimeout(() => setMoving(false), 90);
    }
    setOver(i);
  };

  const handleMenuLeave = () => {
    setOver(null);
    setMoving(false);
    if (moveTimer.current) window.clearTimeout(moveTimer.current);
  };

  const handleItemClick = (label: string) => {
    setOpen(false);
    setOver(null);
    setMoving(false);
    onItemSelect?.(label);
  };

  /* 28 outside against a 10px inset leaves 18 for the rows to
     nest in, and a 34px row rounds fully at 17 — so the two
     curves are concentric rather than merely both round */
  const rowRadius = Math.min(17, Math.max(0, corner - 10));

  return (
    <div
      ref={panel}
      className={cn(
        "crt-stage relative w-[305px] h-[305px] flex items-center justify-center isolate select-none",
        className
      )}
      data-open={open ? "true" : undefined}
      data-sink={sink ? "true" : undefined}
      style={{
        "--w": open ? "212px" : "132px",
        "--h": open ? "190px" : "46px",
        "--r": open ? `${corner}px` : "999px",
        "--row-r": `${rowRadius}px`,
        ...style,
      } as React.CSSProperties}
    >
      {/* SVG Goo Filter for the liquid highlight layer */}
      <svg
        aria-hidden="true"
        className="absolute w-0 h-0 pointer-events-none opacity-0"
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Outer expanding shell: one shape changes shape */}
      <div
        className={cn(
          "crt-body absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none",
          "w-[var(--w)] h-[var(--h)] rounded-[var(--r)]",
          theme === "dark"
            ? "bg-[#212429] shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
            : theme === "light"
            ? "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
            : "bg-white dark:bg-[#212429] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]",
          "transition-[width,height,border-radius,transform,scale]",
          sink
            ? "scale-[0.94] duration-110 ease-out"
            : "scale-100 duration-[480ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
        )}
        aria-hidden="true"
      />

      {/* Closed pill trigger */}
      <button
        type="button"
        onClick={press}
        aria-expanded={open}
        className={cn(
          "crt-pill absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20",
          "w-[var(--w)] h-[var(--h)] rounded-[var(--r)]",
          "flex items-center justify-center gap-2 border-0 bg-transparent",
          "text-sm font-medium tracking-tight cursor-pointer",
          theme === "dark"
            ? "text-white"
            : theme === "light"
            ? "text-slate-900"
            : "text-slate-900 dark:text-white",
          "transition-[width,height,opacity,transform,scale]",
          sink
            ? "scale-[0.94] opacity-100 duration-110 ease-out"
            : "scale-100 duration-[480ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          open ? "opacity-0 pointer-events-none duration-160 ease-out" : "opacity-100"
        )}
      >
        <span className="grid place-items-center" aria-hidden="true">
          <PlusIcon size={16} weight="bold" />
        </span>
        <span className="inline-block whitespace-nowrap">Create</span>
      </button>

      {/* Open window containing liquid highlight and row items */}
      <div
        className={cn(
          "crt-panel absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[212px] h-[190px] px-2.5 py-[18px] box-border z-30",
          theme === "dark"
            ? "text-white"
            : theme === "light"
            ? "text-slate-900"
            : "text-slate-900 dark:text-white",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Solid filtered highlight layer for traveling liquid hover */}
        <div
          className="crt-blobs absolute top-[18px] left-2.5 w-[192px] h-[154px] pointer-events-none z-10"
          aria-hidden="true"
          style={{ filter: `url(#${filterId})` }}
        >
          <div
            className={cn(
              "crt-hov-pill absolute top-0 left-0 w-full h-[34px] rounded-[var(--row-r)] pointer-events-none origin-center",
              theme === "dark"
                ? "bg-[#2e343d]"
                : theme === "light"
                ? "bg-slate-100"
                : "bg-slate-100 dark:bg-[#2e343d]",
              "transition-[transform,opacity,scale] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
              moving
                ? "scale-x-[0.96] scale-y-[1.16] duration-110 [transition-timing-function:cubic-bezier(0.3,1,0.4,1)]"
                : "scale-100 duration-[300ms] [transition-timing-function:cubic-bezier(0.3,0.9,0.4,1)]",
              over !== null ? "opacity-100" : "opacity-0 duration-180"
            )}
            style={{
              transform: `translateY(${over !== null ? over * 40 : 0}px)`,
            }}
          />
        </div>

        {/* Rows ride cleanly on top of the highlight */}
        <ul
          className="crt-menu relative z-20 m-0 p-0 list-none grid gap-1.5"
          onMouseLeave={handleMenuLeave}
        >
          {items.map((it, i) => (
            <li
              key={it.label}
              className={cn(
                "crt-item transition-[opacity,transform] duration-200 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
              )}
              style={{
                transitionDelay: open
                  ? `${70 + i * 38}ms`
                  : `${(items.length - 1 - i) * 30}ms`,
              }}
            >
              <button
                type="button"
                onMouseEnter={() => handleItemEnter(i)}
                onClick={() => handleItemClick(it.label)}
                className={cn(
                  "relative w-full h-[34px] px-4 flex items-center gap-3 border-0 rounded-[var(--row-r)] bg-transparent",
                  "text-[13px] font-medium text-left cursor-pointer tracking-normal select-none",
                  "transition-colors duration-200",
                  theme === "dark"
                    ? "text-slate-300 hover:text-white focus-visible:outline-white"
                    : theme === "light"
                    ? "text-slate-600 hover:text-slate-900 focus-visible:outline-slate-900"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus-visible:outline-slate-900 dark:focus-visible:outline-white",
                  "focus-visible:outline-2 -outline-offset-2"
                )}
              >
                <it.icon size={16} weight="bold" />
                <span>{it.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const CreateMenu = Create;
export default Create;
