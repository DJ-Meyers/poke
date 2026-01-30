interface ChecklistIconProps {
  className?: string;
}

export const ChecklistIcon = ({ className }: ChecklistIconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5l2 2 4-4" />
      <line x1="12" y1="5" x2="20" y2="5" />
      <path d="M4 12l2 2 4-4" />
      <line x1="12" y1="12" x2="20" y2="12" />
      <path d="M4 19l2 2 4-4" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
};
