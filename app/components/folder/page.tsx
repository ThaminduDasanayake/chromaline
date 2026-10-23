"use client";

import React, { useState } from "react";
import { Folder } from "@/components/ui/folder";
import { SelectBar } from "@/components/ui/select-bar";
import { TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon } from "@phosphor-icons/react";
import {
  DocsLayout,
  ComponentPreview,
  InstallationSection,
  UsageSection,
  PropsTable,
  PropItem,
} from "@/components/docs";

const COLOR_PRESETS = [
  { name: "Purple", body: "#E461F5", dark: "#C137D5", light: "#F9D8FD" },
  { name: "Blue", body: "#4FA7FF", dark: "#1A82E0", light: "#CCE5FF" },
  { name: "Green", body: "#68DB7B", dark: "#37B954", light: "#D2F6D8" },
  { name: "Yellow", body: "#FFDE55", dark: "#DFBC1F", light: "#FFF4C2" },
  { name: "Orange", body: "#FFA85F", dark: "#E08433", light: "#FFE3CC" },
  { name: "Red", body: "#FF6C6C", dark: "#DF4144", light: "#FFD1D2" },
  { name: "Gray", body: "#ADACB0", dark: "#88888E", light: "#E4E3E6" },
  { name: "White", body: "#FFFFFF", dark: "#232327", light: "#E0E0E4" },
];

const TAB_POSITIONS = [
  {
    key: "left" as const,
    label: "Left",
    icon: <TextAlignLeftIcon size={14} weight="bold" />,
  },
  {
    key: "center" as const,
    label: "Center",
    icon: <TextAlignCenterIcon size={14} weight="bold" />,
  },
  {
    key: "right" as const,
    label: "Right",
    icon: <TextAlignRightIcon size={14} weight="bold" />,
  },
];

const CODE_EXAMPLE_LINES = [
  {
    num: 1,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "Folder", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/folder"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " FolderDemo() {" },
    ],
  },
  { num: 4, parts: [{ text: "  return", cls: "text-[#f43f5e]" }, { text: " (" }] },
  {
    num: 5,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "Folder", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 6,
    parts: [{ text: "      bodyColor", cls: "text-purple-600" }, { text: '="#E461F5"' }],
  },
  {
    num: 7,
    parts: [{ text: "      darkOutline", cls: "text-purple-600" }, { text: '="#C137D5"' }],
  },
  {
    num: 8,
    parts: [{ text: "      lightOutline", cls: "text-purple-600" }, { text: '="#F9D8FD"' }],
  },
  {
    num: 9,
    parts: [{ text: "      tabPosition", cls: "text-purple-600" }, { text: '="center"' }],
  },
  {
    num: 10,
    parts: [{ text: "      className", cls: "text-purple-600" }, { text: '="w-56 h-auto"' }],
  },
  { num: 11, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 12, parts: [{ text: "  );" }] },
  { num: 13, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { Folder } from "@/components/ui/folder";

export default function FolderDemo() {
  return (
    <Folder
      bodyColor="#E461F5"
      darkOutline="#C137D5"
      lightOutline="#F9D8FD"
      tabPosition="center"
      className="w-56 h-auto"
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "bodyColor",
    type: "string",
    default: '"#E461F5"',
    desc: "Hex fill color for the folder card face.",
  },
  {
    name: "darkOutline",
    type: "string",
    default: '"#C137D5"',
    desc: "Stroke color for silhouette outline, header line, and active tab dot.",
  },
  {
    name: "lightOutline",
    type: "string",
    default: '"#F9D8FD"',
    desc: "Stroke color for the 4 ruled lines and inactive punch dots.",
  },
  {
    name: "tabPosition",
    type: '"left" | "center" | "right"',
    default: '"center"',
    desc: "Physical horizontal position of the rounded tab on the top edge.",
  },
  {
    name: "depth",
    type: "boolean | number",
    default: "true",
    desc: "Renders an offset back face to create realistic 3D cardstock bevel thickness.",
  },
  {
    name: "borderWidth",
    type: "number | string",
    default: "1.2",
    desc: "Stroke thickness for the folder silhouette outline and divider lines.",
  },
  {
    name: "folderIndex",
    type: "number",
    default: "0",
    desc: "Folder index (0 to 7) to automatically derive tab position and active punch dot.",
  },
  {
    name: "showLines",
    type: "boolean",
    default: "true",
    desc: "Whether to display the 4 horizontal ruled lines.",
  },
  {
    name: "className",
    type: "string",
    default: '"w-44 h-auto"',
    desc: "Optional styling and dimension classes for the container or SVG.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    default: "undefined",
    desc: "Optional nested content or modal card rendered inside the folder.",
  },
];

export default function FolderPage() {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedTabPos, setSelectedTabPos] = useState<"left" | "center" | "right">("center");

  const activeColor = COLOR_PRESETS[selectedColorIdx];

  return (
    <DocsLayout
      title="Folder"
      description="A standalone forward-facing folder card with exact 84×61 vector proportions, filleted tabs, 4 ruled lines, and 8 punch dots."
    >
      {/* 1. Preview */}
      <ComponentPreview
        controls={
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <label className="text-xs font-semibold text-slate-900">Colorway</label>
              <div className="mt-2.5">
                <SelectBar
                  variant="swatches"
                  size="xs"
                  items={COLOR_PRESETS.map((preset, idx) => ({
                    key: String(idx),
                    color: preset.body,
                    darkOutline: preset.dark,
                    label: preset.name,
                  }))}
                  value={String(selectedColorIdx)}
                  onChange={(k) => setSelectedColorIdx(Number(k))}
                  ariaLabel="Select folder color"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-900">Tab Position</label>
              <div className="mt-2.5">
                <SelectBar<"left" | "center" | "right">
                  size="xs"
                  items={TAB_POSITIONS}
                  value={selectedTabPos}
                  onChange={setSelectedTabPos}
                  ariaLabel="Select tab position"
                />
              </div>
            </div>
          </div>
        }
      >
        <div className="py-8">
          <Folder
            bodyColor={activeColor.body}
            darkOutline={activeColor.dark}
            lightOutline={activeColor.light}
            tabPosition={selectedTabPos}
            className="h-auto w-64 drop-shadow-md transition-all"
          />
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="folder" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="Folder" props={PROPS_DATA} />
    </DocsLayout>
  );
}
