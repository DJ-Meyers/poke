import { Link } from 'react-router';
import type { Game, GameDex } from '~/utils/dex-data';
import { getDexDisplayName, getGameDisplayName } from '~/utils/dex-data';
import { getDexUrlId } from '~/utils/route-params';
import { AppLayout } from '~/components/ui';

interface DexViewProps {
  game: Game;
  dexes: GameDex[];
  currentDex: GameDex;
  totalCount: number;
  caughtCount: number;
  children: React.ReactNode;
}

/**
 * Layout component for a Dex page.
 * Renders navigation links between dexes and a progress summary above the grid.
 */
export const DexView = ({
  game,
  dexes,
  currentDex,
  totalCount,
  caughtCount,
  children,
}: DexViewProps) => {
  const subheader = dexes.map((dex) => {
    const isActive = currentDex === dex;
    return (
      <Link
        key={dex}
        to={`/dex/${game.toLowerCase()}/${getDexUrlId({ gameDex: dex })}`}
        className={`flex-1 px-4 py-3 text-center text-sm font-medium transition-colors border-b-2 ${
          isActive
            ? 'text-primary border-primary bg-surface-hover'
            : 'text-text-muted border-transparent hover:text-text hover:bg-surface-hover'
        }`}
      >
        {getDexDisplayName({ gameDex: dex })}
      </Link>
    );
  });

  return (
    <AppLayout
      title={getGameDisplayName({ game })}
      backTo="/dex"
      progress={{ current: caughtCount, total: totalCount }}
      subheader={subheader}
    >
      {children}
    </AppLayout>
  );
};
