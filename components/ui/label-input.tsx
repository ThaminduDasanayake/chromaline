"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export interface LabelInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "width" | "height"
> {
  /** Field preset label: "Email" | "Password" | or any custom string */
  field?: string;
  /** Custom label override text */
  label?: string;
  /** Corner radius in px: at half the height (26px) it is a pill. Default: 20 */
  corner?: number;
  /** Component width in pixels. Default: 280 */
  width?: number;
  /** Component height in pixels. Default: 52 */
  height?: number;
  /** Showcase preview mode (disables mobile virtual keyboard popup). Default: false */
  showcase?: boolean;
  className?: string;
}

export function LabelInput({
  field = "Email",
  label: customLabel,
  corner = 20,
  width: W = 280,
  height: H = 52,
  showcase = false,
  className = "",
  value: controlledValue,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  type: propType,
  id: propId,
  style,
  ...restProps
}: LabelInputProps) {
  const secret = field === "Password" || propType === "password";
  const displayLabel = customLabel || field;
  const generatedId = useId().replace(/:/g, "");
  const id = propId || `lbi-${generatedId}`;

  const r = clamp(corner, 0, H / 2);
  const S = 0.78; // Lifted label scale factor
  const IN = 0.75; // Half-stroke inset to prevent SVG clipping

  const [focus, setFocus] = useState(false);
  const [internalValue, setInternalValue] = useState(
    defaultValue !== undefined ? String(defaultValue) : ""
  );
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? String(controlledValue) : internalValue;

  const [quiet] = useState(
    () =>
      showcase && typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  );
  const [show, setShow] = useState(false);
  const [flip, setFlip] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Measure the rendered label width to calculate the exact top border notch
  const [lw, setLw] = useState(() => Math.max(36, displayLabel.length * 10));
  const labelNodeRef = useRef<HTMLLabelElement | null>(null);

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
      const width = labelNodeRef.current.offsetWidth || labelNodeRef.current.scrollWidth;
      if (width > 0) {
        setLw(width);
      }
    }
  }, [displayLabel]);

  // Adjust internal state if field preset changes during render
  const [prevField, setPrevField] = useState(field);
  if (field !== prevField) {
    setPrevField(field);
    if (!isControlled) {
      setInternalValue("");
    }
    setShow(false);
  }

  const up = focus || currentValue.length > 0;

  /* ── Notch Geometry ──────────────────────────────────────────
     The notch opens along the straight part of the top edge:
     lx = starting X position of the label text
     x0 = left notch edge (starts at least after the corner arc)
     x1 = right notch edge (accommodates the scaled label + padding)
  */
  const lx = Math.max(14, r + 4);
  const x0 = Math.max(r * 0.6, lx - 5);
  const x1 = lx + lw * S + 6;
  const a = r - IN;
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
      ? `M${x0},${IN} L${r},${IN} A${a},${a} 0 0 0 ${IN},${r} L${IN},${H - r} A${a},${a} 0 0 0 ${r},${B} L${mid},${B}`
      : `M${x0},${IN} L${IN},${IN} L${IN},${B} L${mid},${B}`;

  const reveal = () => {
    setShow((s) => !s);
    setFlip((f) => f + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocus(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocus(false);
    onBlur?.(e);
  };

  return (
    <div className={`relative grid place-items-center pt-3 select-none ${className}`}>
      <div
        className="relative cursor-text bg-transparent select-none"
        style={{ width: W, height: H, borderRadius: r, ...style }}
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
            className={`transition-[stroke,stroke-width] duration-220 ease-out ${
              focus
                ? "stroke-slate-900"
                : currentValue.length > 0
                  ? "stroke-slate-900/35"
                  : "stroke-slate-900/18"
            }`}
          />

          {/* Left Perimeter Outline */}
          <path
            d={leftPath}
            fill="none"
            strokeLinecap="butt"
            strokeWidth={focus ? 1.5 : 1}
            className={`transition-[stroke,stroke-width] duration-220 ease-out ${
              focus
                ? "stroke-slate-900"
                : currentValue.length > 0
                  ? "stroke-slate-900/35"
                  : "stroke-slate-900/18"
            }`}
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
            className={`transition-[stroke-dashoffset,stroke,stroke-width] duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              focus
                ? "stroke-slate-900"
                : currentValue.length > 0
                  ? "stroke-slate-900/35"
                  : "stroke-slate-900/18"
            }`}
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
            className={`transition-[stroke-dashoffset,stroke,stroke-width] duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              focus
                ? "stroke-slate-900"
                : currentValue.length > 0
                  ? "stroke-slate-900/35"
                  : "stroke-slate-900/18"
            }`}
          />
        </svg>

        {/* Floating Label with Letter-by-Letter Hop Animation */}
        <label
          key={displayLabel}
          ref={labRef}
          htmlFor={id}
          className={`absolute top-1/2 origin-left cursor-text text-[16px] leading-none tracking-[-0.01em] whitespace-pre transition-[transform,color] duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] select-none ${
            focus ? "text-slate-900" : up ? "text-slate-500" : "text-slate-400"
          }`}
          style={{
            left: lx,
            transform: up ? "translateY(-50%) translateY(-26px) scale(0.78)" : "translateY(-50%)",
          }}
        >
          {[...displayLabel].map((ch, i) => (
            <span
              key={i}
              className={`inline-block motion-reduce:animate-none ${
                focus ? "animate-[lbi-hop_460ms_cubic-bezier(0.3,0.7,0.3,1)_both]" : ""
              }`}
              style={{ animationDelay: `${i * 24}ms` }}
            >
              {ch}
            </span>
          ))}
        </label>

        {/* Real Input Element */}
        <input
          ref={inputRef}
          id={id}
          className={`absolute inset-0 h-full w-full rounded-[inherit] border-0 bg-transparent text-[16px] tracking-[-0.01em] text-slate-900 transition-[filter,opacity] duration-260 outline-none ${
            flip > 0 ? "animate-[lbi-flip_260ms_ease-out]" : ""
          }`}
          style={{
            paddingLeft: lx,
            paddingRight: secret ? 48 : lx,
            ...(showcase && secret && !show ? { WebkitTextSecurity: "disc" } : {}),
          }}
          type={
            showcase ? "text" : secret && !show ? "password" : secret ? "text" : propType || "email"
          }
          name={showcase ? "search-preview" : restProps.name}
          data-1p-ignore={showcase || undefined}
          data-lpignore={showcase ? "true" : undefined}
          data-bwignore={showcase || undefined}
          data-form-type={showcase ? "other" : undefined}
          autoCorrect="off"
          autoCapitalize="off"
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
          spellCheck={false}
          inputMode={quiet ? "none" : restProps.inputMode}
          {...restProps}
        />

        {/* Password Eye Toggle */}
        {secret && (
          <button
            type="button"
            className="group absolute top-1/2 right-2.5 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-transparent p-0 text-slate-400 transition-[color,transform] duration-160 hover:text-slate-900 active:scale-95"
            onPointerDown={(e) => e.preventDefault()}
            onClick={reveal}
            aria-label={show ? "Hide password" : "Show password"}
          >
            <EyeIcon
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className={`transition-[opacity,transform,filter] duration-220 ease-[cubic-bezier(0.22,1,0.36,1)] [grid-area:1/1] ${
                show ? "scale-70 opacity-0 blur-[2px]" : "blur-0 scale-100 opacity-100"
              }`}
            />
            <EyeClosedIcon
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className={`transition-[opacity,transform,filter] duration-220 ease-[cubic-bezier(0.22,1,0.36,1)] [grid-area:1/1] ${
                show ? "blur-0 scale-100 opacity-100" : "scale-70 opacity-0 blur-[2px]"
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
