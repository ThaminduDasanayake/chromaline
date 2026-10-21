"use client";

import React, { useState } from "react";
import { Toggle, ToggleSize, ToggleSizePreset, ToggleVariant } from "@/components/ui/toggle";
import { SelectBar } from "@/components/ui/select-bar";
import { ToggleRightIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
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
      { text: "Toggle", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/toggle"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " ToggleDemo() {" },
    ],
  },
  {
    num: 4,
    parts: [
      { text: "  const [checked, setChecked] = useState(" },
      { text: "false", cls: "text-[#0284c7]" },
      { text: ");" },
    ],
  },
  { num: 5, parts: [{ text: "" }] },
  { num: 6, parts: [{ text: "  return (" }] },
  {
    num: 7,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "Toggle", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 8,
    parts: [{ text: "      checked={checked}" }],
  },
  {
    num: 9,
    parts: [{ text: "      onChange={setChecked}" }],
  },
  {
    num: 10,
    parts: [{ text: "      stretch={36}" }],
  },
  {
    num: 11,
    parts: [{ text: "      speed={50}" }],
  },
  {
    num: 12,
    parts: [{ text: '      size="default"' }],
  },
  {
    num: 13,
    parts: [{ text: '      variant="default" // "default" (light) or "dark"' }],
  },
  {
    num: 14,
    parts: [{ text: "    />", cls: "text-slate-500" }],
  },
  { num: 15, parts: [{ text: "  );" }] },
  { num: 16, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

export default function ToggleDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <Toggle
      checked={checked}
      onChange={setChecked}
      stretch={36}
      speed={50}
      size="default" // or arbitrary pixel number like size={24}
      variant="default" // "default" (light) or "dark"
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "checked",
    type: "boolean",
    default: "undefined",
    desc: "Controlled checked state of the toggle.",
  },
  {
    name: "defaultChecked",
    type: "boolean",
    default: "false",
    desc: "Initial state when used uncontrolled.",
  },
  {
    name: "onChange",
    type: "(checked: boolean) => void",
    default: "undefined",
    desc: "Callback fired when the toggle state flips.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "default" | "lg" | number',
    default: '"default"',
    desc: "Size preset or arbitrary track height in pixels (e.g. 24, 32, 60). The SVG blur and travel adapt dynamically.",
  },
  {
    name: "variant",
    type: '"default" | "dark"',
    default: '"default"',
    desc: "Theme variant: 'default' (Light) or 'dark' (Dark).",
  },
  {
    name: "stretch",
    type: "number",
    default: "36",
    desc: "Droplet stretch intensity (0..100) determining trailing droplet lag and necking.",
  },
  {
    name: "speed",
    type: "number",
    default: "50",
    desc: "Spring crossing stiffness (0..100) for how quickly the thumb settles across the track.",
  },
  {
    name: "width",
    type: "number",
    default: "undefined",
    desc: "Optional custom track width override in pixels (defaults to 2 × height).",
  },
  {
    name: "height",
    type: "number",
    default: "undefined",
    desc: "Optional custom track height override in pixels.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: "Disables interaction and applies dimmed opacity.",
  },
  {
    name: "ariaLabel",
    type: "string",
    default: '"Toggle"',
    desc: "Accessible label for screen readers.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    desc: "Additional CSS classes applied to the root element.",
  },
  {
    name: "style",
    type: "React.CSSProperties",
    default: "undefined",
    desc: "Inline styles for the root toggle element.",
  },
];

const THEME_OPTIONS: { key: ToggleVariant; label: string }[] = [
  { key: "default", label: "Light" },
  { key: "dark", label: "Dark" },
];

export default function ToggleDocumentationPage() {
  const [checked, setChecked] = useState(false);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [presetSize, setPresetSize] = useState<ToggleSizePreset>("default");
  const [customPixelHeight, setCustomPixelHeight] = useState(30);
  const [variant, setVariant] = useState<ToggleVariant>("default");
  const [stretch, setStretch] = useState(36);
  const [speed, setSpeed] = useState(50);

  const activeSize: ToggleSize = isCustomSize ? customPixelHeight : presetSize;

  const handleReset = () => {
    setChecked(false);
    setIsCustomSize(false);
    setPresetSize("default");
    setCustomPixelHeight(30);
    setVariant("default");
    setStretch(36);
    setSpeed(50);
  };

  return (
    <DocsLayout
      title="Toggle"
      description="A tactile liquid goo switch driven by two-blob spring kinematics. Inverted monochrome design with light and dark themes, supporting standard presets or arbitrary pixel sizing."
      icon={<ToggleRightIcon size={14} weight="bold" />}
    >
      {/* 1. Preview Canvas & Playground */}
      <ComponentPreview
        canvasClassName={`min-h-[320px] p-8 transition-colors duration-300 ${
          variant === "dark" ? "bg-[#18181b]" : "bg-[#f4f4f5]"
        }`}
        controls={
          <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_0.8fr_1fr_1fr_auto]">
            {/* Size control */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900">
                  {isCustomSize ? `Height (${customPixelHeight}px)` : "Size"}
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomSize(!isCustomSize)}
                  className="text-[10px] font-medium text-sky-600 hover:text-sky-700 underline"
                >
                  {isCustomSize ? "Presets" : "Custom"}
                </button>
              </div>
              <div className="mt-2.5">
                {isCustomSize ? (
                  <input
                    type="range"
                    min="18"
                    max="72"
                    value={customPixelHeight}
                    onChange={(e) => setCustomPixelHeight(Number(e.target.value))}
                    className="isocraft-slider"
                  />
                ) : (
                  <SelectBar<ToggleSizePreset>
                    size="xs"
                    items={[
                      { key: "xs", label: "XS" },
                      { key: "sm", label: "SM" },
                      { key: "default", label: "MD" },
                      { key: "lg", label: "LG" },
                    ]}
                    value={presetSize}
                    onChange={setPresetSize}
                  />
                )}
              </div>
            </div>

            {/* Theme: Light / Dark */}
            <div>
              <label className="text-xs font-semibold text-slate-900">Theme</label>
              <div className="mt-2.5">
                <SelectBar<ToggleVariant>
                  size="xs"
                  items={THEME_OPTIONS}
                  value={variant}
                  onChange={setVariant}
                />
              </div>
            </div>

            {/* Stretch slider */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900">Stretch</label>
                <span className="font-mono text-xs text-slate-500">{stretch}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={stretch}
                onChange={(e) => setStretch(Number(e.target.value))}
                className="isocraft-slider mt-3.5"
              />
            </div>

            {/* Speed slider */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900">Speed</label>
                <span className="font-mono text-xs text-slate-500">{speed}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="isocraft-slider mt-3.5"
              />
            </div>

            {/* Reset button */}
            <div className="flex justify-end pb-0.5 sm:justify-start">
              <button
                type="button"
                onClick={handleReset}
                title="Reset to defaults"
                aria-label="Reset to defaults"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors shadow-2xs cursor-pointer"
              >
                <ArrowCounterClockwiseIcon size={14} weight="bold" />
              </button>
            </div>
          </div>
        }
      >
        <div className="flex w-full items-center justify-center py-12">
          <Toggle
            checked={checked}
            onChange={setChecked}
            stretch={stretch}
            speed={speed}
            size={activeSize}
            variant={variant}
          />
        </div>
      </ComponentPreview>

      {/* 3. Installation */}
      <div className="mt-12">
        <InstallationSection componentName="toggle" />
      </div>

      {/* 4. Usage */}
      <div className="mt-12">
        <UsageSection
          codeLines={CODE_EXAMPLE_LINES}
          codeText={CODE_EXAMPLE_TEXT}
        />
      </div>

      {/* 5. Props Reference */}
      <div className="mt-12">
        <PropsTable props={PROPS_DATA} />
      </div>
    </DocsLayout>
  );
}
