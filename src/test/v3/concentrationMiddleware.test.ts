/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * V3.0 Tests - Concentration Middleware
 */

import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import actorReducer from '../../store/slices/actorSlice';
import concentrationReducer, { startConcentration } from '../../store/slices/concentrationSlice';
import { concentrationMiddleware, takeDamage } from '../../store/middleware/concentrationMiddleware';

const createTestStore = () => {
  return configureStore({
    reducer: {
      actor: actorReducer,
      concentration: concentrationReducer,
      effects: () => ({ ids: [], entities: {} }),
      spells: () => ({ ids: [], entities: {} }),
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(concentrationMiddleware.middleware),
  });
};

describe('V3.0 Concentration Middleware', () => {
  it('does not trigger prompt when not concentrating', () => {
    const store = createTestStore();
    
    store.dispatch(takeDamage(10) as any);
    
    const state = store.getState();
    expect(state.concentration.prompt).toBeNull();
  });

  it('triggers concentration check when concentrating and taking damage', () => {
    const store = createTestStore();
    
    // Start concentrating
    store.dispatch(startConcentration({
      spellId: 'haste',
      spellName: 'Haste',
    }));
    
    // Take damage
    store.dispatch(takeDamage(15, 'Goblin Arrow') as any);
    
    const state = store.getState();
    expect(state.concentration.prompt).toBeTruthy();
    expect(state.concentration.prompt?.damage).toBe(15);
    expect(state.concentration.prompt?.dc).toBe(10); // max(10, 15/2) = max(10, 7) = 10
    expect(state.concentration.prompt?.source).toBe('Goblin Arrow');
  });

  it('calculates DC correctly for various damage amounts', () => {
    const store = createTestStore();
    
    store.dispatch(startConcentration({
      spellId: 'haste',
      spellName: 'Haste',
    }));
    
    // Low damage: DC = 10
    store.dispatch(takeDamage(5) as any);
    expect(store.getState().concentration.prompt?.dc).toBe(10);
    
    // Medium damage: DC = damage/2
    store.dispatch(takeDamage(22) as any);
    expect(store.getState().concentration.prompt?.dc).toBe(11); // floor(22/2) = 11
    
    // High damage: DC = damage/2
    store.dispatch(takeDamage(50) as any);
    expect(store.getState().concentration.prompt?.dc).toBe(25); // floor(50/2) = 25
  });

  it('includes advantage/disadvantage flags', () => {
    const store = createTestStore();
    
    store.dispatch(startConcentration({
      spellId: 'haste',
      spellName: 'Haste',
    }));
    
    store.dispatch(takeDamage(10) as any);
    
    const prompt = store.getState().concentration.prompt;
    expect(prompt).toHaveProperty('hasAdvantage');
    expect(prompt).toHaveProperty('hasDisadvantage');
    expect(prompt).toHaveProperty('warCaster');
    expect(prompt).toHaveProperty('mageSlayer');
  });
});
