import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/types";
import {
  getGeminiClient,
  mapMessagesToGemini,
  GEMINI_MODEL,
  AGNIX_SYSTEM_INSTRUCTION,
} from "@/lib/ai/gemini-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Validate Content-Type
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid Content-Type. Expected application/json." },
        { status: 400 }
      );
    }

    // 2. Parse and Validate Request Body
    let body: { messages?: Message[] };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Malformed JSON payload in request body." },
        { status: 400 }
      );
    }

    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: 'messages' array is required and must not be empty." },
        { status: 400 }
      );
    }

    // 3. Validate latest message
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || typeof latestMessage.content !== "string") {
      return NextResponse.json(
        { error: "Latest message content is missing or invalid." },
        { status: 400 }
      );
    }

    const promptText = latestMessage.content.trim();
    if (!promptText) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    if (promptText.length > 25000) {
      return NextResponse.json(
        { error: "Message exceeds maximum allowed character length (25,000 characters)." },
        { status: 413 }
      );
    }

    // 4. Verify API Key
    let aiClient;
    try {
      aiClient = getGeminiClient();
    } catch (keyErr: unknown) {
      const message =
        keyErr instanceof Error
          ? keyErr.message
          : "GEMINI_API_KEY is not configured on the server.";
      return NextResponse.json({ error: message }, { status: 401 });
    }

    // 5. Map conversation history to Gemini contents format
    const contents = mapMessagesToGemini(messages, 20);

    if (contents.length === 0) {
      return NextResponse.json(
        { error: "No valid message history could be constructed for Gemini." },
        { status: 400 }
      );
    }

    // 6. Request streaming response from Gemini with automatic resilience
    const targetModel = GEMINI_MODEL;
    const candidateModels = Array.from(
      new Set([targetModel, "gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.8-flash"])
    );

    let geminiStream = null;
    let lastError: unknown = null;

    for (const model of candidateModels) {
      try {
        geminiStream = await aiClient.models.generateContentStream({
          model,
          contents,
          config: {
            systemInstruction: AGNIX_SYSTEM_INSTRUCTION,
          },
        });
        break; // Successfully connected!
      } catch (err: unknown) {
        lastError = err;
        const errString = err instanceof Error ? err.message : String(err);
        console.warn(`[AGNIX API] Model '${model}' failed:`, errString);

        // If it's an invalid key, don't keep trying fallback models
        if (
          errString.includes("API_KEY_INVALID") ||
          errString.includes("invalid API key") ||
          errString.includes("API key not valid")
        ) {
          break;
        }

        // On 503 temporary high demand or 404 not found, try the next candidate model
        if (
          errString.includes("503") ||
          errString.includes("UNAVAILABLE") ||
          errString.includes("high demand") ||
          errString.includes("NOT_FOUND") ||
          errString.includes("is not found")
        ) {
          continue;
        }

        break;
      }
    }

    if (!geminiStream) {
      const errMsg = lastError instanceof Error ? lastError.message : String(lastError);

      if (
        errMsg.includes("API_KEY_INVALID") ||
        errMsg.includes("invalid API key") ||
        errMsg.includes("API key not valid")
      ) {
        return NextResponse.json(
          {
            error:
              "The provided GEMINI_API_KEY is invalid. Please check your key at https://aistudio.google.com/ and update .env.local.",
          },
          { status: 401 }
        );
      }

      if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("429")) {
        return NextResponse.json(
          {
            error:
              "Gemini API rate limit reached. Please wait a moment before sending another message.",
          },
          { status: 429 }
        );
      }

      if (
        errMsg.includes("503") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("high demand")
      ) {
        return NextResponse.json(
          {
            error:
              "Google's Gemini service is experiencing temporary high demand right now. Please click Retry in a few seconds.",
          },
          { status: 503 }
        );
      }

      if (errMsg.includes("NOT_FOUND") || errMsg.includes("is not found")) {
        return NextResponse.json(
          {
            error: `Configured Gemini model '${targetModel}' is not recognized or not available for your API key. Check GEMINI_MODEL in .env.local.`,
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Failed to communicate with Gemini API. Please check your network connection and click Retry.",
        },
        { status: 502 }
      );
    }

    // 7. Pipe Gemini stream chunks to HTTP response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of geminiStream) {
            // Check if client disconnected or request was aborted
            if (req.signal.aborted) {
              controller.close();
              return;
            }

            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (streamErr: unknown) {
          console.error("[AGNIX API] Error while reading Gemini stream:", streamErr);
          const errDetail =
            streamErr instanceof Error ? streamErr.message : "Stream processing error";
          controller.enqueue(
            encoder.encode(`\n\n*[Connection interrupted: ${errDetail}]*`)
          );
          controller.close();
        }
      },
      cancel() {
        // Client aborted the connection
        console.log("[AGNIX API] Client aborted the streaming connection.");
      },
    });

    return new Response(readableStream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("[AGNIX API] Unhandled server error in /api/chat:", err);
    return NextResponse.json(
      { error: "An unexpected internal server error occurred. Please try again." },
      { status: 500 }
    );
  }
}
