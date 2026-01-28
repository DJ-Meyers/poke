import type { Pokemon } from 'pokenode-ts';
import { ORIGIN_MARK_IMAGES, type OriginMark } from './origin-marks';
import { useSecondaryActionHandlers } from '~/hooks/use-secondary-action';

interface DexEntryViewProps {
  pokemon: Pokemon;
  isComplete: boolean;
  onPrimaryAction?: (id: number) => void;
  onSecondaryAction?: (id: number) => void;
  /** 1-indexed regional dex number. If undefined, only national number is shown. */
  regionalDexNumber?: number;
  /** Origin marks showing which games this Pokémon appears in. */
  originMarks?: OriginMark[];
}

/**
 * Returns the sprite URL for a Pokemon.
 * Prefers the official artwork, falls back to front_default sprite.
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
 * Returns the background style based on Pokemon types.
 * Single type: solid color
 * Dual type: gradient between the two colors
 */
function getTypeBackground(types: string[]): React.CSSProperties {
  if (types.length === 1) {
    return { backgroundColor: typeColor(types[0]) };
  }

  return {
    background: `linear-gradient(135deg, ${typeColor(types[0])} 0%, ${typeColor(types[1])} 100%)`,
  };
}

/**
 * Capitalizes the first letter of a Pokemon name.
 */
function formatName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Formats the dex number display.
 * If regionalDexNumber is provided, shows "#{regional} / #{national}"
 * Otherwise shows only "#{national}"
 */
function formatDexNumber(
  nationalId: number,
  regionalDexNumber?: number
): string {
  const nationalStr = `#${nationalId.toString().padStart(4, '0')}`;
  if (regionalDexNumber !== undefined) {
    const regionalStr = `#${regionalDexNumber.toString().padStart(3, '0')}`;
    return `${regionalStr} / ${nationalStr}`;
  }
  return nationalStr;
}

export function DexEntryView({
  pokemon,
  isComplete,
  onPrimaryAction,
  onSecondaryAction,
  regionalDexNumber,
  originMarks,
}: DexEntryViewProps) {
  const types = getTypeNames(pokemon);
  const spriteUrl = getSpriteUrl(pokemon);

  const handlePrimaryAction = onPrimaryAction
    ? () => onPrimaryAction(pokemon.id)
    : undefined;

  const secondaryCallback = onSecondaryAction
    ? () => onSecondaryAction(pokemon.id)
    : undefined;
  const { onMobilePressAndHold, onRightClick } =
    useSecondaryActionHandlers(secondaryCallback);

  return (
    <button
      type="button"
      onClick={handlePrimaryAction}
      className="relative flex flex-col items-center justify-center aspect-square cursor-pointer w-full long-press-target"
      {...onMobilePressAndHold}
      {...onRightClick}
    >
      {/* Type background - gray when incomplete, type color when complete */}
      <div
        className="absolute inset-0 rounded-lg transition-all duration-200"
        style={
          isComplete ? getTypeBackground(types) : { backgroundColor: '#374151' }
        }
      />

      {/* Sprite - fixed size container to prevent layout shift */}
      <div className="relative z-10 w-16 h-16">
        <img
          src={spriteUrl}
          alt={pokemon.name}
          className={`w-full h-full object-contain drop-shadow-md transition-all duration-200 ${isComplete ? '' : 'grayscale opacity-60'}`}
        />
      </div>

      {/* Pokemon name and number - always visible, not grayed */}
      <div className="relative z-10 text-center">
        <span className="block text-xs font-medium text-white drop-shadow-sm leading-tight">
          {formatName(pokemon.name)}
        </span>
        <span className="block text-[10px] text-white/70 drop-shadow-sm">
          {formatDexNumber(pokemon.id, regionalDexNumber)}
        </span>
      </div>

      {/* Origin marks - small game icons showing availability */}
      {originMarks && originMarks.length > 0 && (
        <div className="relative z-10 flex gap-0.5 mt-0.5">
          {originMarks.map((mark) => (
            <img
              key={mark.game}
              src={ORIGIN_MARK_IMAGES[mark.game]}
              alt={mark.game}
              className={`w-3 h-3 ${mark.caught ? 'opacity-100' : 'opacity-30'}`}
            />
          ))}
        </div>
      )}
    </button>
  );
}
