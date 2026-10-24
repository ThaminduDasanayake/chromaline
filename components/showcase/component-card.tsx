"use client";

import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react";

export interface ComponentCardProps {
  title: string;
  description: string;
  href: string;
  children: React.ReactNode;
  previewClassName?: string;
  className?: string;
}

export function ComponentCard({
  title,
  description,
  href,
  children,
  previewClassName = "relative flex h-80 flex-col items-center justify-center overflow-hidden bg-[#F9FAFB] p-6 sm:h-88",
  className = "",
}: ComponentCardProps) {
  return (
    <div
      className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all hover:border-slate-300 ${className}`}
    >
      {/* Interactive Preview Canvas */}
      <div className={previewClassName}>{children}</div>

      {/* Bottom Card Footer - Link */}
      <Link
        href={href}
        className="flex cursor-pointer items-center justify-between border-t border-slate-100 bg-white p-5 transition-colors hover:bg-slate-50/60 sm:p-6"
      >
        <div>
          <h2 className="text-sm font-semibold text-slate-900 group-hover:text-slate-950 sm:text-base">
            {title}
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{description}</p>
        </div>

        <span className="ml-4 shrink-0 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-slate-950">
          <ArrowRightIcon size={16} />
        </span>
      </Link>
    </div>
  );
}
