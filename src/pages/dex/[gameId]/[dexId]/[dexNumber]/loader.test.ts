import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dexEntryDetailLoader } from './loader';

vi.mock('~/data/pokemon', () => ({
  ensureGetPokemonById: vi.fn(),
  prefetchGetPokemonSpeciesById: vi.fn(),
}));

import {
  ensureGetPokemonById,
  prefetchGetPokemonSpeciesById,
} from '~/data/pokemon';

const createLoaderArgs = (params: Record<string, string | undefined>) => {
  return {
    params,
    request: new Request('http://localhost/'),
  } as Parameters<typeof dexEntryDetailLoader>[0];
};

const isRedirect = (result: unknown): result is Response => {
  return (
    result instanceof Response && result.status >= 300 && result.status < 400
  );
};

const getRedirectLocation = (response: Response): string => {
  return response.headers.get('Location') || '';
};

describe('dexEntryDetailLoader', () => {
  beforeEach(() => {
    vi.mocked(ensureGetPokemonById).mockResolvedValue({} as never);
  });

  describe('invalid gameId', () => {
    it('redirects to /dex when gameId is missing', async () => {
      const result = await dexEntryDetailLoader(
        createLoaderArgs({ dexId: 'paldea', dexNumber: '906' })
      );

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex');
    });

    it('redirects to /dex when gameId is invalid', async () => {
      const result = await dexEntryDetailLoader(
        createLoaderArgs({
          gameId: 'invalid',
          dexId: 'paldea',
          dexNumber: '906',
        })
      );

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex');
    });
  });

  describe('invalid dexId', () => {
    it('redirects to game page when dexId is missing', async () => {
      const result = await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexNumber: '906' })
      );

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/sv');
    });

    it('redirects to default dex when dexId is invalid', async () => {
      const result = await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'invalid', dexNumber: '906' })
      );

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/sv/paldea');
    });
  });

  describe('invalid dexNumber', () => {
    it('redirects to dex page when dexNumber is missing', async () => {
      const result = await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'paldea' })
      );

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/sv/paldea');
    });

    it('redirects to dex page when dexNumber is not a number', async () => {
      const result = await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'paldea', dexNumber: 'abc' })
      );

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/sv/paldea');
    });

    it('redirects to dex page when dexNumber is zero', async () => {
      const result = await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'paldea', dexNumber: '0' })
      );

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/sv/paldea');
    });

    it('redirects to dex page when dexNumber is negative', async () => {
      const result = await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'paldea', dexNumber: '-1' })
      );

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/sv/paldea');
    });

    it('redirects to dex page when Pokemon is not in the dex', async () => {
      // Bulbasaur (#1) is not in the Paldea dex
      const result = await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'paldea', dexNumber: '1' })
      );

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/sv/paldea');
    });
  });

  describe('valid params', () => {
    it('returns null for valid Pokemon in SV/paldea (Sprigatito #906)', async () => {
      const result = await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'paldea', dexNumber: '906' })
      );

      expect(result).toBeNull();
    });

    it('handles leading zeros in dexNumber', async () => {
      const result = await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'paldea', dexNumber: '0906' })
      );

      expect(result).toBeNull();
    });

    it('handles many leading zeros', async () => {
      const result = await dexEntryDetailLoader(
        createLoaderArgs({
          gameId: 'sv',
          dexId: 'paldea',
          dexNumber: '00000906',
        })
      );

      expect(result).toBeNull();
    });

    it('returns null for SWSH/galar (Grookey #810)', async () => {
      const result = await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'swsh', dexId: 'galar', dexNumber: '810' })
      );

      expect(result).toBeNull();
    });

    it('returns null for LGPE/kanto (Pikachu #25)', async () => {
      const result = await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'lgpe', dexId: 'kanto', dexNumber: '25' })
      );

      expect(result).toBeNull();
    });

    it('calls ensureGetPokemonById with the Pokemon ID', async () => {
      vi.mocked(ensureGetPokemonById).mockClear();

      await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'paldea', dexNumber: '906' })
      );

      expect(ensureGetPokemonById).toHaveBeenCalledWith({ id: 906 });
    });

    it('calls prefetchGetPokemonSpeciesById with the Pokemon ID', async () => {
      vi.mocked(prefetchGetPokemonSpeciesById).mockClear();

      await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'paldea', dexNumber: '906' })
      );

      expect(prefetchGetPokemonSpeciesById).toHaveBeenCalledWith({ id: 906 });
    });

    it('redirects to dex page when Pokemon fetch fails', async () => {
      vi.mocked(ensureGetPokemonById).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await dexEntryDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'paldea', dexNumber: '906' })
      );

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/sv/paldea');
    });
  });
});
