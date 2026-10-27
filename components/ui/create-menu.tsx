"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  FileTextIcon,
  FolderIcon,
  GridFourIcon,
  PlusIcon,
  TableIcon,
} from "@phosphor-icons/react";
import "./create.css";

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
  /** Additional CSS class name */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

export function Create({
  corner = 20,
  items = DEFAULT_ITEMS,
  onItemSelect,
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
      className={`crt-stage ${className}`.trim()}
      data-open={open ? "true" : undefined}
      data-sink={sink ? "true" : undefined}
      style={{
        "--crt-r": `${corner}px`,
        "--crt-row-r": `${rowRadius}px`,
        ...style,
      } as React.CSSProperties}
    >
      {/* SVG Goo Filter for the liquid highlight layer */}
      <svg
        className="crt-goo-svg"
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
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
      <div className="crt-body" aria-hidden="true" />

      {/* Closed pill trigger */}
      <button
        type="button"
        className="crt-pill"
        onClick={press}
        aria-expanded={open}
      >
        <span className="crt-glyph" aria-hidden="true">
          <PlusIcon size={16} weight="bold" />
        </span>
        <span className="crt-say">Create</span>
      </button>

      {/* Open window containing liquid highlight and row items */}
      <div className="crt-panel">
        {/* Solid filtered highlight layer for traveling liquid hover */}
        <div
          className="crt-blobs"
          aria-hidden="true"
          style={{ filter: `url(#${filterId})` }}
        >
          <div
            className="crt-hov-pill"
            data-moving={moving ? "true" : undefined}
            style={{
              opacity: over !== null ? 1 : 0,
              transform: `translateY(${over !== null ? over * 40 : 0}px)`,
            }}
          />
        </div>

        {/* Rows ride cleanly on top of the highlight */}
        <ul className="crt-menu" onMouseLeave={handleMenuLeave}>
          {items.map((it, i) => (
            <li
              key={it.label}
              className="crt-item"
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
