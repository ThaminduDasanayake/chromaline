"use client";

import React, { useState } from "react";
import { Like, LikeEffect, LikeColor } from "@/components/ui/like";
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
      { text: "Like", cls: "text-slate-900 font-semibold dark:text-zinc-100" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/like"', cls: "text-[#0284c7]" },
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
      { text: "Like", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 6,
    parts: [{ text: "      start", cls: "text-purple-600" }, { text: "={1300}" }],
  },
  {
    num: 7,
    parts: [{ text: "      effect", cls: "text-purple-600" }, { text: '="Firework"' }],
  },
  {
    num: 8,
    parts: [{ text: "      color", cls: "text-purple-600" }, { text: '="Red"' }],
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

const CODE_EXAMPLE_TEXT = `import { Like } from "@/components/ui/like";

export default function Demo() {
  return (
    <Like
      start={1300}
      effect="Firework"
      color="Red"
      burst={50}
      corner={22}
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "start",
    type: "number",
    default: "1300",
    desc: "Initial likes count before user interaction in uncontrolled mode.",
  },
  {
    name: "effect",
    type: '"Bloom" | "Firework"',
    default: '"Bloom"',
    desc: "Particle kinematics on like: expanding hollow ring with 7 spoke confetti or 12 ballistic firework sparks.",
  },
  {
    name: "color",
    type: '"Red" | "Ink"',
    default: '"Red"',
    desc: "Active liked colorway: vibrant crimson (#e5484d) or contextual monochrome ink.",
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
    name: "liked",
    type: "boolean",
    default: "undefined",
    desc: "Controlled like state.",
  },
  {
    name: "count",
    type: "number",
    default: "undefined",
    desc: "Controlled likes numerical value.",
  },
  {
    name: "onLikeChange",
    type: "(liked: boolean, count: number) => void",
    default: "undefined",
    desc: "Callback fired when like state toggles with next like state and updated count.",
  },
];

export default function LikeDocumentationPage() {
  const [fill, setFill] = useState<"light" | "dark">("dark");
  const [stroke, setStroke] = useState<"off" | "on">("off");
  const [color, setColor] = useState<LikeColor>("Red");
  const [effect, setEffect] = useState<LikeEffect>("Bloom");
  const [burst, setBurst] = useState<number>(50);
  const [corner, setCorner] = useState<number>(22);

  return (
    <DocsLayout
      title="Like"
      description="Press the heart and it pops with a burst while the count rolls up a digit."
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
                  <SelectBar<LikeColor>
                    size="xs"
                    items={[
                      { key: "Red", label: "Red" },
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
                  <SelectBar<LikeEffect>
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
          <Like
            start={1300}
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
      <InstallationSection componentName="like" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="Like" props={PROPS_DATA} />
    </DocsLayout>
  );
}
