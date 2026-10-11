# Wordzie

**An interactive vocabulary learning platform**

Wordzie helps learners discover, study, and practice vocabulary through structured word lists, themed collections, stories, flashcards, quizzes, and games. It is a client-side React application with a large built-in dictionary and browser-based progress storage.

[Open the live app](https://wordzie.vercel.app/)

## Learning features

- **Alphabet rounds:** Explore words from A to Z in manageable study pages, expand entries for more detail, and mark pages as reviewed.
- **Word Themes:** Browse vocabulary grouped by meaning and situation, or search words, definitions, and themes.
- **Word Tales:** Generate a new story for a selected reading level and mood. Dictionary words used in the story are highlighted; hover over or focus one to reveal its meaning.
- **Flashcard Studio:** Study in Explore or Recall mode, flip cards, rate confidence, and review session progress.
- **Word Detective:** Solve vocabulary cases using definitions and progressively revealed clues.
- **Game Studio:** Practice with Word Buckets, Connect the Words, Fill in the Blanks, and Word Builder.
- **Quick Quiz:** Test vocabulary with mixed or focused question modes and immediate feedback.
- **My Wordlist:** Save words to revisit later.
- **Light and dark appearance:** Switch themes from the navbar. Quick Quiz and the four game interfaces keep their dedicated dark styling.
- **Responsive navigation:** Use the navbar dropdowns on desktop or the navigation drawer on smaller screens.

## Getting started

Requirements: [Node.js](https://nodejs.org/) and npm.

The Vite app is in the `WORDZIE/` directory:

```bash
cd WORDZIE
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Available scripts

Run these commands from the `WORDZIE/` directory.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run lint` | Check the source with ESLint. |
| `npm run build` | Create a production build in `WORDZIE/dist/`. |
| `npm run preview` | Preview the production build locally. |

## Technology

- React 19
- JavaScript with ES modules
- Vite
- CSS, including page-specific and theme styles
- Lucide React icons
- `localStorage` for browser-local preferences and study data

## Project structure

```text
repository-root/
├── README.md               GitHub project overview
└── WORDZIE/                 Vite application root
    ├── public/              Static files served as-is
    │   └── wordzie.png      App logo
    ├── src/
    │   ├── components/
    │   │   ├── games/       Game interfaces and shared game logic
    │   │   ├── AppNavbar.jsx
    │   │   └── ChallengeMode.jsx
    │   ├── data/
    │   │   ├── wordCollection.js  Dictionary entries
    │   │   └── wordThemes.js      Theme descriptions and word groups
    │   ├── pages/           App screens and page-specific styles
    │   ├── App.jsx          App state and hash-based navigation
    │   ├── main.jsx         React entry point
    │   └── *.css            Global, brand, and theme styles
    ├── index.html           Vite HTML entry point
    ├── package.json         Scripts and dependencies
    ├── package-lock.json    Locked dependency versions
    ├── eslint.config.js     ESLint configuration
    └── vite.config.js       Vite configuration
```

Run the development, lint, build, and preview commands from inside `WORDZIE/`. The production output is created in `WORDZIE/dist/` relative to the repository root.

## Vocabulary data

Dictionary entries live in `WORDZIE/src/data/wordCollection.js`, organized by starting letter. An entry typically contains a word, definition, synonyms, antonyms, and example sentences. Some fields can be empty when that information is unavailable.

Theme definitions are maintained in `WORDZIE/src/data/wordThemes.js`. Their word names correspond to dictionary entries and are resolved against the vocabulary data by the app.

## Navigation and browser storage

Wordzie uses hash-based client-side navigation, for example `/#view=wordTales` or `/#view=rounds&letter=A`. Browser back and forward navigation is supported; no server-side router is needed.

Saved words, marked study progress, the appearance preference, and Word Detective's best score are kept in the current browser profile using `localStorage`. There is no account system, backend database, or API key requirement.

## Privacy

The app runs in the browser and stores its current user data locally. Do not commit passwords, API keys, private deployment settings, or personal contact information to the repository.
