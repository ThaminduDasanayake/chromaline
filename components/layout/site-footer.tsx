import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={cn(
        "mt-auto border-t border-black/8 bg-white transition-colors duration-200 dark:border-white/10 dark:bg-[#000000]",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 sm:px-8">
        <Link
          href="/"
          className="flex items-center transition-opacity"
          aria-label="Chromaline"
        >
          <Image
            src="/wordmark-light.svg"
            alt="Chromaline"
            width={122}
            height={24}
            className="h-6 w-auto dark:hidden"
          />
          <Image
            src="/wordmark-dark.svg"
            alt="Chromaline"
            width={122}
            height={24}
            className="hidden h-6 w-auto dark:block"
          />
        </Link>

        <div className="flex items-center gap-6 font-mono text-xs text-slate-400 dark:text-zinc-500">
          <a
            href="/r/index.json"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            Registry
          </a>
          <span>By{" "}
          <a
            href="https://thamindu.runs-on.dev"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            Thamindu Dasanayake
          </a>
          </span>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
