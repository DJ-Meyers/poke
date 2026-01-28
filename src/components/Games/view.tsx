import { Link, Outlet } from 'react-router';
import type { GameProgressInfo } from '~/data/dex-progress';

interface NationalDexProgressInfo {
  caughtCount: number;
  totalCount: number;
}
import { AppLayout, ProgressBar, ProgressInfo } from '~/components/ui';

// Game cover images
import lgpeCover from '~/assets/game-covers/LGPE.avif';
import swshCover from '~/assets/game-covers/SWSH.avif';
import bdspCover from '~/assets/game-covers/BDSP.avif';
import plaCover from '~/assets/game-covers/PLA.avif';
import svCover from '~/assets/game-covers/SV.avif';
import plzaCover from '~/assets/game-covers/PLZA.avif';

const GAME_COVERS: Record<string, string> = {
  LGPE: lgpeCover,
  SWSH: swshCover,
  BDSP: bdspCover,
  PLA: plaCover,
  SV: svCover,
  PLZA: plzaCover,
};

interface GameCardProps {
  game: GameProgressInfo;
  onContextMenu: () => void;
}

function GameCard({ game, onContextMenu }: GameCardProps) {
  const coverImage = GAME_COVERS[game.game];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu();
  };

  return (
    <Link
      to={`/dex/${game.game.toLowerCase()}`}
      className="block h-full"
      onContextMenu={handleContextMenu}
    >
      <div className="relative bg-surface hover:bg-surface-hover rounded-xl overflow-hidden transition-colors h-full flex flex-col">
        {/* Game cover image - bleeds to edges */}
        <div className="relative h-36 w-full">
          <img
            src={coverImage}
            alt={game.displayName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Game info - fixed height to accommodate 2 lines */}
        <div className="px-4 py-3 mt-auto">
          <h3 className="font-semibold text-text text-center mb-2 min-h-[2.5rem] flex items-center justify-center">
            {game.displayName}
          </h3>

          {/* Progress info */}
          <div className="mb-1.5">
            <ProgressInfo
              current={game.caughtCount}
              total={game.totalCount}
              size="xs"
            />
          </div>

          {/* Progress bar */}
          <ProgressBar value={game.caughtCount} max={game.totalCount} />
        </div>
      </div>
    </Link>
  );
}

interface GamesViewProps {
  games: GameProgressInfo[];
  nationalDexProgress: NationalDexProgressInfo;
  onGameContextMenu: (game: string) => void;
}

export function GamesView({
  games,
  nationalDexProgress,
  onGameContextMenu,
}: GamesViewProps) {
  const subheader = (
    <Link
      to="/dex/national"
      className="flex-1 px-4 py-3 text-center text-sm font-medium transition-colors border-b-2 border-transparent text-text-muted hover:text-text hover:bg-surface-hover"
    >
      National Dex
    </Link>
  );

  return (
    <AppLayout
      title="Living Dex Tracker"
      progress={{
        current: nationalDexProgress.caughtCount,
        total: nationalDexProgress.totalCount,
      }}
      subheader={subheader}
    >
      <div className="p-4 space-y-4">
        {/* Games grid */}
        <div className="grid grid-cols-2 gap-3 items-stretch">
          {games.map((game) => (
            <GameCard
              key={game.game}
              game={game}
              onContextMenu={() => onGameContextMenu(game.game)}
            />
          ))}
        </div>

        {/* Manage games link */}
        <Link
          to="/dex/games"
          className="block text-center text-primary hover:text-primary-hover py-3 transition-colors"
        >
          Manage Games
        </Link>
      </div>

      <Outlet />
    </AppLayout>
  );
}
