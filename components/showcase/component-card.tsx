"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface ComponentCardProps {
  title: string;
  description?: string;
  href: string;
  children: React.ReactNode;
  previewClassName?: string;
  heightClassName?: string;
  className?: string;
}

export function ComponentCard({
  title,
  href,
  children,
  previewClassName = "relative flex w-full flex-col items-center justify-center overflow-hidden p-6",
  heightClassName = "h-[320px]",
  className = "",
}: ComponentCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't trigger card navigation if clicking interactive controls inside the preview
    if (
      target.closest(
        "button, input, select, textarea, a, [role='button'], [role='slider'], [data-interactive]"
      )
    ) {
      return;
    }
    router.push(href);
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "bench-card group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-[28px] border-0 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]",
        className
      )}
      style={{ background: "rgba(var(--ink-rgb), var(--wash))" }}
    >
      {/* Component Preview Canvas */}
      <div className={cn(previewClassName, heightClassName)}>{children}</div>

      {/* Pill on Left Bottom Corner - Appears on hover */}
      <Link
        href={href}
        className="pointer-events-none absolute bottom-4 left-4 z-20 inline-flex translate-y-1 items-center rounded-full bg-black/[0.08] px-3.5 py-1.5 text-xs font-normal text-slate-800 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 hover:bg-black/[0.12] dark:bg-white/10 dark:text-[#f0f0f0] dark:hover:bg-white/15"
      >
        <span>{title}</span>
      </Link>
    </div>
  );
}
