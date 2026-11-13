"use client";

import React, { useState } from "react";
import { Button, ButtonVariant, ButtonSize } from "@/components/ui/button";
import { SelectBar } from "@/components/ui/select-bar";
import { ArrowRightIcon, SunIcon, MoonIcon } from "@phosphor-icons/react";
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
    type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
    default: '"default"',
    desc: "Semantic intent and extrusion aesthetic of the button.",
  },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    desc: "Button dimensions, font scale, and padding proportions.",
  },
  {
    name: "theme",
    type: '"light" | "dark"',
    default: "undefined",
    desc: "Visual theme mode: light or dark surface styling with corresponding extrusion tokens.",
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

const VARIANT_OPTIONS: { key: ButtonVariant; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "destructive", label: "Destructive" },
  { key: "outline", label: "Outline" },
  { key: "secondary", label: "Secondary" },
  { key: "ghost", label: "Ghost" },
  { key: "link", label: "Link" },
];

export default function ButtonDocumentationPage() {
  const [variant, setVariant] = useState<ButtonVariant>("default");
  const [size, setSize] = useState<ButtonSize>("default");
  const [fill, setFill] = useState<"light" | "dark">("light");

  return (
    <DocsLayout
      title="Button"
      description="A tactile 3D push button engineered with physical extrusion depth, inset bevel highlights, and click kinematics."
    >
      {/* 1. Preview */}
      <ComponentPreview
        noBorder
        className="rounded-[28px] bg-[#f7f7f6] transition-colors duration-200 dark:bg-[#171717]"
        canvasClassName="min-h-[380px] p-8 bg-[#f7f7f6] transition-colors duration-200 dark:bg-[#171717]"
        controlsClassName="bg-[#f7f7f6] dark:bg-[#171717]"
        controls={
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                Variant
              </label>
              <div className="mt-2.5">
                <SelectBar<ButtonVariant>
                  size="xs"
                  items={VARIANT_OPTIONS}
                  value={variant}
                  onChange={setVariant}
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

            <div>
              <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                Fill
              </label>
              <div className="mt-2.5">
                <SelectBar<"light" | "dark">
                  size="xs"
                  items={[
                    { key: "light", label: "Light", icon: <SunIcon size={12} weight="bold" /> },
                    { key: "dark", label: "Dark", icon: <MoonIcon size={12} weight="bold" /> },
                  ]}
                  value={fill}
                  onChange={setFill}
                  ariaLabel="Select button fill mode"
                />
              </div>
            </div>
          </div>
        }
      >
        <div data-theme={fill} className="py-8">
          <Button variant={variant} size={size} theme={fill}>
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
