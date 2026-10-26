"use client";

import React from "react";
import { Aspect } from "@/components/ui/aspect-ratio";
import { useTheme } from "@/components/providers/theme-provider";

export function AspectRatioCardPreview() {
  const { theme } = useTheme();
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Aspect corner={20} morph={50} theme={theme} />
    </div>
  );
}
