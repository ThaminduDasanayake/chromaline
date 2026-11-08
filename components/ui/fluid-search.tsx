"use client";

import React, { useId, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
export const FluidSearch = React.forwardRef<HTMLInputElement, FluidSearchProps>(
  function FluidSearch(
    {
      value: controlledValue,
      onChange,
      label = "Search",
      placeholder = "Search…",
      theme,
      fill,
      className = "",
      style,
    },
    forwardedRef
  ) {
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
    const inputRef = useRef<HTMLInputElement | null>(null);
    const reduced = useFluidReducedMotion();
    const id = "search-" + useId().replace(/:/g, "");
    const [keyboard, setKeyboard] = useState(false);

    const handleInputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );

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

    // Determine fill color style if explicit override or theme is passed
    const shapeStyle: React.CSSProperties = fill
      ? { backgroundColor: fill }
      : theme === "dark"
        ? { backgroundColor: "#222224" }
        : theme === "light"
          ? { backgroundColor: "#e9e9e9" }
          : {};

    const shapeBgClass = !fill && !theme ? "bg-chroma-search-fill" : "";

    return (
      <div
        ref={host}
        tabIndex={-1}
        className={cn(
          "relative isolate h-[52px] w-full outline-none select-none",
          keyboard &&
            "[&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-3 [&_:focus-visible]:outline-[#888]",
          className
        )}
        style={style}
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
        <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
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
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
          style={{ filter: reduced ? "none" : `url(#${id})` }}
        >
          <div
            className={cn(
              "absolute top-0 left-0 h-[52px] rounded-full transition-[width] duration-460 ease-[cubic-bezier(0.22,1,0.36,1)]",
              shapeBgClass,
              open ? "w-[calc(100%-64px)]" : "w-full",
              reduced && "transition-none"
            )}
            style={shapeStyle}
          />
          <div
            className={cn(
              "absolute top-0 right-0 h-[52px] w-[52px] rounded-full transition-transform duration-460 ease-[cubic-bezier(0.22,1,0.36,1)]",
              shapeBgClass,
              open ? "translate-x-0 scale-100" : "-translate-x-[28px] scale-80",
              reduced && "transition-none"
            )}
            style={shapeStyle}
          />
        </div>

        <label
          className={cn(
            "relative z-1 box-border flex h-[52px] items-center gap-3 rounded-full px-[18px] transition-[width] duration-460 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "w-[calc(100%-64px)]" : "w-full",
            reduced && "transition-none"
          )}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
            className={cn(
              "shrink-0",
              theme === "dark"
                ? "text-[#888888]"
                : theme === "light"
                  ? "text-[#666666]"
                  : "text-[#666666] dark:text-[#888888]"
            )}
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            ref={handleInputRef}
            aria-label={label}
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            className={cn(
              "font-inherit w-full min-w-0 border-0 bg-transparent p-0 text-[14px] shadow-none outline-none",
              theme === "dark"
                ? "text-[#eeeeee]"
                : theme === "light"
                  ? "text-[#222222]"
                  : "text-[#222222] dark:text-[#eeeeee]"
            )}
          />
        </label>

        <button
          className={cn(
            "absolute top-0 right-0 z-2 grid h-[52px] w-[52px] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 shadow-none transition-[transform,opacity] duration-460 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none",
            open
              ? "pointer-events-auto translate-x-0 scale-100 opacity-100"
              : "pointer-events-none -translate-x-[28px] scale-80 opacity-0 duration-140",
            theme === "dark"
              ? "text-[#eeeeee]"
              : theme === "light"
                ? "text-[#222222]"
                : "text-[#222222] dark:text-[#eeeeee]",
            reduced && "transition-none"
          )}
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
);

FluidSearch.displayName = "FluidSearch";
export default FluidSearch;
