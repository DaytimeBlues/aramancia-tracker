import React from 'react';
import { Provider } from 'react-redux';
import { render, RenderResult } from '@testing-library/react';
import type { PreloadedState } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

export const makeStore = (preloadedState?: PreloadedState<any>) => {
  return configureStore({
    reducer: {
      minions: (state = { ids: [], entities: {}, isLoading: false }, action: any) => {
        switch (action.type) {
          case 'minions/addOne':
            return { ...state, ids: [...state.ids, action.payload.id], entities: { ...state.entities, [action.payload.id]: action.payload }, isLoading: false };
          case 'minions/removeOne':
            return { ...state, ids: state.ids.filter(id => id !== action.payload), entities: { ...state.entities, [action.payload]: undefined }, isLoading: false };
          case 'minions/updateOne':
            return { ...state, entities: { ...state.entities, [action.payload.id]: { ...state.entities[action.payload.id], ...action.payload.changes } }, isLoading: false };
          case 'minions/removeAll':
            return { ids: [], entities: {}, isLoading: false };
          default:
            return state;
        }
      },
      concentration: (state = { activeSpell: null, isCheckingConcentration: false }, action: any) => {
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
      ui: (state = { concentrationModal: { isOpen: false, spellName: null, dc: null } }, action: any) => {
        switch (action.type) {
          case 'ui/openConcentrationModal':
            return { ...state, concentrationModal: { isOpen: true, spellName: action.payload.spellName, dc: action.payload.dc } };
          case 'ui/closeConcentrationModal':
            return { ...state, concentrationModal: { isOpen: false, spellName: null, dc: null } };
          default:
            return state;
        }
      },
    },
    preloadedState,
  });
};

export function renderWithProviders(
  ui: React.ReactElement,
  options?: { preloadedState?: PreloadedState<any> }
): { store: ReturnType<typeof makeStore>; ...RenderResult } {
  const store = makeStore(options?.preloadedState);
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  };
}
