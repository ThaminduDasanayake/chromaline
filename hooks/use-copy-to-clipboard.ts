"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface UseCopyToClipboardOptions {
  /** Duration in milliseconds before resetting copied state (default: 2000) */
  timeout?: number;
  /** Optional callback fired when text is successfully copied */
  onCopy?: (text: string) => void;
}

export interface UseCopyToClipboardReturn {
  /** Whether text was recently copied to clipboard */
  copied: boolean;
  /** Function to copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
}

/**
 * useCopyToClipboard
 *
 * Custom React hook to copy arbitrary text to the clipboard
 * with cross-browser fallback and automatic timeout reset.
 */
export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
}: UseCopyToClipboardOptions = {}): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text && text !== "") return false;

      try {
        if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else if (typeof document !== "undefined") {
          // Fallback for non-secure contexts or older browsers
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          textarea.style.top = "-9999px";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        } else {
          return false;
        }

        setCopied(true);
        onCopy?.(text);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setCopied(false);
          timeoutRef.current = null;
        }, timeout);

        return true;
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
        setCopied(false);
        return false;
      }
    },
    [timeout, onCopy]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copied, copy };
}
