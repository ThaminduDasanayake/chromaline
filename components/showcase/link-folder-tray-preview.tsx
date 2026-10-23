"use client";

import React, { useState } from "react";
import { FolderItem, FolderTray } from "@/components/ui/folder-tray";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

export const NAV_FOLDERS: FolderItem[] = [
  {
    id: "nav-home",
    name: "Overview",
    href: "/",
    bodyColor: "#E461F5", // Purple
    darkOutline: "#C137D5",
    lightOutline: "#F9D8FD",
    category: "Route",
    description: "Chromaline design system homepage and showcase.",
  },
  {
    id: "nav-button",
    name: "Button",
    href: "/components/button",
    bodyColor: "#4FA7FF", // Blue
    darkOutline: "#1A82E0",
    lightOutline: "#CCE5FF",
    category: "Component",
    description: "Tactile micro-interaction button with spring press dynamics.",
  },
  {
    id: "nav-folder",
    name: "Folder",
    href: "/components/folder",
    bodyColor: "#68DB7B", // Green
    darkOutline: "#37B954",
    lightOutline: "#D2F6D8",
    category: "Component",
    description: "Standalone 2D vector folder with exact filleted tabs.",
  },
  {
    id: "nav-tray",
    name: "Folder Tray",
    href: "/components/folder-tray",
    bodyColor: "#FFDE55", // Yellow
    darkOutline: "#DFBC1F",
    lightOutline: "#FFF4C2",
    category: "Component",
    description: "3D kinematic card tray with hairline riffle physics.",
  },
  {
    id: "nav-github",
    name: "GitHub",
    href: "https://github.com",
    target: "_blank",
    bodyColor: "#FFA85F", // Orange
    darkOutline: "#E08433",
    lightOutline: "#FFE3CC",
    category: "External",
    description: "View repository, release notes, and source code.",
  },
  {
    id: "nav-changelog",
    name: "Changelog",
    href: "/",
    bodyColor: "#FF6C6C", // Red
    darkOutline: "#DF4144",
    lightOutline: "#FFD1D2",
    category: "Updates",
    description: "Latest component updates and release notes.",
  },
  {
    id: "nav-registry",
    name: "Registry JSON",
    href: "/r/folder-tray.json",
    target: "_blank",
    bodyColor: "#ADACB0", // Gray
    darkOutline: "#88888E",
    lightOutline: "#E4E3E6",
    category: "API",
    description: "Direct shadcn registry schema endpoint for CLI installation.",
  },
  {
    id: "nav-select",
    name: "Select Bar",
    href: "/components/select-bar",
    bodyColor: "#FFFFFF", // White
    darkOutline: "#232327",
    lightOutline: "#E0E0E4",
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
        <span className="font-mono text-xs font-semibold text-slate-900">{active.name}</span>
        <span className="font-mono text-[11px] text-slate-400">{active.href}</span>
        <ArrowUpRightIcon size={12} weight="bold" className="text-slate-500" />
      </div>
    </div>
  );
}
