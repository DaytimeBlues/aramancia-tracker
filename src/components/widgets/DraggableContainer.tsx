/**
 * DraggableContainer Component
 * 
 * Wrapper component providing drag functionality per specs/draggable_widgets_v2.md
 * Uses transform: translate() for GPU-accelerated positioning.
 * 
 * Features:
 * - Long-press to drag (500ms threshold)
 * - Spring animation on release (cubic-bezier overshoot)
 * - Z-index elevation during drag
 * - will-change hint for layer promotion
 */

import type { ReactNode } from 'react';
import { useDraggableWidget, reconcilePositions } from '../../hooks/useDraggableWidget';
import type { WidgetPosition } from '../../types';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { widgetPositionUpdated } from '../../store/slices/characterSlice';
import { useEffect, useState } from 'react';

interface DraggableContainerProps {
  widgetId: 'minionBubble' | 'familiarBubble' | 'combatBubble' | 'wandBubble' | 'quickActions' | 'concentrationToggle' | 'panicButtons';
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  /** Default position if no saved position exists */
  defaultPosition?: { xPercent: number; yPercent: number };
  /** Size of the bubble for boundary calculations */
  bubbleSize?: { width: number; height: number };
}

const DEFAULT_BUBBLE_SIZE = { width: 56, height: 56 }; // 14rem = 56px

export function DraggableContainer({
  widgetId,
  children,
  onClick,
  className = '',
  defaultPosition = { xPercent: 92, yPercent: 75 }, // Bottom-right default
  bubbleSize = DEFAULT_BUBBLE_SIZE,
}: DraggableContainerProps) {
  const dispatch = useAppDispatch();

  // Get saved position from Redux
  const savedPosition = useAppSelector(
    state => state.character.widgetPositions[widgetId]
  );

  // Calculate initial position from saved or default
  const [initialPosition, setInitialPosition] = useState(() => {
    const posToUse: WidgetPosition = savedPosition || {
      xPercent: defaultPosition.xPercent,
      yPercent: defaultPosition.yPercent,
      anchorX: defaultPosition.xPercent > 50 ? 'right' : 'left',
      anchorY: defaultPosition.yPercent > 50 ? 'bottom' : 'top',
    };
    return reconcilePositions(
      posToUse,
      window.innerWidth,
      window.innerHeight,
      bubbleSize
    );
  });

  // Handle viewport resize - reconcile positions
  useEffect(() => {
    const handleResize = () => {
      const posToUse: WidgetPosition = savedPosition || {
        xPercent: defaultPosition.xPercent,
        yPercent: defaultPosition.yPercent,
        anchorX: defaultPosition.xPercent > 50 ? 'right' : 'left',
        anchorY: defaultPosition.yPercent > 50 ? 'bottom' : 'top',
      };
      const reconciled = reconcilePositions(
        posToUse,
        window.innerWidth,
        window.innerHeight,
        bubbleSize
      );
      setInitialPosition(reconciled);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [savedPosition, defaultPosition, bubbleSize]);

  // Handle position change - persist to Redux
  const handlePositionChange = (position: WidgetPosition) => {
    dispatch(widgetPositionUpdated({ widgetId, position }));
  };

  const {
    position,
    isDragging,
    isDragReady,
    zIndex,
    handlers,
  } = useDraggableWidget({
    widgetId,
    initialPosition,
    bubbleSize,
    onPositionChange: handlePositionChange,
    onClick,
  });

  // CSS classes per spec Section 3
  const dragStateClass = isDragging
    ? 'scale-110 shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(168,85,247,0.3)]'
    : isDragReady
      ? 'scale-105 shadow-lg'
      : '';

  // Transition class - no transition during drag for 1:1 tracking
  const transitionClass = isDragging
    ? ''
    : 'transition-transform duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]';

  return (
    <div
      className={`
        fixed touch-none select-none will-change-transform
        ${transitionClass}
        ${dragStateClass}
        ${className}
      `}
      style={{
        left: position.x,
        top: position.y,
        zIndex,
        transform: isDragging ? 'scale(1.1)' : isDragReady ? 'scale(1.05)' : 'scale(1)',
      }}
      {...handlers}
    >
      {children}
    </div>
  );
}
