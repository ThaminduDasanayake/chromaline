"use client";

import React, { useState } from "react";
import { Button, ButtonVariant } from "@/components/ui/button";
import { SelectBar } from "@/components/ui/select-bar";
import { useTheme } from "@/components/providers/theme-provider";
import { ArrowRightIcon } from "@phosphor-icons/react";

export const BUTTON_VARIANTS: { key: ButtonVariant; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "destructive", label: "Destructive" },
  { key: "outline", label: "Outline" },
  { key: "secondary", label: "Secondary" },
  { key: "ghost", label: "Ghost" },
  { key: "link", label: "Link" },
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
