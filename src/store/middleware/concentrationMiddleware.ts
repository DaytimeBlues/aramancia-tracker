import { createListenerMiddleware } from '@reduxjs/toolkit';

export interface TakeDamagePayload {
  damage: number;
}

export interface CastSpellPayload {
  spellName: string;
  requiresConcentration: boolean;
}

export const calculateConcentrationDC = (damage: number): number => {
  return Math.max(10, Math.floor(damage / 2));
};

const concentrationMiddleware = createListenerMiddleware();

concentrationMiddleware.startListening({
  predicate: (action): action is { type: string; payload: any } => {
    return action.type === 'game/takeDamage' || action.type === 'game/castSpell';
  },
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as { concentration: { activeSpell: string | null } };
    const concentrationState = state.concentration;
    
    if (action.type === 'game/takeDamage') {
      const { damage } = action.payload as TakeDamagePayload;
      
      if (concentrationState.activeSpell && damage > 0) {
        const dc = calculateConcentrationDC(damage);
        listenerApi.dispatch({
          type: 'ui/openConcentrationModal',
          payload: {
            spellName: concentrationState.activeSpell,
            dc,
          },
        } as const);
      }
    } else if (action.type === 'game/castSpell') {
      const { spellName, requiresConcentration } = action.payload as CastSpellPayload;
      
      if (requiresConcentration) {
        listenerApi.dispatch({
          type: 'concentration/setSpell',
          payload: spellName,
        } as const);
      }
    }
  },
});

export const concentrationMiddlewareInstance = concentrationMiddleware.middleware;
