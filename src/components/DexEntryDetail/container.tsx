import type { Game, GameDex } from '~/utils/dex-data';
import {
  useGetPokemonById,
  useGetPokemonSpeciesById,
  useGetPokemonLocationAreaById,
} from '~/data/pokemon';
import { DexEntryDetailView } from './view';

interface DexEntryDetailContainerProps {
  pokemonId: number;
  game?: Game;
  gameDex?: GameDex;
  /** 1-indexed regional dex number */
  regionalDexNumber: number;
}

/**
 * Container that reads Pokemon and Species data from the React Query cache.
 * The loader ensures Pokemon data is cached before this component renders.
 */
export const DexEntryDetailContainer = ({
  pokemonId,
  game,
  gameDex,
  regionalDexNumber,
}: DexEntryDetailContainerProps) => {
  const { data: pokemon } = useGetPokemonById({ id: pokemonId });
  const { data: species } = useGetPokemonSpeciesById({ id: pokemonId });
  const { data: locationAreas } = useGetPokemonLocationAreaById({
    id: pokemonId,
  });

  // Data is guaranteed in cache from the loader, but satisfy the type system
  if (!pokemon) {
    return null;
  }

  return (
    <DexEntryDetailView
      pokemon={pokemon}
      species={species ?? null}
      locationAreas={locationAreas ?? []}
      game={game}
      gameDex={gameDex}
      regionalDexNumber={regionalDexNumber}
    />
  );
};
