import { useNavigate } from 'react-router';
import { getDexesForGame, type GameDex } from '~/utils/dex-data';
import { useGameParam } from '~/utils/route-params';
import {
  useCompleteDex,
  useResetDex,
  useDexProgressInfo,
} from '~/data/dex-progress';
import { DexManageModalView } from './view';

export function DexManageModalContainer() {
  const game = useGameParam();
  const dexes = getDexesForGame({ game });
  const { dexProgressInfo } = useDexProgressInfo({ game });
  const completeDex = useCompleteDex();
  const resetDex = useResetDex();
  const navigate = useNavigate();

  const handleCompleteDex = (gameDex: GameDex) => {
    completeDex.mutate({ gameDex });
  };

  const handleResetDex = (gameDex: GameDex) => {
    resetDex.mutate({ gameDex });
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <DexManageModalView
      game={game}
      dexes={dexes}
      dexProgressInfo={dexProgressInfo}
      onCompleteDex={handleCompleteDex}
      onResetDex={handleResetDex}
      onClose={handleClose}
    />
  );
}
