import { createListenerMiddleware } from '@reduxjs/toolkit';
import {
  recordDamage,
  setPendingConcentrationCheck,
} from '../slices/combatSlice';

export const combatListenerMiddleware = createListenerMiddleware();

combatListenerMiddleware.startListening({
  actionCreator: recordDamage,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    const concentration = state.combat.concentration;

    if (!concentration) {
      return;
    }

    if (action.payload.targetId !== concentration.casterId) {
      return;
    }

    const dc = Math.max(10, Math.floor(action.payload.amount / 2));

    listenerApi.dispatch(
      setPendingConcentrationCheck({
        casterId: concentration.casterId,
        spellVariantId: concentration.spellVariantId,
        dc,
      }),
    );
  },
});
