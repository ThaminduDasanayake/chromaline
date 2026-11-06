"use client";

import React, { useState } from "react";
import { Stack } from "@/components/ui/stack";
import { SelectBar } from "@/components/ui/select-bar";
import { CardsIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
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
      { text: "Stack", cls: "text-slate-900 font-semibold dark:text-white" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/stack"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [{ text: "export default function", cls: "text-[#f43f5e]" }, { text: " StackDemo() {" }],
  },
  { num: 4, parts: [{ text: "  return (" }] },
  {
    num: 5,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "Stack", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 6,
    parts: [{ text: "      count", cls: "text-purple-600" }, { text: "={5}" }],
  },
  {
    num: 7,
    parts: [{ text: "      spread", cls: "text-purple-600" }, { text: "={85}" }],
  },
  {
    num: 8,
    parts: [{ text: "      bounce", cls: "text-purple-600" }, { text: "={5}" }],
  },
  {
    num: 9,
    parts: [{ text: "      scatter", cls: "text-purple-600" }, { text: "={0}" }],
  },
  {
    num: 10,
    parts: [{ text: "      corner", cls: "text-purple-600" }, { text: "={14}" }],
  },
  { num: 11, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 12, parts: [{ text: "  );" }] },
  { num: 13, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { Stack } from "@/components/ui/stack";

export default function StackDemo() {
  return (
    <Stack
      count={5}
      spread={85}
      bounce={5}
      scatter={0}
      corner={14}
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "count",
    type: "number",
    default: "5",
    desc: "Number of cards in the pile, clamped between 3 and 6.",
  },
  {
    name: "spread",
    type: "number",
    default: "85",
    desc: "How wide the fan opens on approach (0..100).",
  },
  {
    name: "bounce",
    type: "number",
    default: "5",
    desc: "Spring kinematics tuning for card settling and overshoot (0..100).",
  },
  {
    name: "scatter",
    type: "number",
    default: "0",
    desc: "Seeded natural imperfection and angular disagreement in pile (0..100).",
  },
  {
    name: "corner",
    type: "number",
    default: "14",
    desc: "Card corner radius in pixels. Scales proportionally when viewed full size.",
  },
  {
    name: "images",
    type: "string[]",
    default: "DEFAULT_PHOTOS",
    desc: "Optional custom image URLs displayed on the cards.",
  },
  {
    name: "className",
    type: "string",
    default: '""',
    desc: "Optional additional CSS classes for styling wrapper.",
  },
];

type CountOption = "3" | "4" | "5" | "6";
type SpreadOption = "compact" | "default" | "wide";
type ScatterOption = "none" | "subtle" | "organic";

const SPREAD_VALUES: Record<SpreadOption, number> = {
  compact: 55,
  default: 85,
  wide: 100,
};

const SCATTER_VALUES: Record<ScatterOption, number> = {
  none: 0,
  subtle: 35,
  organic: 75,
};

export default function StackDocumentationPage() {
  const [theme, setTheme] = useComponentTheme();
  const [countOpt, setCountOpt] = useState<CountOption>("5");
  const [spreadOpt, setSpreadOpt] = useState<SpreadOption>("default");
  const [scatterOpt, setScatterOpt] = useState<ScatterOption>("none");

  const count = parseInt(countOpt, 10);
  const spread = SPREAD_VALUES[spreadOpt];
  const scatter = SCATTER_VALUES[scatterOpt];

  return (
    <DocsLayout
      title="Stack"
      description="A tactile card pile that fans out radially along an eccentric virtual pivot on hover and fluidly draws cards into full-frame 3D view on press."
      icon={<CardsIcon size={14} weight="bold" />}
    >
      {/* 1. Preview */}
      <ComponentPreview
        canvasClassName={cn(
          "min-h-[460px] p-6 sm:p-10 transition-colors duration-300",
          theme === "dark" ? "bg-[#0f0f0f]" : "bg-[#f7f7f6]"
        )}
        controls={
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
              {/* Card Count */}
              <div>
                <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Card Count
                </label>
                <div className="mt-2">
                  <SelectBar<CountOption>
                    size="xs"
                    items={[
                      { key: "3", label: "3" },
                      { key: "4", label: "4" },
                      { key: "5", label: "5" },
                      { key: "6", label: "6" },
                    ]}
                    value={countOpt}
                    onChange={setCountOpt}
                    ariaLabel="Select card count"
                  />
                </div>
              </div>

              {/* Fan Spread */}
              <div>
                <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Fan Spread
                </label>
                <div className="mt-2">
                  <SelectBar<SpreadOption>
                    size="xs"
                    items={[
                      { key: "compact", label: "Compact" },
                      { key: "default", label: "Default" },
                      { key: "wide", label: "Wide" },
                    ]}
                    value={spreadOpt}
                    onChange={setSpreadOpt}
                    ariaLabel="Select fan spread"
                  />
                </div>
              </div>

              {/* Scatter */}
              <div>
                <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Scatter Disagreement
                </label>
                <div className="mt-2">
                  <SelectBar<ScatterOption>
                    size="xs"
                    items={[
                      { key: "none", label: "None" },
                      { key: "subtle", label: "Subtle" },
                      { key: "organic", label: "Organic" },
                    ]}
                    value={scatterOpt}
                    onChange={setScatterOpt}
                    ariaLabel="Select pile scatter"
                  />
                </div>
              </div>

              {/* Theme Mode */}
              <ThemeControl
                layout="vertical"
                value={theme}
                onChange={setTheme}
                ariaLabel="Select stack theme mode"
              />
            </div>
          </div>
        }
      >
        <div className="flex w-full items-center justify-center py-6">
          <Stack count={count} spread={spread} scatter={scatter} bounce={5} corner={14} />
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="stack" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="Stack" props={PROPS_DATA} />
    </DocsLayout>
  );
}
