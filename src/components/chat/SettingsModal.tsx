"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ChatSettings } from "@/types";
import { AgnixLogo } from "./AgnixLogo";
import { RotateCcw, Moon, Send, Volume2, ShieldCheck, Info } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onUpdateSettings: (settings: Partial<ChatSettings>) => void;
  onResetConversations: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetConversations,
}: SettingsModalProps) {
  const { showToast } = useToast();

  const handleToggleEnterToSend = () => {
    onUpdateSettings({ enterToSend: !settings.enterToSend });
    showToast(
      `Enter to send ${!settings.enterToSend ? "enabled" : "disabled"}`,
      "info"
    );
  };

  const handleToggleSound = () => {
    onUpdateSettings({ soundEnabled: !settings.soundEnabled });
    showToast(
      `Sound effects ${!settings.soundEnabled ? "enabled" : "disabled"}`,
      "info"
    );
  };

  const handleResetData = () => {
    onResetConversations();
    showToast("Reset to initial demo conversations", "success");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings & Preferences"
      description="Configure your AGNIX AI workspace environment."
      className="max-w-md"
    >
      <div className="space-y-6 select-none">
        {/* Section: Chat Behavior */}
        <div>
          <h3 className="text-xs font-semibold text-agnix-text-secondary uppercase tracking-wider mb-3">
            Chat Preferences
          </h3>

          <div className="space-y-3">
            {/* Enter to Send Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-agnix-elevated border border-agnix-border/70">
              <div className="flex items-center gap-3">
                <Send className="w-4 h-4 text-agnix-red" />
                <div>
                  <p className="text-sm font-medium text-white">Enter to Send</p>
                  <p className="text-xs text-agnix-text-muted">
                    Press Shift+Enter for a newline
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleEnterToSend}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.enterToSend ? "bg-agnix-red" : "bg-zinc-700"
                }`}
                role="switch"
                aria-checked={settings.enterToSend}
                aria-label="Toggle Enter to send"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.enterToSend ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-agnix-elevated border border-agnix-border/70">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-agnix-orange" />
                <div>
                  <p className="text-sm font-medium text-white">Audio Feedback</p>
                  <p className="text-xs text-agnix-text-muted">
                    Subtle cues on send and completion
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleSound}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.soundEnabled ? "bg-agnix-orange" : "bg-zinc-700"
                }`}
                role="switch"
                aria-checked={settings.soundEnabled}
                aria-label="Toggle Sound"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.soundEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section: Appearance */}
        <div>
          <h3 className="text-xs font-semibold text-agnix-text-secondary uppercase tracking-wider mb-3">
            Appearance
          </h3>
          <div className="flex items-center justify-between p-3 rounded-xl bg-agnix-elevated border border-agnix-border/70">
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-zinc-300" />
              <div>
                <p className="text-sm font-medium text-white">Theme</p>
                <p className="text-xs text-agnix-text-muted">
                  AGNIX Deep Carbon (Black + Fire)
                </p>
              </div>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
              Dark Default
            </span>
          </div>
        </div>

        {/* Section: Data & Reset */}
        <div>
          <h3 className="text-xs font-semibold text-agnix-text-secondary uppercase tracking-wider mb-3">
            Data Management
          </h3>
          <div className="flex items-center justify-between p-3 rounded-xl bg-agnix-elevated border border-agnix-border/70">
            <div>
              <p className="text-sm font-medium text-white">Reset Local History</p>
              <p className="text-xs text-agnix-text-muted">
                Restore default demo discussions
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleResetData}
              className="text-xs gap-1.5"
            >
              <RotateCcw className="w-3 h-3 text-agnix-red" />
              <span>Reset</span>
            </Button>
          </div>
        </div>

        {/* Section: About AGNIX AI */}
        <div className="pt-2 border-t border-agnix-border">
          <div className="flex items-center gap-3 mb-2">
            <AgnixLogo size="sm" />
            <span className="text-xs font-mono text-zinc-500">v0.1.0 (Core)</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            <strong className="text-zinc-200">AGNIX AI</strong> — Think. Build. Execute.
            <br />
            This is the first version of the AGNIX AI workspace. Designed with clean modular boundaries to scale for persistent storage, multi-model routing, and autonomous agent orchestration.
          </p>
        </div>
      </div>
    </Modal>
  );
}
