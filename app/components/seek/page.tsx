"use client";

import React, { useState } from "react";
import { Seek } from "@/components/ui/seek";
import { SelectBar } from "@/components/ui/select-bar";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
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
    parts: [{ text: "      value={query}" }],
  },
  {
    num: 9,
    parts: [{ text: "      onChange={setQuery}" }],
  },
  {
    num: 10,
    parts: [{ text: '      placeholder="Search components..."' }],
  },
  {
    num: 11,
    parts: [{ text: '      size="default"' }],
  },
  {
    num: 12,
    parts: [{ text: "      give={50}" }],
  },
  {
    num: 13,
    parts: [{ text: "      spring={50}" }],
  },
  {
    num: 14,
    parts: [{ text: '      theme="light" // "light" | "dark"' }],
  },
  {
    num: 15,
    parts: [{ text: "    />", cls: "text-slate-500" }],
  },
  { num: 16, parts: [{ text: "  );" }] },
  { num: 17, parts: [{ text: "}" }] },
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
      theme="light" // "light" | "dark"
      give={50}
      spring={50}
    />
  );
};`;

const PROPS_DATA: PropItem[] = [
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
    name: "theme",
    type: '"light" | "dark"',
    default: '"light"',
    desc: "Visual color theme mode: 'light' or 'dark'.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: "Whether the search input is disabled.",
  },
];

export default function SeekDocumentationPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [size, setSize] = useState<"sm" | "default" | "lg">("default");
  const [give, setGive] = useState(50);
  const [spring, setSpring] = useState(50);
  const [searchVal, setSearchVal] = useState("");
  const [compactVal, setCompactVal] = useState("");

  return (
    <DocsLayout
      title="Seek"
      description="A search icon that becomes a search field as one single continuous object. Features tactile yield on press, rAF spring expansion, cursor magnetic pull, and typing feedback."
      icon={<MagnifyingGlassIcon size={14} weight="bold" />}
    >
      {/* 1. Preview */}
      <ComponentPreview
        canvasClassName={`min-h-[340px] p-8 transition-colors duration-300 ${
          theme === "dark" ? "bg-[#18181b]" : "bg-[#f4f4f5]"
        }`}
        controls={
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Theme control */}
            <div>
              <label className="text-xs font-semibold text-slate-900">Theme</label>
              <div className="mt-2.5">
                <SelectBar<"light" | "dark">
                  size="xs"
                  items={[
                    { key: "light", label: "Light" },
                    { key: "dark", label: "Dark" },
                  ]}
                  value={theme}
                  onChange={setTheme}
                />
              </div>
            </div>

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
        }
      >
        <Seek
          size={size}
          theme={theme}
          give={give}
          spring={spring}
          value={searchVal}
          onChange={setSearchVal}
          placeholder="Search components..."
        />
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="seek" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="Seek" props={PROPS_DATA} />

      {/* Examples */}
      <section>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Examples</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Header Toolbar (Compact)</h3>
            <p className="mt-1 text-xs text-slate-500">
              Sized at <code>size=&quot;sm&quot;</code> (44px), ideal for fixed topbars and docking
              next to navigation links.
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
      </section>
    </DocsLayout>
  );
}
