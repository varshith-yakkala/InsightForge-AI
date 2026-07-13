# InsightForge AI

A modern, production-quality frontend for an AI-powered RAG (Retrieval-Augmented Generation) application. Built to feel at home next to ChatGPT, Perplexity, Notion AI, and Claude.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4 (custom design tokens matching the brief's palette)
- Framer Motion for animation
- React Router for navigation
- Zustand for state (chat, documents, settings, system status)
- React Markdown + remark-gfm + remark-math + rehype-highlight + rehype-katex for rich assistant responses (tables, code blocks, math)
- Recharts for the dashboard
- React Dropzone for uploads
- React Hot Toast for notifications
- Axios for backend calls

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL. To create a production build:

```bash
npm run build
npm run preview
```

## Backend integration

The app expects a backend exposing:

- `GET /health` — returns `{ embeddingModel, llmModel }`
- `POST /upload` — multipart file upload, returns `{ documents: Document[] }`
- `POST /query` — `{ question, topK, temperature, maxTokens }`, returns the answer, confidence, sources, retrieved chunks, token usage, and generation time

Configure the backend URL in **Settings → Backend**. If the backend is unreachable, the app automatically falls back to **demo mode**: uploads simulate progress and indexing, and queries return a realistic mocked RAG answer with citations — so the full experience works out of the box with no server running.

## Project structure

```
src/
  components/
    layout/        Sidebar, Navbar, RightPanel, AppLayout, MobileNav
    chat/          MessageBubble, ChatInput, WelcomeScreen, SourceCard
    documents/     DocumentPreviewModal
    common/        CommandPalette, FileTypeIcon
    ui/            Button, Badge, Card, Skeleton
  pages/           ChatPage, DocumentsPage, UploadPage, DashboardPage, SettingsPage, AboutPage
  store/           zustand stores (chat, documents, settings, system)
  services/        api.ts — backend calls with demo-mode fallback
  data/            mockData.ts — demo data generator
  types/           shared TypeScript types
  utils/           formatting + class-name helpers
  styles/          global Tailwind theme (index.css)
```

## Features

- Collapsible sidebar with search, pinned/recent conversations, document summary, storage stats
- Command palette (`Cmd/Ctrl + K`) for quick navigation
- Streaming assistant responses with cancel, regenerate, copy, thumbs up/down
- Source citations with similarity scores, opening a document preview with highlighted chunk, in-doc search, and zoom
- Right-hand context panel: retrieved chunks, similarity, token usage, model info, execution timeline
- Upload page with drag-and-drop, per-file progress, ETA, and success/failure states
- Documents page with type/favorite filters, search, and delete
- Dashboard with stat cards and charts (upload trend, queries over time, document type breakdown)
- Settings for model choice, chunking/retrieval parameters, theme/accent, and backend URL
- Responsive down to mobile with a bottom tab bar; keyboard-accessible focus states throughout
