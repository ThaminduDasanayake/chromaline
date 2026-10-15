"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProjectLibrary } from "@/components/tactile/project-library";
import { Folder } from "@/components/ui/folder";
import { Button } from "@/components/ui/button";

const FOLDER_COLOR_PRESETS = [
  { name: "Orange", body: "#E54F10", dark: "#7C2D12", light: "#FED7AA" },
  { name: "Electric Blue", body: "#0A90D2", dark: "#075985", light: "#BAE6FD" },
  { name: "Mint Green", body: "#53F399", dark: "#047857", light: "#D1FAE5" },
  { name: "Violet", body: "#8B5CF6", dark: "#4C1D95", light: "#DDD6FE" },
  { name: "Amber", body: "#F59E0B", dark: "#92400E", light: "#FEF08A" },
  { name: "Rose", body: "#F43F5E", dark: "#881337", light: "#FECDD3" },
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

              <span className="ml-4 shrink-0 font-mono text-base text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-slate-950">
                &rarr;
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
              <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-3 py-1.5 shadow-2xs backdrop-blur-xs">
                  {/* Color Swatches */}
                  <div className="flex items-center gap-1.5 border-r border-slate-200 pr-2">
                    {FOLDER_COLOR_PRESETS.map((preset, idx) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedFolderColor(idx);
                        }}
                        className={`h-4 w-4 cursor-pointer rounded-full border transition-all ${
                          selectedFolderColor === idx
                            ? "scale-110 ring-2 ring-slate-900"
                            : "opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: preset.body, borderColor: preset.dark }}
                        title={preset.name}
                      />
                    ))}
                  </div>

                  {/* Tab Position Switcher */}
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    {(["left", "center", "right"] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedFolderTab(pos);
                        }}
                        className={`cursor-pointer rounded px-2 py-0.5 capitalize transition-all ${
                          selectedFolderTab === pos
                            ? "bg-slate-900 font-semibold text-white"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
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

              <span className="ml-4 shrink-0 font-mono text-base text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-slate-950">
                &rarr;
              </span>
            </Link>
          </div>

          {/* Card 3: Tactile Button */}
          <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all hover:border-slate-300">
            {/* Interactive Preview Canvas */}
            <div className="relative flex h-80 flex-col items-center justify-center bg-[#F9FAFB] p-6 sm:h-88">
              <Button variant={buttonVariant}>
                <span>Continue</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  aria-hidden="true"
                >
                  <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
                </svg>
              </Button>

              {/* Quick Interactive Variant Controls */}
              <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/95 px-3 py-1.5 font-mono text-[10px] shadow-2xs backdrop-blur-xs">
                  {(["default", "dark", "orange", "emerald"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setButtonVariant(v);
                      }}
                      className={`cursor-pointer rounded px-2 py-0.5 capitalize transition-all ${
                        buttonVariant === v
                          ? "bg-slate-900 font-semibold text-white"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
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

              <span className="ml-4 shrink-0 font-mono text-base text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-slate-950">
                &rarr;
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
