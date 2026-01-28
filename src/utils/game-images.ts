/**
 * Pokémon image URL utilities.
 */

/**
 * Returns the sprite URL for a Pokémon from PokéAPI.
 */
export function getPokemonSpriteUrl({
  pokemonId,
}: {
  pokemonId: number;
}): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
}

/**
 * Returns the official artwork URL for a Pokémon from PokéAPI.
 */
export function getPokemonArtworkUrl({
  pokemonId,
}: {
  pokemonId: number;
}): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
}
