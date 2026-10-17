"use client";

import React, { useState } from "react";
import { FolderTrayPreview, LinkFolderTrayPreview } from "@/components/showcase";
import { SiteHeader, SiteFooter } from "@/components/layout";
import { InstallCommandTabs, BackLink } from "@/components/docs";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";

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

const LINK_EXAMPLE_LINES = [
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
    parts: [
      { text: "const", cls: "text-[#f43f5e]" },
      { text: " NAV_LINKS = [" },
    ],
  },
  {
    num: 4,
    parts: [
      { text: "  { " },
      { text: "id", cls: "text-purple-600" },
      { text: ': "home", ' },
      { text: "name", cls: "text-purple-600" },
      { text: ': "Overview", ' },
      { text: "href", cls: "text-purple-600" },
      { text: ': "/", ' },
      { text: "bodyColor", cls: "text-purple-600" },
      { text: ': "#E54F10"' },
      { text: " }," },
    ],
  },
  {
    num: 5,
    parts: [
      { text: "  { " },
      { text: "id", cls: "text-purple-600" },
      { text: ': "button", ' },
      { text: "name", cls: "text-purple-600" },
      { text: ': "Button", ' },
      { text: "href", cls: "text-purple-600" },
      { text: ': "/components/button", ' },
      { text: "bodyColor", cls: "text-purple-600" },
      { text: ': "#0A90D2"' },
      { text: " }," },
    ],
  },
  {
    num: 6,
    parts: [
      { text: "  { " },
      { text: "id", cls: "text-purple-600" },
      { text: ': "folder", ' },
      { text: "name", cls: "text-purple-600" },
      { text: ': "Folder", ' },
      { text: "href", cls: "text-purple-600" },
      { text: ': "/components/folder", ' },
      { text: "bodyColor", cls: "text-purple-600" },
      { text: ': "#53F399"' },
      { text: " }," },
    ],
  },
  {
    num: 7,
    parts: [
      { text: "  { " },
      { text: "id", cls: "text-purple-600" },
      { text: ': "github", ' },
      { text: "name", cls: "text-purple-600" },
      { text: ': "GitHub", ' },
      { text: "href", cls: "text-purple-600" },
      { text: ': "https://github.com", ' },
      { text: "target", cls: "text-purple-600" },
      { text: ': "_blank", ' },
      { text: "bodyColor", cls: "text-purple-600" },
      { text: ': "#F59E0B"' },
      { text: " }," },
    ],
  },
  { num: 8, parts: [{ text: "];" }] },
  { num: 9, parts: [{ text: "" }] },
  {
    num: 10,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " NavDeck() {" },
    ],
  },
  {
    num: 11,
    parts: [
      { text: "  return <", cls: "text-slate-500" },
      { text: "FolderTray", cls: "text-[#16a34a] font-semibold" },
      { text: " " },
      { text: "folders", cls: "text-purple-600" },
      { text: "={NAV_LINKS} />;" },
    ],
  },
  { num: 12, parts: [{ text: "}" }] },
];

const LINK_EXAMPLE_TEXT = `import { FolderTray } from "@/components/ui/folder-tray";

const NAV_LINKS = [
  { id: "home", name: "Overview", href: "/", bodyColor: "#E54F10", darkOutline: "#7C2D12", lightOutline: "#FED7AA" },
  { id: "button", name: "Button", href: "/components/button", bodyColor: "#0A90D2", darkOutline: "#075985", lightOutline: "#BAE6FD" },
  { id: "folder", name: "Folder", href: "/components/folder", bodyColor: "#53F399", darkOutline: "#047857", lightOutline: "#D1FAE5" },
  { id: "github", name: "GitHub", href: "https://github.com", target: "_blank", bodyColor: "#F59E0B", darkOutline: "#92400E", lightOutline: "#FEF08A" },
];

export default function NavDeck() {
  return <FolderTray folders={NAV_LINKS} />;
}`;

export default function FolderTrayPage() {
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
      <SiteHeader breadcrumb="Folder Tray" />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <BackLink />

        {/* Page Title & Description */}
        <div className="mb-6">

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Folder Tray</h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            An interactive 3D isometric tray of folders with kinematic lean physics, solid folder
            colorways, and click-to-open dialog callbacks. Powered by{" "}
            <a
              href="https://hairline.lucasmarkes.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-800 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-950 hover:decoration-slate-900"
            >
              @lucasmarkes/hairline
            </a>
            .
          </p>
        </div>

        {/* Live Interactive Stage */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="relative flex min-h-[380px] flex-col items-center justify-center bg-[#F9FAFB] p-8 sm:p-12">
            <FolderTrayPreview />
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
            <InstallCommandTabs componentName="folder-tray" />
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

        {/* Examples Section */}
        <section className="mb-12">
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Examples</h2>
            <p className="text-sm text-slate-500">
              Interactive patterns demonstrating link navigation and custom workflows.
            </p>
          </div>

          {/* Example 1: Link Navigation Bookmark Deck */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Link Navigation (Bookmark Deck)</h3>
                <p className="text-xs text-slate-500">
                  Each folder accepts an optional <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-700">href</code>. Clicking opens internal routes or external URLs directly, and <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-700">onHover</code> broadcasts live card coordinates for destination docks.
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(LINK_EXAMPLE_TEXT, "link-example-code")}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 font-mono text-xs text-slate-500 transition-colors hover:text-slate-900"
              >
                {copiedKey === "link-example-code" ? (
                  <span className="flex items-center gap-1 font-medium text-emerald-600">
                    <CheckIcon size={13} weight="bold" /> Copied!
                  </span>
                ) : (
                  <>
                    <CopyIcon size={13} />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Interactive Stage */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
              <div className="relative flex min-h-[380px] flex-col items-center justify-center bg-[#F9FAFB] p-8 sm:p-12">
                <LinkFolderTrayPreview />
              </div>
            </div>

            {/* Code Snippet */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white p-6 font-mono text-xs shadow-2xs">
              <pre className="leading-relaxed">
                <code>
                  {LINK_EXAMPLE_LINES.map((line) => (
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
                    <code>darkOutline</code>, <code>lightOutline</code>, <code>href</code>, <code>target</code>, and <code>content</code>.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">onOpen</td>
                  <td className="p-3 text-purple-700">(folder) =&gt; void</td>
                  <td className="p-3 text-slate-400">undefined</td>
                  <td className="p-3 font-sans text-slate-600">
                    Callback triggered when any folder is clicked. If omitted and the folder has an <code>href</code>, automatically navigates to that destination.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">onHover</td>
                  <td className="p-3 text-purple-700">(folder | null) =&gt; void</td>
                  <td className="p-3 text-slate-400">undefined</td>
                  <td className="p-3 font-sans text-slate-600">
                    Callback fired whenever a folder is hovered or scrubbed over in the 3D tray.
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
                  <td className="p-3 font-semibold text-slate-900">variant</td>
                  <td className="p-3 text-purple-700">&quot;color&quot; | &quot;original&quot;</td>
                  <td className="p-3 text-slate-700">&quot;color&quot;</td>
                  <td className="p-3 font-sans text-slate-600">
                    Visual theme: vibrant colored folders or monochrome white line-art.
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
      <SiteFooter />
    </div>
  );
}
