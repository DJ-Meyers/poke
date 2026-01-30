import { describe, it, expect } from 'vitest';
import { calculateBoxes } from './box-calculator';

describe('calculateBoxes', () => {
  describe('basic box calculation', () => {
    it('creates boxes of 30 Pokemon each', () => {
      // 35 Pokemon should create 2 boxes: one with 30, one with 5
      const pokemonIds = Array.from({ length: 35 }, (_, i) => i + 1);

      const boxes = calculateBoxes(pokemonIds, false);

      expect(boxes).toHaveLength(2);
      expect(boxes[0]).toEqual({
        boxNumber: 1,
        startDexNumber: 1,
        endDexNumber: 30,
        pokemonIds: pokemonIds.slice(0, 30),
      });
      expect(boxes[1]).toEqual({
        boxNumber: 2,
        startDexNumber: 31,
        endDexNumber: 35,
        pokemonIds: pokemonIds.slice(30),
      });
    });

    it('handles exactly 30 Pokemon in one box', () => {
      const pokemonIds = Array.from({ length: 30 }, (_, i) => i + 1);

      const boxes = calculateBoxes(pokemonIds, false);

      expect(boxes).toHaveLength(1);
      expect(boxes[0].startDexNumber).toBe(1);
      expect(boxes[0].endDexNumber).toBe(30);
    });

    it('handles small dex with fewer than 30 Pokemon', () => {
      const pokemonIds = [1, 2, 3, 4, 5];

      const boxes = calculateBoxes(pokemonIds, false);

      expect(boxes).toHaveLength(1);
      expect(boxes[0]).toEqual({
        boxNumber: 1,
        startDexNumber: 1,
        endDexNumber: 5,
        pokemonIds: [1, 2, 3, 4, 5],
      });
    });

    it('handles empty Pokemon list', () => {
      const boxes = calculateBoxes([], false);

      expect(boxes).toHaveLength(0);
    });

    it('creates correct number of boxes for large dex', () => {
      // 100 Pokemon should create 4 boxes: 30, 30, 30, 10
      const pokemonIds = Array.from({ length: 100 }, (_, i) => i + 1);

      const boxes = calculateBoxes(pokemonIds, false);

      expect(boxes).toHaveLength(4);
      expect(boxes[0].pokemonIds).toHaveLength(30);
      expect(boxes[1].pokemonIds).toHaveLength(30);
      expect(boxes[2].pokemonIds).toHaveLength(30);
      expect(boxes[3].pokemonIds).toHaveLength(10);
    });
  });

  describe('generation boundaries', () => {
    it('does not break on generation boundaries when respectGenerationBoundaries is false', () => {
      // Pokemon 150, 151 (Gen 1), 152, 153 (Gen 2) - should be one box
      const pokemonIds = [150, 151, 152, 153];

      const boxes = calculateBoxes(pokemonIds, false);

      expect(boxes).toHaveLength(1);
      expect(boxes[0].pokemonIds).toEqual([150, 151, 152, 153]);
    });

    it('breaks on generation boundaries when respectGenerationBoundaries is true', () => {
      // Pokemon 150, 151 (Gen 1), 152, 153 (Gen 2)
      const pokemonIds = [150, 151, 152, 153];

      const boxes = calculateBoxes(pokemonIds, true);

      expect(boxes).toHaveLength(2);
      expect(boxes[0].pokemonIds).toEqual([150, 151]); // Gen 1
      expect(boxes[1].pokemonIds).toEqual([152, 153]); // Gen 2
    });

    it('handles Mew (151) as last Pokemon of Gen 1', () => {
      // Gen 1 ends at 151 (Mew), Gen 2 starts at 152 (Chikorita)
      const pokemonIds = [149, 150, 151, 152, 153, 154];

      const boxes = calculateBoxes(pokemonIds, true);

      expect(boxes).toHaveLength(2);
      expect(boxes[0]).toEqual({
        boxNumber: 1,
        startDexNumber: 1,
        endDexNumber: 3,
        pokemonIds: [149, 150, 151],
      });
      expect(boxes[1]).toEqual({
        boxNumber: 2,
        startDexNumber: 4,
        endDexNumber: 6,
        pokemonIds: [152, 153, 154],
      });
    });

    it('still breaks at 30 even with generation boundaries', () => {
      // 35 Gen 1 Pokemon should still create 2 boxes
      const pokemonIds = Array.from({ length: 35 }, (_, i) => i + 1);

      const boxes = calculateBoxes(pokemonIds, true);

      expect(boxes).toHaveLength(2);
      expect(boxes[0].pokemonIds).toHaveLength(30);
      expect(boxes[1].pokemonIds).toHaveLength(5);
    });

    it('handles multiple generation boundaries', () => {
      // Pokemon from Gen 1, Gen 2, Gen 3
      const pokemonIds = [151, 251, 252]; // Mew, Celebi, Treecko

      const boxes = calculateBoxes(pokemonIds, true);

      // Three boxes - one for each generation
      expect(boxes).toHaveLength(3);
      expect(boxes[0].pokemonIds).toEqual([151]); // Mew (Gen 1)
      expect(boxes[1].pokemonIds).toEqual([251]); // Celebi (Gen 2)
      expect(boxes[2].pokemonIds).toEqual([252]); // Treecko (Gen 3)
    });

    it('handles Gen 2 to Gen 3 boundary (251 to 252)', () => {
      const pokemonIds = [250, 251, 252, 253];

      const boxes = calculateBoxes(pokemonIds, true);

      expect(boxes).toHaveLength(2);
      expect(boxes[0].pokemonIds).toEqual([250, 251]); // Gen 2
      expect(boxes[1].pokemonIds).toEqual([252, 253]); // Gen 3
    });

    it('handles all generation boundaries correctly', () => {
      // One Pokemon from each generation
      const pokemonIds = [1, 152, 252, 387, 494, 650, 722, 810, 906];

      const boxes = calculateBoxes(pokemonIds, true);

      expect(boxes).toHaveLength(9);
      boxes.forEach((box, index) => {
        expect(box.pokemonIds).toHaveLength(1);
        expect(box.boxNumber).toBe(index + 1);
      });
    });
  });

  describe('box numbering and ranges', () => {
    it('numbers boxes sequentially', () => {
      const pokemonIds = Array.from({ length: 65 }, (_, i) => i + 1);

      const boxes = calculateBoxes(pokemonIds, false);

      expect(boxes[0].boxNumber).toBe(1);
      expect(boxes[1].boxNumber).toBe(2);
      expect(boxes[2].boxNumber).toBe(3);
    });

    it('calculates correct dex number ranges', () => {
      const pokemonIds = Array.from({ length: 65 }, (_, i) => i + 1);

      const boxes = calculateBoxes(pokemonIds, false);

      expect(boxes[0].startDexNumber).toBe(1);
      expect(boxes[0].endDexNumber).toBe(30);
      expect(boxes[1].startDexNumber).toBe(31);
      expect(boxes[1].endDexNumber).toBe(60);
      expect(boxes[2].startDexNumber).toBe(61);
      expect(boxes[2].endDexNumber).toBe(65);
    });

    it('continues box numbering across generation boundaries', () => {
      // Pokemon spanning Gen 1 and Gen 2
      const pokemonIds = [150, 151, 152, 153];

      const boxes = calculateBoxes(pokemonIds, true);

      expect(boxes[0].boxNumber).toBe(1);
      expect(boxes[1].boxNumber).toBe(2);
    });
  });
});
