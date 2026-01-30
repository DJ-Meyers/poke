const BOX_SIZE = 30;

// Generation boundaries by national dex number (last Pokemon of each gen)
const GENERATION_BOUNDARIES = [151, 251, 386, 493, 649, 721, 809, 905, 1025];

function getGeneration(nationalDexId: number): number {
  for (let i = 0; i < GENERATION_BOUNDARIES.length; i++) {
    if (nationalDexId <= GENERATION_BOUNDARIES[i]) {
      return i + 1;
    }
  }
  return GENERATION_BOUNDARIES.length + 1;
}

export interface Box {
  boxNumber: number;
  startDexNumber: number;
  endDexNumber: number;
  pokemonIds: number[];
}

/** Calculate boxes from the full list of Pokemon IDs (unfiltered). */
export function calculateBoxes(
  pokemonIds: number[],
  respectGenerationBoundaries: boolean
): Box[] {
  if (pokemonIds.length === 0) return [];

  const boxes: Box[] = [];
  let currentBox: number[] = [];
  let currentBoxStartDex = 1;
  let currentGen = getGeneration(pokemonIds[0]);
  let boxNumber = 1;

  for (let i = 0; i < pokemonIds.length; i++) {
    const pokemonId = pokemonIds[i];
    const pokemonGen = getGeneration(pokemonId);
    const dexNumber = i + 1;

    // Start a new box if box is full, or if generation changes (national dex only)
    const generationChanged =
      respectGenerationBoundaries && pokemonGen !== currentGen;
    if (
      currentBox.length > 0 &&
      (generationChanged || currentBox.length >= BOX_SIZE)
    ) {
      boxes.push({
        boxNumber,
        startDexNumber: currentBoxStartDex,
        endDexNumber: dexNumber - 1,
        pokemonIds: [...currentBox],
      });
      boxNumber++;
      currentBox = [];
      currentBoxStartDex = dexNumber;
      currentGen = pokemonGen;
    }

    currentBox.push(pokemonId);
  }

  // Add the last box
  if (currentBox.length > 0) {
    boxes.push({
      boxNumber,
      startDexNumber: currentBoxStartDex,
      endDexNumber: pokemonIds.length,
      pokemonIds: currentBox,
    });
  }

  return boxes;
}
