# Draggable Combat Bubbles & Summons (v2)

**Objective**: Enable users to reposition floating combat bubbles via long-press drag-and-drop across all platforms with position persistence.

---

## User Review Required

> [!IMPORTANT]
> **Library**: `@dnd-kit/core` (~10KB gzipped) for React 19 compatibility and native pointer events.

> [!WARNING]
> **Stacking Context**: Switching to `transform: translate()` creates a new stacking context. Plan includes React Portal strategy to prevent tooltip/modal clipping.

---

## 1. Gesture Handling (Touch vs. Click)

### The Problem

A tap should open the drawer. A long-press should initiate drag. These must never conflict.

### State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│                        IDLE                                      │
│  onPointerDown → start timer, record position → PENDING          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      PENDING                                     │
│  Timer fires (500ms) → DRAG_READY                                │
│  Pointer moves >10px → CANCELLED (allow scroll)                  │
│  Pointer lifts → fire onClick() → IDLE                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DRAG_READY                                    │
│  Any pointer move → DRAGGING                                     │
│  Pointer lifts without move → fire onClick() → IDLE              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     DRAGGING                                     │
│  Pointer moves → update position                                 │
│  Pointer lifts → fire onDragEnd(), set suppressClick=true → IDLE │
└─────────────────────────────────────────────────────────────────┘
```

### Hook State Flags

```typescript
interface DragState {
  phase: 'idle' | 'pending' | 'drag_ready' | 'dragging';
  pointerId: number | null;           // Lock to first pointer
  pointerDownAt: { x: number; y: number } | null;
  pointerDownTime: number | null;
  currentPosition: { x: number; y: number };
  suppressNextClick: boolean;
}
```

### Event Cancellation Logic

```typescript
// Pseudo-code for onPointerDown
function onPointerDown(e: PointerEvent) {
  if (state.phase !== 'idle') return; // Ignore if already tracking
  
  e.currentTarget.setPointerCapture(e.pointerId); // Capture pointer
  
  setState({
    phase: 'pending',
    pointerId: e.pointerId,
    pointerDownAt: { x: e.clientX, y: e.clientY },
    pointerDownTime: Date.now(),
  });
  
  // Start long-press timer
  timerRef.current = setTimeout(() => {
    if (state.phase === 'pending') {
      setState({ phase: 'drag_ready' });
      triggerHapticFeedback(); // Vibrate on mobile
    }
  }, LONG_PRESS_THRESHOLD);
}

// Pseudo-code for onPointerMove
function onPointerMove(e: PointerEvent) {
  if (e.pointerId !== state.pointerId) return; // Ignore other pointers
  
  const dx = e.clientX - state.pointerDownAt.x;
  const dy = e.clientY - state.pointerDownAt.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (state.phase === 'pending' && distance > MOVE_THRESHOLD) {
    // Movement before timer → cancel long-press, allow scroll
    clearTimeout(timerRef.current);
    setState({ phase: 'idle' });
    e.currentTarget.releasePointerCapture(e.pointerId);
    return;
  }
  
  if (state.phase === 'drag_ready' || state.phase === 'dragging') {
    e.preventDefault(); // Prevent scroll during drag
    setState({
      phase: 'dragging',
      currentPosition: constrainToBounds({
        x: basePosition.x + dx,
        y: basePosition.y + dy,
      }),
    });
  }
}

// Pseudo-code for onPointerUp
function onPointerUp(e: PointerEvent) {
  if (e.pointerId !== state.pointerId) return;
  
  clearTimeout(timerRef.current);
  e.currentTarget.releasePointerCapture(e.pointerId);
  
  if (state.phase === 'dragging') {
    onDragEnd(state.currentPosition);
    setState({ phase: 'idle', suppressNextClick: true });
    setTimeout(() => setState({ suppressNextClick: false }), 50);
  } else if (state.phase === 'pending' || state.phase === 'drag_ready') {
    // Short tap → fire click
    if (!state.suppressNextClick) {
      onClick();
    }
    setState({ phase: 'idle' });
  }
}
```

### Multi-touch Handling

Only the **first pointer** (`pointerId`) controls the drag. Additional touches are ignored via the `e.pointerId !== state.pointerId` check. This prevents chaos from pinch-zoom or accidental multi-touch.

---

## 2. Responsive Position Persistence

### The Problem

Absolute `x/y` coordinates break across devices. A bubble at `x: 1800px` on PC is off-screen on mobile.

### Solution: Relative + Sanitation

Store positions as **percentage offsets from viewport edges**:

```typescript
interface WidgetPosition {
  // Relative to viewport (0-100%)
  xPercent: number;  // Distance from LEFT edge
  yPercent: number;  // Distance from TOP edge
  // Anchor edge (for snap behavior)
  anchorX: 'left' | 'right';
  anchorY: 'top' | 'bottom';
}
```

### Coordinate Sanitation on Load

```typescript
function reconcilePositions(
  savedPosition: WidgetPosition,
  viewportWidth: number,
  viewportHeight: number,
  bubbleSize: { width: number; height: number }
): { x: number; y: number } {
  const MARGIN = 16; // Minimum edge margin
  
  // Convert percentage to absolute
  let x = (savedPosition.xPercent / 100) * viewportWidth;
  let y = (savedPosition.yPercent / 100) * viewportHeight;
  
  // Clamp to viewport bounds
  x = Math.max(MARGIN, Math.min(x, viewportWidth - bubbleSize.width - MARGIN));
  y = Math.max(MARGIN, Math.min(y, viewportHeight - bubbleSize.height - MARGIN));
  
  return { x, y };
}
```

### Redux State Shape

```typescript
// In characterSlice
widgetPositions: {
  [widgetId: string]: WidgetPosition;
}

// Example stored value
{
  "minion-bubble": {
    xPercent: 92,  // 92% from left = near right edge
    yPercent: 75,  // 75% from top = lower third
    anchorX: 'right',
    anchorY: 'bottom'
  }
}
```

### Viewport Change Handler

```typescript
// In App.tsx or a layout effect
useEffect(() => {
  const handleResize = debounce(() => {
    // Re-reconcile all widget positions on viewport change
    Object.entries(widgetPositions).forEach(([id, pos]) => {
      const sanitized = reconcilePositions(pos, window.innerWidth, window.innerHeight, BUBBLE_SIZE);
      // Update local state (not Redux) for smooth resize
    });
  }, 100);
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [widgetPositions]);
```

---

## 3. Visual Feedback & Animation Physics

### The "Feel": Heavy but Bouncy (Facebook Chat Heads)

| Property | Value | Rationale |
|----------|-------|-----------|
| Long-press activation | Scale 1.1x, shadow glow | Indicates "grabbed" state |
| Drag movement | No transition | 1:1 finger tracking, no lag |
| Release snap | Spring animation | Bouncy settle into final position |
| Z-index during drag | 9999 | Always on top |

### Spring Animation Config

```css
/* During drag - immediate response */
.dragging {
  transition: none;
  transform: translate(var(--x), var(--y)) scale(1.1);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.3);
  z-index: 9999;
}

/* Release snap - spring physics */
.drag-complete {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* This cubic-bezier creates an "overshoot" bounce effect */
}
```

### 60fps on Low-End Android

1. **Use `transform` only** - GPU-accelerated, no layout thrashing
2. **Use `will-change: transform`** - Hint to browser for layer promotion
3. **Avoid `box-shadow` animation** - Apply shadow instantly, don't animate it
4. **Use `requestAnimationFrame`** - Batch position updates

```typescript
// Throttle to animation frames
const rafRef = useRef<number>();
function onPointerMove(e: PointerEvent) {
  if (rafRef.current) cancelAnimationFrame(rafRef.current);
  rafRef.current = requestAnimationFrame(() => {
    updatePosition(e.clientX, e.clientY);
  });
}
```

### Z-Index Management

```typescript
// In DraggableContainer
const [zIndex, setZIndex] = useState(50); // Default z-index

// On drag start
setZIndex(9999);

// On drag end (after animation completes)
setTimeout(() => setZIndex(50), 400);
```

---

## 4. Stacking Context & Portal Strategy

### The Problem

`transform: translate()` creates a **new stacking context**. Child elements with `position: absolute` or `z-index` will be **clipped** to the container bounds.

### Analysis of Affected Components

| Widget | Has Tooltips/Dropdowns? | Risk |
|--------|-------------------------|------|
| MinionBubble | Count badge only | ✅ Safe |
| FamiliarBubble | Pocket indicator only | ✅ Safe |
| CombatBubble | No child popups | ✅ Safe |
| QuickActions (CombatView) | No child popups | ✅ Safe |

**Verdict**: Current bubbles have no tooltips or dropdown menus. The stacking context change is **low risk**.

### Mitigation (If Future Features Add Tooltips)

If tooltips are added later, use React Portals:

```tsx
// Tooltip renders to document.body, escaping stacking context
function BubbleTooltip({ children, anchor }) {
  return createPortal(
    <div 
      className="fixed z-[10000] pointer-events-none"
      style={{ top: anchor.y, left: anchor.x }}
    >
      {children}
    </div>,
    document.body
  );
}
```

### DraggableContainer Z-Index Strategy

```tsx
<DraggableContainer 
  className="z-50" // Base layer
  draggingClassName="z-[9999]" // During drag
>
  <MinionBubble />
</DraggableContainer>
```

---

## Implementation Order (Updated)

1. Install `@dnd-kit/core` and `@dnd-kit/utilities`
2. Create `useDraggableWidget` hook with full state machine
3. Create `DraggableContainer` with spring animations
4. Add `widgetPositions` to Redux with percentage storage
5. Implement `reconcilePositions` utility
6. Update `MinionBubble` (proof of concept)
7. **Test on Android emulator** - validate touch/click separation
8. Update remaining bubbles
9. Add E2E tests for drag + persistence
10. Final cross-platform verification

---

## Verification Checklist

- [ ] Tap opens drawer (no accidental drag)
- [ ] Long-press initiates drag with haptic feedback
- [ ] Drag is smooth 60fps on low-end device
- [ ] Release has bouncy spring animation
- [ ] Position persists across page reload
- [ ] Position adapts to viewport resize
- [ ] Dragged bubble is always on top
- [ ] Multi-touch is gracefully ignored
