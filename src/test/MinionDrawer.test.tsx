import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MinionDrawer } from '../components/minions/MinionDrawer';
import type { Minion } from '../types';
import { store } from '../store';
import { allMinionsCleared, minionAdded } from '../store/slices/characterSlice';

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

describe('MinionDrawer', () => {
  beforeEach(() => {
    store.dispatch(allMinionsCleared());
  });

  it('renders minion list when open', () => {
    mockMinions.forEach(m => store.dispatch(minionAdded(m)));

    render(
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
          onClose={() => { }}
        />
      </Provider>
    );

    expect(screen.getByText('Skeleton 1')).toBeInTheDocument();
  });

  it('renders add buttons when open', () => {
    // No minions added
    render(
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
          onClose={() => { }}
        />
      </Provider>
    );

    expect(screen.getByText('Raise Skeleton')).toBeInTheDocument();
    expect(screen.getByText('Raise Zombie')).toBeInTheDocument();
  });

  it('shows release all button when minions exist', () => {
    store.dispatch(minionAdded(mockMinions[0]));

    render(
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
          onClose={() => { }}
        />
      </Provider>
    );

    expect(screen.getByText('Dismiss All')).toBeInTheDocument();
  });

  it('displays minion count', () => {
    mockMinions.forEach(m => store.dispatch(minionAdded(m)));

    render(
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
          onClose={() => { }}
        />
      </Provider>
    );

    expect(screen.getByText(/2 Active/i)).toBeInTheDocument();
  });
});
