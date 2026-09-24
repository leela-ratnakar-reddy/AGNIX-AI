export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  isError?: boolean;
  reaction?: "like" | "dislike" | null;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export interface ChatSettings {
  enterToSend: boolean;
  soundEnabled: boolean;
  theme: "dark";
}

export interface SuggestedPromptItem {
  id: string;
  category: "Code" | "Learn" | "Think" | "Create" | "Analyze";
  title: string;
  prompt: string;
}

export interface Toast {
  id: string;
  message: string;
  type?: "info" | "success" | "error";
  duration?: number;
}
