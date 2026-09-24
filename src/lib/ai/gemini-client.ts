import { Message } from "@/types";
import { AIService, AIServiceRequest } from "./types";

/**
 * GeminiAIService communicates with the secure server-side /api/chat route.
 * It streams real-time responses from Google's Gemini API over HTTP streaming
 * and dispatches chunk updates to the UI.
 */
export class GeminiAIService implements AIService {
  async sendMessage({ messages, signal, onChunk }: AIServiceRequest): Promise<string> {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
      signal,
    });

    // Check for HTTP errors
    if (!response.ok) {
      let errorMessage = "Failed to communicate with AI service.";
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        const text = await response.text();
        if (text) {
          errorMessage = text;
        }
      }
      throw new Error(errorMessage);
    }

    if (!response.body) {
      throw new Error("No response stream received from the server.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let accumulatedText = "";

    try {
      while (true) {
        if (signal?.aborted) {
          await reader.cancel();
          break;
        }

        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        if (onChunk) {
          onChunk(accumulatedText);
        }
      }
    } catch (err: unknown) {
      if (signal?.aborted || (err instanceof DOMException && err.name === "AbortError")) {
        // User aborted the stream intentionally; return whatever was accumulated so far
        return accumulatedText;
      }
      throw err;
    } finally {
      reader.releaseLock();
    }

    return accumulatedText;
  }
}

export const aiService: AIService = new GeminiAIService();
