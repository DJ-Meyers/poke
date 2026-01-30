import { useParams } from 'react-router';
import { DexEntryDetail } from '~/components/DexEntryDetail';

/**
 * Page component for /dex/national/:pokemonId routes.
 * Shows detailed information about a specific Pokémon from the national dex.
 * The loader handles param validation.
 */
export const NationalDexEntryDetailPage = () => {
  const { pokemonId: pokemonIdParam } = useParams();
  const pokemonId = Number(pokemonIdParam);

  return <DexEntryDetail pokemonId={pokemonId} regionalDexNumber={pokemonId} />;
};
