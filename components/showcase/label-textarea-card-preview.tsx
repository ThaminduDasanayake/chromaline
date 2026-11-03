"use client";

import React, { useState } from "react";
import { LabelTextarea } from "@/components/ui/label-textarea";
import { useTheme } from "@/components/providers/theme-provider";

export function LabelTextareaCardPreview() {
  const [val, setVal] = useState("");
  const { theme } = useTheme();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-[320px] items-center justify-center">
        <LabelTextarea
          label="Feedback"
          corner={18}
          minHeight={96}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          theme={theme}
          showCount
          maxLength={200}
        />
      </div>
    </div>
  );
}
