"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ComponentPreviewProps {
  children: React.ReactNode;
  controls?: React.ReactNode;
  theme?: "light" | "dark";
  className?: string;
  canvasClassName?: string;
  canvasStyle?: React.CSSProperties;
  controlsClassName?: string;
  noBorder?: boolean;
  separated?: boolean;
  showBadge?: boolean;
}

export function ComponentPreview({
  children,
  controls,
  theme,
  className = "",
  canvasClassName = "min-h-[360px] p-8",
  canvasStyle,
  controlsClassName = "",
  noBorder = true,
  separated = true,
  showBadge = true,
}: ComponentPreviewProps) {
  // Strip out legacy stage background colors so the new stage background token applies cleanly
  const cleanCanvasClassName = canvasClassName
    .replace(/\bbg-\[#f7f7f6\]\b/g, "")
    .replace(/\bbg-\[#0f0f0f\]\b/g, "")
    .replace(/\bdark:bg-\[#0f0f0f\]\b/g, "")
    .trim();

  const hasCustomBg =
    (cleanCanvasClassName.includes("bg-") &&
      !cleanCanvasClassName.includes("bg-[#f2f2f4]") &&
      !cleanCanvasClassName.includes("dark:bg-[#171717]")) ||
    Boolean(canvasStyle?.backgroundColor);

  if (separated) {
    return (
      <div className={cn("mb-8 flex flex-col gap-4", className)}>
        {/* Canvas / Stage Card */}
        <div
          data-theme={theme || undefined}
          className={cn(
            "relative flex min-h-[380px] sm:min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-[28px] transition-colors duration-200",
            !hasCustomBg && "bg-[#f2f2f4] dark:bg-[#171717]",
            cleanCanvasClassName
          )}
          style={canvasStyle}
        >
          {showBadge && (
            <div className="absolute top-4 left-5 z-10 flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium tracking-tight text-slate-600 backdrop-blur-xs transition-colors dark:bg-white/10 dark:text-zinc-300">
              <span>Preview</span>
            </div>
          )}
          {children}
        </div>

        {/* Controls Card */}
        {controls && (
          <div
            className={cn(
              "rounded-[24px] bg-[#f2f2f4] p-5 transition-colors duration-200 sm:p-6 dark:bg-[#171717]",
              controlsClassName
            )}
          >
            {controls}
          </div>
        )}
      </div>
    );
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl transition-colors duration-200",
        noBorder
          ? "border-0 shadow-none"
          : "border border-black/[0.08] bg-white shadow-2xs dark:border-white/10 dark:bg-[#181818]",
        className
      )}
    >
      {/* Canvas */}
      <div
        data-theme={theme || undefined}
        className={cn(
          "relative flex flex-col items-center justify-center overflow-hidden transition-colors duration-300",
          !hasCustomBg && "bg-[#f2f2f4] dark:bg-[#171717]",
          cleanCanvasClassName
        )}
        style={canvasStyle}
      >
        {showBadge && (
          <div className="absolute top-4 left-5 z-10 flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium tracking-tight text-slate-600 backdrop-blur-xs transition-colors dark:bg-white/10 dark:text-zinc-300">
            <span>Preview</span>
          </div>
        )}
        {children}
      </div>

      {/* Controls Footer */}
      {controls && (
        <div
          className={cn(
            "p-5 transition-colors duration-200 sm:p-6",
            noBorder
              ? "border-0"
              : "border-t border-black/[0.06] bg-white dark:border-white/10 dark:bg-[#181818]",
            controlsClassName
          )}
        >
          {controls}
        </div>
      )}
    </section>
  );
}
