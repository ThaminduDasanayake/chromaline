"use client";

import React from "react";
import { Palette } from "@/components/ui/palette";

export function PaletteCardPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="flex items-center justify-center">
        <Palette count={4} corner={14} morph={50} theme="light" />
      </div>
    </div>
  );
}
