<div align="center">

# ✨ NotesAI

### *Where Simplicity Meets Intelligence*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br />

**A revolutionary note-taking experience that proves the most powerful tools are often the simplest.**

[Live Demo](https://notail.vercel.app) · [Report Bug](https://github.com/yourusername/notesai/issues) · [Request Feature](https://github.com/yourusername/notesai/issues)

<br />

<img src="https://raw.githubusercontent.com/yourusername/notesai/main/public/demo.png" alt="NotesAI Dashboard" width="100%" />

</div>

---

## 🎯 Philosophy

> *"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."*
> — Antoine de Saint-Exupéry

NotesAI is built on a radical belief: **the best software disappears**. It doesn't demand your attention—it amplifies your thoughts. While others chase feature bloat, we pursue the elegance of restraint.

**This is not just another note app.** It's a carefully crafted instrument for thought, where every pixel serves a purpose and every interaction feels inevitable.

---

## ✨ What Makes NotesAI Different

<table>
<tr>
<td width="50%">

### 🪶 Radical Simplicity
No learning curve. No configuration hell. No feature maze. Open it, write, think. The interface dissolves—only your ideas remain.

</td>
<td width="50%">

### ⚡ Instant & Responsive
Built with Next.js 15 Turbopack. Every keystroke responds instantly. Every transition feels native. Speed isn't a feature—it's a requirement.

</td>
</tr>
<tr>
<td width="50%">

### 🌍 Universal Markdown
The world speaks Markdown. Your notes are portable, readable, and future-proof. No proprietary formats. No vendor lock-in. Ever.

</td>
<td width="50%">

### 🤖 AI That Understands
Context-aware AI assistance that enhances without overwhelming. It improves your writing, explains your code, and organizes your thoughts—when you need it.

</td>
</tr>
<tr>
<td width="50%">

### 🎨 Crafted UI/UX
Every shadow, every spacing, every micro-interaction is intentional. Beautiful defaults that work in light and dark. Design that respects your eyes.

</td>
<td width="50%">

### 🔒 Your Data, Your Control
Secure authentication, private by design. No tracking, no selling your thoughts. Your notes belong to you—period.

</td>
</tr>
</table>

---

## 🚀 Features

### Core Experience
- **📝 Distraction-Free Editor** — Clean markdown editing with live preview
- **🏷️ Smart Organization** — Categories, tags, and favorites that make sense
- **🔍 Instant Search** — Find anything in milliseconds
- **📱 Responsive Design** — Beautiful on every screen size
- **🌙 Dark Mode** — Easy on the eyes, day and night

### AI Superpowers
- **✍️ Writing Enhancement** — Improve clarity, fix grammar, adjust tone
- **📋 Smart Summaries** — Condense long notes into key points
- **💡 Idea Expansion** — Turn bullet points into full paragraphs
- **🐛 Code Analysis** — Format, explain, and debug code snippets
- **✅ Task Extraction** — Convert notes into actionable to-do lists

### Professional Grade
- **🔐 Secure Auth** — Industry-standard authentication with better-auth
- **💳 Flexible Plans** — Free tier + Pro features for power users
- **📊 Usage Analytics** — Track your productivity patterns
- **🗄️ Archive & Restore** — Soft delete with full recovery
- **⚡ Real-time Sync** — Your notes, everywhere, always current

---

## 🛠️ Tech Stack

NotesAI is built with modern, battle-tested technologies:

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router + Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Database** | Turso (SQLite edge) + Drizzle ORM |
| **Auth** | better-auth |
| **Payments** | Stripe + Autumn |
| **AI** | OpenAI-compatible API |
| **Deployment** | Vercel |

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- A Turso database (or any SQLite-compatible DB)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/notesai.git
cd notesai

# Install dependencies
bun install
# or
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
bun run db:push
# or
npx drizzle-kit push

# Start the development server
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start writing.

### Environment Variables

```env
# Database
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# AI (Optional)
OPENAI_API_KEY=your-openai-key

# Payments (Optional)
STRIPE_SECRET_KEY=your-stripe-key
AUTUMN_SECRET_KEY=your-autumn-key
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── api/               # API routes
│   ├── dashboard/         # Main application
│   └── pricing/           # Pricing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Feature components
├── db/                    # Database schema & seeds
├── lib/                   # Utilities & configurations
└── types/                 # TypeScript definitions
```

---

## 🎨 Design Principles

1. **Content First** — UI exists to serve your content, not the other way around
2. **Obvious by Default** — Every action should be discoverable without a manual
3. **Fast is a Feature** — Performance isn't optimized later, it's designed from the start
4. **Accessible Always** — Beautiful for everyone, regardless of ability
5. **Progressive Enhancement** — Works without JavaScript, magical with it

---

## 🤝 Contributing

We welcome contributions that align with our philosophy of simplicity and quality.

```bash
# Fork the repo and create your branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m 'Add amazing feature'

# Push and create a Pull Request
git push origin feature/amazing-feature
```

### Guidelines
- Keep it simple—if a feature needs explanation, simplify it
- Write clean, typed code—TypeScript is not optional
- Test your changes—broken code doesn't ship
- Respect the design—consistency matters

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

### Built with 🖤 and an obsession for simplicity

**[notail.vercel.app](https://notail.vercel.app)**

<br />

*"The best interface is no interface. The best feature is less features. The best note app is NotesAI."*

</div>