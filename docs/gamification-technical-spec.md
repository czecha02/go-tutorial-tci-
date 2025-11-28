## Gamification Technical Specification

This document outlines the engineering changes required to support the gamification roadmap. It complements `docs/gamification-plan.md` and `docs/gamification-roadmap.md` by detailing data structures, module responsibilities, integration points, and sequencing considerations.

---

### 1. System Architecture Overview

- **Client App (Next.js / React)**
  - New state layer for player progression (XP, levels, badges, streaks, tokens).
  - Context provider(s) to make gamification data accessible across lessons.
  - UI components for progress indicators, achievement modals, and dashboards.
- **Persistence Layer**
  - Phase 1: IndexedDB or `localStorage` wrapper for offline-friendly persistence.
  - Stretch: Optional backend service for multi-device sync (REST/GraphQL endpoint scaffold).
- **Analytics**
  - Event dispatcher module abstracting analytics provider (e.g., Segment, PostHog).
  - Standardized payload schema for gamification events.

---

### 2. Data Model Extensions

```typescript
type LevelTier = 'Novice' | 'Apprentice' | 'Adept' | 'Scholar' | 'Master'

interface GamificationState {
  xp: number
  level: LevelTier
  nextLevelXp: number
  badges: Record<string, BadgeProgress>
  streak: {
    current: number
    best: number
    lastCompletedISO: string | null
  }
  hintTokens: number
  skillTree: Record<string, SkillNodeState>
  dailyChallenges: DailyChallengeState
}

interface BadgeDefinition {
  id: string
  title: string
  description: string
  icon: string
  category: 'progression' | 'tactics' | 'territory' | 'social'
  unlockCriteria: BadgeCriteria
}
```

- **Storage Schema**
  - `gamification/state` (serialized `GamificationState`).
  - `gamification/history/<lessonId>` for per-lesson metrics (accuracy, time, hints used).
  - `gamification/challenges` for daily problem manifests and completion flags.

---

### 3. Module Additions & Changes

| Area | Module | Description |
|------|--------|-------------|
| State | `src/contexts/GamificationContext.tsx` | Provides state, actions (`addXp`, `unlockBadge`, `spendHint`, `recordStreak`) and persistence logic. |
| Hooks | `useGamification` | Wrapper hook exposing context plus derived selectors (`levelProgress`, `availableTokens`). |
| Storage | `src/lib/storage.ts` | Abstraction over `localStorage`/IndexedDB with schema versioning and migration helpers. |
| Analytics | `src/lib/analytics.ts` | Unified logging for `GA_EVENT.GAMIFICATION_*`; integrates with existing/incoming telemetry. |
| Components | `ProgressMeter`, `BadgeToast`, `ProfileDrawer`, `DailyChallengeCard`, `SkillTreeView`. |
| Pages | `/progress` (map), `/duels`, `/classroom`, `/season` (later phases). |
| Engine | Extend existing Go engine modules to emit hooks: `onCapture`, `onKo`, `onIllegalMove`, enabling gamification triggers. |
| Tests | New test suites under `src/components/__tests__` and `src/lib/__tests__` validating state transitions and persistence. |

---

### 4. API & Backend Considerations

While initial phases can run purely client-side, future social features require backend support.

- **Suggested API Endpoints (REST placeholder)**
  - `POST /api/profile` create/update player profile.
  - `GET /api/progress` fetch XP, badges, streaks (authenticated).
  - `POST /api/duels` create duel challenge.
  - `PATCH /api/duels/:id/move` submit move.
  - `GET /api/leaderboard?scope=global|cohort`.
- **Data Entities**
  - `User` (id, displayName, avatar, locale).
  - `Progress` (xp, level, badges[], streaks, tokens).
  - `Challenge` (id, type, manifest, expiry).
  - `Duel` (playerA, playerB, moves[], status, timestamps).
- **Authentication**
  - Evaluate email-less magic links or device codes to keep onboarding friction low.
  - Ensure PII minimal; consider using hashed IDs for classroom dashboards.

---

### 5. UI/UX Integration Points

- **Header**
  - Replace static lesson badges with dynamic XP meter and level chip.
- **Lesson Pages**
  - Hook into existing success/error flows to call `addXp`, `unlockBadge`.
  - Add inline streak status and hint token counts.
- **Modals / Toasts**
  - Global `AchievementModal` triggered by badge unlocks.
  - Non-intrusive toast for XP gains and streak updates.
- **Progress Page**
  - Heatmap/calendar for streak visualization.
  - Journey map showing locked/unlocked lessons & rewards.
- **Settings/Profile Drawer**
  - Toggle for opt-in gamification vs. minimalist mode.
  - Reset progression button (with confirmation).

---

### 6. Engine & Gameplay Instrumentation

- Extend `placeStone` to emit event payloads consumed by gamification observers.
- Add middleware-like layer to calculate:
  - Captures count per session.
  - Ko occurrence detection.
  - Self-atari attempts.
- Provide hooks for lessons to register callbacks (`onLessonComplete`, `onDrillRepeat`) enabling consistent XP triggers.

---

### 7. Telemetry & Monitoring

- Event naming convention: `gamification.XP_GAINED`, `gamification.BADGE_UNLOCKED`, `gamification.STREAK_EXTENDED`.
- Metrics dashboards:
  - Daily XP gained per active user.
  - Badge unlock distribution.
  - Hint token spend vs. earn ratio.
  - Challenge completion rate.
- Error logging for persistence failures, migration issues, API timeouts.

---

### 8. Security & Privacy

- Ensure local storage data is namespaced to prevent collisions.
- If backend is introduced, secure endpoints with JWT/session tokens.
- Provide “Clear Data” functionality compliant with privacy requests.
- Classroom features must anonymize learner identifiers when shared.

---

### 9. Sequencing & Dependencies

1. Implement `GamificationContext` & storage adapter (Phase 1 dependency).
2. Integrate context into `layout.tsx` to wrap all lesson routes.
3. Update lesson components to emit structured events.
4. Layer in UI widgets (progress meter, toasts).
5. Introduce analytics hooks, ensure feature flags guard unfinished modules.
6. Expand to backend APIs when social features are prioritized.

---

### 10. Testing Strategy

- **Unit Tests**
  - Reducers/actions for gamification state.
  - Badge condition evaluators (e.g., capture count thresholds).
- **Integration Tests**
  - Simulated lesson flow verifying XP/level updates.
  - Persistence round-trip (save → reload → state restored).
- **End-to-End (Playwright/Vitest + jsdom)**
  - Badge unlock scenario.
  - Streak tracking across simulated days.
  - Daily challenge rotation.
- **Load/Soak Tests** (when backend introduced)
  - Leaderboard query under concurrent access.
  - Duel move submission latency.

---

### 11. Open Items

- Choose animation library (Framer Motion vs. CSS) for celebration effects.
- Decide on default avatars/themes; confirm licensing for assets.
- Clarify offline behavior for daily challenges and streaks.
- Determine safe fallback when analytics provider unavailable.

---

### Summary

Implementing gamification requires foundational changes to state management, persistence, and UI composition. By introducing a dedicated gamification context, storage abstraction, and event hooks within lesson engines, the project can incrementally enable XP, levels, achievements, social play, and adaptive coaching while preserving the core learning experience.



