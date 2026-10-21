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
} from "@/components/showcase";

export default function ChromalineHomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200">
      {/* Top Minimal Navbar */}
      <SiteHeader />

      {/* Main Grid Canvas */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 md:px-8 md:py-16">
        {/* Minimal Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Components
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
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
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <SiteFooter />
    </div>
  );
}
