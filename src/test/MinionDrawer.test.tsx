import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MinionDrawer } from '../components/minions/MinionDrawer';
import combatReducer, { minionAdded, type Minion } from '../store/slices/combatSlice';

const renderWithStore = (ui: React.ReactElement, store = configureStore({ reducer: { combat: combatReducer } })) => ({
  store,
  ...render(<Provider store={store}>{ui}</Provider>),
});

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
    renderWithStore(
      <MinionDrawer
        isOpen={true}
        onClose={() => {}}
        minions={mockMinions}
      />
    );

    expect(screen.getByText('Skeleton 1')).toBeInTheDocument();
    expect(screen.getByText('Zombie 1')).toBeInTheDocument();
  });

  it('adds a minion to the store when a quick add button is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <MinionDrawer isOpen={true} onClose={() => {}} minions={[]} />
    );

    const skeletonButton = screen.getByText('Raise Skeleton');
    await user.click(skeletonButton);

    expect(store.getState().combat.minions.ids).toHaveLength(1);
  });

  it('clears minions when release all is clicked', async () => {
    const user = userEvent.setup();
    const store = configureStore({ reducer: { combat: combatReducer } });
    store.dispatch(minionAdded(mockMinions[0]));

    renderWithStore(
      <MinionDrawer
        isOpen={true}
        onClose={() => {}}
        minions={store.getState().combat.minions.ids.map(id => store.getState().combat.minions.entities[id]) as Minion[]}
      />,
      store
    );

    const clearButton = screen.getByText('Release All');
    await user.click(clearButton);

    expect(store.getState().combat.minions.ids).toHaveLength(0);
  });

  it('displays minion count', () => {
    renderWithStore(
      <MinionDrawer
        isOpen={true}
        onClose={() => {}}
        minions={mockMinions}
      />
    );

    expect(screen.getByText(/2 Active/i)).toBeInTheDocument();
  });
});
