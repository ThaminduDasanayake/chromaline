"use client";

import React, { useState } from "react";
import { Create } from "@/components/ui/create-menu";
import { PlusIcon } from "@phosphor-icons/react";
import {
  DocsLayout,
  ComponentPreview,
  InstallationSection,
  UsageSection,
  PropsTable,
  PropItem,
  ThemeControl,
  useComponentTheme,
} from "@/components/docs";

const CODE_EXAMPLE_LINES = [
  {
    num: 1,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "Create", cls: "text-slate-900 dark:text-zinc-100 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/create-menu"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " CreateMenuDemo() {" },
    ],
  },
  { num: 4, parts: [{ text: "  return (" }] },
  {
    num: 5,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "Create", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 6,
    parts: [{ text: "      corner", cls: "text-purple-600" }, { text: "={20}" }],
  },
  {
    num: 7,
    parts: [
      { text: "      onItemSelect", cls: "text-purple-600" },
      { text: "={(label) => console.log(label)}" },
    ],
  },
  { num: 8, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 9, parts: [{ text: "  );" }] },
  { num: 10, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { Create } from "@/components/ui/create-menu";

export default function CreateMenuDemo() {
  return (
    <Create
      corner={20}
      onItemSelect={(label) => console.log(label)}
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "corner",
    type: "number",
    default: "20",
    desc: "Outer window corner radius in pixels (0..40). Inner rows derive concentric curvature (corner - 10px).",
  },
  {
    name: "items",
    type: "CreateMenuItem[]",
    default: "Document, Spreadsheet, Board, Folder",
    desc: "Array of items each with an icon component and label string.",
  },
  {
    name: "onItemSelect",
    type: "(label: string) => void",
    default: "undefined",
    desc: "Callback fired when a menu item is clicked.",
  },
  {
    name: "theme",
    type: '"light" | "dark"',
    default: "undefined",
    desc: "Visual theme mode: light slab or dark high-contrast slab. Defaults to inheriting system/app theme.",
  },
  {
    name: "className",
    type: "string",
    default: '""',
    desc: "Additional CSS classes applied to the root stage container.",
  },
];

export default function CreateMenuPage() {
  const [theme, setTheme] = useComponentTheme<"light" | "dark">();
  const [corner, setCorner] = useState<number>(20);

  return (
    <DocsLayout
      title="Create Menu"
      description="A fluid morphing create button that expands into a window with continuous kinematic physics, concentric nested row radii, and traveling liquid hover droplet highlights."
      icon={<PlusIcon size={14} weight="bold" />}
    >
      {/* 1. Preview */}
      <ComponentPreview
        canvasClassName={`min-h-[380px] p-8 transition-colors duration-300 ${
          theme === "dark" ? "bg-[#0f0f0f]" : "bg-[#f7f7f6]"
        }`}
        controls={
          <div className="flex flex-col gap-6">
            {/* Theme Mode */}
            <ThemeControl
              value={theme}
              onChange={setTheme}
              ariaLabel="Select create menu theme mode"
            />

            {/* Corner Radius */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Corner Radius
                </label>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                  Outer radius: {corner}px (inner: {Math.min(17, Math.max(0, corner - 10))}px)
                </p>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={corner}
                onChange={(e) => setCorner(Number(e.target.value))}
                className="w-32 accent-slate-900 dark:accent-white"
              />
            </div>
          </div>
        }
      >
        <div className="flex items-center justify-center py-6">
          <Create corner={corner} theme={theme} />
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="create-menu" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="Create" props={PROPS_DATA} />
    </DocsLayout>
  );
}
