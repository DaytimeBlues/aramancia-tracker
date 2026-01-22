/**
 * V3.0 Derived Stats Display
 * Shows spell DC, attack bonus, AC, and HP computed from selectors
 */

import React from 'react';
import { useAppSelector } from '../../store/hooks';
import {
  selectSpellSaveDC,
  selectSpellAttackBonus,
  selectArmorClass,
  selectMaxHP
} from '../../store/selectors/derivedSelectors';
import { Shield, Heart, Sparkles, Target } from 'lucide-react';

export const DerivedStatsDisplay: React.FC = () => {
  const saveDC = useAppSelector(selectSpellSaveDC);
  const attackBonus = useAppSelector(selectSpellAttackBonus);
  const ac = useAppSelector(selectArmorClass);
  const maxHp = useAppSelector(selectMaxHP);

  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {/* AC */}
      <StatCard
        icon={<Shield size={14} className="text-blue-400" />}
        label="AC"
        value={ac}
      />

      {/* Max HP */}
      <StatCard
        icon={<Heart size={14} className="text-red-400" />}
        label="Max HP"
        value={maxHp}
      />

      {/* Save DC */}
      <StatCard
        icon={<Sparkles size={14} className="text-purple-400" />}
        label="Save DC"
        value={saveDC || '--'}
      />

      {/* Attack Bonus */}
      <StatCard
        icon={<Target size={14} className="text-yellow-400" />}
        label="Spell Atk"
        value={attackBonus !== undefined ? `+${attackBonus}` : '--'}
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded p-2 flex flex-col items-center justify-center">
    <div className="flex items-center gap-1 mb-1">
      {icon}
      <span className="text-[9px] text-white/50 uppercase font-display tracking-wider font-bold">
        {label}
      </span>
    </div>
    <div className="text-lg font-display text-white font-bold leading-none">
      {value}
    </div>
  </div>
);
