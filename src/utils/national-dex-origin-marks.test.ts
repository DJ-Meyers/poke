import { describe, it, expect } from 'vitest';
import { buildPokemonToGamesMap } from './national-dex-origin-marks';
import { Game, DEX_DATA, GameDex } from '../../data/dex';

describe('buildPokemonToGamesMap', () => {
  const map = buildPokemonToGamesMap();

  it('maps Pokemon to the games they appear in', () => {
    // Pikachu (25) appears in many games
    const pikachuGames = map.get(25);
    expect(pikachuGames).toBeDefined();
    expect(pikachuGames!.length).toBeGreaterThan(1);
  });

  it('does not duplicate a game for a Pokemon in multiple dexes of the same game', () => {
    // Find a Pokemon that appears in multiple SV dexes
    const svPaldeaIds = new Set(DEX_DATA[GameDex.SV_PALDEA].pokemonIds);
    const svKitakamiIds = DEX_DATA[GameDex.SV_KITAKAMI].pokemonIds;
    const overlap = svKitakamiIds.find((id) => svPaldeaIds.has(id));

    if (overlap) {
      const games = map.get(overlap)!;
      const svCount = games.filter((g) => g === Game.SV).length;
      expect(svCount).toBe(1);
    }
  });

  it('returns an array of unique games per Pokemon', () => {
    for (const [, games] of map) {
      const uniqueGames = new Set(games);
      expect(uniqueGames.size).toBe(games.length);
    }
  });

  it('covers all Pokemon from all dexes', () => {
    const allPokemonIds = new Set<number>();
    for (const dex of Object.values(DEX_DATA)) {
      for (const id of dex.pokemonIds) {
        allPokemonIds.add(id);
      }
    }

    for (const id of allPokemonIds) {
      expect(map.has(id)).toBe(true);
    }
  });

  it('only contains valid Game values', () => {
    const validGames = new Set(Object.values(Game));
    for (const [, games] of map) {
      for (const game of games) {
        expect(validGames.has(game)).toBe(true);
      }
    }
  });
});
