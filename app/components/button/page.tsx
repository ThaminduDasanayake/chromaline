"use client";

import React, { useState } from "react";
import { Button, ButtonVariant, ButtonSize } from "@/components/ui/button";
import { SelectBar } from "@/components/ui/select-bar";
import { ArrowRightIcon } from "@phosphor-icons/react";
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
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "variant",
    type: '"default" | "dark" | "orange" | "emerald"',
    default: '"default"',
    desc: "Color theme and extrusion aesthetic of the button.",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    desc: "Button dimensions, font scale, and padding proportions.",
  },
  {
    name: "href",
    type: "string",
    default: "undefined",
    desc: "When provided, automatically renders an interactive anchor link.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: "Disables click actions and applies visual muted depth.",
  },
  {
    name: "className",
    type: "string",
    default: '""',
    desc: "Custom CSS classes to append to the root element.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    default: "undefined",
    desc: "Label, icons, or nested elements rendered inside the button face.",
  },
];

const VARIANT_SWATCHES = [
  { key: "default", label: "Default", color: "#4a4a46", darkOutline: "#292926" },
  { key: "dark", label: "Dark", color: "#1e2024", darkOutline: "#111215" },
  { key: "orange", label: "Orange", color: "#e54f10", darkOutline: "#9a3412" },
  { key: "emerald", label: "Emerald", color: "#059669", darkOutline: "#047857" },
];

export default function ButtonDocumentationPage() {
  const [variant, setVariant] = useState<ButtonVariant>("default");
  const [size, setSize] = useState<ButtonSize>("default");

  return (
    <DocsLayout
      title="Button"
      description="A tactile 3D push button engineered with physical extrusion depth, inset bevel highlights, and click kinematics."
    >
      {/* 1. Preview */}
      <ComponentPreview
        controls={
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                Variant
              </label>
              <div className="mt-2.5">
                <SelectBar
                  size="xs"
                  items={VARIANT_SWATCHES}
                  value={variant}
                  onChange={(v) => setVariant(v as ButtonVariant)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                Size
              </label>
              <div className="mt-2.5">
                <SelectBar<ButtonSize>
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
          </div>
        }
      >
        <div className="py-8">
          <Button variant={variant} size={size}>
            <span>Continue</span>
            <ArrowRightIcon size={14} weight="bold" />
          </Button>
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="button" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="Button" props={PROPS_DATA} />
    </DocsLayout>
  );
}
