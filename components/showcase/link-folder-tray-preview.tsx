"use client";

import React, { useState } from "react";
import { FolderItem, FolderTray } from "@/components/ui/folder-tray";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

export const NAV_FOLDERS: FolderItem[] = [
  {
    id: "nav-home",
    name: "Overview",
    href: "/",
    bodyColor: "#E54F10", // Vivid Orange
    darkOutline: "#7C2D12",
    lightOutline: "#FED7AA",
    category: "Route",
    description: "Chromaline design system homepage and showcase.",
  },
  {
    id: "nav-button",
    name: "Button",
    href: "/components/button",
    bodyColor: "#0A90D2", // Electric Blue
    darkOutline: "#075985",
    lightOutline: "#BAE6FD",
    category: "Component",
    description: "Tactile micro-interaction button with spring press dynamics.",
  },
  {
    id: "nav-folder",
    name: "Folder",
    href: "/components/folder",
    bodyColor: "#53F399", // Mint Green
    darkOutline: "#047857",
    lightOutline: "#D1FAE5",
    category: "Component",
    description: "Standalone 2D vector folder with exact filleted tabs.",
  },
  {
    id: "nav-tray",
    name: "Folder Tray",
    href: "/components/folder-tray",
    bodyColor: "#8B5CF6", // Violet
    darkOutline: "#4C1D95",
    lightOutline: "#DDD6FE",
    category: "Component",
    description: "3D kinematic card tray with hairline riffle physics.",
  },
  {
    id: "nav-github",
    name: "GitHub",
    href: "https://github.com",
    target: "_blank",
    bodyColor: "#F59E0B", // Amber
    darkOutline: "#92400E",
    lightOutline: "#FEF08A",
    category: "External",
    description: "View repository, release notes, and source code.",
  },
  {
    id: "nav-changelog",
    name: "Changelog",
    href: "/",
    bodyColor: "#F43F5E", // Rose
    darkOutline: "#881337",
    lightOutline: "#FECDD3",
    category: "Updates",
    description: "Latest component updates and release notes.",
  },
  {
    id: "nav-registry",
    name: "Registry JSON",
    href: "/r/folder-tray.json",
    target: "_blank",
    bodyColor: "#06B6D4", // Cyan
    darkOutline: "#155E75",
    lightOutline: "#CFFAFE",
    category: "API",
    description: "Direct shadcn registry schema endpoint for CLI installation.",
  },
  {
    id: "nav-select",
    name: "Select Bar",
    href: "/components/select-bar",
    bodyColor: "#6366F1", // Indigo
    darkOutline: "#312E81",
    lightOutline: "#E0E7FF",
    category: "Component",
    description: "Elastic kinetic segmented pill and color swatch selector.",
  },
];

export function LinkFolderTrayPreview() {
  const [hoveredFolder, setHoveredFolder] = useState<FolderItem | null>(null);

  const active = hoveredFolder || NAV_FOLDERS[0];

  return (
    <div className="flex w-full flex-col items-center">
      {/* 3D Folder Tray */}
      <div className="flex w-full justify-center">
        <FolderTray
          folders={NAV_FOLDERS}
          variant="color"
          intensity={0.65}
          defaultSelected={0}
          onHover={setHoveredFolder}
        />
      </div>

      {/* Dynamic Hover Destination Pill */}
      <div className="mt-3 flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-4 py-1.5 shadow-2xs backdrop-blur-xs transition-all duration-150">
        <span className="font-mono text-[11px] text-slate-500">
          {active.target === "_blank" ? "External:" : "Link:"}
        </span>
        <span className="font-mono text-xs font-semibold text-slate-900">
          {active.name}
        </span>
        <span className="font-mono text-[11px] text-slate-400">
          {active.href}
        </span>
        <ArrowUpRightIcon size={12} weight="bold" className="text-slate-500" />
      </div>
    </div>
  );
}
