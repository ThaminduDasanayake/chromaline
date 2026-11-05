"use client";

import React, { useId, useRef, useState, useEffect } from "react";

export function useFluidReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);

  return reduced;
}

export interface FluidSearchProps {
  /** Current search input value */
  value?: string;
  /** Callback fired when search query changes */
  onChange?: (value: string) => void;
  /** Accessible input label. Default: 'Search' */
  label?: string;
  /** Placeholder text. Default: 'Search…' */
  placeholder?: string;
  /** Optional theme override: 'light' | 'dark' */
  theme?: "light" | "dark";
  /** Optional custom fill color override for the fluid pill & circle */
  fill?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * FluidSearch
 *
 * Liquid metaball search disclosure where the input pill and close circle
 * fluidly separate on focus/input and seamlessly merge back on close/Escape.
 * Filter only the silhouette, never content.
 */
export function FluidSearch({
  value: controlledValue,
  onChange,
  label = "Search",
  placeholder = "Search…",
  theme,
  fill,
  className = "",
  style,
}: FluidSearchProps) {
  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = (next: string) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const [focused, setFocused] = useState(false);
  const host = useRef<HTMLDivElement | null>(null);
  const reduced = useFluidReducedMotion();
  const id = "search-" + useId().replace(/:/g, "");
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Tab") setKeyboard(true);
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);

  const open = focused || Boolean(value);

  function close() {
    handleValueChange("");
    setFocused(false);
    host.current?.focus();
  }

  return (
    <div
      ref={host}
      tabIndex={-1}
      className={`seenry-fluid-search${open ? "is-open" : ""}${className ? ` ${className}` : ""}`}
      data-reduced={reduced}
      data-keyboard={keyboard}
      data-theme={theme || undefined}
      style={{
        ...(fill ? ({ "--search-fill": fill } as React.CSSProperties) : {}),
        ...style,
      }}
      onPointerDownCapture={() => setKeyboard(false)}
      onFocusCapture={(e) => {
        if (e.target !== host.current) setFocused(true);
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          e.preventDefault();
          close();
        }
      }}
    >
      <svg aria-hidden="true" className="sfs-defs">
        <defs>
          <filter
            id={id}
            x="-20%"
            y="-100%"
            width="140%"
            height="300%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="5" />
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8.5" />
          </filter>
        </defs>
      </svg>
      <div
        className="sfs-shapes"
        aria-hidden="true"
        style={{ filter: reduced ? "none" : `url(#${id})` }}
      >
        <div className="sfs-pill" />
        <div className="sfs-circle" />
      </div>
      <label className="sfs-field">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <input
          aria-label={label}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
        />
      </label>
      <button
        className="sfs-close"
        type="button"
        aria-label="Close search"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={close}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}
export default FluidSearch;
