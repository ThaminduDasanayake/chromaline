"use client";

import React, { useState } from "react";
import { WakeSlider } from "@/components/ui/wake-slider";
import { SlidersHorizontalIcon } from "@phosphor-icons/react";
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
      { text: "WakeSlider", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/wake-slider"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " SliderDemo() {" },
    ],
  },
  { num: 4, parts: [{ text: "  return (" }] },
  {
    num: 5,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "WakeSlider", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 6,
    parts: [{ text: "      bars", cls: "text-purple-600" }, { text: "={36}" }],
  },
  {
    num: 7,
    parts: [{ text: "      wake", cls: "text-purple-600" }, { text: "={60}" }],
  },
  {
    num: 8,
    parts: [{ text: "      defaultValue", cls: "text-purple-600" }, { text: "={50}" }],
  },
  { num: 9, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 10, parts: [{ text: "  );" }] },
  { num: 11, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { WakeSlider } from "@/components/ui/wake-slider";

export default function SliderDemo() {
  return (
    <WakeSlider
      bars={36}
      wake={60}
      defaultValue={50}
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "bars",
    type: "number",
    default: "36",
    desc: "Number of thin data marks forming the slider track (clamped between 12 and 64).",
  },
  {
    name: "wake",
    type: "number",
    default: "60",
    desc: "Kinetic wave energy intensity on pointer pass (0..100). Higher values produce taller bar flings.",
  },
  {
    name: "value",
    type: "number",
    default: "undefined",
    desc: "Controlled numeric value.",
  },
  {
    name: "defaultValue",
    type: "number",
    default: "50",
    desc: "Initial uncontrolled slider value.",
  },
  {
    name: "min",
    type: "number",
    default: "0",
    desc: "Minimum range boundary.",
  },
  {
    name: "max",
    type: "number",
    default: "100",
    desc: "Maximum range boundary.",
  },
  {
    name: "step",
    type: "number",
    default: "1",
    desc: "Step resolution for keyboard increment/decrement.",
  },
  {
    name: "theme",
    type: '"light" | "dark"',
    default: '"light"',
    desc: "Visual theme mode: light minimal track or dark slate track.",
  },
  {
    name: "showValue",
    type: "boolean",
    default: "true",
    desc: "Whether the monospace numeric readout is rendered beside the track.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: "Disables interaction and dims opacity.",
  },
  {
    name: "onChange",
    type: "(value: number) => void",
    default: "undefined",
    desc: "Callback fired continuously as the value updates during drag or keypress.",
  },
];

export default function WakeSliderPage() {
  const [theme, setTheme] = useComponentTheme<"light" | "dark">();
  const [value, setValue] = useState(54);

  return (
    <DocsLayout
      title="Wake Slider"
      description="A range control with no thumb: a row of thin vertical bars that wake into tall dynamic energy waves when crossed fast, decaying exponentially back to rest."
      icon={<SlidersHorizontalIcon size={14} weight="bold" />}
    >
      {/* 1. Preview */}
      <ComponentPreview
        canvasClassName={`min-h-[320px] p-8 transition-colors duration-300 ${
          theme === "dark" ? "bg-[#09090b]" : "bg-[#F9FAFB]"
        }`}
        controls={
          <div className="flex flex-col gap-6">
            <ThemeControl
              value={theme}
              onChange={setTheme}
              ariaLabel="Select wake slider theme mode"
            />
          </div>
        }
      >
        <div className="py-6">
          <WakeSlider bars={36} wake={60} value={value} onChange={setValue} theme={theme} />
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="wake-slider" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="WakeSlider" props={PROPS_DATA} />
    </DocsLayout>
  );
}
