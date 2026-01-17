---
description: Query project history based on artifacts.
---

1. User provides a question (e.g., "How did we handle ResolutionPanel refactoring?").
2. Search `.conductor/decisions/`, `AGENTS.md` (Session Log), and `docs/` for relevant context.
3. If a matching ADR or Session Log entry is found, cite it.
4. If not found, state "No prior decision recorded. Would you like me to search the codebase?"
