import { describe, it, expect } from 'vitest';
import { filterDexEntries } from './use-dex-filter';

// Test fixture: bulbasaur(1), charmander(4), pikachu(25), gengar(94)
// Dex positions: 1, 2, 3, 4
const pokemonIds = [1, 4, 25, 94];
const emptyCaught = new Set<number>();

function filter(overrides: {
  searchQuery?: string;
  hideCompleted?: boolean;
  caughtIds?: Set<number>;
  pokemonIds?: number[];
}) {
  return filterDexEntries({
    pokemonIds: overrides.pokemonIds ?? pokemonIds,
    caughtIds: overrides.caughtIds ?? emptyCaught,
    searchQuery: overrides.searchQuery ?? '',
    hideCompleted: overrides.hideCompleted ?? false,
  });
}

describe('filterDexEntries', () => {
  describe('no filters active', () => {
    it('returns all IDs when query is empty and hideCompleted is false', () => {
      const { filteredIds } = filter({});
      expect(filteredIds).toEqual([1, 4, 25, 94]);
    });

    it('builds correct dexNumberMap (1-indexed)', () => {
      const { dexNumberMap } = filter({});
      expect(dexNumberMap.get(1)).toBe(1);
      expect(dexNumberMap.get(4)).toBe(2);
      expect(dexNumberMap.get(25)).toBe(3);
      expect(dexNumberMap.get(94)).toBe(4);
    });
  });

  describe('search by name', () => {
    it('filters to matching names', () => {
      const { filteredIds } = filter({ searchQuery: 'pika' });
      expect(filteredIds).toEqual([25]);
    });

    it('is case-insensitive', () => {
      const { filteredIds } = filter({ searchQuery: 'CHAR' });
      expect(filteredIds).toEqual([4]);
    });

    it('trims whitespace', () => {
      const { filteredIds } = filter({ searchQuery: '  gengar  ' });
      expect(filteredIds).toEqual([94]);
    });

    it('returns empty array when no match', () => {
      const { filteredIds } = filter({ searchQuery: 'zzz' });
      expect(filteredIds).toEqual([]);
    });
  });

  describe('search by number', () => {
    it('numeric query matches dex position prefix', () => {
      // Position 2 is charmander (id 4)
      const { filteredIds } = filter({ searchQuery: '2' });
      expect(filteredIds).toEqual([4]);
    });

    it('# prefix works', () => {
      // Position 1 is bulbasaur (id 1)
      const { filteredIds } = filter({ searchQuery: '#1' });
      expect(filteredIds).toEqual([1]);
    });

    it('prefix match returns all positions starting with query', () => {
      // "1" matches position 1 (bulbasaur)
      const { filteredIds } = filter({ searchQuery: '1' });
      expect(filteredIds).toEqual([1]);
    });
  });

  describe('hide completed', () => {
    it('filters out IDs in caughtIds', () => {
      const { filteredIds } = filter({
        hideCompleted: true,
        caughtIds: new Set([1, 25]),
      });
      expect(filteredIds).toEqual([4, 94]);
    });

    it('returns all when none caught', () => {
      const { filteredIds } = filter({ hideCompleted: true });
      expect(filteredIds).toEqual([1, 4, 25, 94]);
    });
  });

  describe('combined filters (search + hide completed)', () => {
    it('name search + hideCompleted narrows results together', () => {
      // "bulb" matches bulbasaur (id 1), but it's caught
      const { filteredIds } = filter({
        searchQuery: 'bulb',
        hideCompleted: true,
        caughtIds: new Set([1]),
      });
      expect(filteredIds).toEqual([]);
    });

    it('caught match excluded even if name matches search', () => {
      // "a" matches bulbasaur(1), charmander(4), pikachu(25), gengar(94)
      // Remove pikachu from results by marking it caught
      const { filteredIds } = filter({
        searchQuery: 'a',
        hideCompleted: true,
        caughtIds: new Set([25]),
      });
      expect(filteredIds).toContain(1); // bulbasaur
      expect(filteredIds).toContain(4); // charmander
      expect(filteredIds).toContain(94); // gengar
      expect(filteredIds).not.toContain(25); // pikachu - caught
    });

    it('both active with no surviving results returns empty array', () => {
      const { filteredIds } = filter({
        searchQuery: 'pika',
        hideCompleted: true,
        caughtIds: new Set([25]),
      });
      expect(filteredIds).toEqual([]);
    });
  });

  describe('dexNumberMap', () => {
    it('filtered results keep original dex positions (not re-indexed)', () => {
      // Filter to pikachu (position 3) and gengar (position 4)
      const { dexNumberMap } = filter({
        hideCompleted: true,
        caughtIds: new Set([1, 4]),
      });
      expect(dexNumberMap.get(25)).toBe(3);
      expect(dexNumberMap.get(94)).toBe(4);
      // Filtered-out entries should not be in the map
      expect(dexNumberMap.has(1)).toBe(false);
      expect(dexNumberMap.has(4)).toBe(false);
    });
  });
});
