"use client";

import React, { useState } from "react";
import { Checklist, ChecklistTheme } from "@/components/ui/checklist";
import { ListChecksIcon } from "@phosphor-icons/react";
import {
  DocsLayout,
  ComponentPreview,
  InstallationSection,
  UsageSection,
  PropsTable,
  PropItem,
  ThemeControl,
} from "@/components/docs";

const CODE_EXAMPLE_LINES = [
  {
    num: 1,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "Checklist", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/checklist"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " ChecklistDemo() {" },
    ],
  },
  { num: 4, parts: [{ text: "  return (" }] },
  {
    num: 5,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "Checklist", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 6,
    parts: [{ text: "      corner", cls: "text-purple-600" }, { text: "={20}" }],
  },
  {
    num: 7,
    parts: [{ text: "      bounce", cls: "text-purple-600" }, { text: "={50}" }],
  },
  {
    num: 8,
    parts: [{ text: "      box", cls: "text-purple-600" }, { text: "={18}" }],
  },
  { num: 9, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 10, parts: [{ text: "  );" }] },
  { num: 11, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { Checklist } from "@/components/ui/checklist";

export default function ChecklistDemo() {
  return (
    <Checklist
      corner={20}
      bounce={50}
      box={18}
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "corner",
    type: "number",
    default: "20",
    desc: "Outer slab corner radius in pixels (0..40).",
  },
  {
    name: "bounce",
    type: "number",
    default: "50",
    desc: "Checkbox bounce overshoot tuning (0..100). Higher values produce more pronounced physical swelling.",
  },
  {
    name: "box",
    type: "number",
    default: "18",
    desc: "Checkbox square dimensions in pixels (clamped between 14 and 28).",
  },
  {
    name: "theme",
    type: '"light" | "dark"',
    default: '"light"',
    desc: "Visual theme mode: light slab or dark high-contrast slab.",
  },
  {
    name: "initialItems",
    type: "ChecklistItem[] | string[]",
    default: "3 sample tasks",
    desc: "Initial list of tasks rendered on mount.",
  },
  {
    name: "items",
    type: "ChecklistItem[]",
    default: "undefined",
    desc: "Controlled list of tasks.",
  },
  {
    name: "onItemsChange",
    type: "(items: ChecklistItem[]) => void",
    default: "undefined",
    desc: "Callback fired when tasks are checked, unchecked, or added.",
  },
  {
    name: "onComplete",
    type: "() => void",
    default: "undefined",
    desc: "Callback fired when all tasks are checked and the physical collapse begins.",
  },
];

export default function ChecklistPage() {
  const [theme, setTheme] = useState<ChecklistTheme>("light");
  const [bounce, setBounce] = useState<number>(50);
  const [box, setBox] = useState<number>(18);
  const [corner, setCorner] = useState<number>(20);

  return (
    <DocsLayout
      title="Checklist"
      description="A tactile task checklist driven by a single harmonic spring per row with drawn tickmarks, strikethrough timing, and physical gravity collapse on completion."
      icon={<ListChecksIcon size={14} weight="bold" />}
    >
      {/* 1. Preview */}
      <ComponentPreview
        canvasClassName={`min-h-[380px] p-8 transition-colors duration-300 ${
          theme === "dark" ? "bg-[#1b1b1b]" : "bg-[#F9FAFB]"
        }`}
        controls={
          <div className="flex flex-col gap-6">
            {/* Theme Mode */}
            <ThemeControl value={theme} onChange={setTheme} ariaLabel="Select checklist theme mode" />

            {/* Bounce Overshoot */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-900">Bounce Overshoot</label>
                <p className="mt-0.5 text-xs text-slate-500">Checkbox swelling bounce: {bounce}</p>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={bounce}
                onChange={(e) => setBounce(Number(e.target.value))}
                className="w-32 accent-slate-900"
              />
            </div>

            {/* Checkbox Size */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-900">Box Size</label>
                <p className="mt-0.5 text-xs text-slate-500">Checkbox dimensions: {box}px</p>
              </div>
              <input
                type="range"
                min={14}
                max={28}
                value={box}
                onChange={(e) => setBox(Number(e.target.value))}
                className="w-32 accent-slate-900"
              />
            </div>

            {/* Corner Radius */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-900">Corner Radius</label>
                <p className="mt-0.5 text-xs text-slate-500">Slab border radius: {corner}px</p>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={corner}
                onChange={(e) => setCorner(Number(e.target.value))}
                className="w-32 accent-slate-900"
              />
            </div>
          </div>
        }
      >
        <div className="flex items-center justify-center py-6">
          <Checklist corner={corner} bounce={bounce} box={box} theme={theme} />
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="checklist" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="Checklist" props={PROPS_DATA} />
    </DocsLayout>
  );
}
