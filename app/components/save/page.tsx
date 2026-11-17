"use client";

import React, { useState } from "react";
import { Save, SaveEffect, SaveColor } from "@/components/ui/save";
import { SelectBar } from "@/components/ui/select-bar";
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
      { text: "Save", cls: "text-slate-900 font-semibold dark:text-zinc-100" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/save"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [{ text: "export default function", cls: "text-[#f43f5e]" }, { text: " Demo() {" }],
  },
  { num: 4, parts: [{ text: "  return (" }] },
  {
    num: 5,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "Save", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 6,
    parts: [{ text: "      start", cls: "text-purple-600" }, { text: "={840}" }],
  },
  {
    num: 7,
    parts: [{ text: "      effect", cls: "text-purple-600" }, { text: '="Bloom"' }],
  },
  {
    num: 8,
    parts: [{ text: "      color", cls: "text-purple-600" }, { text: '="Amber"' }],
  },
  {
    num: 9,
    parts: [{ text: "      burst", cls: "text-purple-600" }, { text: "={50}" }],
  },
  {
    num: 10,
    parts: [{ text: "      corner", cls: "text-purple-600" }, { text: "={22}" }],
  },
  { num: 11, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 12, parts: [{ text: "  );" }] },
  { num: 13, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { Save } from "@/components/ui/save";

export default function Demo() {
  return (
    <Save
      start={840}
      effect="Bloom"
      color="Amber"
      burst={50}
      corner={22}
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "start",
    type: "number",
    default: "840",
    desc: "Initial saves count before user interaction in uncontrolled mode.",
  },
  {
    name: "effect",
    type: '"Bloom" | "Firework"',
    default: '"Bloom"',
    desc: "Particle kinematics on save: expanding hollow ring with 6 spoke confetti or 12 ballistic firework sparks.",
  },
  {
    name: "color",
    type: '"Amber" | "Ink"',
    default: '"Amber"',
    desc: "Active saved colorway: warm amber (#f59e0b) or contextual monochrome ink.",
  },
  {
    name: "burst",
    type: "number",
    default: "50",
    desc: "Particle flight trajectory distance scaling, from 0 to 100.",
  },
  {
    name: "corner",
    type: "number",
    default: "22",
    desc: "Button container corner radius in pixels (0..22).",
  },
  {
    name: "fill",
    type: '"light" | "dark" | "auto"',
    default: '"auto"',
    desc: "Surface pill fill mode: explicit white pill, explicit dark pill, or adaptive theme fill.",
  },
  {
    name: "stroke",
    type: "boolean",
    default: "false",
    desc: "Renders an inset 1px hairline edge highlight around the button boundary.",
  },
  {
    name: "saved",
    type: "boolean",
    default: "undefined",
    desc: "Controlled saved state.",
  },
  {
    name: "count",
    type: "number",
    default: "undefined",
    desc: "Controlled saves numerical value.",
  },
  {
    name: "onSaveChange",
    type: "(saved: boolean, count: number) => void",
    default: "undefined",
    desc: "Callback fired when save state toggles with next saved state and updated count.",
  },
];

export default function SaveDocumentationPage() {
  const [fill, setFill] = useState<"light" | "dark">("dark");
  const [stroke, setStroke] = useState<"off" | "on">("off");
  const [color, setColor] = useState<SaveColor>("Amber");
  const [effect, setEffect] = useState<SaveEffect>("Bloom");
  const [burst, setBurst] = useState<number>(50);
  const [corner, setCorner] = useState<number>(22);

  return (
    <DocsLayout
      title="Save"
      description="Press the bookmark and it springs to life with a burst while the count rolls up a digit."
    >
      {/* 1. Preview */}
      <ComponentPreview
        theme={fill}
        separated
        noBorder
        className="mb-8"
        canvasClassName="min-h-[380px] sm:min-h-[420px] p-8 bg-[#f2f2f4] dark:bg-[#171717]"
        controlsClassName="bg-[#f2f2f4] dark:bg-[#171717]"
        controls={
          <div className="flex flex-col gap-6">
            {/* Top Row: Select Bars */}
            <div className="flex flex-wrap items-center justify-between gap-6">
              {/* Fill */}
              <div>
                <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Fill
                </label>
                <div className="mt-2.5">
                  <SelectBar<"light" | "dark">
                    size="xs"
                    items={[
                      { key: "light", label: "Light" },
                      { key: "dark", label: "Dark" },
                    ]}
                    value={fill}
                    onChange={setFill}
                  />
                </div>
              </div>

              {/* Stroke */}
              <div>
                <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Stroke
                </label>
                <div className="mt-2.5">
                  <SelectBar<"off" | "on">
                    size="xs"
                    items={[
                      { key: "off", label: "Off" },
                      { key: "on", label: "On" },
                    ]}
                    value={stroke}
                    onChange={setStroke}
                  />
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Color
                </label>
                <div className="mt-2.5">
                  <SelectBar<SaveColor>
                    size="xs"
                    items={[
                      { key: "Amber", label: "Amber" },
                      { key: "Ink", label: "Ink" },
                    ]}
                    value={color}
                    onChange={setColor}
                  />
                </div>
              </div>

              {/* Effect */}
              <div>
                <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Effect
                </label>
                <div className="mt-2.5">
                  <SelectBar<SaveEffect>
                    size="xs"
                    items={[
                      { key: "Bloom", label: "Bloom" },
                      { key: "Firework", label: "Firework" },
                    ]}
                    value={effect}
                    onChange={setEffect}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Row: Sliders */}
            <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2">
              {/* Burst Slider */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                    Burst
                  </label>
                  <span className="font-mono text-xs text-slate-500 dark:text-zinc-400">
                    {burst}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={burst}
                  onChange={(e) => setBurst(Number(e.target.value))}
                  className="isocraft-slider mt-3.5"
                />
              </div>

              {/* Corner Radius Slider */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                    Corner
                  </label>
                  <span className="font-mono text-xs text-slate-500 dark:text-zinc-400">
                    {corner}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="22"
                  value={corner}
                  onChange={(e) => setCorner(Number(e.target.value))}
                  className="isocraft-slider mt-3.5"
                />
              </div>
            </div>
          </div>
        }
      >
        <div className="flex items-center justify-center py-6">
          <Save
            start={840}
            effect={effect}
            color={color}
            burst={burst}
            corner={corner}
            fill={fill}
            stroke={stroke === "on"}
          />
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="save" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="Save" props={PROPS_DATA} />
    </DocsLayout>
  );
}
