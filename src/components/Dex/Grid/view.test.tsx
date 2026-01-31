import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DexGridView } from './view';
import { GameDex } from '~/utils/dex-data';

// Mock react-virtuoso to avoid scroll-parent complexity
vi.mock('react-virtuoso', () => ({
  VirtuosoGrid: () => <div data-testid="virtuoso-grid" />,
}));

// Mock DexEntry to avoid fetching Pokemon data
vi.mock('~/components/Dex/Entry', () => ({
  DexEntry: () => <div data-testid="dex-entry" />,
}));

// Mock BoxView to verify it renders when toggled
vi.mock('./BoxView', () => ({
  BoxView: () => <div data-testid="box-view" />,
}));

// pokemonIds: bulbasaur(1), charmander(4), pikachu(25), gengar(94)
const defaultProps = {
  pokemonIds: [1, 4, 25, 94],
  caughtIds: new Set<number>(),
  gameDex: GameDex.LGPE_KANTO,
};

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

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

    const input = screen.getByPlaceholderText('Name or Number');
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

    const hideButton = screen.getByRole('button', {
      name: 'Toggle hide completed',
    });
    await user.click(hideButton);

    expect(
      screen.getByText('All Pokemon in this dex are caught!')
    ).toBeInTheDocument();
  });

  it('shows search message when both filters active but search is the reason', async () => {
    const user = userEvent.setup();
    render(<DexGridView {...defaultProps} caughtIds={new Set([1])} />);

    // Enable hide completed
    const hideButton = screen.getByRole('button', {
      name: 'Toggle hide completed',
    });
    await user.click(hideButton);

    // Type a search that matches nothing
    const input = screen.getByPlaceholderText('Name or Number');
    await user.type(input, 'zzzzz');

    expect(
      screen.getByText('No Pokemon found matching your search')
    ).toBeInTheDocument();
  });
});

describe('DexGridView box view toggle', () => {
  it('shows grid view by default (no box view)', () => {
    render(<DexGridView {...defaultProps} />);

    // Box view should not be rendered by default
    expect(screen.queryByTestId('box-view')).not.toBeInTheDocument();
  });

  it('switches to box view when toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<DexGridView {...defaultProps} />);

    const boxViewButton = screen.getByRole('button', {
      name: 'Toggle box view',
    });
    await user.click(boxViewButton);

    expect(screen.getByTestId('box-view')).toBeInTheDocument();
  });

  it('switches back to grid view when toggle is clicked again', async () => {
    const user = userEvent.setup();
    render(<DexGridView {...defaultProps} />);

    const boxViewButton = screen.getByRole('button', {
      name: 'Toggle box view',
    });
    await user.click(boxViewButton);
    expect(screen.getByTestId('box-view')).toBeInTheDocument();

    await user.click(boxViewButton);
    expect(screen.queryByTestId('box-view')).not.toBeInTheDocument();
  });
});

describe('DexGridView localStorage persistence', () => {
  it('persists hideCompleted to localStorage', async () => {
    const user = userEvent.setup();
    render(<DexGridView {...defaultProps} />);

    const hideButton = screen.getByRole('button', {
      name: 'Toggle hide completed',
    });
    await user.click(hideButton);

    expect(localStorage.getItem('dex:hideCompleted')).toBe('true');
  });

  it('persists showBoxView to localStorage', async () => {
    const user = userEvent.setup();
    render(<DexGridView {...defaultProps} />);

    const boxViewButton = screen.getByRole('button', {
      name: 'Toggle box view',
    });
    await user.click(boxViewButton);

    expect(localStorage.getItem('dex:showBoxView')).toBe('true');
  });

  it('restores hideCompleted from localStorage on mount', () => {
    localStorage.setItem('dex:hideCompleted', 'true');

    render(
      <DexGridView {...defaultProps} caughtIds={new Set([1, 4, 25, 94])} />
    );

    // All Pokemon are caught and hideCompleted is true from localStorage
    expect(
      screen.getByText('All Pokemon in this dex are caught!')
    ).toBeInTheDocument();
  });

  it('restores showBoxView from localStorage on mount', () => {
    localStorage.setItem('dex:showBoxView', 'true');

    render(<DexGridView {...defaultProps} />);

    expect(screen.getByTestId('box-view')).toBeInTheDocument();
    expect(screen.queryByTestId('virtuoso-grid')).not.toBeInTheDocument();
  });

  it('handles missing localStorage values gracefully', () => {
    // localStorage is already cleared in beforeEach
    render(<DexGridView {...defaultProps} />);

    // Should default to grid view (no box view)
    expect(screen.queryByTestId('box-view')).not.toBeInTheDocument();
  });

  it('updates localStorage when toggling off', async () => {
    localStorage.setItem('dex:showBoxView', 'true');
    const user = userEvent.setup();

    render(<DexGridView {...defaultProps} />);

    const boxViewButton = screen.getByRole('button', {
      name: 'Toggle box view',
    });
    await user.click(boxViewButton);

    expect(localStorage.getItem('dex:showBoxView')).toBe('false');
  });
});
