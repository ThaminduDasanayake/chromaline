"use client";

import React, { useState } from "react";
import { ProjectLibrary } from "@/components/tactile/project-library";
import { TactileSingleFolder } from "@/components/ui/tactile-folder";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

interface ComponentCardItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  installCommand: string;
  codeSnippet: string;
  registryUrl: string;
}

const COMPONENTS: ComponentCardItem[] = [
  {
    id: "rolodex",
    title: "Rolodex Tray",
    description: "An interactive 3D isometric tray of folders with kinematic lean physics and solid colorways.",
    badge: "Interactive 3D",
    installCommand: "npx shadcn@latest add http://localhost:3000/r/tactile-rolodex.json",
    registryUrl: "/r/tactile-rolodex.json",
    codeSnippet: `import { TactileRolodex } from "@/components/ui/tactile-rolodex";

export default function Example() {
  const folders = [
    { id: "1", name: "Project 1", bodyColor: "#E54F10", darkOutline: "#7C2D12", lightOutline: "#FED7AA" },
    { id: "2", name: "Project 2", bodyColor: "#0A90D2", darkOutline: "#075985", lightOutline: "#BAE6FD" },
    { id: "3", name: "Project 3", bodyColor: "#53F399", darkOutline: "#047857", lightOutline: "#D1FAE5" },
  ];

  return (
    <TactileRolodex
      folders={folders}
      onOpen={(folder) => console.log("Open folder", folder.name)}
    />
  );
}`,
  },
  {
    id: "folder",
    title: "Tactile Folder",
    description: "A standalone forward-facing folder card with tab fillets, ruled lines, and punch dots.",
    badge: "2D Vector",
    installCommand: "npx shadcn@latest add http://localhost:3000/r/tactile-folder.json",
    registryUrl: "/r/tactile-folder.json",
    codeSnippet: `import { TactileSingleFolder } from "@/components/ui/tactile-folder";

export default function Example() {
  return (
    <TactileSingleFolder
      bodyColor="#E54F10"
      darkOutline="#7C2D12"
      lightOutline="#FED7AA"
      tabPosition="center"
      className="w-52 h-auto"
    />
  );
}`,
  },
];

const FOLDER_COLOR_PRESETS = [
  { name: "Orange", body: "#E54F10", dark: "#7C2D12", light: "#FED7AA" },
  { name: "Electric Blue", body: "#0A90D2", dark: "#075985", light: "#BAE6FD" },
  { name: "Mint Green", body: "#53F399", dark: "#047857", light: "#D1FAE5" },
  { name: "Violet", body: "#8B5CF6", dark: "#4C1D95", light: "#DDD6FE" },
  { name: "Amber", body: "#F59E0B", dark: "#92400E", light: "#FEF08A" },
  { name: "Rose", body: "#F43F5E", dark: "#881337", light: "#FECDD3" },
];

export default function ChromalinePage() {
  const [selectedFolderColor, setSelectedFolderColor] = useState(0);
  const [selectedFolderTab, setSelectedFolderTab] = useState<"left" | "center" | "right">("center");
  const [detailModalItem, setDetailModalItem] = useState<ComponentCardItem | null>(null);
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getCliCommand = (cmd: string, pm: PackageManager) => {
    if (pm === "pnpm") return cmd.replace("npx", "pnpm dlx");
    if (pm === "bun") return cmd.replace("npx", "bunx --bun");
    return cmd;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-slate-200">
      {/* Top Minimal Navbar */}
      <header className="sticky top-0 z-40 h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-sm tracking-tight text-slate-950 font-mono">
            Chromaline
          </span>
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

        {/* 2-Column Component Showcase Grid (Matching user reference layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Rolodex Tray */}
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:border-slate-300 transition-all overflow-hidden flex flex-col justify-between group">
            {/* Interactive Preview Canvas */}
            <div className="h-80 sm:h-88 bg-[#F9FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <ProjectLibrary />
            </div>

            {/* Bottom Card Footer */}
            <div
              onClick={() => setDetailModalItem(COMPONENTS[0])}
              className="p-5 sm:p-6 bg-white border-t border-slate-100 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-slate-950">
                    {COMPONENTS[0].title}
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                    {COMPONENTS[0].badge}
                  </span>
                </div>
                <span className="text-slate-400 group-hover:text-slate-950 group-hover:translate-x-0.5 transition-all text-base font-mono">
                  &rarr;
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {COMPONENTS[0].description}
              </p>
            </div>
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

            {/* Bottom Card Footer */}
            <div
              onClick={() => setDetailModalItem(COMPONENTS[1])}
              className="p-5 sm:p-6 bg-white border-t border-slate-100 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-slate-950">
                    {COMPONENTS[1].title}
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                    {COMPONENTS[1].badge}
                  </span>
                </div>
                <span className="text-slate-400 group-hover:text-slate-950 group-hover:translate-x-0.5 transition-all text-base font-mono">
                  &rarr;
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {COMPONENTS[1].description}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* COMPONENT INSTALL & CODE MODAL (Opens on click) */}
      {detailModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setDetailModalItem(null)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-950 font-mono flex items-center gap-2">
                  <span>{detailModalItem.title}</span>
                  {detailModalItem.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                      {detailModalItem.badge}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{detailModalItem.description}</p>
              </div>

              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="cursor-pointer text-slate-400 hover:text-slate-800 w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-xs font-mono"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs font-mono">
              {/* CLI Command */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600 font-sans font-medium">Install Command</span>
                  <div className="flex items-center gap-1">
                    {(["pnpm", "npm", "yarn", "bun"] as PackageManager[]).map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setPackageManager(pm)}
                        className={`cursor-pointer px-2 py-0.5 rounded text-[10px] ${
                          packageManager === pm
                            ? "bg-slate-900 text-white font-semibold"
                            : "bg-slate-100 text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-slate-800">
                  <span className="truncate select-all pr-3">
                    {getCliCommand(detailModalItem.installCommand, packageManager)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        getCliCommand(detailModalItem.installCommand, packageManager),
                        "modal-cli"
                      )
                    }
                    className="cursor-pointer shrink-0 text-slate-500 hover:text-slate-900 text-[11px] font-medium"
                  >
                    {copiedKey === "modal-cli" ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Code Snippet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600 font-sans font-medium">Usage Example</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(detailModalItem.codeSnippet, "modal-code")}
                    className="cursor-pointer text-slate-500 hover:text-slate-900 text-[11px]"
                  >
                    {copiedKey === "modal-code" ? "✓ Copied" : "Copy Code"}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-slate-100 rounded-xl overflow-x-auto text-[11px] leading-relaxed">
                  <code>{detailModalItem.codeSnippet}</code>
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <a
                href={detailModalItem.registryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-500 hover:text-slate-900 font-mono underline"
              >
                View JSON schema &rarr;
              </a>

              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="cursor-pointer px-4 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-mono font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-200/80 py-8 px-6 text-center text-xs text-slate-400 font-mono bg-white">
        <p>Chromaline · Vibrant line-art components for modern React.</p>
      </footer>
    </div>
  );
}
