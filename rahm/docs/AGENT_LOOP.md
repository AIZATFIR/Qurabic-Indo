# Rahm Sub-Agent Execution Loop & Autonomous Protocols

This document defines the deterministic execution loop for AI sub-agents working on the **Rahm** subproject.

---

## 1. Sub-Agent Lifecycle Loop

```
  +--------------------------------------------------------+
  |                   1. Context Ingestion                 |
  |  - Read rahm/docs/PRD.md & rahm/lib/spiritual-framework |
  |  - Review relevant test suites (rahm/rahm.test.ts)     |
  +---------------------------+----------------------------+
                              |
                              v
  +--------------------------------------------------------+
  |                   2. Task Decomposition               |
  |  - Apply Ponytail: Smallest complete change, no bloat  |
  |  - Apply Apple Design: Zero latency, fluid springs     |
  +---------------------------+----------------------------+
                              |
                              v
  +--------------------------------------------------------+
  |              3. Test-Driven Implementation             |
  |  - Write / update unit test first in rahm.test.ts      |
  |  - Implement code with clean TypeScript typing         |
  +---------------------------+----------------------------+
                              |
                              v
  +--------------------------------------------------------+
  |                  4. Verification Gate                  |
  |  - Run: npx tsx --test rahm/rahm.test.ts               |
  |  - Run: npx tsc --noEmit                               |
  |  - Run: npm test                                       |
  |  - Run: npm run build                                  |
  +---------------------------+----------------------------+
                              |
                              v
  +--------------------------------------------------------+
  |                   5. Atomic Delivery                   |
  |  - Caveman mode summary: direct, terse, zero emojis   |
  |  - Clean Git commit on main branch                     |
  +--------------------------------------------------------+
```

---

## 2. Invariant Rules for All Agents

1. **Theological & Corpus Accuracy**:
   - Quranic references must use authoritative numbering (Surah 1..114, Ayah 1..N).
   - Asmaul Husna must retain canonical Arabic spelling and authentic root etymology.
   - Sufi & metaphysical concepts (Ibn 'Arabi, Al-Ghazali) must be framed strictly within Tawhid, without syncretism or shirk.
2. **Apple Design Constraints**:
   - Touch & click responsiveness: `:active scale-[0.98]` or spring-based feedback on `pointerdown`.
   - Modals and drawers must support keyboard dismissal (`Esc`), backdrop click, and back gesture.
   - Blur and translucent materials (`backdrop-blur-xl bg-canvas-surface/80`) with high contrast text.
3. **Ponytail & Caveman Compliance**:
   - Smallest complete diff. No unrequested libraries or bloated wrappers.
   - Zero emojis in code, commits, or agent messages.
