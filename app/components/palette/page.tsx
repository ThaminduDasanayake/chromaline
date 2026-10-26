"use client";

import React, { useState } from "react";
import { Palette, PaletteTheme } from "@/components/ui/palette";
import { SelectBar } from "@/components/ui/select-bar";
import { PaletteIcon } from "@phosphor-icons/react";
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
      { text: "Palette", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/palette"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " PaletteDemo() {" },
    ],
  },
  { num: 4, parts: [{ text: "  return (" }] },
  {
    num: 5,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "Palette", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 6,
    parts: [{ text: "      count", cls: "text-purple-600" }, { text: "={4}" }],
  },
  {
    num: 7,
    parts: [{ text: "      corner", cls: "text-purple-600" }, { text: "={14}" }],
  },
  {
    num: 8,
    parts: [{ text: "      morph", cls: "text-purple-600" }, { text: "={50}" }],
  },
  {
    num: 9,
    parts: [{ text: '      theme="light" // "light" | "dark"' }],
  },
  { num: 10, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 11, parts: [{ text: "  );" }] },
  { num: 12, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { Palette } from "@/components/ui/palette";

export default function PaletteDemo() {
  return (
    <Palette
      count={4}
      corner={14}
      morph={50}
      theme="light"
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "count",
    type: "number",
    default: "4",
    desc: "Number of color swatches in the palette (clamped between 3 and 5).",
  },
  {
    name: "corner",
    type: "number",
    default: "14",
    desc: "Swatch corner radius in pixels (0..29, where 29 produces a full pill).",
  },
  {
    name: "morph",
    type: "number",
    default: "50",
    desc: "Morph speed factor (0..100). Governs how quickly the swatches draw into circles and settle.",
  },
  {
    name: "theme",
    type: '"light" | "dark"',
    default: '"light"',
    desc: "Visual color theme mode: 'light' or 'dark'.",
  },
  {
    name: "onGenerate",
    type: "(colors: string[]) => void",
    default: "undefined",
    desc: "Callback fired with the new array of hex color strings whenever the palette is regenerated.",
  },
  {
    name: "onCopy",
    type: "(hex: string) => void",
    default: "undefined",
    desc: "Callback fired when a color swatch is clicked to copy its hex string to the clipboard.",
  },
  {
    name: "className",
    type: "string",
    default: '""',
    desc: "Optional Tailwind CSS class names applied to the outer container.",
  },
];

export default function PaletteDocumentationPage() {
  const [theme, setTheme] = useState<PaletteTheme>("light");
  const [count, setCount] = useState<number>(4);
  const [corner, setCorner] = useState<number>(14);
  const [morph, setMorph] = useState<number>(50);
  const [lastCopied, setLastCopied] = useState<string | null>(null);

  return (
    <DocsLayout
      title="Palette"
      description="Tactile color generator powered by perceptual OKLCH color science, 5 generative harmonic moods (ramp, spread, pair, triad, accent), and liquid elastic overshoot kinematics."
      icon={<PaletteIcon size={16} />}
    >
      {/* 1. Interactive Preview */}
      <ComponentPreview
        canvasClassName={`min-h-[320px] p-8 transition-colors duration-300 ${
          theme === "dark" ? "bg-[#18181b]" : "bg-[#f4f4f5]"
        }`}
        controls={
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Theme control */}
            <ThemeControl
              layout="vertical"
              label="Theme"
              value={theme}
              onChange={setTheme}
              ariaLabel="Select palette theme mode"
            />

            {/* Count control */}
            <div>
              <label className="text-xs font-semibold text-slate-700">Swatches</label>
              <div className="mt-2.5">
                <SelectBar<string>
                  size="xs"
                  items={[
                    { key: "3", label: "3" },
                    { key: "4", label: "4" },
                    { key: "5", label: "5" },
                  ]}
                  value={String(count)}
                  onChange={(val) => setCount(Number(val))}
                />
              </div>
            </div>

            {/* Corner Radius */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Corner Radius</label>
                <span className="font-mono text-xs text-slate-500">{corner}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="29"
                value={corner}
                onChange={(e) => setCorner(Number(e.target.value))}
                className="isocraft-slider mt-3.5"
              />
            </div>

            {/* Morph Speed */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Morph Kinematics</label>
                <span className="font-mono text-xs text-slate-500">{morph}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={morph}
                onChange={(e) => setMorph(Number(e.target.value))}
                className="isocraft-slider mt-3.5"
              />
            </div>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center py-6">
          <Palette
            count={count}
            corner={corner}
            morph={morph}
            theme={theme}
            onCopy={setLastCopied}
          />

          {lastCopied && (
            <p className="animate-in fade-in mt-4 font-mono text-xs text-slate-500 duration-200">
              Copied <span className="font-semibold text-slate-800">{lastCopied}</span> to clipboard
            </p>
          )}
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="palette" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="Palette" props={PROPS_DATA} />
    </DocsLayout>
  );
}
