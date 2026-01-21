---
phase: 3
plan: 2
wave: 2
depends_on: ["3.1"]
files_modified:
  - src/components/layout/AppShell.tsx
autonomous: true
user_setup: []

must_haves:
  truths:
    - "All combat elements are wrapped in DraggableContainer"
    - "Elements are removed from the fixed stacking container"
  artifacts:
    - "src/components/layout/AppShell.tsx updated"
---

# Plan 3.2: Implementing Bubble Orchestration

<objective>
Refactor AppShell to enable independent movement for all combat widgets.

Purpose: To decouple combat UI elements from their static group and allow individual positioning.
Output: A highly flexible, user-customizable combat dashboard.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- src/components/layout/AppShell.tsx
- src/components/widgets/DraggableContainer.tsx
</context>

<tasks>

<task type="auto">
  <name>Refactor AppShell Layout</name>
  <files>src/components/layout/AppShell.tsx</files>
  <action>
    1. Remove the fixed flex container at line 164.
    2. Wrap each bubble/trigger in its own `DraggableContainer`:
       - `CombatBubble` (widgetId: 'combatBubble')
       - `ConcentrationToggle` (widgetId: 'concentrationToggle')
       - `FamiliarBubble` (widgetId: 'familiarBubble')
       - "Wand Trigger" button (widgetId: 'wandBubble')
       - `PanicButtons` (widgetId: 'panicButtons')
    3. Ensure `pointer-events-none` is handled correctly so drag gestures penetrate to the bubbles but not the empty space between them.
    4. Provide specific `defaultPosition` for each to avoid initial overlapping.
  </action>
  <verify>Manual visual check in browser</verify>
  <done>All 6 elements appear on screen and are independently movable.</done>
</task>

<task type="auto">
  <name>Final Visual Polish</name>
  <files>src/components/layout/AppShell.tsx</files>
  <action>
    Ensure that the `scale` and `shadow` effects from `DraggableContainer` are consistent across all bubbles.
    Verify that the `zIndex` logic prevents bubbles from hiding behind the header or navbar.
  </action>
  <verify>Screenshot verification</verify>
  <done>Visual consistency achieved.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Each element can be dragged independently.
- [ ] Position persists after page reload (sessionStorage).
</verification>

<success_criteria>

- [ ] All 6 bubbles are draggable.
- [ ] Positions are persistent.
</success_criteria>
