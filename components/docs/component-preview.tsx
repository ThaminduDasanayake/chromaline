"use client";

import React from "react";

export interface ComponentPreviewProps {
  children: React.ReactNode;
  controls?: React.ReactNode;
  className?: string;
  canvasClassName?: string;
  canvasStyle?: React.CSSProperties;
}

export function ComponentPreview({
  children,
  controls,
  className = "",
  canvasClassName = "min-h-[320px] p-8",
  canvasStyle,
}: ComponentPreviewProps) {
  const hasCustomBg = canvasClassName.includes("bg-") || Boolean(canvasStyle?.backgroundColor);

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-2xs transition-colors duration-200 dark:border-white/10 dark:bg-[#181818] ${className}`}
    >
      {/* Canvas */}
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden transition-colors duration-300 ${
          hasCustomBg ? "" : "bg-[#f7f7f6] dark:bg-[#0f0f0f]"
        } ${canvasClassName}`}
        style={canvasStyle}
      >
        {children}
      </div>

      {/* Controls Footer */}
      {controls && (
        <div className="border-t border-black/[0.06] bg-white p-5 transition-colors duration-200 sm:p-6 dark:border-white/10 dark:bg-[#181818]">
          {controls}
        </div>
      )}
    </section>
  );
}
