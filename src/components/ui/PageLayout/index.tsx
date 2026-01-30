import { BackButton } from '~/components/ui/BackButton';
import { ProgressBar } from '~/components/ui/ProgressBar';

interface PageLayoutProps {
  /** Page title */
  title: string;
  /** URL for the back button */
  backTo: string;
  /** Optional progress tracking */
  progress?: {
    current: number;
    total: number;
  };
  /** Optional subtitle shown below the title */
  subtitle?: string;
  /** Page content */
  children: React.ReactNode;
}

/**
 * Common page layout with header, optional progress bar, and constrained content.
 */
export const PageLayout = ({
  title,
  backTo,
  progress,
  subtitle,
  children,
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-surface border-b border-surface-hover">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className={`flex items-center gap-3 ${progress ? 'mb-2' : ''}`}>
            <BackButton to={backTo} />
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{title}</h1>
              {subtitle && (
                <p className="text-sm text-text-muted">{subtitle}</p>
              )}
            </div>
            {progress && (
              <span className="text-sm text-text-muted">
                {progress.current} / {progress.total}
              </span>
            )}
          </div>

          {progress && (
            <ProgressBar value={progress.current} max={progress.total} />
          )}
        </div>
      </header>

      {/* Spacer to match dex tabs height for consistent header size */}
      <nav className="bg-surface shrink-0 shadow-md shadow-black/20">
        <div className="max-w-md mx-auto flex">
          <div className="flex-1 px-4 py-3 text-center text-sm font-medium border-b-2 border-transparent">
            &nbsp;
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-md mx-auto">{children}</main>
    </div>
  );
};
