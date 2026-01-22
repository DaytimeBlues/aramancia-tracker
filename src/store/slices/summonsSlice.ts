/**
 * V3.0 Redux Store - Summons Slice
 * Handles spirit summons (Summon Undead) with scaling stats.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SummonsState, Summon, SummonForm } from '../../types/v3';

const initialState: SummonsState = {
    activeSummons: [],
};

export const summonsSlice = createSlice({
    name: 'summons',
    initialState,
    reducers: {
        addSummon: (state, action: PayloadAction<{
            id: string;
            name: string;
            form: SummonForm;
            slotLevel: number;
        }>) => {
            const { id, name, form, slotLevel } = action.payload;

            // RAW Scaling Math
            // AC: 11 + Spell Level
            const ac = 11 + slotLevel;

            // HP: (Ghostly/Putrid: 30 | Skeletal: 20) + 10 per level above 3rd
            const baseHp = form === 'Skeletal' ? 20 : 30;
            const bonusHp = (slotLevel - 3) * 10;
            const maxHp = baseHp + bonusHp;

            // Multiattack: Floor(Level / 2)
            const attacks = Math.floor(slotLevel / 2);

            const newSummon: Summon = {
                id,
                name,
                type: 'Spirit',
                form,
                slotLevel,
                currentHp: maxHp,
                maxHp,
                ac,
                attacks,
                active: true,
            };

            state.activeSummons.push(newSummon);
        },
        updateSummonHp: (state, action: PayloadAction<{ id: string; amount: number }>) => {
            const summon = state.activeSummons.find(s => s.id === action.payload.id);
            if (summon) {
                summon.currentHp = Math.max(0, Math.min(summon.maxHp, summon.currentHp + action.payload.amount));
                if (summon.currentHp === 0) {
                    summon.active = false;
                }
            }
        },
        removeSummon: (state, action: PayloadAction<string>) => {
            state.activeSummons = state.activeSummons.filter(s => s.id !== action.payload);
        },
        clearSummons: (state) => {
            state.activeSummons = [];
        },
    },
});

export const { addSummon, updateSummonHp, removeSummon, clearSummons } = summonsSlice.actions;

export default summonsSlice.reducer;
