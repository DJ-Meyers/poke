import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BoxView } from './BoxView';
import { GameDex } from '~/utils/dex-data';

// Mock DexEntry to avoid fetching Pokemon data
vi.mock('~/components/Dex/Entry', () => ({
  DexEntry: ({ pokemonId }: { pokemonId: number }) => (
    <div data-testid={`dex-entry-${pokemonId}`}>Pokemon {pokemonId}</div>
  ),
}));

describe('BoxView rendering', () => {
  const defaultProps = {
    gameDex: GameDex.LGPE_KANTO,
  };

  it('renders box headers with correct ranges', () => {
    // 35 Pokemon should create 2 boxes
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

  it('renders nothing when Pokemon list is empty', () => {
    render(
      <BoxView {...defaultProps} pokemonIds={[]} filteredIds={new Set()} />
    );

    expect(screen.queryByText(/Box/)).not.toBeInTheDocument();
  });

  it('passes respectGenerationBoundaries to box calculation', () => {
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

    // Should be two boxes due to generation boundary
    expect(screen.getByText('Box 1: 1-2')).toBeInTheDocument();
    expect(screen.getByText('Box 2: 3-4')).toBeInTheDocument();
  });
});
