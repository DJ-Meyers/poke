import { GameClient } from 'pokenode-ts';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'dexes');

interface PokedexConfig {
  apiName: string;
  fileName: string;
}

interface GameConfig {
  gameAbbr: string;
  pokedexes: PokedexConfig[];
}

const GAME_CONFIGS: GameConfig[] = [
  {
    gameAbbr: 'LGPE',
    pokedexes: [{ apiName: 'letsgo-kanto', fileName: 'kanto.json' }],
  },
  {
    gameAbbr: 'SwSh',
    pokedexes: [
      { apiName: 'galar', fileName: 'galar.json' },
      { apiName: 'isle-of-armor', fileName: 'isle_of_armor.json' },
      { apiName: 'crown-tundra', fileName: 'crown_tundra.json' },
    ],
  },
  {
    gameAbbr: 'BDSP',
    pokedexes: [{ apiName: 'original-sinnoh', fileName: 'sinnoh.json' }],
  },
  {
    gameAbbr: 'PLA',
    pokedexes: [{ apiName: 'hisui', fileName: 'hisui.json' }],
  },
  {
    gameAbbr: 'SV',
    pokedexes: [
      { apiName: 'paldea', fileName: 'paldea.json' },
      { apiName: 'kitakami', fileName: 'kitakami.json' },
      { apiName: 'blueberry', fileName: 'blueberry.json' },
    ],
  },
  {
    gameAbbr: 'PLZA',
    pokedexes: [
      { apiName: 'lumiose-city', fileName: 'kalos.json' },
      { apiName: 'hyperspace', fileName: 'mega_dimension.json' },
    ],
  },
];

const extractPokemonId = (url: string): number => {
  // URL format: https://pokeapi.co/api/v2/pokemon-species/{id}/
  const match = url.match(/\/pokemon-species\/(\d+)\//);
  if (!match) {
    throw new Error(`Could not extract pokemon ID from URL: ${url}`);
  }
  return parseInt(match[1], 10);
};

const fetchAndSavePokedex = async (
  client: GameClient,
  gameAbbr: string,
  config: PokedexConfig
): Promise<void> => {
  console.log(`Fetching ${config.apiName} for ${gameAbbr}...`);

  const pokedex = await client.getPokedexByName(config.apiName);

  // Extract pokemon IDs in pokedex order
  const pokemonIds = pokedex.pokemon_entries.map((entry) =>
    extractPokemonId(entry.pokemon_species.url)
  );

  const outputDir = join(DATA_DIR, gameAbbr);
  mkdirSync(outputDir, { recursive: true });

  const outputPath = join(outputDir, config.fileName);
  writeFileSync(outputPath, JSON.stringify(pokemonIds, null, 2));

  console.log(
    `  Saved ${pokemonIds.length} pokemon IDs to ${gameAbbr}/${config.fileName}`
  );
};

const main = async (): Promise<void> => {
  const client = new GameClient();

  console.log('Fetching Pokedex data from PokeAPI...\n');

  for (const game of GAME_CONFIGS) {
    for (const pokedex of game.pokedexes) {
      await fetchAndSavePokedex(client, game.gameAbbr, pokedex);
    }
    console.log();
  }

  console.log('Done!');
};

main().catch(console.error);
