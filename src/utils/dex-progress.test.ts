import { describe, it, expect, beforeEach } from 'vitest';
import {
  getProgressForDex,
  getIsCaughtForDex,
  markCaughtForDex,
  markUncaughtForDex,
  toggleCaughtForDex,
  markAllCaughtForDex,
  resetProgressForDex,
  getCaughtCountForDex,
  GameDex,
} from './dex-progress';

describe('dexProgress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getProgressForDex', () => {
    it('returns empty array when no progress exists', () => {
      expect(getProgressForDex({ gameDex: GameDex.SV_PALDEA })).toEqual([]);
    });

    it('returns stored progress', () => {
      localStorage.setItem('dex:SV_PALDEA', '[906, 909, 912]');
      expect(getProgressForDex({ gameDex: GameDex.SV_PALDEA })).toEqual([
        906, 909, 912,
      ]);
    });

    it('returns empty array for invalid JSON', () => {
      localStorage.setItem('dex:SV_PALDEA', 'invalid');
      expect(getProgressForDex({ gameDex: GameDex.SV_PALDEA })).toEqual([]);
    });

    it('filters out non-number values', () => {
      localStorage.setItem('dex:SV_PALDEA', '[906, "bad", null, 909]');
      expect(getProgressForDex({ gameDex: GameDex.SV_PALDEA })).toEqual([
        906, 909,
      ]);
    });
  });

  describe('getIsCaughtForDex', () => {
    it('returns false when pokemon is not caught', () => {
      expect(
        getIsCaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 906 })
      ).toBe(false);
    });

    it('returns true when pokemon is caught', () => {
      localStorage.setItem('dex:SV_PALDEA', '[906, 909]');
      expect(
        getIsCaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 906 })
      ).toBe(true);
      expect(
        getIsCaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 907 })
      ).toBe(false);
    });
  });

  describe('markCaughtForDex', () => {
    it('adds pokemon to progress', () => {
      markCaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 906 });
      expect(getProgressForDex({ gameDex: GameDex.SV_PALDEA })).toEqual([906]);
    });

    it('maintains sorted order', () => {
      markCaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 912 });
      markCaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 906 });
      markCaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 909 });
      expect(getProgressForDex({ gameDex: GameDex.SV_PALDEA })).toEqual([
        906, 909, 912,
      ]);
    });

    it('does not add duplicates', () => {
      markCaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 906 });
      markCaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 906 });
      expect(getProgressForDex({ gameDex: GameDex.SV_PALDEA })).toEqual([906]);
    });
  });

  describe('markUncaughtForDex', () => {
    it('removes pokemon from progress', () => {
      localStorage.setItem('dex:SV_PALDEA', '[906, 909, 912]');
      markUncaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 909 });
      expect(getProgressForDex({ gameDex: GameDex.SV_PALDEA })).toEqual([
        906, 912,
      ]);
    });

    it('does nothing if pokemon is not in progress', () => {
      localStorage.setItem('dex:SV_PALDEA', '[906, 912]');
      markUncaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 909 });
      expect(getProgressForDex({ gameDex: GameDex.SV_PALDEA })).toEqual([
        906, 912,
      ]);
    });
  });

  describe('toggleCaughtForDex', () => {
    it('marks uncaught pokemon as caught and returns true', () => {
      const result = toggleCaughtForDex({
        gameDex: GameDex.SV_PALDEA,
        pokemonId: 906,
      });
      expect(result).toBe(true);
      expect(
        getIsCaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 906 })
      ).toBe(true);
    });

    it('marks caught pokemon as uncaught and returns false', () => {
      markCaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 906 });
      const result = toggleCaughtForDex({
        gameDex: GameDex.SV_PALDEA,
        pokemonId: 906,
      });
      expect(result).toBe(false);
      expect(
        getIsCaughtForDex({ gameDex: GameDex.SV_PALDEA, pokemonId: 906 })
      ).toBe(false);
    });
  });

  describe('markAllCaughtForDex', () => {
    it('marks all pokemon in the dex as caught', () => {
      markAllCaughtForDex({ gameDex: GameDex.SV_PALDEA });
      const progress = getProgressForDex({ gameDex: GameDex.SV_PALDEA });
      // Paldea dex has 400 pokemon
      expect(progress.length).toBe(400);
      // First pokemon should be Sprigatito (#906)
      expect(progress[0]).toBe(906);
    });

    it('replaces existing progress', () => {
      localStorage.setItem('dex:SV_PALDEA', '[1, 2, 3]');
      markAllCaughtForDex({ gameDex: GameDex.SV_PALDEA });
      const progress = getProgressForDex({ gameDex: GameDex.SV_PALDEA });
      expect(progress.length).toBe(400);
      expect(progress).not.toContain(1);
    });
  });

  describe('resetProgressForDex', () => {
    it('removes all progress for a dex', () => {
      localStorage.setItem('dex:SV_PALDEA', '[906, 909, 912]');
      resetProgressForDex({ gameDex: GameDex.SV_PALDEA });
      expect(getProgressForDex({ gameDex: GameDex.SV_PALDEA })).toEqual([]);
    });

    it('does not affect other dexes', () => {
      localStorage.setItem('dex:SV_PALDEA', '[906]');
      localStorage.setItem('dex:SV_KITAKAMI', '[1000]');
      resetProgressForDex({ gameDex: GameDex.SV_PALDEA });
      expect(getProgressForDex({ gameDex: GameDex.SV_KITAKAMI })).toEqual([
        1000,
      ]);
    });
  });

  describe('getCaughtCountForDex', () => {
    it('returns 0 when no progress exists', () => {
      expect(getCaughtCountForDex({ gameDex: GameDex.SV_PALDEA })).toBe(0);
    });

    it('returns count of caught pokemon', () => {
      localStorage.setItem('dex:SV_PALDEA', '[906, 909, 912]');
      expect(getCaughtCountForDex({ gameDex: GameDex.SV_PALDEA })).toBe(3);
    });
  });
});
