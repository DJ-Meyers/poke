# AI RULES

- Refer back to these rules whenever beginning work
- Use passive voice over active voice
- Ask clarifying questions as needed before proceeding
- Check for patterns that already exist within the codebase before implementing something
- Update checkmarks in this document as progress is made and confirmed
- Do not proceed beyond the current header for the task that is being worked on i.e., don't move on and do things before they're ready to be done. Subheaders are okay. For example, while implementing Phase 1
- Do not write any code until there is a checkmark for a work item to be completed
- When writing React Components, follow View-Container-Page separation of concerns
  - view components should be in `/ComponentName/view.tsx` and should only handle UI concerns like how something looks or hooking up event listeners
  - container components should define behaviors for components, such as event handlers
  - page components should handle any logic related to parsing the url or params and passing that info to its child containers
  - The general hierarchy is Page > Container > View
  - The top component of the hierarchy should be the only export from index.tsx and should have the same name as the folder
  - e.g.,
  ```
  /components
      /MyComponent
          container.tsx
          view.tsx
          index.tsx // exports the MyComponentContainer component as MyComponent even though MyComponentContainer renders the view component
      /MyOtherComponent
          view.tsx
          index.tsx // exports the MyOtherComponentView component as MyOtherComponent
  ```

# Living Dex Tracker

## Goal

This will be a mobile-first web app that is used for tracking the collection of a "living" Pokédex across the Pokémon games of the user's choosing.

A living Pokédex is a collection of each pokémon in an evolution line, allowing you to see each stage of the pokémon at once. For example, #0001 Bulbasaur evolves into #0002 Ivysaur and then #0003 Venusaur; a living dex will have one copy of each stage in sequential order instead of just the final evolution.

## Data Source

### Data Structure

To retrieve data about Pokémon (e.g., their sprites or their location), use the [pokénode-ts](https://pokenode-ts.vercel.app/clients/pokemon-client) package which wraps the [pokéapi](https://pokeapi.co/docs/v2) endpoints with type-safe auto-caching utilities.

## Development Phases

Do not proceed past the specified step. Update this file with progress as it is made.

REFER TO THE AI RULES BEFORE BEGINNING EACH PHASE OF WORK

### 0. Initialize a React project

Some technologies that will be used

- vite
- pnpm
- React (let's try with React Compiler if possible)
- TypeScript
- pokenode-ts
- Tailwind
- React Router

I plan to host this on Github pages so it should be pure client-side JavasScript

- [x] Install any necessary software via brew
  - Node.js and pnpm were already installed
- [x] Set up linting, dev, typescript, and unit testing scripts in pnpm if they don't come ready from initialization
  - Vite + React 19 + TypeScript initialized
  - React Compiler (babel-plugin-react-compiler) configured
  - Tailwind CSS v4 configured
  - React Router v7 installed
  - pokenode-ts installed
  - ESLint + Prettier configured
  - Vitest + Testing Library configured with happy-dom

#### Finished?

- [x] All steps in Initialization are completed and Phase 1 is ready to begin.

### 1. Set up data fetching and constant data

#### Creating Constant Data

- [x] Make a script to make a request once for each main series game to save the **id** of each pokemon in that Pokédex.
  - We want a breakdown of Pokédexes within a game. For example, Pokémon Scarlet & Violet have the Paldea, Kitakami, and Blueberry Pokédexes with 400, 200, and 243 Pokémon respectively.
  - The stored data for the Pokédex for Paldea will likely look like: `[906, 907, ...]`. It could also be plaintext if that works better:
    ```
    906
    907
    908
    ```
  - The data should be stored in `/data/dexes/{game}/{pokedex}` (e.g., `/data/dexes/BDSP/sinnoh.*`)

The full listing of relevant Pokédexes broken down by game are:

- Let's Go Pikachu & Let's Go Eevee (LGPE)
  - [x] Kanto Pokédex
- Sword & Shield (SwSh)
  - [x] Galar Pokédex
  - [x] Isle of Armor Pokédex
  - [x] Crown Tundra Pokédex
- Brilliant Diamond & Shining Pearl (BDSP)
  - [x] Sinnoh Pokédex
- Legends: Arceus (PLA)
  - [x] Hisui Pokédex
- Scarlet & Violet (SV)
  - [x] Paldea Pokédex
  - [x] Kitakami Pokédex
  - [x] Blueberry Pokédex
- Legends: ZA (PLZA)
  - [x] Kalos Pokédex
  - [x] Mega Dimension Pokédex

#### Reading and Writing User Progress

- [x] Pokédex progress should be stored in local storage or cookies
  - The simplest way is probably using a sorted sparse array. So if I only have Quaquaval, Sunkern, and Corvisquire in my Paldea dex, the
- [x] Create any necessary wrappers or utils for setting/reading Pokédex progress
  - [x] Write appropriate unit tests for these utils. Don't go overboard. Mock stuff as needed

#### Finished?

- [x] I have confirmed that the script has been run and the data has been stored in the correct files. Phase 1 is now complete.

### 2. Set up basic routing and UI

Do not worry about styles for now. Styles will be added later with tailwind.

Use React Router to create and structure these routes. Consider what data needs to be loaded before the page can render. Consider what suspense boundaries are needed.

#### Routes

- [x] `/`
  - Home route
  - [x] Prompt the user to consent to the setting of data in local storage if consent is necessary. Tell the user that the site relies on local storage and cookies to store the living dex progress in their browser and no data is being stored by the site. If they clear their browsing history it is likely they will lose their progress.
- [x] `/games`
  - Page for users to see which games they own
  - [x] display the box images for each series e.g., SwSh, BDSP, etc.
  - [x] Display an option for National Dex at the top of this list
  - [x] Clicking an option will bring them to the base for that game
  - [x] link to the `/games/modify` route with a CTA so the user knows that is how they add or remove games
- [x] `/games/modify`
  - [x] The user can check or uncheck games to update what games they want to complete a living dex for
- [x] `/dex/:gameId`
  - Page to view and update their progress on the Pokédex for a game
  - [x] `gameId` param must match one of the series abbreviations (case-insensitive e.g., "swsh" or "plza")
  - [x] If no `gameId` param is passed, treat it as the national dex aka `all`
  - [x] If the game series has multiple dexes, create a list of links to the `:dexId` child routes
  - [x] Use an outlet to render the child route within the page. If this is not possible provide an alternative
- [x] `/dex/:gameId/settings`
  - [x] Create this route but redirect it to `dex/:gameId` for now.
- [x] `/dex/:gameId/:dexId`
  - [x] list every Pokémon in the Pokédex
  - [x] Not every game has multiple Pokédexes. Each Game should have a fallback value for `dexId`, so if the param is missing, the default should be used.
    - E.g., `/dex/pla` will redirect or resolve to `/dex/pla/hisui`
- [ ] - TO BE IMPLEMENTED LATER
  - [ ] view details on where to find the Pokémon in the given Pokédex

#### Finished?

- [x] Phase 2 is complete. Every page renders successfully and fetches relevant data using the pokenode client.

### 3. Basic Styles

Use Tailwind to style the components.

#### Overall

- The design should be sleek and refined. It should look professional and not cartoony.
  - [x] Choose an appropriate primary font (Outfit)
  - [x] Choose a fitting color palette (Fresh Mint)
- Usage of Pokémon IP should follow common guidelines and use correct branding ("Pokémon" vs "pokemon")
- Create storybook stories for each component
  - A simple component should have 2 or 3 stories maximum and 3 is often overkill
  - The stories should not require that callbacks are passed. Only data.

#### components/Dex/Entry/view.tsx

The `DexEntry` Component should be ready to display in a flex div that will control gaps and spacing for the rows and columns of the Pokédex entries.

##### Props

- [x] `pokemon: Pokemon` The Pokémon type that is used by the pokenode client should be used here and in any future references to a `Pokemon` type
- [x] `isComplete: boolean`
- [x] `onClick: (id: number) => void` event handler
- [x] `_onPressAndHold?: (id: number) => void` event handler (or the semantic equivalent)

##### Other Requirements

- [x] The most recent (probably Gen 9 or SV) sprite for a Pokémon should be used
- [x] The sprite should have a slight box shadow
- [x] The sprite should be centered both vertically and horizontally within the component
- [x] Each type should have an associated color
  - Use the same styles as the buttons for each type on this page: https://pokemondb.net/type
- [x] Behind the sprite should be a rounded square background that will represent the type of the Pokémon
  - [x] If the Pokémon only has one type, it should be a solid rounded square based on the type's color
  - We will try two different styles for when a Pokémon has two types
    - [x] The first style will be a gradient between the colors of the two types. Ideally at a 45 degree angle
    - [x] ~~The second style will be the square split in half with a small gap between the two halves. Also try this one where the split is rotated 45 degrees~~ (User chose gradient only)
- [x] If `isComplete` is false, gray out both the sprite and the rounded square background

#### components/Dex/Entry/container.tsx

This may not be necessary. Consider whether it is more performant to define one callback that is passed to 1000+ child components or to have each child define its own callback that does the same thing. It is likely the former.

#### SKIP SECTION FOR NOW ~~DexPcBox~~

##### Props

- [ ] `beginning: number`
- [ ] `end: number`
- [ ] `pokemon: Pokemon[]`
- [ ] `completedPokémon: number[]` If the Pokémon's number is in the `completedPokémon` list, then pass `isComplete={true}` to the `DexEntry`
- [ ] `_isGroupingByPcBox?: boolean` We will maybe come back to this later

#### components/Dex/Grid/view.tsx

The `DexGrid` will be the primary component on the `/dex/:gameId/:dexId` route.

- [x] It should render all Pokémon for a Pokédex in rows of 3 columns of `DexEntry` components

#### components/Dex/Grid/container.tsx

- [x] Should likely define the `toggleIsComplete` callback that is passed to the view

#### components/Dex/container.tsx

The `DexContainer` component will render a section above the `DexGrid`

- This section will contain
  - [x] The links to the other dexes for a game (if applicable)
  - [x] A right-justified gear/settings button-style link that directs to the dex settings page
    - [x] should be hidden for now
  - [x] The links should all grow to equally fill space in their row and the settings link should shrink to its minimum size (if visible)
  - [x] Each button-link should have the same padding and styles minus their width

### 4. Routing continued

#### Page Components should have loaders that handle redirects

Rather than returning null or returning a Navigate, pages should have loaders that live in the same directory that handle redirects.

So `pages/dex/:gameId/:dexId` should have index.tsx (the page component) and loader.ts which handles the logic for validating the params and redirecting. The page should assume that the loader has handled these concerns and the params are valid.

- [x] Update all of the page components that handle validation and redirecting to use a loader for this purpose. Not every page needs a loader.
- [x] Write unit tests for each loader that is created

Add the DexEntryDetail page at `/pages/dex/:gameId/:dexId/:dexNumber`. This will show details about the pokémon with the given dex number. This should use the national dex number, so Grookey in the Galar Pokédex will be `/dex/swsh/galar/0810` or `/dex/swsh/galar/810`

- [x] leading zeros in the `:dexNumber` param should be valid
- [x] Display some basic information, such as where the pokémon can be found in each version of the game (e.g., some Pokémon are available in only Scarlet, but not in Violet and require a trade to obtain and vice versa) and apply basic styles that match the existing theme

### 5. Optimization & Cleanup

#### Code Style

Use root paths e.g., `~` for `/src` so in `GameOverviewContainer` instead of importing

```
import type { Game } from '../../utils/dex-data';
import { getGameInfo, getDexesForGame } from '../../utils/dex-data';
```

the imports will look like

```
import type { Game } from '~/utils/dex-data';
import { getGameInfo, getDexesForGame } from '~/utils/dex-data';
```

- [x] set up the path shortcut
- [x] set up a lint rule to enforce this. It should be autofixable. There may be a common lint rule for this already available.
- [x] fix all existing imports

enforce `kebab-case-naming` for non-component file names

- [x] lint rule is created
- [x] all violations are fixed.

#### Directory Structure & Separation of Concerns

There are some places where functions or types that should live in `~/utils` are being defined in components. For example `buildDexProgressInfo` in `GameOverviewView`.

Additionally, some data constants are being stored in `~/utils` instead of in `~/data`. One example is the `DEX_DATA` in `~/utils/dex-data`.

- [x] Move utility functions from components to `~/utils` (e.g., `buildDexProgressInfo` moved to `~/utils/dex-progress.ts`)
- [x] Move data constants from `~/utils` to `~/data` (created `~/data/dex.ts` with `GameDex`, `Game`, `DEX_DATA`, `GAME_DEXES`)

#### Performance of the Pokédex pages

Virtualize the DexGrid list so that only the assets that are needed are loaded. This should improve performance. If possible, always load the first 30 Pokémon for each dex in a region and then virtualize as needed. This should make it so that switching between dexes is snappy without over fetching.

- [x] The Pokédex performance has been improved by virtualizing the DexGrid using @tanstack/react-virtual. Only visible rows are rendered, with 5 rows of overscan for smooth scrolling.

### 6. Games Page

The styles look great so far for the Dex pages. Use similar styling for the Dex page. The order of games should be inverted compared to what it is now, so PLZA is first and LGPE is last.

Each dex should have one or two "Mascot" pokémon associated with them. This can be used for creating the Game components that users will click to navigate to the correct game. We shouldn't need anything other than the sprite for this page, so there probably doesn't need to be any fetching of the actual Pokémon data.

Mascots:

- All
  - National
    - #0132 Ditto
- PLZA
  - Kalos
    - #0717 Yveltal
    - #0716 Xerneas
  - Mega Dimension
    - #0720 Hoopa
- SV
  - Paldea
    - #1008 Miraidon
    - #1007 Koraidon
  - Kitakami
    - #1017 Ogerpon
  - Blueberry
    - #1024 Terapagos
- PLA
  - Hisui
    - #0493 Arceus
- BDSP
  - Sinnoh
    - #0484 Palkia
    - #0483 Dialga
- SWSH
  - Galar
    - #0889 Zamazenta
    - #0888 Zacian
  - Isle of Armor
    - #0892 Urshifu (use Rapid-Strike variant if possible)
  - Crown Tundra
    - #0898 Calyrex
- LGPE
  - Kanto
    - #0025 Pikachu (use Partner Pikachu variant if possible)
    - #0133 Eevee (use Partner Eevee variant if possible)

Each Game should be a large card that displays the Mascot(s) for the primary dex + the game title

- [x] If the game has one mascot, that mascot should be displayed similar to a dex entry but larger and without the type background color
- [x] If the game has two mascots, the game should be split and show the left half of the first mascot and the right half of the second mascot
- [x] The game should be faded out based on the completion level of the Game's Pokédexes
- [x] The game should show a small progress bar indicating total completion of the game's dexes

### 7. Dex Improvements

- [x] The dex page should show both the national dex # and the regional dex #. So Grookey in the Galar dex for Sword and Shield should show "#001 / #0810"
- [x] Long pressing a pokémon should navigate to a DexEntryDetail page that shows info on how to catch the Pokémon
  - This will require some iteration. Put together an initial pass and I will refine the approach
  - [x] it should be intuitive to navigate back to the dex page

## IGNORE. NOTES TO BE REVISITED LATER

### X. Additional Logic and Guardrails

#### Add Popup for Dex settings page

The modal should have three options

- [ ] Complete Pokédex (update local storage so that all Pokémon are listed for the given Pokédex)
- [ ] Reset Pokédex (Wipe the dex entry in local storage)
  - [ ] With Confirmation

#### Add `/dex/:gameId/:dexId/:monId` route

This should navigate to a view where the user can see details on where to find or how to catch the Pokémon in the given regional Pokédex
