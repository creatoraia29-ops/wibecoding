# VibeCode AI — Personal AI Tutor for Vibe Coding

**Live Demo (Vercel):** https://ai-tutor-wibecoding.vercel.app

## Features
- **AI Tutor (`gemini-3.5-flash-lite`)**: Interactive prompt evaluation, debugging guidance, and lesson Q&A.
- **Learning Roadmap**: 3 Stages (*Beginner*, *Advanced*, *Expert*) across 6 skill levels and 12 lessons with quizzes and hands-on prompt challenges.
- **Free & PRO Tiers (Stripe)**:
  - **Free**: 15 min/day practice (resets daily at 12:00 PM noon), 5 foundational lessons, quizzes, and prompt tasks.
  - **PRO**: 1–2+ hours/day practice, Cursor / Claude Code / Replit workflows, context rules (`.cursorrules`, `CLAUDE.md`), testing, debugging, and deployment.
- **Themes & Languages**: Light / Dark mode + RU / EN switcher.

## Tech Stack
- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4 + shadcn/ui
- Google Gemini (`@google/genai`, `gemini-3.5-flash-lite`)
- Stripe Checkout & Webhooks
