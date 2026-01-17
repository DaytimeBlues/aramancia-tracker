import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpellSlotsWidget } from '../components/widgets/SpellSlotsWidget';

describe('SpellSlotsWidget', () => {
  const mockSlots = {
    1: { used: 1, max: 4 },
    2: { used: 0, max: 3 },
    3: { used: 2, max: 2 },
  };

  it('renders spell slot widget', () => {
    render(
      <SpellSlotsWidget
        slots={mockSlots}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Spellcasting')).toBeInTheDocument();
  });

  it('displays correct number of slots per level', () => {
    const { container } = render(
      <SpellSlotsWidget
        slots={mockSlots}
        onChange={() => {}}
      />
    );

    // Level 1 has 4 slots (1 used, 3 available)
    const orbElements = container.querySelectorAll('button[title="Cast Spell"], button[title="Restore Slot"]');
    const totalOrbs = 4 + 3 + 2; // Total across all levels
    expect(orbElements.length).toBe(totalOrbs);
  });

  it('tracks used and available slots', () => {
    const { container } = render(
      <SpellSlotsWidget
        slots={mockSlots}
        onChange={() => {}}
      />
    );

    // Count orbs vs orb-empty
    const availableOrbs = container.querySelectorAll('button[title="Cast Spell"]');
    const usedOrbs = container.querySelectorAll('button[title="Restore Slot"]');
    
    // Level 1: 3 available, 1 used
    // Level 2: 3 available, 0 used  
    // Level 3: 0 available, 2 used
    expect(availableOrbs.length).toBe(6); // 3 + 3 + 0
    expect(usedOrbs.length).toBe(3);      // 1 + 0 + 2
  });
});
