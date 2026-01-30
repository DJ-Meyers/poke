import {
  SearchIcon,
  ClearIcon,
  ChecklistIcon,
  GridIcon,
} from '~/components/ui/icons';

interface DexSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hideCompleted: boolean;
  onHideCompletedChange: (hide: boolean) => void;
  filteredCount: number;
  totalCount: number;
  showBoxView: boolean;
  onShowBoxViewChange: (show: boolean) => void;
}

export function DexSearchBar({
  searchQuery,
  onSearchChange,
  hideCompleted,
  onHideCompletedChange,
  filteredCount,
  totalCount,
  showBoxView,
  onShowBoxViewChange,
}: DexSearchBarProps) {
  const isFiltered = searchQuery.length > 0 || hideCompleted;

  return (
    <div className="sticky top-0 z-20 px-4 pt-4 pb-3 flex flex-col gap-1.5 w-3/4 max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or number"
            className="w-full pl-9 pr-9 py-2 rounded-lg bg-surface text-text text-sm border border-surface-hover placeholder:text-text-muted/50 focus:outline-none focus:border-primary"
          />
          {searchQuery.length > 0 && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
              aria-label="Clear search"
            >
              <ClearIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => onHideCompletedChange(!hideCompleted)}
          title="Hide completed"
          aria-label="Hide completed"
          className={`flex-shrink-0 p-2 rounded-lg border transition-colors cursor-pointer ${
            hideCompleted
              ? 'bg-primary border-primary text-white'
              : 'bg-surface border-surface-hover text-text-muted/50 hover:text-text-muted'
          }`}
        >
          <ChecklistIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onShowBoxViewChange(!showBoxView)}
          title="Box view"
          aria-label="Box view"
          className={`flex-shrink-0 p-2 rounded-lg border transition-colors cursor-pointer ${
            showBoxView
              ? 'bg-primary border-primary text-white'
              : 'bg-surface border-surface-hover text-text-muted/50 hover:text-text-muted'
          }`}
        >
          <GridIcon className="w-5 h-5" />
        </button>
      </div>
      {isFiltered && (
        <span className="text-xs text-text-muted">
          Showing {filteredCount} of {totalCount}
        </span>
      )}
    </div>
  );
}
