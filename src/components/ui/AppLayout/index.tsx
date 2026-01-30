import { Header } from '~/components/ui/Header';
import { ProgressBar } from '~/components/ui/ProgressBar';

interface AppLayoutProps {
  /** Page title */
  title: string;
  /** URL for back navigation (omit for no back button) */
  backTo?: string;
  /** Progress tracking (shows count and bar) */
  progress?: {
    current: number;
    total: number;
  };
  /** Content for the subheader area (tabs, links, or spacer) */
  subheader?: React.ReactNode;
  /** Hide the subheader area entirely */
  hideSubheader?: boolean;
  /** Custom header children (overrides progress bar) */
  headerChildren?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
}

/**
 * Shared app layout component for consistent page structure.
 * Provides header, optional subheader, and main content area.
 */
export const AppLayout = ({
  title,
  backTo,
  progress,
  subheader,
  hideSubheader,
  headerChildren,
  children,
}: AppLayoutProps) => {
  return (
    <div className="h-dvh flex flex-col bg-bg text-text overflow-hidden">
      <Header
        title={title}
        backTo={backTo}
        nav={
          hideSubheader
            ? undefined
            : (subheader ?? (
                <div className="flex-1 px-4 py-3 text-center text-sm font-medium border-b-2 border-transparent">
                  &nbsp;
                </div>
              ))
        }
        rightContent={
          progress && (
            <span className="text-sm text-text-muted">
              {progress.current} / {progress.total}
            </span>
          )
        }
      >
        {headerChildren ??
          (progress && (
            <ProgressBar value={progress.current} max={progress.total} />
          ))}
      </Header>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-md lg:max-w-4xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
};
