import { Message } from "@/types";
import { AIService, AIServiceRequest } from "./types";

/**
 * MockAIService simulates a high-performance streaming LLM response.
 * It observes AbortSignal for user cancellation and delivers text chunks progressively.
 * 
 * In V2/V3, this can be seamlessly swapped with Anthropic / OpenAI / Google Gemini API clients
 * or a Next.js Edge route (/api/chat) without changing the chat UI.
 */
export class MockAIService implements AIService {
  async sendMessage({ messages, signal, onChunk }: AIServiceRequest): Promise<string> {
    const latestUserMessage = messages
      .slice()
      .reverse()
      .find((m) => m.role === "user");

    const promptText = latestUserMessage?.content || "";
    const generatedContent = this.generateResponseForPrompt(promptText);

    // Simulate streaming delay with progressive chunks
    const words = generatedContent.split(" ");
    let fullAccumulated = "";

    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) {
        throw new DOMException("Generation aborted by user", "AbortError");
      }

      const word = words[i] + (i < words.length - 1 ? " " : "");
      fullAccumulated += word;

      if (onChunk) {
        onChunk(fullAccumulated);
      }

      // Realistic token cadence: 15ms - 35ms per token/word
      await new Promise((resolve) => setTimeout(resolve, 20 + Math.random() * 20));
    }

    return fullAccumulated;
  }

  private generateResponseForPrompt(prompt: string): string {
    const lower = prompt.toLowerCase();

    if (lower.includes("react") || lower.includes("next")) {
      return `### React & Next.js Core Architecture

React is a declarative, component-based UI library. In modern React (particularly with **Next.js App Router**), components default to **React Server Components (RSC)**.

#### Key Architectural Highlights
1. **Server-Side Rendering (SSR)**: Generates HTML on demand for each incoming request.
2. **React Server Components (RSC)**: Keep backend code, heavy dependencies, and secure keys on the server without shipping them to the client browser.
3. **Suspense & Streaming**: Lets you incrementally stream UI chunks as data resolves, drastically improving **Time to First Byte (TTFB)** and **Largest Contentful Paint (LCP)**.

\`\`\`tsx
import { Suspense } from "react";
import { UserProfile } from "./UserProfile";
import { ProfileSkeleton } from "./ProfileSkeleton";

export default function AccountPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Account Settings</h1>
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile />
      </Suspense>
    </div>
  );
}
\`\`\`

> **Pro Tip**: Use \`'use client'\` only at the leaf nodes where user interactions (events, state hooks) are strictly required.`;
    }

    if (lower.includes("python") || lower.includes("fastapi")) {
      return `### Python Async & Systems Design

When building scalable services in Python, asynchronous concurrency via \`asyncio\` allows a single process to handle thousands of concurrent network connections without thread overhead.

\`\`\`python
import asyncio
from typing import AsyncGenerator

async def data_stream() -> AsyncGenerator[dict, None]:
    for i in range(5):
        await asyncio.sleep(0.5) # Non-blocking I/O wait
        yield {"chunk_id": i, "status": "active"}

async def main():
    async for item in data_stream():
        print(f"Received item: {item}")

if __name__ == "__main__":
    asyncio.run(main())
\`\`\`

#### Rules for Production Python
* **Never block the event loop**: Offload heavy math or encryption to \`concurrent.futures.ProcessPoolExecutor\`.
* **Use Connection Pooling**: Ensure HTTP and PostgreSQL clients reuse TCP connections.
* **Handle Task Cancellation**: Wrap long-lived tasks with structured cancellation handlers.`;
    }

    if (lower.includes("quantum")) {
      return `### Quantum Computing & Superposition Explained

In classical computers, the fundamental unit of information is the **bit**, which exists strictly as either \`0\` or \`1\`.

In quantum computing, the fundamental unit is the **qubit** (quantum bit).

#### The Superposition Analogy: A Spinning Coin
* **Classical bit**: Imagine a coin resting flat on a table. It is definitively either *Heads* (1) or *Tails* (0).
* **Qubit in superposition**: Imagine the coin spinning rapidly on its edge. While it is spinning, it isn't strictly heads or tails—it exists in a **linear combination of both states simultaneously**.

$$\\lvert \\psi \\rangle = \\alpha \\lvert 0 \\rangle + \\beta \\lvert 1 \\rangle$$

When you stop the coin (make a measurement), it collapses into either \`0\` or \`1\` with a probability determined by its amplitudes.

#### Why This Matters for Computation
A system of $n$ classical bits can represent only **one** $n$-bit number at any given moment. A system of $n$ qubits can represent all $2^n$ numbers simultaneously. This enables exponential parallelism for algorithms like Shor's (factoring) and Grover's (unstructured search).`;
    }

    if (lower.includes("study plan") || lower.includes("learn") || lower.includes("plan")) {
      return `### 12-Week AI & Deep Learning Roadmap

Here is a structured engineering curriculum designed to take you from foundational mathematics to deploying LLMs in production:

#### Phase 1: Mathematical Foundations (Weeks 1–3)
* **Linear Algebra**: Vectors, matrices, eigenvalues, SVD, tensor contractions.
* **Multivariate Calculus**: Gradients, Jacobians, Hessians, automatic differentiation.
* **Probability & Statistics**: Bayes theorem, distributions, maximum likelihood estimation (MLE).

#### Phase 2: Classical Machine Learning & Neural Networks (Weeks 4–7)
* Regression, decision trees, ensemble methods (XGBoost).
* Multilayer Perceptrons (MLPs), Backpropagation from scratch in pure Python/NumPy.
* Optimization techniques: SGD, Adam, learning rate schedules, and regularization (Dropout, LayerNorm).

#### Phase 3: Transformer Architecture & Modern LLMs (Weeks 8–10)
* Scaled dot-product self-attention mechanism, multi-head attention.
* Positional embeddings (RoPE), KV cache mechanics.
* Fine-tuning with LoRA / QLoRA using Hugging Face \`transformers\` and \`peft\`.

#### Phase 4: Production Deployment & Systems (Weeks 11–12)
* Inference optimization: vLLM, TensorRT-LLM, quantization (AWQ, GGUF).
* Retrieval-Augmented Generation (RAG) architecture and vector indexing.`;
    }

    if (lower.includes("startup") || lower.includes("design") || lower.includes("saas")) {
      return `### Modern Developer-Focused SaaS Architecture

Building a successful developer-focused product requires extreme focus on **time-to-first-value (TTFV)** and developer delight.

#### Core Value Architecture
1. **Frictionless Onboarding**: Provide an instant CLI or copy-paste curl command. Avoid requiring a credit card or 10-step wizard.
2. **Transparent Infrastructure**: Maintain a public status page and clear uptime SLAs.
3. **World-Class Documentation**: Interactive API playgrounds, TypeScript SDKs, and copyable snippets.

> "Developers do not want to be sold to; they want their problems solved with minimal friction and maximum speed."

#### Suggested Next Steps
* Run a quick landing page smoke test to measure email conversion before writing backend code.
* Interview 10 potential users about their existing workarounds.`;
    }

    // Default intelligent response
    return `### Analysis & Solution

Thank you for your prompt: **"${prompt.trim()}"**.

Here is a breakdown of the key concepts and recommendations:

#### 1. Core Principles
* **Modularity**: Break down complex architectures into isolated, decoupled components with single responsibilities.
* **Determinism**: Ensure critical business workflows yield predictable, repeatable outputs.
* **Performance First**: Design data structures and queries to optimize for low latency and minimal resource consumption.

#### 2. Implementation Example

\`\`\`typescript
interface ExecutionContext<T> {
  id: string;
  timestamp: number;
  payload: T;
  execute: () => Promise<void>;
}

async function runTask<T>(context: ExecutionContext<T>): Promise<boolean> {
  try {
    console.log(\`[AGNIX] Starting execution task: \${context.id}\`);
    await context.execute();
    return true;
  } catch (err) {
    console.error(\`[AGNIX] Task execution failed:\`, err);
    return false;
  }
}
\`\`\`

#### 3. Summary & Next Steps
Feel free to ask follow-up questions or refine specific parts of this solution—we can dive deeper into code, architecture, or edge cases.`;
  }
}

export const aiService: AIService = new MockAIService();
