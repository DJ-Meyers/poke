import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useDexProgress, useToggleDexCaught } from '~/data/dex-progress';
import { getDexUrlId } from '~/utils/route-params';
import { pokemonToGames } from '~/utils/national-dex-origin-marks';
import {
  GameDex,
  getPokemonIdsByDex,
  getGameForDex,
  isNationalDex,
  type GameDex as GameDexType,
} from '~/utils/dex-data';
import type { OriginMark } from './origin-marks';

const pokemonIdsByDex = getPokemonIdsByDex();

/**
 * Hook that provides callbacks and state for a DexEntry.
 * Handles both regular game dexes and the National Dex.
 */
export const useDexEntryCallbacks = (
  pokemonId: number,
  gameDex: GameDexType
) => {
  const navigate = useNavigate();
  const isNational = isNationalDex(gameDex);

  const toggleMutation = useToggleDexCaught();
  const { caughtIdsByDex, caughtIdsByGame } = useDexProgress();

  const dexCaughtIds = caughtIdsByDex[gameDex];
  const isComplete = dexCaughtIds.has(pokemonId);

  const pokemonIds = pokemonIdsByDex[gameDex];
  const regionalDexNumber = pokemonIds.indexOf(pokemonId) + 1;

  // Compute origin marks for National Dex
  const originMarks = useMemo((): OriginMark[] | undefined => {
    if (!isNational) return undefined;

    const homeMark: OriginMark = {
      game: 'HOME',
      caught: caughtIdsByDex[GameDex.NATIONAL].has(pokemonId),
    };
    const games = pokemonToGames.get(pokemonId);
    if (!games) return [homeMark];

    return [
      homeMark,
      ...games.map((game) => ({
        game,
        caught: caughtIdsByGame[game]?.has(pokemonId) ?? false,
      })),
    ];
  }, [isNational, caughtIdsByDex, caughtIdsByGame, pokemonId]);

  const toggleCaught = useCallback(() => {
    toggleMutation.mutate({ gameDex, pokemonId });
  }, [toggleMutation, gameDex, pokemonId]);

  const viewDetails = useCallback(() => {
    if (isNational) {
      navigate(`/dex/national/${pokemonId}`);
    } else {
      const game = getGameForDex({ gameDex });
      const dexUrlId = getDexUrlId({ gameDex });
      navigate(`/dex/${game.toLowerCase()}/${dexUrlId}/${pokemonId}`);
    }
  }, [isNational, navigate, gameDex, pokemonId]);

  return {
    isComplete,
    regionalDexNumber,
    originMarks,
    toggleCaught,
    viewDetails,
  };
};
