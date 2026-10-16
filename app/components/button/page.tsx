"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SelectBar } from "@/components/ui/select-bar";
import { ArrowRightIcon, CopyIcon, CheckIcon } from "@phosphor-icons/react";
import { SiteHeader, SiteFooter } from "@/components/layout";
import { InstallCommandTabs } from "@/components/docs";

const CODE_EXAMPLE_LINES = [
  {
    num: 1,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "Button", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/button"', cls: "text-[#0284c7]" },
    ],
  },
  {
    num: 2,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "ArrowRightIcon", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@phosphor-icons/react"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 3, parts: [{ text: "" }] },
  {
    num: 4,
    parts: [{ text: "export default function", cls: "text-[#f43f5e]" }, { text: " Demo() {" }],
  },
  { num: 5, parts: [{ text: "  return", cls: "text-[#f43f5e]" }, { text: " (" }] },
  {
    num: 6,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "Button", cls: "text-[#16a34a] font-semibold" },
      { text: " " },
      { text: "variant", cls: "text-purple-600" },
      { text: '="default"' },
      { text: " " },
      { text: "size", cls: "text-purple-600" },
      { text: '="default"' },
      { text: ">" },
    ],
  },
  {
    num: 7,
    parts: [
      { text: "      <span>" },
      { text: "Continue", cls: "text-slate-900" },
      { text: "</span>" },
    ],
  },
  {
    num: 8,
    parts: [
      { text: "      <", cls: "text-slate-500" },
      { text: "ArrowRightIcon", cls: "text-[#16a34a] font-semibold" },
      { text: " " },
      { text: "size", cls: "text-purple-600" },
      { text: "={14} " },
      { text: "weight", cls: "text-purple-600" },
      { text: '="bold"' },
      { text: " />" },
    ],
  },
  {
    num: 9,
    parts: [
      { text: "    </", cls: "text-slate-500" },
      { text: "Button", cls: "text-[#16a34a] font-semibold" },
      { text: ">", cls: "text-slate-500" },
    ],
  },
  { num: 10, parts: [{ text: "  );" }] },
  { num: 11, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@phosphor-icons/react";

export default function Demo() {
  return (
    <Button variant="default" size="default">
      <span>Continue</span>
      <ArrowRightIcon size={14} weight="bold" />
    </Button>
  );
};`;

const PROPS_DATA = [
  {
    prop: "variant",
    type: '"default" | "dark" | "orange" | "emerald"',
    default: '"default"',
    desc: "Preconfigured tactile solid color theme. Default is exact stone #4a4a46.",
  },
  {
    prop: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    desc: "Dimensions, font size, padding, and physical 3D extrusion depth.",
  },
  {
    prop: "depth",
    type: "string",
    default: "6px (or size depth)",
    desc: "Custom extrusion thickness (e.g. '8px') translated on press.",
  },
  {
    prop: "radius",
    type: "string",
    default: "0.75rem",
    desc: "Corner border radius for both the base and surface face.",
  },
  {
    prop: "faceColor",
    type: "string",
    default: "#4a4a46",
    desc: "Custom CSS hex/rgb color for button surface face.",
  },
  {
    prop: "faceHighlight",
    type: "string",
    default: "#64645e",
    desc: "Top inset bevel highlight line for mechanical depth.",
  },
  {
    prop: "contentColor",
    type: "string",
    default: "#eeeeec",
    desc: "Text and icon fill color.",
  },
  {
    prop: "baseColor",
    type: "string",
    default: "#292926",
    desc: "Color of the bottom extruded chassis block.",
  },
  {
    prop: "baseShadow",
    type: "string",
    default: "#141412",
    desc: "Deep drop shadow bevel under the extruded chassis.",
  },
  {
    prop: "href",
    type: "string",
    default: "undefined",
    desc: "When provided, automatically renders as an accessible tactile <a> anchor link.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    desc: "Disables interaction and reduces opacity.",
  },
];

export default function ButtonPage() {
  const [variant, setVariant] = useState<"default" | "dark" | "orange" | "emerald">("default");
  const [size, setSize] = useState<"sm" | "default" | "lg">("default");
  const [disabled, setDisabled] = useState(false);
  const [clickCount, setClickCount] = useState(0);

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

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200">
      {/* Top Header Navbar */}
      <SiteHeader breadcrumb="Button" />

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
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Button</h1>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-medium text-slate-600">
              v0.1.0
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            A tactile 3D push button engineered with physical extrusion depth, inset bevel
            highlights, and realistic mechanical click kinematics.
          </p>
        </div>

        {/* Interactive Preview Canvas */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          {/* Canvas Area */}
          <div className="relative flex min-h-[280px] flex-col items-center justify-center bg-[#F9FAFB] p-8 sm:p-12">
            <div className="flex flex-col items-center gap-4">
              <Button
                variant={variant}
                size={size}
                disabled={disabled}
                onClick={() => setClickCount((c) => c + 1)}
              >
                <span>Continue</span>
                <ArrowRightIcon size={14} weight="bold" />
              </Button>

              {clickCount > 0 && (
                <span className="font-mono text-[11px] text-slate-500">
                  Clicked {clickCount} {clickCount === 1 ? "time" : "times"}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white px-5 py-3.5 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {/* Variant Picker */}
              <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                <span className="text-[11px] text-slate-400">Variant:</span>
                <SelectBar<"default" | "dark" | "orange" | "emerald">
                  variant="swatches"
                  size="xs"
                  items={[
                    { key: "default", label: "Default", color: "#4a4a46", darkOutline: "#292926" },
                    { key: "dark", label: "Dark", color: "#1e2024", darkOutline: "#111215" },
                    { key: "orange", label: "Orange", color: "#e54f10", darkOutline: "#9a3412" },
                    { key: "emerald", label: "Emerald", color: "#059669", darkOutline: "#047857" },
                  ]}
                  value={variant}
                  onChange={setVariant}
                  ariaLabel="Select button variant"
                />
              </div>

              {/* Size Picker */}
              <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                <span className="text-[11px] text-slate-400">Size:</span>
                <SelectBar<"sm" | "default" | "lg">
                  size="xs"
                  items={[
                    { key: "sm", label: "S" },
                    { key: "default", label: "M" },
                    { key: "lg", label: "L" },
                  ]}
                  value={size}
                  onChange={setSize}
                  ariaLabel="Select button size"
                />
              </div>

              {/* Disabled Toggle */}
              <div className="flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-slate-600">
                  <input
                    type="checkbox"
                    checked={disabled}
                    onChange={(e) => setDisabled(e.target.checked)}
                    className="cursor-pointer rounded text-slate-900"
                  />
                  <span>Disabled</span>
                </label>
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
            <InstallCommandTabs componentName="button" />
          ) : (
            <div className="space-y-3 rounded-xl border border-slate-200/90 bg-white p-4 font-mono text-xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-sans text-[12px] font-medium text-slate-600">
                  Copy code into <code className="text-slate-900">components/ui/button.tsx</code>
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
                Create <code className="font-mono text-slate-900">components/ui/button.tsx</code> in
                your project.
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
