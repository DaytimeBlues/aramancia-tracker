/**
 * V3.0 Concentration Prompt
 * UI for concentration saving throw prompts
 */

import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectConcentrationPrompt, selectConcentration } from '../../store/selectors/derivedSelectors';
import { hideConcentrationPrompt, endConcentration } from '../../store/slices/concentrationSlice';

export const ConcentrationPrompt: React.FC = () => {
  const prompt = useAppSelector(selectConcentrationPrompt);
  const concentration = useAppSelector(selectConcentration);
  const dispatch = useAppDispatch();

  if (!prompt) {
    return null;
  }

  const handleSuccess = () => {
    dispatch(hideConcentrationPrompt());
  };

  const handleFailure = () => {
    dispatch(endConcentration());
    dispatch(hideConcentrationPrompt());
  };

  const handleDismiss = () => {
    dispatch(hideConcentrationPrompt());
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-red-900/90 to-orange-900/90 border border-yellow-400/50 rounded-lg max-w-md w-full p-6 shadow-2xl animate-pulse-slow">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-display uppercase tracking-widest text-yellow-400 mb-2">
            ⚡ Concentration Check ⚡
          </h2>
          <div className="text-white/90 text-lg">
            {concentration.spellName && (
              <div>Concentrating on <span className="font-bold">{concentration.spellName}</span></div>
            )}
          </div>
        </div>

        {/* Damage Info */}
        <div className="bg-black/40 rounded p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Damage Taken</div>
              <div className="text-3xl font-bold text-red-400">{prompt.damage}</div>
            </div>
            <div>
              <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Save DC</div>
              <div className="text-3xl font-bold text-yellow-400">{prompt.dc}</div>
            </div>
          </div>
          
          {prompt.source && (
            <div className="text-center mt-3 text-sm text-white/70">
              Source: {prompt.source}
            </div>
          )}
        </div>

        {/* Modifiers */}
        {(prompt.hasAdvantage || prompt.hasDisadvantage) && (
          <div className="mb-4 p-3 bg-black/30 rounded">
            <div className="text-sm text-white/80">
              {prompt.hasAdvantage && (
                <div className="text-green-400">✓ Advantage (War Caster)</div>
              )}
              {prompt.hasDisadvantage && (
                <div className="text-red-400">✗ Disadvantage (Mage Slayer)</div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-900/30 border border-blue-400/30 rounded p-3 mb-4 text-sm text-white/80">
          <strong>CON Save Required:</strong> Roll 1d20 + CON modifier
          {prompt.hasAdvantage && !prompt.hasDisadvantage && ' (with advantage)'}
          {prompt.hasDisadvantage && !prompt.hasAdvantage && ' (with disadvantage)'}
          . If you roll {prompt.dc} or higher, you maintain concentration.
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleSuccess}
            className="bg-green-600 hover:bg-green-500 text-white font-display uppercase tracking-wider py-3 px-4 rounded transition-all"
          >
            Success
          </button>
          <button
            onClick={handleFailure}
            className="bg-red-600 hover:bg-red-500 text-white font-display uppercase tracking-wider py-3 px-4 rounded transition-all"
          >
            Failed
          </button>
          <button
            onClick={handleDismiss}
            className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded transition-all"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};
