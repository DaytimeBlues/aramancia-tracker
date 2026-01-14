import React from 'react';
import { Provider } from 'react-redux';
import { render, RenderResult } from '@testing-library/react';
import { configureStore, AnyAction } from '@reduxjs/toolkit';

interface MinionState {
  ids: string[];
  entities: Record<string, unknown>;
  isLoading: boolean;
}

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

interface RootState {
  minions: MinionState;
  concentration: ConcentrationState;
  ui: UiState;
}

export const makeStore = (preloadedState?: RootState) => {
  return configureStore({
    reducer: {
      minions: (state: MinionState | undefined, action: AnyAction) => {
        const initial = { ids: [], entities: {}, isLoading: false };
        const s = state ?? initial;
        switch (action.type) {
          case 'minions/addOne':
            return { ...s, ids: [...s.ids, action.payload.id], entities: { ...s.entities, [action.payload.id]: action.payload }, isLoading: false };
          case 'minions/removeOne':
            return { ...s, ids: s.ids.filter((id: string) => id !== action.payload), entities: { ...s.entities, [action.payload]: undefined }, isLoading: false };
          case 'minions/updateOne':
            return { ...s, entities: { ...s.entities, [action.payload.id]: { ...s.entities[action.payload.id], ...action.payload.changes } }, isLoading: false };
          case 'minions/removeAll':
            return { ids: [], entities: {}, isLoading: false };
          default:
            return s;
        }
      },
      concentration: (state: ConcentrationState | undefined, action: AnyAction) => {
        const initial = { activeSpell: null, isCheckingConcentration: false };
        const s = state ?? initial;
        switch (action.type) {
          case 'concentration/setSpell':
            return { ...s, activeSpell: action.payload };
          case 'concentration/clearSpell':
            return { ...s, activeSpell: null };
          case 'concentration/failed':
            return { ...s, activeSpell: null };
          default:
            return s;
        }
      },
      ui: (state: UiState | undefined, action: AnyAction) => {
        const initial = { concentrationModal: { isOpen: false, spellName: null, dc: null } };
        const s = state ?? initial;
        switch (action.type) {
          case 'ui/openConcentrationModal':
            return { ...s, concentrationModal: { isOpen: true, spellName: action.payload.spellName, dc: action.payload.dc } };
          case 'ui/closeConcentrationModal':
            return { ...s, concentrationModal: { isOpen: false, spellName: null, dc: null } };
          default:
            return s;
        }
      },
    },
    preloadedState,
  });
};

export function renderWithProviders(
  ui: React.ReactElement,
  options?: { preloadedState?: RootState }
): { store: ReturnType<typeof makeStore> } & Omit<RenderResult, 'store'> {
  const store = makeStore(options?.preloadedState);
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  };
}
