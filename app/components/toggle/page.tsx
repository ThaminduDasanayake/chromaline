"use client";

import React, { useState } from "react";
import { Toggle, ToggleSize, ToggleVariant } from "@/components/ui/toggle";
import { SelectBar } from "@/components/ui/select-bar";
import { ToggleRightIcon } from "@phosphor-icons/react";
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
    parts: [{ text: '      variant="default"' }],
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
      size="default"
      variant="default"
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
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    desc: "Size variant: sm (72x36), default (92x46), or lg (112x56).",
  },
  {
    name: "variant",
    type: '"default" | "emerald" | "orange" | "indigo" | "dark"',
    default: '"default"',
    desc: "Color theme for the track, thumb, and border accents.",
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

const VARIANTS: { key: ToggleVariant; label: string }[] = [
  { key: "default", label: "Sky" },
  { key: "emerald", label: "Emerald" },
  { key: "orange", label: "Orange" },
  { key: "indigo", label: "Indigo" },
  { key: "dark", label: "Dark" },
];

export default function ToggleDocumentationPage() {
  const [checked, setChecked] = useState(false);
  const [size, setSize] = useState<ToggleSize>("default");
  const [variant, setVariant] = useState<ToggleVariant>("default");
  const [stretch, setStretch] = useState(36);
  const [speed, setSpeed] = useState(50);
  const [disabled, setDisabled] = useState(false);

  return (
    <DocsLayout
      title="Toggle"
      description="A tactile liquid goo switch driven by two-blob spring kinematics. A motion value thumb and trailing chasing drop stretch through an alpha-thresholded SVG filter as you drag or flick."
      icon={<ToggleRightIcon size={14} weight="bold" />}
    >
      {/* 1. Preview Canvas & Playground */}
      <ComponentPreview
        canvasClassName="min-h-[340px] p-8"
        controls={
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Size control */}
              <div>
                <label className="text-xs font-semibold text-slate-900">Size</label>
                <div className="mt-2.5">
                  <SelectBar<ToggleSize>
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

              {/* Variant control */}
              <div>
                <label className="text-xs font-semibold text-slate-900">Color Variant</label>
                <div className="mt-2.5">
                  <SelectBar<ToggleVariant>
                    size="xs"
                    items={VARIANTS}
                    value={variant}
                    onChange={setVariant}
                  />
                </div>
              </div>

              {/* Stretch slider */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-900">Stretch (Lag)</label>
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
                  <label className="text-xs font-semibold text-slate-900">Spring Speed</label>
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
            </div>

            {/* Toggle State & Disabled Checkbox */}
            <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4">
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Checked: <span className="font-mono font-semibold">{checked ? "true" : "false"}</span>
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(e) => setDisabled(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Disabled
              </label>

              <button
                type="button"
                onClick={() => {
                  setChecked(false);
                  setSize("default");
                  setVariant("default");
                  setStretch(36);
                  setSpeed(50);
                  setDisabled(false);
                }}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 underline"
              >
                Reset to defaults
              </button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center gap-6 py-6">
          <Toggle
            checked={checked}
            onChange={setChecked}
            stretch={stretch}
            speed={speed}
            size={size}
            variant={variant}
            disabled={disabled}
          />
          <p className="text-xs text-slate-400">
            Click to toggle or drag across smoothly · Fast drags pull an elongated goo bridge
          </p>
        </div>
      </ComponentPreview>

      {/* 2. Colorways Showcase */}
      <div className="mt-12 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900">All Theme Variants</h2>
        <p className="mt-1 text-xs text-slate-500">
          Chromaline palettes crafted with solid, opaque colors to pass through the alpha-thresholding SVG goo filter cleanly.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
          {VARIANTS.map((v) => (
            <div
              key={v.key}
              className="flex flex-col items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4"
            >
              <span className="text-[11px] font-semibold text-slate-600">{v.label}</span>
              <Toggle
                defaultChecked={v.key === "default" || v.key === "indigo"}
                variant={v.key}
                size="sm"
                stretch={40}
                speed={50}
              />
            </div>
          ))}
        </div>
      </div>

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
