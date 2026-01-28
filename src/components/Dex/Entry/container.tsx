import { useSuspenseGetPokemonById } from '~/data/pokemon';
import type { OriginMark } from './origin-marks';
import { DexEntryView } from './view';

interface DexEntryContainerProps {
  pokemonId: number;
  isComplete: boolean;
  onClick?: (id: number) => void;
  onContextMenu?: (id: number) => void;
  /** 1-indexed regional dex number. If undefined, only national number is shown. */
  regionalDexNumber?: number;
  /** Origin marks showing which games this Pokémon appears in. */
  originMarks?: OriginMark[];
}

/**
 * Container component that reads Pokemon data from the React Query cache.
 * Uses useSuspenseQuery — a parent Suspense boundary handles loading state.
 */
export function DexEntryContainer({
  pokemonId,
  isComplete,
  onClick,
  onContextMenu,
  regionalDexNumber,
  originMarks,
}: DexEntryContainerProps) {
  const { data: pokemon } = useSuspenseGetPokemonById({ id: pokemonId });

  return (
    <DexEntryView
      pokemon={pokemon}
      isComplete={isComplete}
      onClick={onClick}
      onContextMenu={onContextMenu}
      regionalDexNumber={regionalDexNumber}
      originMarks={originMarks}
    />
  );
}
