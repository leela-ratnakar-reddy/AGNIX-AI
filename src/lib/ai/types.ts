import { Message } from "@/types";

export interface AIServiceRequest {
  messages: Message[];
  signal?: AbortSignal;
  onChunk?: (chunk: string) => void;
}

export interface AIService {
  sendMessage(request: AIServiceRequest): Promise<string>;
}
