import { describe, it, expect, vi } from 'vitest';
import { dexDetailLoader } from './loader';

vi.mock('~/data/pokemon', () => ({
  prefetchGetPokemonById: vi.fn(),
}));

import { prefetchGetPokemonById } from '~/data/pokemon';

const createLoaderArgs = (params: Record<string, string | undefined>) => {
  return {
    params,
    request: new Request('http://localhost/'),
  } as Parameters<typeof dexDetailLoader>[0];
};

const isRedirect = (result: unknown): result is Response => {
  return (
    result instanceof Response && result.status >= 300 && result.status < 400
  );
};

const getRedirectLocation = (response: Response): string => {
  return response.headers.get('Location') || '';
};

describe('dexDetailLoader', () => {
  describe('invalid gameId', () => {
    it('redirects to /dex when gameId is missing', () => {
      const result = dexDetailLoader(createLoaderArgs({ dexId: 'paldea' }));

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex');
    });

    it('redirects to /dex when gameId is invalid', () => {
      const result = dexDetailLoader(
        createLoaderArgs({ gameId: 'invalid', dexId: 'paldea' })
      );

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex');
    });
  });

  describe('valid gameId, no dexId', () => {
    it('redirects to game page when dexId is missing', () => {
      const result = dexDetailLoader(createLoaderArgs({ gameId: 'sv' }));

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/sv');
    });
  });

  describe('valid gameId, invalid dexId', () => {
    it('redirects to default dex when dexId is invalid', () => {
      const result = dexDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'invalid' })
      );

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/sv/paldea');
    });

    it('redirects to default dex when dexId is for wrong game', () => {
      const result = dexDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'galar' })
      );

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/sv/paldea');
    });
  });

  describe('valid gameId, valid dexId', () => {
    it('returns null for SV/paldea', () => {
      const result = dexDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'paldea' })
      );

      expect(result).toBeNull();
    });

    it('returns null for SV/kitakami', () => {
      const result = dexDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'kitakami' })
      );

      expect(result).toBeNull();
    });

    it('returns null for SV/blueberry', () => {
      const result = dexDetailLoader(
        createLoaderArgs({ gameId: 'sv', dexId: 'blueberry' })
      );

      expect(result).toBeNull();
    });

    it('returns null for SWSH/galar', () => {
      const result = dexDetailLoader(
        createLoaderArgs({ gameId: 'swsh', dexId: 'galar' })
      );

      expect(result).toBeNull();
    });

    it('returns null for LGPE/kanto', () => {
      const result = dexDetailLoader(
        createLoaderArgs({ gameId: 'lgpe', dexId: 'kanto' })
      );

      expect(result).toBeNull();
    });

    it('returns null for PLZA/kalos', () => {
      const result = dexDetailLoader(
        createLoaderArgs({ gameId: 'plza', dexId: 'kalos' })
      );

      expect(result).toBeNull();
    });

    it('handles multi-word dex names (mega_dimension)', () => {
      const result = dexDetailLoader(
        createLoaderArgs({ gameId: 'plza', dexId: 'mega_dimension' })
      );

      expect(result).toBeNull();
    });

    it('is case-insensitive for gameId', () => {
      const result = dexDetailLoader(
        createLoaderArgs({ gameId: 'SWSH', dexId: 'galar' })
      );

      expect(result).toBeNull();
    });

    it('calls prefetchGetPokemonById for each Pokemon in the dex', () => {
      vi.mocked(prefetchGetPokemonById).mockClear();

      dexDetailLoader(createLoaderArgs({ gameId: 'lgpe', dexId: 'kanto' }));

      // LGPE Kanto has 153 Pokemon
      expect(prefetchGetPokemonById).toHaveBeenCalled();
      // Verify it was called with Pokemon IDs (first call should be Bulbasaur #1)
      expect(prefetchGetPokemonById).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
