# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000, requires HTTPS for mic)
npm run build        # tsc + vite build → dist/
npm run typecheck    # Type-check without emitting
npm run lint         # ESLint over ts/tsx
npm run preview      # Preview production build locally
```

**Note**: Web Speech API requires a secure context. Use `localhost` (which counts as secure) or HTTPS — plain HTTP on a network IP will silently fail mic access.

## Stack

React 19 + TypeScript · Vite · Tailwind CSS 4 · Web Speech API · canvas-confetti · localStorage · Vercel

No router — `App.tsx` manages a `Screen` union (`'landing' | 'category' | 'game' | 'win'`) with conditional rendering.

No external state library — game state lives in `App.tsx` and is passed down as props. The architecture doc mentions a `GameContext.tsx`, but the implementation plan uses hooks-only; this decision needs an ADR before building.

## Architecture

### Data flow

1. `CategorySelect` → `generateCard(categoryId)` (Fisher-Yates shuffle, 24 words + FREE center) → `App` state
2. `GameBoard` wires `useSpeechRecognition` → final transcript chunks → `detectWordsWithAliases()` → `fillSquare()` → `checkForBingo()`
3. On win: stop listening, transition to `'win'` screen with confetti

### Key files (once built)

| Path | Role |
|------|------|
| `src/App.tsx` | Screen router + top-level game state |
| `src/hooks/useGame.ts` | Game state machine (`idle → setup → playing → won`) |
| `src/hooks/useSpeechRecognition.ts` | Web Speech API wrapper; `continuous=true`, auto-restarts on `onend` |
| `src/lib/wordDetector.ts` | Normalizes text; word-boundary regex for single words, substring for phrases, aliases for CI/CD / MVP / ROI etc. |
| `src/lib/bingoChecker.ts` | Checks 5 rows + 5 cols + 2 diagonals; returns first `WinningLine` |
| `src/lib/cardGenerator.ts` | Fisher-Yates shuffle → 5×5 grid with FREE at `[2][2]` |
| `src/data/categories.ts` | Three categories: Agile & Scrum, Corporate Speak, Tech & Engineering |
| `src/types/index.ts` | All shared types: `BingoSquare`, `BingoCard`, `GameState`, `WinningLine`, etc. |
| `src/lib/utils.ts` | `cn()` utility (needed by `BingoSquare.tsx` — must be in Phase 3, not missing) |

### Square states

`BingoSquare` has four visual states: default / filled-manual (blue) / free space (amber) / winning (green). `isAutoFilled` is typed but currently has no distinct rendering — either add a visual distinction or remove the field.

## Known pre-build issues (from VP review, v1.1)

Critical items to resolve before writing code:

- **C1**: ~~Add `@types/canvas-confetti` to devDependencies~~ (resolved in Phase 1)
- **C2**: Add `src/lib/utils.ts` (exports `cn()`) to Phase 3
- **C3**: Decide on `GameContext.tsx` vs hooks-only state and document the ADR
- **C4**: Add a fallback UI for browsers where `isSupported === false` (Firefox, non-Chromium)
- **C5**: Add a mic permission explainer screen before the browser prompt fires
- **C6**: Add a card preview/regenerate step before `status: 'playing'`
- **C7–C9**: Accessibility — add icon/pattern second cues for color states, roving tabindex on the 5×5 grid, and programmatic focus on WinScreen transition

High-priority implementation notes:

- **H5**: Use a `ref` for `isListening` inside the `onend` callback to avoid stale closure bugs
- **H6**: Debounce React state updates from `interimResults` to avoid re-rendering all 25 squares on every interim event
- **H7**: Persist only stable game fields to localStorage, not the full growing transcript
- **H8**: Add a circuit breaker on the auto-restart loop (e.g., max 3 retries or check `error` state)
- **H9**: Add an ambient `speech.d.ts` or install `@types/web-speech-api` to avoid `any` casts in the hook

## Deployment

`npm run build` → deploy to Vercel free tier. No `vercel.json` needed for Vite defaults. Set `VITE_APP_URL` to the deployed URL before first deploy so share links resolve correctly.
