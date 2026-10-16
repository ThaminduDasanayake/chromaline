"use client";

import React, { useState } from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export interface InstallCommandTabsProps {
  componentName: string;
  baseUrl?: string;
}

export function InstallCommandTabs({
  componentName,
  baseUrl = "http://localhost:3000",
}: InstallCommandTabsProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");
  const [copied, setCopied] = useState(false);

  const commands: Record<PackageManager, string> = {
    pnpm: `pnpm dlx shadcn@latest add ${baseUrl}/r/${componentName}.json`,
    npm: `npx shadcn@latest add ${baseUrl}/r/${componentName}.json`,
    yarn: `npx shadcn@latest add ${baseUrl}/r/${componentName}.json`,
    bun: `bunx --bun shadcn@latest add ${baseUrl}/r/${componentName}.json`,
  };

  const currentCommand = commands[packageManager];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Package Manager Selector Tabs */}
      <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-slate-200/90 bg-slate-100 px-4 py-2 font-mono text-xs">
        <div className="flex items-center gap-1">
          {(["pnpm", "npm", "yarn", "bun"] as const).map((pm) => (
            <button
              key={pm}
              type="button"
              onClick={() => setPackageManager(pm)}
              className={`cursor-pointer rounded px-2.5 py-1 font-mono transition-all ${
                packageManager === pm
                  ? "bg-white font-semibold text-slate-950 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {pm}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex cursor-pointer items-center gap-1 text-slate-500 transition-colors hover:text-slate-900"
          title="Copy command"
        >
          {copied ? (
            <>
              <CheckIcon size={13} weight="bold" className="text-emerald-600" />
              <span className="text-emerald-600 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Command Code Snippet Block */}
      <div className="rounded-b-xl border border-slate-200/90 bg-[#1E1E2E] p-4 font-mono text-xs text-slate-100">
        <div className="flex items-center justify-between overflow-x-auto">
          <code>{currentCommand}</code>
        </div>
      </div>
    </div>
  );
}
