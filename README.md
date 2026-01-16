# SuViet AI Tutor

A lightweight Vite + React + TypeScript web app that provides interactive study, quiz, storyboard, and analysis views powered by a Gemini-based AI service. Built as a learning aide (Vietnamese-focused), it demonstrates an app structure that integrates UI components with an AI service layer.

Key features
 - Study Mode: interactive lessons and prompts (`StudyMode.tsx`).
 - Quiz View: generate and run quizzes (`QuizView.tsx`).
 - Storyboard & Print Layout: create sequences and printable layouts (`StoryboardView.tsx`, `PrintLayout.tsx`).
 - Analysis & Overview: review and analyze learning material (`AnalysisView.tsx`, `OverviewView.tsx`).
 - Explore / Assets / Settings: helper views and configuration (`ExploreMode.tsx`, `AssetsView.tsx`, `SettingsModal.tsx`).

Project structure (high level)
- `App.tsx`, `index.tsx` — application entry points.
- `components/` — React UI pieces (study, quiz, storyboard, views, buttons).
- `services/geminiService.ts` — wrapper for communicating with the Gemini API (AI backend).
- `index.html`, `vite.config.ts`, `tsconfig.json` — Vite + TypeScript setup files.

Requirements
- Node.js (recommended v18+).
- A Gemini-compatible API key (set via environment variable `GEMINI_API_KEY`).

Quick start (development)
1. Install dependencies:

```
npm install
```

2. Create a local environment file (optional but recommended):

```
# .env.local
GEMINI_API_KEY=your_api_key_here
```

3. Start the dev server:

```
npm run dev
```

Build & preview

```
npm run build
npm run preview
```

Notes about the AI integration
- The AI calls are centralized under `services/geminiService.ts`. Update that file to change how the app authenticates or how requests are formed.
- Keep your `GEMINI_API_KEY` private. Do not commit `.env.local` to source control.

Development tips
- UI components are in `components/` and are intentionally small and composable. Use the existing components as patterns for new views.
- To add features that use the model, add a thin adapter in `services/geminiService.ts` and call it from the component-level hooks or event handlers.

Contributing
- Open issues or PRs. Keep changes focused and add or update a short usage note in this README when adding new features.

License
- MIT

Questions or next steps
- Want me to add a `.env.example` file, CI workflow, or documentation for `services/geminiService.ts`? I can add any of those next.
