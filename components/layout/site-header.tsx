"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export interface SiteHeaderProps {
  /** Optional breadcrumb path (e.g. "Folder Tray", "Folder", "Button") */
  breadcrumb?: string;
  className?: string;
}

export function SiteHeader({ breadcrumb, className = "" }: SiteHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md transition-colors duration-200 md:px-12 dark:border-white/10 dark:bg-[#09090b]/90 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          className="font-mono text-sm font-bold tracking-tight text-slate-950 transition-opacity hover:opacity-80 dark:text-white"
        >
          Chromaline
        </Link>

        {breadcrumb ? (
          <>
            <span className="text-slate-300 select-none dark:text-zinc-600">/</span>
            <span className="font-mono text-xs text-slate-600 dark:text-zinc-300">
              {breadcrumb}
            </span>
          </>
        ) : (
          <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300">
            v0.1.0
          </span>
        )}
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <ThemeToggle />

        <Button href="https://github.com/ThaminduDasanayake/chromaline" target="_blank" size="sm">
          <Image src="/github.svg" alt="GitHub" width={14} height={14} className="h-3.5 w-3.5" />
          <span>GitHub</span>
        </Button>
      </div>
    </header>
  );
}
