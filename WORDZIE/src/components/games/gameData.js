import { wordDataByLetter } from '../../data/wordCollection.js';

export const GAME_IDS = {
    PUZZLE: 'puzzle',
    MATCHING: 'matching',
    FILL_BLANKS: 'fill_blanks',
    WORD_BUILDER: 'word_builder',
};

export const GAME_CATALOG = {
    [GAME_IDS.PUZZLE]: {
        title: 'Puzzle Buckets',
        tagline: 'Sort full word families into the right buckets.',
        description:
            'Students reconstruct four vocabulary sets by identifying the main word, one synonym, and one antonym for each clue before submitting.',
        skills: ['Word recognition', 'Synonym recall', 'Antonym contrast'],
        difficulty: 'Focused logic',
    },
    [GAME_IDS.MATCHING]: {
        title: 'Connect the Words',
        tagline: 'Pair each word with the right synonym or antonym.',
        description:
            'A focused pairing board where each prompt tells students whether they need a synonym or antonym, so they must read carefully instead of guessing fast.',
        skills: ['Meaning comparison', 'Precision reading', 'Quick retrieval'],
        difficulty: 'Fast analysis',
    },
    [GAME_IDS.FILL_BLANKS]: {
        title: 'Fill in the Blanks',
        tagline: 'Use context clues to choose the right word.',
        description:
            'Learners read a sentence with a missing target word and choose the best answer from four options, then immediately review the meaning and support notes.',
        skills: ['Context clues', 'Sentence reading', 'Applied vocabulary'],
        difficulty: 'Context-based',
    },
    [GAME_IDS.WORD_BUILDER]: {
        title: 'Word Builder',
        tagline: 'Rebuild the correct word from shuffled letters.',
        description:
            'Students see a definition and a scrambled version of the target word, then drag the letters into place to rebuild the answer.',
        skills: ['Spelling recall', 'Form recognition', 'Definition linking'],
        difficulty: 'Spelling practice',
    },
};

export const PUZZLE_SLOT_TYPES = ['word', 'synonym', 'antonym'];

export const shuffleArray = (items) => {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }

    return copy;
};

export const pickRandomItems = (items, count) =>
    shuffleArray(items).slice(0, Math.min(count, items.length));

export const normalizeText = (value = '') => value.trim().toLowerCase();

const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const allWords = Object.values(wordDataByLetter)
    .flat()
    .filter((item) => item?.word && item?.definition);

const wordsWithRelations = allWords.filter(
    (item) => item.synonyms?.length && item.antonyms?.length,
);

const getSentenceWithTarget = (wordItem) => {
    const pattern = new RegExp(`\\b${escapeRegExp(wordItem.word)}\\b`, 'i');
    return wordItem.sentences?.find((sentence) => pattern.test(sentence)) || '';
};

const wordsWithTargetSentence = allWords.filter((item) => getSentenceWithTarget(item));

const buildableWords = allWords.filter(
    (item) => /^[A-Za-z]+$/.test(item.word) && item.word.length >= 4 && item.word.length <= 10,
);

const getDistractorWords = (correctWord, pool, count) => {
    const preferred = pool.filter(
        (item) =>
            item.word !== correctWord.word &&
            Math.abs(item.word.length - correctWord.word.length) <= 2,
    );

    const fallbackPool =
        preferred.length >= count
            ? preferred
            : pool.filter((item) => item.word !== correctWord.word);

    return pickRandomItems(fallbackPool, count).map((item) => item.word);
};

export const createPuzzleSession = () => {
    const selectedWords = pickRandomItems(wordsWithRelations, 4);
    const rows = selectedWords.map((item, index) => ({
        id: `${item.word}-${index}`,
        clue: item.definition,
        example:
            item.sentences?.[0] || 'Study the meaning carefully before sorting your choices.',
        answers: {
            word: item.word,
            synonym: item.synonyms[0],
            antonym: item.antonyms[0],
        },
    }));

    const chips = shuffleArray(
        rows.flatMap((row) =>
            PUZZLE_SLOT_TYPES.map((type) => ({
                id: `${row.id}-${type}`,
                label: row.answers[type],
                type,
                rowId: row.id,
            })),
        ),
    );

    return {
        rows,
        chips,
    };
};

export const getPuzzleResults = (session, placements) => {
    const rowResults = session.rows.map((row) => {
        const slotResults = PUZZLE_SLOT_TYPES.map((type) => {
            const slotKey = `${row.id}-${type}`;
            const chipId = placements[slotKey];
            const chip = session.chips.find((item) => item.id === chipId);
            const isCorrect = normalizeText(chip?.label) === normalizeText(row.answers[type]);

            return {
                type,
                chipLabel: chip?.label || '',
                isCorrect,
            };
        });

        return {
            rowId: row.id,
            fullyCorrect: slotResults.every((result) => result.isCorrect),
            slotResults,
        };
    });

    const correctSlots = rowResults.reduce(
        (total, row) => total + row.slotResults.filter((result) => result.isCorrect).length,
        0,
    );

    return {
        rowResults,
        correctSlots,
        totalSlots: session.rows.length * PUZZLE_SLOT_TYPES.length,
        completedBuckets: rowResults.filter((row) => row.fullyCorrect).length,
    };
};

export const createMatchingSession = () => {
    const selectedWords = pickRandomItems(wordsWithRelations, 6);
    const prompts = shuffleArray(
        selectedWords.map((item, index) => {
            const relation = index % 2 === 0 ? 'synonym' : 'antonym';

            return {
                id: `${item.word}-${relation}-${index}`,
                word: item.word,
                clue: item.definition,
                relation,
                answer: relation === 'synonym' ? item.synonyms[0] : item.antonyms[0],
            };
        }),
    );

    const options = shuffleArray(
        prompts.map((prompt, index) => ({
            id: `option-${index}`,
            label: prompt.answer,
            promptId: prompt.id,
        })),
    );

    return {
        prompts,
        options,
    };
};

export const getMatchingResults = (session, assignments) => {
    const promptResults = session.prompts.map((prompt) => {
        const optionId = assignments[prompt.id];
        const option = session.options.find((item) => item.id === optionId);
        const isCorrect = normalizeText(option?.label) === normalizeText(prompt.answer);

        return {
            promptId: prompt.id,
            answer: option?.label || '',
            isCorrect,
        };
    });

    return {
        promptResults,
        correctCount: promptResults.filter((result) => result.isCorrect).length,
        total: session.prompts.length,
    };
};

export const findNextUnassignedPrompt = (prompts, assignments) =>
    prompts.find((prompt) => !assignments[prompt.id])?.id || '';

export const createFillBlankSession = () => {
    const selectedWords = pickRandomItems(wordsWithTargetSentence, 5);
    const questions = selectedWords.map((item, index) => {
        const sourceSentence = getSentenceWithTarget(item);
        const blankedSentence = sourceSentence.replace(
            new RegExp(`\\b${escapeRegExp(item.word)}\\b`, 'i'),
            '_____',
        );
        const options = shuffleArray([item.word, ...getDistractorWords(item, allWords, 3)]);

        return {
            id: `${item.word}-${index}`,
            word: item.word,
            definition: item.definition,
            sentence: blankedSentence,
            sourceSentence,
            options,
            synonymHint: item.synonyms?.slice(0, 2).join(', ') || 'No synonym hint available',
        };
    });

    return { questions };
};

const shuffleWord = (word) => {
    if (word.length < 2) {
        return word;
    }

    let shuffled = word;
    let attempts = 0;

    while (shuffled === word && attempts < 12) {
        shuffled = shuffleArray(word.split('')).join('');
        attempts += 1;
    }

    return shuffled;
};

export const createWordBuilderSession = () => {
    const selectedWords = pickRandomItems(buildableWords, 5);
    const questions = selectedWords.map((item, index) => ({
        id: `${item.word}-${index}`,
        word: item.word,
        shuffled: shuffleWord(item.word),
        definition: item.definition,
        example: item.sentences?.[0] || 'Think about the word that fits this meaning.',
        synonymHint: item.synonyms?.slice(0, 2).join(', ') || 'No synonym hint available',
    }));

    return { questions };
};
