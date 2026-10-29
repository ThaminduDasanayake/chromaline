"use client";

import React from "react";
import { Counter } from "@/components/ui/counter";
import { useTheme } from "@/components/providers/theme-provider";

export function CounterCardPreview() {
  const { theme } = useTheme();
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Counter bounce={45} stagger={45} blur={50} corner={16} start={22} theme={theme} />
    </div>
  );
}
