"use client";

import React, { useState } from "react";
import { Folder } from "@/components/ui/folder";
import { SelectBar } from "@/components/ui/select-bar";
import { TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from "@phosphor-icons/react";

export const FOLDER_COLOR_PRESETS = [
  { name: "Purple", body: "#E461F5", dark: "#232327", light: "#F9D8FD" },
  { name: "Blue", body: "#4FA7FF", dark: "#232327", light: "#CCE5FF" },
  { name: "Green", body: "#68DB7B", dark: "#232327", light: "#D2F6D8" },
  { name: "Yellow", body: "#FFDE55", dark: "#232327", light: "#FFF4C2" },
  { name: "Orange", body: "#FFA85F", dark: "#232327", light: "#FFE3CC" },
  { name: "Red", body: "#FF6C6C", dark: "#232327", light: "#FFD1D2" },
  { name: "Gray", body: "#ADACB0", dark: "#232327", light: "#E4E3E6" },
  { name: "White", body: "#FFFFFF", dark: "#232327", light: "#E0E0E4" },
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
