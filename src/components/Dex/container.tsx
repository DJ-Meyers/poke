import {
  getDexInfo,
  getDexesForGame,
  type Game,
  type GameDex,
} from '~/utils/dex-data';
import { useDexProgress } from '~/data/dex-progress';
import { DexView } from './view';
import { DexGridView } from './Grid/view';

interface DexContainerProps {
  game: Game;
  currentDex: GameDex;
}

/**
 * Container for the full Dex page.
 * DexEntry components handle their own callbacks via useDexEntryCallbacks hook.
 */
export function DexContainer({ game, currentDex }: DexContainerProps) {
  const dexes = getDexesForGame({ game });
  const dexInfo = getDexInfo({ gameDex: currentDex });
  const { caughtIdsByDex } = useDexProgress();
  const dexCaughtIds = caughtIdsByDex[currentDex];

  return (
    <DexView
      game={game}
      dexes={dexes}
      currentDex={currentDex}
      totalCount={dexInfo.pokemonIds.length}
      caughtCount={dexCaughtIds.size}
    >
      <DexGridView
        pokemonIds={dexInfo.pokemonIds}
        caughtIds={dexCaughtIds}
        gameDex={currentDex}
      />
    </DexView>
  );
}
