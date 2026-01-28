/**
 * Builds a mapping from each Pokémon ID to the games it appears in.
 * Iterates all game dexes once. The result is static data.
 */

import { type Game, DEX_DATA } from '../../data/dex';
import type { GameDex } from '../../data/dex';

export function buildPokemonToGamesMap(): Map<number, Game[]> {
  const map = new Map<number, Game[]>();

  for (const dex of Object.values(DEX_DATA) as (typeof DEX_DATA)[GameDex][]) {
    const game = dex.game;
    for (const id of dex.pokemonIds) {
      const games = map.get(id);
      if (games) {
        if (!games.includes(game)) {
          games.push(game);
        }
      } else {
        map.set(id, [game]);
      }
    }
  }

  return map;
}

/** Pre-computed at module level — static data, safe to share. */
export const pokemonToGames = buildPokemonToGamesMap();
