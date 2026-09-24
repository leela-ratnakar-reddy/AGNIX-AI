import React from "react";
import { AgnixLogo } from "./AgnixLogo";
import { SuggestedPrompt } from "./SuggestedPrompt";
import { SUGGESTED_PROMPTS } from "@/lib/chat/demo-data";
import { Sparkles, Terminal, BookOpen, Rocket } from "lucide-react";

interface ChatWelcomeProps {
  onSelectPrompt: (prompt: string) => void;
}

export function ChatWelcome({ onSelectPrompt }: ChatWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full max-w-3xl mx-auto px-4 py-8 sm:py-12 text-center animate-fade-in">
      {/* Brand Hero */}
      <div className="mb-8 flex flex-col items-center">
        <div className="p-3.5 rounded-2xl bg-agnix-surface/80 border border-agnix-border/80 shadow-fire-subtle mb-5">
          <AgnixLogo size="lg" showWordmark={false} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <span>AGNIX</span>
          <span className="bg-gradient-to-r from-agnix-red via-agnix-orange to-agnix-orangeFire bg-clip-text text-transparent">
            AI
          </span>
        </h1>

        <p className="mt-2 text-sm sm:text-base font-medium text-agnix-text-secondary tracking-widest uppercase font-mono">
          Think. Build. Execute.
        </p>

        <p className="mt-3 text-sm text-agnix-text-muted max-w-lg leading-relaxed">
          Your production-grade AI workspace engineered for deep reasoning, architectural design, software development, and rapid execution.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-agnix-surface border border-agnix-border text-zinc-300">
            <Terminal className="w-3 h-3 text-agnix-red" /> Clean Code & Systems
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-agnix-surface border border-agnix-border text-zinc-300">
            <BookOpen className="w-3 h-3 text-agnix-orange" /> Technical Explanations
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-agnix-surface border border-agnix-border text-zinc-300">
            <Rocket className="w-3 h-3 text-agnix-orangeFire" /> Architecture & Strategy
          </span>
        </div>
      </div>

      {/* Suggested Prompts Section */}
      <div className="w-full">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-agnix-text-secondary uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-agnix-red" />
          <span>Recommended Prompts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
          {SUGGESTED_PROMPTS.map((item) => (
            <SuggestedPrompt
              key={item.id}
              item={item}
              onClick={onSelectPrompt}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
