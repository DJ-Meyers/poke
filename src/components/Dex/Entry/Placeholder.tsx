/** Pulse placeholder that mirrors DexEntryView's layout to prevent shift. */
export function DexEntryPlaceholder() {
  return (
    <div className="relative flex flex-col items-center justify-center aspect-square w-full">
      <div className="absolute inset-0 rounded-lg bg-gray-700 animate-pulse" />
      <div className="relative z-10 w-16 h-16" />
      <div className="relative z-10 text-center">
        <span className="block text-xs leading-tight">&nbsp;</span>
        <span className="block text-[10px]">&nbsp;</span>
      </div>
    </div>
  );
}
