"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TactileSingleFolder } from "@/components/ui/tactile-folder";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx shadcn@latest add http://localhost:3000/r/tactile-folder.json",
  npm: "npx shadcn@latest add http://localhost:3000/r/tactile-folder.json",
  yarn: "npx shadcn@latest add http://localhost:3000/r/tactile-folder.json",
  bun: "bunx --bun shadcn@latest add http://localhost:3000/r/tactile-folder.json",
};

const COLOR_PRESETS = [
  { name: "Orange", body: "#E54F10", dark: "#7C2D12", light: "#FED7AA" },
  { name: "Electric Blue", body: "#0A90D2", dark: "#075985", light: "#BAE6FD" },
  { name: "Mint Green", body: "#53F399", dark: "#047857", light: "#D1FAE5" },
  { name: "Violet", body: "#8B5CF6", dark: "#4C1D95", light: "#DDD6FE" },
  { name: "Amber", body: "#F59E0B", dark: "#92400E", light: "#FEF08A" },
  { name: "Rose", body: "#F43F5E", dark: "#881337", light: "#FECDD3" },
];

const CODE_EXAMPLE_LINES = [
  {
    num: 1,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "TactileSingleFolder", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/tactile-folder"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " FolderDemo() {" },
    ],
  },
  { num: 4, parts: [{ text: "  return", cls: "text-[#f43f5e]" }, { text: " (" }] },
  {
    num: 5,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "TactileSingleFolder", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 6,
    parts: [
      { text: "      " },
      { text: "bodyColor", cls: "text-purple-600" },
      { text: '="#E54F10"' },
    ],
  },
  {
    num: 7,
    parts: [
      { text: "      " },
      { text: "darkOutline", cls: "text-purple-600" },
      { text: '="#7C2D12"' },
    ],
  },
  {
    num: 8,
    parts: [
      { text: "      " },
      { text: "lightOutline", cls: "text-purple-600" },
      { text: '="#FED7AA"' },
    ],
  },
  {
    num: 9,
    parts: [
      { text: "      " },
      { text: "tabPosition", cls: "text-purple-600" },
      { text: '="center"' },
    ],
  },
  {
    num: 10,
    parts: [
      { text: "      " },
      { text: "className", cls: "text-purple-600" },
      { text: '="w-56 h-auto"' },
    ],
  },
  { num: 11, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 12, parts: [{ text: "  );" }] },
  { num: 13, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { TactileSingleFolder } from "@/components/ui/tactile-folder";

export default function FolderDemo() {
  return (
    <TactileSingleFolder
      bodyColor="#E54F10"
      darkOutline="#7C2D12"
      lightOutline="#FED7AA"
      tabPosition="center"
      className="w-56 h-auto"
    />
  );
}`;

export default function FolderPage() {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedTabPos, setSelectedTabPos] = useState<"left" | "center" | "right">("center");
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");
  const [installTab, setInstallTab] = useState<"command" | "manual">("command");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const activeColor = COLOR_PRESETS[selectedColorIdx];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md md:px-12">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-mono text-sm font-bold tracking-tight text-slate-950 transition-opacity hover:opacity-80"
          >
            Chromaline
          </Link>
          <span className="text-slate-300 select-none">/</span>
          <span className="font-mono text-xs text-slate-600">Tactile Folder</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/r/tactile-folder.json"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-2.5 py-1 font-mono text-xs text-slate-600 transition-colors hover:text-slate-900"
          >
            Registry JSON
          </a>
          <a
            href="https://github.com/lucasmarkes/hairline"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1 font-mono text-xs text-white transition-colors hover:bg-slate-800"
          >
            <Image src="/github.svg" alt="GitHub" width={14} height={14} className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="group mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 transition-colors hover:text-slate-900"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">&larr;</span>
          <span>Back to Components</span>
        </Link>

        {/* Page Title & Badges */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Tactile Folder</h1>
            <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600">
              2D Vector
            </span>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
            A standalone forward-facing tactile folder card with exact 84×61 vector proportions,
            filleted tabs, 4 ruled lines, and 8 punch dots.
          </p>
        </div>

        {/* Live Interactive Stage with Color & Tab Controls */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="flex min-h-[380px] flex-col items-center justify-center space-y-8 bg-[#F9FAFB] p-8 sm:p-14">
            {/* Folder Graphic */}
            <TactileSingleFolder
              bodyColor={activeColor.body}
              darkOutline={activeColor.dark}
              lightOutline={activeColor.light}
              tabPosition={selectedTabPos}
              className="h-auto w-64 drop-shadow-md transition-all"
            />

            {/* Interactive Control Pill */}
            <div className="flex flex-wrap items-center justify-center gap-5 rounded-2xl border border-slate-200/90 bg-white px-4 py-2.5 font-mono text-xs shadow-xs">
              {/* Color Swatches */}
              <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                <span className="text-[11px] text-slate-400">Color:</span>
                <div className="flex items-center gap-1.5">
                  {COLOR_PRESETS.map((preset, idx) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setSelectedColorIdx(idx)}
                      className={`h-5 w-5 cursor-pointer rounded-full border transition-all ${
                        selectedColorIdx === idx
                          ? "scale-110 ring-2 ring-slate-900"
                          : "opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: preset.body, borderColor: preset.dark }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              {/* Tab Position Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Tab:</span>
                <div className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-100 p-0.5">
                  {(["left", "center", "right"] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setSelectedTabPos(pos)}
                      className={`cursor-pointer rounded px-3 py-1 capitalize transition-all ${
                        selectedTabPos === pos
                          ? "border border-slate-200 bg-white font-semibold text-slate-900 shadow-2xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Section */}
        <section className="mb-12">
          <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-950">Installation</h2>

          <div className="mb-3 flex gap-4 border-b border-slate-200 text-sm font-medium">
            <button
              type="button"
              onClick={() => setInstallTab("command")}
              className={`cursor-pointer pb-2 transition-all ${
                installTab === "command"
                  ? "border-b-2 border-slate-950 font-semibold text-slate-950"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Command
            </button>
            <button
              type="button"
              onClick={() => setInstallTab("manual")}
              className={`cursor-pointer pb-2 transition-all ${
                installTab === "manual"
                  ? "border-b-2 border-slate-950 font-semibold text-slate-950"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Manual
            </button>
          </div>

          {installTab === "command" ? (
            <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 font-mono text-xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-slate-400 select-none">
                    &gt;_
                  </span>
                  <div className="flex items-center gap-1">
                    {(["pnpm", "npm", "yarn", "bun"] as PackageManager[]).map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setPackageManager(pm)}
                        className={`cursor-pointer rounded px-2 py-0.5 text-[11px] transition-all ${
                          packageManager === pm
                            ? "bg-slate-900 font-semibold text-white"
                            : "bg-slate-50 text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(INSTALL_COMMANDS[packageManager], "cli-copy")}
                  className="cursor-pointer rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  title="Copy command"
                >
                  {copiedKey === "cli-copy" ? (
                    <span className="text-[10px] font-medium text-emerald-600">Copied!</span>
                  ) : (
                    <svg
                      viewBox="0 0 16 16"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="5.25" y="5.25" width="8.5" height="8.5" rx="2" />
                      <path d="M10.75 5.25V4.25a2 2 0 0 0-2-2h-4.5a2 2 0 0 0-2 2v4.5a2 2 0 0 0 2 2h1" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="overflow-x-auto pt-3 text-[12px] whitespace-nowrap text-slate-800 select-all">
                {INSTALL_COMMANDS[packageManager]}
              </div>
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-slate-200/90 bg-white p-4 font-mono text-xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-sans text-[12px] font-medium text-slate-600">
                  Manual Installation:
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("components/ui/tactile-folder.tsx", "manual-dep")}
                  className="cursor-pointer rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  {copiedKey === "manual-dep" ? (
                    <span className="text-[10px] text-emerald-600">Copied!</span>
                  ) : (
                    "Copy Path"
                  )}
                </button>
              </div>
              <div className="font-sans text-[11px] text-slate-500">
                Zero dependencies required. Copy the standalone component file to{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-800">
                  components/ui/tactile-folder.tsx
                </code>
                .
              </div>
            </div>
          )}
        </section>

        {/* Usage Code Snippet */}
        <section className="mb-12">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Usage</h2>
            <button
              type="button"
              onClick={() => copyToClipboard(CODE_EXAMPLE_TEXT, "usage-code")}
              className="flex cursor-pointer items-center gap-1.5 font-mono text-xs text-slate-500 transition-colors hover:text-slate-900"
            >
              <span>{copiedKey === "usage-code" ? "✓ Copied" : "Copy code"}</span>
            </button>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-slate-50/80 p-4 font-mono text-xs">
            <div className="space-y-1 overflow-x-auto">
              {CODE_EXAMPLE_LINES.map((line) => (
                <div key={line.num} className="flex items-center">
                  <span className="w-8 shrink-0 pr-4 text-right text-[11px] text-slate-400 select-none">
                    {line.num}
                  </span>
                  <div className="whitespace-pre">
                    {line.parts.map((p, idx) => (
                      <span key={idx} className={p.cls || "text-slate-800"}>
                        {p.text}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Props Reference Table */}
        <section className="mb-16">
          <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-950">Props Reference</h2>

          <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] text-slate-600">
                  <th className="p-3 font-semibold">Prop</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Default</th>
                  <th className="p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">bodyColor</td>
                  <td className="p-3 text-purple-700">string</td>
                  <td className="p-3 text-slate-700">&quot;#E54F10&quot;</td>
                  <td className="p-3 font-sans text-slate-600">
                    Hex fill color for the folder card face.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">darkOutline</td>
                  <td className="p-3 text-purple-700">string</td>
                  <td className="p-3 text-slate-700">&quot;#7C2D12&quot;</td>
                  <td className="p-3 font-sans text-slate-600">
                    Stroke color for the silhouette outline, header line, and active tab dot.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">lightOutline</td>
                  <td className="p-3 text-purple-700">string</td>
                  <td className="p-3 text-slate-700">&quot;#FED7AA&quot;</td>
                  <td className="p-3 font-sans text-slate-600">
                    Stroke color for the 4 ruled lines and inactive punch dots.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">tabPosition</td>
                  <td className="p-3 text-purple-700">
                    &quot;left&quot; | &quot;center&quot; | &quot;right&quot;
                  </td>
                  <td className="p-3 text-slate-700">&quot;center&quot;</td>
                  <td className="p-3 font-sans text-slate-600">
                    Physical horizontal position of the rounded tab on the top edge.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">folderIndex</td>
                  <td className="p-3 text-purple-700">number</td>
                  <td className="p-3 text-slate-700">0</td>
                  <td className="p-3 font-sans text-slate-600">
                    Folder index (0 to 7) to automatically derive tab position and active punch dot.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">className</td>
                  <td className="p-3 text-purple-700">string</td>
                  <td className="p-3 text-slate-700">&quot;w-44 h-auto&quot;</td>
                  <td className="p-3 font-sans text-slate-600">
                    Optional styling and dimension classes for the SVG.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white px-6 py-8 text-center font-mono text-xs text-slate-400">
        <p>Chromaline · Vibrant line-art components for modern React.</p>
      </footer>
    </div>
  );
}
