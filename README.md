# Wordzie 📚

**Interactive Vocabulary Learning Platform**

Wordzie is a frontend vocabulary learning application built with React, designed to help learners build and reinforce vocabulary through structured study sessions and five distinct interactive game modes. It features a hand-curated A-to-Z word database, dynamic algorithmic question generation, and a custom-built client-side routing system.

🔗 **Live Demo:** [wordzie.vercel.app](https://wordzie.vercel.app/)

---

## ✨ Features

- **Structured Study Flow** — Browse vocabulary by letter, paginated into manageable rounds, with expandable word cards showing definitions, synonyms, antonyms, and example sentences
- **Flashcard Sessions** — Flip-card study mode with two modes (Explore / Recall), confidence-based self-rating (Need Practice / Building / Mastered), keyboard shortcuts, and session mastery scoring
- **Game Studio** — Five distinct quiz modes for active recall:
  - **Word Buckets** — Sort word families (word, synonym, antonym) into correct slots
  - **Connect the Words** — Match prompts to the correct synonym or antonym
  - **Fill in the Blanks** — Choose the correct word to complete a sentence using context clues
  - **Quick Quiz** — 10-question mixed or single-mode assessment (definitions, synonyms, antonyms, sentence context)
  - **Word Builder** — Rebuild scrambled words using definition and letter-pattern clues
- **Progress Tracking** — Marked/completed pages persisted via `localStorage`

---

## 🧠 Algorithmic Highlights

This project emphasizes algorithmic problem-solving in how quiz content is dynamically generated:

- **Fisher-Yates Shuffle** — Implements the standard unbiased shuffle algorithm (O(n)) for randomizing word pools and answer options, avoiding the bias introduced by naive `sort(() => Math.random() - 0.5)` approaches.
- **Set-Based Duplicate Prevention** — Uses `Set` data structures for O(1) lookups to guarantee no word, synonym, or antonym label repeats across a single game board (critical for games like Word Buckets and Connect the Words, where duplicate answers would break gameplay).
- **Anti-Spoiler Clue Filtering** — A custom constraint-filtering algorithm (`pickSafeClueText`) checks candidate clue text against a list of forbidden terms using word-boundary regex matching, ensuring a definition or example sentence never accidentally contains one of the answer choices on screen.
- **Multi-Candidate Fallback Logic** — Each clue-generation function tries a prioritized list of candidate sentences/definitions in order, falling back to a safe generic clue if no candidate passes validation — guaranteeing the game never breaks or displays an empty/spoiled clue.
- **Distractor Generation** — Wrong-answer options are generated with a length-similarity constraint (within 2 characters of the correct word) so incorrect choices are plausible rather than trivially eliminable.
- **Modular Question Blueprint Architecture** — Quick Quiz uses a blueprint pattern that decouples "which word pool and builder function to use" from "which specific word gets selected," making it straightforward to add new question types without modifying existing logic.

---

## 🛣️ Custom Routing System

Rather than relying on `react-router-dom`, Wordzie implements a hand-built hash-based router:

- Application state (current view, selected letter, round, quiz mode) is serialized into URL query parameters within the hash (`#view=words&letter=A&round=A-2`)
- State updates trigger URL updates via the History API (`pushState` / `replaceState`)
- `popstate` and `hashchange` listeners keep React state in sync with browser back/forward navigation
- Invalid or stale URL states (e.g., a round ID that no longer exists) gracefully fall back to a safe parent view instead of crashing

---

## 🛠️ Tech Stack

- **React** — Component architecture and state management
- **JavaScript (ES6+)** — Core application logic and algorithms
- **CSS** — Custom styling per game mode with distinct visual themes
- **localStorage API** — Client-side persistence for study progress

---

## 📂 Project Structure (Key Files)

```
src/
├── App.jsx                     # Root component, custom router, global state
├── data/
│   └── wordCollection.js       # A-to-Z vocabulary dataset
├── components/
│   ├── ChallengeMode.jsx       # Game Studio hub and game routing
│   └── games/
│       ├── gameData.js         # Core algorithms: shuffling, question generation, clue filtering
│       ├── WordBucketsGame.jsx
│       ├── ConnectTheWords.Game.jsx
│       ├── FillInTheBlanksGame.jsx
│       ├── QuickQuizGame.jsx
│       └── WordBuilderGame.jsx
└── pages/
    ├── HomePage.jsx
    ├── RoundSelectionPage.jsx
    ├── WordListPage.jsx
    └── FlashcardSessionPage.jsx
```

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Samia2310/WORDZIE.git

# Navigate into the project directory
cd WORDZIE

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 📌 Status

**Live** • 2025 • Personal Project

---

## 👩‍💻 Author

**Samia Tabassum Chowdhury**
[Portfolio](https://samia-portfolio-gold.vercel.app/) · [GitHub](https://github.com/Samia2310)
