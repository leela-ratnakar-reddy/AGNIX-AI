"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  language?: string;
  value: string;
}

export function CodeBlock({ language = "text", value }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code snippet", err);
    }
  };

  return (
    <div className="relative my-4 rounded-xl border border-agnix-border bg-[#0B0B0C] overflow-hidden group shadow-lg">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#121214] border-b border-agnix-border/70 text-xs">
        <span className="font-mono text-agnix-text-secondary uppercase tracking-wider text-[11px] font-medium">
          {language}
        </span>
        <button
          onClick={handleCopy}
          aria-label={isCopied ? "Copied" : "Copy code"}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-agnix-surface/80 hover:bg-agnix-hover text-agnix-text-secondary hover:text-agnix-text-primary text-[11px] font-medium transition-colors border border-agnix-border/60"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-agnix-red" />
              <span className="text-agnix-red font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto p-4 text-[13px] leading-relaxed font-mono">
        <pre className="text-zinc-200">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}
