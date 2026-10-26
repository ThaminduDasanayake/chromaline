"use client";

import React, { useState } from "react";
import { TimeScrubber } from "@/components/ui/time-scrubber";

export function TimeScrubberCardPreview() {
  const [time, setTime] = useState(570); // 9:30 AM

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <TimeScrubber
        step={5}
        momentum={50}
        format="12h"
        corner={20}
        value={time}
        onChange={setTime}
        theme="light"
      />
    </div>
  );
}
