"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Message } from "@/types";
import { ChatMessage } from "./ChatMessage";
import { ChatWelcome } from "./ChatWelcome";
import { TypingIndicator } from "./TypingIndicator";

interface ChatMessagesProps {
  messages: Message[];
  isGenerating: boolean;
  onSelectPrompt: (prompt: string) => void;
  onRegenerate: (id: string) => void;
  onEdit: (id: string, newContent: string) => void;
  onReact: (id: string, reaction: "like" | "dislike" | null) => void;
}

export function ChatMessages({
  messages,
  isGenerating,
  onSelectPrompt,
  onRegenerate,
  onEdit,
  onReact,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  // Track scroll position: if the user scrolls up, don't hijack their scroll
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    // Within 140px threshold is considered "following bottom"
    isNearBottomRef.current = distanceFromBottom < 140;
  }, []);

  // When a new message is added or streamed chunk arrives, scroll only if user is near bottom
  useEffect(() => {
    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isGenerating]);

  // When user switches conversation or clicks a prompt, reset to bottom
  const prevMessagesLength = useRef(messages.length);
  useEffect(() => {
    // If length went from 0 to 1+ or large jump, jump to bottom
    if (messages.length > 0 && prevMessagesLength.current === 0) {
      isNearBottomRef.current = true;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <ChatWelcome onSelectPrompt={onSelectPrompt} />
      </div>
    );
  }

  // Check if we need to show the typing indicator (i.e. generating and the latest message is empty)
  const latestMessage = messages[messages.length - 1];
  const showTypingIndicator =
    isGenerating && latestMessage?.role === "assistant" && !latestMessage.content;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
    >
      <div className="max-w-4xl mx-auto py-6 flex flex-col divide-y divide-agnix-border/20">
        {messages.map((message, index) => {
          // If this is the empty assistant placeholder while typing indicator is shown, skip rendering empty body
          if (
            isGenerating &&
            index === messages.length - 1 &&
            message.role === "assistant" &&
            !message.content
          ) {
            return null;
          }

          return (
            <ChatMessage
              key={message.id}
              message={message}
              isLatestAssistant={index === messages.length - 1 && message.role === "assistant"}
              onRegenerate={onRegenerate}
              onEdit={onEdit}
              onReact={onReact}
            />
          );
        })}

        {/* Typing State */}
        {showTypingIndicator && (
          <div className="px-4 sm:px-8 py-4">
            <TypingIndicator />
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
