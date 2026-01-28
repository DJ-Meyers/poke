import { redirect, type LoaderFunctionArgs } from 'react-router';
import { parseGameParam } from '~/utils/route-params';

export function gamesModifyGameLoader({
  params,
}: LoaderFunctionArgs): Response | null {
  const { gameId } = params;
  const game = gameId ? parseGameParam({ gameId }) : undefined;

  if (!game) {
    return redirect('/dex/games');
  }

  return null;
}
