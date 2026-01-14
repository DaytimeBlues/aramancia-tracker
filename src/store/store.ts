import { configureStore, combineReducers } from '@reduxjs/toolkit';
import minionReducer from '../features/minions/minionSlice';
import { concentrationMiddlewareInstance } from './middleware/concentrationMiddleware';

const rootReducer = combineReducers({
  minions: minionReducer,
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
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(concentrationMiddlewareInstance),
});
