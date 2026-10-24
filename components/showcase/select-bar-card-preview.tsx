"use client";

import React, { useState } from "react";
import { SelectBar, SelectBarItem } from "@/components/ui/select-bar";
import { FolderColorSelectBar } from "./folder-color-select-bar";
import {
  CodeIcon,
  EyeIcon,
  PaintBrushIcon,
  SparkleIcon,
  CursorIcon,
  PencilSimpleIcon,
  SquareIcon,
  TextTIcon,
} from "@phosphor-icons/react";

const NAV_ITEMS: SelectBarItem<"design" | "code" | "preview" | "motion">[] = [
  { key: "design", label: "Design", icon: <PaintBrushIcon size={13} weight="bold" /> },
  { key: "code", label: "Code", icon: <CodeIcon size={13} weight="bold" /> },
  { key: "preview", label: "Preview", icon: <EyeIcon size={13} weight="bold" /> },
  { key: "motion", label: "Motion", icon: <SparkleIcon size={13} weight="bold" /> },
];

const TOOLBAR_ITEMS: SelectBarItem<"cursor" | "draw" | "text" | "shapes">[] = [
  { key: "cursor", icon: <CursorIcon size={14} weight="bold" />, title: "Cursor" },
  { key: "draw", icon: <PencilSimpleIcon size={14} weight="bold" />, title: "Draw" },
  { key: "text", icon: <TextTIcon size={14} weight="bold" />, title: "Text" },
  { key: "shapes", icon: <SquareIcon size={14} weight="bold" />, title: "Shapes" },
];

export function SelectBarCardPreview() {
  const [activeTab, setActiveTab] = useState<"design" | "code" | "preview" | "motion">("design");
  const [activeTool, setActiveTool] = useState<"cursor" | "draw" | "text" | "shapes">("cursor");
  const [activeSwatch, setActiveSwatch] = useState("purple");

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      {/* Primary Kinetic Glass Segmented Bar */}
      <SelectBar<"design" | "code" | "preview" | "motion">
        items={NAV_ITEMS}
        value={activeTab}
        onChange={setActiveTab}
        size="sm"
        ariaLabel="Showcase segmented tabs"
      />

      {/* Kinetic Icon-Only Dock */}
      <SelectBar<"cursor" | "draw" | "text" | "shapes">
        items={TOOLBAR_ITEMS}
        value={activeTool}
        onChange={setActiveTool}
        size="sm"
        ariaLabel="Showcase icon tools dock"
      />

      {/* Kinetic Color Swatches */}
      <FolderColorSelectBar
        size="xs"
        value={activeSwatch}
        onChange={(key) => setActiveSwatch(key)}
        ariaLabel="Showcase color swatches"
      />
    </div>
  );
}
