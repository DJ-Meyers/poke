import { describe, it, expect } from 'vitest';
import { gameDexLoader } from './loader';

function createLoaderArgs(params: Record<string, string | undefined>) {
  return {
    params,
    request: new Request('http://localhost/'),
  } as Parameters<typeof gameDexLoader>[0];
}

function isRedirect(result: unknown): result is Response {
  return (
    result instanceof Response && result.status >= 300 && result.status < 400
  );
}

function getRedirectLocation(response: Response): string {
  return response.headers.get('Location') || '';
}

describe('gameDexLoader', () => {
  describe('invalid gameId', () => {
    it('redirects to /dex when gameId is missing', () => {
      const result = gameDexLoader(createLoaderArgs({}));

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex');
    });

    it('redirects to /dex when gameId is invalid', () => {
      const result = gameDexLoader(createLoaderArgs({ gameId: 'invalid' }));

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex');
    });
  });

  describe('valid gameId', () => {
    it('redirects to default dex for LGPE', () => {
      const result = gameDexLoader(createLoaderArgs({ gameId: 'lgpe' }));

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/lgpe/kanto');
    });

    it('redirects to default dex for BDSP', () => {
      const result = gameDexLoader(createLoaderArgs({ gameId: 'bdsp' }));

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/bdsp/sinnoh');
    });

    it('redirects to default dex for PLA', () => {
      const result = gameDexLoader(createLoaderArgs({ gameId: 'pla' }));

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/pla/hisui');
    });

    it('redirects to default dex for SV', () => {
      const result = gameDexLoader(createLoaderArgs({ gameId: 'sv' }));

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/sv/paldea');
    });

    it('redirects to default dex for SWSH', () => {
      const result = gameDexLoader(createLoaderArgs({ gameId: 'swsh' }));

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/swsh/galar');
    });

    it('redirects to default dex for PLZA', () => {
      const result = gameDexLoader(createLoaderArgs({ gameId: 'plza' }));

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/plza/kalos');
    });

    it('is case-insensitive for gameId', () => {
      const result = gameDexLoader(createLoaderArgs({ gameId: 'SV' }));

      expect(isRedirect(result)).toBe(true);
      expect(getRedirectLocation(result as Response)).toBe('/dex/SV/paldea');
    });
  });
});
