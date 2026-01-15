import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MinionDrawer } from '../components/minions/MinionDrawer';
import type { Minion } from '../store/slices/combatSlice';

vi.mock('react-redux', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-redux')>();
  return {
    ...mod,
    useDispatch: vi.fn(() => vi.fn()),
    useSelector: vi.fn(() => []),
  };
});

vi.mock('../store/slices/combatSlice', () => ({
  minionAdded: vi.fn(),
  minionRemoved: vi.fn(),
  minionUpdated: vi.fn(),
  allMinionsCleared: vi.fn(),
}));

describe('MinionDrawer', () => {
  const mockMinions: Minion[] = [
    {
      id: '1',
      type: 'skeleton',
      name: 'Skeleton 1',
      hp: 10,
      maxHp: 13,
      ac: 13,
      speed: 30,
      attacks: [],
      conditions: [],
      notes: 'Test notes',
    },
    {
      id: '2',
      type: 'zombie',
      name: 'Zombie 1',
      hp: 22,
      maxHp: 22,
      ac: 8,
      speed: 20,
      attacks: [],
      conditions: [],
      notes: 'Test notes',
    },
  ];

  it('renders minion list when open', () => {
    render(
      <MinionDrawer
        isOpen={true}
        onClose={() => {}}
        minions={mockMinions}
      />
    );

    expect(screen.getByText('Skeleton 1')).toBeInTheDocument();
    expect(screen.getByText('Zombie 1')).toBeInTheDocument();
  });

  it('displays minion count', () => {
    render(
      <MinionDrawer
        isOpen={true}
        onClose={() => {}}
        minions={mockMinions}
      />
    );

    expect(screen.getByText(/2 Active/i)).toBeInTheDocument();
  });
});
