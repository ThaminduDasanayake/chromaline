"use client";

import React, { useState } from "react";
import { LabelInput } from "@/components/ui/label-input";
import { useTheme } from "@/components/providers/theme-provider";

export function LabelInputCardPreview() {
  const [val, setVal] = useState("");
  const { theme } = useTheme();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="flex items-center justify-center">
        <LabelInput
          field="Email"
          corner={20}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          theme={theme}
        />
      </div>
    </div>
  );
}
