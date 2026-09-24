"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  AlertTriangle,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Message } from "@/types";
import { AgnixLogo } from "./AgnixLogo";
import { CodeBlock } from "./CodeBlock";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface ChatMessageProps {
  message: Message;
  isLatestAssistant?: boolean;
  onRegenerate?: (id: string) => void;
  onEdit?: (id: string, newContent: string) => void;
  onReact?: (id: string, reaction: "like" | "dislike" | null) => void;
}

export function ChatMessage({
  message,
  isLatestAssistant,
  onRegenerate,
  onEdit,
  onReact,
}: ChatMessageProps) {
  const { showToast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const isUser = message.role === "user";
  const isError = message.isError;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      showToast("Copied to clipboard", "success");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast("Failed to copy", "error");
    }
  };

  const handleSaveEdit = () => {
    const trimmed = editContent.trim();
    if (!trimmed) return;
    setIsEditing(false);
    if (onEdit) {
      onEdit(message.id, trimmed);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "group relative w-full py-4 px-3 sm:px-6 transition-colors duration-150",
        isUser ? "flex justify-end" : "flex justify-start bg-transparent"
      )}
    >
      <div
        className={cn(
          "flex gap-3.5 max-w-3xl w-full",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        {/* Assistant Avatar */}
        {!isUser && (
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-lg bg-agnix-surface border border-agnix-border flex items-center justify-center shadow-sm">
              <AgnixLogo size="sm" showWordmark={false} />
            </div>
          </div>
        )}

        {/* Message Content Container */}
        <div
          className={cn(
            "flex flex-col text-sm",
            isUser ? "items-end max-w-2xl w-full" : "items-start w-full min-w-0"
          )}
        >
          {/* Header/Sender Label on Mobile */}
          <div className="flex items-center gap-2 mb-1.5 select-none">
            <span className="text-[12px] font-medium text-agnix-text-secondary">
              {isUser ? "You" : "AGNIX AI"}
            </span>
            <span className="text-[10px] text-agnix-text-muted font-mono">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* User Message Rendering or Edit Form */}
          {isUser ? (
            isEditing ? (
              <div className="w-full bg-agnix-surface border border-agnix-border rounded-xl p-3 shadow-lg">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-agnix-elevated text-agnix-text-primary rounded-lg p-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-agnix-red border border-agnix-border"
                  rows={3}
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSaveEdit}
                  >
                    Save & Submit
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative group/bubble">
                <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-gradient-to-br from-agnix-elevated to-agnix-surface border border-agnix-border text-white text-[14px] leading-relaxed shadow-sm whitespace-pre-wrap break-words max-w-prose">
                  {message.content}
                </div>

                {/* User Message Action Toolbar */}
                <div className="flex items-center justify-end gap-1 mt-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity">
                  <IconButton
                    aria-label="Edit message"
                    size="xs"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </IconButton>
                  <IconButton
                    aria-label={isCopied ? "Copied" : "Copy text"}
                    size="xs"
                    variant="ghost"
                    onClick={handleCopy}
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-agnix-red" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </IconButton>
                </div>
              </div>
            )
          ) : (
            /* Assistant Message Rendering */
            <div className="w-full min-w-0">
              {isError ? (
                <div className="p-4 rounded-xl border border-red-900/50 bg-red-950/20 text-red-200 text-sm flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-red-400 font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Something went wrong</span>
                  </div>
                  <p className="text-xs text-red-300/80 leading-relaxed">
                    {message.content || "An unexpected error occurred while communicating with the AI service."}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {onRegenerate && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onRegenerate(message.id)}
                        className="text-xs text-white"
                      >
                        <RotateCcw className="w-3 h-3 mr-1 text-agnix-red" /> Retry
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopy}
                      className="text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      Copy error details
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="agnix-prose text-[14.5px] leading-relaxed text-zinc-200 break-words">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre({ children }) {
                        return <>{children}</>;
                      },
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isBlock = match || String(children).includes("\n");
                        if (isBlock) {
                          return (
                            <CodeBlock
                              language={match ? match[1] : "code"}
                              value={String(children).replace(/\n$/, "")}
                            />
                          );
                        }
                        return (
                          <code
                            className="px-1.5 py-0.5 rounded bg-zinc-800 text-agnix-orange font-mono text-[13px] border border-zinc-700/50"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      a({ href, children }) {
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-agnix-orange hover:text-agnix-orangeFire underline underline-offset-2"
                          >
                            {children}
                          </a>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}

              {/* Assistant Action Bar */}
              {!isError && message.content && (
                <div className="flex items-center gap-1 mt-2.5 pt-1 border-t border-agnix-border/40 opacity-80 group-hover:opacity-100 transition-opacity">
                  <IconButton
                    aria-label={isCopied ? "Copied" : "Copy response"}
                    size="sm"
                    variant="ghost"
                    onClick={handleCopy}
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-agnix-red" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </IconButton>

                  {onRegenerate && (
                    <IconButton
                      aria-label="Regenerate response"
                      size="sm"
                      variant="ghost"
                      onClick={() => onRegenerate(message.id)}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </IconButton>
                  )}

                  {onReact && (
                    <>
                      <IconButton
                        aria-label="Like response"
                        size="sm"
                        variant={message.reaction === "like" ? "fire" : "ghost"}
                        onClick={() =>
                          onReact(
                            message.id,
                            message.reaction === "like" ? null : "like"
                          )
                        }
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </IconButton>
                      <IconButton
                        aria-label="Dislike response"
                        size="sm"
                        variant={message.reaction === "dislike" ? "danger" : "ghost"}
                        onClick={() =>
                          onReact(
                            message.id,
                            message.reaction === "dislike" ? null : "dislike"
                          )
                        }
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </IconButton>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Avatar */}
        {isUser && (
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-lg bg-agnix-elevated border border-agnix-border flex items-center justify-center text-agnix-text-secondary">
              <User className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
