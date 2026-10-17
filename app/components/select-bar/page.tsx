"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SelectBar, SelectBarItem } from "@/components/ui/select-bar";
import { SiteHeader, SiteFooter } from "@/components/layout";
import { InstallCommandTabs } from "@/components/docs";
import {
  CodeIcon,
  EyeIcon,
  PaintBrushIcon,
  SparkleIcon,
  CopyIcon,
  CheckIcon,
} from "@phosphor-icons/react";

const CODE_EXAMPLE_LINES = [
  {
    num: 1,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "SelectBar", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/select-bar"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "const", cls: "text-[#f43f5e]" },
      { text: " TABS = [" },
    ],
  },
  {
    num: 4,
    parts: [
      { text: '  { key: "design", label: "Design" },' },
    ],
  },
  {
    num: 5,
    parts: [
      { text: '  { key: "code", label: "Code" },' },
    ],
  },
  {
    num: 6,
    parts: [
      { text: '  { key: "preview", label: "Preview" },' },
    ],
  },
  {
    num: 7,
    parts: [
      { text: '  { key: "export", label: "Export" },' },
    ],
  },
  { num: 8, parts: [{ text: "];" }] },
  { num: 9, parts: [{ text: "" }] },
  {
    num: 10,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " Demo() {" },
    ],
  },
  {
    num: 11,
    parts: [
      { text: "  const [active, setActive] = useState(" },
      { text: '"design"', cls: "text-[#0284c7]" },
      { text: ");" },
    ],
  },
  { num: 12, parts: [{ text: "  return (" }] },
  {
    num: 13,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "SelectBar", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 14,
    parts: [
      { text: "      items={TABS}" },
    ],
  },
  {
    num: 15,
    parts: [
      { text: "      value={active}" },
    ],
  },
  {
    num: 16,
    parts: [
      { text: "      onChange={setActive}" },
    ],
  },
  {
    num: 17,
    parts: [
      { text: '      size="sm"' },
    ],
  },
  {
    num: 18,
    parts: [
      { text: '      variant="glass"' },
    ],
  },
  {
    num: 19,
    parts: [
      { text: "    />", cls: "text-slate-500" },
    ],
  },
  { num: 20, parts: [{ text: "  );" }] },
  { num: 21, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { useState } from "react";
import { SelectBar } from "@/components/ui/select-bar";

const TABS = [
  { key: "design", label: "Design" },
  { key: "code", label: "Code" },
  { key: "preview", label: "Preview" },
  { key: "export", label: "Export" },
];

export default function Demo() {
  const [active, setActive] = useState("design");

  return (
    <SelectBar
      items={TABS}
      value={active}
      onChange={setActive}
      size="sm"
      variant="glass"
    />
  );
}`;

const PROPS_DATA = [
  {
    prop: "items",
    type: "SelectBarItem<T>[]",
    default: "[]",
    desc: "Array of items with key, label, optional color swatch, and optional icon.",
  },
  {
    prop: "value",
    type: "T",
    default: "undefined",
    desc: "Controlled active selected key. Automatically glides indicator when updated.",
  },
  {
    prop: "defaultValue",
    type: "T",
    default: "items[0]?.key",
    desc: "Uncontrolled initial active key.",
  },
  {
    prop: "onChange",
    type: "(value: T) => void",
    default: "undefined",
    desc: "Callback fired when a slot is clicked with the newly selected key.",
  },
  {
    prop: "variant",
    type: '"glass" | "swatches" | "pill"',
    default: '"glass"',
    desc: "Visual theme: frosted glass with specular edge rim, color swatches, or minimal pill.",
  },
  {
    prop: "size",
    type: '"xs" | "sm" | "default"',
    default: '"sm"',
    desc: "Height and horizontal padding dimensions of the track and slots.",
  },
  {
    prop: "axis",
    type: '"row" | "column"',
    default: '"row"',
    desc: "Layout orientation: horizontal row or vertical column.",
  },
  {
    prop: "dilate",
    type: "number (0..100)",
    default: "100",
    desc: "Kinetic stretch dilation: 0 = pure slide, 100 = full mercury elongation between slots.",
  },
  {
    prop: "bounce",
    type: "number (0..100)",
    default: "50",
    desc: "Elastic landing overshoot amount applied via cubic-bezier curve calculation.",
  },
  {
    prop: "speed",
    type: "number (0..100)",
    default: "50",
    desc: "Animation speed multiplier tuning both the stretch phase and settle phase clock.",
  },
  {
    prop: "hug",
    type: "number",
    default: "3 | 4 | 6 (by size/variant)",
    desc: "Inset padding in pixels around the slot track.",
  },
  {
    prop: "corner",
    type: "number",
    default: "999 (full pill)",
    desc: "Custom corner border radius in pixels.",
  },
  {
    prop: "className",
    type: "string",
    default: '""',
    desc: "Additional CSS classes applied to the root <nav> track element.",
  },
  {
    prop: "ariaLabel",
    type: "string",
    default: '"Main"',
    desc: "Accessible label assigned to the navigation element.",
  },
];

const TAB_OPTIONS: SelectBarItem<string>[] = [
  { key: "design", label: "Design", icon: <PaintBrushIcon size={14} weight="bold" /> },
  { key: "code", label: "Code", icon: <CodeIcon size={14} weight="bold" /> },
  { key: "preview", label: "Preview", icon: <EyeIcon size={14} weight="bold" /> },
  { key: "motion", label: "Motion", icon: <SparkleIcon size={14} weight="bold" /> },
];

const SWATCH_OPTIONS: SelectBarItem<string>[] = [
  { key: "original", label: "White", color: "#FFFFFF", darkOutline: "#232327" },
  { key: "orange", label: "Orange", color: "#E54F10", darkOutline: "#7C2D12" },
  { key: "blue", label: "Blue", color: "#0A90D2", darkOutline: "#075985" },
  { key: "emerald", label: "Emerald", color: "#059669", darkOutline: "#047857" },
  { key: "violet", label: "Violet", color: "#8B5CF6", darkOutline: "#4C1D95" },
  { key: "amber", label: "Amber", color: "#F59E0B", darkOutline: "#92400E" },
];

export default function SelectBarPage() {
  const [activeTab, setActiveTab] = useState("design");
  const [activeSwatch, setActiveSwatch] = useState("orange");

  const [mode, setMode] = useState<"tabs" | "swatches">("tabs");
  const [variant, setVariant] = useState<"glass" | "swatches" | "pill">("glass");
  const [size, setSize] = useState<"xs" | "sm" | "default">("sm");
  const [axis, setAxis] = useState<"row" | "column">("row");
  const [dilate, setDilate] = useState(100);
  const [bounce, setBounce] = useState(50);
  const [speed, setSpeed] = useState(50);

  const [installTab, setInstallTab] = useState<"command" | "manual">("command");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const currentItems = mode === "tabs" ? TAB_OPTIONS : SWATCH_OPTIONS;
  const currentValue = mode === "tabs" ? activeTab : activeSwatch;
  const handleValueChange = (k: string) => {
    if (mode === "tabs") setActiveTab(k);
    else setActiveSwatch(k);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200">
      {/* Top Header Navbar */}
      <SiteHeader breadcrumb="Select Bar" />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 transition-colors hover:text-slate-950"
        >
          <span>&larr;</span> Back to Components
        </Link>

        {/* Page Title & Intro */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Select Bar
            </h1>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-medium text-slate-600">
              v0.1.0
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            An elastic kinetic segmented pill and color swatch selector engineered with two-phase
            mercury stretch dilation and overshoot landing kinematics.
          </p>
        </div>

        {/* Interactive Preview Canvas */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          {/* Canvas Area */}
          <div className="relative flex min-h-[300px] flex-col items-center justify-center bg-[#F9FAFB] p-8 sm:p-12">
            <div className="flex flex-col items-center gap-6">
              <SelectBar
                key={`${mode}-${axis}-${size}-${variant}`}
                items={currentItems}
                value={currentValue}
                onChange={handleValueChange}
                variant={mode === "swatches" ? "swatches" : variant}
                size={size}
                axis={axis}
                dilate={dilate}
                bounce={bounce}
                speed={speed}
                ariaLabel="Interactive playground selector"
              />

              <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 font-mono text-[11px] text-slate-500 shadow-2xs">
                <span>Selected:</span>
                <span className="font-semibold text-slate-950">{currentValue}</span>
              </div>
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="space-y-3.5 border-t border-slate-100 bg-white px-5 py-4 font-mono text-xs">
            {/* Top Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Content Type Picker */}
                <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                  <span className="text-[11px] text-slate-400">Content:</span>
                  <SelectBar<"tabs" | "swatches">
                    size="xs"
                    items={[
                      { key: "tabs", label: "Pills" },
                      { key: "swatches", label: "Swatches" },
                    ]}
                    value={mode}
                    onChange={(m) => {
                      setMode(m);
                      if (m === "swatches") setVariant("swatches");
                      else if (variant === "swatches") setVariant("glass");
                    }}
                    ariaLabel="Select content type"
                  />
                </div>

                {/* Variant Picker (when in tabs mode) */}
                {mode === "tabs" && (
                  <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                    <span className="text-[11px] text-slate-400">Variant:</span>
                    <SelectBar<"glass" | "pill">
                      size="xs"
                      items={[
                        { key: "glass", label: "Glass" },
                        { key: "pill", label: "Pill" },
                      ]}
                      value={variant === "swatches" ? "glass" : variant}
                      onChange={setVariant}
                      ariaLabel="Select visual variant"
                    />
                  </div>
                )}

                {/* Size Picker */}
                <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                  <span className="text-[11px] text-slate-400">Size:</span>
                  <SelectBar<"xs" | "sm" | "default">
                    size="xs"
                    items={[
                      { key: "xs", label: "XS" },
                      { key: "sm", label: "SM" },
                      { key: "default", label: "MD" },
                    ]}
                    value={size}
                    onChange={setSize}
                    ariaLabel="Select size"
                  />
                </div>

                {/* Axis Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Axis:</span>
                  <SelectBar<"row" | "column">
                    size="xs"
                    items={[
                      { key: "row", label: "Row" },
                      { key: "column", label: "Column" },
                    ]}
                    value={axis}
                    onChange={setAxis}
                    ariaLabel="Select orientation axis"
                  />
                </div>
              </div>
            </div>

            {/* Kinetic Tuning Sliders */}
            <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-3 sm:grid-cols-3">
              {/* Dilate Slider */}
              <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-[11px] text-slate-500">Dilate ({dilate}%)</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dilate}
                  onChange={(e) => setDilate(Number(e.target.value))}
                  className="h-1.5 w-24 cursor-pointer accent-slate-900"
                />
              </div>

              {/* Bounce Slider */}
              <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-[11px] text-slate-500">Bounce ({bounce}%)</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bounce}
                  onChange={(e) => setBounce(Number(e.target.value))}
                  className="h-1.5 w-24 cursor-pointer accent-slate-900"
                />
              </div>

              {/* Speed Slider */}
              <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-[11px] text-slate-500">Speed ({speed}%)</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="h-1.5 w-24 cursor-pointer accent-slate-900"
                />
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
            <InstallCommandTabs componentName="select-bar" />
          ) : (
            <div className="space-y-3 rounded-xl border border-slate-200/90 bg-white p-4 font-mono text-xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-sans text-[12px] font-medium text-slate-600">
                  Copy code into <code className="text-slate-900">components/ui/select-bar.tsx</code>
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(CODE_EXAMPLE_TEXT, "manual-copy")}
                  className="cursor-pointer rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  title="Copy code"
                >
                  {copiedKey === "manual-copy" ? (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                      <CheckIcon size={13} weight="bold" /> Copied!
                    </span>
                  ) : (
                    <CopyIcon size={14} />
                  )}
                </button>
              </div>
              <p className="font-sans text-xs text-slate-500">
                Save <code className="font-mono text-slate-900">select-bar.tsx</code> inside your{" "}
                <code className="font-mono text-slate-900">components/ui/</code> folder.
              </p>
            </div>
          )}
        </section>

        {/* Code Example Section */}
        <section className="mb-12">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Usage</h2>
            <button
              type="button"
              onClick={() => copyToClipboard(CODE_EXAMPLE_TEXT, "usage-copy")}
              className="flex cursor-pointer items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-slate-900"
            >
              {copiedKey === "usage-copy" ? (
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

          <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white p-4 font-mono text-xs shadow-2xs">
            <div className="space-y-1">
              {CODE_EXAMPLE_LINES.map((line) => (
                <div key={line.num} className="flex">
                  <span className="w-8 shrink-0 pr-4 text-right text-slate-300 select-none">
                    {line.num}
                  </span>
                  <span>
                    {line.parts.map((p, idx) => (
                      <span key={idx} className={p.cls || "text-slate-700"}>
                        {p.text}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Props Reference Table */}
        <section className="mb-12">
          <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-950">Props</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-2xs">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] tracking-wider text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Prop</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Default</th>
                  <th className="px-4 py-3 font-sans font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PROPS_DATA.map((item) => (
                  <tr key={item.prop} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-purple-700">{item.prop}</td>
                    <td className="px-4 py-3 text-slate-600">{item.type}</td>
                    <td className="px-4 py-3 text-slate-400">{item.default}</td>
                    <td className="px-4 py-3 font-sans text-xs text-slate-600">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <SiteFooter />
    </div>
  );
}
