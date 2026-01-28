interface ProgressInfoProps {
  /** Current value */
  current: number;
  /** Total value */
  total: number;
  /** Size variant (default: 'sm') */
  size?: 'xs' | 'sm';
}

/**
 * Displays progress as "current / total" and percentage.
 */
export function ProgressInfo({
  current,
  total,
  size = 'sm',
}: ProgressInfoProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  const textSize = size === 'xs' ? 'text-xs' : 'text-sm';

  return (
    <div
      className={`flex items-center justify-between ${textSize} text-text-muted`}
    >
      <span>
        {current} / {total}
      </span>
      <span>{percent}%</span>
    </div>
  );
}
