"use client";

import React, { useState } from "react";
import { Folder } from "@/components/ui/folder";
import { SelectBar } from "@/components/ui/select-bar";
import { TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from "@phosphor-icons/react";
import { FolderColorSelectBar, FOLDER_COLOR_PRESETS } from "./folder-color-select-bar";

export { FOLDER_COLOR_PRESETS } from "./folder-color-select-bar";

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

export function FolderCardPreview({ showControls = false }: { showControls?: boolean } = {}) {
  const [selectedColorKey, setSelectedColorKey] = useState("purple");
  const [selectedFolderTab, setSelectedFolderTab] = useState<"left" | "center" | "right">("center");

  const activeColor =
    FOLDER_COLOR_PRESETS.find((p) => p.name.toLowerCase() === selectedColorKey) ||
    FOLDER_COLOR_PRESETS[FOLDER_COLOR_PRESETS.length - 1];

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
      {showControls && (
        <div className="absolute inset-x-0 bottom-4 flex flex-wrap items-center justify-center gap-2 px-2">
          {/* Color Swatches with Elastic Indicator */}
          <FolderColorSelectBar
            value={selectedColorKey}
            onChange={(key) => setSelectedColorKey(key)}
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
      )}
    </>
  );
}
