"use client";

import React, { useState } from "react";
import { SelectBar, SelectBarItem } from "@/components/ui/select-bar";
import {
  FolderColorSelectBar,
  FOLDER_COLOR_SWATCHES,
} from "@/components/showcase";
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
} from "@phosphor-icons/react";
import {
  DocsLayout,
  ComponentPreview,
  InstallationSection,
  UsageSection,
  PropsTable,
  PropItem,
} from "@/components/docs";

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
    parts: [{ text: "const", cls: "text-[#f43f5e]" }, { text: " TABS = [" }],
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
    parts: [{ text: "export default function", cls: "text-[#f43f5e]" }, { text: " Demo() {" }],
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

const PROPS_DATA: PropItem[] = [
  {
    name: "items",
    type: "SelectBarItem[]",
    default: "required",
    desc: "Array of items. Items can have label, icon, or color (for swatches).",
  },
  {
    name: "value",
    type: "string",
    default: "undefined",
    desc: "Controlled active item key.",
  },
  {
    name: "defaultValue",
    type: "string",
    default: "items[0]?.key",
    desc: "Default selected key for uncontrolled usage.",
  },
  {
    name: "onChange",
    type: "(key: string) => void",
    default: "undefined",
    desc: "Callback fired when an item is selected.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "default"',
    default: '"default"',
    desc: "Dock height and slot dimensions: xs (26px), sm (30px), or default (36px).",
  },
  {
    name: "ariaLabel",
    type: "string",
    default: '"Navigation dock"',
    desc: "Accessibility label for screen readers.",
  },
  {
    name: "className",
    type: "string",
    default: '""',
    desc: "Optional CSS classes to append to the dock.",
  },
];

const PILL_ITEMS: SelectBarItem[] = [
  { key: "design", label: "Design", icon: <PaintBrushIcon size={13} weight="bold" /> },
  { key: "code", label: "Code", icon: <CodeIcon size={13} weight="bold" /> },
  { key: "preview", label: "Preview", icon: <EyeIcon size={13} weight="bold" /> },
  { key: "motion", label: "Motion", icon: <SparkleIcon size={13} weight="bold" /> },
];

const ICON_ITEMS: SelectBarItem[] = [
  { key: "cursor", icon: <CursorIcon size={14} weight="bold" />, title: "Cursor" },
  { key: "draw", icon: <PencilSimpleIcon size={14} weight="bold" />, title: "Draw" },
  { key: "text", icon: <TextTIcon size={14} weight="bold" />, title: "Text" },
  { key: "shapes", icon: <SquareIcon size={14} weight="bold" />, title: "Shapes" },
  { key: "pan", icon: <HandPalmIcon size={14} weight="bold" />, title: "Pan" },
];

const SWATCH_ITEMS = FOLDER_COLOR_SWATCHES;

export default function SelectBarDocumentationPage() {
  const [contentType, setContentType] = useState<"pills" | "icons" | "swatches">("pills");
  const [size, setSize] = useState<"xs" | "sm" | "default">("sm");

  const [activePill, setActivePill] = useState("design");
  const [activeIcon, setActiveIcon] = useState("cursor");
  const [activeSwatch, setActiveSwatch] = useState("purple");

  const currentItems =
    contentType === "pills" ? PILL_ITEMS : contentType === "icons" ? ICON_ITEMS : SWATCH_ITEMS;

  const currentValue =
    contentType === "pills" ? activePill : contentType === "icons" ? activeIcon : activeSwatch;

  const handleValueChange = (key: string) => {
    if (contentType === "pills") setActivePill(key);
    else if (contentType === "icons") setActiveIcon(key);
    else setActiveSwatch(key);
  };

  return (
    <DocsLayout
      title="Select Bar"
      description="Frosted glass segmented tabs and tool dock with two-phase mercury kinematics: fast initial dilation followed by an overshoot settle."
    >
      {/* 1. Preview */}
      <ComponentPreview
        controls={
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <label className="text-xs font-semibold text-slate-900">Content</label>
              <div className="mt-2.5">
                <SelectBar<"pills" | "icons" | "swatches">
                  size="xs"
                  items={[
                    { key: "pills", label: "Pills" },
                    { key: "icons", label: "Icons" },
                    { key: "swatches", label: "Swatches" },
                  ]}
                  value={contentType}
                  onChange={setContentType}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-900">Size</label>
              <div className="mt-2.5">
                <SelectBar<"xs" | "sm" | "default">
                  size="xs"
                  items={[
                    { key: "xs", label: "XS" },
                    { key: "sm", label: "SM" },
                    { key: "default", label: "MD" },
                  ]}
                  value={size}
                  onChange={setSize}
                />
              </div>
            </div>
          </div>
        }
      >
        <div className="py-8">
          {contentType === "swatches" ? (
            <FolderColorSelectBar
              size={size}
              value={activeSwatch}
              onChange={(key) => setActiveSwatch(key)}
            />
          ) : (
            <SelectBar
              items={currentItems}
              value={currentValue}
              onChange={handleValueChange}
              size={size}
            />
          )}
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="select-bar" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="SelectBar" props={PROPS_DATA} />

      {/* Examples */}
      <section>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Examples</h2>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Example 1: Icon Toolbar */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <div className="border-b border-slate-100 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Icons Only Toolbar</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Compact dock with Phosphor icons and two-phase dilation.
              </p>
            </div>
            <div className="flex h-36 items-center justify-center bg-[#F9FAFB] p-6">
              <SelectBar size="sm" items={ICON_ITEMS} value={activeIcon} onChange={setActiveIcon} />
            </div>
          </div>

          {/* Example 2: Color Swatches */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <div className="border-b border-slate-100 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Color Swatches</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Auto-detected via the <code>color</code> item prop with reversed chromatic order.
              </p>
            </div>
            <div className="flex h-36 items-center justify-center bg-[#F9FAFB] p-6">
              <FolderColorSelectBar
                size="xs"
                value={activeSwatch}
                onChange={(key) => setActiveSwatch(key)}
              />
            </div>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
