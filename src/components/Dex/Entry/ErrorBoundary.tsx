import { Component, type ReactNode } from 'react';

/** Per-entry error boundary so one failed fetch doesn't break the grid. */
export class DexEntryErrorBoundary extends Component<
  { pokemonId: number; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { pokemonId: number; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative flex flex-col items-center justify-center aspect-square w-full">
          <div className="absolute inset-0 rounded-lg bg-red-900/50" />
          <span className="relative z-10 text-xs font-medium text-white/50">
            Error loading #{this.props.pokemonId}
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}
