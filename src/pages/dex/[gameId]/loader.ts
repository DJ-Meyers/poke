/**
 * Loader for the /dex/:gameId route.
 * Always redirects to the default dex for the game.
 */

import { redirect, type LoaderFunctionArgs } from 'react-router';
import { parseGameParam, getDefaultDexUrlId } from '~/utils/route-params';

export function gameDexLoader({ params }: LoaderFunctionArgs): Response {
  const { gameId } = params;

  // Parse and validate game param
  const game = gameId ? parseGameParam({ gameId }) : undefined;

  if (!game) {
    // Invalid game ID, redirect to games list
    return redirect('/dex');
  }

  // Always redirect to the default dex for consistent navigation
  const defaultDexUrl = getDefaultDexUrlId({ game });
  return redirect(`/dex/${gameId}/${defaultDexUrl}`);
}
