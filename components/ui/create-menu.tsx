"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FileTextIcon,
  FolderIcon,
  GridFourIcon,
  PlusIcon,
  TableIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ══ 3 · Create ═══════════════════════════════════════════════
   One shape, and no filter on it — the other studies fuse two
   or more shapes, this has exactly one, so a blur could only
   damage it. The liquid here is entirely in the timing: the
   press sinks, and the spread starts while the sink is still
   running so there is never a still frame.

   The pill's width is measured from its own label and written
   back as --pill-w, so the label can change without the shape
   jumping. */

/* the elastic, as specified: ζ = 14 / (2·√(220·0.5)) ≈ 0.67,
   so it overshoots about 6% before it settles. A deliberate
   bounce, not a wobble. */
const LIQUID = {
  type: "spring" as const,
  stiffness: 220,
  damping: 14,
  mass: 0.5,
};

/* ── the same liquid, without the overshoot ────────────────
   For shapes whose corner radius is animating: a spring that
   passes its target drags the radius past it too, and corners
   that dip under and come back read as a wobble rather than
   as a bounce.

   Stiffness comes up with the damping instead, which holds ζ
   at 1.03 — no overshoot, and it lands in about 180ms. */
const LIQUID_STILL = { ...LIQUID, stiffness: 420, damping: 30 };

const CRT_CORNER = 20;
const CRT_MAX = 40;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

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
     letter — and it was short two different ways.

     The rounding: offsetWidth is an integer and the label is
     not. "Create" measures 42.46 and comes back 42. The +1 is
     the fix; the error is always under a pixel so a pixel
     always covers it, and the pill is centred on the label so
     the spare costs nothing.

     The race, which is the one that made it intermittent: a
     layout effect runs before a webfont has swapped in, so on
     a cold cache this measured "Create" in the FALLBACK face
     and then froze that number for good. Warm cache measured
     Inter and looked fine — same code, different result, which
     is why it only cut the word sometimes. So measure again
     when the fonts are actually ready. */
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

  /* No close button and no title bar — anywhere but the menu
     puts it away. Registered only while it is open, and in an
     effect, so the very press that opened it cannot close it on
     the same click. */
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      /* ── a press by SOMEBODY, not by the page ─────────────
         This listens on the document, so it hears every press
         anywhere — including the ones other components'
         demonstrations dispatch at themselves. */
      if (!e.isTrusted && !e.clientX) return;

      /* ── ASK THE VISIBLE BOX, NOT THE RESERVED ONE ───────
         This used to be panel.current.contains(target), and
         `panel` is the STAGE — the square this block reserves
         so that opening the menu does not resize the card
         under it. The stage is 244x244; the menu it holds is
         212x166. Hit-tested against the panel's own rectangle
         instead. */
      const box = panel.current
        ?.querySelector(".crt-panel")
        ?.getBoundingClientRect();
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

  const press = () => {
    setSink(true);
    if (beat.current) window.clearTimeout(beat.current);
    /* 60ms handoff against a 120ms sink: the spread begins
       while the press is still running. It was 95, which is
       most of the sink — long enough to read as a pause before
       anything opened. */
    beat.current = window.setTimeout(() => {
      setSink(false);
      setOpen(true);
    }, 60);
  };

  /* glyph + gap + label + the padding either side */
  const pillW = 18 + 8 + sayW + 34;

  /* the two the animation needs as NUMBERS — Framer writes
     borderRadius inline, so it cannot read a css variable */
  const panelR = clamp(corner, 0, CRT_MAX);
  const shutR = Math.min(19, panelR * (19 / CRT_CORNER));
  const rowR = Math.min(17, Math.max(0, panelR - 10));

  return (
    <motion.div
      ref={panel}
      className={cn(
        "crt-stage relative w-[244px] h-[244px] isolate select-none",
        className
      )}
      data-open={open || undefined}
      data-sink={sink || undefined}
      style={{
        "--pill-w": `${pillW}px`,
        "--crt-r": `${panelR}px`,
        "--crt-shut-r": `${shutR.toFixed(2)}px`,
        "--crt-row-r": `${rowR.toFixed(2)}px`,
        ...style,
      } as React.CSSProperties}
    >
      <div className="crt-blobs absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* LIQUID_STILL, not LIQUID. A spring past the target
            takes the corner radius with it — the corners dip
            under 28 and come back, which is a wobble, not a
            bounce. This is the one shape here that must not
            overshoot. */}
        <motion.div
          className={cn(
            "crt-body absolute inset-0 m-auto pointer-events-none",
            theme === "dark"
              ? "bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
              : theme === "light"
              ? "bg-[#ffffff] shadow-[0_0_0_1px_rgba(23,24,26,0.08)]"
              : "bg-[#ffffff] dark:bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(23,24,26,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
            sink
              ? "scale-[0.94] duration-160 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
              : "scale-100 duration-220 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
            "transition-transform motion-reduce:transition-none"
          )}
          animate={{
            width: open ? 212 : pillW,
            height: open ? 166 : 38,
            /* ── from the knob, not from two literals ──────
               Framer writes this inline every frame, so the
               stylesheet's `var(--r)` on .crt-body never gets
               a look in — the CSS variables set on the stage
               reach the ROWS, and this shape has to be told
               separately. Same two numbers the vars carry:
               the panel's own corner, and a 38px pill's half
               when it is shut. */
            borderRadius: open ? panelR : shutR,
          }}
          transition={LIQUID_STILL}
        />
      </div>

      <button
        type="button"
        onClick={press}
        aria-expanded={open}
        className={cn(
          "crt-pill absolute inset-0 m-auto z-20",
          "w-[var(--pill-w)] h-[38px]",
          "flex items-center justify-center gap-2 border-0 bg-transparent",
          "text-[13px] font-normal cursor-pointer tracking-normal",
          theme === "dark"
            ? "text-[#ffffff]"
            : theme === "light"
            ? "text-[#17181a]"
            : "text-[#17181a] dark:text-[#ffffff]",
          sink
            ? "scale-[0.94] opacity-100 duration-160 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
            : "scale-100 duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "opacity-0 pointer-events-none duration-160 ease-out"
            : "opacity-100 duration-160",
          "transition-[opacity,transform] motion-reduce:transition-none"
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

      <div
        className={cn(
          "crt-panel absolute inset-0 m-auto",
          "w-[212px] h-[166px] p-3 box-border z-30",
          theme === "dark"
            ? "text-[#ffffff]"
            : theme === "light"
            ? "text-[#17181a]"
            : "text-[#17181a] dark:text-[#ffffff]",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* each row lights its own wash — see .crt-item button::before;
            nothing travels between them */}
        <ul className="crt-menu m-0 p-0 list-none grid content-start gap-0.5">
          {items.map((it, i) => (
            <li
              key={it.label}
              className={cn(
                "crt-item transition-[opacity,transform] duration-220 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-160",
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
              )}
              /* tightened with the shell. The last row used to
                 start at 162ms — after a box that now finishes
                 in 180 — so the menu kept arriving for half a
                 second after it had opened. */
              style={{ transitionDelay: open ? `${30 + i * 22}ms` : "0ms" }}
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
                    ? "text-[#9a9a9a] hover:text-[#ffffff]"
                    : theme === "light"
                    ? "text-[#5c5b56] hover:text-[#17181a]"
                    : "text-[#5c5b56] hover:text-[#17181a] dark:text-[#9a9a9a] dark:hover:text-[#ffffff]",
                  "before:content-[''] before:absolute before:inset-0 before:-z-10 before:rounded-[inherit]",
                  theme === "dark"
                    ? "before:bg-white/[0.09]"
                    : theme === "light"
                    ? "before:bg-[#17181a]/[0.06]"
                    : "before:bg-[#17181a]/[0.06] dark:before:bg-white/[0.09]",
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
    </motion.div>
  );
}

export const CreateMenu = Create;
export default Create;
