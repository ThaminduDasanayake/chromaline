"use client";

import React, { useState } from "react";
import { FluidSearch } from "@/components/ui/fluid-search";

export function FluidSearchCardPreview() {
  const [val, setVal] = useState("");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="w-full max-w-[340px]">
        <FluidSearch
          value={val}
          onChange={setVal}
          placeholder="Search components…"
        />
      </div>
    </div>
  );
}
