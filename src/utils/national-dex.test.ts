import { describe, it, expect } from 'vitest';
import {
  getNationalDexPokemonIds,
  getNationalDexSize,
  NATIONAL_DEX_TOTAL,
} from './national-dex';

describe('national-dex', () => {
  describe('NATIONAL_DEX_TOTAL', () => {
    it('is 1025', () => {
      expect(NATIONAL_DEX_TOTAL).toBe(1025);
    });
  });

  describe('getNationalDexPokemonIds', () => {
    it('returns exactly 1025 IDs', () => {
      const ids = getNationalDexPokemonIds();
      expect(ids).toHaveLength(1025);
    });

    it('starts at 1 and ends at 1025', () => {
      const ids = getNationalDexPokemonIds();
      expect(ids[0]).toBe(1);
      expect(ids[ids.length - 1]).toBe(1025);
    });

    it('contains all IDs from 1 to 1025 with no gaps', () => {
      const ids = getNationalDexPokemonIds();
      for (let i = 0; i < ids.length; i++) {
        expect(ids[i]).toBe(i + 1);
      }
    });

    it('is sorted in ascending order', () => {
      const ids = getNationalDexPokemonIds();
      for (let i = 1; i < ids.length; i++) {
        expect(ids[i]).toBeGreaterThan(ids[i - 1]);
      }
    });
  });

  describe('getNationalDexSize', () => {
    it('returns 1025', () => {
      expect(getNationalDexSize()).toBe(1025);
    });
  });
});
