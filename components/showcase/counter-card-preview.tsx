"use client";

import React from "react";
import { Counter } from "@/components/ui/counter";

export function CounterCardPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Counter bounce={45} stagger={45} blur={50} corner={16} start={95} />
    </div>
  );
}
