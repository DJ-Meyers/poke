import { DexEntryDetail } from '~/components/DexEntryDetail';
import { useDexEntryParams } from '~/utils/route-params';

/**
 * Page component for /dex/:gameId/:dexId/:dexNumber routes.
 * Shows detailed information about a specific Pokémon.
 * The loader handles param validation and redirects.
 */
export const DexEntryDetailPage = () => {
  const { game, gameDex, pokemonId, regionalDexNumber } = useDexEntryParams();

  return (
    <DexEntryDetail
      pokemonId={pokemonId}
      game={game}
      gameDex={gameDex}
      regionalDexNumber={regionalDexNumber}
    />
  );
};
