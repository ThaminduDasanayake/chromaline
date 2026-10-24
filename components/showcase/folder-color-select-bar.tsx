"use client";

import React, { useState } from "react";
import { SelectBar, SelectBarItem } from "@/components/ui/select-bar";

export interface FolderColorPreset {
  name: string;
  body: string;
  dark: string;
  light: string;
}

/**
 * 8 macOS Finder Tag Colorways for Chromaline Folders.
 * Ordered from clean White through Gray, Red, Orange, Yellow, Green, Blue, to Purple.
 */
export const FOLDER_COLOR_PRESETS: FolderColorPreset[] = [
  { name: "White", body: "#FFFFFF", dark: "#232327", light: "#E0E0E4" },
  { name: "Gray", body: "#ADACB0", dark: "#232327", light: "#E4E3E6" },
  { name: "Red", body: "#FF6C6C", dark: "#232327", light: "#FFD1D2" },
  { name: "Orange", body: "#FFA85F", dark: "#232327", light: "#FFE3CC" },
  { name: "Yellow", body: "#FFDE55", dark: "#232327", light: "#FFF4C2" },
  { name: "Green", body: "#68DB7B", dark: "#232327", light: "#D2F6D8" },
  { name: "Blue", body: "#4FA7FF", dark: "#232327", light: "#CCE5FF" },
  { name: "Purple", body: "#E461F5", dark: "#232327", light: "#F9D8FD" },
];

/**
 * SelectBarItem items representing each color swatch.
 */
export const FOLDER_COLOR_SWATCHES: SelectBarItem[] = FOLDER_COLOR_PRESETS.map((preset) => ({
  key: preset.name.toLowerCase(),
  color: preset.body,
  darkOutline: preset.dark,
  label: preset.name,
}));

export interface FolderColorSelectBarProps {
  /** Selected color key ("white", "purple", etc.) or index (0 to 7) */
  value?: string | number;
  /** Initial selected color key or index (default: "purple") */
  defaultValue?: string | number;
  /** Callback fired when a color swatch is clicked */
  onChange?: (key: string, preset: FolderColorPreset, index: number) => void;
  /** SelectBar size variant (default: "xs") */
  size?: "xs" | "sm" | "default";
  className?: string;
  ariaLabel?: string;
}

/**
 * FolderColorSelectBar
 *
 * Reusable kinetic swatch dock showcasing the 8 reversed Chromaline folder colors
 * (White -> Gray -> Red -> Orange -> Yellow -> Green -> Blue -> Purple).
 * Supports controlled/uncontrolled state by color key or preset index.
 */
export function FolderColorSelectBar({
  value,
  defaultValue = "purple",
  onChange,
  size = "xs",
  className = "",
  ariaLabel = "Select folder color",
}: FolderColorSelectBarProps) {
  const resolveKey = (v?: string | number): string => {
    if (v === undefined) return "purple";
    if (typeof v === "number") {
      return FOLDER_COLOR_PRESETS[v]?.name.toLowerCase() || "purple";
    }
    const num = Number(v);
    if (!isNaN(num) && num >= 0 && num < FOLDER_COLOR_PRESETS.length && String(num) === v) {
      return FOLDER_COLOR_PRESETS[num]?.name.toLowerCase() || "purple";
    }
    return v.toLowerCase();
  };

  const [internalKey, setInternalKey] = useState(() => resolveKey(defaultValue));
  const isControlled = value !== undefined;
  const currentKey = isControlled ? resolveKey(value) : internalKey;

  const handleChange = (key: string) => {
    if (!isControlled) {
      setInternalKey(key);
    }
    const idx = FOLDER_COLOR_PRESETS.findIndex((p) => p.name.toLowerCase() === key);
    const validIdx = idx !== -1 ? idx : 0;
    const preset = FOLDER_COLOR_PRESETS[validIdx];
    onChange?.(key, preset, validIdx);
  };

  return (
    <SelectBar
      variant="swatches"
      size={size}
      items={FOLDER_COLOR_SWATCHES}
      value={currentKey}
      onChange={handleChange}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
}
