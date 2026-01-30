import { DexEntry } from '~/components/Dex/Entry';
import type { GameDex } from '~/utils/dex-data';
import { calculateBoxes } from '~/utils/box-calculator';

interface BoxViewProps {
  pokemonIds: number[];
  filteredIds: Set<number>;
  gameDex: GameDex;
  /** When true, boxes break at generation boundaries (for National Dex) */
  respectGenerationBoundaries?: boolean;
}

export function BoxView({
  pokemonIds,
  filteredIds,
  gameDex,
  respectGenerationBoundaries = false,
}: BoxViewProps) {
  const boxes = calculateBoxes(pokemonIds, respectGenerationBoundaries);

  return (
    <div className="px-4 pb-3">
      {boxes.map((box, index) => {
        const visiblePokemon = box.pokemonIds.filter((id) =>
          filteredIds.has(id)
        );
        const isLastBox = index === boxes.length - 1;

        return (
          <div key={box.boxNumber}>
            <h3 className="text-sm font-medium text-text-muted py-3">
              Box {box.boxNumber}: {box.startDexNumber}-{box.endDexNumber}
            </h3>

            {visiblePokemon.length > 0 ? (
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                {visiblePokemon.map((pokemonId) => (
                  <DexEntry
                    key={pokemonId}
                    pokemonId={pokemonId}
                    gameDex={gameDex}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted/50 py-2">
                No Pokemon visible
              </p>
            )}

            {!isLastBox && (
              <div className="mt-4 mb-2 border-t border-surface-hover" />
            )}
          </div>
        );
      })}
    </div>
  );
}
