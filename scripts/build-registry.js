/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

function buildRegistry() {
  const rolodexPath = path.join(__dirname, "../components/ui/tactile-rolodex.tsx");
  const folderPath = path.join(__dirname, "../components/ui/tactile-folder.tsx");

  if (!fs.existsSync(rolodexPath)) {
    console.error("Component not found:", rolodexPath);
    return;
  }

  const rolodexContent = fs.readFileSync(rolodexPath, "utf8");
  const folderContent = fs.existsSync(folderPath) ? fs.readFileSync(folderPath, "utf8") : "";

  // 1. Full Rolodex with Single Folder Support
  const rolodexRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "tactile-rolodex",
    type: "registry:ui",
    title: "Tactile Rolodex",
    description:
      "Interactive 3D isometric folder rolodex with custom solid colors and click-to-open actions.",
    dependencies: ["@lucasmarkes/hairline@^0.5.0"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/tactile-rolodex.tsx",
        content: rolodexContent,
        type: "registry:ui",
        target: "components/ui/tactile-rolodex.tsx",
      },
      ...(folderContent
        ? [
            {
              path: "components/ui/tactile-folder.tsx",
              content: folderContent,
              type: "registry:ui",
              target: "components/ui/tactile-folder.tsx",
            },
          ]
        : []),
    ],
  };

  // 2. Standalone Single Folder Card Component
  const singleFolderRegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "tactile-folder",
    type: "registry:ui",
    title: "Tactile Single Folder",
    description:
      "Standalone forward-facing tactile folder card with exact 84x61 hairline geometry, tab fillets, ruled lines, and punch dots.",
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/ui/tactile-folder.tsx",
        content: folderContent,
        type: "registry:ui",
        target: "components/ui/tactile-folder.tsx",
      },
    ],
  };

  const outDir = path.join(__dirname, "../public/r");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "tactile-rolodex.json"),
    JSON.stringify(rolodexRegistryItem, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "tactile-folder.json"),
    JSON.stringify(singleFolderRegistryItem, null, 2)
  );

  const indexRegistry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "chromaline",
    homepage: "https://github.com/lucasmarkes/hairline",
    items: [rolodexRegistryItem, singleFolderRegistryItem],
  };
  fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify(indexRegistry, null, 2));

  // Root registry.json
  const rootRegistry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "chromaline",
    homepage: "https://github.com/lucasmarkes/hairline",
    items: [
      {
        name: "tactile-rolodex",
        type: "registry:ui",
        title: "Tactile Rolodex",
        description:
          "Interactive 3D isometric folder rolodex with custom solid colors and click-to-open actions.",
        dependencies: ["@lucasmarkes/hairline@^0.5.0"],
        files: [
          {
            path: "components/ui/tactile-rolodex.tsx",
            type: "registry:ui",
            target: "components/ui/tactile-rolodex.tsx",
          },
          {
            path: "components/ui/tactile-folder.tsx",
            type: "registry:ui",
            target: "components/ui/tactile-folder.tsx",
          },
        ],
      },
      {
        name: "tactile-folder",
        type: "registry:ui",
        title: "Tactile Single Folder",
        description: "Standalone forward-facing tactile folder card.",
        files: [
          {
            path: "components/ui/tactile-folder.tsx",
            type: "registry:ui",
            target: "components/ui/tactile-folder.tsx",
          },
        ],
      },
    ],
  };
  fs.writeFileSync(path.join(__dirname, "../registry.json"), JSON.stringify(rootRegistry, null, 2));

  console.log(
    "✓ Chromaline registry generated at public/r/tactile-rolodex.json and public/r/tactile-folder.json"
  );
}

buildRegistry();
