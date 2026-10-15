/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

function buildRegistry() {
  const trayPath = path.join(__dirname, "../components/ui/folder-tray.tsx");
  const folderPath = path.join(__dirname, "../components/ui/folder.tsx");

  if (!fs.existsSync(trayPath)) {
    console.error("Component not found:", trayPath);
    return;
  }

  const trayContent = fs.readFileSync(trayPath, "utf8");
  const folderContent = fs.existsSync(folderPath) ? fs.readFileSync(folderPath, "utf8") : "";

  // 1. Full Folder Tray with Folder Support
  const trayRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "folder-tray",
    type: "registry:ui",
    title: "Folder Tray",
    description: "Isometric tray of folders with custom solid colors and click-to-open actions.",
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
      "Standalone forward-facing folder card with exact 84x61 hairline geometry, tab fillets, ruled lines, and punch dots.",
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

  // Compatibility aliases
  fs.writeFileSync(
    path.join(outDir, "rolodex.json"),
    JSON.stringify({ ...trayRegistryItem, name: "rolodex" }, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "tactile-rolodex.json"),
    JSON.stringify({ ...trayRegistryItem, name: "tactile-rolodex" }, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "tactile-folder.json"),
    JSON.stringify({ ...singleFolderRegistryItem, name: "tactile-folder" }, null, 2)
  );

  const indexRegistry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "chromaline",
    homepage: "https://github.com/lucasmarkes/hairline",
    items: [trayRegistryItem, singleFolderRegistryItem],
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
          "Interactive 3D isometric tray of folders with custom solid colors and click-to-open actions.",
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
        description: "Standalone forward-facing folder card.",
        files: [
          {
            path: "components/ui/folder.tsx",
            type: "registry:ui",
            target: "components/ui/folder.tsx",
          },
        ],
      },
    ],
  };
  fs.writeFileSync(path.join(__dirname, "../registry.json"), JSON.stringify(rootRegistry, null, 2));

  console.log(
    "✓ Chromaline registry generated at public/r/folder-tray.json and public/r/folder.json"
  );
}

buildRegistry();
