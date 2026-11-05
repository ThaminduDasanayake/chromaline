"use client";

import React, { useState } from "react";
import { FluidSearch } from "@/components/ui/fluid-search";
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
      { text: "FluidSearch", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/fluid-search"', cls: "text-[#0284c7]" },
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
      { text: "FluidSearch", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 8,
    parts: [
      { text: "      value", cls: "text-purple-600" },
      { text: "={query}" },
    ],
  },
  {
    num: 9,
    parts: [
      { text: "      onChange", cls: "text-purple-600" },
      { text: "={setQuery}" },
    ],
  },
  {
    num: 10,
    parts: [
      { text: "      placeholder", cls: "text-purple-600" },
      { text: '="Search…"' },
    ],
  },
  { num: 11, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 12, parts: [{ text: "  );" }] },
  { num: 13, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { useState } from "react";
import { FluidSearch } from "@/components/ui/fluid-search";

export default function SearchDemo() {
  const [query, setQuery] = useState("");

  return (
    <FluidSearch
      value={query}
      onChange={setQuery}
      placeholder="Search…"
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "value",
    type: "string",
    default: '""',
    desc: "Controlled input value for the search field.",
  },
  {
    name: "onChange",
    type: "(value: string) => void",
    default: "undefined",
    desc: "Callback fired when the user types in the input or clears it.",
  },
  {
    name: "label",
    type: "string",
    default: '"Search"',
    desc: "Accessible label for screen readers.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Search…"',
    desc: "Placeholder text displayed when the input is empty.",
  },
  {
    name: "fill",
    type: "string",
    default: "undefined",
    desc: "Optional custom background fill color for the fluid pill & circle (defaults to CSS variable --search-fill).",
  },
  {
    name: "className",
    type: "string",
    default: '""',
    desc: "Optional additional CSS classes.",
  },
];

export default function FluidSearchDocumentationPage() {
  const [query, setQuery] = useState("");

  return (
    <DocsLayout
      title="Fluid Search"
      description="Metaball search disclosure where the pill field and close circle fluidly separate on focus and seamlessly fuse back when closed."
      icon={<MagnifyingGlassIcon size={14} weight="bold" />}
    >
      {/* 1. Preview */}
      <ComponentPreview>
        <div className="flex w-full max-w-[340px] items-center justify-center py-8">
          <FluidSearch
            value={query}
            onChange={setQuery}
            placeholder="Search files or commands…"
          />
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="fluid-search" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="FluidSearch" props={PROPS_DATA} />
    </DocsLayout>
  );
}
