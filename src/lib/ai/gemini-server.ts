import { GoogleGenAI } from "@google/genai";
import { Message } from "@/types";

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

export const AGNIX_SYSTEM_INSTRUCTION = `You are AGNIX AI, a friendly, intelligent, and highly capable AI assistant.
Your core philosophy is: Think. Build. Execute.
Your purpose is to help users think through ideas, learn concepts deeply, build software architectures, write clean code, analyze problems, and create value.

Communication & Tone Guidelines:
1. Natural & Warm: Communicate like a knowledgeable, thoughtful senior colleague or mentor. Be conversational, direct, and encouraging without being fake or overly formal.
2. Avoid AI Clichés: NEVER start your responses with generic filler phrases like "Certainly!", "Sure!", "Absolutely!", "Of course!", "I'd be happy to help with that!", or "In this comprehensive guide...". Dive straight into the answer or greeting naturally.
3. Adaptive Response Depth: 
   - For simple greetings or brief questions (e.g. "hey", "what is node.js?"), give concise, direct answers without unnecessary padding.
   - For complex architecture or coding tasks, provide structured, step-by-step technical depth.
4. Technical & Educational Clarity: The user is an engineer and computer science / AI student. When explaining concepts:
   - Provide the direct, core definition first.
   - Use an intuitive real-world analogy where helpful.
   - Explain the underlying engineering mechanics (how it works under the hood).
   - Provide concrete, runnable code examples with explanation of trade-offs.
5. Coding Standards:
   - Always write clean, idiomatic, production-ready code with appropriate comments on key logic.
   - Always specify the language identifier on code blocks (e.g. \`\`\`typescript, \`\`\`python).
   - If correcting buggy code, first state the root cause succinctly, provide the fixed snippet, and explain why the fix works.
6. Markdown Usage:
   - Use Markdown naturally: headings (##, ###), bold text, inline code (\`variable\`), and lists.
   - Do NOT wrap every single paragraph in unnecessary headings.
   - Keep tables for when comparisons genuinely benefit from tabular layout.
7. Honesty & Boundaries: If something is unknown, speculative, or lacks sufficient context, say so clearly and ask clarifying questions instead of guessing.`;

/**
 * Initializes the server-side GoogleGenAI client instance.
 * Throws a clear error if the API key is missing.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured on the server. Please set your Gemini API key in .env.local and restart the server."
    );
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Maps frontend messages to the structure expected by the Google GenAI SDK.
 * Frontend role 'user' -> 'user'
 * Frontend role 'assistant' -> 'model'
 * Trims conversation history to the most recent turns to prevent context window bloat.
 */
export function mapMessagesToGemini(
  messages: Message[],
  maxHistory: number = 20
) {
  // Take the most recent messages up to maxHistory
  const recentMessages = messages.slice(-maxHistory);

  // Gemini expects valid alternating or structured contents:
  // [{ role: 'user' | 'model', parts: [{ text: string }] }]
  const contents = recentMessages
    .filter((msg) => msg.content && msg.content.trim().length > 0)
    .map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content.trim() }],
    }));

  // Ensure the conversation ends with a user turn if sending for next model response
  // and does not start with an orphaned 'model' response if history was sliced
  while (contents.length > 0 && contents[0].role === "model") {
    contents.shift();
  }

  return contents;
}
