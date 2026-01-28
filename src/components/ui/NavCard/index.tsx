import { Link } from 'react-router';
import { ProgressBar } from '~/components/ui/ProgressBar';

interface NavCardProps {
  /** URL to navigate to */
  to: string;
  /** Card title */
  title: string;
  /** Optional progress tracking */
  progress?: {
    current: number;
    total: number;
  };
}

/**
 * A navigation card with optional progress bar.
 * Used for linking to sub-sections like individual dexes.
 */
export function NavCard({ to, title, progress }: NavCardProps) {
  return (
    <Link
      to={to}
      className="block bg-surface hover:bg-surface-hover rounded-lg p-4 transition-colors"
    >
      <div
        className={`flex items-center justify-between ${progress ? 'mb-2' : ''}`}
      >
        <span className="font-medium">{title}</span>
        {progress && (
          <span className="text-sm text-text-muted">
            {progress.current} / {progress.total}
          </span>
        )}
      </div>
      {progress && (
        <ProgressBar value={progress.current} max={progress.total} />
      )}
    </Link>
  );
}
