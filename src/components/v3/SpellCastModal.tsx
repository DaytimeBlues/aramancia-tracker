/**
 * V3.0 Spell Cast Modal
 * UI for spell upcasting with slot selection
 */

import React, { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectSpellById } from '../../store/selectors/derivedSelectors';
import { addSummon } from '../../store/slices/summonsSlice';
import { getAvailableSlots, getValidCastLevels, resolveSpellEffect } from '../../store/utils/spellUtils';
import type { RootState } from '../../store/store';
import type { SummonForm } from '../../types/v3';

interface SpellCastModalProps {
  spellId: string;
  slots: Record<number, { used: number; max: number }>;
  onCast: (spellId: string, level: number) => void;
  onClose: () => void;
}

export const SpellCastModal: React.FC<SpellCastModalProps> = ({
  spellId,
  slots,
  onCast,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const spell = useAppSelector((state: RootState) => selectSpellById(state, spellId));
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const availableSlots = useMemo(() => {
    if (!spell) return [];
    return getAvailableSlots(slots, spell.level);
  }, [spell, slots]);

  const validLevels = useMemo(() => {
    if (!spell) return [];
    return getValidCastLevels(spell, availableSlots);
  }, [spell, availableSlots]);

  const effectPreview = useMemo(() => {
    if (!spell || selectedLevel === null) return null;
    return resolveSpellEffect(spell, selectedLevel);
  }, [spell, selectedLevel]);

  // Auto-select base level on mount
  React.useEffect(() => {
    if (validLevels.length > 0 && selectedLevel === null) {
      setSelectedLevel(validLevels[0]);
    }
  }, [validLevels, selectedLevel]);

  if (!spell) {
    return null;
  }

  const handleCast = () => {
    if (selectedLevel !== null) {
      onCast(spellId, selectedLevel);

      // Special logic for Summon Undead
      if (spell.name === 'Summon Undead' && selectedVariant) {
        dispatch(addSummon({
          id: `summon-${Date.now()}`,
          name: `Spirit (${selectedVariant})`,
          form: selectedVariant as SummonForm,
          slotLevel: selectedLevel,
        }));
      }

      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 border border-white/30 rounded-lg max-w-2xl w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-display uppercase tracking-widest text-white mb-1">
              {spell.name}
            </h2>
            <div className="text-sm text-white/70">
              Level {spell.level} {spell.school}
              {spell.concentration && <span className="ml-2 text-yellow-400">⚡ Concentration</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Spell Info */}
        <div className="bg-black/30 rounded p-4 mb-4 text-sm text-white/80">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div><span className="text-white/50">Cast Time:</span> {spell.castTime}</div>
            <div><span className="text-white/50">Range:</span> {spell.range}</div>
            <div><span className="text-white/50">Duration:</span> {spell.duration}</div>
            <div><span className="text-white/50">Components:</span> {spell.components}</div>
          </div>
          <p className="mt-2 text-white/70">{spell.description}</p>
        </div>

        {/* Slot Selection */}
        {validLevels.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">
              Cast at Level
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {validLevels.map((level) => {
                const slotInfo = availableSlots.find(s => s.level === level);
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`p-3 rounded border-2 transition-all ${selectedLevel === level
                      ? 'border-yellow-400 bg-yellow-400/20 text-white'
                      : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/10'
                      }`}
                  >
                    <div className="text-lg font-bold">{level}</div>
                    <div className="text-xs opacity-75">
                      {slotInfo?.available}/{slotInfo?.total}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Variant Selection */}
        {spell.variants && spell.variants.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">
              Choose Effect
            </h3>
            <div className="space-y-2">
              {spell.variants.map((variant) => (
                <button
                  key={variant.name}
                  onClick={() => setSelectedVariant(variant.name)}
                  className={`w-full text-left p-3 rounded border transition-all ${selectedVariant === variant.name
                    ? 'border-yellow-400 bg-yellow-400/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                    }`}
                >
                  <div className="font-semibold text-white">{variant.name}</div>
                  <div className="text-sm text-white/70 mt-1">{variant.effect}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Effect Preview */}
        {effectPreview && (
          <div className="mb-4 bg-blue-900/30 border border-blue-400/30 rounded p-3">
            <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-1">
              Effect at Level {effectPreview.level}
            </h3>
            <div className="text-white font-mono">{effectPreview.resolvedEffect}</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleCast}
            disabled={selectedLevel === null || (spell.variants && !selectedVariant)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-display uppercase tracking-widest py-3 px-6 rounded transition-all"
          >
            Cast Spell
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
