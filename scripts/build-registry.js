/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

function buildRegistry() {
  const trayPath = path.join(__dirname, "../components/ui/folder-tray.tsx");
  const folderPath = path.join(__dirname, "../components/ui/folder.tsx");
  const buttonPath = path.join(__dirname, "../components/ui/button.tsx");
  const selectBarPath = path.join(__dirname, "../components/ui/select-bar.tsx");
  const seekPath = path.join(__dirname, "../components/ui/seek.tsx");
  const heatmapPath = path.join(__dirname, "../components/ui/heatmap.tsx");
  const togglePath = path.join(__dirname, "../components/ui/toggle.tsx");
  const labelInputPath = path.join(__dirname, "../components/ui/label-input.tsx");
  const copyButtonPath = path.join(__dirname, "../components/ui/copy-button.tsx");
  const copyHookPath = path.join(__dirname, "../hooks/use-copy-to-clipboard.ts");
  const aspectPath = path.join(__dirname, "../components/ui/aspect-ratio.tsx");
  const counterPath = path.join(__dirname, "../components/ui/counter.tsx");
  const wakeSliderPath = path.join(__dirname, "../components/ui/wake-slider.tsx");
  const palettePath = path.join(__dirname, "../components/ui/palette.tsx");
  const timeScrubberPath = path.join(__dirname, "../components/ui/time-scrubber.tsx");
  const checklistPath = path.join(__dirname, "../components/ui/checklist.tsx");
  const createMenuPath = path.join(__dirname, "../components/ui/create-menu.tsx");
  const fluidSearchPath = path.join(__dirname, "../components/ui/fluid-search.tsx");
  const stackPath = path.join(__dirname, "../components/ui/stack.tsx");

  if (!fs.existsSync(trayPath)) {
    console.error("Component not found:", trayPath);
    return;
  }

  const trayContent = fs.readFileSync(trayPath, "utf8");
  const folderContent = fs.existsSync(folderPath) ? fs.readFileSync(folderPath, "utf8") : "";
  const buttonContent = fs.existsSync(buttonPath) ? fs.readFileSync(buttonPath, "utf8") : "";
  const selectBarContent = fs.existsSync(selectBarPath)
    ? fs.readFileSync(selectBarPath, "utf8")
    : "";
  const seekContent = fs.existsSync(seekPath) ? fs.readFileSync(seekPath, "utf8") : "";
  const heatmapContent = fs.existsSync(heatmapPath) ? fs.readFileSync(heatmapPath, "utf8") : "";
  const toggleContent = fs.existsSync(togglePath) ? fs.readFileSync(togglePath, "utf8") : "";
  const labelInputContent = fs.existsSync(labelInputPath)
    ? fs.readFileSync(labelInputPath, "utf8")
    : "";
  const labelTextareaPath = path.join(__dirname, "../components/ui/label-textarea.tsx");
  const labelTextareaContent = fs.existsSync(labelTextareaPath)
    ? fs.readFileSync(labelTextareaPath, "utf8")
    : "";
  const copyButtonContent = fs.existsSync(copyButtonPath)
    ? fs.readFileSync(copyButtonPath, "utf8")
    : "";
  const copyHookContent = fs.existsSync(copyHookPath) ? fs.readFileSync(copyHookPath, "utf8") : "";
  const aspectContent = fs.existsSync(aspectPath) ? fs.readFileSync(aspectPath, "utf8") : "";
  const counterContent = fs.existsSync(counterPath) ? fs.readFileSync(counterPath, "utf8") : "";
  const wakeSliderContent = fs.existsSync(wakeSliderPath)
    ? fs.readFileSync(wakeSliderPath, "utf8")
    : "";
  const paletteContent = fs.existsSync(palettePath) ? fs.readFileSync(palettePath, "utf8") : "";
  const timeScrubberContent = fs.existsSync(timeScrubberPath)
    ? fs.readFileSync(timeScrubberPath, "utf8")
    : "";
  const checklistContent = fs.existsSync(checklistPath)
    ? fs.readFileSync(checklistPath, "utf8")
    : "";
  const createMenuContent = fs.existsSync(createMenuPath)
    ? fs.readFileSync(createMenuPath, "utf8")
    : "";
  const fluidSearchContent = fs.existsSync(fluidSearchPath)
    ? fs.readFileSync(fluidSearchPath, "utf8")
    : "";
  const stackContent = fs.existsSync(stackPath) ? fs.readFileSync(stackPath, "utf8") : "";

  // Chromaline centralized semantic tokens for shadcn CLI auto-injection
  const chromaCssVars = {
    light: {
      "chroma-surface": "#f7f7f6",
      "chroma-surface-elevated": "#ffffff",
      "chroma-border": "rgba(0, 0, 0, 0.08)",
      "chroma-border-subtle": "rgba(0, 0, 0, 0.04)",
      "chroma-text-primary": "#18181b",
      "chroma-text-secondary": "#71717a",
      "chroma-text-muted": "#a1a1aa",
      "chroma-glass-nav": "rgba(255, 255, 255, 0.6)",
      "chroma-glass-wash": "rgba(0, 0, 0, 0.06)",
      "chroma-search-fill": "#e9e9e9",
      "chroma-stack-face": "#ffffff",
      "chroma-toggle-thumb": "#d3d3d4",
      "chroma-btn-default-face": "#1e2024",
      "chroma-btn-default-highlight": "#353840",
      "chroma-btn-default-content": "#ffffff",
      "chroma-btn-default-base": "#111215",
      "chroma-btn-default-shadow": "#09090b",
      "chroma-btn-destructive-face": "#dc2626",
      "chroma-btn-destructive-highlight": "#ef4444",
      "chroma-btn-destructive-content": "#ffffff",
      "chroma-btn-destructive-base": "#991b1b",
      "chroma-btn-destructive-shadow": "#7f1d1d",
      "chroma-btn-outline-face": "#ffffff",
      "chroma-btn-outline-highlight": "#f4f4f5",
      "chroma-btn-outline-content": "#18181b",
      "chroma-btn-outline-base": "#e4e4e7",
      "chroma-btn-outline-shadow": "#cbd5e1",
      "chroma-btn-secondary-face": "#4a4a46",
      "chroma-btn-secondary-highlight": "#64645e",
      "chroma-btn-secondary-content": "#eeeeec",
      "chroma-btn-secondary-base": "#292926",
      "chroma-btn-secondary-shadow": "#141412",
      "chroma-btn-ghost-face": "#94a3b8",
      "chroma-btn-ghost-highlight": "#cbd5e1",
      "chroma-btn-ghost-content": "#ffffff",
      "chroma-btn-ghost-base": "#64748b",
      "chroma-btn-ghost-shadow": "#475569",
      "chroma-btn-link-face": "#3b82f6",
      "chroma-btn-link-highlight": "#60a5fa",
      "chroma-btn-link-content": "#ffffff",
      "chroma-btn-link-base": "#1d4ed8",
      "chroma-btn-link-shadow": "#1e40af",
      "chroma-btn-success-face": "#059669",
      "chroma-btn-success-highlight": "#10b981",
      "chroma-btn-success-content": "#ffffff",
      "chroma-btn-success-base": "#047857",
      "chroma-btn-success-shadow": "#064e3b",
      "chroma-btn-accent-face": "#e54f10",
      "chroma-btn-accent-highlight": "#fb713b",
      "chroma-btn-accent-content": "#ffffff",
      "chroma-btn-accent-base": "#9a3412",
      "chroma-btn-accent-shadow": "#7c2d12",
    },
    dark: {
      "chroma-surface": "#0f0f0f",
      "chroma-surface-elevated": "#181818",
      "chroma-border": "rgba(255, 255, 255, 0.1)",
      "chroma-border-subtle": "rgba(255, 255, 255, 0.05)",
      "chroma-text-primary": "#ffffff",
      "chroma-text-secondary": "#a1a1aa",
      "chroma-text-muted": "#71717a",
      "chroma-glass-nav": "#252525",
      "chroma-glass-wash": "#3d3d3d",
      "chroma-search-fill": "#222224",
      "chroma-stack-face": "#14161a",
      "chroma-toggle-thumb": "#464646",
      "chroma-btn-default-face": "#1e2024",
      "chroma-btn-default-highlight": "#353840",
      "chroma-btn-default-content": "#ffffff",
      "chroma-btn-default-base": "#111215",
      "chroma-btn-default-shadow": "#09090b",
      "chroma-btn-destructive-face": "#dc2626",
      "chroma-btn-destructive-highlight": "#ef4444",
      "chroma-btn-destructive-content": "#ffffff",
      "chroma-btn-destructive-base": "#991b1b",
      "chroma-btn-destructive-shadow": "#7f1d1d",
      "chroma-btn-outline-face": "#18181b",
      "chroma-btn-outline-highlight": "#27272a",
      "chroma-btn-outline-content": "#ffffff",
      "chroma-btn-outline-base": "#09090b",
      "chroma-btn-outline-shadow": "#000000",
      "chroma-btn-secondary-face": "#27272a",
      "chroma-btn-secondary-highlight": "#3f3f46",
      "chroma-btn-secondary-content": "#f4f4f5",
      "chroma-btn-secondary-base": "#18181b",
      "chroma-btn-secondary-shadow": "#09090b",
      "chroma-btn-ghost-face": "#475569",
      "chroma-btn-ghost-highlight": "#64748b",
      "chroma-btn-ghost-content": "#ffffff",
      "chroma-btn-ghost-base": "#334155",
      "chroma-btn-ghost-shadow": "#1e293b",
      "chroma-btn-link-face": "#2563eb",
      "chroma-btn-link-highlight": "#3b82f6",
      "chroma-btn-link-content": "#ffffff",
      "chroma-btn-link-base": "#1d4ed8",
      "chroma-btn-link-shadow": "#172554",
      "chroma-btn-success-face": "#059669",
      "chroma-btn-success-highlight": "#10b981",
      "chroma-btn-success-content": "#ffffff",
      "chroma-btn-success-base": "#047857",
      "chroma-btn-success-shadow": "#064e3b",
      "chroma-btn-accent-face": "#e54f10",
      "chroma-btn-accent-highlight": "#fb713b",
      "chroma-btn-accent-content": "#ffffff",
      "chroma-btn-accent-base": "#9a3412",
      "chroma-btn-accent-shadow": "#7c2d12",
    },
  };

  // 1. Full Folder Tray with Folder Support
  const trayRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "folder-tray",
    type: "registry:ui",
    title: "Folder Tray",
    description:
      "Isometric tray of folders with custom solid colors and click-to-open actions. Built with kinematic physics inspired by and powered by @lucasmarkes/hairline.",
    dependencies: ["@lucasmarkes/hairline@^0.5.0"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/folder-tray.tsx",
        content: trayContent,
        type: "registry:ui",
        target: "components/ui/folder-tray.tsx",
      },
      ...(folderContent
        ? [
            {
              path: "components/ui/folder.tsx",
              content: folderContent,
              type: "registry:ui",
              target: "components/ui/folder.tsx",
            },
          ]
        : []),
    ],
  };

  // 2. Standalone Single Folder Card Component
  const singleFolderRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "folder",
    type: "registry:ui",
    title: "Folder",
    description:
      "Standalone forward-facing folder card with exact 84x61 geometry, tab fillets, ruled lines, and punch dots adapted from @lucasmarkes/hairline.",
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/folder.tsx",
        content: folderContent,
        type: "registry:ui",
        target: "components/ui/folder.tsx",
      },
    ],
  };

  // 3. Tactile 3D Button Component
  const buttonRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "button",
    type: "registry:ui",
    title: "Button",
    description:
      "Tactile 3D push button engineered with physical extrusion depth, inset bevel highlights, and click kinematics.",
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/button.tsx",
        content: buttonContent,
        type: "registry:ui",
        target: "components/ui/button.tsx",
      },
    ],
  };

  // 4. Elastic Kinetic Select Bar Component
  const selectBarRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "select-bar",
    type: "registry:ui",
    title: "Select Bar",
    description:
      "Elastic kinetic segmented pill and color swatch selector with two-phase mercury dilation and overshoot landing.",
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/select-bar.tsx",
        content: selectBarContent,
        type: "registry:ui",
        target: "components/ui/select-bar.tsx",
      },
    ],
  };

  // 5. Kinetic Seek Search Component
  const seekRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "seek",
    type: "registry:ui",
    title: "Seek",
    description:
      "Kinetic search icon that springs into a focused input with continuous physics, cursor magnetic pull, and tactile yield.",
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/seek.tsx",
        content: seekContent,
        type: "registry:ui",
        target: "components/ui/seek.tsx",
      },
    ],
  };

  // 6. Interactive 3D Isometric Heatmap Component
  const heatmapRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "heatmap",
    type: "registry:ui",
    title: "Heatmap",
    description:
      "Interactive 3D isometric GitHub contribution heatmap with 14-week timeline, official dark, halloween, and winter themes, and tactile impulse shockwaves.",
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/heatmap.tsx",
        content: heatmapContent,
        type: "registry:ui",
        target: "components/ui/heatmap.tsx",
      },
    ],
  };

  // 7. Liquid Goo Toggle Component
  const toggleRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "toggle",
    type: "registry:ui",
    title: "Toggle",
    description:
      "Organic liquid goo switch with two-blob chasing kinematics, pointer drag tracking, and SVG metaball necking.",
    dependencies: ["framer-motion"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/toggle.tsx",
        content: toggleContent,
        type: "registry:ui",
        target: "components/ui/toggle.tsx",
      },
    ],
  };

  // 8. Label Input Component
  const labelInputRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "label-input",
    type: "registry:ui",
    title: "Label Input",
    description:
      "A field whose label is its placeholder until focused. Outline parts from middle outward with letter-by-letter hopping text.",
    dependencies: ["@phosphor-icons/react@^2.1.10", "framer-motion@^14.4.0"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/label-input.tsx",
        content: labelInputContent,
        type: "registry:ui",
        target: "components/ui/label-input.tsx",
      },
    ],
    css: {
      "@keyframes lbi-hop": {
        "0%": { transform: "translateY(0)" },
        "35%": { transform: "translateY(-3.5px)" },
        "65%": { transform: "translateY(1px)" },
        "100%": { transform: "translateY(0)" },
      },
      "@keyframes lbi-flip": {
        "0%": { transform: "rotateX(0deg)" },
        "50%": { transform: "rotateX(-90deg)" },
        "100%": { transform: "rotateX(0deg)" },
      },
    },
  };

  // 8b. Label Textarea Component
  const labelTextareaRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "label-textarea",
    type: "registry:ui",
    title: "Label Textarea",
    description:
      "An auto-expanding multiline textarea with dynamic SVG border notch physics and letter-by-letter hopping label.",
    dependencies: ["@phosphor-icons/react@^2.1.10", "framer-motion@^14.4.0"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/label-textarea.tsx",
        content: labelTextareaContent,
        type: "registry:ui",
        target: "components/ui/label-textarea.tsx",
      },
    ],
    css: {
      "@keyframes lta-hop": {
        "0%": { transform: "translateY(0)" },
        "35%": { transform: "translateY(-3.5px)" },
        "65%": { transform: "translateY(1px)" },
        "100%": { transform: "translateY(0)" },
      },
    },
  };

  // 9. Copy Button with Hook
  const copyButtonRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "copy-button",
    type: "registry:ui",
    title: "Copy Button",
    description:
      "Fluid morphing copy button with animated content width measuring and popLayout icon/text transitions.",
    dependencies: ["@phosphor-icons/react@^2.1.10", "framer-motion@^14.4.0"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/copy-button.tsx",
        content: copyButtonContent,
        type: "registry:ui",
        target: "components/ui/copy-button.tsx",
      },
      {
        path: "hooks/use-copy-to-clipboard.ts",
        content: copyHookContent,
        type: "registry:hook",
        target: "hooks/use-copy-to-clipboard.ts",
      },
    ],
  };

  // 10. Aspect Ratio / Aspect
  const aspectRatioRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "aspect-ratio",
    type: "registry:ui",
    title: "Aspect Ratio",
    description:
      "Equal-area crop switcher with constant 276-square bounding box, leading slider thumb, and 520ms morph transitions.",
    dependencies: ["clsx", "tailwind-merge"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/aspect-ratio.tsx",
        content: aspectContent,
        type: "registry:ui",
        target: "components/ui/aspect-ratio.tsx",
      },
    ],
  };

  // 11. Rolling Counter
  const counterRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "counter",
    type: "registry:ui",
    title: "Counter",
    description:
      "Rolling odometer counter with forward-only column rolling, staggered carry ripples, velocity blur smear, and drag coasting physics.",
    dependencies: ["@phosphor-icons/react@^2.1.10", "clsx", "tailwind-merge"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/counter.tsx",
        content: counterContent,
        type: "registry:ui",
        target: "components/ui/counter.tsx",
      },
    ],
  };

  // 12. Wake Slider
  const wakeSliderRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "wake-slider",
    type: "registry:ui",
    title: "Wake Slider",
    description:
      "Thumbless range control with dynamic kinetic wave energy and velocity-sensitive exponential decay wake.",
    dependencies: ["clsx", "tailwind-merge"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/wake-slider.tsx",
        content: wakeSliderContent,
        type: "registry:ui",
        target: "components/ui/wake-slider.tsx",
      },
    ],
  };

  // 13. Palette
  const paletteRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "palette",
    type: "registry:ui",
    title: "Palette",
    description:
      "Perceptual OKLCH harmonic color palette generator with 5 generative moods and liquid elastic overshoot morphing.",
    dependencies: ["@phosphor-icons/react@^2.1.10", "clsx", "tailwind-merge"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/palette.tsx",
        content: paletteContent,
        type: "registry:ui",
        target: "components/ui/palette.tsx",
      },
    ],
  };

  // 14. Time Scrubber
  const timeScrubberRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "time-scrubber",
    type: "registry:ui",
    title: "Time Scrubber",
    description:
      "Tactile time picker over a rolling ruler dial with inertia fling coasting, unified spring settling, and front-dial cylindrical tick projection.",
    dependencies: ["clsx", "tailwind-merge"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/time-scrubber.tsx",
        content: timeScrubberContent,
        type: "registry:ui",
        target: "components/ui/time-scrubber.tsx",
      },
    ],
  };

  // 15. Checklist
  const checklistRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "checklist",
    type: "registry:ui",
    title: "Checklist",
    description:
      "Harmonic spring task checklist with drawn checkmarks, strikethrough timing, and physical gravity collapse on completion.",
    dependencies: ["clsx", "tailwind-merge", "framer-motion@^14.4.0"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/checklist.tsx",
        content: checklistContent,
        type: "registry:ui",
        target: "components/ui/checklist.tsx",
      },
    ],
  };

  // 16. Create Menu
  const createMenuRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "create-menu",
    type: "registry:ui",
    title: "Create Menu",
    description:
      "Fluid morphing create button that expands into a window with continuous kinematic physics, concentric nested row radii, and traveling liquid hover droplet highlights.",
    dependencies: ["@phosphor-icons/react@^2.1.10", "framer-motion@^14.4.0"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/create-menu.tsx",
        content: createMenuContent,
        type: "registry:ui",
        target: "components/ui/create-menu.tsx",
      },
    ],
  };

  // 17. Fluid Search Component
  const fluidSearchRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "fluid-search",
    type: "registry:ui",
    title: "Fluid Search",
    description:
      "Metaball search disclosure where the pill field and close circle fluidly separate on focus and seamlessly fuse back when closed.",
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/fluid-search.tsx",
        content: fluidSearchContent,
        type: "registry:ui",
        target: "components/ui/fluid-search.tsx",
      },
    ],
  };

  // 18. Stack Component
  const stackRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "stack",
    type: "registry:ui",
    title: "Stack",
    description:
      "A tactile card pile that fans out radially along an eccentric virtual pivot on hover and fluidly draws cards into full-frame 3D view on press.",
    dependencies: ["clsx", "tailwind-merge"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/stack.tsx",
        content: stackContent,
        type: "registry:ui",
        target: "components/ui/stack.tsx",
      },
    ],
  };

  const outDir = path.join(__dirname, "../public/r");
  fs.mkdirSync(outDir, { recursive: true });

  const allRegistryItems = [
    trayRegistryItem,
    singleFolderRegistryItem,
    buttonRegistryItem,
    selectBarRegistryItem,
    seekRegistryItem,
    heatmapRegistryItem,
    toggleRegistryItem,
    labelInputRegistryItem,
    labelTextareaRegistryItem,
    copyButtonRegistryItem,
    aspectRatioRegistryItem,
    counterRegistryItem,
    wakeSliderRegistryItem,
    paletteRegistryItem,
    timeScrubberRegistryItem,
    checklistRegistryItem,
    createMenuRegistryItem,
    fluidSearchRegistryItem,
    stackRegistryItem,
  ];

  for (const item of allRegistryItems) {
    item.cssVars = chromaCssVars;
  }

  // Clean simple names
  fs.writeFileSync(
    path.join(outDir, "folder-tray.json"),
    JSON.stringify(trayRegistryItem, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "folder.json"),
    JSON.stringify(singleFolderRegistryItem, null, 2)
  );
  fs.writeFileSync(path.join(outDir, "button.json"), JSON.stringify(buttonRegistryItem, null, 2));
  fs.writeFileSync(
    path.join(outDir, "select-bar.json"),
    JSON.stringify(selectBarRegistryItem, null, 2)
  );
  fs.writeFileSync(path.join(outDir, "seek.json"), JSON.stringify(seekRegistryItem, null, 2));
  fs.writeFileSync(path.join(outDir, "heatmap.json"), JSON.stringify(heatmapRegistryItem, null, 2));
  fs.writeFileSync(path.join(outDir, "toggle.json"), JSON.stringify(toggleRegistryItem, null, 2));
  fs.writeFileSync(
    path.join(outDir, "label-input.json"),
    JSON.stringify(labelInputRegistryItem, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "label-textarea.json"),
    JSON.stringify(labelTextareaRegistryItem, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "copy-button.json"),
    JSON.stringify(copyButtonRegistryItem, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "aspect-ratio.json"),
    JSON.stringify(aspectRatioRegistryItem, null, 2)
  );
  fs.writeFileSync(path.join(outDir, "counter.json"), JSON.stringify(counterRegistryItem, null, 2));
  fs.writeFileSync(
    path.join(outDir, "wake-slider.json"),
    JSON.stringify(wakeSliderRegistryItem, null, 2)
  );
  fs.writeFileSync(path.join(outDir, "palette.json"), JSON.stringify(paletteRegistryItem, null, 2));
  fs.writeFileSync(
    path.join(outDir, "time-scrubber.json"),
    JSON.stringify(timeScrubberRegistryItem, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "checklist.json"),
    JSON.stringify(checklistRegistryItem, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "create-menu.json"),
    JSON.stringify(createMenuRegistryItem, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "fluid-search.json"),
    JSON.stringify(fluidSearchRegistryItem, null, 2)
  );
  fs.writeFileSync(path.join(outDir, "stack.json"), JSON.stringify(stackRegistryItem, null, 2));

  const indexRegistry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "chromaline",
    homepage: "https://github.com/lucasmarkes/hairline",
    items: allRegistryItems,
  };
  fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify(indexRegistry, null, 2));

  // Root registry.json
  const rootRegistry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "chromaline",
    homepage: "https://github.com/lucasmarkes/hairline",
    items: [
      {
        name: "folder-tray",
        type: "registry:ui",
        title: "Folder Tray",
        description:
          "Interactive 3D isometric tray of folders with custom solid colors and click-to-open actions. Inspired by and built on @lucasmarkes/hairline.",
        dependencies: ["@lucasmarkes/hairline@^0.5.0"],
        files: [
          {
            path: "components/ui/folder-tray.tsx",
            type: "registry:ui",
            target: "components/ui/folder-tray.tsx",
          },
          {
            path: "components/ui/folder.tsx",
            type: "registry:ui",
            target: "components/ui/folder.tsx",
          },
        ],
      },
      {
        name: "folder",
        type: "registry:ui",
        title: "Folder",
        description:
          "Standalone forward-facing folder card with 84x61 vector geometry adapted from @lucasmarkes/hairline.",
        files: [
          {
            path: "components/ui/folder.tsx",
            type: "registry:ui",
            target: "components/ui/folder.tsx",
          },
        ],
      },
      {
        name: "button",
        type: "registry:ui",
        title: "Button",
        description:
          "Tactile 3D push button engineered with physical extrusion depth and click kinematics.",
        files: [
          {
            path: "components/ui/button.tsx",
            type: "registry:ui",
            target: "components/ui/button.tsx",
          },
        ],
      },
      {
        name: "select-bar",
        type: "registry:ui",
        title: "Select Bar",
        description:
          "Elastic kinetic segmented pill and color swatch selector with two-phase mercury dilation and overshoot landing.",
        files: [
          {
            path: "components/ui/select-bar.tsx",
            type: "registry:ui",
            target: "components/ui/select-bar.tsx",
          },
        ],
      },
      {
        name: "seek",
        type: "registry:ui",
        title: "Seek",
        description:
          "Kinetic search icon that springs into a focused input with continuous physics, cursor magnetic pull, and tactile yield.",
        files: [
          {
            path: "components/ui/seek.tsx",
            type: "registry:ui",
            target: "components/ui/seek.tsx",
          },
        ],
      },
      {
        name: "heatmap",
        type: "registry:ui",
        title: "Heatmap",
        description:
          "Interactive 3D isometric GitHub contribution heatmap with 14-week timeline, official dark, halloween, and winter themes, and tactile impulse shockwaves.",
        files: [
          {
            path: "components/ui/heatmap.tsx",
            type: "registry:ui",
            target: "components/ui/heatmap.tsx",
          },
        ],
      },
      {
        name: "toggle",
        type: "registry:ui",
        title: "Toggle",
        description:
          "Organic liquid goo switch with two-blob chasing kinematics, pointer drag tracking, and SVG metaball necking.",
        dependencies: ["framer-motion"],
        files: [
          {
            path: "components/ui/toggle.tsx",
            type: "registry:ui",
            target: "components/ui/toggle.tsx",
          },
        ],
      },
      {
        name: "label-input",
        type: "registry:ui",
        title: "Label Input",
        description:
          "A field whose label is its placeholder until focused. Outline parts from middle outward with letter-by-letter hopping text.",
        dependencies: ["@phosphor-icons/react@^2.1.10", "framer-motion@^14.4.0"],
        files: [
          {
            path: "components/ui/label-input.tsx",
            type: "registry:ui",
            target: "components/ui/label-input.tsx",
          },
        ],
      },
      {
        name: "label-textarea",
        type: "registry:ui",
        title: "Label Textarea",
        description:
          "An auto-expanding multiline textarea with dynamic SVG border notch physics and letter-by-letter hopping label.",
        dependencies: ["@phosphor-icons/react@^2.1.10", "framer-motion@^14.4.0"],
        files: [
          {
            path: "components/ui/label-textarea.tsx",
            type: "registry:ui",
            target: "components/ui/label-textarea.tsx",
          },
        ],
      },
      {
        name: "copy-button",
        type: "registry:ui",
        title: "Copy Button",
        description:
          "Fluid morphing copy button with animated content width measuring and popLayout icon/text transitions.",
        dependencies: ["@phosphor-icons/react@^2.1.10", "framer-motion@^14.4.0"],
        files: [
          {
            path: "components/ui/copy-button.tsx",
            type: "registry:ui",
            target: "components/ui/copy-button.tsx",
          },
          {
            path: "hooks/use-copy-to-clipboard.ts",
            type: "registry:hook",
            target: "hooks/use-copy-to-clipboard.ts",
          },
        ],
      },
      {
        name: "aspect-ratio",
        type: "registry:ui",
        title: "Aspect Ratio",
        description:
          "Equal-area crop switcher with constant 276-square bounding box, leading slider thumb, and 520ms morph transitions.",
        dependencies: ["clsx", "tailwind-merge"],
        files: [
          {
            path: "components/ui/aspect-ratio.tsx",
            type: "registry:ui",
            target: "components/ui/aspect-ratio.tsx",
          },
        ],
      },
      {
        name: "counter",
        type: "registry:ui",
        title: "Counter",
        description:
          "Rolling odometer counter with forward-only column rolling, staggered carry ripples, velocity blur smear, and drag coasting physics.",
        dependencies: ["@phosphor-icons/react@^2.1.10", "clsx", "tailwind-merge"],
        files: [
          {
            path: "components/ui/counter.tsx",
            type: "registry:ui",
            target: "components/ui/counter.tsx",
          },
        ],
      },
      {
        name: "wake-slider",
        type: "registry:ui",
        title: "Wake Slider",
        description:
          "Thumbless range control with dynamic kinetic wave energy and velocity-sensitive exponential decay wake.",
        dependencies: ["clsx", "tailwind-merge"],
        files: [
          {
            path: "components/ui/wake-slider.tsx",
            type: "registry:ui",
            target: "components/ui/wake-slider.tsx",
          },
        ],
      },
      {
        name: "palette",
        type: "registry:ui",
        title: "Palette",
        description:
          "Perceptual OKLCH harmonic color palette generator with 5 generative moods and liquid elastic overshoot morphing.",
        dependencies: ["@phosphor-icons/react@^2.1.10", "clsx", "tailwind-merge"],
        files: [
          {
            path: "components/ui/palette.tsx",
            type: "registry:ui",
            target: "components/ui/palette.tsx",
          },
        ],
      },
      {
        name: "time-scrubber",
        type: "registry:ui",
        title: "Time Scrubber",
        description:
          "Tactile time picker over a rolling ruler dial with inertia fling coasting, unified spring settling, and front-dial cylindrical tick projection.",
        dependencies: ["clsx", "tailwind-merge"],
        files: [
          {
            path: "components/ui/time-scrubber.tsx",
            type: "registry:ui",
            target: "components/ui/time-scrubber.tsx",
          },
        ],
      },
      {
        name: "checklist",
        type: "registry:ui",
        title: "Checklist",
        description:
          "Harmonic spring task checklist with drawn checkmarks, strikethrough timing, and physical gravity collapse on completion.",
        dependencies: ["clsx", "tailwind-merge", "framer-motion@^14.4.0"],
        files: [
          {
            path: "components/ui/checklist.tsx",
            type: "registry:ui",
            target: "components/ui/checklist.tsx",
          },
        ],
      },
      {
        name: "create-menu",
        type: "registry:ui",
        title: "Create Menu",
        description:
          "Fluid morphing create button that expands into a window with continuous kinematic physics, concentric nested row radii, and traveling liquid hover droplet highlights.",
        dependencies: ["@phosphor-icons/react@^2.1.10", "framer-motion@^14.4.0"],
        files: [
          {
            path: "components/ui/create-menu.tsx",
            type: "registry:ui",
            target: "components/ui/create-menu.tsx",
          },
        ],
      },
      {
        name: "fluid-search",
        type: "registry:ui",
        title: "Fluid Search",
        description:
          "Metaball search disclosure where the pill field and close circle fluidly separate on focus and seamlessly fuse back when closed.",
        dependencies: [],
        files: [
          {
            path: "components/ui/fluid-search.tsx",
            type: "registry:ui",
            target: "components/ui/fluid-search.tsx",
          },
        ],
      },
      {
        name: "stack",
        type: "registry:ui",
        title: "Stack",
        description:
          "A tactile card pile that fans out radially along an eccentric virtual pivot on hover and fluidly draws cards into full-frame 3D view on press.",
        dependencies: ["clsx", "tailwind-merge"],
        files: [
          {
            path: "components/ui/stack.tsx",
            type: "registry:ui",
            target: "components/ui/stack.tsx",
          },
        ],
      },
    ],
  };

  for (const item of rootRegistry.items) {
    item.cssVars = chromaCssVars;
    if (item.name === "label-input") {
      item.css = labelInputRegistryItem.css;
    }
    if (item.name === "label-textarea") {
      item.css = labelTextareaRegistryItem.css;
    }
  }

  fs.writeFileSync(path.join(__dirname, "../registry.json"), JSON.stringify(rootRegistry, null, 2));

  console.log(
    `✓ Chromaline registry generated (${allRegistryItems.length} components with CSS variables and keyframes)`
  );
}

buildRegistry();
