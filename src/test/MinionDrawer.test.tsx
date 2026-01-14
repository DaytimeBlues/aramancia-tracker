import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MinionDrawer } from '../components/minions/MinionDrawer';
import type { Minion } from '../store/slices/combatSlice';
import { store } from '../store';

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
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
          onClose={() => {}}
          minions={mockMinions}
        />
      </Provider>
    );

    expect(screen.getByText('Skeleton 1')).toBeInTheDocument();
    expect(screen.getByText('Zombie 1')).toBeInTheDocument();
  });

  it('renders add buttons when open', () => {
    render(
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
          onClose={() => {}}
          minions={[]}
        />
      </Provider>
    );

    expect(screen.getByText('Raise Skeleton')).toBeInTheDocument();
    expect(screen.getByText('Raise Zombie')).toBeInTheDocument();
  });

  it('shows release all button when minions exist', () => {
    render(
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
          onClose={() => {}}
          minions={mockMinions}
        />
      </Provider>
    );

    expect(screen.getByText('Release All')).toBeInTheDocument();
  });

  it('displays minion count', () => {
    render(
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
          onClose={() => {}}
          minions={mockMinions}
        />
      </Provider>
    );

    expect(screen.getByText(/2 Active/i)).toBeInTheDocument();
  });
});
