"use client";

import React, { useState } from "react";
import { Aspect, AspectTheme } from "@/components/ui/aspect-ratio";
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
      { text: "Aspect", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/aspect-ratio"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " AspectDemo() {" },
    ],
  },
  { num: 4, parts: [{ text: "  return (" }] },
  {
    num: 5,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "Aspect", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 6,
    parts: [{ text: "      corner", cls: "text-purple-600" }, { text: "={20}" }],
  },
  {
    num: 7,
    parts: [{ text: "      morph", cls: "text-purple-600" }, { text: "={50}" }],
  },
  { num: 8, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 9, parts: [{ text: "  );" }] },
  { num: 10, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { Aspect } from "@/components/ui/aspect-ratio";

export default function AspectDemo() {
  return (
    <Aspect
      corner={20}
      morph={50}
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "corner",
    type: "number",
    default: "20",
    desc: "Frame corner border radius in pixels (clamped between 0 and 40).",
  },
  {
    name: "morph",
    type: "number",
    default: "50",
    desc: "Kinematic morph rate tuning (0..100). 50 corresponds to the tuned 520ms duration.",
  },
  {
    name: "src",
    type: "string",
    default: "tactile 3:4 default",
    desc: "Optional image source URL (3:4 portrait ratio recommended for full non-cropped coverage).",
  },
  {
    name: "alt",
    type: "string",
    default: '"Cropped aspect view"',
    desc: "Accessibility alt text for screen readers.",
  },
  {
    name: "ratio",
    type: '"land" | "square" | "tall"',
    default: "undefined",
    desc: "Controlled aspect ratio format: 4:3 (land), 1:1 (square), or 3:4 (tall).",
  },
  {
    name: "defaultRatio",
    type: '"land" | "square" | "tall"',
    default: '"square"',
    desc: "Initial uncontrolled aspect ratio format.",
  },
  {
    name: "theme",
    type: '"light" | "dark"',
    default: '"light"',
    desc: "Visual theme mode: light minimal frame or dark slate frame.",
  },
  {
    name: "onRatioChange",
    type: '(ratio: "land" | "square" | "tall") => void',
    default: "undefined",
    desc: "Callback fired when the active crop format changes.",
  },
];

export default function AspectRatioPage() {
  const [theme, setTheme] = useState<AspectTheme>("light");

  return (
    <DocsLayout
      title="Aspect Ratio"
      description="Equal-area crop switcher where landscape, square, and portrait formats occupy the same surface area inside a fixed 276-square stage."
    >
      {/* 1. Preview */}
      <ComponentPreview
        canvasClassName={`min-h-[380px] p-8 transition-colors duration-300 ${
          theme === "dark" ? "bg-[#09090b]" : "bg-[#F9FAFB]"
        }`}
        controls={
          <div className="flex flex-col gap-6">
            <ThemeControl
              value={theme}
              onChange={setTheme}
              ariaLabel="Select aspect ratio theme mode"
            />
          </div>
        }
      >
        <div className="py-4">
          <Aspect corner={20} morph={50} theme={theme} />
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="aspect-ratio" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="Aspect" props={PROPS_DATA} />
    </DocsLayout>
  );
}
