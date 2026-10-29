"use client";

import React, { useSyncExternalStore } from "react";
import { SunIcon, MoonIcon } from "@phosphor-icons/react";
import { SelectBar, SelectBarItem } from "@/components/ui/select-bar";
import { Theme, useTheme } from "@/components/providers/theme-provider";

const emptySubscribe = () => () => {};

const THEME_ITEMS: SelectBarItem<Theme>[] = [
  { key: "light", title: "Light mode", icon: <SunIcon size={13} weight="bold" /> },
  { key: "dark", title: "Dark mode", icon: <MoonIcon size={13} weight="bold" /> },
];

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={`h-[28px] w-[58px] animate-pulse rounded-full bg-slate-100/80 dark:bg-white/10 ${className}`}
      />
    );
  }

  return (
    <SelectBar<Theme>
      size="xs"
      items={THEME_ITEMS}
      value={theme}
      onChange={setTheme}
      ariaLabel="Select theme mode"
      className={className}
    />
  );
}
