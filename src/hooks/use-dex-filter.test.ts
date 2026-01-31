import { describe, it, expect } from 'vitest';
import { filterDexEntries } from './use-dex-filter';

// Test fixture: bulbasaur(1), charmander(4), pikachu(25), gengar(94)
// Dex positions: 1, 2, 3, 4
const pokemonIds = [1, 4, 25, 94];
const emptyCaught = new Set<number>();

const filter = (overrides: {
  searchQuery?: string;
  hideCompleted?: boolean;
  caughtIds?: Set<number>;
  pokemonIds?: number[];
}) => {
  return filterDexEntries({
    pokemonIds: overrides.pokemonIds ?? pokemonIds,
    caughtIds: overrides.caughtIds ?? emptyCaught,
    searchQuery: overrides.searchQuery ?? '',
    hideCompleted: overrides.hideCompleted ?? false,
  });
};

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
    // Matching behavior depends on whether query has leading zeros:
    // - Leading zeros (e.g., "001", "0025"): EXACT match (query represents specific number)
    // - No leading zeros (e.g., "1", "25"): PREFIX match (find all starting with those digits)
    // Matches against BOTH game dex position AND national dex ID

    describe('leading zeros = exact match', () => {
      it('"001" matches only position/ID 1', () => {
        const ids = Array.from({ length: 20 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '001', pokemonIds: ids });
        // "001" = exact match for #1, NOT #10-19
        expect(filteredIds).toEqual([1]);
      });

      it('"001" does NOT match positions 10-19', () => {
        const ids = Array.from({ length: 20 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '001', pokemonIds: ids });
        for (let i = 10; i <= 19; i++) {
          expect(filteredIds).not.toContain(i);
        }
      });

      it('"001" does NOT match position 1001', () => {
        const ids = Array.from({ length: 1100 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '001', pokemonIds: ids });
        expect(filteredIds).not.toContain(1001);
        expect(filteredIds).toEqual([1]);
      });

      it('"02" matches only position/ID 2', () => {
        const ids = Array.from({ length: 250 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '02', pokemonIds: ids });
        expect(filteredIds).toEqual([2]);
      });

      it('"010" matches only position/ID 10', () => {
        const ids = Array.from({ length: 100 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '010', pokemonIds: ids });
        expect(filteredIds).toEqual([10]);
      });

      it('"0025" matches only position/ID 25', () => {
        const ids = Array.from({ length: 100 }, (_, i) => i + 1);
        const { filteredIds } = filter({
          searchQuery: '0025',
          pokemonIds: ids,
        });
        expect(filteredIds).toEqual([25]);
      });

      it('"0100" matches only position/ID 100', () => {
        const ids = Array.from({ length: 200 }, (_, i) => i + 1);
        const { filteredIds } = filter({
          searchQuery: '0100',
          pokemonIds: ids,
        });
        expect(filteredIds).toEqual([100]);
      });
    });

    describe('no leading zeros = prefix match', () => {
      it('"1" matches all positions/IDs starting with 1', () => {
        const ids = Array.from({ length: 25 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '1', pokemonIds: ids });
        // 1, 10-19 all start with "1"
        expect(filteredIds).toContain(1);
        expect(filteredIds).toContain(10);
        expect(filteredIds).toContain(11);
        expect(filteredIds).toContain(19);
        // 2, 20-25 don't start with "1"
        expect(filteredIds).not.toContain(2);
        expect(filteredIds).not.toContain(20);
      });

      it('"2" matches all positions/IDs starting with 2', () => {
        const ids = Array.from({ length: 30 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '2', pokemonIds: ids });
        expect(filteredIds).toContain(2);
        expect(filteredIds).toContain(20);
        expect(filteredIds).toContain(21);
        expect(filteredIds).toContain(25);
        expect(filteredIds).not.toContain(1);
        expect(filteredIds).not.toContain(12); // 12 starts with "1", not "2"
      });

      it('"25" matches 25, 250-259, 2500-2599, etc.', () => {
        const ids = Array.from({ length: 300 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '25', pokemonIds: ids });
        expect(filteredIds).toContain(25);
        expect(filteredIds).toContain(250);
        expect(filteredIds).toContain(259);
        expect(filteredIds).not.toContain(2);
        expect(filteredIds).not.toContain(125); // starts with "1"
      });

      it('"10" matches 10, 100-109, 1000-1099, etc.', () => {
        const ids = Array.from({ length: 1200 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '10', pokemonIds: ids });
        expect(filteredIds).toContain(10);
        expect(filteredIds).toContain(100);
        expect(filteredIds).toContain(109);
        expect(filteredIds).toContain(1000);
        expect(filteredIds).toContain(1099);
        expect(filteredIds).not.toContain(1);
        expect(filteredIds).not.toContain(110); // starts with "11"
        expect(filteredIds).not.toContain(210); // starts with "2"
      });

      it('"9" matches 9, 90-99, 900-999, 9000-9999', () => {
        const ids = Array.from({ length: 100 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '9', pokemonIds: ids });
        expect(filteredIds).toContain(9);
        expect(filteredIds).toContain(90);
        expect(filteredIds).toContain(99);
        expect(filteredIds).not.toContain(19); // starts with "1"
        expect(filteredIds).not.toContain(29); // starts with "2"
      });
    });

    describe('matching against both game dex and national dex', () => {
      // Blueberry-style dex where positions differ from national IDs
      // Position 1 = Doduo (national #84)
      // Position 164 = Bulbasaur (national #1)
      const blueberryStyle = (() => {
        // Simplified: position 1 = #84, position 2 = #85, position 10 = #239
        const dex = Array.from({ length: 200 }, (_, i) => ((i + 83) % 300) + 1);
        dex[163] = 1; // Position 164 = Bulbasaur
        return dex;
      })();

      it('"001" matches by game dex position 1 (Doduo)', () => {
        const { filteredIds } = filter({
          searchQuery: '001',
          pokemonIds: blueberryStyle,
        });
        // Position 1 has national #84
        expect(filteredIds).toContain(84);
      });

      it('"001" matches by national dex ID 1 (Bulbasaur at position 164)', () => {
        const { filteredIds } = filter({
          searchQuery: '001',
          pokemonIds: blueberryStyle,
        });
        // National #1 is at position 164
        expect(filteredIds).toContain(1);
      });

      it('"001" does NOT match position 10 (Elekid #239)', () => {
        // Position 10 has some pokemon, but neither position 10 nor its national ID is 1
        const { filteredIds } = filter({
          searchQuery: '001',
          pokemonIds: blueberryStyle,
        });
        // Position 10 = national #93 (84 + 9)
        expect(filteredIds).not.toContain(93);
      });

      it('"0025" matches national dex #25 (Pikachu)', () => {
        // Regional dex: position 1 = Pikachu (national #25)
        const { filteredIds } = filter({
          searchQuery: '0025',
          pokemonIds: [25, 4, 94],
        });
        expect(filteredIds).toContain(25);
        expect(filteredIds).not.toContain(4);
        expect(filteredIds).not.toContain(94);
      });

      it('"25" prefix matches national #25 and positions starting with 25', () => {
        // Regional dex: Pikachu at position 5 (national #25)
        const regionalDex = [10, 13, 16, 19, 25, 1, 4, 7];
        const { filteredIds } = filter({
          searchQuery: '25',
          pokemonIds: regionalDex,
        });
        expect(filteredIds).toContain(25); // National #25
      });

      it('matches either position OR national ID', () => {
        // Dex where position 25 != national #25
        const dex = Array.from({ length: 30 }, (_, i) => 30 - i); // [30,29,...,1]
        // Position 25 = national #6, Position 6 = national #25
        const { filteredIds } = filter({ searchQuery: '25', pokemonIds: dex });
        expect(filteredIds).toContain(6); // This is at position 25
        expect(filteredIds).toContain(25); // This is national #25 (at position 6)
      });
    });

    describe('edge cases with zeros', () => {
      it('"0" returns empty (no position/ID 0 exists)', () => {
        const ids = Array.from({ length: 35 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '0', pokemonIds: ids });
        // "0" with leading zero = exact match for 0, which doesn't exist
        expect(filteredIds).toEqual([]);
      });

      it('"00" returns empty (no position/ID 0 exists)', () => {
        const ids = Array.from({ length: 100 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '00', pokemonIds: ids });
        expect(filteredIds).toEqual([]);
      });

      it('"000" returns empty', () => {
        const ids = Array.from({ length: 1000 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '000', pokemonIds: ids });
        expect(filteredIds).toEqual([]);
      });
    });

    describe('hash prefix', () => {
      it('"#1" is prefix match (same as "1")', () => {
        const ids = Array.from({ length: 20 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '#1', pokemonIds: ids });
        expect(filteredIds).toContain(1);
        expect(filteredIds).toContain(10);
        expect(filteredIds).toContain(11);
      });

      it('"#001" is exact match (same as "001")', () => {
        const ids = Array.from({ length: 1100 }, (_, i) => i + 1);
        const { filteredIds } = filter({
          searchQuery: '#001',
          pokemonIds: ids,
        });
        expect(filteredIds).toEqual([1]);
      });

      it('"#0025" matches only #25', () => {
        const { filteredIds } = filter({
          searchQuery: '#0025',
          pokemonIds: [25, 4, 94, 250, 251],
        });
        expect(filteredIds).toEqual([25]);
      });

      it('"#25" is prefix match for 25, 250, 251, etc.', () => {
        const { filteredIds } = filter({
          searchQuery: '#25',
          pokemonIds: [25, 4, 94, 250, 251],
        });
        expect(filteredIds).toContain(25);
        expect(filteredIds).toContain(250);
        expect(filteredIds).toContain(251);
        expect(filteredIds).not.toContain(4);
      });
    });

    describe('boundary cases', () => {
      it('"99" prefix matches 99, 990-999, 9900-9999', () => {
        const ids = Array.from({ length: 1000 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '99', pokemonIds: ids });
        expect(filteredIds).toContain(99);
        expect(filteredIds).toContain(990);
        expect(filteredIds).toContain(999);
        expect(filteredIds).not.toContain(199); // starts with "1"
        expect(filteredIds).not.toContain(299); // starts with "2"
      });

      it('"100" prefix matches 100, 1000-1009', () => {
        const ids = Array.from({ length: 1100 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '100', pokemonIds: ids });
        expect(filteredIds).toContain(100);
        expect(filteredIds).toContain(1000);
        expect(filteredIds).toContain(1009);
        expect(filteredIds).not.toContain(10); // "10" != "100"
        expect(filteredIds).not.toContain(1010); // starts with "101"
      });

      it('"999" prefix matches 999, 9990-9999', () => {
        const ids = Array.from({ length: 9999 }, (_, i) => i + 1);
        const { filteredIds } = filter({ searchQuery: '999', pokemonIds: ids });
        expect(filteredIds).toContain(999);
        expect(filteredIds).toContain(9990);
        expect(filteredIds).toContain(9999);
        expect(filteredIds).not.toContain(1999);
      });

      it('"9999" matches exactly 9999', () => {
        const ids = Array.from({ length: 9999 }, (_, i) => i + 1);
        const { filteredIds } = filter({
          searchQuery: '9999',
          pokemonIds: ids,
        });
        expect(filteredIds).toEqual([9999]);
      });

      it('query for non-existent number returns empty', () => {
        const ids = Array.from({ length: 100 }, (_, i) => i + 1);
        const { filteredIds } = filter({
          searchQuery: '0999',
          pokemonIds: ids,
        });
        expect(filteredIds).toEqual([]);
      });
    });

    describe('original test compatibility', () => {
      it('numeric query "2" prefix matches position 2 and IDs starting with 2', () => {
        // Original fixture: [1, 4, 25, 94] positions 1,2,3,4
        const { filteredIds } = filter({ searchQuery: '2' });
        // Position 2 (ID 4): position starts with "2" ✓
        // ID 25 at position 3: ID starts with "2" ✓
        expect(filteredIds).toContain(4); // position 2
        expect(filteredIds).toContain(25); // national #25
      });

      it('"#1" works with hash prefix', () => {
        const { filteredIds } = filter({ searchQuery: '#1' });
        expect(filteredIds).toContain(1);
      });
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
