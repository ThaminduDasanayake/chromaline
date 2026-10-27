"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FileTextIcon,
  FolderIcon,
  GridFourIcon,
  PlusIcon,
  TableIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ══ 5 · Create ═══════════════════════════════════════════════
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

const CRT_CORNER = 20;
const CRT_MAX = 40;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function Create({
  corner = CRT_CORNER,
  items = DEFAULT_ITEMS,
  onItemSelect,
  theme,
  className = "",
  style,
}: CreateProps) {
  const [open, setOpen] = useState(false);
  const [sink, setSink] = useState(false);
  const [sayW, setSayW] = useState(96);

  const panel = useRef<HTMLDivElement | null>(null);
  const say = useRef<HTMLSpanElement | null>(null);
  const beat = useRef<number | null>(null);

  /* ── MEASURE TWICE: ONCE NOW, ONCE THE FONT IS REAL ────────
     .crt-say clips whatever it cannot fit, so this width being
     even slightly short takes the right edge off the last
     letter — and it was short two different ways. The +1 is
     the fix; the error is always under a pixel so a pixel
     always covers it. */
  useLayoutEffect(() => {
    const el = say.current;
    if (!el) return;
    let live = true;
    const measure = () => {
      if (live) setSayW(el.offsetWidth + 1);
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (beat.current) window.clearTimeout(beat.current);
    };
  }, []);

  /* ── Outside click detection ──────────────────────────────
     No close button and no title bar — anywhere but the menu
     puts it away. Registered only while it is open, and in an
     effect, so the very press that opened it cannot close it on
     the same click.

     AND IT ASKS THE VISIBLE BOX, NOT THE ELEMENT. contains() is
     the obvious test and it was wrong here: the ref is the STAGE,
     the square this block reserves so opening the menu does not
     resize what is under it. The stage is 244 square, the menu
     inside it is 212x166. Hit-tested against the panel's own
     rectangle instead. */
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!e.isTrusted && !e.clientX) return;
      const box = panel.current?.querySelector(".crt-panel")?.getBoundingClientRect();
      const on =
        !!box &&
        e.clientX >= box.left &&
        e.clientX <= box.right &&
        e.clientY >= box.top &&
        e.clientY <= box.bottom;
      if (!on) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  /* The press lands first: the pill simply gets smaller. Going
     straight to the expansion skips the acknowledgement and the
     panel seems to arrive slightly before it was asked for.
     The two overlap on purpose. The shrink takes 120ms and the
     spread starts at 95, so it is still on its way down as it
     begins to widen. */
  const press = () => {
    setSink(true);
    if (beat.current) window.clearTimeout(beat.current);
    beat.current = window.setTimeout(() => {
      setSink(false);
      setOpen(true);
    }, 95);
  };

  /* glyph + gap + label + the padding either side */
  const pillW = 18 + 8 + sayW + 34;

  const panelR = clamp(corner, 0, CRT_MAX);
  /* the shut pill is 38 tall, so 19 is as round as it goes */
  const shutR = Math.min(19, panelR * (19 / CRT_CORNER));
  /* concentric: the panel's corner less its 10px inset,
     and no rounder than the 34px row's own half */
  const rowR = Math.min(17, Math.max(0, panelR - 10));

  return (
    <div
      ref={panel}
      className={cn(
        "crt-stage relative w-[244px] h-[244px] isolate select-none",
        className
      )}
      data-open={open ? "true" : undefined}
      data-sink={sink ? "true" : undefined}
      style={{
        "--pill-w": `${pillW}px`,
        "--pill-h": "38px",
        "--panel-w": "212px",
        "--panel-h": "166px",
        "--w": open ? "var(--panel-w)" : "var(--pill-w)",
        "--h": open ? "var(--panel-h)" : "var(--pill-h)",
        "--r": open ? "var(--crt-r)" : "var(--crt-shut-r)",
        "--crt-r": `${panelR}px`,
        "--crt-shut-r": `${shutR.toFixed(2)}px`,
        "--crt-row-r": `${rowR.toFixed(2)}px`,
        ...style,
      } as React.CSSProperties}
    >
      {/* ── Outer expanding shell: one shape, dead centre ───────
          Centred by auto margins (inset: 0; margin: auto;), which
          are self-correcting and use NO transform at all. */}
      <div
        className={cn(
          "crt-body absolute inset-0 m-auto pointer-events-none",
          "w-[var(--w)] h-[var(--h)] rounded-[var(--r)]",
          theme === "dark"
            ? "bg-[#212429] shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
            : theme === "light"
            ? "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
            : "bg-white dark:bg-[#212429] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]",
          "transition-[width,height,border-radius,scale]",
          sink
            ? "scale-[0.94] duration-160 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
            : open
            ? "scale-100 duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
            : "scale-100 duration-220 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          "motion-reduce:duration-160 motion-reduce:scale-100"
        )}
        aria-hidden="true"
      />

      {/* ── The shut pill trigger button ────────────────────────
          Held at full strength through the press: fading it during
          the squash would hide the beat that the squash is for. */}
      <button
        type="button"
        onClick={press}
        aria-expanded={open}
        className={cn(
          "crt-pill absolute inset-0 m-auto z-20",
          "w-[var(--pill-w)] h-[var(--pill-h)]",
          "flex items-center justify-center gap-2 border-0 bg-transparent",
          "text-[13px] font-normal cursor-pointer tracking-normal",
          theme === "dark"
            ? "text-white"
            : theme === "light"
            ? "text-slate-900"
            : "text-slate-900 dark:text-white",
          "transition-[width,opacity,scale]",
          sink
            ? "scale-[0.94] opacity-100 duration-160 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
            : "scale-100 duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "opacity-0 pointer-events-none duration-160 ease-out"
            : "opacity-100 duration-160",
          "motion-reduce:duration-160 motion-reduce:scale-100"
        )}
      >
        <span className="crt-glyph grid place-items-center" aria-hidden="true">
          <PlusIcon size={16} weight="regular" />
        </span>
        <span
          className="crt-say block overflow-hidden whitespace-nowrap text-left transition-[width] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-160"
          style={{ width: sayW || undefined }}
        >
          <span ref={say} className="inline-block">Create</span>
        </span>
      </button>

      {/* ── The open window panel ─────────────────────────────── */}
      <div
        className={cn(
          "crt-panel absolute inset-0 m-auto",
          "w-[var(--panel-w,212px)] h-[var(--panel-h,166px)] p-3 box-border z-30",
          theme === "dark"
            ? "text-white"
            : theme === "light"
            ? "text-slate-900"
            : "text-slate-900 dark:text-white",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <ul className="crt-menu m-0 p-0 list-none grid content-start gap-0.5">
          {items.map((it, i) => (
            <li
              key={it.label}
              className={cn(
                "crt-item transition-[opacity,transform] duration-220 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-160",
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
                onClick={() => {
                  setOpen(false);
                  onItemSelect?.(it.label);
                }}
                className={cn(
                  "relative w-full h-[34px] px-4 flex items-center gap-3",
                  "border-0 rounded-[var(--crt-row-r,999px)] bg-transparent",
                  "text-[13px] text-left cursor-pointer tracking-normal select-none isolate",
                  "transition-colors duration-220",
                  theme === "dark"
                    ? "text-white/80 hover:text-white"
                    : theme === "light"
                    ? "text-slate-900/80 hover:text-slate-900"
                    : "text-slate-900/80 hover:text-slate-900 dark:text-white/80 dark:hover:text-white",
                  // Hover wash: before pseudo-element (one per row, no traveling pill)
                  "before:content-[''] before:absolute before:inset-0 before:-z-10 before:rounded-[inherit]",
                  theme === "dark"
                    ? "before:bg-white/[0.08]"
                    : theme === "light"
                    ? "before:bg-slate-900/[0.08]"
                    : "before:bg-slate-900/[0.08] dark:before:bg-white/[0.08]",
                  "before:opacity-0 hover:before:opacity-100 focus-visible:before:opacity-100",
                  "before:transition-opacity before:duration-220 hover:before:duration-160 before:pointer-events-none"
                )}
              >
                <it.icon size={16} weight="regular" />
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
