"use client";

import React, { useState } from "react";
import { Folder } from "@/components/ui/folder";
import { SelectBar } from "@/components/ui/select-bar";
import { TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from "@phosphor-icons/react";

export const FOLDER_COLOR_PRESETS = [
  { name: "Original", body: "#FFFFFF", dark: "#232327", light: "#E0E0E4" },
  { name: "Orange", body: "#E54F10", dark: "#7C2D12", light: "#FED7AA" },
  { name: "Electric Blue", body: "#0A90D2", dark: "#075985", light: "#BAE6FD" },
  { name: "Mint Green", body: "#53F399", dark: "#047857", light: "#D1FAE5" },
  { name: "Violet", body: "#8B5CF6", dark: "#4C1D95", light: "#DDD6FE" },
  { name: "Amber", body: "#F59E0B", dark: "#92400E", light: "#FEF08A" },
  { name: "Rose", body: "#F43F5E", dark: "#881337", light: "#FECDD3" },
];

export const TAB_POSITIONS = [
  {
    key: "left" as const,
    label: "Left",
    icon: <TextAlignLeftIcon size={13} weight="bold" />,
  },
  {
    key: "center" as const,
    label: "Center",
    icon: <TextAlignCenterIcon size={13} weight="bold" />,
  },
  {
    key: "right" as const,
    label: "Right",
    icon: <TextAlignRightIcon size={13} weight="bold" />,
  },
];

export function FolderCardPreview() {
  const [selectedFolderColor, setSelectedFolderColor] = useState(0);
  const [selectedFolderTab, setSelectedFolderTab] = useState<"left" | "center" | "right">("center");

  const activeColor = FOLDER_COLOR_PRESETS[selectedFolderColor] || FOLDER_COLOR_PRESETS[0];

  return (
    <>
      <Folder
        bodyColor={activeColor.body}
        darkOutline={activeColor.dark}
        lightOutline={activeColor.light}
        tabPosition={selectedFolderTab}
        className="h-auto w-52 drop-shadow-sm transition-all"
      />

      {/* Quick Interactive Color & Tab Controls */}
      <div className="absolute inset-x-0 bottom-4 flex flex-wrap items-center justify-center gap-2 px-2">
        {/* Color Swatches with Elastic Indicator */}
        <SelectBar
          variant="swatches"
          size="xs"
          items={FOLDER_COLOR_PRESETS.map((preset, idx) => ({
            key: String(idx),
            color: preset.body,
            darkOutline: preset.dark,
            label: preset.name,
          }))}
          value={String(selectedFolderColor)}
          onChange={(key) => setSelectedFolderColor(Number(key))}
          ariaLabel="Select folder color"
        />

        {/* Tab Position Switcher with Elastic Indicator */}
        <SelectBar<"left" | "center" | "right">
          size="xs"
          items={TAB_POSITIONS}
          value={selectedFolderTab}
          onChange={setSelectedFolderTab}
          ariaLabel="Select tab position"
        />
      </div>
    </>
  );
}
