/**
 * Utilities for managing which games the user has selected to track.
 */

import { Game, getAllGames } from './dex-data';

const STORAGE_KEY = 'selected_games';

/**
 * Returns the list of games the user has selected to track.
 * Defaults to all games if none are selected.
 */
export function getSelectedGames(): Game[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return getAllGames();
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return getAllGames();
    }
    // Filter to only valid game values
    const validGames = new Set(getAllGames());
    return parsed.filter((game): game is Game => validGames.has(game));
  } catch {
    return getAllGames();
  }
}

/**
 * Checks if a specific game is selected.
 */
export function isGameSelected({ game }: { game: Game }): boolean {
  return getSelectedGames().includes(game);
}

/**
 * Sets the list of selected games.
 */
export function setSelectedGames({ games }: { games: Game[] }): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

/**
 * Toggles a game's selection status.
 * Returns the new selection status.
 */
export function toggleGameSelection({ game }: { game: Game }): boolean {
  const selected = getSelectedGames();
  const index = selected.indexOf(game);

  if (index === -1) {
    selected.push(game);
    setSelectedGames({ games: selected });
    return true;
  } else {
    selected.splice(index, 1);
    setSelectedGames({ games: selected });
    return false;
  }
}
