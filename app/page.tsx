"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProjectLibrary } from "@/components/tactile/project-library";
import { Folder } from "@/components/ui/folder";
import { Button } from "@/components/ui/button";
import { SelectBar } from "@/components/ui/select-bar";
import {
  ArrowRight,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@phosphor-icons/react";

const FOLDER_COLOR_PRESETS = [
  { name: "Orange", body: "#E54F10", dark: "#7C2D12", light: "#FED7AA" },
  { name: "Electric Blue", body: "#0A90D2", dark: "#075985", light: "#BAE6FD" },
  { name: "Mint Green", body: "#53F399", dark: "#047857", light: "#D1FAE5" },
  { name: "Violet", body: "#8B5CF6", dark: "#4C1D95", light: "#DDD6FE" },
  { name: "Amber", body: "#F59E0B", dark: "#92400E", light: "#FEF08A" },
  { name: "Rose", body: "#F43F5E", dark: "#881337", light: "#FECDD3" },
];

const BUTTON_VARIANTS = [
  { key: "default" as const, label: "Default", color: "#4a4a46", darkOutline: "#292926" },
  { key: "dark" as const, label: "Dark", color: "#1e2024", darkOutline: "#111215" },
  { key: "orange" as const, label: "Orange", color: "#e54f10", darkOutline: "#9a3412" },
  { key: "emerald" as const, label: "Emerald", color: "#059669", darkOutline: "#047857" },
];

const TAB_POSITIONS = [
  {
    key: "left" as const,
    label: "Left",
    icon: <TextAlignLeftIcon size={13} weight="bold" />,
  },
  {
    key: "center" as const,
    label: "Center",
    icon: <TextAlignCenterIcon size={13} weight="bold" />,
  },
  {
    key: "right" as const,
    label: "Right",
    icon: <TextAlignRightIcon size={13} weight="bold" />,
  },
];

export default function ChromalineHomePage() {
  const [selectedFolderColor, setSelectedFolderColor] = useState(0);
  const [selectedFolderTab, setSelectedFolderTab] = useState<"left" | "center" | "right">("center");
  const [buttonVariant, setButtonVariant] = useState<"default" | "dark" | "orange" | "emerald">(
    "default"
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200">
      {/* Top Minimal Navbar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md md:px-12">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="font-mono text-sm font-bold tracking-tight text-slate-950 transition-opacity hover:opacity-80"
          >
            Chromaline
          </Link>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600">
            v0.1.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button href="https://github.com/lucasmarkes/hairline" target="_blank" size="sm">
            <Image src="/github.svg" alt="GitHub" width={14} height={14} className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </Button>
        </div>
      </header>

      {/* Main Grid Canvas */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 md:px-8 md:py-16">
        {/* Minimal Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Components
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Physical line-art components built with vector mathematics, solid colorways, and pointer
            physics.
          </p>
        </div>

        {/* 2-Column Component Showcase Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Card 1: Folder Tray */}
          <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all hover:border-slate-300">
            {/* Interactive Preview Canvas */}
            <div className="relative flex h-80 flex-col items-center justify-center overflow-hidden bg-[#F9FAFB] p-6 sm:h-88">
              <ProjectLibrary />
            </div>

            {/* Bottom Card Footer - Links to /components/folder-tray */}
            <Link
              href="/components/folder-tray"
              className="block flex cursor-pointer items-center justify-between border-t border-slate-100 bg-white p-5 transition-colors hover:bg-slate-50/60 sm:p-6"
            >
              <div>
                <h2 className="text-sm font-semibold text-slate-900 group-hover:text-slate-950 sm:text-base">
                  Folder Tray
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  An interactive 3D isometric tray of folders with kinematic lean physics and solid
                  colorways.
                </p>
              </div>

              <span className="ml-4 shrink-0 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-slate-950">
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>

          {/* Card 2: Folder */}
          <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all hover:border-slate-300">
            {/* Interactive Preview Canvas */}
            <div className="relative flex h-80 flex-col items-center justify-center bg-[#F9FAFB] p-6 sm:h-88">
              <Folder
                bodyColor={FOLDER_COLOR_PRESETS[selectedFolderColor].body}
                darkOutline={FOLDER_COLOR_PRESETS[selectedFolderColor].dark}
                lightOutline={FOLDER_COLOR_PRESETS[selectedFolderColor].light}
                tabPosition={selectedFolderTab}
                className="h-auto w-52 drop-shadow-sm transition-all"
              />

              {/* Quick Interactive Color & Tab Controls */}
              <div className="absolute inset-x-0 bottom-4 flex flex-wrap items-center justify-center gap-2 px-2">
                {/* Color Swatches with Elastic Indicator */}
                <SelectBar
                  variant="swatches"
                  size="xs"
                  items={FOLDER_COLOR_PRESETS.map((preset, idx) => ({
                    key: String(idx),
                    color: preset.body,
                    darkOutline: preset.dark,
                    label: preset.name,
                  }))}
                  value={String(selectedFolderColor)}
                  onChange={(key) => setSelectedFolderColor(Number(key))}
                  ariaLabel="Select folder color"
                />

                {/* Tab Position Switcher with Elastic Indicator */}
                <SelectBar<"left" | "center" | "right">
                  size="xs"
                  items={TAB_POSITIONS}
                  value={selectedFolderTab}
                  onChange={setSelectedFolderTab}
                  ariaLabel="Select tab position"
                />
              </div>
            </div>

            {/* Bottom Card Footer - Links to /components/folder */}
            <Link
              href="/components/folder"
              className="block flex cursor-pointer items-center justify-between border-t border-slate-100 bg-white p-5 transition-colors hover:bg-slate-50/60 sm:p-6"
            >
              <div>
                <h2 className="text-sm font-semibold text-slate-900 group-hover:text-slate-950 sm:text-base">
                  Folder
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  A standalone forward-facing folder card with tab fillets, ruled lines, and punch
                  dots.
                </p>
              </div>

              <span className="ml-4 shrink-0 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-slate-950">
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>

          {/* Card 3: Tactile Button */}
          <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all hover:border-slate-300">
            {/* Interactive Preview Canvas */}
            <div className="relative flex h-80 flex-col items-center justify-center bg-[#F9FAFB] p-6 sm:h-88">
              <Button variant={buttonVariant}>
                <span>Continue</span>
                <ArrowRight size={14} weight="bold" />
              </Button>

              {/* Quick Interactive Variant Controls */}
              <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
                <SelectBar<"default" | "dark" | "orange" | "emerald">
                  variant="swatches"
                  size="xs"
                  items={BUTTON_VARIANTS}
                  value={buttonVariant}
                  onChange={setButtonVariant}
                  ariaLabel="Select button variant"
                />
              </div>
            </div>

            {/* Bottom Card Footer - Links to /components/button */}
            <Link
              href="/components/button"
              className="block flex cursor-pointer items-center justify-between border-t border-slate-100 bg-white p-5 transition-colors hover:bg-slate-50/60 sm:p-6"
            >
              <div>
                <h2 className="text-sm font-semibold text-slate-900 group-hover:text-slate-950 sm:text-base">
                  Button
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  A tactile 3D push button engineered with physical extrusion depth, inset bevel
                  highlights, and click kinematics.
                </p>
              </div>

              <span className="ml-4 shrink-0 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-slate-950">
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white px-6 py-8 text-center font-mono text-xs text-slate-400">
        <p>Chromaline · Vibrant line-art components for modern React.</p>
      </footer>
    </div>
  );
}
