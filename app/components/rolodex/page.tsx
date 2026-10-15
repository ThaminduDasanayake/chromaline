"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProjectLibrary } from "@/components/tactile/project-library";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx shadcn@latest add http://localhost:3000/r/tactile-rolodex.json",
  npm: "npx shadcn@latest add http://localhost:3000/r/tactile-rolodex.json",
  yarn: "npx shadcn@latest add http://localhost:3000/r/tactile-rolodex.json",
  bun: "bunx --bun shadcn@latest add http://localhost:3000/r/tactile-rolodex.json",
};

const CODE_EXAMPLE_LINES = [
  { num: 1, parts: [{ text: "import", cls: "text-[#f43f5e]" }, { text: " { " }, { text: "TactileRolodex", cls: "text-slate-900 font-semibold" }, { text: " } " }, { text: "from", cls: "text-[#f43f5e]" }, { text: " \"@/components/ui/tactile-rolodex\"", cls: "text-[#0284c7]" }] },
  { num: 2, parts: [{ text: "" }] },
  { num: 3, parts: [{ text: "export default function", cls: "text-[#f43f5e]" }, { text: " Workspace() {" }] },
  { num: 4, parts: [{ text: "  const", cls: "text-[#f43f5e]" }, { text: " folders = [" }] },
  { num: 5, parts: [{ text: "    { " }, { text: "id", cls: "text-purple-600" }, { text: ": " }, { text: "\"p1\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "name", cls: "text-purple-600" }, { text: ": " }, { text: "\"Project 1\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "bodyColor", cls: "text-purple-600" }, { text: ": " }, { text: "\"#E54F10\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "darkOutline", cls: "text-purple-600" }, { text: ": " }, { text: "\"#7C2D12\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "lightOutline", cls: "text-purple-600" }, { text: ": " }, { text: "\"#FED7AA\"", cls: "text-[#0284c7]" }, { text: " }," }] },
  { num: 6, parts: [{ text: "    { " }, { text: "id", cls: "text-purple-600" }, { text: ": " }, { text: "\"p2\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "name", cls: "text-purple-600" }, { text: ": " }, { text: "\"Project 2\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "bodyColor", cls: "text-purple-600" }, { text: ": " }, { text: "\"#0A90D2\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "darkOutline", cls: "text-purple-600" }, { text: ": " }, { text: "\"#075985\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "lightOutline", cls: "text-purple-600" }, { text: ": " }, { text: "\"#BAE6FD\"", cls: "text-[#0284c7]" }, { text: " }," }] },
  { num: 7, parts: [{ text: "    { " }, { text: "id", cls: "text-purple-600" }, { text: ": " }, { text: "\"p3\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "name", cls: "text-purple-600" }, { text: ": " }, { text: "\"Project 3\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "bodyColor", cls: "text-purple-600" }, { text: ": " }, { text: "\"#53F399\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "darkOutline", cls: "text-purple-600" }, { text: ": " }, { text: "\"#047857\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "lightOutline", cls: "text-purple-600" }, { text: ": " }, { text: "\"#D1FAE5\"", cls: "text-[#0284c7]" }, { text: " }," }] },
  { num: 8, parts: [{ text: "  ];" }] },
  { num: 9, parts: [{ text: "" }] },
  { num: 10, parts: [{ text: "  return", cls: "text-[#f43f5e]" }, { text: " (" }] },
  { num: 11, parts: [{ text: "    <", cls: "text-slate-500" }, { text: "TactileRolodex", cls: "text-[#16a34a] font-semibold" }] },
  { num: 12, parts: [{ text: "      " }, { text: "folders", cls: "text-purple-600" }, { text: "={folders}" }] },
  { num: 13, parts: [{ text: "      " }, { text: "onOpen", cls: "text-purple-600" }, { text: "={(folder) => console.log(folder)}" }] },
  { num: 14, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 15, parts: [{ text: "  );" }] },
  { num: 16, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { TactileRolodex } from "@/components/ui/tactile-rolodex";

export default function Workspace() {
  const folders = [
    { id: "p1", name: "Project 1", bodyColor: "#E54F10", darkOutline: "#7C2D12", lightOutline: "#FED7AA" },
    { id: "p2", name: "Project 2", bodyColor: "#0A90D2", darkOutline: "#075985", lightOutline: "#BAE6FD" },
    { id: "p3", name: "Project 3", bodyColor: "#53F399", darkOutline: "#047857", lightOutline: "#D1FAE5" },
  ];

  return (
    <TactileRolodex
      folders={folders}
      onOpen={(folder) => console.log(folder)}
    />
  );
}`;

export default function RolodexPage() {
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");
  const [installTab, setInstallTab] = useState<"command" | "manual">("command");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-slate-200">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-bold text-sm tracking-tight text-slate-950 font-mono hover:opacity-80 transition-opacity">
            Chromaline
          </Link>
          <span className="text-slate-300 select-none">/</span>
          <span className="text-xs font-mono text-slate-600">Rolodex Tray</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/r/tactile-rolodex.json"
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

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">&larr;</span>
          <span>Back to Components</span>
        </Link>

        {/* Page Title & Badges */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Rolodex Tray
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
              Interactive 3D
            </span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
            An interactive 3D isometric tray of folders with kinematic lean physics, solid folder colorways, and click-to-open dialog callbacks.
          </p>
        </div>

        {/* Live Interactive Stage */}
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden mb-12">
          <div className="p-8 sm:p-12 bg-[#F9FAFB] flex flex-col items-center justify-center min-h-[380px]">
            <ProjectLibrary />
          </div>
        </div>

        {/* Installation Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold tracking-tight text-slate-950 mb-3">
            Installation
          </h2>

          <div className="flex gap-4 border-b border-slate-200 text-sm font-medium mb-3">
            <button
              type="button"
              onClick={() => setInstallTab("command")}
              className={`cursor-pointer pb-2 transition-all ${
                installTab === "command"
                  ? "border-b-2 border-slate-950 text-slate-950 font-semibold"
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
                  ? "border-b-2 border-slate-950 text-slate-950 font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Manual
            </button>
          </div>

          {installTab === "command" ? (
            <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 font-mono text-xs shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 select-none text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100">
                    &gt;_
                  </span>
                  <div className="flex items-center gap-1">
                    {(["pnpm", "npm", "yarn", "bun"] as PackageManager[]).map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setPackageManager(pm)}
                        className={`cursor-pointer px-2 py-0.5 rounded text-[11px] transition-all ${
                          packageManager === pm
                            ? "bg-slate-900 text-white font-semibold"
                            : "text-slate-500 hover:text-slate-800 bg-slate-50"
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
                  className="cursor-pointer p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                  title="Copy command"
                >
                  {copiedKey === "cli-copy" ? (
                    <span className="text-[10px] text-emerald-600 font-medium">Copied!</span>
                  ) : (
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5.25" y="5.25" width="8.5" height="8.5" rx="2" />
                      <path d="M10.75 5.25V4.25a2 2 0 0 0-2-2h-4.5a2 2 0 0 0-2 2v4.5a2 2 0 0 0 2 2h1" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="pt-3 text-[12px] text-slate-800 select-all overflow-x-auto whitespace-nowrap">
                {INSTALL_COMMANDS[packageManager]}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200/90 bg-white p-4 font-mono text-xs space-y-3 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-600 font-sans font-medium text-[12px]">
                  1. Install core dependency:
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("npm i @lucasmarkes/hairline", "manual-dep")}
                  className="cursor-pointer p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  {copiedKey === "manual-dep" ? <span className="text-[10px] text-emerald-600">Copied!</span> : "Copy"}
                </button>
              </div>
              <div className="text-[12px] text-slate-800">npm i @lucasmarkes/hairline</div>
              <div className="pt-2 text-slate-500 text-[11px] font-sans">
                2. Copy component to <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">components/ui/tactile-rolodex.tsx</code>.
              </div>
            </div>
          )}
        </section>

        {/* Usage Code Snippet */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Usage</h2>
            <button
              type="button"
              onClick={() => copyToClipboard(CODE_EXAMPLE_TEXT, "usage-code")}
              className="cursor-pointer text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5"
            >
              <span>{copiedKey === "usage-code" ? "✓ Copied" : "Copy code"}</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-4 font-mono text-xs relative overflow-hidden">
            <div className="space-y-1 overflow-x-auto">
              {CODE_EXAMPLE_LINES.map((line) => (
                <div key={line.num} className="flex items-center">
                  <span className="w-8 shrink-0 text-right pr-4 text-slate-400 select-none text-[11px]">
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
          <h2 className="text-xl font-bold tracking-tight text-slate-950 mb-3">
            Props Reference
          </h2>

          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[11px]">
                  <th className="p-3 font-semibold">Prop</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Default</th>
                  <th className="p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">folders</td>
                  <td className="p-3 text-purple-700">TactileFolder[]</td>
                  <td className="p-3 text-slate-400">required</td>
                  <td className="p-3 font-sans text-slate-600">
                    Array of 1 to 8 folder items. Accepts <code>bodyColor</code>, <code>darkOutline</code>, and <code>lightOutline</code>.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">onOpen</td>
                  <td className="p-3 text-purple-700">(folder) =&gt; void</td>
                  <td className="p-3 text-slate-400">undefined</td>
                  <td className="p-3 font-sans text-slate-600">
                    Callback triggered when any folder is clicked.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">onSelect</td>
                  <td className="p-3 text-purple-700">(folder) =&gt; void</td>
                  <td className="p-3 text-slate-400">undefined</td>
                  <td className="p-3 font-sans text-slate-600">
                    Callback fired whenever folder selection changes on hover or click.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">defaultSelected</td>
                  <td className="p-3 text-purple-700">number</td>
                  <td className="p-3 text-slate-700">0</td>
                  <td className="p-3 font-sans text-slate-600">
                    Index of the initially active front card (0 to 7).
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">intensity</td>
                  <td className="p-3 text-purple-700">number</td>
                  <td className="p-3 text-slate-700">0.65</td>
                  <td className="p-3 font-sans text-slate-600">
                    Kinematic spring lean intensity (0 to 1).
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">className</td>
                  <td className="p-3 text-purple-700">string</td>
                  <td className="p-3 text-slate-700">&quot;&quot;</td>
                  <td className="p-3 font-sans text-slate-600">
                    Optional container styling classes.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 py-8 px-6 text-center text-xs text-slate-400 font-mono bg-white">
        <p>Chromaline · Vibrant line-art components for modern React.</p>
      </footer>
    </div>
  );
}
