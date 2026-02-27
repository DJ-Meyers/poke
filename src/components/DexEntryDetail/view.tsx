import type {
  Pokemon,
  PokemonSpecies,
  LocationAreaEncounter,
} from 'pokenode-ts';
import type { Game, GameDex } from '~/utils/dex-data';
import { getDexLabel } from '~/utils/dex-data';
import { getDexUrlId } from '~/utils/route-params';
import { AppLayout } from '~/components/ui';

interface DexEntryDetailViewProps {
  pokemon: Pokemon;
  species: PokemonSpecies | null;
  locationAreas: LocationAreaEncounter[];
  game?: Game;
  gameDex?: GameDex;
  /** 1-indexed regional dex number */
  regionalDexNumber: number;
}

/**
 * Returns the sprite URL for a Pokemon.
 */
const getSpriteUrl = (pokemon: Pokemon): string => {
  const officialArtwork =
    pokemon.sprites.other?.['official-artwork']?.front_default;
  if (officialArtwork) {
    return officialArtwork;
  }
  return pokemon.sprites.front_default ?? '';
};

/**
 * Extracts type names from a Pokemon's types array.
 */
const getTypeNames = (pokemon: Pokemon): string[] => {
  return pokemon.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name);
};

/**
 * Returns the CSS variable for a type color.
 */
const typeColor = (type: string): string => {
  return `var(--color-type-${type})`;
};

/**
 * Capitalizes the first letter of a string.
 */
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Formats a Pokemon name for display.
 */
const formatName = (name: string): string => {
  return name
    .split('-')
    .map((part) => capitalize(part))
    .join(' ');
};

/**
 * Returns the English genus from species data.
 */
const getEnglishGenus = (species: PokemonSpecies | null): string | null => {
  if (!species) return null;

  const entry = species.genera.find((g) => g.language.name === 'en');
  return entry?.genus ?? null;
};

/**
 * Formats the dex number display.
 * Shows "#{regional} / #{national}"
 */
const formatDexNumber = (
  nationalId: number,
  regionalDexNumber: number
): string => {
  const nationalStr = `#${nationalId.toString().padStart(4, '0')}`;
  const regionalStr = `#${regionalDexNumber.toString().padStart(3, '0')}`;
  return `${regionalStr} / ${nationalStr}`;
};

/**
 * Formats a kebab-case name for display.
 * Converts "pallet-town-area" to "Pallet Town Area"
 */
const formatKebabCase = (name: string): string => {
  return name
    .split('-')
    .map((part) => capitalize(part))
    .join(' ');
};

/**
 * Region prefixes used in PokeAPI location names.
 */
const REGION_PREFIXES = [
  'kanto-',
  'johto-',
  'hoenn-',
  'sinnoh-',
  'unova-',
  'kalos-',
  'alola-',
  'galar-',
  'paldea-',
  'hisui-',
  'pasio-',
  'kitakami-',
  'blueberry-',
];

/**
 * Formats a location area name for display.
 * Removes region prefix and "-area" suffix unless the area has a specific name.
 * "kanto-route-12-area" → "Route 12"
 * "kanto-viridian-forest-area" → "Viridian Forest"
 */
const formatLocationName = (name: string): string => {
  let result = name;

  // Remove region prefix
  for (const prefix of REGION_PREFIXES) {
    if (result.startsWith(prefix)) {
      result = result.slice(prefix.length);
      break;
    }
  }

  // Remove trailing "-area" if it's just a generic area marker
  if (result.endsWith('-area')) {
    result = result.slice(0, -5);
  }

  return formatKebabCase(result);
};

/**
 * Maps PokeAPI version names to game group info.
 * Sort order: higher = more recent.
 */
const VERSION_TO_GAME_GROUP: Record<string, { abbrev: string; order: number }> =
  {
    // Gen 1
    red: { abbrev: 'RB', order: 1 },
    blue: { abbrev: 'RB', order: 1 },
    yellow: { abbrev: 'Y', order: 2 },
    // Gen 2
    gold: { abbrev: 'GS', order: 3 },
    silver: { abbrev: 'GS', order: 3 },
    crystal: { abbrev: 'C', order: 4 },
    // Gen 3
    ruby: { abbrev: 'RS', order: 5 },
    sapphire: { abbrev: 'RS', order: 5 },
    emerald: { abbrev: 'E', order: 6 },
    firered: { abbrev: 'FRLG', order: 7 },
    leafgreen: { abbrev: 'FRLG', order: 7 },
    // Gen 4
    diamond: { abbrev: 'DP', order: 8 },
    pearl: { abbrev: 'DP', order: 8 },
    platinum: { abbrev: 'Pt', order: 9 },
    heartgold: { abbrev: 'HGSS', order: 10 },
    soulsilver: { abbrev: 'HGSS', order: 10 },
    // Gen 5
    black: { abbrev: 'BW', order: 11 },
    white: { abbrev: 'BW', order: 11 },
    'black-2': { abbrev: 'B2W2', order: 12 },
    'white-2': { abbrev: 'B2W2', order: 12 },
    // Gen 6
    x: { abbrev: 'XY', order: 13 },
    y: { abbrev: 'XY', order: 14 },
    'omega-ruby': { abbrev: 'ORAS', order: 15 },
    'alpha-sapphire': { abbrev: 'ORAS', order: 15 },
    // Gen 7
    sun: { abbrev: 'SM', order: 16 },
    moon: { abbrev: 'SM', order: 16 },
    'ultra-sun': { abbrev: 'USUM', order: 17 },
    'ultra-moon': { abbrev: 'USUM', order: 17 },
    'lets-go-pikachu': { abbrev: 'LGPE', order: 18 },
    'lets-go-eevee': { abbrev: 'LGPE', order: 18 },
    // Gen 8
    sword: { abbrev: 'SwSh', order: 19 },
    shield: { abbrev: 'SwSh', order: 19 },
    'brilliant-diamond': { abbrev: 'BDSP', order: 20 },
    'shining-pearl': { abbrev: 'BDSP', order: 20 },
    'legends-arceus': { abbrev: 'PLA', order: 21 },
    // Gen 9
    scarlet: { abbrev: 'SV', order: 22 },
    violet: { abbrev: 'SV', order: 22 },
  };

const getGameGroup = (
  version: string
): { abbrev: string; order: number } | null => {
  return VERSION_TO_GAME_GROUP[version] ?? null;
};

interface LocationsByMethod {
  method: string;
  areas: string[];
}

interface LocationByGameGroup {
  abbrev: string;
  order: number;
  methods: LocationsByMethod[];
}

/**
 * Transforms LocationAreaEncounter[] into a hierarchy grouped by game group → method → areas.
 * Sorted from most recent to oldest.
 */
const groupLocationsByGameGroup = (
  locationAreas: LocationAreaEncounter[]
): LocationByGameGroup[] => {
  // gameMap: abbrev → { order, methodMap: method → Set<areaName> }
  const gameMap = new Map<
    string,
    { order: number; methodMap: Map<string, Set<string>> }
  >();

  for (const area of locationAreas) {
    const areaName = area.location_area.name;

    for (const versionDetail of area.version_details) {
      const gameGroup = getGameGroup(versionDetail.version.name);
      if (!gameGroup) continue;

      const { abbrev, order } = gameGroup;

      if (!gameMap.has(abbrev)) {
        gameMap.set(abbrev, { order, methodMap: new Map() });
      }
      const { methodMap } = gameMap.get(abbrev)!;

      for (const encounter of versionDetail.encounter_details) {
        const method = encounter.method.name;

        if (!methodMap.has(method)) {
          methodMap.set(method, new Set());
        }
        methodMap.get(method)!.add(areaName);
      }
    }
  }

  const result: LocationByGameGroup[] = [];
  for (const [abbrev, { order, methodMap }] of gameMap) {
    const methods: LocationsByMethod[] = [];
    for (const [method, areaSet] of methodMap) {
      const areas = Array.from(areaSet).sort();
      methods.push({ method, areas });
    }
    // Sort methods alphabetically
    methods.sort((a, b) => a.method.localeCompare(b.method));
    result.push({ abbrev, order, methods });
  }

  // Sort from most recent (highest order) to oldest (lowest order)
  return result.sort((a, b) => b.order - a.order);
};

export const DexEntryDetailView = ({
  pokemon,
  species,
  locationAreas,
  game,
  gameDex,
  regionalDexNumber,
}: DexEntryDetailViewProps) => {
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

        {/* Locations */}
        {locationAreas.length > 0 && (
          <div className="bg-surface rounded-xl p-6">
            <h2 className="text-lg font-medium text-text mb-4">Locations</h2>
            <div className="space-y-4">
              {groupLocationsByGameGroup(locationAreas).map((gameData) => (
                <div key={gameData.abbrev}>
                  <h3 className="text-sm font-medium text-text mb-2">
                    {gameData.abbrev}
                  </h3>
                  <div className="space-y-2 ml-3">
                    {gameData.methods.map((methodData) => (
                      <div key={methodData.method}>
                        <p className="text-sm text-text">
                          {formatKebabCase(methodData.method)}
                        </p>
                        <p className="text-xs text-text/70 ml-3">
                          {methodData.areas
                            .map((area) => formatLocationName(area))
                            .join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
