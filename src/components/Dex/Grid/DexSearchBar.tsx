interface DexSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hideCompleted: boolean;
  onHideCompletedChange: (hide: boolean) => void;
  filteredCount: number;
  totalCount: number;
}

export function DexSearchBar({
  searchQuery,
  onSearchChange,
  hideCompleted,
  onHideCompletedChange,
  filteredCount,
  totalCount,
}: DexSearchBarProps) {
  const isFiltered = searchQuery.length > 0 || hideCompleted;

  return (
    <div className="sticky top-0 z-20 px-4 pt-4 pb-3 flex flex-col gap-1.5 w-3/4 max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          {/* Magnifying glass icon */}
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or number"
            className="w-full pl-9 pr-9 py-2 rounded-lg bg-surface text-text text-sm border border-surface-hover placeholder:text-text-muted/50 focus:outline-none focus:border-primary"
          />
          {/* Clear button */}
          {searchQuery.length > 0 && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
        {/* Hide completed toggle */}
        <button
          onClick={() => onHideCompletedChange(!hideCompleted)}
          title="Hide completed"
          aria-label="Hide completed"
          className={`flex-shrink-0 p-2 rounded-lg border transition-colors cursor-pointer ${
            hideCompleted
              ? 'bg-primary/15 border-primary text-primary'
              : 'bg-surface border-surface-hover text-text-muted/50 hover:text-text-muted'
          }`}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Checklist: three rows with checkmarks and lines */}
            <path d="M4 5l2 2 4-4" />
            <line x1="12" y1="5" x2="20" y2="5" />
            <path d="M4 12l2 2 4-4" />
            <line x1="12" y1="12" x2="20" y2="12" />
            <path d="M4 19l2 2 4-4" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
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
