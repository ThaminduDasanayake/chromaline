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
} from "@/components/showcase";

export default function ChromalineHomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-slate-900 transition-colors duration-200 selection:bg-slate-200 dark:bg-[#09090b] dark:text-zinc-100 dark:selection:bg-zinc-800">
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
          <ComponentCard
            title="Folder Tray"
            description="An interactive 3D isometric tray of folders with kinematic lean physics and solid colorways."
            href="/components/folder-tray"
          >
            <FolderTrayPreview />
          </ComponentCard>

          {/* Card 2: Folder */}
          <ComponentCard
            title="Folder"
            description="A standalone forward-facing folder card with tab fillets, ruled lines, and punch dots."
            href="/components/folder"
          >
            <FolderCardPreview />
          </ComponentCard>

          {/* Card 3: Button */}
          <ComponentCard
            title="Button"
            description="A tactile 3D push button engineered with physical extrusion depth, inset bevel highlights, and click kinematics."
            href="/components/button"
          >
            <ButtonCardPreview />
          </ComponentCard>

          {/* Card 4: Select Bar */}
          <ComponentCard
            title="Select Bar"
            description="Elastic kinetic segmented pill and color swatch selector with two-phase mercury dilation and overshoot landing."
            href="/components/select-bar"
          >
            <SelectBarCardPreview />
          </ComponentCard>

          {/* Card 5: Seek */}
          <ComponentCard
            title="Seek"
            description="Kinetic search icon that springs into a focused input with continuous physics, cursor magnetic pull, and tactile yield."
            href="/components/seek"
          >
            <SeekCardPreview />
          </ComponentCard>

          {/* Card 6: Heatmap */}
          <ComponentCard
            title="Heatmap"
            description="Interactive 3D isometric GitHub contribution heatmap with 14-week timeline, official dark, halloween, winter themes, and tactile impulse shockwaves."
            href="/components/heatmap"
          >
            <HeatmapCardPreview />
          </ComponentCard>

          {/* Card 7: Toggle */}
          <ComponentCard
            title="Toggle"
            description="Liquid goo switch driven by two-blob spring kinematics, dragging pointer capture, and SVG alpha thresholding."
            href="/components/toggle"
          >
            <ToggleCardPreview />
          </ComponentCard>

          {/* Card 8: Label Input */}
          <ComponentCard
            title="Label Input"
            description="Tactile outline input with letter-by-letter hopping label and dynamic center-parting notch."
            href="/components/label-input"
          >
            <LabelInputCardPreview />
          </ComponentCard>

          {/* Card 9: Aspect Ratio */}
          <ComponentCard
            title="Aspect Ratio"
            description="Equal-area crop switcher where landscape, square, and portrait formats occupy the same surface area inside a fixed 276-square stage."
            href="/components/aspect-ratio"
          >
            <AspectRatioCardPreview />
          </ComponentCard>

          {/* Card 10: Counter */}
          <ComponentCard
            title="Counter"
            description="Rolling odometer counter with forward-only column rolling, staggered carry ripples, velocity blur smear, and drag coasting physics."
            href="/components/counter"
          >
            <CounterCardPreview />
          </ComponentCard>

          {/* Card 11: Wake Slider */}
          <ComponentCard
            title="Wake Slider"
            description="Thumbless range control with dynamic kinetic wave energy and velocity-sensitive exponential decay wake."
            href="/components/wake-slider"
          >
            <WakeSliderCardPreview />
          </ComponentCard>

          {/* Card 12: Palette */}
          <ComponentCard
            title="Palette"
            description="Perceptual OKLCH harmonic color palette generator with 5 generative moods and liquid elastic morphing."
            href="/components/palette"
          >
            <PaletteCardPreview />
          </ComponentCard>

          {/* Card 13: Time Scrubber */}
          <ComponentCard
            title="Time Scrubber"
            description="Tactile time ruler with inertia throw, unified spring snapping, and front-dial cylindrical tick projection."
            href="/components/time-scrubber"
          >
            <TimeScrubberCardPreview />
          </ComponentCard>

          {/* Card 14: Checklist */}
          <ComponentCard
            title="Checklist"
            description="Harmonic spring checklist with drawn checkmarks, strikethrough timing, and physical gravity collapse on completion."
            href="/components/checklist"
          >
            <ChecklistCardPreview />
          </ComponentCard>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <SiteFooter />
    </div>
  );
}
