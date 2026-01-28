import { useNavigate } from 'react-router';
import { useAllGamesProgress } from '~/data/dex-progress';
import { useSelectedGames } from '~/data/selected-games';
import { GamesView } from './view';

export function GamesContainer() {
  const { games, nationalDexProgress } = useAllGamesProgress();
  const { selectedGames } = useSelectedGames();
  const selectedSet = new Set(selectedGames);
  const navigate = useNavigate();

  const activeGames = games.filter((g) => selectedSet.has(g.game));

  const handleGameContextMenu = (game: string) => {
    navigate(`/dex/manage/${game.toLowerCase()}`);
  };

  return (
    <GamesView
      games={activeGames}
      nationalDexProgress={nationalDexProgress}
      onGameContextMenu={handleGameContextMenu}
    />
  );
}
