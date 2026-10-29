"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SelectBar } from "@/components/ui/select-bar";
import { ArrowRightIcon } from "@phosphor-icons/react";

export const BUTTON_VARIANTS = [
  { key: "default" as const, label: "Default", color: "#4a4a46", darkOutline: "#292926" },
  { key: "dark" as const, label: "Dark", color: "#1e2024", darkOutline: "#111215" },
  { key: "orange" as const, label: "Orange", color: "#e54f10", darkOutline: "#9a3412" },
  { key: "emerald" as const, label: "Emerald", color: "#059669", darkOutline: "#047857" },
];

export function ButtonCardPreview({ showControls = false }: { showControls?: boolean } = {}) {
  const [buttonVariant, setButtonVariant] = useState<"default" | "dark" | "orange" | "emerald">(
    "default"
  );

  return (
    <>
      <Button variant={buttonVariant}>
        <span>Continue</span>
        <ArrowRightIcon size={14} weight="bold" />
      </Button>

      {/* Quick Interactive Variant Controls */}
      {showControls && (
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
          <SelectBar<"default" | "dark" | "orange" | "emerald">
            variant="swatches"
            size="xs"
            items={BUTTON_VARIANTS}
            value={buttonVariant}
            onChange={setButtonVariant}
            ariaLabel="Select button variant"
          />
        </div>
      )}
    </>
  );
}
