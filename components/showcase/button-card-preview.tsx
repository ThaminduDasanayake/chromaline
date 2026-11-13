"use client";

import React, { useState } from "react";
import { Button, ButtonVariant } from "@/components/ui/button";
import { SelectBar } from "@/components/ui/select-bar";
import { useTheme } from "@/components/providers/theme-provider";
import { ArrowRightIcon } from "@phosphor-icons/react";

export const BUTTON_VARIANTS = [
  { key: "default" as const, label: "Default", color: "var(--chroma-btn-default-face)" },
  { key: "destructive" as const, label: "Destructive", color: "var(--chroma-btn-destructive-face)" },
  { key: "outline" as const, label: "Outline", color: "var(--chroma-btn-outline-face)" },
  { key: "secondary" as const, label: "Secondary", color: "var(--chroma-btn-secondary-face)" },
  { key: "ghost" as const, label: "Ghost", color: "var(--chroma-btn-ghost-face)" },
  { key: "link" as const, label: "Link", color: "var(--chroma-btn-link-face)" },
];

export function ButtonCardPreview({
  showControls = false,
  theme: themeProp,
}: {
  showControls?: boolean;
  theme?: "light" | "dark";
} = {}) {
  const { theme: appTheme } = useTheme();
  const theme = themeProp || appTheme;
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("default");

  return (
    <>
      <Button variant={buttonVariant} theme={theme}>
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
