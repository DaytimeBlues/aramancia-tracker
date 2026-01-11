/**
 * Redux Architecture Demo View
 * 
 * This component demonstrates the new state-driven architecture:
 * - Normalized spell entities
 * - Memoized selectors
 * - Listener middleware for concentration
 * - Cast modal with decision-node pattern
 * - Override pattern for manual stat adjustments
 * 
 * This view can be accessed via a feature flag or new tab.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Settings, Zap } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import {
  selectAllSpells,
  selectTotalSpells,
} from '../../store/slices/spellsSlice';
import {
  selectActiveCharacter,
  selectSpellSaveDC,
  selectSpellAttackBonus,
  selectArmorClass,
  selectAllSkillBonuses,
  selectMaxPreparedSpells,
  selectPreparedSpellCount,
  selectConcentratingSpell,
  selectAvailableSpellSlots,
} from '../../store/selectors/characterSelectors';
import {
  overrideSet,
  featureToggled,
} from '../../store/slices/characterSlice';
import { CastModal } from './CastModal';

export const ReduxDemoView: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Get state via selectors
  const character = useAppSelector(selectActiveCharacter);
  const allSpells = useAppSelector(selectAllSpells);
  const totalSpells = useAppSelector(selectTotalSpells);
  const spellSaveDC = useAppSelector(selectSpellSaveDC);
  const spellAttackBonus = useAppSelector(selectSpellAttackBonus);
  const armorClass = useAppSelector(selectArmorClass);
  const skillBonuses = useAppSelector(selectAllSkillBonuses);
  const maxPrepared = useAppSelector(selectMaxPreparedSpells);
  const preparedCount = useAppSelector(selectPreparedSpellCount);
  const concentratingSpell = useAppSelector(selectConcentratingSpell);
  const availableSlots = useAppSelector(selectAvailableSpellSlots);
  
  // Local state
  const [selectedSpellId, setSelectedSpellId] = useState<string | null>(null);
  const [showOverrides, setShowOverrides] = useState(false);
  
  if (!character) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>No active character. Please select or create a character first.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-purple-400" size={24} />
          <h1 className="text-2xl font-bold text-white">Redux Architecture Demo</h1>
        </div>
        <p className="text-gray-300 text-sm">
          State-driven relational engine for D&D 5e with normalized entities and memoized selectors
        </p>
      </div>
      
      {/* Character Stats - Derived from Selectors */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={20} className="text-yellow-400" />
          Derived Stats (Memoized Selectors)
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">Spell Save DC</div>
            <div className="text-2xl font-bold text-white">{spellSaveDC}</div>
            <div className="text-xs text-gray-500">8 + prof + {character.spellcastingAbility.toUpperCase()}</div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">Spell Attack</div>
            <div className="text-2xl font-bold text-white">+{spellAttackBonus}</div>
            <div className="text-xs text-gray-500">prof + {character.spellcastingAbility.toUpperCase()}</div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">Armor Class</div>
            <div className="text-2xl font-bold text-white">{armorClass}</div>
            <div className="text-xs text-gray-500">
              {character.overrides.ac !== undefined ? 'Overridden' : 'Computed'}
            </div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">Prepared Spells</div>
            <div className="text-2xl font-bold text-white">{preparedCount} / {maxPrepared}</div>
            <div className="text-xs text-gray-500">Level + Mod</div>
          </div>
        </div>
        
        {/* Override Controls */}
        <div className="mt-4">
          <button
            onClick={() => setShowOverrides(!showOverrides)}
            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <Settings size={16} />
            {showOverrides ? 'Hide' : 'Show'} Manual Overrides
          </button>
          
          {showOverrides && (
            <div className="mt-3 space-y-2 bg-gray-800 p-3 rounded">
              <p className="text-xs text-gray-400 mb-2">
                Override pattern: allows manual stat adjustments without breaking relational model
              </p>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-white w-24">AC Override:</label>
                <input
                  type="number"
                  value={character.overrides.ac ?? ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    dispatch(overrideSet({ characterId: character.id, stat: 'ac', value }));
                  }}
                  placeholder="Auto"
                  className="bg-gray-700 text-white px-2 py-1 rounded w-20 text-sm"
                />
                <span className="text-xs text-gray-400">(Leave empty for auto-calc)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-white w-24">Spell DC:</label>
                <input
                  type="number"
                  value={character.overrides.spellSaveDC ?? ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    dispatch(overrideSet({ characterId: character.id, stat: 'spellSaveDC', value }));
                  }}
                  placeholder="Auto"
                  className="bg-gray-700 text-white px-2 py-1 rounded w-20 text-sm"
                />
                <span className="text-xs text-gray-400">(Leave empty for auto-calc)</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Skill Bonuses - Composite Selectors */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-3">
          Skill Bonuses (Composite Selectors)
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(skillBonuses).map(([skill, bonus]) => (
            <div key={skill} className="bg-gray-800 px-3 py-2 rounded text-sm">
              <span className="text-gray-400">{skill}:</span>{' '}
              <span className="text-white font-medium">
                {bonus >= 0 ? '+' : ''}{bonus}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Feature Toggles - Listener Middleware Extensions */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-3">
          Feat System (Listener Extensions)
        </h2>
        
        <div className="space-y-2">
          <label className="flex items-center gap-3 bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-750">
            <input
              type="checkbox"
              checked={character.features.warCaster}
              onChange={() => dispatch(featureToggled({ characterId: character.id, feature: 'warCaster' }))}
              className="w-4 h-4"
            />
            <div>
              <div className="text-white font-medium">War Caster</div>
              <div className="text-xs text-gray-400">
                Advantage on concentration saves (handled by selector)
              </div>
            </div>
          </label>
          
          <label className="flex items-center gap-3 bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-750">
            <input
              type="checkbox"
              checked={character.features.mageSlayer}
              onChange={() => dispatch(featureToggled({ characterId: character.id, feature: 'mageSlayer' }))}
              className="w-4 h-4"
            />
            <div>
              <div className="text-white font-medium">Mage Slayer</div>
              <div className="text-xs text-gray-400">
                Extension point for disadvantage on enemy concentration (see middleware)
              </div>
            </div>
          </label>
        </div>
      </div>
      
      {/* Concentration Status */}
      {concentratingSpell && (
        <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-4">
          <h2 className="text-lg font-bold text-white mb-2">
            Currently Concentrating
          </h2>
          <p className="text-purple-200">
            {concentratingSpell.name} - {concentratingSpell.concentration.maxDuration}
          </p>
          <p className="text-xs text-purple-300 mt-1">
            Concentration checks are handled by listener middleware on damage events
          </p>
        </div>
      )}
      
      {/* Spell Slots */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-3">
          Available Spell Slots (Selector-Derived)
        </h2>
        
        <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
          {Object.entries(availableSlots).map(([level, available]) => (
            <div key={level} className="bg-gray-800 p-2 rounded text-center">
              <div className="text-xs text-gray-400">L{level}</div>
              <div className={`text-lg font-bold ${available > 0 ? 'text-white' : 'text-gray-600'}`}>
                {available}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Normalized Spell Entities */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-3">
          Normalized Spell Entities ({totalSpells} total)
        </h2>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {allSpells.map(spell => (
            <button
              key={spell.id}
              onClick={() => setSelectedSpellId(spell.id)}
              className="w-full bg-gray-800 hover:bg-gray-750 p-3 rounded text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{spell.name}</div>
                  <div className="text-xs text-gray-400">
                    Level {spell.level} {spell.school}
                    {spell.concentration.required && ' • Concentration'}
                  </div>
                </div>
                <div className="text-xs text-purple-400">
                  Cast →
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {allSpells.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">
            No spells loaded. Spells should be migrated from legacy data.
          </p>
        )}
      </div>
      
      {/* Cast Modal */}
      {selectedSpellId && (
        <CastModal
          spellId={selectedSpellId}
          onClose={() => setSelectedSpellId(null)}
          onCast={(spellId, level, variant) => {
            console.log('Cast spell:', { spellId, level, variant });
          }}
        />
      )}
      
      {/* Architecture Notes */}
      <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
        <h2 className="text-lg font-bold text-white mb-3">
          Architecture Notes
        </h2>
        
        <div className="space-y-2 text-sm text-blue-100">
          <p>
            <strong>Normalized State:</strong> Spells stored centrally, referenced by ID to avoid denormalization
          </p>
          <p>
            <strong>Selector DAG:</strong> Base → Intermediate → Composite selectors with memoization
          </p>
          <p>
            <strong>Listener Middleware:</strong> Event-driven rules for concentration checks on damage
          </p>
          <p>
            <strong>Override Pattern:</strong> Manual stat overrides (e.g., AC) without breaking relational model
          </p>
          <p>
            <strong>Decision Nodes:</strong> Cast modal demonstrates spell variants, upcasting, and resource validation
          </p>
        </div>
      </div>
    </div>
  );
};
