import React from "react";
import { ArrowUpRight, Code, Brain, Lightbulb, Compass, BarChart3 } from "lucide-react";
import { SuggestedPromptItem } from "@/types";

interface SuggestedPromptProps {
  item: SuggestedPromptItem;
  onClick: (prompt: string) => void;
}

export function SuggestedPrompt({ item, onClick }: SuggestedPromptProps) {
  const getCategoryIcon = (category: SuggestedPromptItem["category"]) => {
    switch (category) {
      case "Code":
        return <Code className="w-3.5 h-3.5 text-agnix-red" />;
      case "Think":
        return <Brain className="w-3.5 h-3.5 text-agnix-orangeFire" />;
      case "Create":
        return <Lightbulb className="w-3.5 h-3.5 text-amber-400" />;
      case "Analyze":
        return <BarChart3 className="w-3.5 h-3.5 text-red-400" />;
      case "Learn":
      default:
        return <Compass className="w-3.5 h-3.5 text-agnix-orange" />;
    }
  };

  return (
    <button
      onClick={() => onClick(item.prompt)}
      className="group relative flex flex-col justify-between p-4 rounded-xl text-left bg-agnix-surface/60 hover:bg-agnix-elevated border border-agnix-border hover:border-agnix-red/40 transition-all duration-200 shadow-sm hover:shadow-fire-subtle text-agnix-text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-agnix-red/50 active:scale-[0.99]"
    >
      <div className="flex items-center justify-between w-full mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-agnix-text-secondary">
          {getCategoryIcon(item.category)}
          <span className="text-[11px] font-mono">{item.category}</span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-agnix-text-muted group-hover:text-agnix-red transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      <p className="text-sm font-medium text-zinc-200 group-hover:text-white line-clamp-2 leading-snug">
        {item.title}
      </p>
    </button>
  );
}
