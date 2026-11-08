"use client";

import React, { useState } from "react";
import { Button, ButtonVariant } from "@/components/ui/button";
import { SelectBar } from "@/components/ui/select-bar";
import { ArrowRightIcon } from "@phosphor-icons/react";

export const BUTTON_VARIANTS = [
  { key: "default" as const, label: "Default", color: "#1e2024" },
  { key: "secondary" as const, label: "Secondary", color: "#4a4a46" },
  { key: "destructive" as const, label: "Destructive", color: "#dc2626" },
  { key: "success" as const, label: "Success", color: "#059669" },
  { key: "accent" as const, label: "Accent", color: "#e54f10" },
];

export function ButtonCardPreview({ showControls = false }: { showControls?: boolean } = {}) {
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("default");

  return (
    <>
      <Button variant={buttonVariant}>
        <span>Continue</span>
        <ArrowRightIcon size={14} weight="bold" />
      </Button>

      {/* Quick Interactive Variant Controls */}
      {showControls && (
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
          <SelectBar<ButtonVariant>
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
