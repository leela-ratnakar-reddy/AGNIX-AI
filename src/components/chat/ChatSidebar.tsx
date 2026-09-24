"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit2,
  Settings,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";
import { AgnixLogo } from "./AgnixLogo";
import { Conversation } from "@/types";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface ChatSidebarProps {
  conversations: Conversation[];
  groupedConversations: {
    today: Conversation[];
    yesterday: Conversation[];
    older: Conversation[];
  };
  activeId: string | null;
  searchQuery: string;
  isOpen: boolean;
  isMobileOpen: boolean;
  onSearchChange: (q: string) => void;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
}

export function ChatSidebar({
  conversations,
  groupedConversations,
  activeId,
  searchQuery,
  isOpen,
  isMobileOpen,
  onSearchChange,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  onToggleCollapse,
  onCloseMobile,
  onOpenSettings,
}: ChatSidebarProps) {
  const { showToast } = useToast();

  // Dialog states for Rename and Delete
  const [editingConv, setEditingConv] = useState<{ id: string; title: string } | null>(null);
  const [deleteConvId, setDeleteConvId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleStartRename = (conv: Conversation) => {
    setActiveMenuId(null);
    setEditingConv({ id: conv.id, title: conv.title });
  };

  const handleSaveRename = () => {
    if (editingConv && editingConv.title.trim()) {
      onRenameConversation(editingConv.id, editingConv.title.trim());
      showToast("Conversation renamed", "success");
      setEditingConv(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConvId) {
      onDeleteConversation(deleteConvId);
      showToast("Conversation deleted", "info");
      setDeleteConvId(null);
    }
  };

  const renderConversationGroup = (title: string, list: Conversation[]) => {
    if (list.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="px-3 py-1 text-[11px] font-semibold text-agnix-text-muted uppercase tracking-wider">
          {title}
        </div>
        <div className="mt-1 space-y-0.5">
          {list.map((conv) => {
            const isActive = conv.id === activeId;
            const isMenuOpen = activeMenuId === conv.id;

            return (
              <div
                key={conv.id}
                className={cn(
                  "group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer select-none",
                  isActive
                    ? "bg-agnix-surface text-white border-l-2 border-l-agnix-red border-y border-r border-agnix-border/50 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-agnix-hover/60"
                )}
                onClick={() => {
                  onSelectConversation(conv.id);
                  if (isMobileOpen) onCloseMobile();
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                  <MessageSquare
                    className={cn(
                      "w-3.5 h-3.5 flex-shrink-0 transition-colors",
                      isActive ? "text-agnix-red" : "text-zinc-500 group-hover:text-zinc-400"
                    )}
                  />
                  <span className="truncate">{conv.title}</span>
                </div>

                {/* 3-Dot Options Menu */}
                <div
                  className={cn(
                    "flex items-center transition-opacity",
                    isActive || isMenuOpen
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      setActiveMenuId((prev) => (prev === conv.id ? null : conv.id))
                    }
                    className="p-1 rounded hover:bg-agnix-elevated text-zinc-400 hover:text-white transition-colors"
                    aria-label="Conversation options"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-2 top-8 z-40 w-36 rounded-lg bg-agnix-elevated border border-agnix-border shadow-xl py-1 animate-fade-in">
                      <button
                        onClick={() => handleStartRename(conv)}
                        className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-agnix-hover flex items-center gap-2"
                      >
                        <Edit2 className="w-3 h-3 text-zinc-400" />
                        <span>Rename</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          setDeleteConvId(conv.id);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/30 flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#080808] border-r border-agnix-border select-none">
      {/* Top Header / Brand */}
      <div className="p-4 flex items-center justify-between border-b border-agnix-border/70">
        <AgnixLogo size="md" />

        {/* Mobile close button */}
        <div className="flex items-center gap-1">
          <IconButton
            aria-label="Close sidebar"
            size="sm"
            variant="ghost"
            onClick={onCloseMobile}
            className="md:hidden text-zinc-400"
          >
            <X className="w-4 h-4" />
          </IconButton>

          {/* Desktop collapse toggle */}
          <IconButton
            aria-label="Collapse sidebar"
            size="sm"
            variant="ghost"
            onClick={onToggleCollapse}
            className="hidden md:inline-flex text-zinc-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </IconButton>
        </div>
      </div>

      {/* New Chat Primary Button */}
      <div className="p-3">
        <Button
          onClick={() => {
            onNewChat();
            if (isMobileOpen) onCloseMobile();
          }}
          variant="primary"
          size="md"
          className="w-full justify-start gap-2.5 font-medium text-xs py-2.5"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="px-3 pb-2">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-agnix-surface text-xs text-agnix-text-primary placeholder:text-zinc-600 rounded-lg pl-8 pr-3 py-1.5 border border-agnix-border/60 focus:outline-none focus:border-agnix-red/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 text-zinc-500 hover:text-zinc-300 p-0.5"
              aria-label="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Conversation List / Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {conversations.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-600 px-4">
            <Flame className="w-5 h-5 mx-auto mb-2 text-zinc-700" />
            <p>No conversations yet.</p>
            <p className="mt-1 text-[11px]">Start a new chat to begin.</p>
          </div>
        ) : groupedConversations.today.length === 0 &&
          groupedConversations.yesterday.length === 0 &&
          groupedConversations.older.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No matching chats found.
          </div>
        ) : (
          <>
            {renderConversationGroup("Today", groupedConversations.today)}
            {renderConversationGroup("Yesterday", groupedConversations.yesterday)}
            {renderConversationGroup("Previous History", groupedConversations.older)}
          </>
        )}
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-agnix-border/70 space-y-1 bg-agnix-secondary/40">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-agnix-surface transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => {
            window.open("https://github.com", "_blank");
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-agnix-surface transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Help & Feedback</span>
        </button>

        {/* User Profile UI Placeholder */}
        <div className="pt-2 mt-1 border-t border-agnix-border/40 flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-agnix-red to-agnix-orange flex items-center justify-center text-white font-bold text-xs shadow-sm">
              U
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">Local Developer</p>
              <p className="text-[10px] text-zinc-500 truncate">AGNIX Free Tier</p>
            </div>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono">
            V1
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:block h-screen transition-all duration-200 z-30 flex-shrink-0",
          isOpen ? "w-[270px]" : "w-0 overflow-hidden border-none"
        )}
      >
        <div className="w-[270px] h-full">{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onCloseMobile}
        >
          <div
            className="w-[280px] h-full max-w-[85vw] bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Rename Conversation Modal */}
      <Modal
        isOpen={Boolean(editingConv)}
        onClose={() => setEditingConv(null)}
        title="Rename Conversation"
        description="Update the title for this chat session."
      >
        <div className="space-y-4">
          <input
            type="text"
            value={editingConv?.title || ""}
            onChange={(e) =>
              setEditingConv((prev) =>
                prev ? { ...prev, title: e.target.value } : null
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveRename();
            }}
            placeholder="Conversation title"
            className="w-full bg-agnix-elevated text-sm text-agnix-text-primary rounded-lg px-3 py-2 border border-agnix-border focus:outline-none focus:border-agnix-red"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingConv(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveRename}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConvId)}
        onClose={() => setDeleteConvId(null)}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteConvId(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
