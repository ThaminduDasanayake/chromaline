"use client";

import React from "react";
import { Checklist } from "@/components/ui/checklist";
import { useTheme } from "@/components/providers/theme-provider";

export function ChecklistCardPreview() {
  const { theme } = useTheme();
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Checklist corner={20} bounce={50} box={18} theme={theme} />
    </div>
  );
}
