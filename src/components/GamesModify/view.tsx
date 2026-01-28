import { Outlet } from 'react-router';
import type { Game, GameInfo } from '~/utils/dex-data';
import { AppLayout } from '~/components/ui';

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
  game: GameInfo;
  isSelected: boolean;
  onToggle: () => void;
  onContextMenu: () => void;
}

function GameCard({
  game,
  isSelected,
  onToggle,
  onContextMenu,
}: GameCardProps) {
  const coverImage = GAME_COVERS[game.game];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu();
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      onContextMenu={handleContextMenu}
      className={`w-full flex items-center gap-4 rounded-xl overflow-hidden transition-all cursor-pointer ${
        isSelected
          ? 'bg-surface hover:bg-surface-hover'
          : 'bg-surface/40 opacity-50 hover:opacity-70'
      }`}
    >
      <img
        src={coverImage}
        alt={game.displayName}
        className="h-24 w-24 object-cover flex-shrink-0"
      />
      <span className="font-semibold text-text flex-1 text-left">
        {game.displayName}
      </span>
      <div className="pr-4">
        <div
          className={`w-5 h-5 rounded-md border-2 transition-colors flex items-center justify-center ${
            isSelected ? 'bg-primary border-primary' : 'border-text-muted'
          }`}
        >
          {isSelected && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

interface GamesModifyViewProps {
  games: GameInfo[];
  selectedGames: Set<Game>;
  onToggleGame: (game: Game) => void;
  onContextMenu: (game: Game) => void;
}

export function GamesModifyView({
  games,
  selectedGames,
  onToggleGame,
  onContextMenu,
}: GamesModifyViewProps) {
  const reversedGames = [...games].reverse();

  return (
    <AppLayout title="Manage Games" backTo="/dex">
      <div className="p-4 space-y-3">
        {reversedGames.map((gameInfo) => (
          <GameCard
            key={gameInfo.game}
            game={gameInfo}
            isSelected={selectedGames.has(gameInfo.game)}
            onToggle={() => onToggleGame(gameInfo.game)}
            onContextMenu={() => onContextMenu(gameInfo.game)}
          />
        ))}
      </div>

      <Outlet />
    </AppLayout>
  );
}
