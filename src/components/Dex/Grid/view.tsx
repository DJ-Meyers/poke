import {
  Suspense,
  useCallback,
  useState,
  Component,
  forwardRef,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { DexEntry } from '~/components/Dex/Entry';
import type { OriginMark } from '~/components/Dex/Entry/origin-marks';
import { DexSearchBar } from './DexSearchBar';
import { useDexFilter } from './use-dex-filter';

interface DexGridViewProps {
  pokemonIds: number[];
  caughtIds: Set<number>;
  onToggleCaught?: (pokemonId: number) => void;
  onContextMenu?: (pokemonId: number) => void;
  getOriginMarks?: (pokemonId: number) => OriginMark[];
}

/** Pulse placeholder that mirrors DexEntryView's layout to prevent shift. */
function DexEntryPlaceholder() {
  return (
    <div className="relative flex flex-col items-center justify-center aspect-square w-full">
      <div className="absolute inset-0 rounded-lg bg-gray-700 animate-pulse" />
      {/* Matches the w-16 h-16 sprite container in DexEntryView */}
      <div className="relative z-10 w-16 h-16" />
      {/* Matches the name + dex number text block in DexEntryView */}
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

const GridList = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  (props, ref) => (
    <div ref={ref} {...props} className="grid grid-cols-3 gap-3 px-4 pb-3" />
  )
);
GridList.displayName = 'GridList';

const GridItem = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  (props, ref) => <div ref={ref} {...props} />
);
GridItem.displayName = 'GridItem';

/**
 * Renders a virtualized grid of Pokemon entries in 3 columns.
 * Only renders visible items for better performance with large dexes.
 */
export function DexGridView({
  pokemonIds,
  caughtIds,
  onToggleCaught,
  onContextMenu,
  getOriginMarks,
}: DexGridViewProps) {
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setScrollParent(node?.closest('main') ?? null);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);

  const { filteredIds, dexNumberMap } = useDexFilter({
    pokemonIds,
    caughtIds,
    searchQuery,
    hideCompleted,
  });

  return (
    <div ref={containerRef}>
      <DexSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        hideCompleted={hideCompleted}
        onHideCompletedChange={setHideCompleted}
        filteredCount={filteredIds.length}
        totalCount={pokemonIds.length}
      />
      {filteredIds.length === 0 && (searchQuery.length > 0 || hideCompleted) ? (
        <p className="text-text-muted text-sm text-center pt-12">
          {searchQuery.length > 0
            ? 'No Pokemon found matching your search'
            : 'All Pokemon in this dex are caught!'}
        </p>
      ) : (
        scrollParent && (
          <VirtuosoGrid
            totalCount={filteredIds.length}
            customScrollParent={scrollParent}
            components={{ List: GridList, Item: GridItem }}
            itemContent={(index: number) => {
              const pokemonId = filteredIds[index];
              const regionalDexNumber =
                dexNumberMap.get(pokemonId) ?? index + 1;
              return (
                <div className="w-full">
                  <DexEntryErrorBoundary pokemonId={pokemonId}>
                    <Suspense fallback={<DexEntryPlaceholder />}>
                      <DexEntry
                        pokemonId={pokemonId}
                        isComplete={caughtIds.has(pokemonId)}
                        onClick={onToggleCaught}
                        onContextMenu={onContextMenu}
                        regionalDexNumber={regionalDexNumber}
                        originMarks={getOriginMarks?.(pokemonId)}
                      />
                    </Suspense>
                  </DexEntryErrorBoundary>
                </div>
              );
            }}
          />
        )
      )}
    </div>
  );
}
