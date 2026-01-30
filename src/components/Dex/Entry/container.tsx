import { Suspense } from 'react';
import { useSuspenseGetPokemonById } from '~/data/pokemon';
import type { GameDex } from '~/utils/dex-data';
import { DexEntryView } from './view';
import { DexEntryPlaceholder } from './Placeholder';
import { DexEntryErrorBoundary } from './ErrorBoundary';
import { useDexEntryCallbacks } from './use-dex-entry-callbacks';

interface DexEntryProps {
  pokemonId: number;
  gameDex: GameDex;
}

function DexEntryFetcher({ pokemonId, gameDex }: DexEntryProps) {
  const { data: pokemon } = useSuspenseGetPokemonById({ id: pokemonId });
  const {
    isComplete,
    regionalDexNumber,
    originMarks,
    toggleCaught,
    viewDetails,
  } = useDexEntryCallbacks(pokemonId, gameDex);

  return (
    <DexEntryView
      pokemon={pokemon}
      isComplete={isComplete}
      onPrimaryAction={toggleCaught}
      onSecondaryAction={viewDetails}
      regionalDexNumber={regionalDexNumber}
      originMarks={originMarks}
    />
  );
}

/**
 * DexEntry component that handles data fetching, Suspense, and error boundaries internally.
 * Pass a gameDex (including GameDex.NATIONAL for the National Dex) to determine behavior.
 */
export function DexEntry({ pokemonId, gameDex }: DexEntryProps) {
  return (
    <DexEntryErrorBoundary pokemonId={pokemonId}>
      <Suspense fallback={<DexEntryPlaceholder />}>
        <DexEntryFetcher pokemonId={pokemonId} gameDex={gameDex} />
      </Suspense>
    </DexEntryErrorBoundary>
  );
}
