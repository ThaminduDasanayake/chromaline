"use client";

import React from "react";
import { Palette } from "@/components/ui/palette";
import { useTheme } from "@/components/providers/theme-provider";

export function PaletteCardPreview() {
  const { theme } = useTheme();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="flex items-center justify-center">
        <Palette count={4} corner={14} morph={50} theme={theme} />
      </div>
    </div>
  );
}
