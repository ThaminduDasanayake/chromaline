"use client";

import React, { useState } from "react";
import { FolderTray, FolderItem, Folder } from "@/components/ui/folder-tray";

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

export function ProjectLibrary() {
  const [modalFolder, setModalFolder] = useState<FolderItem<WorkspaceData> | null>(null);

  return (
    <div className="flex w-full flex-col items-center">
      {/* 3D Folder Tray Preview Container */}
      <div className="flex w-full justify-center py-4">
        <FolderTray<WorkspaceData>
          folders={WORKSPACE_FOLDERS}
          intensity={0.65}
          defaultSelected={0}
          onOpen={(folder) => setModalFolder(folder)}
        />
      </div>

      {/* Folder Preview Modal */}
      {modalFolder && (
        <div
          role="dialog"
          aria-modal="true"
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs duration-150"
          onClick={() => setModalFolder(null)}
        >
          <div
            className="animate-in zoom-in-95 w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Color Accent Line */}
            <div
              className="h-1.5 w-full"
              style={{ backgroundColor: modalFolder.bodyColor || "#E54F10" }}
            />

            <div className="p-6">
              {/* Header: Name + Close Button */}
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full border"
                    style={{
                      backgroundColor: modalFolder.bodyColor || "#E54F10",
                      borderColor: modalFolder.darkOutline || "#7C2D12",
                    }}
                  />
                  <h3 className="font-mono text-base font-bold tracking-tight text-slate-900">
                    {modalFolder.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setModalFolder(null)}
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md font-mono text-xs text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  title="Close dialog"
                >
                  ✕
                </button>
              </div>

              {/* Single Folder Graphic Facing Front (exact geometry from the stack) */}
              <div className="mb-4 flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50/70 py-4">
                <Folder
                  bodyColor={modalFolder.bodyColor}
                  darkOutline={modalFolder.darkOutline}
                  lightOutline={modalFolder.lightOutline}
                  folderIndex={WORKSPACE_FOLDERS.findIndex((f) => f.id === modalFolder.id)}
                  className="h-auto w-48 drop-shadow-sm"
                />
              </div>

              {/* Description */}
              <p className="mb-5 text-center font-sans text-xs leading-relaxed text-slate-600">
                {modalFolder.description}
              </p>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalFolder(null)}
                  className="cursor-pointer rounded-lg border border-slate-200 bg-slate-900 px-4 py-1.5 font-mono text-xs font-medium text-white transition-colors hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
