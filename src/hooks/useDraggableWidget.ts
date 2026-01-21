/**
 * useDraggableWidget Hook
 * 
 * Implements the state machine from specs/draggable_widgets_v2.md
 * for long-press-to-drag functionality across all platforms.
 * 
 * State Machine: IDLE → PENDING → DRAG_READY → DRAGGING
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import type { WidgetPosition } from '../types';

// Constants from spec
const LONG_PRESS_THRESHOLD = 500; // ms for touch
const MOVE_THRESHOLD = 10; // px before canceling long-press
const MARGIN = 16; // px from viewport edges

type DragPhase = 'idle' | 'pending' | 'drag_ready' | 'dragging';

interface DragState {
  phase: DragPhase;
  pointerId: number | null;
  pointerDownAt: { x: number; y: number } | null;
  pointerDownTime: number | null;
  currentPosition: { x: number; y: number };
  suppressNextClick: boolean;
}

interface UseDraggableWidgetOptions {
  widgetId: string;
  initialPosition: { x: number; y: number };
  bubbleSize: { width: number; height: number };
  onPositionChange?: (position: WidgetPosition) => void;
  onClick?: () => void;
}

interface UseDraggableWidgetReturn {
  position: { x: number; y: number };
  isDragging: boolean;
  isDragReady: boolean;
  zIndex: number;
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
  };
}

/**
 * Converts absolute position to percentage-based WidgetPosition
 */
function toWidgetPosition(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number
): WidgetPosition {
  const xPercent = (x / viewportWidth) * 100;
  const yPercent = (y / viewportHeight) * 100;

  return {
    xPercent,
    yPercent,
    anchorX: xPercent > 50 ? 'right' : 'left',
    anchorY: yPercent > 50 ? 'bottom' : 'top',
  };
}

/**
 * Reconciles saved percentage position to absolute pixels
 * Clamps to viewport bounds (from spec Section 2)
 */
export function reconcilePositions(
  savedPosition: WidgetPosition,
  viewportWidth: number,
  viewportHeight: number,
  bubbleSize: { width: number; height: number }
): { x: number; y: number } {
  // Convert percentage to absolute
  let x = (savedPosition.xPercent / 100) * viewportWidth;
  let y = (savedPosition.yPercent / 100) * viewportHeight;

  // Clamp to viewport bounds
  x = Math.max(MARGIN, Math.min(x, viewportWidth - bubbleSize.width - MARGIN));
  y = Math.max(MARGIN, Math.min(y, viewportHeight - bubbleSize.height - MARGIN));

  return { x, y };
}

/**
 * Constrains position to viewport bounds
 */
function constrainToBounds(
  position: { x: number; y: number },
  bubbleSize: { width: number; height: number }
): { x: number; y: number } {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  return {
    x: Math.max(MARGIN, Math.min(position.x, viewportWidth - bubbleSize.width - MARGIN)),
    y: Math.max(MARGIN, Math.min(position.y, viewportHeight - bubbleSize.height - MARGIN)),
  };
}

/**
 * Triggers haptic feedback on mobile devices
 */
function triggerHapticFeedback(): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}

export function useDraggableWidget({
  widgetId,
  initialPosition,
  bubbleSize,
  onPositionChange,
  onClick,
}: UseDraggableWidgetOptions): UseDraggableWidgetReturn {
  const [state, setState] = useState<DragState>({
    phase: 'idle',
    pointerId: null,
    pointerDownAt: null,
    pointerDownTime: null,
    currentPosition: initialPosition,
    suppressNextClick: false,
  });

  const [zIndex, setZIndex] = useState(50);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const basePositionRef = useRef(initialPosition);

  // Update base position when initial position changes
  useEffect(() => {
    if (state.phase === 'idle') {
      basePositionRef.current = initialPosition;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(prev => ({ ...prev, currentPosition: initialPosition }));
    }
  }, [initialPosition, state.phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (state.phase !== 'idle') return; // Ignore if already tracking

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    basePositionRef.current = state.currentPosition;

    setState(prev => ({
      ...prev,
      phase: 'pending',
      pointerId: e.pointerId,
      pointerDownAt: { x: e.clientX, y: e.clientY },
      pointerDownTime: Date.now(),
    }));

    // Start long-press timer
    timerRef.current = setTimeout(() => {
      setState(prev => {
        if (prev.phase === 'pending') {
          triggerHapticFeedback();
          setZIndex(9999); // Elevate during drag
          console.log(`[useDraggableWidget] ${widgetId} entered DRAG_READY`);
          return { ...prev, phase: 'drag_ready' };
        }
        return prev;
      });
    }, LONG_PRESS_THRESHOLD);
  }, [state.phase, state.currentPosition, widgetId]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerId !== state.pointerId) return; // Ignore other pointers
    if (!state.pointerDownAt) return;

    const dx = e.clientX - state.pointerDownAt.x;
    const dy = e.clientY - state.pointerDownAt.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (state.phase === 'pending' && distance > MOVE_THRESHOLD) {
      // Movement before timer → cancel long-press, allow scroll
      if (timerRef.current) clearTimeout(timerRef.current);
      const target = e.currentTarget as HTMLElement;
      target.releasePointerCapture(e.pointerId);
      setState(prev => ({ ...prev, phase: 'idle', pointerId: null }));
      console.log(`[useDraggableWidget] ${widgetId} cancelled (scroll detected)`);
      return;
    }

    if (state.phase === 'drag_ready' || state.phase === 'dragging') {
      e.preventDefault(); // Prevent scroll during drag

      // RAF-throttled position update for 60fps
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const newPosition = constrainToBounds(
          {
            x: basePositionRef.current.x + dx,
            y: basePositionRef.current.y + dy,
          },
          bubbleSize
        );

        setState(prev => ({
          ...prev,
          phase: 'dragging',
          currentPosition: newPosition,
        }));
      });
    }
  }, [state.pointerId, state.pointerDownAt, state.phase, bubbleSize, widgetId]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (e.pointerId !== state.pointerId) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    const target = e.currentTarget as HTMLElement;
    try {
      target.releasePointerCapture(e.pointerId);
    } catch {
      // Pointer capture may already be released
    }

    if (state.phase === 'dragging') {
      // Persist position to Redux
      if (onPositionChange) {
        const widgetPos = toWidgetPosition(
          state.currentPosition.x,
          state.currentPosition.y,
          window.innerWidth,
          window.innerHeight
        );
        onPositionChange(widgetPos);
      }

      console.log(`[useDraggableWidget] ${widgetId} drag ended at`, state.currentPosition);

      // Reset z-index after animation
      setTimeout(() => setZIndex(50), 400);

      setState(prev => ({
        ...prev,
        phase: 'idle',
        pointerId: null,
        suppressNextClick: true,
      }));

      // Clear suppressNextClick after short delay
      setTimeout(() => {
        setState(prev => ({ ...prev, suppressNextClick: false }));
      }, 50);

    } else if (state.phase === 'pending' || state.phase === 'drag_ready') {
      // Short tap → fire click
      if (!state.suppressNextClick && onClick) {
        console.log(`[useDraggableWidget] ${widgetId} tap detected, firing onClick`);
        onClick();
      }
      setState(prev => ({
        ...prev,
        phase: 'idle',
        pointerId: null,
      }));
    }
  }, [state.phase, state.pointerId, state.currentPosition, state.suppressNextClick, onClick, onPositionChange, widgetId]);

  const onPointerCancel = useCallback((e: React.PointerEvent) => {
    if (e.pointerId !== state.pointerId) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    setState(prev => ({
      ...prev,
      phase: 'idle',
      pointerId: null,
    }));

    setZIndex(50);
    console.log(`[useDraggableWidget] ${widgetId} pointer cancelled`);
  }, [state.pointerId, widgetId]);

  return {
    position: state.currentPosition,
    isDragging: state.phase === 'dragging',
    isDragReady: state.phase === 'drag_ready',
    zIndex,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
  };
}
