"use client";

import React, { useState } from "react";
import { TimeScrubber, TimeScrubberTheme, TimeScrubberFormat } from "@/components/ui/time-scrubber";
import { SelectBar } from "@/components/ui/select-bar";
import { ClockIcon } from "@phosphor-icons/react";
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
      { text: "TimeScrubber", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/time-scrubber"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " ScrubberDemo() {" },
    ],
  },
  { num: 4, parts: [{ text: "  return (" }] },
  {
    num: 5,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "TimeScrubber", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 6,
    parts: [{ text: "      step", cls: "text-purple-600" }, { text: '="5"' }],
  },
  {
    num: 7,
    parts: [{ text: "      momentum", cls: "text-purple-600" }, { text: "={50}" }],
  },
  {
    num: 8,
    parts: [{ text: "      format", cls: "text-purple-600" }, { text: '="12h"' }],
  },
  {
    num: 9,
    parts: [{ text: "      corner", cls: "text-purple-600" }, { text: "={20}" }],
  },
  { num: 10, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 11, parts: [{ text: "  );" }] },
  { num: 12, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { TimeScrubber } from "@/components/ui/time-scrubber";
// Alternatively: import { Scrub } from "@/components/ui/time-scrubber";

export default function ScrubberDemo() {
  return (
    <TimeScrubber
      step="5"
      momentum={50}
      format="12h"
      corner={20}
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "step",
    type: "number | string",
    default: "15",
    desc: "Snap resolution in minutes (e.g. 1, 5, 15, 30). The dial snaps to multiples of this step on release.",
  },
  {
    name: "momentum",
    type: "number",
    default: "50",
    desc: "Kinetic throw momentum carry distance (0..100). Higher values fling the ruler further across hours.",
  },
  {
    name: "format",
    type: '"12h" | "24h"',
    default: '"12h"',
    desc: "Time format displayed in readout and hour labels: 12-hour with AM/PM or 24-hour military notation.",
  },
  {
    name: "corner",
    type: "number",
    default: "20",
    desc: "Outer slab corner radius in pixels.",
  },
  {
    name: "value",
    type: "number",
    default: "undefined",
    desc: "Controlled time value in minutes from midnight (0..1439).",
  },
  {
    name: "defaultValue",
    type: "number",
    default: "570",
    desc: "Initial uncontrolled time in minutes (default is 570, corresponding to 9:30 AM).",
  },
  {
    name: "theme",
    type: '"light" | "dark"',
    default: '"light"',
    desc: "Visual theme mode: light slab with dark ink or dark slab with high-contrast inverted numerals.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: "Disables pointer drag and keyboard interaction.",
  },
  {
    name: "onChange",
    type: "(minutes: number) => void",
    default: "undefined",
    desc: "Callback fired continuously during dragging, flicking, and settling with the current minute.",
  },
];

export default function TimeScrubberPage() {
  const [theme, setTheme] = useState<TimeScrubberTheme>("light");
  const [format, setFormat] = useState<TimeScrubberFormat>("12h");
  const [step, setStep] = useState<string>("5");
  const [momentum, setMomentum] = useState<number>(50);
  const [corner, setCorner] = useState<number>(20);

  return (
    <DocsLayout
      title="Time Scrubber"
      description="A tactile time picker over a rolling ruler dial with inertia fling coasting, unified spring settling, and front-dial cylindrical tick projection."
      icon={<ClockIcon size={14} weight="bold" />}
    >
      {/* 1. Preview */}
      <ComponentPreview
        canvasClassName={`min-h-[380px] p-8 transition-colors duration-300 ${
          theme === "dark" ? "bg-[#1b1b1b]" : "bg-[#F9FAFB]"
        }`}
        controls={
          <div className="flex flex-col gap-6">
            {/* Theme Mode */}
            <ThemeControl
              value={theme}
              onChange={setTheme}
              ariaLabel="Select time scrubber theme mode"
            />

            {/* Time Format */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-900">Format</label>
                <p className="mt-0.5 text-xs text-slate-500">
                  12-hour with AM/PM or 24-hour military
                </p>
              </div>
              <SelectBar<TimeScrubberFormat>
                size="xs"
                items={[
                  { key: "12h", label: "12h" },
                  { key: "24h", label: "24h" },
                ]}
                value={format}
                onChange={setFormat}
                ariaLabel="Select time format"
              />
            </div>

            {/* Snap Step */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-900">Snap Step</label>
                <p className="mt-0.5 text-xs text-slate-500">
                  Ruler settling resolution in minutes
                </p>
              </div>
              <SelectBar<string>
                size="xs"
                items={[
                  { key: "1", label: "1m" },
                  { key: "5", label: "5m" },
                  { key: "15", label: "15m" },
                  { key: "30", label: "30m" },
                ]}
                value={step}
                onChange={setStep}
                ariaLabel="Select snap step"
              />
            </div>

            {/* Momentum Carry */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-900">Momentum Carry</label>
                <p className="mt-0.5 text-xs text-slate-500">Kinetic throw distance: {momentum}%</p>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={momentum}
                onChange={(e) => setMomentum(Number(e.target.value))}
                className="w-32 accent-slate-900"
              />
            </div>

            {/* Corner Radius */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-900">Corner Radius</label>
                <p className="mt-0.5 text-xs text-slate-500">Slab border radius: {corner}px</p>
              </div>
              <input
                type="range"
                min={0}
                max={32}
                value={corner}
                onChange={(e) => setCorner(Number(e.target.value))}
                className="w-32 accent-slate-900"
              />
            </div>
          </div>
        }
      >
        <div className="flex items-center justify-center py-8">
          <TimeScrubber
            step={step}
            momentum={momentum}
            format={format}
            corner={corner}
            theme={theme}
          />
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="time-scrubber" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="TimeScrubber" props={PROPS_DATA} />
    </DocsLayout>
  );
}
