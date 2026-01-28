import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  getDexInfo,
  getDexesForGame,
  type Game,
  type GameDex,
} from '~/utils/dex-data';
import { getDexUrlId } from '~/utils/route-params';
import { useDexProgress, useToggleDexCaught } from '~/data/dex-progress';
import { DexView } from './view';
import { DexGridView } from './Grid/view';

interface DexContainerProps {
  game: Game;
  currentDex: GameDex;
}

/**
 * Container for the full Dex page.
 * Manages caught state and renders navigation + grid.
 */
export function DexContainer({ game, currentDex }: DexContainerProps) {
  const navigate = useNavigate();
  const dexes = getDexesForGame({ game });
  const dexInfo = getDexInfo({ gameDex: currentDex });

  const { caughtIds } = useDexProgress({ gameDex: currentDex });
  const caughtIdsSet = useMemo(() => new Set(caughtIds), [caughtIds]);
  const toggleCaught = useToggleDexCaught();

  const handleToggleCaught = (pokemonId: number) => {
    toggleCaught.mutate({ gameDex: currentDex, pokemonId });
  };

  const handleContextMenu = (pokemonId: number) => {
    const dexUrlId = getDexUrlId({ gameDex: currentDex });
    navigate(`/dex/${game.toLowerCase()}/${dexUrlId}/${pokemonId}`);
  };

  return (
    <DexView
      game={game}
      dexes={dexes}
      currentDex={currentDex}
      totalCount={dexInfo.pokemonIds.length}
      caughtCount={caughtIdsSet.size}
    >
      <DexGridView
        pokemonIds={dexInfo.pokemonIds}
        caughtIds={caughtIdsSet}
        onToggleCaught={handleToggleCaught}
        onContextMenu={handleContextMenu}
      />
    </DexView>
  );
}
