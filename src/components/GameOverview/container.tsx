import type { Game } from '~/utils/dex-data';
import { getGameInfo } from '~/utils/dex-data';
import { useGameProgress, useDexProgressInfo } from '~/data/dex-progress';
import { GameOverviewView } from './view';

interface GameOverviewContainerProps {
  game: Game;
}

export function GameOverviewContainer({ game }: GameOverviewContainerProps) {
  const gameInfo = getGameInfo({ game });
  const { caughtCount, totalCount } = useGameProgress({ game });
  const { dexProgressInfo } = useDexProgressInfo({ game });

  return (
    <GameOverviewView
      gameDisplayName={gameInfo.displayName}
      game={game}
      dexes={dexProgressInfo}
      totalCaughtCount={caughtCount}
      totalPokemonCount={totalCount}
    />
  );
}
