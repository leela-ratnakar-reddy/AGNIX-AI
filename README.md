# AGNIX AI

> **Think. Build. Execute.**

AGNIX AI is a production-quality AI workspace engineered for deep reasoning, architectural design, software engineering, and rapid execution. 

This repository contains **V1 (Core AI Chatbot Application)**, establishing the foundational architecture, design tokens, and modular systems to scale into the broader AGNIX platform.

---

## 1. Overview

AGNIX AI is designed for engineers, creators, and researchers who demand high cognitive density and precision. Instead of a noisy or bloated interface, AGNIX AI adheres to a cinematic, dark-carbon visual system with high-precision fire accents (**Black + Red + Orange + Fire**).

### Visual Philosophy
* **70–80%** Black / Carbon (`#050505`, `#080808`, `#101010`)
* **10–15%** Precision Red (`#EF2B2D`, `#FF3B30`)
* **5–10%** Fire Orange (`#FF6A00`, `#FF8A00`)
* Strict contrast ratios, crisp typography, and subtle micro-interactions without gaming neon or excessive glassmorphism.

---

## 2. V1 Features

* **Conversational AI Interface**:
  * Markdown parsing (headings, lists, blockquotes, bold/italic, tables).
  * Monospace code blocks with language badge and one-click snippet copying.
  * Real-time streaming simulation with cooperative `AbortController` cancellation.
  * Animated typing indicator (*"AGNIX is thinking..."* with fire-colored pulsing dots).
* **Conversation Management**:
  * Local state and `localStorage` persistence.
  * Time-based categorization (**Today**, **Yesterday**, **Previous History**).
  * Instant full-text search across titles and message transcripts.
  * Session renaming and deletion with confirmation modals.
  * One-click **New Chat** initialization.
* **Message Controls**:
  * **User messages**: Inline message editing and text copying.
  * **AI responses**: Markdown rendering, one-click copying, regeneration/retry, and like/dislike feedback.
* **Intelligent Composer**:
  * Auto-expanding multiline textarea (up to 200px max before scroll).
  * Keyboard navigation (`Enter` to send, `Shift+Enter` for newline).
  * Active Stop/Cancel generation button.
  * Extensible action slots for attachments (V3) and voice transcription (V4).
* **Welcome Screen & Prompts**:
  * Geometric brand mark with stylized flame apex.
  * Curated suggested prompt cards across **Code**, **Think**, **Analyze**, **Learn**, and **Create**.
* **Settings & Preferences**:
  * Modal with toggles for *Enter to Send* and *Audio Feedback*.
  * Theme confirmation (AGNIX Deep Carbon).
  * History reset utility.
  * System metadata and versioning (`v0.1.0`).
* **Non-intrusive Toast System**:
  * Action confirmations (*"Copied to clipboard"*, *"Conversation renamed"*, *"New chat created"*).
* **Fully Responsive**:
  * Desktop collapsible sidebar (`270px`).
  * Mobile overlay drawer with backdrop blur.

---

## 3. Tech Stack

* **Framework**: [Next.js](https://nextjs.org/) 14 (App Router)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) with centralized design tokens
* **Icons**: [Lucide React](https://lucide.dev/)
* **Markdown Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)

---

## 4. Architecture & Directory Structure

```text
agnix-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts     # Next.js Server Route Handler invoking Gemini SDK
│   │   ├── globals.css          # Design system variables, custom scrollbars, typography
│   │   ├── layout.tsx           # Root HTML, viewport, ToastProvider, SEO metadata
│   │   └── page.tsx             # Home route entry point rendering ChatLayout
│   ├── components/
│   │   ├── chat/
│   │   │   ├── AgnixLogo.tsx        # Vector geometric flame brand emblem & wordmark
│   │   │   ├── ChatComposer.tsx     # Multiline expanding textarea with send/stop controls
│   │   │   ├── ChatHeader.tsx       # Top bar with drawer toggle, model badge, search, settings
│   │   │   ├── ChatLayout.tsx       # Master workstation layout orchestrator
│   │   │   ├── ChatMessage.tsx      # Markdown message card with copy, edit, regenerate, reactions
│   │   │   ├── ChatMessages.tsx     # Message scroll stream with smart auto-scroll
│   │   │   ├── ChatSidebar.tsx      # Collapsible drawer with grouping, search, 3-dot menus
│   │   │   ├── ChatWelcome.tsx      # Welcome hero with capability tags and suggested prompts
│   │   │   ├── CodeBlock.tsx        # Code snippet viewer with language label and copy button
│   │   │   ├── SettingsModal.tsx    # Preferences dialog (shortcuts, audio, reset, about)
│   │   │   ├── SuggestedPrompt.tsx  # Interactive prompt suggestion card
│   │   │   └── TypingIndicator.tsx  # Fire-pulse loading indicator
│   │   └── ui/
│   │       ├── Button.tsx           # Multi-variant button (primary fire, secondary, danger, etc.)
│   │       ├── IconButton.tsx       # Accessible action button with focus rings and sizes
│   │       ├── Modal.tsx            # Accessible modal dialog with backdrop and Escape handling
│   │       ├── Toast.tsx            # Context provider and animated toast container
│   │       └── Tooltip.tsx          # Lightweight tooltip helper
│   ├── hooks/
│   │   └── useChat.ts               # Conversation state, localStorage sync, streaming, search
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── index.ts             # AI service barrel export
│   │   │   ├── gemini-server.ts     # Server-side @google/genai client, system prompt & mapper
│   │   │   ├── gemini-client.ts     # Client-side streaming decoder and abort handler
│   │   │   ├── mock-ai.ts           # Offline fallback streaming simulator
│   │   │   └── types.ts             # AIService and AIServiceRequest contracts
│   │   ├── chat/
│   │   │   ├── demo-data.ts         # Initial pre-populated conversations and suggested prompts
│   │   │   └── types.ts             # Re-exported chat types
│   │   ├── theme.ts                 # Centralized design system constants
│   │   └── utils.ts                 # Tailwind class merger (clsx + twMerge)
│   └── types/
│       └── index.ts                 # Core domain models (Conversation, Message, Settings, etc.)
├── package.json
├── tailwind.config.ts               # Custom color hierarchy, shadows, and animations
├── tsconfig.json                    # Path aliases (@/*) and strict compiler flags
└── README.md
```

---

## 5. Running Locally

### Prerequisites
* **Node.js**: v18.17+ or v20+
* **npm**: v9+

### 2. Gemini API Setup

AGNIX AI connects to Google's official Gemini API using `@google/genai` via a secure Next.js server route (`/api/chat`).

1. **Obtain an API Key**:
   Visit [Google AI Studio](https://aistudio.google.com/) and create a free Gemini API key.

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your API key and configure the model:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

3. **Security Guarantee**:
   > [!IMPORTANT]
   > The `GEMINI_API_KEY` is **strictly server-side**. It is never prefixed with `NEXT_PUBLIC_`, never bundled into client JavaScript, never written to `localStorage`, and never sent to the browser. All Gemini interactions are proxied through the authenticated server route `POST /api/chat`.

4. **Restart the Server**:
   ```bash
   npm run dev
   # or
   npm run build && npm run start
   ```

Open [http://localhost:3000](http://localhost:3000) (or the active port reported by Next.js, e.g., `http://localhost:3001`) in your browser.

---

## 6. Architecture Roadmap

AGNIX AI is structured with clean abstraction boundaries so subsequent modules can be introduced without refactoring UI layers:

* **V1 — Core Chat** *(Completed)*: High-performance chat UI, dark-carbon + fire design tokens, decoupled AI service interface, local state & storage persistence.
* **V2 — Authentication + Persistent History**: Supabase / PostgreSQL integration, JWT session management, server-side conversation syncing.
* **V3 — Files + RAG**: Multi-modal file uploads (PDF, DOCX, CSV), vector embeddings, semantic search chunking.
* **V4 — Vision**: Multimodal image analysis, diagram parsing, visual problem solving.
* **V5 — Coding Assistant**: Sandboxed code execution, interactive terminal, diff viewer.
* **V6 — Autonomous Agents**: Multi-agent orchestration, planning loops, recursive goal refinement.
* **V7 — Tool Calling**: Function calling schemas (browser automation, GitHub API, SQL connectors).
* **V8 — Automation**: Scheduled triggers, event webhooks, background batch pipelines.
* **V9 — AGNIX Studio**: Visual workspace with canvas nodes, workflow diagrams, and team collaboration.
