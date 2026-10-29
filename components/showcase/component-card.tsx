"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react";

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
      {/* Name Badge - Appears on hover */}
      <Link
        href={href}
        className="absolute top-3.5 left-3.5 z-20 inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/85 px-3 py-1 text-xs font-semibold tracking-tight text-slate-900 shadow-2xs backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-black dark:border-white/10 dark:bg-[#181818]/85 dark:text-zinc-100 dark:hover:bg-[#202020] dark:hover:text-white opacity-0 -translate-y-1 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0"
      >
        <span>{title}</span>
        <ArrowRightIcon
          size={12}
          className="text-slate-400 transition-transform duration-150 group-hover:translate-x-0.5 dark:text-zinc-500"
        />
      </Link>

      {/* Component Preview Canvas */}
      <div className={previewClassName}>{children}</div>
    </div>
  );
}
