import { useNavigate } from 'react-router';
import { getAllGames, getAllGamesInfo, type Game } from '~/utils/dex-data';
import {
  useSelectedGames,
  useSetSelectedGames,
  useToggleGameSelection,
} from '~/data/selected-games';
import { GamesModifyView } from './view';

export const GamesModifyContainer = () => {
  const games = getAllGamesInfo();
  const { selectedGames } = useSelectedGames();
  const selectedGamesSet = new Set(selectedGames);
  const toggleGame = useToggleGameSelection();
  const setGames = useSetSelectedGames();
  const navigate = useNavigate();

  const handleToggleGame = (game: Game) => {
    toggleGame.mutate({ game });
  };

  const handleToggleAll = () => {
    const allGames = getAllGames();
    const allSelected = selectedGamesSet.size === allGames.length;
    setGames.mutate({ games: allSelected ? [] : allGames });
  };

  const handleViewGame = (game: Game) => {
    navigate(`/dex/games/${game.toLowerCase()}`);
  };

  return (
    <GamesModifyView
      games={games}
      selectedGames={selectedGamesSet}
      onPrimaryAction={handleToggleGame}
      onToggleAll={handleToggleAll}
      onSecondaryAction={handleViewGame}
    />
  );
};
