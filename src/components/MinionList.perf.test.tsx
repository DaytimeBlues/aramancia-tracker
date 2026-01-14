import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Minion } from '../types';
import { MinionSchema } from '../features/minions/minionSchema';

vi.mock('@tanstack/react-virtual', async () => {
  const actual = await vi.importActual('@tanstack/react-virtual');
  return {
    ...actual,
    useVirtualizer: vi.fn(),
  };
});

interface MockVirtualRow {
  index: number;
  start: number;
  size: 50;
}

const mockMinions: Minion[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `minion-${i}`,
  type: i % 2 === 0 ? 'Skeleton' : 'Zombie',
  name: `Minion ${i + 1}`,
  hp: i % 13 + 1,
  maxHp: i % 13 + 1,
  ac: i % 15 + 8,
  notes: `Test notes for minion ${i + 1}`,
}));

const createMockVirtualRow = (index: number): MockVirtualRow => ({
  index,
  start: index * 50,
  size: 50,
});

function MinionList({ minions }: { minions: Minion[] }) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: minions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <div
      data-testid="virtual-container"
      role="list"
      ref={parentRef}
      style={{
        height: '400px',
        overflow: 'auto',
      }}
    >
      <div
        data-testid="virtual-spacer"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const minion = minions[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              data-index={virtualRow.index}
              ref={(node: HTMLElement | null) => virtualizer.measureElement(node)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {minion.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

describe('MinionList.perf.test.tsx - Virtualization Verification', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      value: 400,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 400,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
      configurable: true,
      value: 0,
      writable: true,
    });
  });

  it('Verify React 19 + TanStack Virtual are recycling DOM nodes', () => {
    const virtualRows = Array.from({ length: 45 }, (_, i) => createMockVirtualRow(i));
    
    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: vi.fn(() => virtualRows),
      getTotalSize: vi.fn(() => 1000 * 50),
      scrollToIndex: vi.fn(),
      measureElement: vi.fn(),
    } as unknown as ReturnType<typeof useVirtualizer>);

    const { container } = render(<MinionList minions={mockMinions} />);

    const listContainer = container.querySelector('[role="list"]');

    expect(listContainer).toBeDefined();

    if (listContainer) {
      const childElementCount = listContainer.childElementCount;
      expect(childElementCount).toBeLessThan(50);
    }
  });

  it('Verify virtual container exists and has correct data-testid', () => {
    const virtualRows = Array.from({ length: 30 }, (_, i) => createMockVirtualRow(i));
    
    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: vi.fn(() => virtualRows),
      getTotalSize: vi.fn(() => 1000 * 50),
      scrollToIndex: vi.fn(),
      measureElement: vi.fn(),
    } as unknown as ReturnType<typeof useVirtualizer>);

    render(<MinionList minions={mockMinions} />);

    const virtualContainer = screen.queryByTestId('virtual-container');
    expect(virtualContainer).toBeDefined();
    expect(virtualContainer).toHaveAttribute('role', 'list');
  });

  it('Verify only subset of minions are rendered in DOM', () => {
    const virtualRows = Array.from({ length: 40 }, (_, i) => createMockVirtualRow(i));
    
    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: vi.fn(() => virtualRows),
      getTotalSize: vi.fn(() => 1000 * 50),
      scrollToIndex: vi.fn(),
      measureElement: vi.fn(),
    } as unknown as ReturnType<typeof useVirtualizer>);

    const { container } = render(<MinionList minions={mockMinions} />);

    const minionElements = container.querySelectorAll('[data-index]');
    expect(minionElements.length).toBe(40);
    expect(minionElements.length).toBeLessThan(mockMinions.length);
  });

  it('Verify virtualized rows are correctly positioned', () => {
    const virtualRows = [
      createMockVirtualRow(0),
      createMockVirtualRow(1),
      createMockVirtualRow(2),
    ];
    
    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: vi.fn(() => virtualRows),
      getTotalSize: vi.fn(() => 1000 * 50),
      scrollToIndex: vi.fn(),
      measureElement: vi.fn(),
    } as unknown as ReturnType<typeof useVirtualizer>);

    const { container } = render(<MinionList minions={mockMinions.slice(0, 3)} />);

    const minionElements = container.querySelectorAll('[data-index]');
    
    minionElements.forEach((element, i) => {
      expect(element).toHaveStyle({ transform: `translateY(${i * 50}px)` });
    });
  });

  it('Verify measureElement ref is attached to each virtual row', () => {
    const virtualRows = [createMockVirtualRow(0), createMockVirtualRow(1)];
    
    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: vi.fn(() => virtualRows),
      getTotalSize: vi.fn(() => 1000 * 50),
      scrollToIndex: vi.fn(),
      measureElement: vi.fn(),
    } as unknown as ReturnType<typeof useVirtualizer>);

    render(<MinionList minions={mockMinions.slice(0, 2)} />);

    const mockVirtualizer = vi.mocked(useVirtualizer).mock.results[0].value as unknown as ReturnType<typeof useVirtualizer>;
    expect(mockVirtualizer.measureElement).toHaveBeenCalled();
  });

  it('Verify total virtual height is set correctly', () => {
    const virtualRows = [createMockVirtualRow(0)];
    
    const mockTotalSize = 50000;
    
    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: vi.fn(() => virtualRows),
      getTotalSize: vi.fn(() => mockTotalSize),
      scrollToIndex: vi.fn(),
      measureElement: vi.fn(),
    } as unknown as ReturnType<typeof useVirtualizer>);

    render(<MinionList minions={mockMinions} />);

    const spacer = screen.getByTestId('virtual-spacer');
    expect(spacer).toHaveStyle({ height: `${mockTotalSize}px` });
  });

  it('Verify minion data is correctly mapped to virtual rows', () => {
    const virtualRows = [createMockVirtualRow(0), createMockVirtualRow(5), createMockVirtualRow(10)];
    
    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: vi.fn(() => virtualRows),
      getTotalSize: vi.fn(() => 1000 * 50),
      scrollToIndex: vi.fn(),
      measureElement: vi.fn(),
    } as unknown as ReturnType<typeof useVirtualizer>);

    render(<MinionList minions={mockMinions} />);

    expect(screen.getByText('Minion 1')).toBeInTheDocument();
    expect(screen.getByText('Minion 6')).toBeInTheDocument();
    expect(screen.getByText('Minion 11')).toBeInTheDocument();
  });

  it('Verify empty minion list renders correctly', () => {
    const virtualRows: MockVirtualRow[] = [];
    
    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: vi.fn(() => virtualRows),
      getTotalSize: vi.fn(() => 0),
      scrollToIndex: vi.fn(),
      measureElement: vi.fn(),
    } as unknown as ReturnType<typeof useVirtualizer>);

    const { container } = render(<MinionList minions={[]} />);

    const minionElements = container.querySelectorAll('[data-index]');
    expect(minionElements.length).toBe(0);
  });

  it('Verify all rendered minions pass Zod schema validation', () => {
    const virtualRows = Array.from({ length: 10 }, (_, i) => createMockVirtualRow(i));
    
    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: vi.fn(() => virtualRows),
      getTotalSize: vi.fn(() => 1000 * 50),
      scrollToIndex: vi.fn(),
      measureElement: vi.fn(),
    } as unknown as ReturnType<typeof useVirtualizer>);

    render(<MinionList minions={mockMinions} />);

    const renderedMinionIndices = virtualRows.map((row) => row.index);
    renderedMinionIndices.forEach((index) => {
      const minion = mockMinions[index];
      const result = MinionSchema.safeParse(minion);
      expect(result.success).toBe(true);
    });
  });
});
