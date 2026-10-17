"use client";

import React, { useState } from "react";
import { Seek } from "@/components/ui/seek";
import { SelectBar } from "@/components/ui/select-bar";
import { SiteHeader, SiteFooter } from "@/components/layout";
import { InstallCommandTabs, BackLink } from "@/components/docs";
import { CopyIcon, CheckIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

const CODE_EXAMPLE_LINES = [
  {
    num: 1,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "Seek", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/seek"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " SearchDemo() {" },
    ],
  },
  {
    num: 4,
    parts: [
      { text: "  const [query, setQuery] = useState(" },
      { text: '""', cls: "text-[#0284c7]" },
      { text: ");" },
    ],
  },
  { num: 5, parts: [{ text: "" }] },
  { num: 6, parts: [{ text: "  return (" }] },
  {
    num: 7,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "Seek", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 8,
    parts: [
      { text: "      value={query}" },
    ],
  },
  {
    num: 9,
    parts: [
      { text: "      onChange={setQuery}" },
    ],
  },
  {
    num: 10,
    parts: [
      { text: '      placeholder="Search components..."' },
    ],
  },
  {
    num: 11,
    parts: [
      { text: '      size="default"' },
    ],
  },
  {
    num: 12,
    parts: [
      { text: "      give={50}" },
    ],
  },
  {
    num: 13,
    parts: [
      { text: "      spring={50}" },
    ],
  },
  {
    num: 14,
    parts: [
      { text: "    />", cls: "text-slate-500" },
    ],
  },
  { num: 15, parts: [{ text: "  );" }] },
  { num: 16, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { useState } from "react";
import { Seek } from "@/components/ui/seek";

export default function SearchDemo() {
  const [query, setQuery] = useState("");

  return (
    <Seek
      value={query}
      onChange={setQuery}
      placeholder="Search components..."
      size="default"
      give={50}
      spring={50}
    />
  );
}`;

const PROPS_DATA = [
  {
    name: "value",
    type: "string",
    default: "undefined",
    desc: "Controlled text value of the search field.",
  },
  {
    name: "defaultValue",
    type: "string",
    default: '""',
    desc: "Initial uncontrolled text value.",
  },
  {
    name: "onChange",
    type: "(value: string) => void",
    default: "undefined",
    desc: "Callback fired whenever the search input value changes.",
  },
  {
    name: "onSearch",
    type: "(value: string) => void",
    default: "undefined",
    desc: "Callback fired when the user presses Enter.",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    default: "undefined",
    desc: "Callback fired when the search box expands or collapses.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Search"',
    desc: "Placeholder text rendered inside the expanded field.",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    desc: "Size variant: sm (44px), default (56px), or lg (64px).",
  },
  {
    name: "width",
    type: "number",
    default: "280 (or 240 snug)",
    desc: "Target width in pixels when expanded.",
  },
  {
    name: "give",
    type: "number",
    default: "50",
    desc: "Cursor magnetic pull intensity when hovering nearby (0..100).",
  },
  {
    name: "spring",
    type: "number",
    default: "50",
    desc: "Spring kinematics overshoot and settling damping tuning (0..100).",
  },
  {
    name: "corner",
    type: "number",
    default: "height / 2",
    desc: "Border radius of the pill container.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: "Whether the search input is disabled.",
  },
];

export default function SeekDocumentationPage() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copiedCode, setCopiedCode] = useState(false);

  // Playground state
  const [size, setSize] = useState<"sm" | "default" | "lg">("default");
  const [give, setGive] = useState(50);
  const [spring, setSpring] = useState(50);
  const [searchVal, setSearchVal] = useState("");

  // Example 2 state
  const [compactVal, setCompactVal] = useState("");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLE_TEXT);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 md:px-8">
        {/* Back Link */}
        <BackLink />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <MagnifyingGlassIcon size={14} weight="bold" />
            <span>Components</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Seek
          </h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            A search icon that becomes a search field as one single continuous object. Features
            tactile yield on press, rAF spring expansion, cursor magnetic pull, and typing feedback.
          </p>
        </div>

        {/* Installation Section */}
        <div className="mb-10">
          <InstallCommandTabs componentName="seek" />
        </div>

        {/* Interactive Playground Canvas */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          {/* Canvas Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === "preview"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("code")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === "code"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Code
              </button>
            </div>

            {activeTab === "code" && (
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                {copiedCode ? (
                  <>
                    <CheckIcon size={13} weight="bold" className="text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size={13} weight="bold" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Interactive Preview Canvas */}
          {activeTab === "preview" ? (
            <div className="relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden bg-[#F9FAFB] p-8">
              <Seek
                size={size}
                give={give}
                spring={spring}
                value={searchVal}
                onChange={setSearchVal}
                placeholder="Search components..."
              />

              <p className="mt-6 text-xs text-slate-400">
                Click circle to expand · Hover nearby to test magnetic lean
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-[#F9FAFB] p-6 font-mono text-xs leading-relaxed text-slate-800">
              <pre className="m-0 p-0">
                <code>
                  {CODE_EXAMPLE_LINES.map((line) => (
                    <div key={line.num} className="table-row">
                      <span className="table-cell select-none pr-6 text-right text-slate-400">
                        {line.num}
                      </span>
                      <span className="table-cell">
                        {line.parts.map((p, idx) => (
                          <span key={idx} className={p.cls || "text-slate-800"}>
                            {p.text}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          )}

          {/* Playground Controls Footer */}
          <div className="grid grid-cols-1 gap-6 border-t border-slate-100 bg-white p-5 sm:grid-cols-3 sm:p-6">
            {/* Size control */}
            <div>
              <label className="text-xs font-semibold text-slate-900">Size</label>
              <div className="mt-2.5">
                <SelectBar<"sm" | "default" | "lg">
                  size="xs"
                  items={[
                    { key: "sm", label: "SM" },
                    { key: "default", label: "MD" },
                    { key: "lg", label: "LG" },
                  ]}
                  value={size}
                  onChange={setSize}
                />
              </div>
            </div>

            {/* Give (Magnet Pull) */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900">Magnetic Give</label>
                <span className="font-mono text-xs text-slate-500">{give}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={give}
                onChange={(e) => setGive(Number(e.target.value))}
                className="isocraft-slider mt-3.5"
              />
            </div>

            {/* Spring Settling */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900">Spring Kinematics</label>
                <span className="font-mono text-xs text-slate-500">{spring}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={spring}
                onChange={(e) => setSpring(Number(e.target.value))}
                className="isocraft-slider mt-3.5"
              />
            </div>
          </div>
        </div>

        {/* Examples Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Examples
          </h2>

          {/* Example 1: Header Toolbar Dock */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-900">Header Toolbar (Compact)</h3>
              <p className="mt-1 text-xs text-slate-500">
                Sized at <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px]">size=&quot;sm&quot;</code> (44px), ideal for fixed topbars and docking next to navigation links.
              </p>
            </div>
            <div className="flex min-h-[160px] items-center justify-center bg-[#F9FAFB] p-6">
              <Seek
                size="sm"
                placeholder="Quick find..."
                value={compactVal}
                onChange={setCompactVal}
              />
            </div>
          </div>
        </div>

        {/* Props Reference Table */}
        <div className="mb-16">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Props</h2>
          <p className="mt-1 text-xs text-slate-500">
            TypeScript properties available on the <code className="font-mono">Seek</code> component.
          </p>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 font-semibold text-slate-900">Prop</th>
                  <th className="px-5 py-3 font-semibold text-slate-900">Type</th>
                  <th className="px-5 py-3 font-semibold text-slate-900">Default</th>
                  <th className="px-5 py-3 font-semibold text-slate-900">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PROPS_DATA.map((p) => (
                  <tr key={p.name} className="hover:bg-slate-50/40">
                    <td className="px-5 py-3 font-mono font-medium text-slate-900">{p.name}</td>
                    <td className="px-5 py-3 font-mono text-purple-700">{p.type}</td>
                    <td className="px-5 py-3 font-mono text-slate-500">{p.default}</td>
                    <td className="px-5 py-3 leading-relaxed text-slate-600">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
