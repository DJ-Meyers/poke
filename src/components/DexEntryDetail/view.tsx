import type { Pokemon, PokemonSpecies } from 'pokenode-ts';
import type { Game, GameDex } from '~/utils/dex-data';
import { getDexLabel } from '~/utils/dex-data';
import { getDexUrlId } from '~/utils/route-params';
import { AppLayout } from '~/components/ui';

interface DexEntryDetailViewProps {
  pokemon: Pokemon;
  species: PokemonSpecies | null;
  game?: Game;
  gameDex?: GameDex;
  /** 1-indexed regional dex number */
  regionalDexNumber: number;
}

/**
 * Returns the sprite URL for a Pokemon.
 */
function getSpriteUrl(pokemon: Pokemon): string {
  const officialArtwork =
    pokemon.sprites.other?.['official-artwork']?.front_default;
  if (officialArtwork) {
    return officialArtwork;
  }
  return pokemon.sprites.front_default ?? '';
}

/**
 * Extracts type names from a Pokemon's types array.
 */
function getTypeNames(pokemon: Pokemon): string[] {
  return pokemon.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name);
}

/**
 * Returns the CSS variable for a type color.
 */
function typeColor(type: string): string {
  return `var(--color-type-${type})`;
}

/**
 * Capitalizes the first letter of a string.
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats a Pokemon name for display.
 */
function formatName(name: string): string {
  return name
    .split('-')
    .map((part) => capitalize(part))
    .join(' ');
}

/**
 * Returns the English genus from species data.
 */
function getEnglishGenus(species: PokemonSpecies | null): string | null {
  if (!species) return null;

  const entry = species.genera.find((g) => g.language.name === 'en');
  return entry?.genus ?? null;
}

/**
 * Formats the dex number display.
 * Shows "#{regional} / #{national}"
 */
function formatDexNumber(
  nationalId: number,
  regionalDexNumber: number
): string {
  const nationalStr = `#${nationalId.toString().padStart(4, '0')}`;
  const regionalStr = `#${regionalDexNumber.toString().padStart(3, '0')}`;
  return `${regionalStr} / ${nationalStr}`;
}

export function DexEntryDetailView({
  pokemon,
  species,
  game,
  gameDex,
  regionalDexNumber,
}: DexEntryDetailViewProps) {
  const types = getTypeNames(pokemon);
  const spriteUrl = getSpriteUrl(pokemon);
  const genus = getEnglishGenus(species);

  const backUrl =
    game && gameDex
      ? `/dex/${game.toLowerCase()}/${getDexUrlId({ gameDex })}`
      : '/dex/national';

  const headerChildren = (
    <p className="text-sm text-text leading-none -mt-2">
      {gameDex ? getDexLabel({ gameDex }) : 'National Pokédex'}
    </p>
  );

  return (
    <AppLayout
      title={formatName(pokemon.name)}
      backTo={backUrl}
      headerChildren={headerChildren}
      hideSubheader
    >
      <div className="p-4 space-y-6">
        {/* Pokemon card */}
        <div className="bg-surface rounded-xl p-6 flex flex-col items-center">
          {/* Sprite */}
          <img
            src={spriteUrl}
            alt={pokemon.name}
            className="w-48 h-48 object-contain drop-shadow-lg"
          />

          {/* Number and genus */}
          <p className="text-lg text-text mt-2">
            {gameDex
              ? formatDexNumber(pokemon.id, regionalDexNumber)
              : `#${pokemon.id.toString().padStart(4, '0')}`}
          </p>
          {genus && <p className="text-sm text-text">The {genus}</p>}

          {/* Types */}
          <div className="flex gap-2 mt-4">
            {types.map((type) => (
              <span
                key={type}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: typeColor(type) }}
              >
                {capitalize(type)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
