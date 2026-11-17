"use client";

import React, { useState } from "react";
import { Save, SaveEffect } from "@/components/ui/save";
import { SelectBar } from "@/components/ui/select-bar";

export function SaveCardPreview({
  showControls = false,
  fill = "auto",
}: {
  showControls?: boolean;
  fill?: "light" | "dark" | "auto";
} = {}) {
  const [effect, setEffect] = useState<SaveEffect>("Bloom");

  return (
    <>
      <Save start={840} effect={effect} burst={50} color="Amber" corner={22} fill={fill} />

      {showControls && (
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
          <SelectBar<SaveEffect>
            size="xs"
            items={[
              { key: "Bloom", label: "Bloom" },
              { key: "Firework", label: "Firework" },
            ]}
            value={effect}
            onChange={setEffect}
            ariaLabel="Select save effect"
          />
        </div>
      )}
    </>
  );
}
