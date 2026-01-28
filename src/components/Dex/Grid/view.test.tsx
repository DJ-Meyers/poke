import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DexGridView } from './view';

// Mock react-virtuoso to avoid scroll-parent complexity
vi.mock('react-virtuoso', () => ({
  VirtuosoGrid: () => <div data-testid="virtuoso-grid" />,
}));

// Mock DexEntry to avoid fetching Pokemon data
vi.mock('~/components/Dex/Entry', () => ({
  DexEntry: () => <div data-testid="dex-entry" />,
}));

// pokemonIds: bulbasaur(1), charmander(4), pikachu(25), gengar(94)
const defaultProps = {
  pokemonIds: [1, 4, 25, 94],
  caughtIds: new Set<number>(),
};

describe('DexGridView empty state', () => {
  it('does not show empty-state message when results exist', () => {
    render(<DexGridView {...defaultProps} />);

    expect(
      screen.queryByText('No Pokemon found matching your search')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('All Pokemon in this dex are caught!')
    ).not.toBeInTheDocument();
  });

  it('shows search message when search yields nothing', async () => {
    const user = userEvent.setup();
    render(<DexGridView {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search by name or number');
    await user.type(input, 'zzzzz');

    expect(
      screen.getByText('No Pokemon found matching your search')
    ).toBeInTheDocument();
  });

  it('shows caught message when hideCompleted is on and all are caught', async () => {
    const user = userEvent.setup();
    render(
      <DexGridView {...defaultProps} caughtIds={new Set([1, 4, 25, 94])} />
    );

    const hideButton = screen.getByRole('button', { name: 'Hide completed' });
    await user.click(hideButton);

    expect(
      screen.getByText('All Pokemon in this dex are caught!')
    ).toBeInTheDocument();
  });

  it('shows search message when both filters active but search is the reason', async () => {
    const user = userEvent.setup();
    render(<DexGridView {...defaultProps} caughtIds={new Set([1])} />);

    // Enable hide completed
    const hideButton = screen.getByRole('button', { name: 'Hide completed' });
    await user.click(hideButton);

    // Type a search that matches nothing
    const input = screen.getByPlaceholderText('Search by name or number');
    await user.type(input, 'zzzzz');

    expect(
      screen.getByText('No Pokemon found matching your search')
    ).toBeInTheDocument();
  });
});
