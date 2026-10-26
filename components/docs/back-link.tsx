"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react";

export interface BackLinkProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackLink({
  href = "/",
  label = "Back to Components",
  className = "",
}: BackLinkProps) {
  return (
    <Link
      href={href}
      className={`group mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 transition-colors hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white ${className}`}
    >
      <ArrowLeftIcon
        size={12}
        weight="bold"
        className="transition-transform duration-150 group-hover:-translate-x-0.5"
      />
      <span>{label}</span>
    </Link>
  );
}

export { BackLink as BackToComponents };
