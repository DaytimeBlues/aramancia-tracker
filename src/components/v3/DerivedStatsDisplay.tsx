/**
 * V3.0 Derived Stats Display
 * Shows spell DC and attack bonus computed from selectors
 */

import React from 'react';
import { useAppSelector } from '../../store/hooks';
import {
  selectSpellSaveDC,
  selectSpellAttackBonus,
  selectAbilityModifiers,
  selectProficiencyBonus,
} from '../../store/selectors/derivedSelectors';

export const DerivedStatsDisplay: React.FC = () => {
  const spellSaveDC = useAppSelector(selectSpellSaveDC);
  const spellAttackBonus = useAppSelector(selectSpellAttackBonus);
  const abilityMods = useAppSelector(selectAbilityModifiers);
  const profBonus = useAppSelector(selectProficiencyBonus);

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg p-4">
      <h2 className="text-xl font-display uppercase tracking-widest text-white/90 mb-4">
        Derived Stats
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Spell Save DC */}
        <div className="bg-white/5 rounded p-3 border border-white/10">
          <div className="text-xs text-white/60 uppercase tracking-wider mb-1">
            Spell Save DC
          </div>
          <div className="text-2xl font-bold text-white">
            {spellSaveDC ?? '—'}
          </div>
          <div className="text-xs text-white/50 mt-1">
            8 + Prof ({profBonus}) + INT ({abilityMods.int >= 0 ? '+' : ''}{abilityMods.int})
          </div>
        </div>

        {/* Spell Attack Bonus */}
        <div className="bg-white/5 rounded p-3 border border-white/10">
          <div className="text-xs text-white/60 uppercase tracking-wider mb-1">
            Spell Attack
          </div>
          <div className="text-2xl font-bold text-white">
            {spellAttackBonus !== undefined ? (spellAttackBonus >= 0 ? '+' : '') + spellAttackBonus : '—'}
          </div>
          <div className="text-xs text-white/50 mt-1">
            Prof ({profBonus}) + INT ({abilityMods.int >= 0 ? '+' : ''}{abilityMods.int})
          </div>
        </div>

        {/* Proficiency Bonus */}
        <div className="bg-white/5 rounded p-3 border border-white/10">
          <div className="text-xs text-white/60 uppercase tracking-wider mb-1">
            Proficiency
          </div>
          <div className="text-2xl font-bold text-white">
            +{profBonus}
          </div>
        </div>

        {/* INT Modifier */}
        <div className="bg-white/5 rounded p-3 border border-white/10">
          <div className="text-xs text-white/60 uppercase tracking-wider mb-1">
            INT Modifier
          </div>
          <div className="text-2xl font-bold text-white">
            {abilityMods.int >= 0 ? '+' : ''}{abilityMods.int}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-white/40 italic">
        ✨ Auto-computed from actor state. Change INT to see updates!
      </div>
    </div>
  );
};
