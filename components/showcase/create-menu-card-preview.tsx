"use client";

import React from "react";
import { Create } from "@/components/ui/create-menu";
import { useTheme } from "@/components/providers/theme-provider";

export function CreateMenuCardPreview() {
  const { theme } = useTheme();
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Create corner={20} theme={theme} />
    </div>
  );
}
