"use client";

import React, { useState } from "react";
import {
  Menu,
  SlidersHorizontal,
  Search,
  Sparkles,
  Info,
  MoreVertical,
  Plus,
} from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Tooltip } from "@/components/ui/Tooltip";
import { AgnixLogo } from "./AgnixLogo";

interface ChatHeaderProps {
  title: string;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  onNewChat: () => void;
  onToggleSearch?: () => void;
}

export function ChatHeader({
  title,
  onToggleSidebar,
  onOpenSettings,
  onNewChat,
  onToggleSearch,
}: ChatHeaderProps) {
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  return (
    <header className="h-14 border-b border-agnix-border bg-agnix-bg/95 backdrop-blur-sm px-4 flex items-center justify-between z-20 select-none">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <IconButton
          aria-label="Toggle navigation sidebar"
          size="md"
          variant="ghost"
          onClick={onToggleSidebar}
          className="text-agnix-text-secondary hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </IconButton>

        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-semibold text-agnix-text-primary truncate max-w-[200px] sm:max-w-md">
            {title || "New Chat"}
          </h2>
        </div>
      </div>

      {/* Center: Model Status Badge */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-agnix-surface border border-agnix-border/80 text-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agnix-red opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-agnix-red"></span>
        </span>
        <span className="font-medium text-white tracking-wide">AGNIX 1.0 Core</span>
        <span className="text-[10px] text-zinc-500 font-mono">● Online</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5">
        <Tooltip content="New Chat" position="bottom">
          <IconButton
            aria-label="Create new chat"
            size="sm"
            variant="ghost"
            onClick={onNewChat}
            className="hidden sm:inline-flex text-zinc-300 hover:text-white"
          >
            <Plus className="w-4 h-4" />
          </IconButton>
        </Tooltip>

        {onToggleSearch && (
          <Tooltip content="Search chats" position="bottom">
            <IconButton
              aria-label="Search conversation history"
              size="sm"
              variant="ghost"
              onClick={onToggleSearch}
              className="text-zinc-300 hover:text-white"
            >
              <Search className="w-4 h-4" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip content="Settings" position="bottom">
          <IconButton
            aria-label="Open settings"
            size="sm"
            variant="ghost"
            onClick={onOpenSettings}
            className="text-zinc-300 hover:text-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </IconButton>
        </Tooltip>

        {/* More Menu Dropdown */}
        <div className="relative">
          <IconButton
            aria-label="More options"
            size="sm"
            variant="ghost"
            onClick={() => setShowMoreDropdown((prev) => !prev)}
            className="text-zinc-300 hover:text-white"
          >
            <MoreVertical className="w-4 h-4" />
          </IconButton>

          {showMoreDropdown && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl bg-agnix-elevated border border-agnix-border shadow-2xl py-1 z-30 animate-fade-in"
              onClick={() => setShowMoreDropdown(false)}
            >
              <button
                onClick={onOpenSettings}
                className="w-full text-left px-3.5 py-2 text-xs text-agnix-text-primary hover:bg-agnix-hover flex items-center gap-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                <span>Preferences</span>
              </button>
              <button
                onClick={() => {
                  window.open("https://github.com", "_blank");
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-agnix-text-primary hover:bg-agnix-hover flex items-center gap-2"
              >
                <Info className="w-3.5 h-3.5 text-zinc-400" />
                <span>Documentation</span>
              </button>
              <div className="border-t border-agnix-border my-1" />
              <div className="px-3.5 py-1 text-[10px] text-zinc-500 font-mono">
                AGNIX AI v0.1.0 (Core)
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
