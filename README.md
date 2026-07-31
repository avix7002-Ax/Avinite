# Science PYQ AI — CBSE Class 10 Science Learning Platform

An AI-powered learning platform for CBSE Class 10 Science students. Score higher with smart revision, trend analysis, and unlimited practice.

## Features

- **PYQ Trend Analysis** — Chapter weightage, frequently tested topics, and difficulty trends with visual charts
- **AI Practice Questions** — Generate 5 to 50 original board-style questions (MCQs, assertion-reason, case studies, numericals)
- **AI Doubt Solver** — Ask any Science question and get a simple, student-friendly explanation
- **Smart Revision Mode** — One-page notes, flashcards, formula sheets, mnemonics, and mind maps
- **Mock Tests** — Chapter, full-syllabus, or custom tests with timer, instant results, and predicted board score
- **Study Planner** — Personalised daily timetable, weekly plan, and monthly revision schedule
- **Bookmarks** — Save questions, notes, flashcards, and topics
- **Dark/Light Theme** — Toggle between light and dark mode

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Supabase** for authentication and database
- **Lucide React** for icons

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/         # Base UI primitives (Button, Card, Input, etc.)
│   ├── AppLayout.tsx    # Authenticated app layout with sidebar
│   └── LandingNav.tsx   # Landing page navigation + footer
├── hooks/          # Custom React hooks
│   ├── useAuth.tsx          # Authentication context
│   ├── useBookmarks.ts      # Bookmark CRUD
│   ├── useRevisionProgress.ts # Revision tracking
│   └── useUserStats.ts      # User statistics
├── lib/            # Utilities and data
│   ├── ai.ts       # AI question generation & doubt solving
│   ├── data.ts     # Chapter and subject data
│   ├── supabase.ts # Supabase client
│   └── utils.ts    # Helper functions
├── pages/          # Route components
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── SearchPage.tsx
│   ├── PracticePage.tsx
│   ├── DoubtSolverPage.tsx
│   ├── RevisionPage.tsx
│   ├── MockTestPage.tsx
│   ├── StudyPlannerPage.tsx
│   ├── BookmarksPage.tsx
│   ├── ProfilePage.tsx
│   └── TrendsPage.tsx
├── types/          # TypeScript type definitions
├── App.tsx         # Main app with routing
├── main.tsx        # Entry point
└── index.css       # Global styles + Tailwind
```

## Syllabus Coverage

All 16 chapters across 4 subjects:

- **Physics** (5 chapters): Light, Human Eye, Electricity, Magnetism, Energy Sources
- **Chemistry** (5 chapters): Chemical Reactions, Acids & Bases, Metals & Non-metals, Carbon, Periodic Classification
- **Biology** (4 chapters): Life Processes, Control & Coordination, Reproduction, Heredity & Evolution
- **Environment** (2 chapters): Our Environment, Sustainable Management

## License

Original AI-generated content. No copyrighted CBSE material reproduced.
