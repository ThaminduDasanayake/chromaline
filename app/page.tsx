"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProjectLibrary } from "@/components/tactile/project-library";
import { TactileSingleFolder } from "@/components/ui/tactile-folder";

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

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-slate-200">
      {/* Top Minimal Navbar */}
      <header className="sticky top-0 z-40 h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="font-bold text-sm tracking-tight text-slate-950 font-mono hover:opacity-80 transition-opacity">
            Chromaline
          </Link>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
            v0.1.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/r/index.json"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 transition-colors"
          >
            Registry JSON
          </a>
          <a
            href="https://github.com/lucasmarkes/hairline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono px-3 py-1 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <span>GitHub</span>
            <span className="text-[10px]">&nearr;</span>
          </a>
        </div>
      </header>

      {/* Main Grid Canvas */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16">
        {/* Minimal Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
            Components
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Physical line-art components built with vector mathematics, solid colorways, and pointer physics.
          </p>
        </div>

        {/* 2-Column Component Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Rolodex Tray */}
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:border-slate-300 transition-all overflow-hidden flex flex-col justify-between group">
            {/* Interactive Preview Canvas */}
            <div className="h-80 sm:h-88 bg-[#F9FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <ProjectLibrary />
            </div>

            {/* Bottom Card Footer - Links to /components/rolodex */}
            <Link
              href="/components/rolodex"
              className="p-5 sm:p-6 bg-white border-t border-slate-100 flex items-center justify-between cursor-pointer block hover:bg-slate-50/60 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-slate-950">
                    Rolodex Tray
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                    Interactive 3D
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  An interactive 3D isometric tray of folders with kinematic lean physics and solid colorways.
                </p>
              </div>

              <span className="text-slate-400 group-hover:text-slate-950 group-hover:translate-x-1 transition-all text-base font-mono ml-4 shrink-0">
                &rarr;
              </span>
            </Link>
          </div>

          {/* Card 2: Tactile Folder */}
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:border-slate-300 transition-all overflow-hidden flex flex-col justify-between group">
            {/* Interactive Preview Canvas */}
            <div className="h-80 sm:h-88 bg-[#F9FAFB] flex flex-col items-center justify-center p-6 relative">
              <TactileSingleFolder
                bodyColor={FOLDER_COLOR_PRESETS[selectedFolderColor].body}
                darkOutline={FOLDER_COLOR_PRESETS[selectedFolderColor].dark}
                lightOutline={FOLDER_COLOR_PRESETS[selectedFolderColor].light}
                tabPosition={selectedFolderTab}
                className="w-52 h-auto drop-shadow-sm transition-all"
              />

              {/* Quick Interactive Color & Tab Controls */}
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2">
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
                  {/* Color Swatches */}
                  <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200">
                    {FOLDER_COLOR_PRESETS.map((preset, idx) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedFolderColor(idx);
                        }}
                        className={`cursor-pointer w-4 h-4 rounded-full border transition-all ${
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
                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    {(["left", "center", "right"] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedFolderTab(pos);
                        }}
                        className={`cursor-pointer px-2 py-0.5 rounded capitalize transition-all ${
                          selectedFolderTab === pos
                            ? "bg-slate-900 text-white font-semibold"
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
              className="p-5 sm:p-6 bg-white border-t border-slate-100 flex items-center justify-between cursor-pointer block hover:bg-slate-50/60 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-slate-950">
                    Tactile Folder
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                    2D Vector
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  A standalone forward-facing folder card with tab fillets, ruled lines, and punch dots.
                </p>
              </div>

              <span className="text-slate-400 group-hover:text-slate-950 group-hover:translate-x-1 transition-all text-base font-mono ml-4 shrink-0">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-200/80 py-8 px-6 text-center text-xs text-slate-400 font-mono bg-white">
        <p>Chromaline · Vibrant line-art components for modern React.</p>
      </footer>
    </div>
  );
}
