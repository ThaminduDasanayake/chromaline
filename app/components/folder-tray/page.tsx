"use client";

import React from "react";
import { FolderTrayPreview } from "@/components/showcase";
import {
  ComponentPreview,
  DocsLayout,
  InstallationSection,
  PropItem,
  PropsTable,
  UsageSection,
} from "@/components/docs";

const CODE_EXAMPLE_LINES = [
  {
    num: 1,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "FolderTray", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/folder-tray"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [{ text: "export default function", cls: "text-[#f43f5e]" }, { text: " Workspace() {" }],
  },
  { num: 4, parts: [{ text: "  const", cls: "text-[#f43f5e]" }, { text: " folders = [" }] },
  {
    num: 5,
    parts: [
      { text: "    { " },
      { text: "id", cls: "text-purple-600" },
      { text: ": " },
      { text: '"p1"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "name", cls: "text-purple-600" },
      { text: ": " },
      { text: '"Project 1"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "bodyColor", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#E461F5"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "darkOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#232327"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "lightOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#F9D8FD"', cls: "text-[#0284c7]" },
      { text: " }," },
    ],
  },
  {
    num: 6,
    parts: [
      { text: "    { " },
      { text: "id", cls: "text-purple-600" },
      { text: ": " },
      { text: '"p2"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "name", cls: "text-purple-600" },
      { text: ": " },
      { text: '"Project 2"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "bodyColor", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#4FA7FF"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "darkOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#232327"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "lightOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#CCE5FF"', cls: "text-[#0284c7]" },
      { text: " }," },
    ],
  },
  {
    num: 7,
    parts: [
      { text: "    { " },
      { text: "id", cls: "text-purple-600" },
      { text: ": " },
      { text: '"p3"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "name", cls: "text-purple-600" },
      { text: ": " },
      { text: '"Project 3"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "bodyColor", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#68DB7B"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "darkOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#232327"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "lightOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#D2F6D8"', cls: "text-[#0284c7]" },
      { text: " }," },
    ],
  },
  { num: 8, parts: [{ text: "  ];" }] },
  { num: 9, parts: [{ text: "" }] },
  { num: 10, parts: [{ text: "  return (" }] },
  {
    num: 11,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "FolderTray", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 12,
    parts: [{ text: "      folders={folders}" }],
  },
  {
    num: 13,
    parts: [{ text: '      variant="color"' }],
  },
  {
    num: 14,
    parts: [{ text: "      onOpen={(f) => console.log(f.name)}" }],
  },
  { num: 15, parts: [{ text: "    />", cls: "text-slate-500" }] },
  { num: 16, parts: [{ text: "  );" }] },
  { num: 17, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { FolderTray } from "@/components/ui/folder-tray";

export default function Workspace() {
  const folders = [
    { id: "p1", name: "Project 1", bodyColor: "#E461F5", darkOutline: "#232327", lightOutline: "#F9D8FD" },
    { id: "p2", name: "Project 2", bodyColor: "#4FA7FF", darkOutline: "#232327", lightOutline: "#CCE5FF" },
    { id: "p3", name: "Project 3", bodyColor: "#68DB7B", darkOutline: "#232327", lightOutline: "#D2F6D8" },
  ];

  return (
    <FolderTray
      folders={folders}
      variant="color"
      onOpen={(f) => console.log(f.name)}
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "folders",
    type: "FolderItem[]",
    default: "required",
    desc: "Array of 1 to 8 folder items. Accepts bodyColor, darkOutline, lightOutline, href, target, and content.",
  },
  {
    name: "onOpen",
    type: "(folder: FolderItem) => void",
    default: "undefined",
    desc: "Callback triggered when any folder is clicked. If omitted and folder has href, navigates automatically.",
  },
  {
    name: "onHover",
    type: "(folder: FolderItem | null) => void",
    default: "undefined",
    desc: "Callback fired whenever a folder is hovered or scrubbed over in the 3D tray.",
  },
  {
    name: "onSelect",
    type: "(folder: FolderItem) => void",
    default: "undefined",
    desc: "Callback fired whenever folder selection changes on hover or click.",
  },
  {
    name: "variant",
    type: '"color" | "original"',
    default: '"color"',
    desc: "Visual theme: vibrant colored folders or monochrome white line-art.",
  },
  {
    name: "defaultSelected",
    type: "number",
    default: "0",
    desc: "Index of the initially active front card (0 to 7).",
  },
  {
    name: "intensity",
    type: "number",
    default: "0.65",
    desc: "Kinematic spring lean intensity (0 to 1).",
  },
  {
    name: "className",
    type: "string",
    default: '""',
    desc: "Optional container styling classes.",
  },
];

export default function FolderTrayDocumentationPage() {
  return (
    <DocsLayout
      title="Folder Tray"
      description="Interactive 3D isometric tray of folders with custom solid colorways and click-to-open actions. Built with kinematic physics."
    >
      {/* 1. Preview */}
      <ComponentPreview canvasClassName="p-0">
        <FolderTrayPreview />
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="folder-tray" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="FolderTray" props={PROPS_DATA} />
    </DocsLayout>
  );
}
