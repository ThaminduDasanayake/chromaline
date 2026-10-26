"use client";

import React, { useState } from "react";
import { WakeSlider } from "@/components/ui/wake-slider";
import { useTheme } from "@/components/providers/theme-provider";

export function WakeSliderCardPreview() {
  const [value, setValue] = useState(58);
  const { theme } = useTheme();

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <WakeSlider bars={36} wake={60} value={value} onChange={setValue} theme={theme} />
    </div>
  );
}
