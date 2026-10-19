"use client";

import React from "react";

export interface ComponentPreviewProps {
  children: React.ReactNode;
  controls?: React.ReactNode;
  className?: string;
  canvasClassName?: string;
}

export function ComponentPreview({
  children,
  controls,
  className = "",
  canvasClassName = "min-h-[320px] p-8",
}: ComponentPreviewProps) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs ${className}`}>
      {/* Canvas */}
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-[#F9FAFB] ${canvasClassName}`}
      >
        {children}
      </div>

      {/* Controls Footer */}
      {controls && (
        <div className="border-t border-slate-100 bg-white p-5 sm:p-6">
          {controls}
        </div>
      )}
    </section>
  );
}
