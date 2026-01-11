import { configureStore } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';
import combatReducer from './slices/combatSlice';
import { combatListenerMiddleware } from './middleware/combatListeners';

export const store = configureStore({
  reducer: {
    character: characterReducer,
    combat: combatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(combatListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
