import { wordDataByLetter } from '../../data/wordCollection.js';

export const GAME_IDS = {
    WORD_BUCKETS: 'word_buckets',
    MATCHING: 'matching',
    FILL_BLANKS: 'fill_blanks',
    QUICK_QUIZ: 'quick_quiz',
    WORD_BUILDER: 'word_builder',
};

export const GAME_CATALOG = {
    [GAME_IDS.WORD_BUCKETS]: {
        title: 'Word Buckets',
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
    [GAME_IDS.QUICK_QUIZ]: {
        title: 'Quick Quiz',
        tagline: 'Answer ten mixed questions in one focused set.',
        description:
            'A black-and-white rapid quiz that mixes definitions, synonyms, antonyms, and sentence context so students can test whether they truly understand the vocabulary.',
        skills: ['Mixed recall', 'Meaning accuracy', 'Fast understanding'],
        difficulty: 'Assessment mode',
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

export const WORD_BUCKET_SLOT_TYPES = ['word', 'synonym', 'antonym'];

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

const blankTargetWordInSentence = (sentence = '', word = '') =>
    sentence.replace(new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi'), '_____');

const wordsWithTargetSentence = allWords.filter((item) => getSentenceWithTarget(item));

const buildFallbackBlankSentence = (wordItem) =>
    `Definition clue: ${wordItem.definition} The missing vocabulary word is _____.`;

const buildableWords = allWords.filter(
    (item) => /^[A-Za-z]+$/.test(item.word) && item.word.length >= 4 && item.word.length <= 10,
);

const hasUniqueLabels = (labels, usedLabels) =>
    labels.every((label) => !usedLabels.has(normalizeText(label)));

const addLabelsToSet = (labels, usedLabels) => {
    labels.forEach((label) => usedLabels.add(normalizeText(label)));
};

const selectWordBucketWords = (count) => {
    const shuffledWords = shuffleArray(wordsWithRelations);
    const usedLabels = new Set();
    const selectedWords = [];

    for (const item of shuffledWords) {
        const candidateLabels = [item.word, item.synonyms[0], item.antonyms[0]];

        if (!hasUniqueLabels(candidateLabels, usedLabels)) {
            continue;
        }

        selectedWords.push(item);
        addLabelsToSet(candidateLabels, usedLabels);

        if (selectedWords.length === count) {
            return selectedWords;
        }
    }

    return shuffledWords.slice(0, Math.min(count, shuffledWords.length));
};

const buildMatchingPrompt = (item, relation, index, forbiddenTerms = []) => {
    const answer = relation === 'synonym' ? item.synonyms[0] : item.antonyms[0];

    return {
        id: `${item.word}-${relation}-${index}`,
        word: item.word,
        clue: pickSafeWordClue({
            item,
            candidates: [item.definition, ...getSentenceCandidates(item)],
            forbiddenTerms: [item.word, answer, ...forbiddenTerms],
            fallback: `Choose the correct ${relation} for this vocabulary word.`,
        }),
        relation,
        answer,
    };
};

const selectMatchingPrompts = (count) => {
    const desiredRelations = Array.from(
        { length: count },
        (_, index) => (index % 2 === 0 ? 'synonym' : 'antonym'),
    );
    const shuffledWords = shuffleArray(wordsWithRelations);
    const usedWords = new Set();
    const usedLabels = new Set();
    const prompts = [];

    desiredRelations.forEach((relation, index) => {
        const matchingWord =
            shuffledWords.find((item) => {
                if (usedWords.has(item.word)) {
                    return false;
                }

                const answer = relation === 'synonym' ? item.synonyms[0] : item.antonyms[0];
                return !usedLabels.has(normalizeText(answer));
            }) || shuffledWords.find((item) => !usedWords.has(item.word));

        if (!matchingWord) {
            return;
        }

        usedWords.add(matchingWord.word);
        addLabelsToSet(
            [relation === 'synonym' ? matchingWord.synonyms[0] : matchingWord.antonyms[0]],
            usedLabels,
        );
        prompts.push({
            item: matchingWord,
            relation,
            index,
        });
    });

    return prompts;
};

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

const getUniqueValuesFromPool = ({
    pool,
    getValue,
    excludeValues = [],
    count,
    predicate = null,
}) => {
    const usedValues = new Set(excludeValues.map((value) => normalizeText(value)));
    const values = [];

    for (const item of shuffleArray(pool)) {
        if (predicate && !predicate(item)) {
            continue;
        }

        const value = getValue(item);

        if (!value) {
            continue;
        }

        const normalizedValue = normalizeText(value);

        if (usedValues.has(normalizedValue)) {
            continue;
        }

        usedValues.add(normalizedValue);
        values.push(value);

        if (values.length === count) {
            break;
        }
    }

    return values;
};

const textContainsForbiddenTerm = (text = '', forbiddenTerm = '') => {
    const normalizedText = normalizeText(text);
    const normalizedTerm = normalizeText(forbiddenTerm);

    if (!normalizedText || !normalizedTerm) {
        return false;
    }

    return new RegExp(`\\b${escapeRegExp(normalizedTerm)}\\b`, 'i').test(normalizedText);
};

const getSentenceCandidates = (wordItem) => wordItem.sentences?.filter(Boolean) || [];

const pickSafeClueText = ({ candidates = [], forbiddenTerms = [], fallback = '' }) =>
    candidates.find(
        (candidate) =>
            candidate &&
            forbiddenTerms.every((forbiddenTerm) => !textContainsForbiddenTerm(candidate, forbiddenTerm)),
    ) || fallback;

const pickSafeWordClue = ({ item, candidates = [], forbiddenTerms = [], fallback = '' }) =>
    pickSafeClueText({
        candidates: candidates.map((candidate) => blankTargetWordInSentence(candidate || '', item.word)),
        forbiddenTerms,
        fallback,
    });

export const createWordBucketSession = () => {
    const selectedWords = selectWordBucketWords(4);
    const rowSeeds = selectedWords.map((item, index) => ({
        id: `${item.word}-${index}`,
        item,
        answers: {
            word: item.word,
            synonym: item.synonyms[0],
            antonym: item.antonyms[0],
        },
    }));
    const allBoardLabels = rowSeeds.flatMap((row) => Object.values(row.answers));
    const rows = rowSeeds.map(({ id, item, answers }) => ({
        id,
        clue: pickSafeWordClue({
            item,
            candidates: [item.definition, ...getSentenceCandidates(item)],
            forbiddenTerms: allBoardLabels,
            fallback: 'Study the clue carefully and sort the matching word family.',
        }),
        example: pickSafeWordClue({
            item,
            candidates: getSentenceCandidates(item),
            forbiddenTerms: allBoardLabels,
            fallback: 'Study the meaning carefully before sorting your choices.',
        }),
        answers,
    }));

    const chips = shuffleArray(
        rows.flatMap((row) =>
            WORD_BUCKET_SLOT_TYPES.map((type) => ({
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

export const getWordBucketResults = (session, placements) => {
    const rowResults = session.rows.map((row) => {
        const slotResults = WORD_BUCKET_SLOT_TYPES.map((type) => {
            const slotKey = `${row.id}-${type}`;
            const chipId = placements[slotKey];
            const chip = session.chips.find((item) => item.id === chipId);
            const isCorrect = chip?.rowId === row.id && chip?.type === type;

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
        totalSlots: session.rows.length * WORD_BUCKET_SLOT_TYPES.length,
        completedBuckets: rowResults.filter((row) => row.fullyCorrect).length,
    };
};

export const createMatchingSession = () => {
    const promptSeeds = selectMatchingPrompts(6);
    const answerLabels = promptSeeds.map(({ item, relation }) =>
        relation === 'synonym' ? item.synonyms[0] : item.antonyms[0],
    );
    const prompts = shuffleArray(
        promptSeeds.map(({ item, relation, index }) =>
            buildMatchingPrompt(item, relation, index, answerLabels),
        ),
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
        const isCorrect = option?.promptId === prompt.id;

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
    const selectedWords = pickRandomItems(allWords, 5);
    const questions = selectedWords.map((item, index) => {
        const options = shuffleArray([item.word, ...getDistractorWords(item, allWords, 3)]);
        const sourceSentence = getSentenceWithTarget(item);
        const blankedSentence = pickSafeWordClue({
            item,
            candidates: [sourceSentence, ...getSentenceCandidates(item), buildFallbackBlankSentence(item)],
            forbiddenTerms: options,
            fallback: 'Choose the vocabulary word that best completes the blank: _____.',
        });
        const definitionHint = pickSafeClueText({
            candidates: [item.definition],
            forbiddenTerms: options,
            fallback: 'Use the meaning to identify the missing vocabulary word.',
        });
        const synonymHint = pickSafeClueText({
            candidates: [item.synonyms?.slice(0, 2).join(', ') || ''],
            forbiddenTerms: options,
            fallback: 'Think about the meaning instead of a direct word clue.',
        });

        return {
            id: `${item.word}-${index}`,
            word: item.word,
            definition: definitionHint,
            sentence: blankedSentence,
            sourceSentence:
                sourceSentence ||
                item.sentences?.[0] ||
                'Review the definition and synonym hint to reinforce the answer.',
            options,
            synonymHint,
        };
    });

    return { questions };
};

const buildDefinitionToWordQuestion = (item, index) => {
    const options = shuffleArray([item.word, ...getDistractorWords(item, allWords, 3)]);
    const definitionClue = pickSafeWordClue({
        item,
        candidates: [item.definition],
        forbiddenTerms: options,
        fallback: '',
    });
    const prompt = definitionClue
        ? `Which vocabulary word means "${definitionClue}"?`
        : 'Which vocabulary word best matches the given meaning?';

    return {
        id: `quick-definition-word-${item.word}-${index}`,
        type: 'definition_to_word',
        typeLabel: 'Definition Match',
        prompt,
        stem: '',
        options,
        correctAnswer: item.word,
        insight: `Correct answer: ${item.word}.`,
        supportText: item.sentences?.[0] || `Definition: ${item.definition}`,
    };
};

const buildWordToDefinitionQuestion = (item, index) => {
    const options = shuffleArray([
        item.definition,
        ...getUniqueValuesFromPool({
            pool: allWords,
            getValue: (entry) => entry.definition,
            excludeValues: [item.definition],
            count: 3,
        }),
    ]);

    return {
        id: `quick-word-definition-${item.word}-${index}`,
        type: 'word_to_definition',
        typeLabel: 'Meaning Check',
        prompt: `What is the best definition of ${item.word}?`,
        stem: '',
        options,
        correctAnswer: item.definition,
        insight: `${item.word} means ${item.definition}`,
        supportText: item.sentences?.[0] || `Synonyms: ${item.synonyms?.slice(0, 2).join(', ') || 'N/A'}`,
    };
};

const buildSynonymQuestion = (item, index) => {
    const options = shuffleArray([
        item.synonyms[0],
        ...getUniqueValuesFromPool({
            pool: wordsWithRelations,
            getValue: (entry) => entry.synonyms?.[0] || '',
            excludeValues: [item.synonyms[0], item.word],
            count: 3,
            predicate: (entry) => entry.word !== item.word,
        }),
    ]);
    const definitionClue = pickSafeClueText({
        candidates: [item.definition],
        forbiddenTerms: options,
        fallback: '',
    });
    const prompt = definitionClue
        ? `What is the best synonym for ${item.word}, meaning "${definitionClue}"?`
        : `What is the best synonym for ${item.word}?`;
    const supportText = pickSafeClueText({
        candidates: [
            blankTargetWordInSentence(getSentenceWithTarget(item), item.word),
            item.sentences?.[1],
        ],
        forbiddenTerms: options,
        fallback: item.sentences?.[0] || `Antonym clue: ${item.antonyms?.[0] || 'Not available'}`,
    });

    return {
        id: `quick-synonym-${item.word}-${index}`,
        type: 'synonym',
        typeLabel: 'Synonym Check',
        prompt,
        stem: '',
        options,
        correctAnswer: item.synonyms[0],
        insight: `${item.synonyms[0]} is the strongest synonym in this set.`,
        supportText,
    };
};

const buildAntonymQuestion = (item, index) => {
    const options = shuffleArray([
        item.antonyms[0],
        ...getUniqueValuesFromPool({
            pool: wordsWithRelations,
            getValue: (entry) => entry.antonyms?.[0] || '',
            excludeValues: [item.antonyms[0], item.word],
            count: 3,
            predicate: (entry) => entry.word !== item.word,
        }),
    ]);
    const definitionClue = pickSafeClueText({
        candidates: [item.definition],
        forbiddenTerms: options,
        fallback: '',
    });
    const prompt = definitionClue
        ? `What is the best antonym for ${item.word}, meaning "${definitionClue}"?`
        : `What is the best antonym for ${item.word}?`;
    const supportText = pickSafeClueText({
        candidates: [
            blankTargetWordInSentence(getSentenceWithTarget(item), item.word),
            item.sentences?.[1],
        ],
        forbiddenTerms: options,
        fallback: item.sentences?.[0] || `Synonym clue: ${item.synonyms?.[0] || 'Not available'}`,
    });

    return {
        id: `quick-antonym-${item.word}-${index}`,
        type: 'antonym',
        typeLabel: 'Antonym Check',
        prompt,
        stem: '',
        options,
        correctAnswer: item.antonyms[0],
        insight: `${item.antonyms[0]} is the strongest opposite in this set.`,
        supportText,
    };
};

const buildSentenceQuestion = (item, index) => {
    const sourceSentence = getSentenceWithTarget(item);
    const options = shuffleArray([item.word, ...getDistractorWords(item, allWords, 3)]);
    const sentenceClue = pickSafeClueText({
        candidates: [
            sourceSentence ? blankTargetWordInSentence(sourceSentence, item.word) : '',
            buildFallbackBlankSentence(item),
        ],
        forbiddenTerms: options,
        fallback: buildFallbackBlankSentence(item),
    });

    return {
        id: `quick-sentence-${item.word}-${index}`,
        type: 'sentence',
        typeLabel: 'Sentence Context',
        prompt: `Which word best completes this sentence: "${sentenceClue}"?`,
        stem: '',
        options,
        correctAnswer: item.word,
        insight: `${item.word} is the word that fits the context best.`,
        supportText:
            sourceSentence ||
            item.sentences?.[0] ||
            `Definition: ${item.definition}`,
    };
};

const QUICK_QUIZ_QUESTION_COUNT = 10;

const QUICK_QUIZ_MODE_DEFINITIONS = [
    {
        id: 'definition_to_word',
        label: 'Definition Match',
        pool: allWords,
        buildQuestion: buildDefinitionToWordQuestion,
    },
    {
        id: 'word_to_definition',
        label: 'Meaning Check',
        pool: allWords,
        buildQuestion: buildWordToDefinitionQuestion,
    },
    {
        id: 'synonym',
        label: 'Synonym Check',
        pool: wordsWithRelations,
        buildQuestion: buildSynonymQuestion,
    },
    {
        id: 'antonym',
        label: 'Antonym Check',
        pool: wordsWithRelations,
        buildQuestion: buildAntonymQuestion,
    },
    {
        id: 'sentence',
        label: 'Sentence Context',
        pool: wordsWithTargetSentence.length ? wordsWithTargetSentence : allWords,
        buildQuestion: buildSentenceQuestion,
    },
];

export const QUICK_QUIZ_MODES = [
    { id: 'mixed', label: 'Mixed Mode' },
    ...QUICK_QUIZ_MODE_DEFINITIONS.map(({ id, label }) => ({ id, label })),
];

const QUICK_QUIZ_MODE_MAP = Object.fromEntries(
    QUICK_QUIZ_MODE_DEFINITIONS.map((mode) => [mode.id, mode]),
);

const QUICK_QUIZ_BLUEPRINTS = [
    QUICK_QUIZ_MODE_MAP.definition_to_word,
    QUICK_QUIZ_MODE_MAP.definition_to_word,
    QUICK_QUIZ_MODE_MAP.word_to_definition,
    QUICK_QUIZ_MODE_MAP.word_to_definition,
    QUICK_QUIZ_MODE_MAP.synonym,
    QUICK_QUIZ_MODE_MAP.synonym,
    QUICK_QUIZ_MODE_MAP.antonym,
    QUICK_QUIZ_MODE_MAP.antonym,
    QUICK_QUIZ_MODE_MAP.sentence,
    QUICK_QUIZ_MODE_MAP.sentence,
];

export const createQuickQuizSession = (mode = 'mixed') => {
    const selectedMode = QUICK_QUIZ_MODES.find((entry) => entry.id === mode) || QUICK_QUIZ_MODES[0];
    const blueprints =
        selectedMode.id === 'mixed'
            ? shuffleArray(QUICK_QUIZ_BLUEPRINTS)
            : Array.from(
                  { length: QUICK_QUIZ_QUESTION_COUNT },
                  () => QUICK_QUIZ_MODE_MAP[selectedMode.id],
              );
    const usedWords = new Set();
    const questions = blueprints.map((blueprint, index) => {
        const selectedWord =
            shuffleArray(blueprint.pool).find((item) => !usedWords.has(item.word)) ||
            shuffleArray(allWords).find((item) => !usedWords.has(item.word)) ||
            allWords[0];

        usedWords.add(selectedWord.word);
        return blueprint.buildQuestion(selectedWord, index);
    });

    return {
        questions,
        mode: selectedMode.id,
        modeLabel: selectedMode.label,
        totalQuestions: questions.length,
    };
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
    const questions = selectedWords.map((item, index) => {
        const forbiddenTerms = [item.word];

        return {
            id: `${item.word}-${index}`,
            word: item.word,
            shuffled: shuffleWord(item.word),
            definition: pickSafeClueText({
                candidates: [item.definition],
                forbiddenTerms,
                fallback: 'Rebuild the vocabulary word that matches this meaning.',
            }),
            example: pickSafeWordClue({
                item,
                candidates: getSentenceCandidates(item),
                forbiddenTerms,
                fallback: 'Think about the word that fits this meaning.',
            }),
            synonymHint: pickSafeClueText({
                candidates: [item.synonyms?.slice(0, 2).join(', ') || ''],
                forbiddenTerms,
                fallback: 'Use the definition and letter pattern to rebuild the word.',
            }),
        };
    });

    return { questions };
};
