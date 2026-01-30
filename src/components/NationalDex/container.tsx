import { useCallback, useMemo, useState } from 'react';
import type { Game } from '../../../data/dex';
import { GameDex } from '~/utils/dex-data';
import { getNationalDexPokemonIds } from '~/utils/national-dex';
import { pokemonToGames } from '~/utils/national-dex-origin-marks';
import { useDexProgress } from '~/data/dex-progress';
import { NationalDexView } from './view';

export function NationalDexContainer() {
  const pokemonIds = getNationalDexPokemonIds();
  const { caughtIdsByDex } = useDexProgress();
  const caughtIds = caughtIdsByDex[GameDex.NATIONAL];

  const [selectedGames, setSelectedGames] = useState<Set<Game>>(new Set());

  const handleToggleGame = useCallback((game: Game) => {
    setSelectedGames((prev) => {
      const next = new Set(prev);
      if (next.has(game)) {
        next.delete(game);
      } else {
        next.add(game);
      }
      return next;
    });
  }, []);

  const filteredPokemonIds = useMemo(() => {
    if (selectedGames.size === 0) return pokemonIds;
    return pokemonIds.filter((id) => {
      const games = pokemonToGames.get(id);
      if (!games) return false;
      return games.some((g) => selectedGames.has(g));
    });
  }, [pokemonIds, selectedGames]);

  const filteredCaughtIds = useMemo(() => {
    if (selectedGames.size === 0) return caughtIds;
    const filtered = new Set<number>();
    for (const id of caughtIds) {
      const games = pokemonToGames.get(id);
      if (games && games.some((g) => selectedGames.has(g))) {
        filtered.add(id);
      }
    }
    return filtered;
  }, [caughtIds, selectedGames]);

  return (
    <NationalDexView
      pokemonIds={filteredPokemonIds}
      caughtIds={filteredCaughtIds}
      selectedGames={selectedGames}
      onToggleGame={handleToggleGame}
    />
  );
}
