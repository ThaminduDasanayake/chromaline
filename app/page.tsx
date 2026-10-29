import React from "react";
import { SiteHeader, SiteFooter } from "@/components/layout";
import {
  ComponentCard,
  FolderTrayPreview,
  FolderCardPreview,
  ButtonCardPreview,
  SelectBarCardPreview,
  SeekCardPreview,
  HeatmapCardPreview,
  ToggleCardPreview,
  LabelInputCardPreview,
  AspectRatioCardPreview,
  CounterCardPreview,
  WakeSliderCardPreview,
  PaletteCardPreview,
  TimeScrubberCardPreview,
  ChecklistCardPreview,
  CreateMenuCardPreview,
} from "@/components/showcase";

export default function ChromalineHomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f6] font-sans text-[#17181a] transition-colors duration-200 selection:bg-slate-200 dark:bg-[#000000] dark:text-zinc-100 dark:selection:bg-zinc-800">
      {/* Top Minimal Navbar */}
      <SiteHeader />

      {/* Main Grid Canvas */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 md:px-8 md:py-16">
        {/* Minimal Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
            Components
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-zinc-400">
            Physical line-art components built with vector mathematics, solid colorways, and pointer
            physics.
          </p>
        </div>

        {/* 2-Column Component Showcase Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Card 1: Folder Tray */}
          <ComponentCard title="Folder Tray" href="/components/folder-tray">
            <FolderTrayPreview />
          </ComponentCard>

          {/* Card 2: Folder */}
          <ComponentCard title="Folder" href="/components/folder">
            <FolderCardPreview />
          </ComponentCard>

          {/* Card 3: Button */}
          <ComponentCard title="Button" href="/components/button">
            <ButtonCardPreview />
          </ComponentCard>

          {/* Card 4: Select Bar */}
          <ComponentCard title="Select Bar" href="/components/select-bar">
            <SelectBarCardPreview />
          </ComponentCard>

          {/* Card 5: Seek */}
          <ComponentCard title="Seek" href="/components/seek">
            <SeekCardPreview />
          </ComponentCard>

          {/* Card 6: Heatmap */}
          <ComponentCard title="Heatmap" href="/components/heatmap">
            <HeatmapCardPreview />
          </ComponentCard>

          {/* Card 7: Toggle */}
          <ComponentCard title="Toggle" href="/components/toggle">
            <ToggleCardPreview />
          </ComponentCard>

          {/* Card 8: Label Input */}
          <ComponentCard title="Label Input" href="/components/label-input">
            <LabelInputCardPreview />
          </ComponentCard>

          {/* Card 9: Aspect Ratio */}
          <ComponentCard title="Aspect Ratio" href="/components/aspect-ratio">
            <AspectRatioCardPreview />
          </ComponentCard>

          {/* Card 10: Counter */}
          <ComponentCard title="Counter" href="/components/counter">
            <CounterCardPreview />
          </ComponentCard>

          {/* Card 11: Wake Slider */}
          <ComponentCard title="Wake Slider" href="/components/wake-slider">
            <WakeSliderCardPreview />
          </ComponentCard>

          {/* Card 12: Palette */}
          <ComponentCard title="Palette" href="/components/palette">
            <PaletteCardPreview />
          </ComponentCard>

          {/* Card 13: Time Scrubber */}
          <ComponentCard title="Time Scrubber" href="/components/time-scrubber">
            <TimeScrubberCardPreview />
          </ComponentCard>

          {/* Card 14: Checklist */}
          <ComponentCard title="Checklist" href="/components/checklist">
            <ChecklistCardPreview />
          </ComponentCard>

          {/* Card 15: Create Menu */}
          <ComponentCard title="Create Menu" href="/components/create-menu">
            <CreateMenuCardPreview />
          </ComponentCard>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <SiteFooter />
    </div>
  );
}
