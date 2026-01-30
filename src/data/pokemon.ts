import {
  useQuery,
  useSuspenseQuery,
  queryOptions,
} from '@tanstack/react-query';
import { PokemonClient } from 'pokenode-ts';
import { queryClient } from './query-client';

const pokemonClient = new PokemonClient();

// --- Query option factories (internal) ---

const pokemonByIdOptions = ({ id }: { id: number }) => {
  return queryOptions({
    queryKey: ['pokemon', id],
    queryFn: () => pokemonClient.getPokemonById(id),
  });
};

const pokemonSpeciesByIdOptions = ({ id }: { id: number }) => {
  return queryOptions({
    queryKey: ['pokemon-species', id],
    queryFn: () => pokemonClient.getPokemonSpeciesById(id),
  });
};

// --- Prefetch functions (for loaders) ---

/** Fire-and-forget prefetch — does not block or throw. */
export const prefetchGetPokemonById = ({ id }: { id: number }) => {
  void queryClient.prefetchQuery(pokemonByIdOptions({ id }));
};

/** Fire-and-forget prefetch — does not block or throw. */
export const prefetchGetPokemonSpeciesById = ({ id }: { id: number }) => {
  void queryClient.prefetchQuery(pokemonSpeciesByIdOptions({ id }));
};

/** Blocks until the data is in cache. Throws on fetch failure. */
export const ensureGetPokemonById = ({ id }: { id: number }) => {
  return queryClient.ensureQueryData(pokemonByIdOptions({ id }));
};

/** Blocks until the data is in cache. Throws on fetch failure. */
export const ensureGetPokemonSpeciesById = ({ id }: { id: number }) => {
  return queryClient.ensureQueryData(pokemonSpeciesByIdOptions({ id }));
};

// --- Hooks (for components) ---

export const useGetPokemonById = ({ id }: { id: number }) => {
  return useQuery(pokemonByIdOptions({ id }));
};

export const useGetPokemonSpeciesById = ({ id }: { id: number }) => {
  return useQuery(pokemonSpeciesByIdOptions({ id }));
};

/** Suspense variant — data is guaranteed non-null. */
export const useSuspenseGetPokemonById = ({ id }: { id: number }) => {
  return useSuspenseQuery(pokemonByIdOptions({ id }));
};
