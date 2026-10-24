"use client";

import React from "react";
import { Aspect } from "@/components/ui/aspect-ratio";

export function AspectRatioCardPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Aspect corner={20} morph={50} />
    </div>
  );
}
