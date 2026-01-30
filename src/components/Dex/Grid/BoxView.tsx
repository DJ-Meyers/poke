import { Suspense, type ReactNode, Component } from 'react';
import { DexEntry } from '~/components/Dex/Entry';
import type { OriginMark } from '~/components/Dex/Entry/origin-marks';

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

interface Box {
  boxNumber: number;
  startDexNumber: number;
  endDexNumber: number;
  pokemonIds: number[];
}

/** Calculate boxes from the full list of Pokemon IDs (unfiltered). */
function calculateBoxes(
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

/** Pulse placeholder that mirrors DexEntryView's layout to prevent shift. */
function DexEntryPlaceholder() {
  return (
    <div className="relative flex flex-col items-center justify-center aspect-square w-full">
      <div className="absolute inset-0 rounded-lg bg-gray-700 animate-pulse" />
      <div className="relative z-10 w-16 h-16" />
      <div className="relative z-10 text-center">
        <span className="block text-xs leading-tight">&nbsp;</span>
        <span className="block text-[10px]">&nbsp;</span>
      </div>
    </div>
  );
}

/** Per-entry error boundary so one failed fetch doesn't break the grid. */
class DexEntryErrorBoundary extends Component<
  { pokemonId: number; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { pokemonId: number; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative flex flex-col items-center justify-center w-24 h-24 p-1">
          <div className="absolute inset-0 rounded-lg bg-red-900/50" />
          <span className="relative z-10 text-xs font-medium text-white/50">
            Error loading #{this.props.pokemonId}
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}

interface BoxViewProps {
  pokemonIds: number[];
  filteredIds: Set<number>;
  dexNumberMap: Map<number, number>;
  caughtIds: Set<number>;
  onPrimaryAction?: (pokemonId: number) => void;
  onSecondaryAction?: (pokemonId: number) => void;
  getOriginMarks?: (pokemonId: number) => OriginMark[];
  /** When true, boxes break at generation boundaries (for National Dex) */
  respectGenerationBoundaries?: boolean;
}

export function BoxView({
  pokemonIds,
  filteredIds,
  dexNumberMap,
  caughtIds,
  onPrimaryAction,
  onSecondaryAction,
  getOriginMarks,
  respectGenerationBoundaries = false,
}: BoxViewProps) {
  const boxes = calculateBoxes(pokemonIds, respectGenerationBoundaries);

  return (
    <div className="px-4 pb-3">
      {boxes.map((box, index) => {
        // Filter Pokemon in this box based on current filters
        const visiblePokemon = box.pokemonIds.filter((id) =>
          filteredIds.has(id)
        );
        const isLastBox = index === boxes.length - 1;

        return (
          <div key={box.boxNumber}>
            {/* Box header */}
            <h3 className="text-sm font-medium text-text-muted py-3">
              Box {box.boxNumber}: {box.startDexNumber}-{box.endDexNumber}
            </h3>

            {/* Pokemon grid for this box */}
            {visiblePokemon.length > 0 ? (
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                {visiblePokemon.map((pokemonId) => {
                  const regionalDexNumber = dexNumberMap.get(pokemonId) ?? 0;
                  return (
                    <div key={pokemonId} className="w-full">
                      <DexEntryErrorBoundary pokemonId={pokemonId}>
                        <Suspense fallback={<DexEntryPlaceholder />}>
                          <DexEntry
                            pokemonId={pokemonId}
                            isComplete={caughtIds.has(pokemonId)}
                            onPrimaryAction={onPrimaryAction}
                            onSecondaryAction={onSecondaryAction}
                            regionalDexNumber={regionalDexNumber}
                            originMarks={getOriginMarks?.(pokemonId)}
                          />
                        </Suspense>
                      </DexEntryErrorBoundary>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-text-muted/50 py-2">
                No Pokemon visible
              </p>
            )}

            {/* Divider between boxes */}
            {!isLastBox && (
              <div className="mt-4 mb-2 border-t border-surface-hover" />
            )}
          </div>
        );
      })}
    </div>
  );
}
