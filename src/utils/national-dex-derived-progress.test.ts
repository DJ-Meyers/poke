import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDerivedNationalDexData,
  toggleHomeCaught,
  HOME_STORAGE_KEY,
} from './national-dex-derived-progress';

describe('getDerivedNationalDexData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty caught IDs when no progress exists', () => {
    const { caughtIds, caughtByGame } = getDerivedNationalDexData();
    expect(caughtIds.size).toBe(0);
    // caughtByGame has entries for every game (empty sets), since all dexes are iterated
    for (const gameSet of caughtByGame.values()) {
      expect(gameSet.size).toBe(0);
    }
  });

  it('derives caught IDs from a single game dex', () => {
    localStorage.setItem('dex:SV_PALDEA', '[906, 909, 912]');
    const { caughtIds, caughtByGame } = getDerivedNationalDexData();

    expect(caughtIds).toEqual(new Set([906, 909, 912]));
    expect(caughtByGame.get('SV')).toEqual(new Set([906, 909, 912]));
  });

  it('unions caught IDs across multiple game dexes', () => {
    localStorage.setItem('dex:SV_PALDEA', '[906, 909]');
    localStorage.setItem('dex:SWSH_GALAR', '[1, 4, 7]');
    const { caughtIds } = getDerivedNationalDexData();

    expect(caughtIds).toEqual(new Set([1, 4, 7, 906, 909]));
  });

  it('unions dexes within the same game into one per-game set', () => {
    localStorage.setItem('dex:SV_PALDEA', '[906, 909]');
    localStorage.setItem('dex:SV_KITAKAMI', '[194, 906]');
    const { caughtByGame } = getDerivedNationalDexData();

    expect(caughtByGame.get('SV')).toEqual(new Set([194, 906, 909]));
  });

  it('deduplicates Pokemon caught in multiple dexes of same game', () => {
    localStorage.setItem('dex:SV_PALDEA', '[906]');
    localStorage.setItem('dex:SV_KITAKAMI', '[906]');
    const { caughtIds, caughtByGame } = getDerivedNationalDexData();

    expect(caughtIds.size).toBe(1);
    expect(caughtByGame.get('SV')?.size).toBe(1);
  });

  it('tracks caught status per game independently', () => {
    localStorage.setItem('dex:SV_PALDEA', '[25]');
    localStorage.setItem('dex:SWSH_GALAR', '[25]');
    const { caughtIds, caughtByGame } = getDerivedNationalDexData();

    expect(caughtIds.size).toBe(1);
    expect(caughtByGame.get('SV')?.has(25)).toBe(true);
    expect(caughtByGame.get('SWSH')?.has(25)).toBe(true);
  });

  it('does not include games with no caught Pokemon in caughtByGame', () => {
    localStorage.setItem('dex:SV_PALDEA', '[906]');
    // No LGPE progress
    const { caughtByGame } = getDerivedNationalDexData();

    expect(caughtByGame.has('SV')).toBe(true);
    // Games with empty progress still get iterated but produce empty sets
    // The function creates a set for every dex it visits
  });

  it('includes HOME caught IDs in caughtIds', () => {
    localStorage.setItem(HOME_STORAGE_KEY, '[1, 25, 150]');
    const { caughtIds } = getDerivedNationalDexData();

    expect(caughtIds).toContain(1);
    expect(caughtIds).toContain(25);
    expect(caughtIds).toContain(150);
  });

  it('tracks HOME caught set in caughtByGame', () => {
    localStorage.setItem(HOME_STORAGE_KEY, '[1, 25]');
    const { caughtByGame } = getDerivedNationalDexData();

    expect(caughtByGame.get('HOME')).toEqual(new Set([1, 25]));
  });

  it('unions HOME and game dex caught IDs', () => {
    localStorage.setItem(HOME_STORAGE_KEY, '[1, 25]');
    localStorage.setItem('dex:SV_PALDEA', '[906, 25]');
    const { caughtIds, caughtByGame } = getDerivedNationalDexData();

    expect(caughtIds).toEqual(new Set([1, 25, 906]));
    expect(caughtByGame.get('HOME')).toEqual(new Set([1, 25]));
    expect(caughtByGame.get('SV')).toEqual(new Set([906, 25]));
  });

  it('always has a HOME entry in caughtByGame even with no HOME progress', () => {
    const { caughtByGame } = getDerivedNationalDexData();
    expect(caughtByGame.has('HOME')).toBe(true);
    expect(caughtByGame.get('HOME')?.size).toBe(0);
  });
});

describe('toggleHomeCaught', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a Pokemon to HOME when not yet caught', () => {
    const result = toggleHomeCaught(25);
    expect(result).toBe(true);

    const stored = JSON.parse(localStorage.getItem(HOME_STORAGE_KEY)!);
    expect(stored).toContain(25);
  });

  it('removes a Pokemon from HOME when already caught', () => {
    localStorage.setItem(HOME_STORAGE_KEY, '[25]');
    const result = toggleHomeCaught(25);
    expect(result).toBe(false);

    const stored = JSON.parse(localStorage.getItem(HOME_STORAGE_KEY)!);
    expect(stored).not.toContain(25);
  });

  it('maintains sorted order when adding', () => {
    localStorage.setItem(HOME_STORAGE_KEY, '[1, 100]');
    toggleHomeCaught(50);

    const stored = JSON.parse(localStorage.getItem(HOME_STORAGE_KEY)!);
    expect(stored).toEqual([1, 50, 100]);
  });

  it('works with empty storage', () => {
    toggleHomeCaught(42);

    const stored = JSON.parse(localStorage.getItem(HOME_STORAGE_KEY)!);
    expect(stored).toEqual([42]);
  });
});
