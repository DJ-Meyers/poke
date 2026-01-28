import type { Game } from '~/utils/dex-data';
import type { DexProgressInfo } from '~/data/dex-progress';
import { getDexUrlId } from '~/utils/route-params';
import { AppLayout, NavCard } from '~/components/ui';

interface GameOverviewViewProps {
  gameDisplayName: string;
  game: Game;
  dexes: DexProgressInfo[];
  totalCaughtCount: number;
  totalPokemonCount: number;
}

export function GameOverviewView({
  gameDisplayName,
  game,
  dexes,
  totalCaughtCount,
  totalPokemonCount,
}: GameOverviewViewProps) {
  return (
    <AppLayout
      title={gameDisplayName}
      backTo="/dex"
      progress={{ current: totalCaughtCount, total: totalPokemonCount }}
    >
      <div className="p-4">
        <h2 className="text-lg font-medium text-text-muted mb-4">
          Choose a Pokédex
        </h2>
        <div className="space-y-3">
          {dexes.map((dex) => (
            <NavCard
              key={dex.gameDex}
              to={`/dex/${game.toLowerCase()}/${getDexUrlId({ gameDex: dex.gameDex })}`}
              title={dex.displayName}
              progress={{ current: dex.caughtCount, total: dex.totalCount }}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
