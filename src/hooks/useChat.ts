"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Conversation, Message, ChatSettings } from "@/types";
import { INITIAL_CONVERSATIONS } from "@/lib/chat/demo-data";
import { aiService } from "@/lib/ai";

const STORAGE_KEY = "agnix_conversations_v1";
const SETTINGS_KEY = "agnix_settings_v1";

const DEFAULT_SETTINGS: ChatSettings = {
  enterToSend: true,
  soundEnabled: false,
  theme: "dark",
};

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    return INITIAL_CONVERSATIONS;
  });

  const [activeId, setActiveId] = useState<string | null>(() => {
    return INITIAL_CONVERSATIONS[0]?.id || null;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);

  // Reference to abort ongoing generation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Hydrate from localStorage once mounted
  useEffect(() => {
    try {
      const savedConvs = localStorage.getItem(STORAGE_KEY);
      if (savedConvs) {
        const parsed = JSON.parse(savedConvs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConversations(parsed);
          setActiveId(parsed[0].id);
        }
      }

      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.warn("[AGNIX] Failed to read localStorage:", e);
    }
  }, []);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.warn("[AGNIX] Failed to persist conversations:", e);
    }
  }, [conversations]);

  // Save settings
  const updateSettings = useCallback((newSettings: Partial<ChatSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("[AGNIX] Failed to save settings:", e);
      }
      return updated;
    });
  }, []);

  // Get current active conversation
  const currentConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeId) || null;
  }, [conversations, activeId]);

  // Filtered conversations based on search
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.messages.some((m) => m.content.toLowerCase().includes(query))
    );
  }, [conversations, searchQuery]);

  // Group conversations by time (Today, Yesterday, Previous History)
  const groupedConversations = useMemo(() => {
    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const older: Conversation[] = [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

    filteredConversations.forEach((conv) => {
      const convTime = new Date(conv.updatedAt || conv.createdAt).getTime();
      if (convTime >= startOfToday) {
        today.push(conv);
      } else if (convTime >= startOfYesterday) {
        yesterday.push(conv);
      } else {
        older.push(conv);
      }
    });

    return { today, yesterday, older };
  }, [filteredConversations]);

  // Create a brand new conversation
  const createNewChat = useCallback(() => {
    if (currentConversation && currentConversation.messages.length === 0) {
      return currentConversation.id;
    }

    const newId = "conv-" + Date.now();
    const newConv: Conversation = {
      id: newId,
      title: "New Chat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newId);
    setError(null);
    return newId;
  }, [currentConversation]);

  // Select conversation
  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    setError(null);
  }, []);

  // Rename conversation
  const renameConversation = useCallback((id: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: trimmed } : c))
    );
  }, []);

  // Delete conversation
  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const remaining = prev.filter((c) => c.id !== id);
        if (activeId === id) {
          const nextActive = remaining[0]?.id || null;
          setActiveId(nextActive);
        }
        return remaining;
      });
    },
    [activeId]
  );

  // Clear all conversations and reset to demo
  const resetConversations = useCallback(() => {
    setConversations(INITIAL_CONVERSATIONS);
    setActiveId(INITIAL_CONVERSATIONS[0].id);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  // Stop ongoing generation
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  }, []);

  // Core stream runner to prevent duplicate boilerplate across send, regenerate, and edit
  const executeGeneration = useCallback(
    async (
      targetConvId: string,
      assistantMessageId: string,
      historyContext: Message[]
    ) => {
      setIsGenerating(true);
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      let lastChunk = "";

      try {
        await aiService.sendMessage({
          messages: historyContext,
          signal: abortController.signal,
          onChunk: (chunk: string) => {
            lastChunk = chunk;
            setConversations((prev) =>
              prev.map((c) => {
                if (c.id === targetConvId) {
                  return {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMessageId
                        ? { ...m, content: chunk, isError: false }
                        : m
                    ),
                  };
                }
                return c;
              })
            );
          },
        });
      } catch (err: unknown) {
        const isAbort =
          (err instanceof DOMException && err.name === "AbortError") ||
          (err instanceof Error && err.name === "AbortError") ||
          abortController.signal.aborted;

        if (isAbort) {
          console.log("[AGNIX] Generation stopped by user.");
          // If aborted before any text was received, mark it cleanly
          if (!lastChunk.trim()) {
            setConversations((prev) =>
              prev.map((c) => {
                if (c.id === targetConvId) {
                  return {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMessageId
                        ? { ...m, content: "*(Generation stopped by user)*" }
                        : m
                    ),
                  };
                }
                return c;
              })
            );
          }
        } else {
          console.error("[AGNIX] AI generation error:", err);
          const errorMsg =
            err instanceof Error
              ? err.message
              : "Something went wrong while communicating with Gemini. Please try again.";
          setError(errorMsg);

          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === targetConvId) {
                return {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMessageId
                      ? {
                          ...m,
                          content: errorMsg,
                          isError: true,
                        }
                      : m
                  ),
                };
              }
              return c;
            })
          );
        }
      } finally {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    []
  );

  // Send a new user message
  const sendMessage = useCallback(
    async (text: string, customConvId?: string) => {
      const trimmed = text.trim();
      if (!trimmed || isGenerating) return;

      let targetConvId = customConvId || activeId;

      // If no active conversation exists, create one
      if (!targetConvId) {
        targetConvId = "conv-" + Date.now();
        const newConv: Conversation = {
          id: targetConvId,
          title: trimmed.slice(0, 36) + (trimmed.length > 36 ? "..." : ""),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveId(targetConvId);
      }

      setError(null);

      // Create User message
      const userMessage: Message = {
        id: "msg-user-" + Date.now(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      // Create Assistant placeholder message
      const assistantId = "msg-ai-" + (Date.now() + 1);
      const assistantMessage: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      };

      // Prepare conversation history context
      const existingConv = conversations.find((c) => c.id === targetConvId);
      const existingMessages = existingConv ? existingConv.messages : [];
      const historyContext = [...existingMessages, userMessage];

      // Append user message and empty assistant placeholder
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConvId) {
            const isFirstUserMessage = c.messages.length === 0;
            const updatedTitle =
              isFirstUserMessage && c.title === "New Chat"
                ? trimmed.slice(0, 36) + (trimmed.length > 36 ? "..." : "")
                : c.title;

            return {
              ...c,
              title: updatedTitle,
              updatedAt: new Date().toISOString(),
              messages: [...c.messages, userMessage, assistantMessage],
            };
          }
          return c;
        })
      );

      await executeGeneration(targetConvId, assistantId, historyContext);
    },
    [activeId, conversations, executeGeneration, isGenerating]
  );

  // Regenerate an assistant response without duplicating the user message
  const regenerateMessage = useCallback(
    async (messageId: string) => {
      if (!currentConversation || isGenerating) return;

      const msgIndex = currentConversation.messages.findIndex((m) => m.id === messageId);
      if (msgIndex === -1) return;

      // Extract conversation history up to the preceding user turn
      const historyContext = currentConversation.messages.slice(0, msgIndex);
      if (historyContext.length === 0) return;

      // Clear the target assistant message content and reset error state
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === currentConversation.id) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content: "", isError: false } : m
              ),
            };
          }
          return c;
        })
      );

      await executeGeneration(currentConversation.id, messageId, historyContext);
    },
    [currentConversation, executeGeneration, isGenerating]
  );

  // Edit a user message and re-generate the conversation from that point
  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      if (!currentConversation || isGenerating) return;

      const msgIndex = currentConversation.messages.findIndex((m) => m.id === messageId);
      if (msgIndex === -1) return;

      const trimmed = newContent.trim();
      if (!trimmed) return;

      // Update the user message and truncate everything after it
      const updatedUserMessage: Message = {
        ...currentConversation.messages[msgIndex],
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      const truncatedHistory = [
        ...currentConversation.messages.slice(0, msgIndex),
        updatedUserMessage,
      ];

      const newAssistantId = "msg-ai-" + Date.now();
      const newAssistantMessage: Message = {
        id: newAssistantId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === currentConversation.id) {
            return {
              ...c,
              updatedAt: new Date().toISOString(),
              messages: [...truncatedHistory, newAssistantMessage],
            };
          }
          return c;
        })
      );

      await executeGeneration(
        currentConversation.id,
        newAssistantId,
        truncatedHistory
      );
    },
    [currentConversation, executeGeneration, isGenerating]
  );

  // React to message (like / dislike)
  const reactToMessage = useCallback(
    (messageId: string, reaction: "like" | "dislike" | null) => {
      setConversations((prev) =>
        prev.map((c) => ({
          ...c,
          messages: c.messages.map((m) =>
            m.id === messageId ? { ...m, reaction } : m
          ),
        }))
      );
    },
    []
  );

  return {
    conversations,
    currentConversation,
    activeId,
    isGenerating,
    error,
    searchQuery,
    settings,
    groupedConversations,
    setSearchQuery,
    selectConversation,
    createNewChat,
    renameConversation,
    deleteConversation,
    resetConversations,
    sendMessage,
    stopGeneration,
    regenerateMessage,
    editMessage,
    reactToMessage,
    updateSettings,
  };
}
