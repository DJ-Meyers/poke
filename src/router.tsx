import { createBrowserRouter, redirect } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { rootLayoutLoader } from './layouts/loader';
import { GamesPage } from './pages/games';
import { GamesModifyPage } from './pages/games/modify';
import { GamesModifyGamePage } from './pages/games/modify/[gameId]';
import { gamesModifyGameLoader } from './pages/games/modify/[gameId]/loader';
import { DexManagePage } from './pages/dex/manage/[gameId]';
import { dexManageLoader } from './pages/dex/manage/[gameId]/loader';
import { NationalDexPage } from './pages/dex/national';
import { nationalDexLoader } from './pages/dex/national/loader';
import { NationalDexEntryDetailPage } from './pages/dex/national/[pokemonId]';
import { nationalDexEntryDetailLoader } from './pages/dex/national/[pokemonId]/loader';
import { GameDexPage } from './pages/dex/[gameId]';
import { gameDexLoader } from './pages/dex/[gameId]/loader';
import { DexDetailPage } from './pages/dex/[gameId]/[dexId]';
import { dexDetailLoader } from './pages/dex/[gameId]/[dexId]/loader';
import { DexEntryDetailPage } from './pages/dex/[gameId]/[dexId]/[dexNumber]';
import { dexEntryDetailLoader } from './pages/dex/[gameId]/[dexId]/[dexNumber]/loader';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      loader: rootLayoutLoader,
      children: [
        {
          index: true,
          loader: () => redirect('/dex'),
        },
        {
          path: 'dex',
          element: <GamesPage />,
          children: [
            {
              path: 'manage/:gameId',
              element: <DexManagePage />,
              loader: dexManageLoader,
            },
          ],
        },
        {
          path: 'dex/games',
          element: <GamesModifyPage />,
          children: [
            {
              path: ':gameId',
              element: <GamesModifyGamePage />,
              loader: gamesModifyGameLoader,
            },
          ],
        },
        {
          path: 'dex/national',
          element: <NationalDexPage />,
          loader: nationalDexLoader,
        },
        {
          path: 'dex/national/:pokemonId',
          element: <NationalDexEntryDetailPage />,
          loader: nationalDexEntryDetailLoader,
        },
        {
          path: 'dex/:gameId',
          element: <GameDexPage />,
          loader: gameDexLoader,
        },
        {
          path: 'dex/:gameId/:dexId',
          element: <DexDetailPage />,
          loader: dexDetailLoader,
        },
        {
          path: 'dex/:gameId/:dexId/:dexNumber',
          element: <DexEntryDetailPage />,
          loader: dexEntryDetailLoader,
        },
        {
          path: 'dex/:gameId/settings',
          loader: ({ params }) => redirect(`/dex/${params.gameId}`),
        },
      ],
    },
  ],
  { basename }
);
