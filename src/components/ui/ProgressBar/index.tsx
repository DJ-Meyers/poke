interface ProgressBarProps {
  /** Current value */
  value: number;
  /** Maximum value */
  max: number;
}

/**
 * A reusable progress bar component.
 */
export function ProgressBar({ value, max }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className="h-1.5 bg-bg rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
