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
  const counterCssPath = path.join(__dirname, "../components/ui/counter.css");

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
  const copyButtonContent = fs.existsSync(copyButtonPath)
    ? fs.readFileSync(copyButtonPath, "utf8")
    : "";
  const copyHookContent = fs.existsSync(copyHookPath) ? fs.readFileSync(copyHookPath, "utf8") : "";
  const aspectContent = fs.existsSync(aspectPath) ? fs.readFileSync(aspectPath, "utf8") : "";
  const counterContent = fs.existsSync(counterPath) ? fs.readFileSync(counterPath, "utf8") : "";
  const counterCssContent = fs.existsSync(counterCssPath)
    ? fs.readFileSync(counterCssPath, "utf8")
    : "";

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
    dependencies: ["@phosphor-icons/react@^2.1.10"],
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
  };

  // 9. Copy Button with Hook
  const copyButtonRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "copy-button",
    type: "registry:ui",
    title: "Copy Button",
    description:
      "Tactile copy-to-clipboard button component and custom React hook with animated visual feedback.",
    dependencies: ["@phosphor-icons/react@^2.1.10"],
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
    dependencies: [],
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
    dependencies: ["@phosphor-icons/react@^2.1.10"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/counter.tsx",
        content: counterContent,
        type: "registry:ui",
        target: "components/ui/counter.tsx",
      },
      ...(counterCssContent
        ? [
            {
              path: "components/ui/counter.css",
              content: counterCssContent,
              type: "registry:ui",
              target: "components/ui/counter.css",
            },
          ]
        : []),
    ],
  };

  const outDir = path.join(__dirname, "../public/r");
  fs.mkdirSync(outDir, { recursive: true });

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
    path.join(outDir, "copy-button.json"),
    JSON.stringify(copyButtonRegistryItem, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "aspect-ratio.json"),
    JSON.stringify(aspectRatioRegistryItem, null, 2)
  );
  fs.writeFileSync(path.join(outDir, "counter.json"), JSON.stringify(counterRegistryItem, null, 2));

  const indexRegistry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "chromaline",
    homepage: "https://github.com/lucasmarkes/hairline",
    items: [
      trayRegistryItem,
      singleFolderRegistryItem,
      buttonRegistryItem,
      selectBarRegistryItem,
      seekRegistryItem,
      heatmapRegistryItem,
      toggleRegistryItem,
      labelInputRegistryItem,
      copyButtonRegistryItem,
      aspectRatioRegistryItem,
      counterRegistryItem,
    ],
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
        dependencies: ["@phosphor-icons/react@^2.1.10"],
        files: [
          {
            path: "components/ui/label-input.tsx",
            type: "registry:ui",
            target: "components/ui/label-input.tsx",
          },
        ],
      },
      {
        name: "copy-button",
        type: "registry:ui",
        title: "Copy Button",
        description:
          "Tactile copy-to-clipboard button component and custom React hook with animated visual feedback.",
        dependencies: ["@phosphor-icons/react@^2.1.10"],
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
        dependencies: ["@phosphor-icons/react@^2.1.10"],
        files: [
          {
            path: "components/ui/counter.tsx",
            type: "registry:ui",
            target: "components/ui/counter.tsx",
          },
          {
            path: "components/ui/counter.css",
            type: "registry:ui",
            target: "components/ui/counter.css",
          },
        ],
      },
    ],
  };
  fs.writeFileSync(path.join(__dirname, "../registry.json"), JSON.stringify(rootRegistry, null, 2));

  console.log(
    "✓ Chromaline registry generated at public/r/folder-tray.json, public/r/folder.json, public/r/button.json, public/r/select-bar.json, public/r/seek.json, public/r/heatmap.json, public/r/toggle.json, public/r/label-input.json, and public/r/copy-button.json"
  );
}

buildRegistry();
