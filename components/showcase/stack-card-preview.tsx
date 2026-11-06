"use client";

import React from "react";
import { Stack } from "@/components/ui/stack";

export function StackCardPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="scale-85 transform-gpu sm:scale-95">
        <Stack count={5} spread={85} bounce={5} scatter={0} corner={14} />
      </div>
    </div>
  );
}
