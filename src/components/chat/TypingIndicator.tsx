import React from "react";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-agnix-surface/70 border border-agnix-border max-w-fit animate-fade-in shadow-sm select-none">
      <div className="flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full bg-agnix-red animate-pulse"
          style={{ animationDuration: "1.2s", animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-agnix-orange animate-pulse"
          style={{ animationDuration: "1.2s", animationDelay: "200ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-agnix-orangeFire animate-pulse"
          style={{ animationDuration: "1.2s", animationDelay: "400ms" }}
        />
      </div>
      <span className="text-xs font-medium text-agnix-text-secondary tracking-wide">
        AGNIX is thinking...
      </span>
    </div>
  );
}
