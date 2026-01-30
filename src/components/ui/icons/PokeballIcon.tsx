interface PokeballIconProps {
  className?: string;
}

export const PokeballIcon = ({ className }: PokeballIconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="10"
    >
      <circle cx="50" cy="50" r="42" />
      <line x1="8" y1="50" x2="42" y2="50" />
      <line x1="58" y1="50" x2="92" y2="50" />
      <circle cx="50" cy="50" r="12" />
    </svg>
  );
};
