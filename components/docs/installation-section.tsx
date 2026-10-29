"use client";

import React from "react";
import { InstallCommandTabs } from "./install-command-tabs";

export interface InstallationSectionProps {
  componentName: string;
  description?: string;
}

export function InstallationSection({
  componentName,
  description = "Install the component via shadcn CLI into your project.",
}: InstallationSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
        Installation
      </h2>
      <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{description}</p>
      <div className="mt-4">
        <InstallCommandTabs componentName={componentName} />
      </div>
    </section>
  );
}
