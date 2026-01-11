/**
 * Redux Store Configuration
 * 
 * Configures the Redux Toolkit store with:
 * - Normalized entity slices (spells, characters)
 * - Listener middleware for event-driven rules
 * - TypeScript types for type-safe dispatch and state access
 */

import { configureStore } from '@reduxjs/toolkit';
import spellsReducer from './slices/spellsSlice';
import characterReducer from './slices/characterSlice';
import { concentrationMiddleware } from './middleware/concentrationListener';

/**
 * Configure store
 */
export const store = configureStore({
  reducer: {
    spells: spellsReducer,
    character: characterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(concentrationMiddleware),
});

/**
 * TypeScript types for store
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Type-safe hooks (to be used in components instead of plain useDispatch/useSelector)
 */
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
