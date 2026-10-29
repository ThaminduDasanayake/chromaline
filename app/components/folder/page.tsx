"use client";

import React, { useState } from "react";
import { Folder } from "@/components/ui/folder";
import { SelectBar } from "@/components/ui/select-bar";
import { FolderColorSelectBar, FOLDER_COLOR_PRESETS } from "@/components/showcase";
import { TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon } from "@phosphor-icons/react";
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
    parts: [{ text: "      darkOutline", cls: "text-purple-600" }, { text: '="#232327"' }],
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
      darkOutline="#232327"
      lightOutline="#F9D8FD"
      tabPosition="center"
      className="w-56 h-auto"
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "theme",
    type: '"light" | "dark" | "auto"',
    default: '"auto"',
    desc: 'Visual theme mode for cardstock and hairlines. Automatically adapts to dark mode when set to "auto".',
  },
  {
    name: "bodyColor",
    type: "string",
    default: '"#E461F5" / "#1a1a1a"',
    desc: "Hex fill color for the folder card face. In dark mode, falls back to #1a1a1a.",
  },
  {
    name: "darkOutline",
    type: "string",
    default: '"#232327" / "#d0d6e0"',
    desc: "Stroke color for silhouette outline, header line, and active tab dot.",
  },
  {
    name: "lightOutline",
    type: "string",
    default: '"#F9D8FD" / "#3e3e44"',
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
  const [theme, setTheme] = useComponentTheme<"light" | "dark">();
  const [selectedColorKey, setSelectedColorKey] = useState("purple");
  const [selectedTabPos, setSelectedTabPos] = useState<"left" | "center" | "right">("center");

  const activeColor =
    FOLDER_COLOR_PRESETS.find((p) => p.name.toLowerCase() === selectedColorKey) ||
    FOLDER_COLOR_PRESETS[FOLDER_COLOR_PRESETS.length - 1];

  return (
    <DocsLayout
      title="Folder"
      description="A standalone forward-facing folder card with exact 84×61 vector proportions, filleted tabs, 4 ruled lines, and 8 punch dots."
    >
      {/* 1. Preview */}
      <ComponentPreview
        canvasClassName={`min-h-[360px] p-8 transition-colors duration-300 ${
          theme === "dark" ? "bg-[#0f0f0f]" : "bg-[#f7f7f6]"
        }`}
        controls={
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <ThemeControl
                value={theme}
                onChange={setTheme}
                ariaLabel="Select folder theme mode"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Colorway
                </label>
                <div className="mt-2.5">
                  <FolderColorSelectBar
                    value={selectedColorKey}
                    onChange={(key) => setSelectedColorKey(key)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Tab Position
                </label>
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
          </div>
        }
      >
        <div className="py-8">
          <Folder
            theme={theme}
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
