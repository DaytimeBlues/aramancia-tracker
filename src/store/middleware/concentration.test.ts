import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore, combineReducers, AnyAction } from '@reduxjs/toolkit';
import minionReducer from '../../features/minions/minionSlice';
import { concentrationMiddlewareInstance, calculateConcentrationDC } from './concentrationMiddleware';

interface ConcentrationState {
  activeSpell: string | null;
  isCheckingConcentration: boolean;
}

interface UiState {
  concentrationModal: {
    isOpen: boolean;
    spellName: string | null;
    dc: number | null;
  };
}

function createTestStore() {
  return configureStore({
    reducer: combineReducers({
      minions: minionReducer,
      concentration: (state: ConcentrationState = { activeSpell: null, isCheckingConcentration: false }, action: AnyAction) => {
        switch (action.type) {
          case 'concentration/setSpell':
            return { ...state, activeSpell: action.payload };
          case 'concentration/clearSpell':
            return { ...state, activeSpell: null };
          case 'concentration/failed':
            return { ...state, activeSpell: null };
          default:
            return state;
        }
      },
      ui: (state: UiState = { concentrationModal: { isOpen: false, spellName: null, dc: null } }, action: AnyAction) => {
        switch (action.type) {
          case 'ui/openConcentrationModal':
            return {
              ...state,
              concentrationModal: { isOpen: true, spellName: action.payload.spellName, dc: action.payload.dc }
            };
          case 'ui/closeConcentrationModal':
            return { ...state, concentrationModal: { isOpen: false, spellName: null, dc: null } };
          default:
            return state;
        }
      },
    }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(concentrationMiddlewareInstance),
  });
}

describe('concentration.test.ts - Logic & Race Conditions', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('Happy Path: Taking damage while concentrating dispatches ui/openConcentrationModal', () => {
    store.dispatch({ type: 'concentration/setSpell', payload: 'Summon Undead' });
    store.dispatch({ type: 'game/takeDamage', payload: { damage: 15 } });

    const state = store.getState();
    expect(state.ui.concentrationModal.isOpen).toBe(true);
    expect(state.ui.concentrationModal.spellName).toBe('Summon Undead');
    expect(state.ui.concentrationModal.dc).toBe(calculateConcentrationDC(15));
  });

  it('The Race: Dispatch takeDamage and castSpell in rapid succession, ensuring only one active concentration spell', async () => {
    store.dispatch({ type: 'concentration/setSpell', payload: 'First Spell' });

    await Promise.all([
      Promise.resolve().then(() => {
        store.dispatch({ type: 'game/takeDamage', payload: { damage: 10 } });
      }),
      Promise.resolve().then(() => {
        store.dispatch({
          type: 'game/castSpell',
          payload: { spellName: 'Second Spell', requiresConcentration: true },
        });
      }),
    ]);

    await new Promise((resolve) => setTimeout(resolve, 10));

    const state = store.getState();
    expect(state.concentration.activeSpell).toBe('Second Spell');
  });

  it('The DC Math: Verify damage of 22 results in DC 11', () => {
    const dc = calculateConcentrationDC(22);
    expect(dc).toBe(11);
  });

  it('The DC Math: Verify damage of 4 results in DC 10 (minimum)', () => {
    const dc = calculateConcentrationDC(4);
    expect(dc).toBe(10);
  });

  it('The DC Math: Verify damage of 0 results in no modal dispatch', () => {
    const dispatchedActions: AnyAction[] = [];
    const originalDispatch = store.dispatch;
    (store as { dispatch: unknown }).dispatch = vi.fn((action: AnyAction) => {
      dispatchedActions.push(action);
      return originalDispatch(action);
    });

    store.dispatch({ type: 'concentration/setSpell', payload: 'Test Spell' });
    store.dispatch({ type: 'game/takeDamage', payload: { damage: 0 } });

    const modalAction = dispatchedActions.find(
      (action) => action.type === 'ui/openConcentrationModal'
    );

    expect(modalAction).toBeUndefined();

    (store as { dispatch: unknown }).dispatch = originalDispatch;
  });

  it('Concentration: When not concentrating, taking damage does NOT dispatch modal', () => {
    const dispatchedActions: AnyAction[] = [];
    const originalDispatch = store.dispatch;
    (store as { dispatch: unknown }).dispatch = vi.fn((action: AnyAction) => {
      dispatchedActions.push(action);
      return originalDispatch(action);
    });

    store.dispatch({ type: 'concentration/clearSpell' });
    store.dispatch({ type: 'game/takeDamage', payload: { damage: 25 } });

    const modalAction = dispatchedActions.find(
      (action) => action.type === 'ui/openConcentrationModal'
    );

    expect(modalAction).toBeUndefined();

    (store as { dispatch: unknown }).dispatch = originalDispatch;
  });

  it('The DC Math: Verify damage of 19 results in DC 10 (floor division)', () => {
    const dc = calculateConcentrationDC(19);
    expect(dc).toBe(10);
  });

  it('The DC Math: Verify damage of 20 results in DC 10', () => {
    const dc = calculateConcentrationDC(20);
    expect(dc).toBe(10);
  });

  it('The DC Math: Verify damage of 21 results in DC 10 (floor division)', () => {
    const dc = calculateConcentrationDC(21);
    expect(dc).toBe(10);
  });

  it('Concentration: Cast spell without concentration does not set active spell', () => {
    const initialState = store.getState();
    expect(initialState.concentration.activeSpell).toBeNull();

    store.dispatch({
      type: 'game/castSpell',
      payload: { spellName: 'Fireball', requiresConcentration: false },
    });

    const state = store.getState();
    expect(state.concentration.activeSpell).toBeNull();
  });

  it('Concentration: Cast spell with concentration sets active spell', () => {
    store.dispatch({ type: 'concentration/clearSpell' });

    store.dispatch({
      type: 'game/castSpell',
      payload: { spellName: 'Animate Dead', requiresConcentration: true },
    });

    const state = store.getState();
    expect(state.concentration.activeSpell).toBe('Animate Dead');
  });
});
