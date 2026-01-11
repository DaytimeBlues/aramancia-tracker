import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AbilityType = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
export type SkillProficiency = 'none' | 'proficient' | 'expertise';

export interface CharacterState {
  abilities: Record<AbilityType, number>;
  skillProficiencies: Record<string, SkillProficiency>;
  savingThrowProficiencies: Partial<Record<AbilityType, boolean>>;
  level: number;
  class: string;
}

const clampLevel = (level: number) => Math.min(20, Math.max(1, level));

const initialState: CharacterState = {
  abilities: {
    STR: 8,
    DEX: 14,
    CON: 14,
    INT: 17,
    WIS: 15,
    CHA: 10,
  },
  skillProficiencies: {
    arcana: 'expertise',
    history: 'proficient',
    insight: 'proficient',
    investigation: 'proficient',
  },
  savingThrowProficiencies: {
    INT: true,
    WIS: true,
  },
  level: 5,
  class: 'Wizard',
};

const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    setAbilityScore(
      state,
      action: PayloadAction<{ ability: AbilityType; score: number }>,
    ) {
      const { ability, score } = action.payload;
      state.abilities[ability] = score;
    },
    setSkillProficiency(
      state,
      action: PayloadAction<{ skillId: string; proficiency: SkillProficiency }>,
    ) {
      const { skillId, proficiency } = action.payload;
      state.skillProficiencies[skillId] = proficiency;
    },
    toggleSavingThrowProficiency(
      state,
      action: PayloadAction<{ ability: AbilityType; proficient: boolean }>,
    ) {
      const { ability, proficient } = action.payload;
      state.savingThrowProficiencies[ability] = proficient;
    },
    setLevel(state, action: PayloadAction<number>) {
      state.level = clampLevel(action.payload);
    },
    setClass(state, action: PayloadAction<string>) {
      state.class = action.payload;
    },
    hydrateCharacter(_state, action: PayloadAction<CharacterState>) {
      return action.payload;
    },
  },
});

export const {
  setAbilityScore,
  setSkillProficiency,
  toggleSavingThrowProficiency,
  setLevel,
  setClass,
  hydrateCharacter,
} = characterSlice.actions;

export default characterSlice.reducer;
