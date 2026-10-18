"use client";

import React, { useState } from "react";
import { Seek } from "@/components/ui/seek";

export function SeekCardPreview() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      {/* Interactive Seek Component */}
      <div className="flex items-center justify-center">
        <Seek
          size="default"
          placeholder="Search components..."
          value={searchValue}
          onChange={setSearchValue}
          give={65}
          spring={55}
        />
      </div>

      {/* Helpful Hint */}
      <p className="mt-4 text-[11px] font-medium text-slate-400">
        Click to expand · Hover near to feel magnetic pull
      </p>
    </div>
  );
}
