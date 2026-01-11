import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { AbilityType } from '../slices/characterSlice';

const abilitySkillMap: Record<AbilityType, string[]> = {
  STR: ['athletics'],
  DEX: ['acrobatics', 'sleight-of-hand', 'stealth'],
  CON: [],
  INT: ['arcana', 'history', 'investigation', 'nature', 'religion'],
  WIS: ['animal-handling', 'insight', 'medicine', 'perception', 'survival'],
  CHA: ['deception', 'intimidation', 'performance', 'persuasion'],
};

const formatSkillName = (skillId: string) =>
  skillId
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const selectAbilities = (state: RootState) => state.character.abilities;
export const selectSkillProficiencies = (state: RootState) =>
  state.character.skillProficiencies;
export const selectLevel = (state: RootState) => state.character.level;

export const selectProficiencyBonus = createSelector(
  [selectLevel],
  (level) => 2 + Math.floor((level - 1) / 4),
);

export const selectAbilityModifiers = createSelector(
  [selectAbilities],
  (abilities) =>
    (Object.entries(abilities) as [AbilityType, number][]).reduce(
      (acc, [ability, score]) => {
        acc[ability] = Math.floor((score - 10) / 2);
        return acc;
      },
      {} as Record<AbilityType, number>,
    ),
);

export const selectAbilitySkillTree = createSelector(
  [selectAbilities, selectSkillProficiencies, selectProficiencyBonus],
  (abilities, proficiencies, profBonus) =>
    (Object.entries(abilitySkillMap) as [AbilityType, string[]][]).map(
      ([ability, skillIds]) => {
        const score = abilities[ability];
        const baseModifier = Math.floor((score - 10) / 2);
        const skills = skillIds.map((skillId) => {
          const proficiency = proficiencies[skillId] ?? 'none';
          let totalModifier = baseModifier;

          if (proficiency === 'proficient') {
            totalModifier += profBonus;
          }

          if (proficiency === 'expertise') {
            totalModifier += profBonus * 2;
          }

          return {
            id: skillId,
            name: formatSkillName(skillId),
            proficiency,
            totalModifier,
            abilityModifier: baseModifier,
            badge:
              proficiency === 'expertise'
                ? 'gold-crown'
                : proficiency === 'proficient'
                  ? 'silver-check'
                  : 'none',
          };
        });

        return {
          ability,
          abilityScore: score,
          baseModifier,
          skills,
          ...(ability === 'WIS' && {
            passivePerception:
              10 +
              (skills.find((skill) => skill.id === 'perception')?.totalModifier ??
                baseModifier),
          }),
        };
      },
    ),
);
