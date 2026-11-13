"use client";

import React, { useState } from "react";
import { LabelTextarea } from "@/components/ui/label-textarea";
import { TextboxIcon } from "@phosphor-icons/react";
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
      { text: "LabelTextarea", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/label-textarea"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " FeedbackForm() {" },
    ],
  },
  {
    num: 4,
    parts: [
      { text: "  const [message, setMessage] = useState(" },
      { text: '""', cls: "text-[#0284c7]" },
      { text: ");" },
    ],
  },
  { num: 5, parts: [{ text: "" }] },
  { num: 6, parts: [{ text: "  return (" }] },
  {
    num: 7,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "LabelTextarea", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 8,
    parts: [{ text: "      label", cls: "text-purple-600" }, { text: '="Feedback"' }],
  },
  {
    num: 9,
    parts: [{ text: "      value", cls: "text-purple-600" }, { text: "={message}" }],
  },
  {
    num: 10,
    parts: [
      { text: "      onChange", cls: "text-purple-600" },
      { text: "={(e) => setMessage(e.target.value)}" },
    ],
  },
  {
    num: 11,
    parts: [{ text: "      minHeight", cls: "text-purple-600" }, { text: "={96}" }],
  },
  {
    num: 12,
    parts: [{ text: "      showCount", cls: "text-purple-600" }, { text: "={true}" }],
  },
  {
    num: 13,
    parts: [{ text: "      maxLength", cls: "text-purple-600" }, { text: "={300}" }],
  },
  { num: 14, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 15, parts: [{ text: "  );" }] },
  { num: 16, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { useState } from "react";
import { LabelTextarea } from "@/components/ui/label-textarea";

export default function FeedbackForm() {
  const [message, setMessage] = useState("");

  return (
    <LabelTextarea
      label="Feedback"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      minHeight={96}
      showCount
      maxLength={300}
    />
  );
}`;

const LABEL_TEXTAREA_CSS = `/* Add keyframes to your globals.css */
@keyframes lbi-hop {
  0%, 100% {
    transform: translateY(0);
  }
  38% {
    transform: translateY(-3px);
  }
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "label",
    type: "string",
    default: '"Message"',
    desc: "Floating field label text that hops character-by-character on focus.",
  },
  {
    name: "corner",
    type: "number",
    default: "18",
    desc: "Outer contour border-radius in pixels.",
  },
  {
    name: "minHeight",
    type: "number",
    default: "96",
    desc: "Initial minimum height of the textarea in pixels before auto-expansion.",
  },
  {
    name: "maxHeight",
    type: "number",
    default: "320",
    desc: "Maximum height threshold before internal scrolling begins.",
  },
  {
    name: "width",
    type: "number",
    default: "undefined",
    desc: "Fixed width in pixels. If omitted, fluidly stretches to fit parent container width.",
  },
  {
    name: "showCount",
    type: "boolean",
    default: "false",
    desc: "Renders a subtle monospace character counter at the bottom right.",
  },
  {
    name: "maxLength",
    type: "number",
    default: "undefined",
    desc: "Standard maximum character length constraint.",
  },
  {
    name: "theme",
    type: '"light" | "dark"',
    default: '"light"',
    desc: "Visual theme mode matching surrounding canvas.",
  },
];

export default function LabelTextareaDocumentationPage() {
  const [theme, setTheme] = useComponentTheme();
  const [value, setValue] = useState(
    "Chromaline explores physical tactile interactions with vector hairlines, center-parting notch physics, and auto-expanding geometry."
  );
  const [corner, setCorner] = useState(18);
  const [showCount, setShowCount] = useState(true);

  return (
    <DocsLayout
      title="Label Textarea"
      description="An auto-expanding multiline textarea with dynamic SVG border notch physics, letter-by-letter hopping labels, and continuous height growth."
      icon={<TextboxIcon size={14} weight="bold" />}
    >
      {/* 1. Preview */}
      <ComponentPreview
        theme={theme}
        canvasClassName="min-h-[380px] p-8"
        controls={
          <div className="flex flex-col gap-6">
            {/* Theme Mode */}
            <ThemeControl
              value={theme}
              onChange={setTheme}
              ariaLabel="Select label textarea theme mode"
            />

            {/* Corner Radius Slider */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Corner Radius
                </label>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                  Perimeter fillet arc: {corner}px
                </p>
              </div>
              <input
                type="range"
                min={0}
                max={32}
                value={corner}
                onChange={(e) => setCorner(Number(e.target.value))}
                className="w-32 accent-slate-900 dark:accent-white"
              />
            </div>

            {/* Character Count Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Character Counter
                </label>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                  Display subtle length counter
                </p>
              </div>
              <input
                type="checkbox"
                checked={showCount}
                onChange={(e) => setShowCount(e.target.checked)}
                className="h-4 w-4 rounded-sm accent-slate-900 dark:accent-white"
              />
            </div>
          </div>
        }
      >
        <div className="flex w-full max-w-[380px] items-center justify-center py-6">
          <LabelTextarea
            label="Thoughts & Notes"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            corner={corner}
            showCount={showCount}
            maxLength={250}
            theme={theme}
          />
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="label-textarea" />

      {/* 3. Usage */}
      <UsageSection
        componentName="label-textarea"
        codeText={CODE_EXAMPLE_TEXT}
        codeLines={CODE_EXAMPLE_LINES}
        cssText={LABEL_TEXTAREA_CSS}
      />

      {/* 4. Props */}
      <PropsTable componentName="LabelTextarea" props={PROPS_DATA} />
    </DocsLayout>
  );
}
