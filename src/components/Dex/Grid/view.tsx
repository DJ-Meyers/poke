import {
  useCallback,
  useState,
  forwardRef,
  type ComponentPropsWithoutRef,
} from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { DexEntry } from '~/components/Dex/Entry';
import { isNationalDex, type GameDex } from '~/utils/dex-data';
import { DexSearchBar } from './DexSearchBar';
import { useDexFilter } from './use-dex-filter';
import { BoxView } from './BoxView';

interface DexGridViewProps {
  pokemonIds: number[];
  caughtIds: Set<number>;
  gameDex: GameDex;
}

const GridList = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  (props, ref) => (
    <div
      ref={ref}
      {...props}
      className="grid grid-cols-3 lg:grid-cols-6 gap-3 px-4 pb-3"
    />
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
  gameDex,
}: DexGridViewProps) {
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setScrollParent(node?.closest('main') ?? null);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [hideCompleted, setHideCompleted] = useState(() => {
    try {
      return localStorage.getItem('dex:hideCompleted') === 'true';
    } catch {
      return false;
    }
  });
  const [showBoxView, setShowBoxView] = useState(() => {
    try {
      return localStorage.getItem('dex:showBoxView') === 'true';
    } catch {
      return false;
    }
  });

  const handleHideCompletedChange = (value: boolean) => {
    setHideCompleted(value);
    try {
      localStorage.setItem('dex:hideCompleted', String(value));
    } catch {
      // Ignore localStorage errors
    }
  };

  const handleShowBoxViewChange = (value: boolean) => {
    setShowBoxView(value);
    try {
      localStorage.setItem('dex:showBoxView', String(value));
    } catch {
      // Ignore localStorage errors
    }
  };

  const { filteredIds } = useDexFilter({
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
        onHideCompletedChange={handleHideCompletedChange}
        filteredCount={filteredIds.length}
        totalCount={pokemonIds.length}
        showBoxView={showBoxView}
        onShowBoxViewChange={handleShowBoxViewChange}
      />
      {showBoxView ? (
        <BoxView
          pokemonIds={pokemonIds}
          filteredIds={new Set(filteredIds)}
          gameDex={gameDex}
          respectGenerationBoundaries={isNationalDex(gameDex)}
        />
      ) : filteredIds.length === 0 &&
        (searchQuery.length > 0 || hideCompleted) ? (
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
              return <DexEntry pokemonId={pokemonId} gameDex={gameDex} />;
            }}
          />
        )
      )}
    </div>
  );
}
