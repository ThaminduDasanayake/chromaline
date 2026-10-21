"use client";

import React, { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

export function ToggleCardPreview() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="flex items-center justify-center">
        <Toggle
          checked={checked}
          onChange={setChecked}
          stretch={42}
          speed={52}
          size="default"
          variant="default"
        />
      </div>

      <p className="mt-4 text-[11px] font-medium text-slate-400">
        Drag or flick across · Feel the liquid goo stretch
      </p>
    </div>
  );
}
