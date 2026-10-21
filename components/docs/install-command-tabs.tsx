"use client";

import React, { useState } from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { SelectBar, SelectBarItem } from "@/components/ui/select-bar";
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

export function InstallCommandTabs({
  componentName,
  baseUrl = SITE_URL,
}: InstallCommandTabsProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        <button
          type="button"
          onClick={handleCopy}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900"
          title="Copy command"
        >
          {copied ? (
            <>
              <CheckIcon size={13} weight="bold" className="text-emerald-600" />
              <span className="font-semibold text-emerald-600">Copied</span>
            </>
          ) : (
            <>
              <CopyIcon size={13} weight="bold" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Command Code snippet block in light theme */}
      <div className="overflow-x-auto p-4 sm:p-5 font-mono text-xs leading-relaxed text-slate-800">
        <code>{currentCommand}</code>
      </div>
    </div>
  );
}
