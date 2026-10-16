import React from "react";

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`mt-auto border-t border-slate-200/80 bg-white px-6 py-8 text-center font-mono text-xs text-slate-400 ${className}`}
    >
      <p>Chromaline · Vibrant line-art components for modern React.</p>
    </footer>
  );
}
