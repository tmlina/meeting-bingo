# Meeting Bingo — Implementation Plan

**Version**: 1.1  
**Date**: June 23, 2026  
**Status**: Ready for Development  

---

## Review Summary

**Reviewed**: 2026-06-23 | **Reviewers**: VP Product, VP Engineering, VP Design

### Issues Found (44 total)

| # | VP | Severity | Category | Issue |
|---|-----|----------|----------|-------|
| C1 | Eng | Critical | Build | `@types/canvas-confetti` missing from devDependencies → TypeScript compile fails |
| C2 | Eng | Critical | Build | `src/lib/utils.ts` with `cn()` not listed in Phase 3 → BingoSquare import error at build time |
| C3 | Eng | Critical | Architecture | `GameContext.tsx` in arch doc absent from plan; no ADR for hook-only state decision |
| C4 | Prod/Design | Critical | Missing State | No UI for browser incompatibility (Firefox/Safari) → silent failure for ~30% of users |
| C5 | Prod/Design | Critical | Missing State | No mic permission explainer before browser prompt → violates PRD US-2.1 and UXR Principle 4 |
| C6 | Prod/Design | Critical | Missing Flow | No card preview/regenerate state before gameplay; plan jumps directly to `status:'playing'` |
| C7 | Design | Critical | Accessibility | Color-only state differentiation (filled=blue, winning=green, one-away=yellow) → color-blind users cannot distinguish states |
| C8 | Design | Critical | Accessibility | No keyboard navigation plan for 5×5 grid → keyboard-only users cannot play |
| C9 | Design | Critical | Accessibility | No focus management on WinScreen transition → keyboard/SR users stranded on hidden game board |
| H1 | Prod | High | Provenance | Plan dated June 2026 vs Dec 2025 first workshop — no rationale for rebuild; no learnings from original ship captured |
| H2 | Prod | High | Timeline | No phase timing against 90-min build target; P2 components built in Phase 5 alongside P0 work; no explicit cut-lines |
| H3 | Prod/Design | High | Missing Logic | `startedAt`/`completedAt` timestamps not explicitly wired in `useGame.ts`; win screen "time to BINGO" stat will be blank |
| H4 | Prod/Design | High | Share | Text-only clipboard share vs PRD US-4.3 ("image OR text"); viral card image is the primary share artifact per UXR |
| H5 | Eng | High | Race Condition | `setState` inside speech hook `onend` callback captures stale `isListening` → restart or stop bugs under timing |
| H6 | Eng | High | Performance | `interimResults=true` fires multiple times/sec with no debounce on React state updates → re-render storm across 25 BingoSquares |
| H7 | Eng | High | Performance | `useLocalStorage` persists full game state (including growing transcript) on every speech callback → synchronous main-thread blocking |
| H8 | Eng | High | Reliability | Auto-restart on `onend` has no circuit breaker → infinite loop if mic is revoked or audio hardware fails |
| H9 | Eng | High | TypeScript | No `@types/web-speech-api` or ambient `speech.d.ts` → speech hook requires `any` casts or produces compiler errors |
| H10 | Design | High | Accessibility | Toast auto-dismisses in 3s with no ARIA live region, no pause on focus/hover → screen readers cannot announce before dismissal |
| H11 | Design | High | Accessibility | Pulsing mic dot has no ARIA label; disabled free-space button skipped by assistive technology |
| H12 | Design | High | Accessibility | `animate-pulse` and canvas-confetti burst not gated on `prefers-reduced-motion` → vestibular disorder risk |
| M1 | Prod | Medium | Priority Conflict | One-away hints marked P2 but PRD US-3.2 includes them as core gameplay AC → conflict unresolved |
| M2 | Prod | Medium | Deploy | No `VITE_APP_URL` env var or placeholder; share link will have a broken or empty URL on first deploy |
| M3 | Prod | Medium | Data | Plan states 47/45/45 words per category; PRD actual word lists count lower → overstated spec, may confuse implementer |
| M4 | Eng | Medium | Architecture | `useBingoDetection.ts` is a separate hook in arch doc; plan merges it into `useGame.ts` → god hook, untestable in isolation |
| M5 | Eng | Medium | Logic Bug | Substring matching for phrases fires on partial matches (`sprint` in `sprinting`) → phantom auto-fills degrade game integrity |
| M6 | Eng | Medium | Performance | No rolling window on transcript accumulation → unbounded string growth in long meetings, inflating state and localStorage |
| M7 | Eng | Medium | Quality | Zero unit tests for `cardGenerator`, `bingoChecker`, `wordDetector` — pure functions that are high-value and regression-prone |
| M8 | Eng | Medium | Config | `fadeIn` keyframe in plan; arch doc only shows `bounceIn` → unused CSS or spec drift |
| M9 | Eng | Medium | Correctness | Speech API `setState` calls from non-React async events may cause tearing in React 18 concurrent mode |
| M10 | Design | Medium | Visual | One-away yellow border conflicts with free-space amber background → two different amber/yellow signals in same visual space |
| M11 | Design | Medium | UXR | Multiple rapid detections produce stacking/flashing toasts → violates Ambient Engagement principle; pulls focus from meeting |
| M12 | Design | Medium | Missing Feature | US-3.2 requires highlighting all lines with progress (3+ filled); plan only surfaces single "one away" square |
| M13 | Design | Medium | Missing State | TranscriptPanel has no empty/timeout state → blank panel after long silence with no user feedback |
| M14 | Design | Medium | Accessibility | `text-gray-400` interim transcript text (~2.9:1 contrast) fails WCAG 1.4.3 minimum 4.5:1 ratio |
| M15 | Design | Medium | Missing Flow | PRD screen flow includes "Continue or Reset" path from Game; no component or trigger is defined in plan |
| M16 | Design | Medium | Dead State | `isAutoFilled` is a named type field but has identical visual rendering to `isFilled` — render the distinction or remove the field |
| M17 | Eng | Medium | Error Handling | No try/catch around `navigator.share()`, `getUserMedia`, or Web Speech API calls → silent failures on API rejection |
| L1 | Prod | Low | Process | No cross-browser smoke test checklist before Phase 8 deploy → demo may fail on presenter's browser |
| L2 | Prod | Low | Scope | UXR storyboard shows out-of-scope "Join Game" button and "Custom" category → risk of accidental inclusion |
| L3 | Eng | Low | Security | No CSP headers in `vercel.json` for microphone-accessing app → injected scripts have access to transcript data |
| L4 | Eng | Low | DX | HTTPS/secure context requirement not documented; dev on plain HTTP IP will silently fail mic access |
| L5 | Design | Low | Documentation | Sound-off default not explicitly stated in plan → future implementer may add notification sounds by default |
| L6 | Design | Low | Dead State | `isAutoFilled` named state with no visual distinction → ships as dead code if distinction is never designed |

### Unresolved Items

- [ ] C3: Decide whether to use `GameContext.tsx` (per arch doc) or hooks-only — document the ADR
- [ ] H1: Capture learnings from original Dec 2025 ship before rebuilding
- [ ] M1: Resolve P2 vs PRD US-3.2 conflict for one-away hints — pick one authoritative source

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.1 | 2026-06-23 | VP Product · VP Engineering · VP Design | Added review summary with 44 issues (9 critical, 12 high, 17 medium, 6 low) |
| 1.0 | 2026-06-23 | tmlina | Initial plan |

---

---

## Stack

React 18 + TypeScript · Vite · Tailwind CSS 3 · Web Speech API · canvas-confetti · localStorage · Vercel (deploy)

---

## Phase 1 — Project Setup

1. Scaffold with `npm create vite@latest . -- --template react-ts`
2. Install deps: `canvas-confetti`, `tailwindcss`, `postcss`, `autoprefixer`
3. Configure Tailwind (add `content` glob, custom `bounceIn`/`fadeIn` keyframes)
4. Replace `src/index.css` with Tailwind directives (`@tailwind base/components/utilities`)
5. Update `index.html` title and favicon

---

## Phase 2 — Types & Data

**`src/types/index.ts`**
- `CategoryId`, `Category`, `BingoSquare`, `BingoCard`, `GameStatus`, `GameState`, `WinningLine`, `SpeechRecognitionState`, `Toast`

**`src/data/categories.ts`**
- Three categories: **Agile & Scrum** (47 words), **Corporate Speak** (45 words), **Tech & Engineering** (45 words)

---

## Phase 3 — Core Logic (`src/lib/`)

| File | Responsibility |
|------|----------------|
| `cardGenerator.ts` | Fisher-Yates shuffle → pick 24 words → build 5×5 grid with FREE center |
| `bingoChecker.ts` | Check 5 rows + 5 cols + 2 diagonals; return first `WinningLine` found |
| `wordDetector.ts` | Normalize text, word-boundary regex for single words, substring for phrases, aliases map for CI/CD / MVP / ROI etc. |
| `shareUtils.ts` | Build clipboard text summary; trigger native Web Share API or fallback |

---

## Phase 4 — Hooks (`src/hooks/`)

| Hook | Responsibility |
|------|----------------|
| `useSpeechRecognition.ts` | Wraps Web Speech API; `continuous=true`, `interimResults=true`; auto-restarts on `onend`; exposes `startListening`, `stopListening`, `transcript`, `interimTranscript`, `isSupported`, `error` |
| `useGame.ts` | Central game state machine (`idle → setup → playing → won`); handles square toggle, auto-fill, bingo check trigger |
| `useLocalStorage.ts` | Generic hook for persisting/restoring game state across refresh |

---

## Phase 5 — Components (`src/components/`)

### Screens (top-level)

| Component | Notes |
|-----------|-------|
| `LandingPage.tsx` | Logo, tagline, **New Game** CTA, privacy note, How It Works steps |
| `CategorySelect.tsx` | 3 cards (Agile / Corporate / Tech), each with icon + sample words + Select button |
| `GameBoard.tsx` | Hosts card + transcript panel + controls; wires speech hook into game state |
| `WinScreen.tsx` | Confetti, BINGO! heading, winning card (highlighted line), stats, Share + Play Again |

### Sub-components

| Component | Notes |
|-----------|-------|
| `BingoCard.tsx` | 5×5 grid layout |
| `BingoSquare.tsx` | States: default / filled (blue) / auto-filled / free space (amber) / winning (green) |
| `TranscriptPanel.tsx` | Pulsing mic dot, last ~100 chars of transcript, interim text in grey, detected word badges |
| `GameControls.tsx` | New Card button, Start/Stop Listening toggle |
| `ui/Toast.tsx` | Brief word-detected notifications, auto-dismiss after 3s |

### Root

| File | Notes |
|------|-------|
| `App.tsx` | Screen router (`'landing' \| 'category' \| 'game' \| 'win'`), no external router needed |

---

## Phase 6 — Game Logic Wiring

- On category select → `generateCard()` → set `status: 'playing'`
- On `startListening` → speech hook feeds final transcript chunks into `detectWordsWithAliases()`
- Detected words → `fillSquare()` → `checkForBingo()` → if win: stop listening, show `WinScreen`
- Square click → toggle filled (manual fallback; can un-fill non-auto squares)
- Counter shows `filledCount / 24` (free space pre-counted)

---

## Phase 7 — Polish

- `canvas-confetti` burst on win
- Winning line squares get green ring highlight
- "One away" hint: subtle yellow border on potential completing square
- Toast notification for each auto-detected word
- localStorage save/restore so refresh mid-game doesn't lose state

---

## Phase 8 — Deploy

- `vercel.json` with static output config (none needed for Vite defaults)
- `npm run build` → deploy to Vercel free tier

---

## Prioritization (if time-boxing)

| Priority | Features |
|----------|----------|
| P0 | Card generation, manual toggle, BINGO detection, win screen |
| P0 | Speech recognition + auto-fill |
| P1 | Share button, localStorage persistence, mobile responsive |
| P2 | One-away hints, Toast notifications, dark mode |

---

## File Structure

```
meeting-bingo/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── postcss.config.js
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   │
│   ├── components/
│   │   ├── LandingPage.tsx
│   │   ├── CategorySelect.tsx
│   │   ├── GameBoard.tsx
│   │   ├── BingoCard.tsx
│   │   ├── BingoSquare.tsx
│   │   ├── TranscriptPanel.tsx
│   │   ├── WinScreen.tsx
│   │   ├── GameControls.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Toast.tsx
│   │
│   ├── hooks/
│   │   ├── useSpeechRecognition.ts
│   │   ├── useGame.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── lib/
│   │   ├── cardGenerator.ts
│   │   ├── wordDetector.ts
│   │   ├── bingoChecker.ts
│   │   └── shareUtils.ts
│   │
│   ├── data/
│   │   └── categories.ts
│   │
│   └── types/
│       └── index.ts
│
└── README.md
```
