import type { Pokemon } from 'pokenode-ts';
import dittoData from './ditto.json';

/**
 * Ditto's full Pokemon data from PokeAPI.
 * Use this as a base for creating mock Pokemon in tests and stories.
 */
export const DITTO: Pokemon = dittoData as Pokemon;

/**
 * Creates a mock Pokemon by overriding specific fields from Ditto's data.
 * This ensures the mock has all required fields while allowing customization.
 */
export function createMockPokemon(overrides: {
  id: number;
  name: string;
  types: string[];
  spriteUrl?: string;
}): Pokemon {
  const { id, name, types, spriteUrl } = overrides;

  const defaultSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return {
    ...DITTO,
    id,
    name,
    order: id,
    species: { name, url: `https://pokeapi.co/api/v2/pokemon-species/${id}/` },
    types: types.map((type, index) => ({
      slot: index + 1,
      type: { name: type, url: `https://pokeapi.co/api/v2/type/${type}/` },
    })),
    sprites: {
      ...DITTO.sprites,
      front_default: spriteUrl ?? defaultSpriteUrl,
      other: DITTO.sprites.other
        ? {
            ...DITTO.sprites.other,
            'official-artwork': {
              front_default: spriteUrl ?? defaultSpriteUrl,
            },
          }
        : undefined,
    },
  };
}

// Pre-made mock Pokemon for common test cases
export const MOCK_POKEMON = {
  PIKACHU: createMockPokemon({
    id: 25,
    name: 'pikachu',
    types: ['electric'],
  }),
  CHARIZARD: createMockPokemon({
    id: 6,
    name: 'charizard',
    types: ['fire', 'flying'],
  }),
  BULBASAUR: createMockPokemon({
    id: 1,
    name: 'bulbasaur',
    types: ['grass', 'poison'],
  }),
  GENGAR: createMockPokemon({
    id: 94,
    name: 'gengar',
    types: ['ghost', 'poison'],
  }),
};
