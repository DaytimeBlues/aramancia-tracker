/**
 * V3.0 Demo View
 * Demonstrates the v3.0 architectural paradigm features
 */

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setAttribute, setLevel } from '../../store/slices/actorSlice';
import { selectActor, selectLevel, selectBaseAttributes } from '../../store/selectors/derivedSelectors';
import { DerivedStatsDisplay } from './DerivedStatsDisplay';
import { SpellCastModal } from './SpellCastModal';
import { ConcentrationPrompt } from './ConcentrationPrompt';
import { takeDamage } from '../../store/middleware/concentrationMiddleware';
import { startConcentration } from '../../store/slices/concentrationSlice';

export const V3DemoView: React.FC = () => {
  const dispatch = useAppDispatch();
  const actor = useAppSelector(selectActor);
  const level = useAppSelector(selectLevel);
  const attributes = useAppSelector(selectBaseAttributes);
  
  const [showCastModal, setShowCastModal] = useState(false);
  const [selectedSpellId, setSelectedSpellId] = useState<string>('magic-missile');

  // Simplified slots for demo (would come from state in full implementation)
  const demoSlots = {
    1: { used: 0, max: 4 },
    2: { used: 0, max: 3 },
    3: { used: 1, max: 2 },
  };

  const handleAttributeChange = (ability: 'int', delta: number) => {
    const newValue = Math.max(1, Math.min(30, attributes[ability] + delta));
    dispatch(setAttribute({ ability, value: newValue }));
  };

  const handleLevelChange = (delta: number) => {
    const newLevel = Math.max(1, Math.min(20, level + delta));
    dispatch(setLevel(newLevel));
  };

  const handleCastSpell = (spellId: string, castLevel: number) => {
    console.log(`Casting ${spellId} at level ${castLevel}`);
    
    // For concentration spells, start concentration
    if (spellId === 'haste') {
      dispatch(startConcentration({
        spellId: 'haste',
        spellName: 'Haste',
      }));
    }
  };

  const handleTakeDamage = (damage: number) => {
    dispatch(takeDamage(damage, 'Goblin Arrow'));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-white/20 rounded-lg p-6">
        <h1 className="text-3xl font-display uppercase tracking-widest text-white mb-2">
          V3.0 Architecture Demo
        </h1>
        <p className="text-white/70">
          State-driven relational engine with normalized entities, memoized selectors, and event-driven concentration
        </p>
      </div>

      {/* Derived Stats Display */}
      <DerivedStatsDisplay />

      {/* Attribute Controls */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg p-4">
        <h2 className="text-xl font-display uppercase tracking-widest text-white/90 mb-4">
          Actor Controls
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* INT Control */}
          <div className="bg-white/5 rounded p-4 border border-white/10">
            <div className="text-sm text-white/60 uppercase tracking-wider mb-2">
              Intelligence
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAttributeChange('int', -1)}
                className="w-10 h-10 bg-red-600/50 hover:bg-red-600/70 text-white rounded transition-all"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <div className="text-3xl font-bold text-white">{attributes.int}</div>
              </div>
              <button
                onClick={() => handleAttributeChange('int', 1)}
                className="w-10 h-10 bg-green-600/50 hover:bg-green-600/70 text-white rounded transition-all"
              >
                +
              </button>
            </div>
            <div className="text-xs text-white/50 mt-2 text-center">
              Changes cascade to DC & Attack
            </div>
          </div>

          {/* Level Control */}
          <div className="bg-white/5 rounded p-4 border border-white/10">
            <div className="text-sm text-white/60 uppercase tracking-wider mb-2">
              Character Level
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleLevelChange(-1)}
                className="w-10 h-10 bg-red-600/50 hover:bg-red-600/70 text-white rounded transition-all"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <div className="text-3xl font-bold text-white">{level}</div>
              </div>
              <button
                onClick={() => handleLevelChange(1)}
                className="w-10 h-10 bg-green-600/50 hover:bg-green-600/70 text-white rounded transition-all"
              >
                +
              </button>
            </div>
            <div className="text-xs text-white/50 mt-2 text-center">
              Changes proficiency bonus
            </div>
          </div>
        </div>
      </div>

      {/* Spell Casting Demo */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg p-4">
        <h2 className="text-xl font-display uppercase tracking-widest text-white/90 mb-4">
          Spell Upcasting
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setSelectedSpellId('magic-missile');
              setShowCastModal(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-display uppercase tracking-wider py-4 px-6 rounded transition-all"
          >
            Cast Magic Missile
          </button>
          <button
            onClick={() => {
              setSelectedSpellId('fireball');
              setShowCastModal(true);
            }}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-display uppercase tracking-wider py-4 px-6 rounded transition-all"
          >
            Cast Fireball
          </button>
          <button
            onClick={() => {
              setSelectedSpellId('enhance-ability');
              setShowCastModal(true);
            }}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-display uppercase tracking-wider py-4 px-6 rounded transition-all"
          >
            Cast Enhance Ability
          </button>
          <button
            onClick={() => {
              setSelectedSpellId('haste');
              setShowCastModal(true);
            }}
            className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-display uppercase tracking-wider py-4 px-6 rounded transition-all"
          >
            Cast Haste (Conc.)
          </button>
        </div>
      </div>

      {/* Concentration Testing */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg p-4">
        <h2 className="text-xl font-display uppercase tracking-widest text-white/90 mb-4">
          Concentration Testing
        </h2>
        
        <div className="mb-4 text-sm text-white/70">
          First cast Haste (concentration), then take damage to trigger a concentration check prompt.
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[5, 10, 15, 20].map(damage => (
            <button
              key={damage}
              onClick={() => handleTakeDamage(damage)}
              className="bg-red-600/50 hover:bg-red-600/70 text-white font-display uppercase tracking-wider py-3 px-4 rounded transition-all"
            >
              Take {damage} DMG
            </button>
          ))}
        </div>

        <div className="mt-3 text-xs text-white/50 italic">
          DC = max(10, ⌊damage/2⌋)
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg p-4">
        <h2 className="text-xl font-display uppercase tracking-widest text-white/90 mb-4">
          Architecture Notes
        </h2>
        
        <div className="space-y-3 text-sm text-white/70">
          <div>
            <strong className="text-white">Normalized State:</strong> Spells, actors, and effects stored in entity adapters with ID references
          </div>
          <div>
            <strong className="text-white">Memoized Selectors:</strong> Derived stats computed via Reselect with automatic re-computation on dependency changes
          </div>
          <div>
            <strong className="text-white">Override Pattern:</strong> Stats can be overridden or computed from base values
          </div>
          <div>
            <strong className="text-white">Event-Driven:</strong> Damage events trigger concentration check prompts via RTK listener middleware
          </div>
          <div>
            <strong className="text-white">Spell Nodes:</strong> Upcasting logic resolves effects based on selected slot level with scaling formulas
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCastModal && (
        <SpellCastModal
          spellId={selectedSpellId}
          slots={demoSlots}
          onCast={handleCastSpell}
          onClose={() => setShowCastModal(false)}
        />
      )}

      <ConcentrationPrompt />
    </div>
  );
};
