/**
 * persistenceMiddleware.ts
 * 
 * WHY: Automatically persists character state to sessionStorage on every action.
 * This eliminates the manual useEffect + debounce pattern in App.tsx.
 * 
 * The middleware intercepts actions dispatched to the 'character' slice
 * and saves the updated state to the active session in sessionStorage.
 */
import { Middleware } from '@reduxjs/toolkit';
import { updateActiveSession } from '../../utils/sessionStorage';
import { CharacterState } from './characterSlice';
import { selectAllMinions } from './combatSlice';

// Actions that should NOT trigger persistence (ephemeral)
const EPHEMERAL_ACTIONS = ['character/toastCleared', 'character/toastShown'];

export const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);

    // Only persist on character actions or combat minion actions, and skip ephemeral ones
    if (
        typeof action === 'object' &&
        action !== null &&
        'type' in action &&
        typeof action.type === 'string' &&
        ((action.type.startsWith('character/') && !EPHEMERAL_ACTIONS.includes(action.type)) ||
            (action.type.startsWith('combat/') && action.type.includes('minion')))
    ) {
        const state = store.getState();
        const character: CharacterState = state.character;
        const minions = selectAllMinions(state);

        // Extract CharacterData (without minions and toast) for session storage
        // We alias 'minions' to '_minions' to avoid collision with the 'minions' variable declared above
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { minions: _minions, toast: _toast, ...characterData } = character;

        // Save to sessionStorage (debounced internally if needed, but let's keep it simple)
        // Using requestIdleCallback for better performance on rapid updates
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(() => {
                updateActiveSession(characterData, minions);
            });
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => {
                updateActiveSession(characterData, minions);
            }, 0);
        }
    }

    return result;
};
