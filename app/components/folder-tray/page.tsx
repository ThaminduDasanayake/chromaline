"use client";

import React from "react";
import { FolderTrayPreview, LinkFolderTrayPreview } from "@/components/showcase";
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
      { text: '"#E54F10"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "darkOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#7C2D12"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "lightOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#FED7AA"', cls: "text-[#0284c7]" },
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
      { text: '"#0A90D2"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "darkOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#075985"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "lightOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#BAE6FD"', cls: "text-[#0284c7]" },
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
      { text: '"#53F399"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "darkOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#047857"', cls: "text-[#0284c7]" },
      { text: ", " },
      { text: "lightOutline", cls: "text-purple-600" },
      { text: ": " },
      { text: '"#D1FAE5"', cls: "text-[#0284c7]" },
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
    { id: "p1", name: "Project 1", bodyColor: "#E54F10", darkOutline: "#7C2D12", lightOutline: "#FED7AA" },
    { id: "p2", name: "Project 2", bodyColor: "#0A90D2", darkOutline: "#075985", lightOutline: "#BAE6FD" },
    { id: "p3", name: "Project 3", bodyColor: "#53F399", darkOutline: "#047857", lightOutline: "#D1FAE5" },
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

      {/* Extra Example: Link Navigation Tray */}
      <section>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Examples</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Direct Link Navigation</h3>
            <p className="mt-1 text-xs text-slate-500">
              Each folder item specifies an <code>href</code> destination. Hovering over a card
              stands it up, and clicking opens the link.
            </p>
          </div>
          <div className="bg-[#F9FAFB]">
            <LinkFolderTrayPreview />
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
