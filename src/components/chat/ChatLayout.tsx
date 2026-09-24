"use client";

import React, { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatSidebar } from "./ChatSidebar";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatComposer } from "./ChatComposer";
import { SettingsModal } from "./SettingsModal";
import { useToast } from "@/components/ui/Toast";

export function ChatLayout() {
  const {
    conversations,
    currentConversation,
    activeId,
    isGenerating,
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
  } = useChat();

  const { showToast } = useToast();

  // Desktop sidebar collapse & mobile drawer toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleNewChat = () => {
    createNewChat();
    showToast("New chat created", "info");
  };

  const currentTitle = currentConversation?.title || "New Chat";
  const messages = currentConversation?.messages || [];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-agnix-bg text-agnix-text-primary antialiased">
      {/* Navigation Sidebar */}
      <ChatSidebar
        conversations={conversations}
        groupedConversations={groupedConversations}
        activeId={activeId}
        searchQuery={searchQuery}
        isOpen={isSidebarOpen}
        isMobileOpen={isMobileDrawerOpen}
        onSearchChange={setSearchQuery}
        onSelectConversation={selectConversation}
        onNewChat={handleNewChat}
        onRenameConversation={renameConversation}
        onDeleteConversation={deleteConversation}
        onToggleCollapse={() => setIsSidebarOpen((prev) => !prev)}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Chat Workstation */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative bg-agnix-bg">
        {/* Header */}
        <ChatHeader
          title={currentTitle}
          onToggleSidebar={() => {
            if (window.innerWidth < 768) {
              setIsMobileDrawerOpen((prev) => !prev);
            } else {
              setIsSidebarOpen((prev) => !prev);
            }
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onNewChat={handleNewChat}
          onToggleSearch={() => {
            if (window.innerWidth < 768) {
              setIsMobileDrawerOpen(true);
            } else if (!isSidebarOpen) {
              setIsSidebarOpen(true);
            }
          }}
        />

        {/* Message Thread & Welcome Screen */}
        <ChatMessages
          messages={messages}
          isGenerating={isGenerating}
          onSelectPrompt={(prompt) => sendMessage(prompt)}
          onRegenerate={regenerateMessage}
          onEdit={editMessage}
          onReact={reactToMessage}
        />

        {/* Bottom Input Composer */}
        <ChatComposer
          onSendMessage={sendMessage}
          onStopGeneration={stopGeneration}
          isGenerating={isGenerating}
          enterToSend={settings.enterToSend}
        />
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetConversations={resetConversations}
      />
    </div>
  );
}
