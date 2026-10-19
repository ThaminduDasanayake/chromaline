"use client";

import React from "react";
import { SiteHeader, SiteFooter } from "@/components/layout";
import { BackLink } from "./back-link";

export interface DocsLayoutProps {
  title: string;
  description: string;
  category?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function DocsLayout({
  title,
  description,
  category = "Components",
  icon,
  children,
}: DocsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200">
      <SiteHeader breadcrumb={title} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 md:px-8">
        <BackLink />

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {icon}
            <span>{category}</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {description}
          </p>
        </header>

        {/* Main Content Sections (Preview -> Installation -> Usage -> Props) */}
        <div className="space-y-12">{children}</div>
      </main>

      <SiteFooter />
    </div>
  );
}
