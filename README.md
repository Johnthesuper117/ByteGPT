# ByteGPT

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=flat-square&logo=openai)](https://openai.com/)
[![Anthropic](https://img.shields.io/badge/Anthropic-Claude-orange?style=flat-square)](https://anthropic.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=flat-square&logo=google)](https://deepmind.google/technologies/gemini/)

> A multi-model AI chatbot with an OG terminal aesthetic. Chat with GPT-4, Claude, and Gemini through a retro phosphor-green terminal interface.

---

## ✨ Features

- **Multi-Model Support** — Switch between OpenAI GPT-4, Anthropic Claude, and Google Gemini in one click
- **Streaming Responses** — Real-time token streaming for all providers
- **OG Terminal Theme** — Phosphor green (#39FF14) on black, IBM Plex Mono font, scanline overlay, blinking cursor
- **Markdown Rendering** — AI responses render full Markdown including code blocks, tables, and lists
- **Keyboard Shortcuts** — `Enter` to send, `Shift+Enter` for newlines
- **Responsive Design** — Works on desktop and mobile
- **TypeScript** — Fully typed throughout
- **No Auth Required** — Simple API key configuration via environment variables

---

## 🚀 Quick Start

### Prerequisites

- Node.js `^18.18.0`, `^19.8.0`, or `>=20.0.0` (per Next.js 15 requirements)
- npm 9+
- API key(s) from one or more providers

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ByteGPT.git
cd ByteGPT

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your API keys

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the root of the project:

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | For GPT models | Get from [platform.openai.com](https://platform.openai.com/api-keys) |
| `ANTHROPIC_API_KEY` | For Claude models | Get from [console.anthropic.com](https://console.anthropic.com/) |
| `GOOGLE_API_KEY` | For Gemini models | Get from [aistudio.google.com](https://aistudio.google.com/apikey) |

You only need to add keys for the providers you want to use.

---

## 🤖 Available Models

| Model | Provider | Description |
|---|---|---|
| GPT-4 | OpenAI | Most capable OpenAI model |
| GPT-3.5 Turbo | OpenAI | Fast and efficient OpenAI model |
| Claude 3.5 Sonnet | Anthropic | Anthropic's most intelligent model |
| Claude 3 Haiku | Anthropic | Anthropic's fastest model |
| Gemini 1.5 Pro | Google | Google's most capable model |
| Gemini 1.5 Flash | Google | Google's fastest model |

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts     # API route — streams responses from all providers
│   ├── globals.css           # Terminal theme styles & animations
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Home page
├── components/
│   ├── ChatInterface.tsx     # Main chat UI with state management
│   ├── MessageBubble.tsx     # Individual message with Markdown rendering
│   ├── ModelSelector.tsx     # Provider/model dropdown
│   └── TerminalHeader.tsx    # Header with live clock and status
├── lib/
│   └── models.ts             # Model definitions and helpers
└── types/
    └── index.ts              # TypeScript interfaces
```

---

## ☁️ Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in the Vercel dashboard under **Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Other Platforms

ByteGPT is a standard Next.js 15 app and can be deployed anywhere that supports Node.js:

```bash
npm run build
npm start
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
