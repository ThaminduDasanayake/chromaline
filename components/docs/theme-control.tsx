"use client";

import React from "react";
import { SelectBar } from "@/components/ui/select-bar";
import { SunIcon, MoonIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type ThemeMode = "light" | "dark";

export interface ThemeControlProps<T extends string = ThemeMode> {
  value: T;
  onChange: (theme: T) => void;
  layout?: "horizontal" | "vertical";
  label?: string;
  description?: string;
  ariaLabel?: string;
  className?: string;
}

export function ThemeControl<T extends string = ThemeMode>({
  value,
  onChange,
  layout = "horizontal",
  label = "Theme Mode",
  description = "Toggle light and dark color schemes",
  ariaLabel = "Select theme mode",
  className,
}: ThemeControlProps<T>) {
  if (layout === "vertical") {
    return (
      <div className={className}>
        <label className="text-xs font-semibold text-slate-900">{label}</label>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        <div className="mt-2">
          <SelectBar<T>
            size="xs"
            items={[
              { key: "light" as T, label: "Light", icon: <SunIcon size={12} weight="bold" /> },
              { key: "dark" as T, label: "Dark", icon: <MoonIcon size={12} weight="bold" /> },
            ]}
            value={value}
            onChange={onChange}
            ariaLabel={ariaLabel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        <label className="text-xs font-semibold text-slate-900">{label}</label>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      <SelectBar<T>
        size="xs"
        items={[
          { key: "light" as T, label: "Light", icon: <SunIcon size={12} weight="bold" /> },
          { key: "dark" as T, label: "Dark", icon: <MoonIcon size={12} weight="bold" /> },
        ]}
        value={value}
        onChange={onChange}
        ariaLabel={ariaLabel}
      />
    </div>
  );
}
