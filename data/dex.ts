/**
 * Static data constants for Pokédex information.
 * Contains enums, types, and data mappings for games and dexes.
 */

// LGPE
import lgpeKanto from './dexes/LGPE/kanto.json';

// SwSh
import swshGalar from './dexes/SwSh/galar.json';
import swshIsleOfArmor from './dexes/SwSh/isle_of_armor.json';
import swshCrownTundra from './dexes/SwSh/crown_tundra.json';

// BDSP
import bdspSinnoh from './dexes/BDSP/sinnoh.json';

// PLA
import plaHisui from './dexes/PLA/hisui.json';

// SV
import svPaldea from './dexes/SV/paldea.json';
import svKitakami from './dexes/SV/kitakami.json';
import svBlueberry from './dexes/SV/blueberry.json';

// PLZA
import plzaKalos from './dexes/PLZA/kalos.json';
import plzaMegaDimension from './dexes/PLZA/mega_dimension.json';

/**
 * Enum of all available game dexes.
 */
export const GameDex = {
  // National
  NATIONAL: 'NATIONAL',
  // LGPE
  LGPE_KANTO: 'LGPE_KANTO',
  // SwSh
  SWSH_GALAR: 'SWSH_GALAR',
  SWSH_ISLE_OF_ARMOR: 'SWSH_ISLE_OF_ARMOR',
  SWSH_CROWN_TUNDRA: 'SWSH_CROWN_TUNDRA',
  // BDSP
  BDSP_SINNOH: 'BDSP_SINNOH',
  // PLA
  PLA_HISUI: 'PLA_HISUI',
  // SV
  SV_PALDEA: 'SV_PALDEA',
  SV_KITAKAMI: 'SV_KITAKAMI',
  SV_BLUEBERRY: 'SV_BLUEBERRY',
  // PLZA
  PLZA_KALOS: 'PLZA_KALOS',
  PLZA_MEGA_DIMENSION: 'PLZA_MEGA_DIMENSION',
} as const;

export type GameDex = (typeof GameDex)[keyof typeof GameDex];

/** GameDex values that have data in DEX_DATA (excludes NATIONAL). */
export type RegularGameDex = Exclude<GameDex, 'NATIONAL'>;

/**
 * Enum of all available games.
 */
export const Game = {
  LGPE: 'LGPE',
  SWSH: 'SWSH',
  BDSP: 'BDSP',
  PLA: 'PLA',
  SV: 'SV',
  PLZA: 'PLZA',
} as const;

export type Game = (typeof Game)[keyof typeof Game];

/**
 * Data entry for a single dex.
 */
export interface DexDataEntry {
  game: Game;
  gameDisplayName: string;
  dexDisplayName: string;
  pokemonIds: number[];
}

/**
 * Complete data for all dexes, keyed by GameDex (excludes NATIONAL which has no static data).
 */
export const DEX_DATA: Record<RegularGameDex, DexDataEntry> = {
  [GameDex.LGPE_KANTO]: {
    game: Game.LGPE,
    gameDisplayName: "Let's Go Pikachu & Eevee",
    dexDisplayName: 'Kanto',
    pokemonIds: lgpeKanto,
  },
  [GameDex.SWSH_GALAR]: {
    game: Game.SWSH,
    gameDisplayName: 'Sword & Shield',
    dexDisplayName: 'Galar',
    pokemonIds: swshGalar,
  },
  [GameDex.SWSH_ISLE_OF_ARMOR]: {
    game: Game.SWSH,
    gameDisplayName: 'Sword & Shield',
    dexDisplayName: 'Isle of Armor',
    pokemonIds: swshIsleOfArmor,
  },
  [GameDex.SWSH_CROWN_TUNDRA]: {
    game: Game.SWSH,
    gameDisplayName: 'Sword & Shield',
    dexDisplayName: 'Crown Tundra',
    pokemonIds: swshCrownTundra,
  },
  [GameDex.BDSP_SINNOH]: {
    game: Game.BDSP,
    gameDisplayName: 'Brilliant Diamond & Shining Pearl',
    dexDisplayName: 'Sinnoh',
    pokemonIds: bdspSinnoh,
  },
  [GameDex.PLA_HISUI]: {
    game: Game.PLA,
    gameDisplayName: 'Legends: Arceus',
    dexDisplayName: 'Hisui',
    pokemonIds: plaHisui,
  },
  [GameDex.SV_PALDEA]: {
    game: Game.SV,
    gameDisplayName: 'Scarlet & Violet',
    dexDisplayName: 'Paldea',
    pokemonIds: svPaldea,
  },
  [GameDex.SV_KITAKAMI]: {
    game: Game.SV,
    gameDisplayName: 'Scarlet & Violet',
    dexDisplayName: 'Kitakami',
    pokemonIds: svKitakami,
  },
  [GameDex.SV_BLUEBERRY]: {
    game: Game.SV,
    gameDisplayName: 'Scarlet & Violet',
    dexDisplayName: 'Blueberry',
    pokemonIds: svBlueberry,
  },
  [GameDex.PLZA_KALOS]: {
    game: Game.PLZA,
    gameDisplayName: 'Legends: Z-A',
    dexDisplayName: 'Kalos',
    pokemonIds: plzaKalos,
  },
  [GameDex.PLZA_MEGA_DIMENSION]: {
    game: Game.PLZA,
    gameDisplayName: 'Legends: Z-A',
    dexDisplayName: 'Mega Dimension',
    pokemonIds: plzaMegaDimension,
  },
};

/**
 * Mapping of games to their available dexes.
 */
export const GAME_DEXES: Record<Game, RegularGameDex[]> = {
  [Game.LGPE]: [GameDex.LGPE_KANTO],
  [Game.SWSH]: [
    GameDex.SWSH_GALAR,
    GameDex.SWSH_ISLE_OF_ARMOR,
    GameDex.SWSH_CROWN_TUNDRA,
  ],
  [Game.BDSP]: [GameDex.BDSP_SINNOH],
  [Game.PLA]: [GameDex.PLA_HISUI],
  [Game.SV]: [GameDex.SV_PALDEA, GameDex.SV_KITAKAMI, GameDex.SV_BLUEBERRY],
  [Game.PLZA]: [GameDex.PLZA_KALOS, GameDex.PLZA_MEGA_DIMENSION],
};
