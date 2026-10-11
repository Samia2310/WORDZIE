import React, { useMemo, useState } from 'react';
import {
    ArrowLeft,
    Bookmark,
    BookmarkCheck,
    BookOpenText,
    Feather,
    RefreshCw,
    Sparkles,
} from 'lucide-react';
import './WordTalesPage.css';

const readingLevels = [
    {
        id: 'seed',
        name: 'Easy Read',
        range: 'Beginner',
        description: 'Short, clear sentences and everyday situations. Simple to follow from start to finish.',
        minWords: 5,
        maxWords: 6,
        tone: 'seed',
    },
    {
        id: 'weaver',
        name: 'Classic Tale',
        range: 'Intermediate',
        description: 'A richer plot with more detail and varied sentences that gently stretches your reading.',
        minWords: 8,
        maxWords: 9,
        tone: 'weaver',
    },
    {
        id: 'quest',
        name: 'Mastery',
        range: 'Advanced',
        description: 'A layered story with sophisticated language and nuance, built to challenge confident readers.',
        minWords: 10,
        maxWords: 12,
        tone: 'quest',
    },
];

const storyMoods = {
    mystery: {
        label: 'Mystery',
        openings: [
            'Just before closing, Mira found a small brass key tucked inside the old library’s guest book.',
            'The village clock stopped at midnight, and a folded note appeared beneath its glass face.',
        ],
        bridges: [
            'The clue led to a page in the town archive. It read:',
            'Behind the loose brick, Mira found another line:',
            'A final note was waiting inside the locked desk:',
        ],
        endings: [
            'When the clock chimed again, Mira understood that each sentence had been part of the same hidden message.',
            'The key fit the last lock. Inside was the missing book—and the name of the person who had left the clues.',
        ],
    },
    adventure: {
        label: 'Adventure',
        openings: [
            'At sunrise, Sami unfolded a weathered map and set out toward the island beyond the bay.',
            'When the train stopped in an unfamiliar valley, Noor stepped down with a compass and a brave plan.',
        ],
        bridges: [
            'The first landmark carried a message:',
            'Across the river, a traveler had carved these words into a post:',
            'At the mountain pass, the next clue waited:',
        ],
        endings: [
            'By sunset, the travelers had found their way home with a story far better than the treasure they had expected.',
            'The map ended at a quiet harbor. Their greatest discovery was how much they had learned along the way.',
        ],
    },
    wonder: {
        label: 'Wonder',
        openings: [
            'In a town where the stars could be heard singing, Imani discovered a book that wrote a new page each night.',
            'One rainy afternoon, Leo opened a tiny door in the garden wall and found a library for curious minds.',
        ],
        bridges: [
            'The first page glowed softly and told this scene:',
            'A silver leaf turned over and revealed another passage:',
            'At the heart of the garden, the book offered one last scene:',
        ],
        endings: [
            'As the book closed, the garden returned to normal—but its newest story stayed with Imani.',
            'Leo stepped back through the little door carrying no treasure except a fresh way to see the world.',
        ],
    },
};

Object.assign(storyMoods, {
    friendship: {
        label: 'Friendship',
        openings: [
            'When Asha moved to the neighborhood, she expected a lonely summer. Then a paper boat carrying a handwritten sentence floated into her garden.',
            'Rafi and Mina had been best friends for years, until a small misunderstanding kept them from speaking. Their old clubhouse still held a notebook they had filled together.',
        ],
        bridges: ['The first page brought back a day they had nearly forgotten:', 'Another entry reminded them of a promise beside the river:', 'At the back, a blank page waited for them:'],
        endings: ['By evening, the notebook held a new story in both their handwriting. The misunderstanding was not magically gone, but they had finally started to talk again.', 'Asha folded the last page into a boat and set it on the stream. This time, she waited by the bank, certain someone would come to read it with her.'],
    },
    courage: {
        label: 'Courage',
        openings: [
            'A flood cut off the village clinic, and Nila volunteered to cross the old footbridge for help. In her pocket was a packet of notes from the bridge’s builder.',
            'On the morning of the school recital, Tomas wanted to disappear. His grandmother had left him a list of sentences to read whenever fear took hold.',
        ],
        bridges: ['The first note described a challenge the builder had faced:', 'Farther along, another page showed what happened next:', 'Tucked inside the cover, the final note read:'],
        endings: ['Nila crossed with the rescue team, carefully and together. Later, the villagers repaired the bridge so nobody would have to face it alone.', 'Tomas walked onto the stage with shaking hands and began. By the final line, he was thinking only about telling the story.'],
    },
    comedy: {
        label: 'Comedy',
        openings: [
            'The town’s new invention was meant to sort library books. Instead, it filed the mayor under “gardening” and a very confused goat under “local history.”',
            'Pip entered the village talent show with one serious plan: perform a quiet magic trick. The rabbit escaped before the curtains opened.',
        ],
        bridges: ['The instruction book offered a surprisingly unhelpful suggestion:', 'A second page made the situation even harder to explain:', 'Just when everyone thought the trouble was over, a final note appeared:'],
        endings: ['By closing time, the books were sorted, the goat had a library card, and the mayor was still listed under gardening. Nobody had the heart to correct it.', 'Pip finished the show with the rabbit asleep in his hat. The audience applauded, mostly because the rabbit had finally stopped running.'],
    },
    discovery: {
        label: 'Discovery',
        openings: [
            'A storm uncovered a stone staircase beneath the school greenhouse. Curiosity won over caution, and Hana descended with a notebook and a torch.',
            'At the edge of the family farm, Eli found a box of letters addressed to someone whose name had been scratched away.',
        ],
        bridges: ['The first room held a record of the place before the town existed:', 'A narrow passage led to another set of pages:', 'At the deepest point, a small wooden case waited:'],
        endings: ['The staircase led to an old seed vault built by the town’s first gardeners. Hana brought the records upstairs, and the class decided to plant the seeds together.', 'The letters belonged to Eli’s great-grandmother, who had kept the farm running through a difficult year. He put the box back in the house, no longer wondering whose story it held.'],
    },
    nature: {
        label: 'Nature',
        openings: [
            'After a week without rain, the stream behind the village grew quiet. Leena followed it uphill with her grandfather to find where the water had gone.',
            'A young crane appeared in the marsh with a silver thread tangled around its leg. Arun and his sister set out at dawn to help it safely.',
        ],
        bridges: ['The trail passed through a field where the grass had begun to change:', 'Near the old trees, they found another sign:', 'At the water’s source, the land revealed one last clue:'],
        endings: ['A fallen branch had blocked the stream, and the villagers cleared it together. Water returned slowly, and Leena promised to watch the hills after every storm.', 'They freed the crane without hurting it and watched it rise above the marsh. The silver thread stayed behind, shining in the grass like a reminder to care for wild places.'],
    },
    timeTravel: {
        label: 'Time Travel',
        openings: [
            'At the museum, a pocket watch began ticking backward in Salma’s hand. The gallery vanished, and she found herself standing in the city a hundred years earlier.',
            'Jun found a library card stamped with tomorrow’s date. When he checked out the book, the world outside the window changed to a city from the past.',
        ],
        bridges: ['The machine stopped in another year, where a page from the archive had come loose:', 'A new turn of the watch carried them farther back:', 'The final page appeared just as the watch began ticking forward again:'],
        endings: ['The watch brought Salma home before the museum closed. In the display case, the old photograph had changed: someone new stood in the back row, smiling at the camera.', 'Jun returned the book just as the clock struck midnight. The card was blank now, except for a note: “See you in the next chapter.”'],
    },
});

const normalizeWord = (value = '') => value.trim().replace(/\s+/g, ' ').toUpperCase();

const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const wordOccursIn = (word, sentence) => {
    const escapedWord = escapeRegExp(word).replace(/\s+/g, '\\s+');
    return new RegExp(`(?<![\\p{L}\\p{N}])${escapedWord}(?![\\p{L}\\p{N}])`, 'iu').test(sentence);
};

const shuffle = (items) => {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
};

const getDifficultyScore = (item) => {
    const letterCount = (item.word.match(/[a-z]/gi) || []).length;
    const definitionLength = (item.definition.match(/[a-z]+/gi) || []).length;
    return letterCount + definitionLength * 0.35;
};

const toTitleCase = (value = '') => value.replace(/\b\w/g, (letter) => letter.toUpperCase());

const generateStory = (vocabulary, level, moodId) => {
    const mood = storyMoods[moodId] || storyMoods.mystery;
    const usableWords = [...new Map(vocabulary
        .filter((item) => item?.word && item?.definition && Array.isArray(item.sentences))
        .map((item) => ({
            ...item,
            word: item.word.trim(),
            usableSentences: item.sentences.filter((sentence) => wordOccursIn(item.word, sentence)),
        }))
        .filter((item) => item.usableSentences.length > 0)
        .map((item) => [normalizeWord(item.word), item])).values()];

    let levelPool = usableWords;
    if (level.id === 'seed') {
        const simplerWords = usableWords.filter((item) => getDifficultyScore(item) <= 12);
        if (simplerWords.length >= level.minWords) levelPool = simplerWords;
    } else if (level.id === 'weaver') {
        const middleWords = usableWords.filter((item) => {
            const score = getDifficultyScore(item);
            return score > 9 && score <= 18;
        });
        if (middleWords.length >= level.minWords) levelPool = middleWords;
    } else {
        const advancedWords = usableWords.filter((item) => getDifficultyScore(item) > 14);
        if (advancedWords.length >= level.minWords) levelPool = advancedWords;
    }

    const targetCount = Math.min(
        levelPool.length,
        level.minWords + Math.floor(Math.random() * (level.maxWords - level.minWords + 1)),
    );
    const targetWords = shuffle(levelPool).slice(0, targetCount);
    const opening = shuffle(mood.openings)[0];
    const ending = shuffle(mood.endings)[0];
    const passages = targetWords.map((item, index) => {
        const bridge = mood.bridges[index % mood.bridges.length];
        const sentence = shuffle(item.usableSentences)[0];
        return `${bridge} “${sentence}”`;
    });
    const passageReflections = [
        'The marked words seemed to point toward something just beyond reach.',
        'Together, the entries began to form a trail through the story.',
        'They tucked the page away and followed the clue to the next place.',
    ];
    const storyPassages = [];
    for (let index = 0; index < passages.length; index += 3) {
        const group = passages.slice(index, index + 3);
        storyPassages.push(`${group.join(' ')} ${shuffle(passageReflections)[0]}`);
    }

    const firstWord = toTitleCase(targetWords[0]?.word || 'A New Beginning');
    const secondWord = toTitleCase(targetWords[1]?.word || targetWords[0]?.word || 'New Beginning');
    const titleOptions = [
        `${firstWord} at the ${mood.label} Library`,
        `The ${firstWord} ${mood.label}`,
        `${firstWord} and the ${secondWord} Clue`,
        `A ${mood.label} Called ${firstWord}`,
        `Where ${firstWord} Meets ${secondWord}`,
        `The ${firstWord} of ${secondWord}`,
    ];
    const storyTitle = shuffle(titleOptions)[0] || `${firstWord}: A New ${mood.label}`;

    return {
        title: storyTitle,
        paragraphs: [opening, ...storyPassages, ending],
        targetWords,
    };
};

const getHighlightedStoryParts = (paragraph, vocabularyByWord, vocabularyPattern) => {
    const parts = [];
    const termRegex = new RegExp(vocabularyPattern.source, vocabularyPattern.flags);
    const matches = [...paragraph.matchAll(termRegex)];
    let cursor = 0;

    matches.forEach((match, index) => {
        const start = match.index;
        const end = start + match[0].length;
        if (start > cursor) parts.push(paragraph.slice(cursor, start));

        const item = vocabularyByWord.get(normalizeWord(match[0]));
        if (item) {
            parts.push(
                <strong
                    className="word-tales__term"
                    key={`${start}-${index}`}
                    data-definition={item.definition}
                    title={item.definition}
                    tabIndex={0}
                    aria-label={`${match[0]}: ${item.definition}`}
                >
                    {match[0]}
                </strong>,
            );
        } else {
            parts.push(match[0]);
        }

        cursor = end;
    });

    if (cursor < paragraph.length) parts.push(paragraph.slice(cursor));
    return parts;
};

const WordTalesPage = ({
    vocabulary = [],
    onBackHome,
    onAddToMyWordlist,
    isWordInMyWordlist,
}) => {
    const [selectedLevelId, setSelectedLevelId] = useState('seed');
    const [selectedMoodId, setSelectedMoodId] = useState('mystery');
    const [story, setStory] = useState(() => generateStory(vocabulary, readingLevels[0], 'mystery'));

    const selectedLevel = readingLevels.find((level) => level.id === selectedLevelId) || readingLevels[0];
    const vocabularyByWord = useMemo(
        () => new Map(vocabulary.map((item) => [normalizeWord(item.word), item])),
        [vocabulary],
    );
    const vocabularyPattern = useMemo(() => {
        const alternatives = [...vocabulary]
            .filter((item) => item?.word?.trim() && (item.word.match(/[a-z]/gi) || []).length > 1)
            .sort((first, second) => second.word.length - first.word.length)
            .map((item) => escapeRegExp(item.word.trim()).replace(/\s+/g, '\\s+'));
        return new RegExp(
            `(?<![\\p{L}\\p{N}])(${alternatives.join('|')})(?![\\p{L}\\p{N}])`,
            'giu',
        );
    }, [vocabulary]);
    const storyWords = useMemo(() => {
        const usedKeys = new Set();
        const termsRegex = new RegExp(vocabularyPattern.source, vocabularyPattern.flags);
        [story.title, ...story.paragraphs].forEach((paragraph) => {
            [...paragraph.matchAll(termsRegex)].forEach((match) => usedKeys.add(normalizeWord(match[0])));
        });
        return [...usedKeys].map((word) => vocabularyByWord.get(word)).filter(Boolean);
    }, [story, vocabularyByWord, vocabularyPattern]);

    const handleGenerate = () => {
        setStory(generateStory(vocabulary, selectedLevel, selectedMoodId));
    };

    return (
        <main className="word-tales-page">
            <div className="word-tales-page__shell">
                <button className="word-tales__back" onClick={onBackHome} type="button">
                    <ArrowLeft size={17} aria-hidden="true" /> Back to Home
                </button>

                <header className="word-tales__hero">
                    <span className="word-tales__eyebrow"><Feather size={16} /> WORDZIE STORY STUDIO</span>
                    <h1>Word Tales - Story Studio</h1>
                    <p>
                        Learn new words the way they’re actually used. Pick a level, set a mood and read a fresh story built around vocabulary words in real context.
                    </p>
                </header>

                <section className="word-tales__setup" aria-labelledby="word-tales-level-heading">
                    <div className="word-tales__section-heading">
                        <div>
                            <span className="word-tales__eyebrow">Choose your reading path</span>
                            <h2 id="word-tales-level-heading">Set a level and a mood.</h2>
                        </div>
                        <label className="word-tales__mood-control">
                            Story mood
                            <select value={selectedMoodId} onChange={(event) => setSelectedMoodId(event.target.value)}>
                                {Object.entries(storyMoods).map(([id, mood]) => (
                                    <option key={id} value={id}>{mood.label}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="word-tales__levels">
                        {readingLevels.map((level) => (
                            <button
                                className={`word-tales__level word-tales__level--${level.tone}${
                                    selectedLevelId === level.id ? ' is-selected' : ''
                                }`}
                                key={level.id}
                                onClick={() => setSelectedLevelId(level.id)}
                                type="button"
                                aria-pressed={selectedLevelId === level.id}
                            >
                                <span>{level.range}</span>
                                <strong>{level.name}</strong>
                                <small>{level.description}</small>
                            </button>
                        ))}
                    </div>

                    <button className="word-tales__generate" onClick={handleGenerate} type="button">
                        <Sparkles size={18} aria-hidden="true" /> Create a new story
                    </button>
                </section>

                <section className="word-tales__story-card" aria-live="polite">
                    <div className="word-tales__story-topline">
                        <span><BookOpenText size={17} aria-hidden="true" /> {storyMoods[selectedMoodId].label} · {selectedLevel.name}</span>
                        <button className="word-tales__regenerate" onClick={handleGenerate} type="button">
                            <RefreshCw size={16} aria-hidden="true" /> New version
                        </button>
                    </div>
                    <article className="word-tales__story">
                        <h2>{getHighlightedStoryParts(story.title, vocabularyByWord, vocabularyPattern)}</h2>
                        {story.paragraphs.map((paragraph, index) => (
                            <p key={`${index}-${paragraph.slice(0, 20)}`}>
                                {getHighlightedStoryParts(paragraph, vocabularyByWord, vocabularyPattern)}
                            </p>
                        ))}
                    </article>
                    <p className="word-tales__hint">
                        Tip: bold vocabulary terms reveal their definitions when you hover over them or focus them with the keyboard.
                    </p>
                </section>

                <section className="word-tales__glossary" aria-labelledby="word-tales-glossary-heading">
                    <div className="word-tales__section-heading">
                        <div>
                            <span className="word-tales__eyebrow">Words from the story</span>
                            <h2 id="word-tales-glossary-heading">Your story glossary</h2>
                        </div>
                        <span className="word-tales__word-count">{storyWords.length} words</span>
                    </div>
                    <div className="word-tales__word-list">
                        {storyWords.map((item) => {
                            const isSaved = isWordInMyWordlist?.(item);
                            return (
                                <article className="word-tales__word-card" key={normalizeWord(item.word)}>
                                    <div>
                                        <h3>{item.word}</h3>
                                        <p>{item.definition}</p>
                                    </div>
                                    <button
                                        className="word-tales__save"
                                        type="button"
                                        disabled={isSaved}
                                        onClick={() => onAddToMyWordlist?.(item, {
                                            roundName: `Story Studio · ${story.title}`,
                                            roundId: 'wordtales',
                                        })}
                                    >
                                        {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                                        {isSaved ? 'Saved' : 'Save word'}
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                </section>

            </div>
        </main>
    );
};

export default WordTalesPage;
