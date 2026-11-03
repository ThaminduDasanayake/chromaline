"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export type LabelTextareaTheme = "light" | "dark";

export interface LabelTextareaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "width" | "height"
  > {
  /** Field label text */
  label?: string;
  /** Corner radius in px. Default: 18 */
  corner?: number;
  /** Fixed width in pixels. If omitted, container expands to fit parent width */
  width?: number;
  /** Minimum height in pixels. Default: 96 */
  minHeight?: number;
  /** Maximum height in pixels before internal scrolling starts. Default: 320 */
  maxHeight?: number;
  /** Visual color theme mode: "light" | "dark". Default: "light" */
  theme?: LabelTextareaTheme;
  /** Optional character count display. If true, shows length / maxLength if set, or just length */
  showCount?: boolean;
  className?: string;
}

export function LabelTextarea({
  label = "Message",
  corner = 18,
  width: propWidth,
  minHeight = 96,
  maxHeight = 320,
  theme = "light",
  showCount = false,
  className = "",
  value: controlledValue,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  id: propId,
  style,
  maxLength,
  ...restProps
}: LabelTextareaProps) {
  const isDark = theme === "dark";
  const displayLabel = label;
  const generatedId = useId().replace(/:/g, "");
  const id = propId || `lta-${generatedId}`;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const labelNodeRef = useRef<HTMLLabelElement | null>(null);

  const [focus, setFocus] = useState(false);
  const [internalValue, setInternalValue] = useState(
    defaultValue !== undefined ? String(defaultValue) : ""
  );
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? String(controlledValue) : internalValue;

  // Track dynamic dimensions (auto-width and auto-height)
  const [fluidWidth, setFluidWidth] = useState(340);
  const [measuredHeight, setMeasuredHeight] = useState(minHeight);

  // Measure label width for exact top border notch opening
  const [lw, setLw] = useState(() => Math.max(36, displayLabel.length * 10));

  const labRef = useCallback((node: HTMLLabelElement | null) => {
    labelNodeRef.current = node;
    if (node) {
      const width = node.offsetWidth || node.scrollWidth;
      if (width > 0) {
        setLw(width);
      }
    }
  }, []);

  useEffect(() => {
    if (labelNodeRef.current) {
      const width =
        labelNodeRef.current.offsetWidth || labelNodeRef.current.scrollWidth;
      if (width > 0) {
        setLw(width);
      }
    }
  }, [displayLabel]);

  // Observe container width if propWidth is not specified
  useEffect(() => {
    if (propWidth) return;
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) {
          setFluidWidth(Math.round(w));
        }
      }
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, [propWidth]);

  const measuredWidth = propWidth || fluidWidth;

  // Auto-expand textarea height on value change
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height temporarily to accurately measure scrollHeight
    textarea.style.height = "auto";
    const nextHeight = clamp(textarea.scrollHeight, minHeight, maxHeight);
    setMeasuredHeight(nextHeight);
    textarea.style.height = `${nextHeight}px`;
  }, [minHeight, maxHeight]);

  useEffect(() => {
    adjustHeight();
  }, [currentValue, adjustHeight, measuredWidth]);

  const up = focus || currentValue.length > 0;

  const W = measuredWidth;
  const H = measuredHeight;
  const r = clamp(corner, 0, Math.min(W / 2, H / 2));
  const S = 0.78; // Lifted label scale factor
  const IN = 0.75; // Half-stroke inset to prevent SVG clipping

  /* ── Notch Geometry ──────────────────────────────────────────
     The notch opens along the straight part of the top edge:
     lx = starting X position of the label text
     x0 = left notch edge (starts at least after the corner arc)
     x1 = right notch edge (accommodates the scaled label + padding)
  */
  const lx = Math.max(14, r + 4);
  const x0 = Math.max(r, lx - 4);
  const x1 = Math.min(W - r, lx + lw * S + 6);
  const a = Math.max(0, r - IN);
  const R = W - IN;
  const B = H - IN;
  const mid = W / 2;

  // The gap: two short segments from the middle outward
  const nm = (x0 + x1) / 2;
  const gapL = `M${nm},${IN} L${x0},${IN}`;
  const gapR = `M${nm},${IN} L${x1},${IN}`;

  // Right contour: from right notch edge, clockwise around corners to bottom center
  const rightPath =
    r > 0
      ? `M${x1},${IN} L${W - r},${IN} A${a},${a} 0 0 1 ${R},${r} L${R},${H - r} A${a},${a} 0 0 1 ${W - r},${B} L${mid},${B}`
      : `M${x1},${IN} L${R},${IN} L${R},${B} L${mid},${B}`;

  // Left contour: from left notch edge, counter-clockwise to bottom center
  const leftPath =
    r > 0
      ? `M${x0},${IN} ${x0 > r ? `L${r},${IN} ` : ""}A${a},${a} 0 0 0 ${IN},${r} L${IN},${H - r} A${a},${a} 0 0 0 ${r},${B} L${mid},${B}`
      : `M${x0},${IN} L${IN},${IN} L${IN},${B} L${mid},${B}`;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocus(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocus(false);
    onBlur?.(e);
  };

  const ringStroke = focus
    ? isDark
      ? "stroke-[#ffffff]"
      : "stroke-[#18181b]"
    : currentValue.length > 0
      ? isDark
        ? "stroke-[#646464]"
        : "stroke-[#b5b5b6]"
      : isDark
        ? "stroke-[#ffffff]/20"
        : "stroke-[#18181b]/20";

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative grid place-items-center pt-3 select-none",
        propWidth ? "" : "w-full",
        className
      )}
      style={propWidth ? { width: propWidth } : undefined}
    >
      <div
        className="relative cursor-text bg-transparent select-none transition-[height] duration-150 ease-out"
        style={{
          width: propWidth ? W : "100%",
          height: H,
          borderRadius: r,
          ...style,
        }}
        onClick={() => textareaRef.current?.focus()}
      >
        {/* SVG Outline with Dynamic Retractable Top Notch */}
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          aria-hidden="true"
        >
          {/* Right Perimeter Outline */}
          <path
            d={rightPath}
            fill="none"
            strokeLinecap="butt"
            strokeWidth={focus ? 1.5 : 1}
            className={cn(
              "transition-[stroke,stroke-width] duration-220 ease-out motion-reduce:duration-160",
              ringStroke
            )}
          />

          {/* Left Perimeter Outline */}
          <path
            d={leftPath}
            fill="none"
            strokeLinecap="butt"
            strokeWidth={focus ? 1.5 : 1}
            className={cn(
              "transition-[stroke,stroke-width] duration-220 ease-out motion-reduce:duration-160",
              ringStroke
            )}
          />

          {/* Left Gap Notch (Parts outward from center) */}
          <path
            d={gapL}
            fill="none"
            pathLength={1}
            strokeLinecap="butt"
            strokeWidth={focus ? 1.5 : 1}
            strokeDasharray="1 2"
            strokeDashoffset={up ? -1 : 0}
            className={cn(
              "transition-[stroke-dashoffset,stroke,stroke-width] duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-160",
              ringStroke
            )}
          />

          {/* Right Gap Notch (Parts outward from center) */}
          <path
            d={gapR}
            fill="none"
            pathLength={1}
            strokeLinecap="butt"
            strokeWidth={focus ? 1.5 : 1}
            strokeDasharray="1 2"
            strokeDashoffset={up ? -1 : 0}
            className={cn(
              "transition-[stroke-dashoffset,stroke,stroke-width] duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-160",
              ringStroke
            )}
          />
        </svg>

        {/* Floating Label with Letter-by-Letter Hop Animation */}
        <label
          key={displayLabel}
          ref={labRef}
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute origin-left text-[15px] leading-none tracking-[-0.01em] whitespace-pre transition-[transform,color] duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] select-none motion-reduce:duration-160",
            focus
              ? isDark
                ? "text-[#ffffff]"
                : "text-[#18181b]"
              : up
                ? isDark
                  ? "text-[#a1a1aa]"
                  : "text-[#71717a]"
                : isDark
                  ? "text-[#71717a]"
                  : "text-[#a1a1aa]"
          )}
          style={{
            left: lx,
            top: 18,
            transform: up
              ? "translateY(-18px) translateY(-8px) scale(0.78)"
              : "translateY(0) scale(1)",
          }}
        >
          {[...displayLabel].map((ch, i) => (
            <span
              key={i}
              className={`inline-block motion-reduce:animate-none ${
                focus
                  ? "animate-[lbi-hop_460ms_cubic-bezier(0.3,0.7,0.3,1)_both]"
                  : ""
              }`}
              style={{ animationDelay: `${i * 24}ms` }}
            >
              {ch}
            </span>
          ))}
        </label>

        {/* Auto-expanding Multiline Textarea */}
        <textarea
          ref={textareaRef}
          id={id}
          className={cn(
            "absolute inset-0 w-full resize-none rounded-[inherit] border-0 bg-transparent text-[15px] leading-relaxed tracking-[-0.01em] transition-[color] duration-200 outline-none",
            isDark ? "text-[#ffffff]" : "text-[#18181b]",
            "scrollbar-thin scrollbar-thumb-zinc-400 dark:scrollbar-thumb-zinc-600"
          )}
          style={{
            paddingLeft: lx,
            paddingRight: lx,
            paddingTop: 16,
            paddingBottom: showCount ? 28 : 16,
            height: H,
          }}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          spellCheck={false}
          {...restProps}
        />

        {/* Optional Character Count Pill at bottom right */}
        {showCount && (
          <div
            className={cn(
              "pointer-events-none absolute right-3.5 bottom-2.5 font-mono text-[11px] tracking-wider transition-opacity duration-200",
              isDark ? "text-zinc-500" : "text-slate-400",
              up ? "opacity-100" : "opacity-0"
            )}
          >
            {currentValue.length}
            {maxLength !== undefined ? ` / ${maxLength}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}
