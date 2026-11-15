"use client";

import React from "react";
import { TimeScrubber } from "@/components/ui/time-scrubber";
import { useTheme } from "@/components/providers/theme-provider";

export function TimeScrubberCardPreview() {
  const { theme } = useTheme();

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <TimeScrubber
        step={5}
        momentum={50}
        format="12h"
        corner={20}
        defaultValue={570}
        theme={theme}
      />
    </div>
  );
}
