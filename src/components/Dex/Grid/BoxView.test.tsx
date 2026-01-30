import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BoxView } from './BoxView';

// Mock DexEntry to avoid fetching Pokemon data
vi.mock('~/components/Dex/Entry', () => ({
  DexEntry: ({ pokemonId }: { pokemonId: number }) => (
    <div data-testid={`dex-entry-${pokemonId}`}>Pokemon {pokemonId}</div>
  ),
}));

describe('BoxView box calculation', () => {
  const defaultProps = {
    filteredIds: new Set<number>(),
    dexNumberMap: new Map<number, number>(),
    caughtIds: new Set<number>(),
  };

  it('creates boxes of 30 Pokemon each', () => {
    // 35 Pokemon should create 2 boxes: one with 30, one with 5
    const pokemonIds = Array.from({ length: 35 }, (_, i) => i + 1);
    const filteredIds = new Set(pokemonIds);

    render(
      <BoxView
        {...defaultProps}
        pokemonIds={pokemonIds}
        filteredIds={filteredIds}
      />
    );

    expect(screen.getByText('Box 1: 1-30')).toBeInTheDocument();
    expect(screen.getByText('Box 2: 31-35')).toBeInTheDocument();
  });

  it('handles exactly 30 Pokemon in one box', () => {
    const pokemonIds = Array.from({ length: 30 }, (_, i) => i + 1);
    const filteredIds = new Set(pokemonIds);

    render(
      <BoxView
        {...defaultProps}
        pokemonIds={pokemonIds}
        filteredIds={filteredIds}
      />
    );

    expect(screen.getByText('Box 1: 1-30')).toBeInTheDocument();
    expect(screen.queryByText(/Box 2/)).not.toBeInTheDocument();
  });

  it('handles small dex with fewer than 30 Pokemon', () => {
    const pokemonIds = [1, 2, 3, 4, 5];
    const filteredIds = new Set(pokemonIds);

    render(
      <BoxView
        {...defaultProps}
        pokemonIds={pokemonIds}
        filteredIds={filteredIds}
      />
    );

    expect(screen.getByText('Box 1: 1-5')).toBeInTheDocument();
  });

  it('handles empty Pokemon list', () => {
    render(
      <BoxView {...defaultProps} pokemonIds={[]} filteredIds={new Set()} />
    );

    expect(screen.queryByText(/Box/)).not.toBeInTheDocument();
  });

  it('shows empty box message when all Pokemon in box are filtered out', () => {
    const pokemonIds = [1, 2, 3];
    const filteredIds = new Set<number>(); // No Pokemon pass the filter

    render(
      <BoxView
        {...defaultProps}
        pokemonIds={pokemonIds}
        filteredIds={filteredIds}
      />
    );

    // Box header should still be visible
    expect(screen.getByText('Box 1: 1-3')).toBeInTheDocument();
    // But shows empty message
    expect(screen.getByText('No Pokemon visible')).toBeInTheDocument();
  });

  it('preserves box structure when some Pokemon are filtered', () => {
    // 35 Pokemon in 2 boxes, but only show Pokemon 31-35 (second box)
    const pokemonIds = Array.from({ length: 35 }, (_, i) => i + 1);
    const filteredIds = new Set([31, 32, 33, 34, 35]);

    render(
      <BoxView
        {...defaultProps}
        pokemonIds={pokemonIds}
        filteredIds={filteredIds}
      />
    );

    // Both boxes should exist
    expect(screen.getByText('Box 1: 1-30')).toBeInTheDocument();
    expect(screen.getByText('Box 2: 31-35')).toBeInTheDocument();
    // First box shows empty message
    expect(screen.getByText('No Pokemon visible')).toBeInTheDocument();
  });
});

describe('BoxView generation boundaries', () => {
  const defaultProps = {
    dexNumberMap: new Map<number, number>(),
    caughtIds: new Set<number>(),
  };

  it('does not break on generation boundaries when respectGenerationBoundaries is false', () => {
    // Pokemon 150, 151 (Gen 1), 152, 153 (Gen 2) - should be one box
    const pokemonIds = [150, 151, 152, 153];
    const filteredIds = new Set(pokemonIds);

    render(
      <BoxView
        {...defaultProps}
        pokemonIds={pokemonIds}
        filteredIds={filteredIds}
        respectGenerationBoundaries={false}
      />
    );

    // Should be one box containing all 4 Pokemon
    expect(screen.getByText('Box 1: 1-4')).toBeInTheDocument();
    expect(screen.queryByText(/Box 2/)).not.toBeInTheDocument();
  });

  it('breaks on generation boundaries when respectGenerationBoundaries is true', () => {
    // Pokemon 150, 151 (Gen 1), 152, 153 (Gen 2)
    const pokemonIds = [150, 151, 152, 153];
    const filteredIds = new Set(pokemonIds);

    render(
      <BoxView
        {...defaultProps}
        pokemonIds={pokemonIds}
        filteredIds={filteredIds}
        respectGenerationBoundaries={true}
      />
    );

    // Should be two boxes - Gen 1 and Gen 2
    expect(screen.getByText('Box 1: 1-2')).toBeInTheDocument();
    expect(screen.getByText('Box 2: 3-4')).toBeInTheDocument();
  });

  it('handles Mew (151) as last Pokemon of Gen 1', () => {
    // Gen 1 ends at 151 (Mew), Gen 2 starts at 152 (Chikorita)
    const pokemonIds = [149, 150, 151, 152, 153, 154];
    const filteredIds = new Set(pokemonIds);

    render(
      <BoxView
        {...defaultProps}
        pokemonIds={pokemonIds}
        filteredIds={filteredIds}
        respectGenerationBoundaries={true}
      />
    );

    // First box: 149, 150, 151 (all Gen 1)
    expect(screen.getByText('Box 1: 1-3')).toBeInTheDocument();
    // Second box: 152, 153, 154 (all Gen 2)
    expect(screen.getByText('Box 2: 4-6')).toBeInTheDocument();
  });

  it('still breaks at 30 even with generation boundaries', () => {
    // 35 Gen 1 Pokemon should still create 2 boxes
    const pokemonIds = Array.from({ length: 35 }, (_, i) => i + 1);
    const filteredIds = new Set(pokemonIds);

    render(
      <BoxView
        {...defaultProps}
        pokemonIds={pokemonIds}
        filteredIds={filteredIds}
        respectGenerationBoundaries={true}
      />
    );

    expect(screen.getByText('Box 1: 1-30')).toBeInTheDocument();
    expect(screen.getByText('Box 2: 31-35')).toBeInTheDocument();
  });

  it('handles multiple generation boundaries', () => {
    // Pokemon from Gen 1, Gen 2, Gen 3
    const pokemonIds = [151, 251, 252]; // Mew, Celebi, Treecko
    const filteredIds = new Set(pokemonIds);

    render(
      <BoxView
        {...defaultProps}
        pokemonIds={pokemonIds}
        filteredIds={filteredIds}
        respectGenerationBoundaries={true}
      />
    );

    // Three boxes - one for each generation
    expect(screen.getByText('Box 1: 1-1')).toBeInTheDocument(); // Mew
    expect(screen.getByText('Box 2: 2-2')).toBeInTheDocument(); // Celebi
    expect(screen.getByText('Box 3: 3-3')).toBeInTheDocument(); // Treecko
  });
});

describe('BoxView rendering', () => {
  const defaultProps = {
    dexNumberMap: new Map<number, number>(),
    caughtIds: new Set<number>(),
  };

  it('renders Pokemon entries for visible Pokemon', () => {
    const pokemonIds = [1, 4, 25];
    const filteredIds = new Set(pokemonIds);

    render(
      <BoxView
        {...defaultProps}
        pokemonIds={pokemonIds}
        filteredIds={filteredIds}
      />
    );

    expect(screen.getByTestId('dex-entry-1')).toBeInTheDocument();
    expect(screen.getByTestId('dex-entry-4')).toBeInTheDocument();
    expect(screen.getByTestId('dex-entry-25')).toBeInTheDocument();
  });

  it('does not render filtered-out Pokemon', () => {
    const pokemonIds = [1, 4, 25];
    const filteredIds = new Set([1, 25]); // 4 is filtered out

    render(
      <BoxView
        {...defaultProps}
        pokemonIds={pokemonIds}
        filteredIds={filteredIds}
      />
    );

    expect(screen.getByTestId('dex-entry-1')).toBeInTheDocument();
    expect(screen.queryByTestId('dex-entry-4')).not.toBeInTheDocument();
    expect(screen.getByTestId('dex-entry-25')).toBeInTheDocument();
  });

  it('renders dividers between boxes but not after last box', () => {
    const pokemonIds = Array.from({ length: 35 }, (_, i) => i + 1);
    const filteredIds = new Set(pokemonIds);

    const { container } = render(
      <BoxView
        {...defaultProps}
        pokemonIds={pokemonIds}
        filteredIds={filteredIds}
      />
    );

    // Should have exactly 1 divider (between box 1 and box 2, but not after box 2)
    const dividers = container.querySelectorAll('.border-t');
    expect(dividers).toHaveLength(1);
  });
});
