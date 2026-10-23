"use client";

import React, { useState } from "react";
import { SelectBar, SelectBarItem } from "@/components/ui/select-bar";
import { CopyButton } from "@/components/ui/copy-button";
import { SITE_URL } from "@/config/site";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export interface InstallCommandTabsProps {
  componentName: string;
  baseUrl?: string;
}

const PACKAGE_MANAGERS: SelectBarItem<PackageManager>[] = [
  { key: "pnpm", label: "pnpm" },
  { key: "npm", label: "npm" },
  { key: "yarn", label: "yarn" },
  { key: "bun", label: "bun" },
];

const emptySubscribe = () => () => {};

export function InstallCommandTabs({ componentName, baseUrl = SITE_URL }: InstallCommandTabsProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");

  const host = React.useSyncExternalStore(
    emptySubscribe,
    () => {
      const origin = window.location.origin;
      if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return baseUrl;
      }
      return origin;
    },
    () => baseUrl
  );

  const commands: Record<PackageManager, string> = {
    pnpm: `pnpm dlx shadcn@latest add ${host}/r/${componentName}.json`,
    npm: `npx shadcn@latest add ${host}/r/${componentName}.json`,
    yarn: `yarn dlx shadcn@latest add ${host}/r/${componentName}.json`,
    bun: `bunx --bun shadcn@latest add ${host}/r/${componentName}.json`,
  };

  const currentCommand = commands[packageManager];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-[#F9FAFB] shadow-2xs">
      {/* Top Header: SelectBar on left, Copy button on right */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white/70 px-4 py-2.5 backdrop-blur-xs">
        <SelectBar<PackageManager>
          size="xs"
          items={PACKAGE_MANAGERS}
          value={packageManager}
          onChange={setPackageManager}
        />

        <CopyButton value={currentCommand} title="Copy command" />
      </div>

      {/* Command Code snippet block in light theme */}
      <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-800 sm:p-5">
        <code>{currentCommand}</code>
      </div>
    </div>
  );
}
