import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MinionDrawer } from '../components/minions/MinionDrawer';
import { store } from '../store';
import { allMinionsCleared, minionAdded, type Minion } from '../store/slices/combatSlice';
import '@testing-library/jest-dom/vitest';

const mockMinions: Minion[] = [
  {
    id: '1',
    type: 'skeleton',
    name: 'Skeleton 1',
    hp: 13,
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

  const renderDrawer = () => {
    return render(
      <Provider store={store}>
        <MinionDrawer isOpen={true} onClose={() => { }} />
      </Provider>
    );
  };

  it('renders correctly when open', () => {
    renderDrawer();
    expect(screen.getByText(/Necromancy/i)).toBeInTheDocument();
    expect(screen.getByText(/Raise Skeleton/i)).toBeInTheDocument();
  });

  it('displays added minions', () => {
    store.dispatch(minionAdded(mockMinions[0]));
    renderDrawer();
    expect(screen.getByText('Skeleton 1')).toBeInTheDocument();
  });

  it('shows the release all button when minions exist', () => {
    store.dispatch(minionAdded(mockMinions[0]));
    renderDrawer();
    expect(screen.getByText(/Dismiss All/i)).toBeInTheDocument();
  });

  it('displays minion count accurately', () => {
    store.dispatch(minionAdded(mockMinions[0]));
    store.dispatch(minionAdded(mockMinions[1]));
    renderDrawer();
    expect(screen.getByText(/2 Active/i)).toBeInTheDocument();
  });
});
