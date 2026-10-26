"use client";

import React from "react";
import { Checklist } from "@/components/ui/checklist";

export function ChecklistCardPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Checklist corner={20} bounce={50} box={18} theme="light" />
    </div>
  );
}
