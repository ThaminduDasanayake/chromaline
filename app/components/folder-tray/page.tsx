"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProjectLibrary } from "@/components/tactile/project-library";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx shadcn@latest add http://localhost:3000/r/folder-tray.json",
  npm: "npx shadcn@latest add http://localhost:3000/r/folder-tray.json",
  yarn: "npx shadcn@latest add http://localhost:3000/r/folder-tray.json",
  bun: "bunx --bun shadcn@latest add http://localhost:3000/r/folder-tray.json",
};

const CODE_EXAMPLE_LINES = [
  {
    num: 1,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "FolderTray", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/folder-tray"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [{ text: "export default function", cls: "text-[#f43f5e]" }, { text: " Workspace() {" }],
  },
  { num: 4, parts: [{ text: "  const", cls: "text-[#f43f5e]" }, { text: " folders = [" }] },
  {
    num: 5,
    parts: [
      { text: "    { " },
      { text: "id", cls: "text-purple-600" },
      { text: ": " },
      { text: '"p1"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "name", cls: "text-purple-600" },
      { text: ": " },
      { text: '"Project 1"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "bodyColor", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#E54F10"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "darkOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#7C2D12"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "lightOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#FED7AA"', cls: "text-[#0284c7]" },
      { text: " }," },
    ],
  },
  {
    num: 6,
    parts: [
      { text: "    { " },
      { text: "id", cls: "text-purple-600" },
      { text: ": " },
      { text: '"p2"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "name", cls: "text-purple-600" },
      { text: ": " },
      { text: '"Project 2"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "bodyColor", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#0A90D2"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "darkOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#075985"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "lightOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#BAE6FD"', cls: "text-[#0284c7]" },
      { text: " }," },
    ],
  },
  {
    num: 7,
    parts: [
      { text: "    { " },
      { text: "id", cls: "text-purple-600" },
      { text: ": " },
      { text: '"p3"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "name", cls: "text-purple-600" },
      { text: ": " },
      { text: '"Project 3"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "bodyColor", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#53F399"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "darkOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#047857"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "lightOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#D1FAE5"', cls: "text-[#0284c7]" },
      { text: " }," },
    ],
  },
  { num: 8, parts: [{ text: "  ];" }] },
  { num: 9, parts: [{ text: "" }] },
  { num: 10, parts: [{ text: "  return", cls: "text-[#f43f5e]" }, { text: " (" }] },
  {
    num: 11,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "FolderTray", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 12,
    parts: [
      { text: "      " },
      { text: "folders", cls: "text-purple-600" },
      { text: "={folders}" },
    ],
  },
  {
    num: 13,
    parts: [
      { text: "      " },
      { text: "onOpen", cls: "text-purple-600" },
      { text: "={(folder) => console.log(folder)}" },
    ],
  },
  { num: 14, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 15, parts: [{ text: "  );" }] },
  { num: 16, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { FolderTray } from "@/components/ui/folder-tray";

export default function Workspace() {
  const folders = [
    { id: "p1", name: "Project 1", bodyColor: "#E54F10", darkOutline: "#7C2D12", lightOutline: "#FED7AA" },
    { id: "p2", name: "Project 2", bodyColor: "#0A90D2", darkOutline: "#075985", lightOutline: "#BAE6FD" },
    { id: "p3", name: "Project 3", bodyColor: "#53F399", darkOutline: "#047857", lightOutline: "#D1FAE5" },
  ];

  return (
    <FolderTray
      folders={folders}
      onOpen={(folder) => console.log(folder)}
    />
  );
};`;

export default function FolderTrayPage() {
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");
  const [installTab, setInstallTab] = useState<"command" | "manual">("command");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200">
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
          <span className="font-mono text-xs text-slate-600">Folder Tray</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/r/folder-tray.json"
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
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="group mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 transition-colors hover:text-slate-900"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">&larr;</span>
          <span>Back to Components</span>
        </Link>

        {/* Page Title & Description */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-950">Folder Tray</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
            An interactive 3D isometric tray of folders with kinematic lean physics, solid folder
            colorways, and click-to-open dialog callbacks.
          </p>
        </div>

        {/* Live Interactive Stage */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="flex min-h-[380px] flex-col items-center justify-center bg-[#F9FAFB] p-8 sm:p-12">
            <ProjectLibrary />
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
              Manual Code
            </button>
          </div>

          {installTab === "command" ? (
            <div>
              {/* Package Manager Selector Tabs */}
              <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-slate-200/90 bg-slate-100 px-4 py-2 font-mono text-xs">
                <div className="flex items-center gap-1">
                  {(["pnpm", "npm", "yarn", "bun"] as const).map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPackageManager(pm)}
                      className={`cursor-pointer rounded px-2.5 py-1 font-mono transition-all ${
                        packageManager === pm
                          ? "bg-white font-semibold text-slate-950 shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(INSTALL_COMMANDS[packageManager], `install-${packageManager}`)
                  }
                  className="cursor-pointer text-slate-500 transition-colors hover:text-slate-900"
                  title="Copy command"
                >
                  {copiedKey === `install-${packageManager}` ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Command Code Snippet Block */}
              <div className="rounded-b-xl border border-slate-200/90 bg-[#1E1E2E] p-4 font-mono text-xs text-slate-100">
                <div className="flex items-center justify-between overflow-x-auto">
                  <code>{INSTALL_COMMANDS[packageManager]}</code>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 font-mono text-xs">
              <div className="rounded-xl border border-slate-200/90 bg-white p-4">
                <p className="mb-2 font-sans font-semibold text-slate-900">
                  1. Install hairline react package
                </p>
                <div className="rounded-lg bg-slate-900 p-3 text-slate-100">
                  <code>pnpm add @lucasmarkes/hairline</code>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-white p-4">
                <p className="mb-2 font-sans font-semibold text-slate-900">
                  2. Copy component to your project
                </p>
                <p className="font-sans text-xs text-slate-500">
                  Save <code>folder-tray.tsx</code> inside your <code>components/ui/</code> folder.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Usage Code Snippet Section */}
        <section className="mb-12">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Usage</h2>
            <button
              type="button"
              onClick={() => copyToClipboard(CODE_EXAMPLE_TEXT, "usage-code")}
              className="cursor-pointer font-mono text-xs text-slate-500 transition-colors hover:text-slate-900"
            >
              {copiedKey === "usage-code" ? "Copied!" : "Copy code"}
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white p-6 font-mono text-xs shadow-2xs">
            <pre className="leading-relaxed">
              <code>
                {CODE_EXAMPLE_LINES.map((line) => (
                  <div key={line.num} className="table-row">
                    <span className="table-cell pr-6 text-right text-slate-300 select-none">
                      {line.num}
                    </span>
                    <span className="table-cell">
                      {line.parts.map((part, idx) => (
                        <span key={idx} className={part.cls || "text-slate-800"}>
                          {part.text}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </section>

        {/* Props Documentation Section */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-950">Props Reference</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <tr>
                  <th className="p-3 font-semibold">Prop</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Default</th>
                  <th className="p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">folders</td>
                  <td className="p-3 text-purple-700">FolderItem[]</td>
                  <td className="p-3 text-slate-400">required</td>
                  <td className="p-3 font-sans text-slate-600">
                    Array of 1 to 8 folder items. Accepts <code>bodyColor</code>,{" "}
                    <code>darkOutline</code>, and <code>lightOutline</code>.
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
      <footer className="mt-auto border-t border-slate-200/80 bg-white px-6 py-8 text-center font-mono text-xs text-slate-400">
        <p>Chromaline · Vibrant line-art components for modern React.</p>
      </footer>
    </div>
  );
}
