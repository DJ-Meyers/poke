import { type Game, Game as GameEnum } from '../../../data/dex';
import { DexGridView } from '~/components/Dex/Grid/view';
import type { OriginMark } from '~/components/Dex/Entry/origin-marks';
import { AppLayout } from '~/components/ui';

const GAME_FILTER_BUTTONS: { label: string; game: Game }[] = [
  { label: 'PLZA', game: GameEnum.PLZA },
  { label: 'SV', game: GameEnum.SV },
  { label: 'PLA', game: GameEnum.PLA },
  { label: 'BDSP', game: GameEnum.BDSP },
  { label: 'SwSh', game: GameEnum.SWSH },
  { label: 'LGPE', game: GameEnum.LGPE },
];

interface NationalDexViewProps {
  pokemonIds: number[];
  caughtIds: Set<number>;
  selectedGames: Set<Game>;
  onToggleGame: (game: Game) => void;
  onPrimaryAction: (pokemonId: number) => void;
  onSecondaryAction: (pokemonId: number) => void;
  getOriginMarks: (pokemonId: number) => OriginMark[];
}

export function NationalDexView({
  pokemonIds,
  caughtIds,
  selectedGames,
  onToggleGame,
  onPrimaryAction,
  onSecondaryAction,
  getOriginMarks,
}: NationalDexViewProps) {
  return (
    <AppLayout
      title="National Pokédex"
      backTo="/dex"
      progress={{ current: caughtIds.size, total: pokemonIds.length }}
      subheader={GAME_FILTER_BUTTONS.map(({ label, game }) => (
        <button
          key={game}
          type="button"
          onClick={() => onToggleGame(game)}
          className={`flex-1 px-4 py-3 text-center text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            selectedGames.has(game)
              ? 'bg-primary/15 border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text hover:bg-surface-hover'
          }`}
        >
          {label}
        </button>
      ))}
    >
      <DexGridView
        pokemonIds={pokemonIds}
        caughtIds={caughtIds}
        onPrimaryAction={onPrimaryAction}
        onSecondaryAction={onSecondaryAction}
        getOriginMarks={getOriginMarks}
      />
    </AppLayout>
  );
}
