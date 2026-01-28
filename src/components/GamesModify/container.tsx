import { useNavigate } from 'react-router';
import { getAllGamesInfo, type Game } from '~/utils/dex-data';
import {
  useSelectedGames,
  useToggleGameSelection,
} from '~/data/selected-games';
import { GamesModifyView } from './view';

export function GamesModifyContainer() {
  const games = getAllGamesInfo();
  const { selectedGames } = useSelectedGames();
  const selectedGamesSet = new Set(selectedGames);
  const toggleGame = useToggleGameSelection();
  const navigate = useNavigate();

  const handleToggleGame = (game: Game) => {
    toggleGame.mutate({ game });
  };

  const handleContextMenu = (game: Game) => {
    navigate(`/dex/games/${game.toLowerCase()}`);
  };

  return (
    <GamesModifyView
      games={games}
      selectedGames={selectedGamesSet}
      onToggleGame={handleToggleGame}
      onContextMenu={handleContextMenu}
    />
  );
}
