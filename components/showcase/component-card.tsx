"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface ComponentCardProps {
  title: string;
  description?: string;
  href: string;
  children: React.ReactNode;
  previewClassName?: string;
  className?: string;
}

export function ComponentCard({
  title,
  href,
  children,
  previewClassName = "relative flex h-80 sm:h-88 w-full flex-col items-center justify-center overflow-hidden p-6",
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
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-[#f7f7f6] shadow-2xs transition-all duration-200 hover:border-black/20 hover:shadow-xs dark:border-white/10 dark:bg-[#0f0f0f] dark:hover:border-white/20 cursor-pointer ${className}`}
    >
      {/* Component Preview Canvas */}
      <div className={previewClassName}>{children}</div>

      {/* Pill on Left Bottom Corner - Appears on hover matching screenshot */}
      <Link
        href={href}
        className="absolute bottom-4 left-4 z-20 inline-flex items-center rounded-full bg-black/[0.08] px-3.5 py-1.5 text-xs font-normal text-slate-800 transition-all duration-200 hover:bg-black/[0.12] dark:bg-[#242426] dark:text-[#f0f0f0] dark:hover:bg-[#2c2c2f] opacity-0 translate-y-1 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0"
      >
        <span>{title}</span>
      </Link>
    </div>
  );
}
