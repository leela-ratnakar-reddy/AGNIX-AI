import { Conversation } from "@/types";

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Python FastAPI & Async Debugging",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago (Today)
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    messages: [
      {
        id: "msg-101",
        role: "user",
        content: "How should I structure async background tasks in FastAPI to avoid blocking the event loop when handling heavy I/O and CPU workloads?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "msg-102",
        role: "assistant",
        content: `In **FastAPI**, handling non-blocking workflows requires distinguishing between **I/O-bound** tasks and **CPU-bound** tasks.

### 1. I/O-Bound Workflows (API calls, DB queries)
Use native \`asyncio\` and FastAPI's built-in \`BackgroundTasks\`. Since Python's event loop handles I/O cooperatively, non-blocking network calls won't freeze other requests:

\`\`\`python
from fastapi import FastAPI, BackgroundTasks
import httpx

app = FastAPI()

async def sync_data_remotely(payload: dict):
    async with httpx.AsyncClient() as client:
        await client.post("https://api.external.com/webhook", json=payload)

@app.post("/process-order")
async def process_order(data: dict, background_tasks: BackgroundTasks):
    background_tasks.add_task(sync_data_remotely, data)
    return {"status": "accepted", "message": "Order queued"}
\`\`\`

### 2. CPU-Bound Workflows (ML inference, Image processing)
> **Key Rule**: Never run intensive computational loops inside an \`async def\` handler or standard \`BackgroundTasks\`, because the Python GIL will block the event loop for all concurrent connections.

For CPU-bound tasks, offload them to a process pool:

\`\`\`python
import asyncio
from concurrent.futures import ProcessPoolExecutor

process_pool = ProcessPoolExecutor(max_workers=4)

def heavy_computation(data: list[int]) -> int:
    # CPU-heavy calculation
    return sum(x ** 2 for x in data)

@app.post("/compute")
async def run_computation(values: list[int]):
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(process_pool, heavy_computation, values)
    return {"result": result}
\`\`\`

### Summary Recommendation
* For lightweight post-response tasks $\\rightarrow$ **\`BackgroundTasks\`**
* For heavy CPU operations $\\rightarrow$ **\`ProcessPoolExecutor\`** or a distributed queue like **Celery / ARQ** with Redis.`,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
  },
  {
    id: "conv-2",
    title: "React Server Components Deep Dive",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Yesterday
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    messages: [
      {
        id: "msg-201",
        role: "user",
        content: "Can you explain the core mental model difference between React Server Components (RSC) and traditional Client Components?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      },
      {
        id: "msg-202",
        role: "assistant",
        content: `The transition from Client Components to **React Server Components (RSC)** represents an architectural shift in where component code executes and what is shipped across the wire.

### Core Differences

| Property | Server Components (Default in App Router) | Client Components (\`'use client'\`) |
| :--- | :--- | :--- |
| **Execution** | Runs exclusively on the server at build/request time | Pre-rendered on server, hydrates and runs on client |
| **Bundle Size** | **Zero client JS footprint** | Shipped in the JavaScript bundle |
| **Backend Access** | Direct access to DB, filesystem, and secrets | Must use HTTP APIs / Server Actions |
| **Interactivity** | No \`useState\`, \`useEffect\`, or DOM events | Full React interactivity, state & lifecycle |

### Mental Model: The Component Tree
Think of Server Components as the **skeleton and data provider** of your application, and Client Components as **interactive islands** that provide user-driven behavior:

\`\`\`tsx
// app/dashboard/page.tsx (Server Component by default)
import { InteractiveChart } from "./InteractiveChart"; // Client Component
import { fetchMetrics } from "@/lib/db";

export default async function DashboardPage() {
  const metrics = await fetchMetrics(); // Direct secure data access

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Workspace Analytics</h1>
      {/* Interactive leaf component receives server data as props */}
      <InteractiveChart initialData={metrics} />
    </main>
  );
}
\`\`\`

By keeping the heavy dependencies (like markdown parsers, syntax highlighters, or database connectors) inside Server Components, your initial page payload remains minimal.`,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
      },
    ],
  },
  {
    id: "conv-3",
    title: "Startup Idea Analysis: Developer Tools",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
    messages: [
      {
        id: "msg-301",
        role: "user",
        content: "I want to validate a B2B dev tools concept: an AI agent that automatically audits Pull Requests for architectural drift and security vulnerabilities. How would you assess its viability?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
      {
        id: "msg-302",
        role: "assistant",
        content: `Here is a structured assessment for an **Automated Architectural & Security PR Auditor**:

### 1. Market Opportunity & Pain Points
* **High developer fatigue**: Senior engineers spend 20-30% of their time conducting PR reviews, often catching repetitive styling or architectural anti-patterns rather than core design flaws.
* **Security shift-left**: Catching misconfigurations (e.g. leaky database queries, exposed credentials, missing tenant isolation) before staging prevents high remediation costs.

### 2. Strategic Differentiator
Most existing bot reviewers create too much **noise** (hundreds of lint-level comments). To win, your agent must:
1. **Understand Repository Context**: Parse ASTs and maintain a vector graph of system boundaries.
2. **High Signal-to-Noise Ratio**: Only block or alert when confidence is $>95%$.
3. **One-Click Fixes**: Offer code suggestions that can be merged immediately.

### 3. Immediate Validation Steps
* **Phase 1**: Build a GitHub Action prototype tested across 10 open-source repositories.
* **Phase 2**: Interview 15 Tech Leads focusing specifically on their biggest pain in PR reviews.
* **Phase 3**: Measure PR merge speed acceleration before and after agent usage.`,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
      },
    ],
  },
];

export const SUGGESTED_PROMPTS = [
  {
    id: "p1",
    category: "Code" as const,
    title: "Build a REST API with Node.js & TypeScript",
    prompt: "Show me how to build a clean REST API in Node.js with TypeScript and Express, including route validation and error handling.",
  },
  {
    id: "p2",
    category: "Think" as const,
    title: "Explain quantum computing simply",
    prompt: "Explain quantum computing and quantum superposition simply, using an intuitive real-world analogy.",
  },
  {
    id: "p3",
    category: "Analyze" as const,
    title: "Analyze Python asynchronous performance",
    prompt: "What are the common bottlenecks when using asyncio in Python, and how can I profile event loop latency?",
  },
  {
    id: "p4",
    category: "Learn" as const,
    title: "Create a study plan for AI & Machine Learning",
    prompt: "Create an intensive 12-week study plan for mastering modern AI and deep learning, starting from mathematics to LLMs.",
  },
  {
    id: "p5",
    category: "Create" as const,
    title: "Design a high-converting SaaS landing page",
    prompt: "Outline the key architectural sections and copy structure for a high-converting developer-focused AI SaaS landing page.",
  },
  {
    id: "p6",
    category: "Learn" as const,
    title: "Explain microservices vs modular monolith",
    prompt: "Compare microservices vs modular monolith for early-stage startups. When should a team actually switch?",
  },
];
