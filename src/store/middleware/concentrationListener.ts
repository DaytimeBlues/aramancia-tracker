/**
 * Concentration Listener Middleware
 * 
 * Event-driven rules engine for concentration checks.
 * 
 * This middleware listens for damage events and automatically:
 * 1. Checks if the character is concentrating
 * 2. Calculates the concentration save DC
 * 3. Dispatches a prompt action for the player to make the save
 * 4. Provides extension points for feats like War Caster and Mage Slayer
 * 
 * Design pattern:
 * - Listener middleware decouples game rules from UI actions
 * - Feats can hook into the pipeline to modify behavior
 * - Saves are prompted, not auto-resolved (player agency)
 */

import { createListenerMiddleware, PayloadAction } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from '../store';
import { damageTaken, concentrationEnded } from '../slices/characterSlice';
import {
  selectConcentrationState,
  selectConcentratingSpell,
  selectConcentrationSaveModifier,
} from '../selectors/characterSelectors';

/**
 * Concentration check prompt action
 * Dispatched when a concentration check is required
 */
export interface ConcentrationCheckPrompt {
  characterId: string;
  damage: number;
  dc: number;
  saveBonus: number;
  hasAdvantage: boolean;
  spellName: string;
  spellId: string;
}

/**
 * Action to prompt concentration check
 */
export const concentrationCheckPrompted = (payload: ConcentrationCheckPrompt) => ({
  type: 'game/concentrationCheckPrompted' as const,
  payload,
});

/**
 * Action to resolve concentration check
 */
export const concentrationCheckResolved = (payload: {
  characterId: string;
  success: boolean;
}) => ({
  type: 'game/concentrationCheckResolved' as const,
  payload,
});

/**
 * Listener middleware instance
 */
export const concentrationListenerMiddleware = createListenerMiddleware();

/**
 * Concentration check listener
 * 
 * Listens for: damageTaken action
 * Triggers: concentration check prompt if character is concentrating
 * 
 * Extension points:
 * - War Caster feat: grants advantage (handled in selector)
 * - Mage Slayer feat: could modify DC or trigger additional effects
 */
concentrationListenerMiddleware.startListening({
  actionCreator: damageTaken,
  effect: async (action: PayloadAction<{ characterId: string; amount: number }>, listenerApi) => {
    const { characterId, amount } = action.payload;
    const state = listenerApi.getState() as RootState;
    
    // Check if character is concentrating
    const concentrationState = selectConcentrationState(state);
    
    if (!concentrationState.spellId) {
      // Not concentrating, no check needed
      return;
    }
    
    // Get the spell being concentrated on
    const spell = selectConcentratingSpell(state);
    
    if (!spell) {
      // Spell not found (shouldn't happen), end concentration
      listenerApi.dispatch(concentrationEnded({ characterId }));
      return;
    }
    
    // Calculate concentration save DC
    // RAW: DC = max(10, damage / 2)
    const dc = Math.max(10, Math.floor(amount / 2));
    
    // Get save modifier (includes War Caster advantage)
    const saveModifier = selectConcentrationSaveModifier(state);
    
    // Extension point: Mage Slayer feat
    // If an enemy with Mage Slayer is adjacent, concentration checks could be at disadvantage
    // This would be implemented here by checking for nearby enemies with the feat
    
    // Dispatch prompt for player to roll
    listenerApi.dispatch(
      concentrationCheckPrompted({
        characterId,
        damage: amount,
        dc,
        saveBonus: saveModifier.bonus,
        hasAdvantage: saveModifier.advantage,
        spellName: spell.name,
        spellId: spell.id,
      }) as any
    );
  },
});

/**
 * Concentration check resolution listener
 * 
 * Listens for: concentrationCheckResolved action
 * Triggers: ends concentration if save failed
 */
concentrationListenerMiddleware.startListening({
  actionCreator: concentrationCheckResolved,
  effect: async (action: PayloadAction<{ characterId: string; success: boolean }>, listenerApi) => {
    const { characterId, success } = action.payload;
    
    if (!success) {
      // Failed save, end concentration
      listenerApi.dispatch(concentrationEnded({ characterId }));
    }
  },
});

/**
 * Extension point: War Caster feat listener
 * 
 * Example of how to extend the concentration system with feat mechanics.
 * War Caster grants advantage on concentration saves, which is handled
 * via the selectConcentrationSaveModifier selector.
 * 
 * Additional War Caster effects (e.g., somatic components with weapons/shield)
 * could be implemented as separate listeners.
 */
export const warCasterExtension = () => {
  // War Caster advantage is already applied via selector
  // This function demonstrates where additional War Caster logic would go
  
  // Example: Listen for spell casting to validate somatic components
  // concentrationListenerMiddleware.startListening({
  //   actionCreator: spellCast,
  //   effect: async (action, listenerApi) => {
  //     const state = listenerApi.getState() as RootState;
  //     const character = selectActiveCharacter(state);
  //     
  //     if (character?.features.warCaster) {
  //       // Allow somatic components even with weapons/shield
  //     }
  //   },
  // });
};

/**
 * Extension point: Mage Slayer feat listener
 * 
 * Example of how to extend the concentration system for Mage Slayer.
 * 
 * Mage Slayer effects:
 * 1. When a creature within 5 feet casts a spell, you can use reaction to attack
 * 2. Creatures have disadvantage on concentration saves from your damage
 * 3. You have advantage on saves against spells cast by creatures within 5 feet
 */
export const mageSlayerExtension = () => {
  // Example: Modify concentration check when damage is from Mage Slayer attacker
  
  // concentrationListenerMiddleware.startListening({
  //   actionCreator: damageTaken,
  //   effect: async (action, listenerApi) => {
  //     const state = listenerApi.getState() as RootState;
  //     
  //     // Check if damage source has Mage Slayer and is within 5 feet
  //     // If so, impose disadvantage on the concentration check
  //     
  //     // This would require tracking damage sources and positioning,
  //     // which is beyond the current scope but demonstrates the extension pattern
  //   },
  // });
};

/**
 * Export typed listener middleware
 */
export const concentrationMiddleware = concentrationListenerMiddleware.middleware;
