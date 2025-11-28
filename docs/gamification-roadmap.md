## Gamification Implementation Roadmap

This roadmap translates the high-level gamification plan into engineering and design work streams. Each phase assumes a two-week sprint cadence and lists key deliverables, user stories, acceptance criteria, and cross-team dependencies.

### Pre-Phase: Discovery & Architecture (0.5 sprint)
- **Deliverables**
  - Audit existing user session, persistence, and telemetry capabilities.
  - Define domain model extensions (XP, badges, streaks, hint tokens).
  - Decide on backend storage (local storage vs. user accounts vs. external service).
- **Stories**
  - `ARCH-001` Document current learning flow states and available user context.
  - `ARCH-002` Draft ERD / state diagrams for gamification entities.
  - `ARCH-003` Spike: proof-of-concept for persistence layer (local storage prototype).
- **Acceptance**
  - Architecture doc signed off by product, design, engineering.
  - Risks and assumptions captured.

---

### Phase 1 – Foundations (Sprints 1-2)

**Objective:** Establish user progression tracking and lightweight rewards.

| Epic | Story ID | Description | Acceptance Criteria |
|------|----------|-------------|---------------------|
| XP System | `XP-101` | Persist XP per lesson completion | XP stored client-side; refresh retains value; manual reset available |
|  | `XP-102` | Add XP progress meter to header/lesson nav | Visual meter reflects stored XP; updates in real time |
| Leveling | `LVL-101` | Map XP thresholds to Novice→Master levels | Level recalculates as XP changes; tooltip explains tiers |
| Badges | `BDG-101` | Define badge schema (`id`, `title`, `icon`, `conditions`) | JSON config representing badge catalog |
|  | `BDG-102` | Trigger “First Capture” badge in Lesson 3 | Modal/toast appears once; persistent indicator in profile drawer |
| Progress Map | `MAP-101` | Create journey map UI page (`/progress`) | Shows lessons, completion status, next unlock |

**Dependencies**
- Design assets for progress bar, badges, map icons.
- Internationalization strings for new UI elements.

---

### Phase 2 – Challenges & Coaching (Sprints 3-4)

**Objective:** Add replayable content and adaptive support.

| Epic | Story ID | Description | Acceptance Criteria |
|------|----------|-------------|---------------------|
| Daily Problems | `DP-201` | Build puzzle manifest and scheduler | Rotates puzzle set daily; fallback to previous if offline |
|  | `DP-202` | Implement streak tracker & reward tokens | Streak increments daily, resets on miss; awards hint tokens |
| Hint Economy | `HNT-201` | Spend token to reveal liberty overlay | Token count decrements; overlay limited to 3s display |
| Adaptive Coaching | `COACH-201` | Detect repeated self-atari mistakes | After 3 occurrences, show contextual tip |
|  | `COACH-202` | Recommend drills based on weak metrics | Post-lesson report links to targeted challenge |

**Dependencies**
- Puzzle content generation (curriculum team).
- UX copy for coaching prompts and streak messaging.

---

### Phase 3 – Social Layer (Sprints 5-6)

**Objective:** Enable shared progress and light competition.

| Epic | Story ID | Description | Acceptance Criteria |
|------|----------|-------------|---------------------|
| Classroom Mode | `CLS-301` | Instructor dashboard listing learners | Displays XP, lesson status, badges; CSV export |
|  | `CLS-302` | Assignment creation with due dates | Learners notified in-app; overdue indicator |
| Friendly Duels | `DUEL-301` | Implement asynchronous match data model | Turn-based data persisted; handles resign/pass |
|  | `DUEL-302` | Duel UI with push notifications/polling | Player sees opponent move within 5s of submission |
| Leaderboards | `LDB-301` | Global/ cohort XP leaderboard views | Sortable by week/season; ties handled gracefully |
| Avatar Themes | `AVT-301` | Unlockable board/stone skins | Equip flow in profile; preview before applying |

**Dependencies**
- Authentication solution for identifying users.
- Notification infrastructure (WebSocket/Pusher or polling fallback).

---

### Phase 4 – Advanced Engagement (Sprints 7-8)

**Objective:** Deepen mastery with skill trees, AI bots, and creative tools.

| Epic | Story ID | Description | Acceptance Criteria |
|------|----------|-------------|---------------------|
| Skill Trees | `SKILL-401` | Visualize three-branch tree with unlock rules | Nodes toggle between locked/unlocked/completed states |
|  | `SKILL-402` | Unlock micro-challenges per node | Each node launches bite-sized drill; completion persists |
| AI Sparring | `AI-401` | Integrate adjustable bot difficulty profiles | Personas selectable; uses engine with parameterized style |
|  | `AI-402` | Post-game analytics summary | Highlights critical moves, missed ko fights, endgame notes |
| Scenario Builder | `SCN-401` | Allow learners to clone & edit scenarios | Save/share scenario variants; assign difficulty tag |
| Seasonal Rankings | `SSN-401` | Quarterly season resets with rewards | Season timer visible; awards distributed on rollover |
| Ghost Playbacks | `GST-401` | Replay top puzzle solutions | Playback controls (play/pause/step); follow ghost option |

**Dependencies**
- Additional storage/performance budget for shared content.
- AI persona tuning and testing.

---

### Cross-Cutting Tasks
- `ANLT-001` Event instrumentation for XP gains, badge unlocks, challenge starts/completions.
- `QA-001` Automated tests covering persistence, unlock logic, and regression for core gameplay.
- `I18N-001` Translate new strings into supported languages.
- `LEGAL-001` Review data retention and privacy requirements for sharing progress/leaderboards.

### Risk Mitigation
- Start with client-side storage for XP/badges; design interfaces to upgrade to backend later.
- Feature-flag major modules (daily problems, duels) for gradual rollout and A/B testing.
- Provide accessibility review for new UI widgets and animation opt-out.

### Definition of Done
- Stories include QA test cases, analytics hooks, i18n coverage, documentation updates.
- Rollout plan documented with monitoring dashboards (error rates, engagement metrics).
- Retro after each phase to adjust scope and prioritize next features.



