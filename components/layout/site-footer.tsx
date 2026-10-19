import React from "react";
import Link from "next/link";

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`mt-auto border-t border-slate-200/80 bg-white ${className}`}>
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 sm:px-8">
        <Link
          href="/"
          className="font-mono text-xs font-bold tracking-tight text-slate-950 transition-opacity hover:opacity-80"
        >
          Chromaline
        </Link>

        <div className="flex items-center gap-6 font-mono text-xs text-slate-400">
          <a
            href="/r/index.json"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-slate-900"
          >
            Registry
          </a>
          <a
            href="https://github.com/lucasmarkes/hairline"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-slate-900"
          >
            GitHub
          </a>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
