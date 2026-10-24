"use client";

import React, { useState } from "react";
import { LabelInput } from "@/components/ui/label-input";
import { SelectBar } from "@/components/ui/select-bar";
import { TextboxIcon } from "@phosphor-icons/react";
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
      { text: "LabelInput", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/label-input"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [{ text: "export default function", cls: "text-[#f43f5e]" }, { text: " LoginDemo() {" }],
  },
  {
    num: 4,
    parts: [
      { text: "  const [email, setEmail] = useState(" },
      { text: '""', cls: "text-[#0284c7]" },
      { text: ");" },
    ],
  },
  {
    num: 5,
    parts: [
      { text: "  const [password, setPassword] = useState(" },
      { text: '""', cls: "text-[#0284c7]" },
      { text: ");" },
    ],
  },
  { num: 6, parts: [{ text: "" }] },
  { num: 7, parts: [{ text: "  return (" }] },
  {
    num: 8,
    parts: [{ text: '    <div className="flex flex-col gap-4">' }],
  },
  {
    num: 9,
    parts: [
      { text: "      <", cls: "text-slate-500" },
      { text: "LabelInput", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 10,
    parts: [{ text: '        field="Email"' }],
  },
  {
    num: 11,
    parts: [{ text: "        corner={20}" }],
  },
  {
    num: 12,
    parts: [{ text: "        value={email}" }],
  },
  {
    num: 13,
    parts: [{ text: "        onChange={(e) => setEmail(e.target.value)}" }],
  },
  {
    num: 14,
    parts: [{ text: "      />", cls: "text-slate-500" }],
  },
  { num: 15, parts: [{ text: "" }] },
  {
    num: 16,
    parts: [
      { text: "      <", cls: "text-slate-500" },
      { text: "LabelInput", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 17,
    parts: [{ text: '        field="Password"' }],
  },
  {
    num: 18,
    parts: [{ text: "        corner={20}" }],
  },
  {
    num: 19,
    parts: [{ text: "        value={password}" }],
  },
  {
    num: 20,
    parts: [{ text: "        onChange={(e) => setPassword(e.target.value)}" }],
  },
  {
    num: 21,
    parts: [{ text: "      />", cls: "text-slate-500" }],
  },
  {
    num: 22,
    parts: [{ text: "    </div>" }],
  },
  { num: 23, parts: [{ text: "  );" }] },
  { num: 24, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { useState } from "react";
import { LabelInput } from "@/components/ui/label-input";

export default function LoginDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <LabelInput
        field="Email"
        corner={20}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <LabelInput
        field="Password"
        corner={20}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "field",
    type: '"Email" | "Password" | string',
    default: '"Email"',
    desc: 'The field type and placeholder label. When set to "Password", enables secure password masking and the eye visibility toggle.',
  },
  {
    name: "label",
    type: "string",
    default: "undefined",
    desc: "Custom floating label text to override the preset field title.",
  },
  {
    name: "corner",
    type: "number",
    default: "20",
    desc: "Corner radius in pixels. Clamped between 0 (sharp rectangle) and 26 (full rounded pill).",
  },
  {
    name: "width",
    type: "number",
    default: "280",
    desc: "Component container width in pixels.",
  },
  {
    name: "height",
    type: "number",
    default: "52",
    desc: "Component container height in pixels.",
  },
  {
    name: "showcase",
    type: "boolean",
    default: "false",
    desc: "When true, suppresses the virtual keyboard on mobile touchscreen devices (ideal for demos and showcases).",
  },
  {
    name: "value",
    type: "string | number",
    default: "undefined",
    desc: "Controlled input value.",
  },
  {
    name: "onChange",
    type: "(e: ChangeEvent<HTMLInputElement>) => void",
    default: "undefined",
    desc: "Standard change event handler fired whenever text is input.",
  },
  {
    name: "className",
    type: "string",
    default: '""',
    desc: "Optional Tailwind CSS class names applied to the outer container.",
  },
];

export default function LabelInputDocumentationPage() {
  const [field, setField] = useState<string>("Email");
  const [demoValue, setDemoValue] = useState<string>("");

  return (
    <DocsLayout
      title="Label Input"
      description="A field whose label is its placeholder until focused. On focus the label lifts into the top edge with a letter-by-letter hop while the perimeter outline parts under the label from its middle outward."
      icon={<TextboxIcon size={16} />}
    >
      {/* 1. Interactive Preview */}
      <ComponentPreview
        canvasClassName="min-h-[280px] p-8"
        controls={
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">Field Type</label>
              <p className="text-[11px] text-slate-400">
                Switch between Email, Password (with eye toggle), and Username
              </p>
            </div>
            <SelectBar
              items={[
                { key: "Email", label: "Email" },
                { key: "Password", label: "Password" },
                { key: "Username", label: "Username" },
              ]}
              value={field}
              onChange={(key) => {
                setField(key);
                setDemoValue("");
              }}
              size="sm"
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center py-6">
          <LabelInput
            field={field}
            value={demoValue}
            onChange={(e) => setDemoValue(e.target.value)}
          />
          <p className="mt-6 text-xs text-slate-400">
            Click inside to focus · Watch the label hop and the top notch part outward
          </p>
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="label-input" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="LabelInput" props={PROPS_DATA} />

      {/* 5. Examples */}
      <section>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Examples</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Card A: Pill Form */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-900">Pill Shape (`corner={26}`)</h3>
              <p className="mt-1 text-xs text-slate-500">
                Full semi-circular capsules with proportional notch offsets.
              </p>
            </div>
            <div className="flex min-h-[160px] items-center justify-center bg-[#F9FAFB] p-6">
              <LabelInput field="Email" corner={26} />
            </div>
          </div>

          {/* Card B: Sharp Rectangular */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-900">Modern Box (`corner={8}`)</h3>
              <p className="mt-1 text-xs text-slate-500">
                Crisp architectural borders with subtle 8px fillets.
              </p>
            </div>
            <div className="flex min-h-[160px] items-center justify-center bg-[#F9FAFB] p-6">
              <LabelInput field="Password" corner={8} />
            </div>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
