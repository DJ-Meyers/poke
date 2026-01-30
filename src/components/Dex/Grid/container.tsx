import { getDexInfo, type GameDex } from '~/utils/dex-data';
import { useDexProgress } from '~/data/dex-progress';
import { DexGridView } from './view';

interface DexGridContainerProps {
  gameDex: GameDex;
}

/**
 * Container that manages Pokemon caught state for the grid view.
 */
export const DexGridContainer = ({ gameDex }: DexGridContainerProps) => {
  const dexInfo = getDexInfo({ gameDex });
  const { caughtIdsByDex } = useDexProgress();

  return (
    <DexGridView
      pokemonIds={dexInfo.pokemonIds}
      caughtIds={caughtIdsByDex[gameDex]}
      gameDex={gameDex}
    />
  );
};
