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
}

export function ComponentPreview({
  children,
  controls,
  theme,
  className = "",
  canvasClassName = "min-h-[320px] p-8",
  canvasStyle,
  controlsClassName = "",
  noBorder = false,
}: ComponentPreviewProps) {
  const hasCustomBg = canvasClassName.includes("bg-") || Boolean(canvasStyle?.backgroundColor);

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
          !hasCustomBg &&
            (theme === "dark"
              ? "bg-[#0f0f0f]"
              : theme === "light"
                ? "bg-[#f7f7f6]"
                : "bg-[#f7f7f6] dark:bg-[#0f0f0f]"),
          canvasClassName
        )}
        style={canvasStyle}
      >
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
