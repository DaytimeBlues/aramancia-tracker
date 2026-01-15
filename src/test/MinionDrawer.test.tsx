import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MinionDrawer } from '../components/minions/MinionDrawer';
<<<<<<< HEAD
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
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MinionDrawer } from '../components/minions/MinionDrawer';
import combatReducer from '../store/slices/combatSlice';
import characterReducer from '../store/slices/characterSlice';
import spellbookReducer from '../store/slices/spellbookSlice';
import type { Minion } from '../types';

// Helper to render with Redux Provider
function renderWithStore(
  ui: React.ReactElement,
  minions: Minion[] = []
) {
  // Build proper entity adapter state
  const minionState = {
    ids: minions.map(m => m.id),
    entities: Object.fromEntries(minions.map(m => [m.id, m])),
  };

  const store = configureStore({
    reducer: {
      character: characterReducer,
      spellbook: spellbookReducer,
      combat: combatReducer,
    },
    preloadedState: {
      combat: {
        phase: 'idle' as const,
        currentRound: 1,
        activeConcentration: null,
        concentrationCheckDC: null,
        initiativeOrder: [],
        currentTurnIndex: 0,
        minions: minionState,
        casting: {
          step: 'idle' as const,
          spellId: null,
          slotLevel: null,
          resolutionMode: null,
        },
      },
    },
  });
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}

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
=======
import type { Minion } from '../types';
import { store } from '../store';

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
>>>>>>> 5b0877a (fix: restore build and tests (resolve type errors, missing imports, syntax issue))
  it('renders minion list when open', () => {
    render(
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
<<<<<<< HEAD
          onClose={() => {}}
          minions={mockMinions}
        />
      </Provider>
    renderWithStore(
      <MinionDrawer
        isOpen={true}
        onClose={() => { }}
        minions={mockMinions}
      />,
      mockMinions
=======
          onClose={() => { }}
          minions={mockMinions}
        />
      </Provider>
>>>>>>> 5b0877a (fix: restore build and tests (resolve type errors, missing imports, syntax issue))
    );

    expect(screen.getByText('Skeleton 1')).toBeInTheDocument();
    expect(screen.getByText('Zombie 1')).toBeInTheDocument();
  });

  it('renders add buttons when open', () => {
    render(
      <Provider store={store}>
        <MinionDrawer
          isOpen={true}
<<<<<<< HEAD
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
  it('dispatches minionAdded when add button clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <MinionDrawer
        isOpen={true}
        onClose={() => { }}
        minions={[]}
      />
    );

    const skeletonButton = screen.getByText('Raise Skeleton');
    await user.click(skeletonButton);

    const state = store.getState();
    expect(state.combat.minions.ids.length).toBe(1);
    const minionId = state.combat.minions.ids[0];
    expect(state.combat.minions.entities[minionId].type).toBe('skeleton');
  });

  it('dispatches allMinionsCleared when release all clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <MinionDrawer
        isOpen={true}
        onClose={() => { }}
        minions={mockMinions}
      />,
      mockMinions
    );

    const clearButton = screen.getByText('Release All');
    await user.click(clearButton);

    const state = store.getState();
    expect(state.combat.minions.ids.length).toBe(0);
  });

  it('displays minion count', () => {
    renderWithStore(
      <MinionDrawer
        isOpen={true}
        onClose={() => { }}
        minions={mockMinions}
      />,
      mockMinions
=======
          onClose={() => { }}
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
          onClose={() => { }}
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
          onClose={() => { }}
          minions={mockMinions}
        />
      </Provider>
>>>>>>> 5b0877a (fix: restore build and tests (resolve type errors, missing imports, syntax issue))
    );

    expect(screen.getByText(/2 Active/i)).toBeInTheDocument();
  });
});

