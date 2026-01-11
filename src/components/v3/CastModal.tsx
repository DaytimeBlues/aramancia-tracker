/**
 * Cast Spell Modal - Decision Node Casting UI
 * 
 * Demonstrates:
 * - Reading spell schema from normalized state
 * - Displaying upcast options with slot availability
 * - Spell variants and resource consumption
 * - Derived validation (e.g., max prepared spells) via selectors
 * - Integration with Redux state and actions
 * 
 * This component showcases the "spell as decision node" pattern where
 * casting a spell involves choosing:
 * - Upcast level (if applicable)
 * - Variant (if applicable)
 * - Confirming resource consumption
 */

import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { selectSpellById } from '../../store/slices/spellsSlice';
import {
  spellSlotUsed,
  concentrationStarted,
  concentrationEnded,
} from '../../store/slices/characterSlice';
import {
  selectAvailableSpellSlots,
  selectConcentrationState,
  selectSpellSaveDC,
  selectSpellAttackBonus,
  selectActiveCharacter,
} from '../../store/selectors/characterSelectors';
import type { NormalizedSpell, SpellVariant } from '../../store/types/spellSchema';
import type { RootState } from '../../store/store';

interface CastModalProps {
  spellId: string;
  onClose: () => void;
  onCast?: (spellId: string, upcastLevel: number, variantId?: string) => void;
}

/**
 * Cast Spell Modal Component
 */
export const CastModal: React.FC<CastModalProps> = ({ spellId, onClose, onCast }) => {
  const dispatch = useAppDispatch();
  
  // Get spell from normalized state
  const spell = useAppSelector((state: RootState) => selectSpellById(state, spellId));
  
  // Get derived state via selectors
  const availableSlots = useAppSelector(selectAvailableSpellSlots);
  const concentrationState = useAppSelector(selectConcentrationState);
  const spellSaveDC = useAppSelector(selectSpellSaveDC);
  const spellAttackBonus = useAppSelector(selectSpellAttackBonus);
  const character = useAppSelector(selectActiveCharacter);
  
  // Local state for casting decisions
  const [selectedLevel, setSelectedLevel] = useState<number>(spell?.level ?? 1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  
  if (!spell || !character) {
    return null;
  }
  
  // Calculate available upcast levels
  const upcastOptions = useMemo(() => {
    const options: Array<{ level: number; available: number; disabled: boolean }> = [];
    
    // Cantrips don't upcast via spell slots
    if (spell.level === 0) {
      return options;
    }
    
    // Check each spell level from base to 9
    for (let level = spell.level; level <= 9; level++) {
      const available = availableSlots[level] ?? 0;
      options.push({
        level,
        available,
        disabled: available === 0,
      });
    }
    
    return options;
  }, [spell.level, availableSlots]);
  
  // Calculate scaled effects based on upcast level
  const scaledEffect = useMemo(() => {
    if (!spell.scaling || selectedLevel === spell.level) {
      return spell.effect.description;
    }
    
    // Apply scaling
    const levelDiff = selectedLevel - spell.level;
    let description = spell.effect.description;
    
    spell.scaling.forEach(scale => {
      if (scale.attribute === 'damage' && spell.effect.diceFormula) {
        // Simple scaling example: add perLevel for each level above base
        description += ` (+${scale.perLevel} per level above ${spell.level})`;
      }
    });
    
    return description;
  }, [spell, selectedLevel]);
  
  // Check if concentration conflict
  const hasConcentrationConflict = spell.concentration.required && concentrationState.spellId !== null;
  
  // Get currently concentrating spell name if applicable
  const concentratingSpellName = useAppSelector((state: RootState) => {
    if (!concentrationState.spellId) return null;
    const concentratingSpell = selectSpellById(state, concentrationState.spellId);
    return concentratingSpell?.name ?? null;
  });
  
  // Handle cast
  const handleCast = () => {
    // Check if spell requires concentration and we're already concentrating
    if (hasConcentrationConflict) {
      // End current concentration
      dispatch(concentrationEnded({ characterId: character.id }));
    }
    
    // Use spell slot (cantrips don't use slots)
    if (spell.level > 0) {
      dispatch(spellSlotUsed({ characterId: character.id, level: selectedLevel }));
    }
    
    // Start concentration if required
    if (spell.concentration.required) {
      dispatch(concentrationStarted({ characterId: character.id, spellId: spell.id }));
    }
    
    // Callback for additional handling
    if (onCast) {
      onCast(spell.id, selectedLevel, selectedVariant);
    }
    
    onClose();
  };
  
  // Check if can cast
  const canCast = spell.level === 0 || (availableSlots[selectedLevel] ?? 0) > 0;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{spell.name}</h2>
            <p className="text-sm text-gray-400">
              Level {spell.level} {spell.school}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Spell Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Casting Time:</span>{' '}
              <span className="text-white">
                {spell.castingTime.amount} {spell.castingTime.unit.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Range:</span>{' '}
              <span className="text-white">
                {spell.range.type === 'ranged' ? `${spell.range.distance} ft` : spell.range.type}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Duration:</span>{' '}
              <span className="text-white">
                {spell.duration.type === 'instantaneous'
                  ? 'Instantaneous'
                  : `${spell.duration.amount} ${spell.duration.unit}${spell.duration.amount! > 1 ? 's' : ''}`}
                {spell.concentration.required && ' (Concentration)'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Components:</span>{' '}
              <span className="text-white">
                {[
                  spell.components.verbal && 'V',
                  spell.components.somatic && 'S',
                  spell.components.material && 'M',
                ]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          </div>
          
          {/* Attack/Save Info */}
          {spell.attack.type !== 'none' && (
            <div className="bg-gray-800 p-3 rounded">
              <p className="text-sm text-white">
                {spell.attack.type === 'save' && (
                  <>
                    <span className="font-bold">{spell.attack.subtype?.toUpperCase()} Save DC {spellSaveDC}</span>
                  </>
                )}
                {spell.attack.type === 'attack' && (
                  <>
                    <span className="font-bold">Spell Attack: +{spellAttackBonus}</span>
                  </>
                )}
              </p>
            </div>
          )}
          
          {/* Effect */}
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Effect</h3>
            <p className="text-sm text-gray-300">{scaledEffect}</p>
            {spell.effect.diceFormula && (
              <p className="text-sm text-purple-400 mt-1">
                {spell.effect.diceFormula} {spell.effect.damageType}
              </p>
            )}
          </div>
          
          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Description</h3>
            <p className="text-sm text-gray-300">{spell.description}</p>
          </div>
          
          {/* Upcast Options */}
          {upcastOptions.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Cast at Level</h3>
              <div className="grid grid-cols-3 gap-2">
                {upcastOptions.map(option => (
                  <button
                    key={option.level}
                    onClick={() => setSelectedLevel(option.level)}
                    disabled={option.disabled}
                    className={`p-2 rounded text-sm font-medium transition-colors ${
                      selectedLevel === option.level
                        ? 'bg-purple-600 text-white'
                        : option.disabled
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    Level {option.level}
                    <br />
                    <span className="text-xs">
                      {option.available > 0 ? `${option.available} slots` : 'No slots'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Spell Variants */}
          {spell.variants && spell.variants.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Variants</h3>
              <div className="space-y-2">
                {spell.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`w-full p-3 rounded text-left transition-colors ${
                      selectedVariant === variant.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{variant.name}</div>
                    <div className="text-xs text-gray-300 mt-1">{variant.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Concentration Warning */}
          {hasConcentrationConflict && concentratingSpellName && (
            <div className="bg-yellow-900/30 border border-yellow-600 p-3 rounded">
              <p className="text-sm text-yellow-200">
                ⚠️ You are currently concentrating on <strong>{concentratingSpellName}</strong>.
                Casting this spell will end that concentration.
              </p>
            </div>
          )}
          
          {/* Resource Costs */}
          <div className="border-t border-gray-700 pt-3">
            <h3 className="text-sm font-bold text-white mb-2">Resource Cost</h3>
            <div className="space-y-1 text-sm">
              {spell.level === 0 ? (
                <p className="text-gray-400">Cantrip (no slot required)</p>
              ) : (
                <p className="text-gray-300">
                  1 × Level {selectedLevel} spell slot
                </p>
              )}
              {spell.components.material && spell.components.materialCost && (
                <p className="text-gray-300">
                  Material: {spell.components.materialDescription} ({spell.components.materialCost} GP)
                  {spell.components.materialConsumed && ' (consumed)'}
                </p>
              )}
            </div>
          </div>
          
          {/* Flavor Text */}
          {spell.flavor?.incantation && (
            <div className="border-t border-gray-700 pt-3">
              <p className="text-sm italic text-purple-300">
                "{spell.flavor.incantation}"
              </p>
              {spell.flavor.pronunciation && (
                <p className="text-xs text-gray-500 mt-1">
                  ({spell.flavor.pronunciation})
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCast}
            disabled={!canCast}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              canCast
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Cast Spell
          </button>
        </div>
      </div>
    </div>
  );
};
