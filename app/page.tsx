"use client";

import { useState } from "react";
import { DocsSidebar } from "@/components/docs-sidebar";
import { ProjectLibrary } from "@/components/tactile/project-library";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx shadcn@latest add http://localhost:3000/r/tactile-rolodex.json",
  npm: "npx shadcn@latest add http://localhost:3000/r/tactile-rolodex.json",
  yarn: "npx shadcn@latest add http://localhost:3000/r/tactile-rolodex.json",
  bun: "bunx --bun shadcn@latest add http://localhost:3000/r/tactile-rolodex.json",
};

const CODE_PREVIEW_LINES = [
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

const CODE_PREVIEW_TEXT = `import { TactileRolodex } from "@/components/ui/tactile-rolodex";

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

const USAGE_IMPORT_LINES = [
  { num: 1, parts: [{ text: "import", cls: "text-[#f43f5e]" }, { text: " {" }] },
  { num: 2, parts: [{ text: "  TactileRolodex,", cls: "text-slate-900 font-semibold" }] },
  { num: 3, parts: [{ text: "  TactileFolder,", cls: "text-slate-900 font-semibold" }] },
  { num: 4, parts: [{ text: "} " }, { text: "from", cls: "text-[#f43f5e]" }, { text: " \"@/components/ui/tactile-rolodex\"", cls: "text-[#0284c7]" }] },
];

const USAGE_IMPORT_TEXT = `import {
  TactileRolodex,
  TactileFolder,
} from "@/components/ui/tactile-rolodex"`;

const USAGE_JSX_LINES = [
  { num: 1, parts: [{ text: "<", cls: "text-slate-500" }, { text: "TactileRolodex", cls: "text-[#16a34a] font-semibold" }] },
  { num: 2, parts: [{ text: "  " }, { text: "folders", cls: "text-purple-600" }, { text: "={[" }] },
  { num: 3, parts: [{ text: "    { " }, { text: "id", cls: "text-purple-600" }, { text: ": " }, { text: "\"1\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "name", cls: "text-purple-600" }, { text: ": " }, { text: "\"Project 1\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "bodyColor", cls: "text-purple-600" }, { text: ": " }, { text: "\"#E54F10\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "darkOutline", cls: "text-purple-600" }, { text: ": " }, { text: "\"#7C2D12\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "lightOutline", cls: "text-purple-600" }, { text: ": " }, { text: "\"#FED7AA\"", cls: "text-[#0284c7]" }, { text: " }," }] },
  { num: 4, parts: [{ text: "    { " }, { text: "id", cls: "text-purple-600" }, { text: ": " }, { text: "\"2\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "name", cls: "text-purple-600" }, { text: ": " }, { text: "\"Project 2\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "bodyColor", cls: "text-purple-600" }, { text: ": " }, { text: "\"#0A90D2\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "darkOutline", cls: "text-purple-600" }, { text: ": " }, { text: "\"#075985\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "lightOutline", cls: "text-purple-600" }, { text: ": " }, { text: "\"#BAE6FD\"", cls: "text-[#0284c7]" }, { text: " }," }] },
  { num: 5, parts: [{ text: "    { " }, { text: "id", cls: "text-purple-600" }, { text: ": " }, { text: "\"3\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "name", cls: "text-purple-600" }, { text: ": " }, { text: "\"Project 3\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "bodyColor", cls: "text-purple-600" }, { text: ": " }, { text: "\"#53F399\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "darkOutline", cls: "text-purple-600" }, { text: ": " }, { text: "\"#047857\"", cls: "text-[#0284c7]" }, { text: ", " }, { text: "lightOutline", cls: "text-purple-600" }, { text: ": " }, { text: "\"#D1FAE5\"", cls: "text-[#0284c7]" }, { text: " }," }] },
  { num: 6, parts: [{ text: "  ]}" }] },
  { num: 7, parts: [{ text: "  " }, { text: "onOpen", cls: "text-purple-600" }, { text: "={(folder) => console.log(\"Open folder\", folder.name)}" }] },
  { num: 8, parts: [{ text: "/>", cls: "text-slate-500" }] },
];

const USAGE_JSX_TEXT = `<TactileRolodex
  folders={[
    { id: "1", name: "Project 1", bodyColor: "#E54F10", darkOutline: "#7C2D12", lightOutline: "#FED7AA" },
    { id: "2", name: "Project 2", bodyColor: "#0A90D2", darkOutline: "#075985", lightOutline: "#BAE6FD" },
    { id: "3", name: "Project 3", bodyColor: "#53F399", darkOutline: "#047857", lightOutline: "#D1FAE5" },
  ]}
  onOpen={(folder) => console.log("Open folder", folder.name)}
/>`;

export default function ComponentLibraryPage() {
  const [activeSection, setActiveSection] = useState<string>("rolodex");
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [installTab, setInstallTab] = useState<"command" | "manual">("command");
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 h-14 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm tracking-tight text-slate-950 font-mono">
            Chromaline
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
            v0.1.0
          </span>
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

      {/* Main Layout */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 flex gap-12 items-start bg-white">
        {/* Left Sidebar */}
        <DocsSidebar
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
        />

        {/* Content Column */}
        <main className="flex-1 min-w-0 max-w-3xl bg-white pb-24">
          {/* Component Header */}
          <header className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
              Rolodex
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Interactive 3D isometric folder rolodex with custom solid colors and click-to-open callbacks.
            </p>
          </header>

          {/* 1. COMPONENT PREVIEW WITH BASIC CODE UNDERNEATH (SCREENSHOT 1) */}
          <section id="rolodex" className="mb-12 scroll-mt-20">
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
              {/* Component Preview Container */}
              <div className="p-8 md:p-12 bg-white flex flex-col items-center justify-center min-h-[380px]">
                <ProjectLibrary />
              </div>

              {/* Code Preview Underneath Component (Screenshot 1 Layout) */}
              <div className="border-t border-slate-200/90 bg-slate-50/60 p-4 font-mono text-xs relative">
                <div
                  className={`transition-all duration-200 overflow-hidden ${
                    isCodeExpanded ? "max-h-[600px]" : "max-h-20"
                  }`}
                >
                  <div className="space-y-1">
                    {(isCodeExpanded ? CODE_PREVIEW_LINES : CODE_PREVIEW_LINES.slice(0, 3)).map((line) => (
                      <div key={line.num} className="flex items-center">
                        <span className="w-8 shrink-0 text-right pr-4 text-slate-400 select-none text-[11px]">
                          {line.num}
                        </span>
                        <div className="text-slate-800">
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

                {/* Collapsed Fade Overlay & View Code Pill */}
                {!isCodeExpanded ? (
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-50/95 via-slate-50/80 to-transparent flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setIsCodeExpanded(true)}
                      className="px-4 py-1.5 rounded-md border border-slate-200 bg-white shadow-xs text-xs font-medium text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                    >
                      View Code
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(CODE_PREVIEW_TEXT, "preview-code")}
                      className="cursor-pointer text-[11px] text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5"
                    >
                      <span>{copiedKey === "preview-code" ? "✓ Copied" : "Copy full code"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCodeExpanded(false)}
                      className="cursor-pointer px-3 py-1 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-800 hover:bg-slate-50 shadow-2xs transition-all"
                    >
                      Collapse Code
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 2. INSTALLATION SECTION (SCREENSHOT 2) */}
          <section id="installation" className="mb-12 scroll-mt-20">
            <h2 className="text-xl font-bold tracking-tight text-slate-950 mb-3">
              Installation
            </h2>

            {/* Command / Manual Tabs */}
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
              /* Command Box with Package Manager Switcher (Screenshot 2) */
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 font-mono text-xs">
                {/* Header row with >_ icon, package manager buttons, and copy icon button */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    {/* Terminal Prompt Icon */}
                    <span className="text-slate-400 select-none text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-200/50">
                      &gt;_
                    </span>

                    {/* Package Manager Buttons */}
                    <div className="flex items-center gap-1">
                      {(["pnpm", "npm", "yarn", "bun"] as PackageManager[]).map((pm) => (
                        <button
                          key={pm}
                          type="button"
                          onClick={() => setPackageManager(pm)}
                          className={`cursor-pointer px-2 py-0.5 rounded text-[11px] transition-all ${
                            packageManager === pm
                              ? "bg-white text-slate-950 font-semibold shadow-2xs border border-slate-200/80"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {pm}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Copy Button Icon */}
                  <button
                    type="button"
                    onClick={() => copyToClipboard(INSTALL_COMMANDS[packageManager], "install-cli")}
                    className="cursor-pointer p-1 rounded hover:bg-slate-200/60 text-slate-500 hover:text-slate-900 transition-colors"
                    title="Copy command"
                  >
                    {copiedKey === "install-cli" ? (
                      <span className="text-[10px] text-emerald-600 font-medium">Copied!</span>
                    ) : (
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="5.25" y="5.25" width="8.5" height="8.5" rx="2" />
                        <path d="M10.75 5.25V4.25a2 2 0 0 0-2-2h-4.5a2 2 0 0 0-2 2v4.5a2 2 0 0 0 2 2h1" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Command Text */}
                <div className="pt-3 text-[12px] text-slate-800 select-all overflow-x-auto whitespace-nowrap">
                  {INSTALL_COMMANDS[packageManager]}
                </div>
              </div>
            ) : (
              /* Manual Installation Instructions */
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-slate-600 font-sans font-medium text-[12px]">
                    1. Install core dependency:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("npm i @lucasmarkes/hairline", "manual-dep")}
                    className="cursor-pointer p-1 rounded hover:bg-slate-200/60 text-slate-500 hover:text-slate-900"
                  >
                    {copiedKey === "manual-dep" ? <span className="text-[10px] text-emerald-600">Copied!</span> : "Copy"}
                  </button>
                </div>
                <div className="text-[12px] text-slate-800">
                  npm i @lucasmarkes/hairline
                </div>
                <div className="pt-2 text-slate-500 text-[11px] font-sans">
                  2. Component code is generated at <code className="bg-slate-200/60 px-1 py-0.5 rounded text-slate-800 font-mono">components/ui/tactile-rolodex.tsx</code>.
                </div>
              </div>
            )}
          </section>

          {/* 3. USAGE SECTION (SCREENSHOT 2) */}
          <section id="usage" className="mb-12 scroll-mt-20">
            <h2 className="text-xl font-bold tracking-tight text-slate-950 mb-3">
              Usage
            </h2>

            <div className="space-y-4">
              {/* Import Block with Line Numbers & Copy Button (Screenshot 2) */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 font-mono text-xs relative">
                {/* Top Right Copy Button */}
                <button
                  type="button"
                  onClick={() => copyToClipboard(USAGE_IMPORT_TEXT, "usage-import")}
                  className="cursor-pointer absolute top-3 right-3 p-1 rounded hover:bg-slate-200/60 text-slate-500 hover:text-slate-900 transition-colors"
                  title="Copy import"
                >
                  {copiedKey === "usage-import" ? (
                    <span className="text-[10px] text-emerald-600 font-medium">Copied!</span>
                  ) : (
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5.25" y="5.25" width="8.5" height="8.5" rx="2" />
                      <path d="M10.75 5.25V4.25a2 2 0 0 0-2-2h-4.5a2 2 0 0 0-2 2v4.5a2 2 0 0 0 2 2h1" />
                    </svg>
                  )}
                </button>

                {/* Line numbered import code */}
                <div className="space-y-1">
                  {USAGE_IMPORT_LINES.map((line) => (
                    <div key={line.num} className="flex items-center">
                      <span className="w-6 shrink-0 text-right pr-4 text-slate-400 select-none text-[11px]">
                        {line.num}
                      </span>
                      <div>
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

              {/* Component JSX Usage with Line Numbers & Copy Button (Screenshot 2) */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 font-mono text-xs relative">
                {/* Top Right Copy Button */}
                <button
                  type="button"
                  onClick={() => copyToClipboard(USAGE_JSX_TEXT, "usage-jsx")}
                  className="cursor-pointer absolute top-3 right-3 p-1 rounded hover:bg-slate-200/60 text-slate-500 hover:text-slate-900 transition-colors"
                  title="Copy JSX code"
                >
                  {copiedKey === "usage-jsx" ? (
                    <span className="text-[10px] text-emerald-600 font-medium">Copied!</span>
                  ) : (
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5.25" y="5.25" width="8.5" height="8.5" rx="2" />
                      <path d="M10.75 5.25V4.25a2 2 0 0 0-2-2h-4.5a2 2 0 0 0-2 2v4.5a2 2 0 0 0 2 2h1" />
                    </svg>
                  )}
                </button>

                {/* Line numbered JSX code */}
                <div className="space-y-1 overflow-x-auto">
                  {USAGE_JSX_LINES.map((line) => (
                    <div key={line.num} className="flex items-center">
                      <span className="w-6 shrink-0 text-right pr-4 text-slate-400 select-none text-[11px]">
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
            </div>
          </section>

          {/* 4. PROPS REFERENCE TABLE */}
          <section id="props" className="mb-14 scroll-mt-20">
            <h2 className="text-xl font-bold tracking-tight text-slate-950 mb-3">
              Props Reference
            </h2>

            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
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
                      Array of 1 to 8 folder items. Each folder accepts 3 colors:
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] font-mono text-slate-500">
                        <li><strong className="text-slate-800">bodyColor</strong>: Hex string for folder paper body fill (default: <code className="text-[#E54F10]">#E54F10</code>)</li>
                        <li><strong className="text-slate-800">darkOutline</strong>: Hex string for silhouette, tab line &amp; active dot (default: <code className="text-[#7C2D12]">#7C2D12</code>)</li>
                        <li><strong className="text-slate-800">lightOutline</strong>: Hex string for 5 ruled lines, inactive dots &amp; back (default: <code className="text-[#FED7AA]">#FED7AA</code>)</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">onOpen</td>
                    <td className="p-3 text-purple-700">(folder) =&gt; void</td>
                    <td className="p-3 text-slate-400">undefined</td>
                    <td className="p-3 font-sans text-slate-600">Triggered when any folder is clicked.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">onSelect</td>
                    <td className="p-3 text-purple-700">(folder) =&gt; void</td>
                    <td className="p-3 text-slate-400">undefined</td>
                    <td className="p-3 font-sans text-slate-600">Fired whenever folder selection changes.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">defaultSelected</td>
                    <td className="p-3 text-purple-700">number</td>
                    <td className="p-3">0</td>
                    <td className="p-3 font-sans text-slate-600">Index of the initially active card (0 to 7).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">intensity</td>
                    <td className="p-3 text-purple-700">number</td>
                    <td className="p-3">0.65</td>
                    <td className="p-3 font-sans text-slate-600">Kinematic spring lean intensity (0 to 1).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">className</td>
                    <td className="p-3 text-purple-700">string</td>
                    <td className="p-3">&quot;&quot;</td>
                    <td className="p-3 font-sans text-slate-600">Optional Tailwind CSS container classes.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-400 font-mono bg-white">
        <p>Chromaline · Vibrant line-art components for Next.js and React.</p>
      </footer>
    </div>
  );
}
