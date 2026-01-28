import {
  useQuery,
  useSuspenseQuery,
  queryOptions,
} from '@tanstack/react-query';
import { PokemonClient } from 'pokenode-ts';
import { queryClient } from './query-client';

const pokemonClient = new PokemonClient();

// --- Query option factories (internal) ---

function pokemonByIdOptions({ id }: { id: number }) {
  return queryOptions({
    queryKey: ['pokemon', id],
    queryFn: () => pokemonClient.getPokemonById(id),
  });
}

function pokemonSpeciesByIdOptions({ id }: { id: number }) {
  return queryOptions({
    queryKey: ['pokemon-species', id],
    queryFn: () => pokemonClient.getPokemonSpeciesById(id),
  });
}

// --- Prefetch functions (for loaders) ---

/** Fire-and-forget prefetch — does not block or throw. */
export function prefetchGetPokemonById({ id }: { id: number }) {
  void queryClient.prefetchQuery(pokemonByIdOptions({ id }));
}

/** Fire-and-forget prefetch — does not block or throw. */
export function prefetchGetPokemonSpeciesById({ id }: { id: number }) {
  void queryClient.prefetchQuery(pokemonSpeciesByIdOptions({ id }));
}

/** Blocks until the data is in cache. Throws on fetch failure. */
export function ensureGetPokemonById({ id }: { id: number }) {
  return queryClient.ensureQueryData(pokemonByIdOptions({ id }));
}

/** Blocks until the data is in cache. Throws on fetch failure. */
export function ensureGetPokemonSpeciesById({ id }: { id: number }) {
  return queryClient.ensureQueryData(pokemonSpeciesByIdOptions({ id }));
}

// --- Hooks (for components) ---

export function useGetPokemonById({ id }: { id: number }) {
  return useQuery(pokemonByIdOptions({ id }));
}

export function useGetPokemonSpeciesById({ id }: { id: number }) {
  return useQuery(pokemonSpeciesByIdOptions({ id }));
}

/** Suspense variant — data is guaranteed non-null. */
export function useSuspenseGetPokemonById({ id }: { id: number }) {
  return useSuspenseQuery(pokemonByIdOptions({ id }));
}
