"use client";

import React, { useState, useEffect } from "react";
import { FolderTray, FolderItem, Folder } from "@/components/ui/folder-tray";
import { Button } from "@/components/ui/button";
import { SelectBar } from "@/components/ui/select-bar";
import { ArrowRightIcon, XIcon, PaletteIcon, CircleHalfIcon } from "@phosphor-icons/react";

export interface WorkspaceData {
  branch: string;
  status: "deployed" | "building" | "synced" | "review";
  updated: string;
  filesCount: number;
  files: string[];
  envVars: { key: string; value: string }[];
}

// 8 Folders using Project 1 through Project 8 with bright saturated body colors
const WORKSPACE_FOLDERS: FolderItem<WorkspaceData>[] = [
  {
    id: "project-1",
    name: "Project 1",
    bodyColor: "#E54F10", // rgb(229, 79, 16) - Vivid Terracotta Orange
    darkOutline: "#7C2D12", // Dark Rust Outline
    lightOutline: "#FED7AA", // Cream Light Ruled Lines & Dots
    category: "Design",
    description: "Brand identity, design system primitives, and UI component assets.",
    data: {
      branch: "main",
      status: "deployed",
      updated: "12m ago",
      filesCount: 42,
      files: ["src/index.ts", "src/auth/session.ts", "src/crypto/jwt.ts", "env.production"],
      envVars: [
        { key: "JWT_SECRET", value: "sk_live_984392482390423" },
        { key: "AUTH_DOMAIN", value: "auth.internal.corp" },
      ],
    },
  },
  {
    id: "project-2",
    name: "Project 2",
    bodyColor: "#0A90D2", // rgb(10, 144, 210) - Vivid Electric Blue
    darkOutline: "#075985", // Deep Navy Outline
    lightOutline: "#BAE6FD", // Soft Sky Light Ruled Lines & Dots
    category: "Development",
    description: "Core web application built with Next.js, React, and Tailwind CSS.",
    data: {
      branch: "feat/v2-release",
      status: "review",
      updated: "1h ago",
      filesCount: 68,
      files: ["src/webhooks/stripe.ts", "src/ledger/invoices.ts", "src/db/schema.prisma"],
      envVars: [
        { key: "STRIPE_SECRET_KEY", value: "sk_live_stripe_988219" },
        { key: "WEBHOOK_TOLERANCE", value: "300" },
      ],
    },
  },
  {
    id: "project-3",
    name: "Project 3",
    bodyColor: "#53F399", // rgb(83, 243, 153) - Vivid Mint Spring Green
    darkOutline: "#047857", // Deep Emerald Outline
    lightOutline: "#D1FAE5", // Soft Mint Light Ruled Lines & Dots
    category: "Mobile App",
    description: "Cross-platform mobile client for iOS and Android.",
    data: {
      branch: "main",
      status: "deployed",
      updated: "3h ago",
      filesCount: 184,
      files: ["src/server.ts", "src/schema/resolvers.ts", "src/cache/redis.ts"],
      envVars: [
        { key: "DATABASE_URL", value: "postgresql://neondb_owner:***" },
        { key: "REDIS_HOST", value: "edge-cache.us-east.aws" },
      ],
    },
  },
  {
    id: "project-4",
    name: "Project 4",
    bodyColor: "#8B5CF6", // Vivid Bright Violet
    darkOutline: "#4C1D95", // Deep Violet Outline
    lightOutline: "#DDD6FE", // Lavender Light Ruled Lines & Dots
    category: "Analytics",
    description: "Telemetry, user analytics tracking, and performance reporting.",
    data: {
      branch: "main",
      status: "synced",
      updated: "4h ago",
      filesCount: 312,
      files: ["app/page.tsx", "app/layout.tsx", "components/ui/folder-tray.tsx"],
      envVars: [
        { key: "NEXT_PUBLIC_API_URL", value: "https://api.internal.corp" },
        { key: "ANALYTICS_ID", value: "agt_prod_77192" },
      ],
    },
  },
  {
    id: "project-5",
    name: "Project 5",
    bodyColor: "#F59E0B", // Vivid Bright Amber / Gold
    darkOutline: "#92400E", // Deep Bronze Outline
    lightOutline: "#FEF08A", // Soft Yellow Light Ruled Lines & Dots
    category: "Marketing",
    description: "Campaign landing pages, email templates, and conversion funnels.",
    data: {
      branch: "feat/launch",
      status: "building",
      updated: "5h ago",
      filesCount: 54,
      files: ["pipeline/consumer.go", "pipeline/clickhouse.go", "docker-compose.yml"],
      envVars: [
        { key: "KAFKA_BROKERS", value: "broker1:9092,broker2:9092" },
        { key: "CLICKHOUSE_DSN", value: "tcp://ch-cluster:9000" },
      ],
    },
  },
  {
    id: "project-6",
    name: "Project 6",
    bodyColor: "#F43F5E", // Vivid Bright Rose
    darkOutline: "#881337", // Deep Wine Outline
    lightOutline: "#FECDD3", // Soft Rose Light Ruled Lines & Dots
    category: "Documentation",
    description: "API references, onboarding guides, and architecture documentation.",
    data: {
      branch: "main",
      status: "deployed",
      updated: "1d ago",
      filesCount: 96,
      files: ["content/docs/api.mdx", "content/docs/getting-started.mdx"],
      envVars: [{ key: "BASE_PATH", value: "/docs" }],
    },
  },
  {
    id: "project-7",
    name: "Project 7",
    bodyColor: "#06B6D4", // Vivid Bright Cyan
    darkOutline: "#155E75", // Deep Teal Outline
    lightOutline: "#CFFAFE", // Soft Cyan Light Ruled Lines & Dots
    category: "Backend API",
    description: "REST and GraphQL endpoints for user authentication and data storage.",
    data: {
      branch: "v2-release",
      status: "synced",
      updated: "2d ago",
      filesCount: 140,
      files: ["tokens/colors.json", "tokens/spacing.json", "src/primitives.tsx"],
      envVars: [{ key: "STORYBOOK_PORT", value: "6006" }],
    },
  },
  {
    id: "project-8",
    name: "Project 8",
    bodyColor: "#6366F1", // Vivid Bright Indigo
    darkOutline: "#312E81", // Deep Indigo Outline
    lightOutline: "#E0E7FF", // Soft Indigo Light Ruled Lines & Dots
    category: "Operations",
    description: "Deployment configurations, monitoring alerts, and CI/CD automation.",
    data: {
      branch: "main",
      status: "deployed",
      updated: "3d ago",
      filesCount: 29,
      files: ["workers/cache.ts", "wrangler.toml"],
      envVars: [{ key: "KV_NAMESPACE", value: "CACHE_PROD_V2" }],
    },
  },
];

function isDarkColor(hex?: string): boolean {
  if (!hex) return true;
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 160;
}

export function ProjectLibrary({ showControls = true }: { showControls?: boolean }) {
  const [variant, setVariant] = useState<"color" | "original">("color");
  const [modalFolder, setModalFolder] = useState<FolderItem<WorkspaceData> | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalFolder(null);
      }
    };
    if (modalFolder) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [modalFolder]);

  const activeIndex = modalFolder ? WORKSPACE_FOLDERS.findIndex((f) => f.id === modalFolder.id) : 0;
  const isDark = modalFolder ? isDarkColor(modalFolder.bodyColor) : true;

  return (
    <div className="relative flex w-full flex-col items-center">
      {/* Visual Theme Selector: Color vs No color (Original theme) */}
      {showControls && (
        <div className="absolute top-2 right-2 z-10 sm:top-3 sm:right-3">
          <SelectBar<"color" | "original">
            size="xs"
            items={[
              {
                key: "color",
                label: "Color",
                icon: <PaletteIcon size={13} weight="bold" />,
              },
              {
                key: "original",
                label: "No color",
                icon: <CircleHalfIcon size={13} weight="bold" />,
              },
            ]}
            value={variant}
            onChange={setVariant}
            ariaLabel="Select folder tray theme"
          />
        </div>
      )}

      {/* 3D Folder Tray Preview Container */}
      <div className="flex w-full justify-center py-4">
        <FolderTray<WorkspaceData>
          folders={WORKSPACE_FOLDERS}
          variant={variant}
          intensity={0.65}
          defaultSelected={0}
          onOpen={(folder) => setModalFolder(folder)}
        />
      </div>

      {/* Folder Preview Modal - Shaped as the Folder Itself without Ruled Lines */}
      {modalFolder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${modalFolder.name} Details`}
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-xs duration-200"
          onClick={() => setModalFolder(null)}
        >
          <div
            className="animate-in zoom-in-95 relative aspect-88/65 w-full max-w-175 drop-shadow-[0_30px_50px_rgba(0,0,0,0.45)] filter duration-200 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <Folder
              bodyColor={modalFolder.bodyColor}
              darkOutline={modalFolder.darkOutline}
              lightOutline={modalFolder.lightOutline}
              borderWidth={2}
              folderIndex={activeIndex >= 0 ? activeIndex : 0}
              showLines={false}
              className="h-full w-full"
            >
              {/* Corner Close Button - Inside the folder */}
              <button
                type="button"
                onClick={() => setModalFolder(null)}
                className={`absolute top-[17%] right-[7%] z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all active:scale-95 sm:h-9 sm:w-9 ${
                  isDark
                    ? "border border-white/25 bg-black/25 text-white/80 shadow-xs hover:bg-black/45 hover:text-white"
                    : "border border-black/15 bg-black/10 text-slate-900 shadow-xs hover:bg-black/20 hover:text-slate-950"
                }`}
                title="Close (Esc)"
                aria-label="Close dialog"
              >
                <XIcon size={15} weight="bold" />
              </button>

              {/* Folder Interior Content */}
              <div className="absolute inset-0 flex flex-col justify-between px-[8%] pt-[17%] pb-[7%]">
                {/* Header: Category + Title */}
                <div className="pr-12">
                  {modalFolder.category && (
                    <div
                      className={`mb-1 font-mono text-[11px] font-semibold tracking-widest uppercase sm:text-xs ${
                        isDark ? "text-white/60" : "text-slate-700"
                      }`}
                    >
                      {modalFolder.category}
                    </div>
                  )}
                  <h3
                    className={`font-mono text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl ${
                      isDark ? "text-white" : "text-slate-950"
                    }`}
                  >
                    {modalFolder.name}
                  </h3>
                </div>

                {/* Body: Description */}
                <div className="my-auto py-2">
                  <p
                    className={`max-w-xl font-sans text-sm leading-relaxed sm:text-base md:text-lg ${
                      isDark ? "text-white/85" : "text-slate-800"
                    }`}
                  >
                    {modalFolder.description}
                  </p>

                  <div className="mt-3 sm:mt-4">
                    <Button
                      variant={isDark ? "dark" : "default"}
                      onClick={() => setModalFolder(null)}
                    >
                      <span>Continue</span>
                      <ArrowRightIcon size={14} weight="bold" />
                    </Button>
                  </div>
                </div>

                {/* Footer: Subtle details & Esc hint */}
                <div
                  className={`flex items-center justify-between border-t pt-3 font-mono text-[11px] sm:text-xs ${
                    isDark ? "border-white/15 text-white/60" : "border-black/10 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    <span>{modalFolder.data?.branch || "main"}</span>
                    <span>•</span>
                    <span>{modalFolder.data?.filesCount || 0} files</span>
                  </div>

                  <span className="hidden opacity-75 sm:inline">Press Esc to close</span>
                </div>
              </div>
            </Folder>
          </div>
        </div>
      )}
    </div>
  );
}
