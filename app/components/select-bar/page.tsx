"use client";

import React, { useState } from "react";
import { SelectBar, SelectBarItem } from "@/components/ui/select-bar";
import { SiteHeader, SiteFooter } from "@/components/layout";
import { InstallCommandTabs, BackLink } from "@/components/docs";
import {
  CodeIcon,
  EyeIcon,
  PaintBrushIcon,
  SparkleIcon,
  CursorIcon,
  PencilSimpleIcon,
  TextTIcon,
  SquareIcon,
  HandPalmIcon,
  ChatCircleDotsIcon,
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
    parts: [{ text: '  { key: "design", label: "Design" },' }],
  },
  {
    num: 5,
    parts: [{ text: '  { key: "code", label: "Code" },' }],
  },
  {
    num: 6,
    parts: [{ text: '  { key: "preview", label: "Preview" },' }],
  },
  {
    num: 7,
    parts: [{ text: '  { key: "export", label: "Export" },' }],
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
    parts: [{ text: "      items={TABS}" }],
  },
  {
    num: 15,
    parts: [{ text: "      value={active}" }],
  },
  {
    num: 16,
    parts: [{ text: "      onChange={setActive}" }],
  },
  {
    num: 17,
    parts: [{ text: '      size="sm"' }],
  },
  {
    num: 18,
    parts: [{ text: "    />", cls: "text-slate-500" }],
  },
  { num: 19, parts: [{ text: "  );" }] },
  { num: 20, parts: [{ text: "}" }] },
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
    />
  );
}`;

const ICON_EXAMPLE_LINES = [
  {
    num: 1,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "useState", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "react"', cls: "text-[#0284c7]" },
    ],
  },
  {
    num: 2,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "SelectBar", cls: "text-slate-900 font-semibold" },
      { text: ", " },
      { text: "type", cls: "text-[#f43f5e]" },
      { text: " " },
      { text: "SelectBarItem", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/select-bar"', cls: "text-[#0284c7]" },
    ],
  },
  {
    num: 3,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      {
        text: "CursorIcon, PencilSimpleIcon, TextTIcon, SquareIcon, HandPalmIcon",
        cls: "text-slate-900 font-semibold",
      },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@phosphor-icons/react"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 4, parts: [{ text: "" }] },
  {
    num: 5,
    parts: [
      { text: "const", cls: "text-[#f43f5e]" },
      { text: " TOOLS: " },
      { text: "SelectBarItem", cls: "text-purple-700 font-semibold" },
      { text: "[] = [" },
    ],
  },
  {
    num: 6,
    parts: [
      {
        text: '  { key: "cursor", icon: <CursorIcon size={14} weight="bold" />, title: "Select" },',
      },
    ],
  },
  {
    num: 7,
    parts: [
      {
        text: '  { key: "draw", icon: <PencilSimpleIcon size={14} weight="bold" />, title: "Draw" },',
      },
    ],
  },
  {
    num: 8,
    parts: [
      {
        text: '  { key: "text", icon: <TextTIcon size={14} weight="bold" />, title: "Text" },',
      },
    ],
  },
  {
    num: 9,
    parts: [
      {
        text: '  { key: "shapes", icon: <SquareIcon size={14} weight="bold" />, title: "Shapes" },',
      },
    ],
  },
  {
    num: 10,
    parts: [
      {
        text: '  { key: "pan", icon: <HandPalmIcon size={14} weight="bold" />, title: "Pan" },',
      },
    ],
  },
  { num: 11, parts: [{ text: "];" }] },
  { num: 12, parts: [{ text: "" }] },
  {
    num: 13,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " Toolbar() {" },
    ],
  },
  {
    num: 14,
    parts: [
      { text: "  const [active, setActive] = useState(" },
      { text: '"cursor"', cls: "text-[#0284c7]" },
      { text: ");" },
    ],
  },
  { num: 15, parts: [{ text: "  return (" }] },
  {
    num: 16,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "SelectBar", cls: "text-[#16a34a] font-semibold" },
      { text: ' items={TOOLS} value={active} onChange={setActive} size="sm" />' },
    ],
  },
  { num: 17, parts: [{ text: "  );" }] },
  { num: 18, parts: [{ text: "}" }] },
];

const ICON_EXAMPLE_TEXT = `import { useState } from "react";
import { SelectBar, SelectBarItem } from "@/components/ui/select-bar";
import {
  CursorIcon,
  PencilSimpleIcon,
  TextTIcon,
  SquareIcon,
  HandPalmIcon,
  ChatCircleDotsIcon,
} from "@phosphor-icons/react";

const TOOLS: SelectBarItem[] = [
  { key: "cursor", icon: <CursorIcon size={14} weight="bold" />, title: "Select" },
  { key: "draw", icon: <PencilSimpleIcon size={14} weight="bold" />, title: "Draw" },
  { key: "text", icon: <TextTIcon size={14} weight="bold" />, title: "Text" },
  { key: "shapes", icon: <SquareIcon size={14} weight="bold" />, title: "Shapes" },
  { key: "pan", icon: <HandPalmIcon size={14} weight="bold" />, title: "Pan" },
  { key: "comment", icon: <ChatCircleDotsIcon size={14} weight="bold" />, title: "Comment" },
];

export default function ToolbarDemo() {
  const [active, setActive] = useState("cursor");

  return (
    <SelectBar
      items={TOOLS}
      value={active}
      onChange={setActive}
      size="sm"
      ariaLabel="Canvas editor toolbar"
    />
  );
}`;

const SWATCH_EXAMPLE_TEXT = `import { useState } from "react";
import { SelectBar, SelectBarItem } from "@/components/ui/select-bar";

const SWATCHES: SelectBarItem[] = [
  { key: "white", color: "#FFFFFF", darkOutline: "#232327", title: "White" },
  { key: "orange", color: "#E54F10", darkOutline: "#7C2D12", title: "Orange" },
  { key: "blue", color: "#0A90D2", darkOutline: "#075985", title: "Blue" },
  { key: "emerald", color: "#059669", darkOutline: "#047857", title: "Emerald" },
  { key: "violet", color: "#8B5CF6", darkOutline: "#4C1D95", title: "Violet" },
  { key: "amber", color: "#F59E0B", darkOutline: "#92400E", title: "Amber" },
];

export default function SwatchDemo() {
  const [color, setColor] = useState("orange");

  return (
    <SelectBar
      items={SWATCHES}
      value={color}
      onChange={setColor}
      size="xs"
      ariaLabel="Color palette switcher"
    />
  );
}`;

const PROPS_DATA = [
  {
    prop: "items",
    type: "SelectBarItem<T>[]",
    default: "[]",
    desc: "Array of items with key, optional label (text pill), icon, color (swatch), and title.",
  },
  {
    prop: "value",
    type: "T",
    default: "undefined",
    desc: "Controlled active selected key. Automatically glides the mercury indicator when updated.",
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
    prop: "size",
    type: '"xs" | "sm" | "default"',
    default: '"sm"',
    desc: "Height and horizontal padding dimensions of the track and slots (26px, 30px, or 36px).",
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
    default: '"Navigation"',
    desc: "Accessible label assigned to the navigation element.",
  },
];

const TAB_OPTIONS: SelectBarItem<string>[] = [
  { key: "design", label: "Design", icon: <PaintBrushIcon size={14} weight="bold" /> },
  { key: "code", label: "Code", icon: <CodeIcon size={14} weight="bold" /> },
  { key: "preview", label: "Preview", icon: <EyeIcon size={14} weight="bold" /> },
  { key: "motion", label: "Motion", icon: <SparkleIcon size={14} weight="bold" /> },
];

const ICON_OPTIONS: SelectBarItem<string>[] = [
  { key: "cursor", icon: <CursorIcon size={14} weight="bold" />, title: "Select" },
  { key: "draw", icon: <PencilSimpleIcon size={14} weight="bold" />, title: "Draw" },
  { key: "text", icon: <TextTIcon size={14} weight="bold" />, title: "Text" },
  { key: "shapes", icon: <SquareIcon size={14} weight="bold" />, title: "Shapes" },
  { key: "pan", icon: <HandPalmIcon size={14} weight="bold" />, title: "Pan" },
  { key: "comment", icon: <ChatCircleDotsIcon size={14} weight="bold" />, title: "Comments" },
];

const SWATCH_OPTIONS: SelectBarItem<string>[] = [
  { key: "original", label: "White", color: "#FFFFFF", darkOutline: "#232327", title: "White" },
  { key: "orange", label: "Orange", color: "#E54F10", darkOutline: "#7C2D12", title: "Orange" },
  { key: "blue", label: "Blue", color: "#0A90D2", darkOutline: "#075985", title: "Blue" },
  { key: "emerald", label: "Emerald", color: "#059669", darkOutline: "#047857", title: "Emerald" },
  { key: "violet", label: "Violet", color: "#8B5CF6", darkOutline: "#4C1D95", title: "Violet" },
  { key: "amber", label: "Amber", color: "#F59E0B", darkOutline: "#92400E", title: "Amber" },
];

export default function SelectBarPage() {
  const [activeTab, setActiveTab] = useState("design");
  const [activeIcon, setActiveIcon] = useState("cursor");
  const [activeSwatch, setActiveSwatch] = useState("orange");

  const [mode, setMode] = useState<"tabs" | "icons" | "swatches">("tabs");
  const [size, setSize] = useState<"xs" | "sm" | "default">("sm");

  // Examples Section State
  const [exampleIconTool, setExampleIconTool] = useState("cursor");
  const [exampleIconSize, setExampleIconSize] = useState<"xs" | "sm" | "default">("sm");
  const [exampleSwatch, setExampleSwatch] = useState("orange");

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

  const currentItems =
    mode === "tabs" ? TAB_OPTIONS : mode === "icons" ? ICON_OPTIONS : SWATCH_OPTIONS;
  const currentValue =
    mode === "tabs" ? activeTab : mode === "icons" ? activeIcon : activeSwatch;
  const handleValueChange = (k: string) => {
    if (mode === "tabs") setActiveTab(k);
    else if (mode === "icons") setActiveIcon(k);
    else setActiveSwatch(k);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200">
      {/* Top Header Navbar */}
      <SiteHeader breadcrumb="Select Bar" />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <BackLink />

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
            A refined physical frosted glass selector and navigation dock engineered with two-phase
            mercury stretch dilation and overshoot landing kinematics.
          </p>
        </div>

        {/* Interactive Preview Canvas */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          {/* Canvas Area */}
          <div className="relative flex min-h-65 flex-col items-center justify-center bg-[#F9FAFB] p-8 sm:p-12">
            <SelectBar
              key={`${mode}-${size}`}
              items={currentItems}
              value={currentValue}
              onChange={handleValueChange}
              size={size}
              ariaLabel="Interactive playground selector"
            />
          </div>

          {/* Interactive Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white px-5 py-3.5 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {/* Content Type Picker */}
              <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                <span className="text-[11px] text-slate-400">Content:</span>
                <SelectBar<"tabs" | "icons" | "swatches">
                  size="xs"
                  items={[
                    { key: "tabs", label: "Pills" },
                    { key: "icons", label: "Icons" },
                    { key: "swatches", label: "Swatches" },
                  ]}
                  value={mode}
                  onChange={setMode}
                  ariaLabel="Select content type"
                />
              </div>

              {/* Size Picker */}
              <div className="flex items-center gap-2">
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

        {/* Examples Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Examples</h2>
            <p className="text-sm text-slate-500">
              Versatile physical glass selector patterns for toolbars and palettes.
            </p>
          </div>

          {/* Example 1: Icons Only Toolbar Dock */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Icons Only (Toolbar Dock)</h3>
                <p className="text-xs text-slate-500">
                  When items have an <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-700">icon</code> and no label, slots automatically render as compact square buttons with centered icons.
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(ICON_EXAMPLE_TEXT, "icon-example-code")}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 font-mono text-xs text-slate-500 transition-colors hover:text-slate-900"
              >
                {copiedKey === "icon-example-code" ? (
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
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
              <div className="relative flex min-h-50 flex-col items-center justify-center bg-[#F9FAFB] p-8 sm:p-12">
                <SelectBar
                  items={ICON_OPTIONS}
                  value={exampleIconTool}
                  onChange={setExampleIconTool}
                  size={exampleIconSize}
                  ariaLabel="Canvas drawing tools"
                />

                {/* Size toggle */}
                <div className="mt-6 flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-2 py-1 shadow-2xs sm:absolute sm:right-4 sm:bottom-4 sm:mt-0">
                  <span className="font-mono text-[10px] text-slate-400">Size:</span>
                  <SelectBar<"xs" | "sm" | "default">
                    size="xs"
                    items={[
                      { key: "xs", label: "XS" },
                      { key: "sm", label: "SM" },
                      { key: "default", label: "MD" },
                    ]}
                    value={exampleIconSize}
                    onChange={setExampleIconSize}
                    ariaLabel="Select toolbar size"
                  />
                </div>
              </div>
            </div>

            {/* Code Snippet */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white p-4 font-mono text-xs shadow-2xs">
              <div className="space-y-1">
                {ICON_EXAMPLE_LINES.map((line) => (
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
          </div>

          {/* Example 2: Color Swatches */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Color Swatches</h3>
                <p className="text-xs text-slate-500">
                  Items with a <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-700">color</code> hex are automatically detected and rendered as tactile swatches with active pop-scale micro-interactions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(SWATCH_EXAMPLE_TEXT, "swatch-example-code")}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 font-mono text-xs text-slate-500 transition-colors hover:text-slate-900"
              >
                {copiedKey === "swatch-example-code" ? (
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
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
              <div className="relative flex min-h-45 flex-col items-center justify-center bg-[#F9FAFB] p-8 sm:p-12">
                <SelectBar
                  items={SWATCH_OPTIONS}
                  value={exampleSwatch}
                  onChange={setExampleSwatch}
                  size="xs"
                  ariaLabel="Color palette switcher"
                />
              </div>
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
