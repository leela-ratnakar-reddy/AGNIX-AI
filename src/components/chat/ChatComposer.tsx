"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import {
  ArrowUp,
  Square,
  Paperclip,
  Mic,
  Cpu,
  CornerDownLeft,
} from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface ChatComposerProps {
  onSendMessage: (text: string) => void;
  onStopGeneration: () => void;
  isGenerating: boolean;
  enterToSend?: boolean;
}

export function ChatComposer({
  onSendMessage,
  onStopGeneration,
  isGenerating,
  enterToSend = true,
}: ChatComposerProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { showToast } = useToast();

  // Auto-resize textarea based on scrollHeight
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${Math.max(newHeight, 44)}px`;
  }, [text]);

  const handleSubmit = () => {
    if (isGenerating) {
      onStopGeneration();
      return;
    }

    const trimmed = text.trim();
    if (!trimmed) return;

    onSendMessage(trimmed);
    setText("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (enterToSend) {
        if (!e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      } else {
        // If Enter to send is OFF, only Ctrl+Enter or Cmd+Enter sends
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          handleSubmit();
        }
      }
    }
  };

  const handlePlaceholderClick = (feature: string) => {
    showToast(`${feature} will be available in future AGNIX versions`, "info");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 sm:pb-6 pt-1 select-none">
      <div className="relative flex flex-col rounded-2xl bg-agnix-surface border border-agnix-border/80 focus-within:border-agnix-red/50 focus-within:shadow-fire-subtle transition-all duration-200">
        {/* Main Textarea */}
        <div className="p-3 pb-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AGNIX AI... (Shift+Enter for newline)"
            className="w-full bg-transparent text-sm sm:text-[15px] text-agnix-text-primary placeholder:text-agnix-text-muted resize-none focus:outline-none leading-relaxed min-h-[44px] max-h-[200px]"
          />
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-agnix-border/40 select-none">
          {/* Left Feature Buttons */}
          <div className="flex items-center gap-1">
            <IconButton
              aria-label="Add attachment (Future V3)"
              size="sm"
              variant="ghost"
              onClick={() => handlePlaceholderClick("File Attachments & RAG")}
            >
              <Paperclip className="w-4 h-4 text-zinc-400 hover:text-zinc-200" />
            </IconButton>

            <IconButton
              aria-label="Voice input (Future V4)"
              size="sm"
              variant="ghost"
              onClick={() => handlePlaceholderClick("Voice Transcription")}
            >
              <Mic className="w-4 h-4 text-zinc-400 hover:text-zinc-200" />
            </IconButton>

            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-md bg-agnix-elevated/70 border border-agnix-border/60 text-[11px] text-zinc-400 font-mono">
              <Cpu className="w-3 h-3 text-agnix-red" />
              <span>AGNIX 1.0 Core</span>
            </div>
          </div>

          {/* Right Controls & Send/Stop Button */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-agnix-text-muted font-mono">
              <CornerDownLeft className="w-3 h-3" />
              {enterToSend ? "Enter to send" : "Cmd+Enter"}
            </span>

            {isGenerating ? (
              <button
                onClick={onStopGeneration}
                aria-label="Stop generation"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-agnix-elevated hover:bg-agnix-hover text-agnix-red border border-agnix-red/40 transition-all duration-150 focus:outline-none shadow-sm active:scale-95"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                aria-label="Send message"
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 focus:outline-none select-none",
                  text.trim()
                    ? "bg-gradient-to-r from-agnix-red to-agnix-orange text-white shadow-fire-subtle hover:shadow-fire-glow active:scale-95"
                    : "bg-agnix-elevated text-zinc-600 cursor-not-allowed border border-agnix-border/50"
                )}
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtle Footer Disclaimer */}
      <p className="mt-2 text-center text-[11px] text-agnix-text-muted">
        AGNIX AI can make mistakes. Verify critical code and architectural decisions.
      </p>
    </div>
  );
}
