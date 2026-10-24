"use client";

import React from "react";
import { Counter } from "@/components/ui/counter";
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
      { text: "Counter", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/counter"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " CounterDemo() {" },
    ],
  },
  { num: 4, parts: [{ text: "  return (" }] },
  {
    num: 5,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "Counter", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 6,
    parts: [{ text: "      bounce", cls: "text-purple-600" }, { text: "={45}" }],
  },
  {
    num: 7,
    parts: [{ text: "      stagger", cls: "text-purple-600" }, { text: "={45}" }],
  },
  {
    num: 8,
    parts: [{ text: "      blur", cls: "text-purple-600" }, { text: "={50}" }],
  },
  {
    num: 9,
    parts: [{ text: "      corner", cls: "text-purple-600" }, { text: "={16}" }],
  },
  {
    num: 10,
    parts: [{ text: "      start", cls: "text-purple-600" }, { text: "={95}" }],
  },
  { num: 11, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 12, parts: [{ text: "  );" }] },
  { num: 13, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { Counter } from "@/components/ui/counter";

export default function CounterDemo() {
  return (
    <Counter
      bounce={45}
      stagger={45}
      blur={50}
      corner={16}
      start={95}
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "bounce",
    type: "number",
    default: "45",
    desc: "How lively a digit lands (0..100). Sets damping ratio and stiffness.",
  },
  {
    name: "stagger",
    type: "number",
    default: "45",
    desc: "Milliseconds between one column moving and the next (0..120). Creates rolling ripple carries.",
  },
  {
    name: "blur",
    type: "number",
    default: "50",
    desc: "Motion smear intensity for rapidly spinning digits (0..100).",
  },
  {
    name: "corner",
    type: "number",
    default: "16",
    desc: "Slab container corner radius in pixels.",
  },
  {
    name: "start",
    type: "number",
    default: "95",
    desc: "Initial count value when uncontrolled.",
  },
  {
    name: "value",
    type: "number",
    default: "undefined",
    desc: "Controlled count value.",
  },
  {
    name: "onChange",
    type: "(value: number) => void",
    default: "undefined",
    desc: "Callback fired whenever the count changes via button click, long-press acceleration, drag, or coasting fling.",
  },
];

export default function CounterDocumentationPage() {
  return (
    <DocsLayout
      title="Counter"
      description="Rolling odometer counter with forward-only column rolling, staggered carry ripples, velocity blur smear, and drag coasting physics."
    >
      {/* 1. Preview */}
      <ComponentPreview canvasClassName="min-h-[320px] p-8">
        <div className="py-6">
          <Counter bounce={45} stagger={45} blur={50} corner={16} start={95} />
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="counter" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="Counter" props={PROPS_DATA} />
    </DocsLayout>
  );
}
