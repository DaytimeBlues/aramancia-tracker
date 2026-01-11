/**
 * V3.0 Concentration Middleware
 * Event-driven concentration handling with automatic damage-triggered checks
 */

import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { showConcentrationPrompt } from '../slices/concentrationSlice';

// Define damage action type
export interface DamageAction {
  type: 'combat/takeDamage';
  payload: {
    damage: number;
    source?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Index signature for Redux compatibility
}

// Create listener middleware
export const concentrationMiddleware = createListenerMiddleware();

/**
 * Listen for damage actions and trigger concentration checks
 * DC = max(10, floor(damage / 2))
 */
concentrationMiddleware.startListening({
  predicate: (action): action is DamageAction => {
    return action.type === 'combat/takeDamage';
  },
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const concentration = state.concentration.current;

    // Only prompt if actively concentrating
    if (!concentration.active) {
      return;
    }

    const { damage, source } = action.payload as { damage: number; source?: string };
    const dc = Math.max(10, Math.floor(damage / 2));

    // Check for feat modifiers
    // TODO: Implement feat tracking system
    // For now, this is a stub showing where feat logic would go
    const hasWarCaster = false; // Would check actor.feats
    const hasMageSlayer = false; // Would check enemy abilities

    // Dispatch concentration prompt
    listenerApi.dispatch(showConcentrationPrompt({
      dc,
      damage,
      source,
      hasAdvantage: hasWarCaster,
      hasDisadvantage: hasMageSlayer,
      warCaster: hasWarCaster,
      mageSlayer: hasMageSlayer,
    }));
  },
});

/**
 * Helper action creator for taking damage
 * This should be used by combat components to trigger damage events
 */
export const takeDamage = (damage: number, source?: string): DamageAction => ({
  type: 'combat/takeDamage',
  payload: { damage, source },
});
