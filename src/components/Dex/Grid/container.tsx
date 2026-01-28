import { useState } from 'react';
import { getDexInfo, type GameDex } from '~/utils/dex-data';
import { getProgressForDex, toggleCaughtForDex } from '~/utils/dex-progress';
import { DexGridView } from './view';

interface DexGridContainerProps {
  gameDex: GameDex;
}

/**
 * Container that manages Pokemon caught state and provides toggle callback.
 */
export function DexGridContainer({ gameDex }: DexGridContainerProps) {
  const dexInfo = getDexInfo({ gameDex });

  const [caughtIds, setCaughtIds] = useState<Set<number>>(() => {
    return new Set(getProgressForDex({ gameDex }));
  });

  const handleToggleCaught = (pokemonId: number) => {
    const isNowCaught = toggleCaughtForDex({ gameDex, pokemonId });
    setCaughtIds((prev) => {
      const next = new Set(prev);
      if (isNowCaught) {
        next.add(pokemonId);
      } else {
        next.delete(pokemonId);
      }
      return next;
    });
  };

  return (
    <DexGridView
      pokemonIds={dexInfo.pokemonIds}
      caughtIds={caughtIds}
      onToggleCaught={handleToggleCaught}
    />
  );
}
