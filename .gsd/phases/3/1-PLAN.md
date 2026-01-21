---
phase: 3
plan: 1
wave: 1
depends_on: []
files_modified:
  - src/components/widgets/DraggableContainer.tsx
  - src/store/slices/characterSlice.ts
  - src/types/index.ts
autonomous: true
user_setup: []

must_haves:
  truths:
    - "DraggableContainer supports all combat widget IDs"
    - "Redux state contains initial positions for all 6 widgets"
  artifacts:
    - "src/components/widgets/DraggableContainer.tsx updated"
---

# Plan 3.1: Foundation for Combat Orchestration

<objective>
Refactor the type definitions and state management to support 6 independent draggable combat elements.

Purpose: To allow independent movement and persistence for all combat-related UI bubbles.
Output: Updated type definitions, Redux state, and DraggableContainer component.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- src/store/slices/characterSlice.ts
- src/components/widgets/DraggableContainer.tsx
- src/types/index.ts
</context>

<tasks>

<task type="auto">
  <name>Update Widget Position Types</name>
  <files>src/types/index.ts</files>
  <action>
    Add 'concentrationToggle' and 'panicButtons' to the `WidgetPositions` interface.
    Ensure 'quickActions' remains as it might be used for future items.
  </action>
  <verify>Check interface definition in src/types/index.ts</verify>
  <done>Interface includes all 6 widget IDs.</done>
</task>

<task type="auto">
  <name>Update Initial State and Thunk</name>
  <files>src/store/slices/characterSlice.ts</files>
  <action>
    Update `getInitialState` to provide default positions for the 2 new widgets:
    - concentrationToggle: { xPercent: 92, yPercent: 45 }
    - panicButtons: { xPercent: 8, yPercent: 75 }
    Ensure the `widgetPositionUpdated` reducer correctly handles any string key.
  </action>
  <verify>npm run test src/test/combatSlice.test.ts (or similar)</verify>
  <done>Redux initial state includes new positions.</done>
</task>

<task type="auto">
  <name>Expand DraggableContainer Types</name>
  <files>src/components/widgets/DraggableContainer.tsx</files>
  <action>
    Update `DraggableContainerProps` to include 'concentrationToggle' and 'panicButtons' in the `widgetId` union type.
  </action>
  <verify>TSC check</verify>
  <done>Component compiles with new widget IDs.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] TypeScript compiles without errors in modified files.
- [ ] Redux state persists the 2 new widget IDs.
</verification>

<success_criteria>

- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
