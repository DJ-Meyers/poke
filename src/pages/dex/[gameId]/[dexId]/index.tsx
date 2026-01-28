import { Dex } from '~/components/Dex';
import { useGameDexParams } from '~/utils/route-params';

/**
 * Page component for /dex/:gameId/:dexId routes.
 * The loader handles param validation and redirects.
 * This component assumes the loader has validated the params.
 */
export function DexDetailPage() {
  const { game, gameDex } = useGameDexParams();

  // Key forces remount when dex changes, resetting caught state
  return <Dex key={gameDex} game={game} currentDex={gameDex} />;
}
