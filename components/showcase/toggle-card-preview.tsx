"use client";

import React, { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "@/components/providers/theme-provider";

export function ToggleCardPreview() {
  const [checked, setChecked] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="flex items-center justify-center">
        <Toggle
          checked={checked}
          onChange={setChecked}
          stretch={36}
          speed={50}
          size="default"
          theme={theme === "dark" ? "dark" : "light"}
        />
      </div>
    </div>
  );
}
