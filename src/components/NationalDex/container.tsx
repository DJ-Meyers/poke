import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import type { Game } from '../../../data/dex';
import { getNationalDexPokemonIds } from '~/utils/national-dex';
import { pokemonToGames } from '~/utils/national-dex-origin-marks';
import {
  useNationalDexDerived,
  useToggleHomeCaught,
} from '~/data/national-dex-progress';
import type { OriginMark } from '~/components/Dex/Entry/origin-marks';
import { NationalDexView } from './view';

export function NationalDexContainer() {
  const navigate = useNavigate();
  const pokemonIds = getNationalDexPokemonIds();

  const { caughtIds, caughtByGame } = useNationalDexDerived();
  const toggleHome = useToggleHomeCaught();

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

  const getOriginMarks = useCallback(
    (pokemonId: number): OriginMark[] => {
      const homeMark: OriginMark = {
        game: 'HOME',
        caught: caughtIds.has(pokemonId),
      };

      const games = pokemonToGames.get(pokemonId);
      if (!games) return [homeMark];

      const gameMarks: OriginMark[] = games.map((game) => ({
        game,
        caught: caughtByGame.get(game)?.has(pokemonId) ?? false,
      }));

      return [homeMark, ...gameMarks];
    },
    [caughtIds, caughtByGame]
  );

  const handleToggleCaught = useCallback(
    (pokemonId: number) => {
      toggleHome.mutate({ pokemonId });
    },
    [toggleHome]
  );

  const handleViewPokemon = useCallback(
    (pokemonId: number) => {
      navigate(`/dex/national/${pokemonId}`);
    },
    [navigate]
  );

  return (
    <NationalDexView
      pokemonIds={filteredPokemonIds}
      caughtIds={filteredCaughtIds}
      selectedGames={selectedGames}
      onToggleGame={handleToggleGame}
      onPrimaryAction={handleToggleCaught}
      onSecondaryAction={handleViewPokemon}
      getOriginMarks={getOriginMarks}
    />
  );
}
