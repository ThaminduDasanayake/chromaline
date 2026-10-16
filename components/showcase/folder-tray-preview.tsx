"use client";

import React, { useEffect, useState } from "react";
import { Folder, FolderItem, FolderTray } from "@/components/ui/folder-tray";
import { SelectBar } from "@/components/ui/select-bar";
import { CircleHalfIcon, PaletteIcon, XIcon } from "@phosphor-icons/react";

export interface WorkspaceData {
  branch: string;
  status: "deployed" | "building" | "synced" | "review";
  updated: string;
  filesCount: number;
  files: string[];
  envVars: { key: string; value: string }[];
}

// 8 Folders showcasing the full spectrum: live links, short notes, and long-form articles
export const WORKSPACE_FOLDERS: FolderItem<WorkspaceData>[] = [
  {
    id: "f-1",
    name: "The Tactile Web",
    bodyColor: "#E54F10", // Vivid Terracotta Orange
    darkOutline: "#7C2D12",
    lightOutline: "#FED7AA",
    category: "Essay",
    description:
      "An inquiry into why physical metaphors, paper grain, and spring physics make digital software feel durable and human.",
    content: (
      <div className="space-y-3">
        <p>
          For over a decade, digital interface design leaned heavily toward sterile flat rectangles—erasing texture, depth, and spatial continuity in pursuit of minimalist abstraction.
        </p>
        <p>
          The tactile web is a quiet renaissance: re-anchoring digital artifacts in physical intuition. When an element bends with mass, reflects ambient lighting, or riffles like index cards in a drawer, the interface stops feeling like temporary pixels and starts feeling like an heirloom tool.
        </p>
        <p>
          Chromaline explores this intersection—combining lightweight hairline vector graphics with natural spring physics to bring weight, delight, and permanence back to the browser.
        </p>
      </div>
    ),
    data: {
      branch: "main",
      status: "deployed",
      updated: "12m ago",
      filesCount: 3,
      files: ["essay.md", "references.bib", "figures.svg"],
      envVars: [],
    },
  },
  {
    id: "f-2",
    name: "Button Component",
    href: "/components/button",
    target: "_blank",
    bodyColor: "#0A90D2", // Vivid Electric Blue
    darkOutline: "#075985",
    lightOutline: "#BAE6FD",
    category: "Primitive",
    description: "Tactile micro-interaction button with spring press dynamics and dual-tone border bevels.",
    data: {
      branch: "main",
      status: "deployed",
      updated: "1h ago",
      filesCount: 14,
      files: ["button.tsx", "button.test.tsx"],
      envVars: [],
    },
  },
  {
    id: "f-3",
    name: "Design Notes",
    bodyColor: "#53F399", // Vivid Mint Spring Green
    darkOutline: "#047857",
    lightOutline: "#D1FAE5",
    category: "Guidelines",
    description: "Core design rules and specifications for tactile UI components.",
    content: (
      <div className="space-y-2.5">
        <p className="font-mono text-xs uppercase tracking-wider opacity-75">Core Principles</p>
        <p>• Keep vector geometry featherweight: render silhouettes purely with SVG paths and hairlines.</p>
        <p>• Prioritize 60fps responsiveness: cascade color themes through 0ms CSS custom variables.</p>
        <p>• Respect physical intuition: every transition should have mass, settle curves, and tactile feedback.</p>
      </div>
    ),
    data: {
      branch: "main",
      status: "deployed",
      updated: "3h ago",
      filesCount: 22,
      files: ["principles.md", "tokens.json"],
      envVars: [],
    },
  },
  {
    id: "f-4",
    name: "Folder Primitive",
    href: "/components/folder",
    target: "_blank",
    bodyColor: "#8B5CF6", // Vivid Bright Violet
    darkOutline: "#4C1D95",
    lightOutline: "#DDD6FE",
    category: "Primitive",
    description: "Individual SVG manila folder card with 5 ruled lines, dual-layer borders, and dynamic fill.",
    data: {
      branch: "main",
      status: "synced",
      updated: "4h ago",
      filesCount: 8,
      files: ["folder.tsx", "registry.json"],
      envVars: [],
    },
  },
  {
    id: "f-5",
    name: "Release Notes",
    bodyColor: "#F59E0B", // Vivid Bright Amber
    darkOutline: "#92400E",
    lightOutline: "#FEF08A",
    category: "Changelog",
    description: "Version 0.1.0 release notes and feature changelog.",
    content: (
      <div className="space-y-2.5">
        <p className="font-mono text-xs uppercase tracking-wider opacity-75">v0.1.0 Release Changelog</p>
        <p>• Hairline Riffle 3D isometric tray with interactive spring card riffle physics.</p>
        <p>• Floating 9-color inspector with true-opacity swatches and dynamic text contrast inversion.</p>
        <p>• First-class hybrid routing: seamless support for direct URL navigation alongside rich document/note reading.</p>
      </div>
    ),
    data: {
      branch: "v0.1.0",
      status: "deployed",
      updated: "5h ago",
      filesCount: 54,
      files: ["CHANGELOG.md"],
      envVars: [],
    },
  },
  {
    id: "f-6",
    name: "Brand Palette",
    bodyColor: "#F43F5E", // Vivid Bright Rose
    darkOutline: "#881337",
    lightOutline: "#FECDD3",
    category: "Tokens",
    description: "9 high-saturation ink tones formulated for deep contrast on both dark and light surfaces.",
    data: {
      branch: "main",
      status: "deployed",
      updated: "1d ago",
      filesCount: 16,
      files: ["palette.json", "swatches.ase"],
      envVars: [],
    },
  },
  {
    id: "f-7",
    name: "Architecture",
    bodyColor: "#06B6D4", // Vivid Bright Cyan
    darkOutline: "#155E75",
    lightOutline: "#CFFAFE",
    category: "Engineering",
    description: "Hairline canvas pipeline driving SVG geometry through CSS variables for instantaneous 0ms repaint performance.",
    data: {
      branch: "v2-release",
      status: "synced",
      updated: "2d ago",
      filesCount: 40,
      files: ["architecture.md", "pipeline.ts"],
      envVars: [],
    },
  },
  {
    id: "f-8",
    name: "Manifesto",
    bodyColor: "#6366F1", // Vivid Bright Indigo
    darkOutline: "#312E81",
    lightOutline: "#E0E7FF",
    category: "Philosophy",
    description: "Software should feel like fine stationery: carefully folded, pleasing to touch, and crafted to last.",
    data: {
      branch: "main",
      status: "deployed",
      updated: "3d ago",
      filesCount: 12,
      files: ["manifesto.md"],
      envVars: [],
    },
  },
];

export const FOLDER_COLOR_OPTIONS = [
  { name: "Original", body: "#FFFFFF", dark: "#232327", light: "#E0E0E4" },
  { name: "Orange", body: "#E54F10", dark: "#7C2D12", light: "#FED7AA" },
  { name: "Electric Blue", body: "#0A90D2", dark: "#075985", light: "#BAE6FD" },
  { name: "Mint Green", body: "#53F399", dark: "#047857", light: "#D1FAE5" },
  { name: "Violet", body: "#8B5CF6", dark: "#4C1D95", light: "#DDD6FE" },
  { name: "Amber", body: "#F59E0B", dark: "#92400E", light: "#FEF08A" },
  { name: "Rose", body: "#F43F5E", dark: "#881337", light: "#FECDD3" },
  { name: "Cyan", body: "#06B6D4", dark: "#155E75", light: "#CFFAFE" },
  { name: "Indigo", body: "#6366F1", dark: "#312E81", light: "#E0E7FF" },
];

function isDarkColor(hex?: string): boolean {
  if (!hex) return true;
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 160;
}

export function FolderTrayPreview({ showControls = true }: { showControls?: boolean }) {
  const [folders, setFolders] = useState<FolderItem<WorkspaceData>[]>(WORKSPACE_FOLDERS);
  const [variant, setVariant] = useState<"color" | "original">("color");
  const [modalFolder, setModalFolder] = useState<FolderItem<WorkspaceData> | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalFolder(null);
      }
    };
    if (modalFolder) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [modalFolder]);

  const activeIndex = modalFolder ? folders.findIndex((f) => f.id === modalFolder.id) : 0;
  const isDark = modalFolder ? isDarkColor(modalFolder.bodyColor) : true;

  const handleFolderColorChange = (colorKey: string) => {
    const selectedPreset = FOLDER_COLOR_OPTIONS.find(
      (opt) => opt.body.toLowerCase() === colorKey.toLowerCase()
    );
    if (!selectedPreset || !modalFolder) return;

    const updatedFolder: FolderItem<WorkspaceData> = {
      ...modalFolder,
      bodyColor: selectedPreset.body,
      darkOutline: selectedPreset.dark,
      lightOutline: selectedPreset.light,
    };

    setModalFolder(updatedFolder);
    setFolders((prevFolders) =>
      prevFolders.map((f) => (f.id === updatedFolder.id ? updatedFolder : f))
    );

    if (variant === "original" && selectedPreset.name !== "Original") {
      setVariant("color");
    }
  };

  const handleOpenFolder = (folder: FolderItem<WorkspaceData>) => {
    if (folder.href) {
      window.open(folder.href, folder.target || "_blank", "noopener,noreferrer");
    } else {
      setModalFolder(folder);
    }
  };

  return (
    <>
      {/* 3D Folder Tray Preview Container */}
      <div className="flex w-full justify-center">
        <FolderTray<WorkspaceData>
          folders={folders}
          variant={variant}
          intensity={0.65}
          defaultSelected={0}
          onOpen={handleOpenFolder}
        />
      </div>

      {/* Visual Theme Selector: Color vs No color (Original theme) */}
      {showControls && (
        <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2">
          <SelectBar<"color" | "original">
            size="xs"
            items={[
              {
                key: "color",
                label: "Color",
                icon: <PaletteIcon size={13} weight="bold" />,
              },
              {
                key: "original",
                label: "No color",
                icon: <CircleHalfIcon size={13} weight="bold" />,
              },
            ]}
            value={variant}
            onChange={setVariant}
            ariaLabel="Select folder tray theme"
          />
        </div>
      )}

      {/* Folder Preview Modal - Shaped as the Folder Itself without Ruled Lines */}
      {modalFolder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${modalFolder.name} Details`}
          className="animate-in fade-in fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-slate-950/45 p-4 backdrop-blur-xs duration-200 sm:gap-5"
          onClick={() => setModalFolder(null)}
        >
          <div
            className="animate-in zoom-in-95 relative aspect-88/65 w-full max-w-175 drop-shadow-[0_30px_50px_rgba(0,0,0,0.45)] filter duration-200 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <Folder
              bodyColor={modalFolder.bodyColor}
              darkOutline={modalFolder.darkOutline}
              lightOutline={modalFolder.lightOutline}
              borderWidth={2}
              folderIndex={activeIndex >= 0 ? activeIndex : 0}
              showLines={false}
              className="h-full w-full"
            >
              {/* Corner Close Button - Inside the folder */}
              <button
                type="button"
                onClick={() => setModalFolder(null)}
                className={`absolute top-[17%] right-[7%] z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all active:scale-95 sm:h-9 sm:w-9 ${
                  isDark
                    ? "border border-white/25 bg-black/25 text-white/80 shadow-xs hover:bg-black/45 hover:text-white"
                    : "border border-black/15 bg-black/10 text-slate-900 shadow-xs hover:bg-black/20 hover:text-slate-950"
                }`}
                title="Close (Esc)"
                aria-label="Close dialog"
              >
                <XIcon size={15} weight="bold" />
              </button>

              {/* Folder Interior Content */}
              <div className="absolute inset-0 flex flex-col justify-between px-[8%] pt-[14%] pb-[8%]">
                <div className="max-w-xl pr-10 sm:pr-12">
                  <h3
                    className={`font-mono text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl ${
                      isDark ? "text-white" : "text-slate-950"
                    }`}
                  >
                    {modalFolder.name}
                  </h3>
                </div>

                {/* Article / Notes Scrollable Area */}
                <div
                  className="my-auto max-h-[66%] overflow-y-auto pr-2 select-text"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: isDark
                      ? "rgba(255,255,255,0.2) transparent"
                      : "rgba(0,0,0,0.2) transparent",
                  }}
                >
                  {modalFolder.content ? (
                    <div
                      className={`font-sans text-sm leading-relaxed sm:text-base md:text-lg ${
                        isDark ? "text-white/85" : "text-slate-700"
                      }`}
                    >
                      {modalFolder.content}
                    </div>
                  ) : (
                    <p
                      className={`font-sans text-sm leading-relaxed sm:text-base md:text-lg ${
                        isDark ? "text-white/85" : "text-slate-700"
                      }`}
                    >
                      {modalFolder.description}
                    </p>
                  )}
                </div>

                <div className="h-0.5" />
              </div>
            </Folder>
          </div>

          {/* Floating Color Swatch Palette Toolbar outside the folder */}
          <div
            className="animate-in fade-in slide-in-from-bottom-2 z-10 flex items-center justify-center duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <SelectBar
              variant="swatches"
              size="xs"
              items={FOLDER_COLOR_OPTIONS.map((opt) => ({
                key: opt.body,
                color: opt.body,
                darkOutline: opt.dark,
                label: opt.name,
              }))}
              value={modalFolder.bodyColor}
              onChange={handleFolderColorChange}
              ariaLabel="Change folder color"
            />
          </div>
        </div>
      )}
    </>
  );
}
