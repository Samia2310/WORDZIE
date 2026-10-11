# WORDZIE

WORDZIE is a browser-based vocabulary learning app. It combines dictionary study, themed word discovery, short stories, flashcards, quizzes, and vocabulary games in one React experience.

The app currently runs entirely in the browser. Vocabulary and theme data live in the source code; saved words, reading progress, theme preference, and detective best score are stored locally in the browser.

## Start the app

Requirements: Node.js and npm.

```bash
npm ci
npm run dev
```

Open the local address printed by Vite, usually `http://localhost:5173`.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite development server. |
| `npm run lint` | Run ESLint across the project. |
| `npm run build` | Create the production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |

## Learning features

- **Alphabet rounds:** browse vocabulary by letter, study in short pages, and mark pages as completed.
- **Word Themes:** find related vocabulary by meaning or search for a word, definition, or theme.
- **Word Tales:** generate a story at a selected reading level and mood. Vocabulary from the dictionary is highlighted; focus or hover over a highlighted word to see its definition.
- **Flashcard Studio:** review words in Explore or Recall mode, flip cards, rate confidence, shuffle, and restart a session.
- **Word Detective:** solve vocabulary cases from definitions and progressively revealed clues.
- **Game Studio:** choose Word Buckets, Connect the Words, Fill in the Blanks, or Word Builder.
- **Quick Quiz:** answer a mixed vocabulary quiz.
- **My Wordlist:** save words for later review.
- **Guide:** read an overview of the learning flow and available tools.
- **Appearance:** use the navbar control to switch between dark and light mode. The four game interfaces and Quick Quiz retain their dark appearance.

## Project structure

```text
public/                  Static assets, including the app logo
src/
  components/
    games/               Game interfaces and shared question data
  data/
    wordCollection.js    Dictionary entries grouped by first letter
    wordThemes.js        Theme definitions and word membership
  pages/                 Page components and page-specific styles
  App.jsx                Hash-based navigation and app-level state
  main.jsx               React entry point and global stylesheets
```

The app uses hash navigation, so page routes look like `/#view=wordTales` or `/#view=rounds&letter=A`. No server-side router is required for those routes.

## Updating vocabulary and themes

Dictionary entries are in `src/data/wordCollection.js`, grouped under letter keys. An entry uses this shape:

```js
{
  word: 'AMPLE',
  definition: 'Enough or more than enough.',
  synonyms: ['Abundant', 'Plentiful'],
  antonyms: ['Scarce'],
  sentences: ['The garden had ample room for a second path.'],
}
```

The relation and sentence fields are arrays. They may be empty when information is not available. Add theme definitions in `src/data/wordThemes.js` with a stable `id`, a short `title`, a descriptive `description`, and a `words` array. Theme word names should match dictionary entries; theme results are resolved from the dictionary at runtime.

Game question pools are built from the dictionary in `src/components/games/gameData.js`. Some game types require richer entries, such as synonyms, antonyms, example sentences, or words with simple alphabetic spelling. The game data helpers filter for the fields each activity needs.

## Browser storage and privacy

WORDZIE has no account system, API service, or backend database. Current browser storage is used for:

- Navbar color preference (`wordzie-color-mode`)
- Marked alphabet-page progress (`wordzie-marked-progress`)
- My Wordlist (`wordzie-my-wordlist`)
- Word Detective best score (`wordzie-detective-best`)

This information stays in the current browser profile unless the user clears site data. The app does not need secret keys or an `.env` file to run. Do not add passwords, API keys, personal contact details, or private deployment values to this repository or its documentation.

## Production build

```bash
npm run build
npm run preview
```

The generated static site is in `dist/` and can be deployed to a static hosting provider. The app uses client-side hash routes and has no server component.

## GitHub-facing overview

The repository landing page is [`../README.md`](../README.md). This document contains the detailed setup and maintenance notes for the app.
