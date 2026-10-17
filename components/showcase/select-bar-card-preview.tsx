"use client";

import React, { useState } from "react";
import { SelectBar, SelectBarItem } from "@/components/ui/select-bar";
import { CodeIcon, EyeIcon, PaintBrushIcon, SparkleIcon } from "@phosphor-icons/react";

const NAV_ITEMS: SelectBarItem<"design" | "code" | "preview" | "motion">[] = [
  { key: "design", label: "Design", icon: <PaintBrushIcon size={13} weight="bold" /> },
  { key: "code", label: "Code", icon: <CodeIcon size={13} weight="bold" /> },
  { key: "preview", label: "Preview", icon: <EyeIcon size={13} weight="bold" /> },
  { key: "motion", label: "Motion", icon: <SparkleIcon size={13} weight="bold" /> },
];

const SWATCH_ITEMS = [
  { key: "white", color: "#FFFFFF", darkOutline: "#232327" },
  { key: "orange", color: "#E54F10", darkOutline: "#7C2D12" },
  { key: "blue", color: "#0A90D2", darkOutline: "#075985" },
  { key: "emerald", color: "#059669", darkOutline: "#047857" },
  { key: "violet", color: "#8B5CF6", darkOutline: "#4C1D95" },
];

export function SelectBarCardPreview() {
  const [activeTab, setActiveTab] = useState<"design" | "code" | "preview" | "motion">("design");
  const [activeSwatch, setActiveSwatch] = useState("orange");

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 p-4">
      {/* Primary Kinetic Glass Segmented Bar */}
      <SelectBar<"design" | "code" | "preview" | "motion">
        items={NAV_ITEMS}
        value={activeTab}
        onChange={setActiveTab}
        size="sm"
        ariaLabel="Showcase segmented tabs"
      />

      {/* Kinetic Color Swatches */}
      <div className="absolute inset-x-0 bottom-4 flex items-center justify-center">
        <SelectBar
          variant="swatches"
          size="xs"
          items={SWATCH_ITEMS}
          value={activeSwatch}
          onChange={setActiveSwatch}
          ariaLabel="Showcase color swatches"
        />
      </div>
    </div>
  );
}
