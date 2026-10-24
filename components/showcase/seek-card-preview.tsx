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
    </div>
  );
}
