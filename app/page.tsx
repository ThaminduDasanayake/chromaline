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
  LabelTextareaCardPreview,
  AspectRatioCardPreview,
  CounterCardPreview,
  WakeSliderCardPreview,
  PaletteCardPreview,
  TimeScrubberCardPreview,
  ChecklistCardPreview,
  CreateMenuCardPreview,
  FluidSearchCardPreview,
  StackCardPreview,
  LikeCardPreview,
  SaveCardPreview,
} from "@/components/showcase";

export default function ChromalineHomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#ffffff] font-sans text-[#17181a] transition-colors duration-200 selection:bg-slate-200 dark:bg-[#0a0a0a] dark:text-zinc-100 dark:selection:bg-zinc-800">
      {/* Top Minimal Navbar */}
      <SiteHeader />

      {/* Main Canvas */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 md:px-8 md:py-16">
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

        {/* 3-Column Borderless Masonry Grid with Dynamic Non-Uniform Preview Shapes */}
        <div className="columns-1 gap-5 [column-fill:_balance] md:columns-2 lg:columns-3">
          {/* ── Column 1 Flow ── */}
          {/* Card 1: Folder Tray (Tall) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard
              title="Folder Tray"
              href="/components/folder-tray"
              heightClassName="h-[440px]"
            >
              <FolderTrayPreview showControls={false} />
            </ComponentCard>
          </div>

          {/* Card 2: Button (Compact) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard title="Button" href="/components/button" heightClassName="h-[260px]">
              <ButtonCardPreview />
            </ComponentCard>
          </div>

          {/* Card 3: Palette (Medium) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard title="Palette" href="/components/palette" heightClassName="h-[340px]">
              <PaletteCardPreview />
            </ComponentCard>
          </div>

          {/* Card 4: Checklist (Tall) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard
              title="Checklist"
              href="/components/checklist"
              heightClassName="h-[420px]"
            >
              <ChecklistCardPreview />
            </ComponentCard>
          </div>

          {/* Card 5: Seek (Compact) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard title="Seek" href="/components/seek" heightClassName="h-[260px]">
              <SeekCardPreview />
            </ComponentCard>
          </div>

          {/* Card 6: Counter (Medium) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard title="Counter" href="/components/counter" heightClassName="h-[320px]">
              <CounterCardPreview />
            </ComponentCard>
          </div>

          {/* ── Column 2 Flow ── */}
          {/* Card 7: Folder (Medium) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard title="Folder" href="/components/folder" heightClassName="h-[340px]">
              <FolderCardPreview />
            </ComponentCard>
          </div>

          {/* Card 8: Toggle (Compact) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard title="Toggle" href="/components/toggle" heightClassName="h-[260px]">
              <ToggleCardPreview />
            </ComponentCard>
          </div>

          {/* Card 9: Heatmap (Tall) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard title="Heatmap" href="/components/heatmap" heightClassName="h-[420px]">
              <HeatmapCardPreview />
            </ComponentCard>
          </div>

          {/* Card 10: Fluid Search (Compact) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard
              title="Fluid Search"
              href="/components/fluid-search"
              heightClassName="h-[260px]"
            >
              <FluidSearchCardPreview />
            </ComponentCard>
          </div>

          {/* Card 11: Stack (Tall) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard title="Stack" href="/components/stack" heightClassName="h-[440px]">
              <StackCardPreview />
            </ComponentCard>
          </div>

          {/* Card 12: Label Input (Paired with Textarea) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard
              title="Label Input"
              href="/components/label-input"
              heightClassName="h-[300px]"
            >
              <LabelInputCardPreview />
            </ComponentCard>
          </div>

          {/* Card 13: Label Textarea (Kept directly next to Label Input) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard
              title="Label Textarea"
              href="/components/label-textarea"
              heightClassName="h-[320px]"
            >
              <LabelTextareaCardPreview />
            </ComponentCard>
          </div>

          {/* ── Column 3 Flow ── */}
          {/* Card 14: Aspect Ratio (Tall - 420px un-squished height for 4:3, 1:1, 3:4 crops and bottom controls bar) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard
              title="Aspect Ratio"
              href="/components/aspect-ratio"
              heightClassName="h-[420px]"
            >
              <AspectRatioCardPreview />
            </ComponentCard>
          </div>

          {/* Card 15: Select Bar (Medium - 360px un-squished height for all 3 docks) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard
              title="Select Bar"
              href="/components/select-bar"
              heightClassName="h-[360px]"
            >
              <SelectBarCardPreview />
            </ComponentCard>
          </div>

          {/* Card 16: Like (Medium/Square - Hero Micro-Interaction) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard title="Like" href="/components/like" heightClassName="h-[350px]">
              <LikeCardPreview />
            </ComponentCard>
          </div>

          {/* Card: Save (Medium/Square - Bookmark Micro-Interaction) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard title="Save" href="/components/save" heightClassName="h-[350px]">
              <SaveCardPreview />
            </ComponentCard>
          </div>

          {/* Card 17: Create Menu (Tall) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard
              title="Create Menu"
              href="/components/create-menu"
              heightClassName="h-[420px]"
            >
              <CreateMenuCardPreview />
            </ComponentCard>
          </div>

          {/* Card 18: Time Scrubber (Medium) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard
              title="Time Scrubber"
              href="/components/time-scrubber"
              heightClassName="h-[340px]"
            >
              <TimeScrubberCardPreview />
            </ComponentCard>
          </div>

          {/* Card 19: Wake Slider (Compact) */}
          <div className="mb-5 break-inside-avoid">
            <ComponentCard
              title="Wake Slider"
              href="/components/wake-slider"
              heightClassName="h-[260px]"
            >
              <WakeSliderCardPreview />
            </ComponentCard>
          </div>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <SiteFooter />
    </div>
  );
}
