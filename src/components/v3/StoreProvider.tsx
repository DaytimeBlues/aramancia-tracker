/**
 * V3.0 Store Provider
 * Wrapper component to provide Redux store to app
 */

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { spellsAdded } from '../../store/slices/spellsSlice';
import { v3SampleSpells } from '../../data/v3Spells';

// Initialize store with sample data
store.dispatch(spellsAdded(v3SampleSpells));

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
