import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ArrowLeft,
    ArrowLeftRight,
    Bookmark,
    BookmarkCheck,
    Fingerprint,
    Flame,
    Heart,
    Lightbulb,
    Link2,
    Lock,
    Play,
    Quote,
    RotateCcw,
    Search,
    SkipForward,
    Trophy,
    Type,
} from 'lucide-react';
import './WordDetectivePage.css';

/* ---------- Game rules (tweak here) ---------- */
const CASES_PER_RUN = 5;
const MAX_LIVES = 3;
const BASE_POINTS = 100; // reward for solving with the first clue only
const CLUE_COST = 20; // each extra clue lowers the reward
const MIN_POINTS = 20;
const STREAK_BONUS = 10; // per consecutive solved case
const MAX_STREAK_BONUS = 40;
const BEST_KEY = 'wordzie-detective-best';

const RANKS = [
    { min: 500, title: 'Chief Inspector', note: 'Nearly every case cracked with sharp instincts.' },
    { min: 350, title: 'Inspector', note: 'Strong deduction across the case files.' },
    { min: 200, title: 'Detective', note: 'Solid investigating. The next case is already waiting.' },
    { min: 0, title: 'Rookie', note: 'The badge is earned. Every case sharpens the instincts.' },
];

const CLUE_META = {
    definition: { label: 'Definition', Icon: Search },
    synonyms: { label: 'Similar words', Icon: Link2 },
    sentence: { label: 'Used in a sentence', Icon: Quote },
    antonyms: { label: 'Opposite words', Icon: ArrowLeftRight },
    letters: { label: 'Letter hint', Icon: Type },
};

/* ---------- Helpers ---------- */
const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const shuffle = (items) => {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
};

const readBest = () => {
    try {
        return Number(window.localStorage.getItem(BEST_KEY)) || 0;
    } catch {
        return 0;
    }
};

const writeBest = (value) => {
    try {
        window.localStorage.setItem(BEST_KEY, String(value));
    } catch {
        /* storage unavailable: the best score simply lasts for this visit */
    }
};

/* Turns one vocabulary entry into a playable case, or null when its data is too thin. */
const buildCase = (item) => {
    const word = item.word.trim();
    const lowerWord = word.toLowerCase();
    const bounded = `(?<![\\p{L}\\p{N}])${escapeRegExp(word)}(?![\\p{L}\\p{N}])`;
    const maskPattern = new RegExp(bounded, 'giu');
    const findPattern = new RegExp(bounded, 'iu');
    const mask = (text) => text.replace(maskPattern, '_____');
    const cleanList = (list, limit) => (Array.isArray(list) ? list : [])
        .filter((entry) => typeof entry === 'string' && entry.trim() && !entry.toLowerCase().includes(lowerWord))
        .slice(0, limit);

    const synonyms = cleanList(item.synonyms, 3);
    const antonyms = cleanList(item.antonyms, 2);
    const sentence = (Array.isArray(item.sentences) ? item.sentences : [])
        .find((entry) => typeof entry === 'string' && findPattern.test(entry));

    const clues = [{ type: 'definition', text: mask(item.definition.trim()) }];
    if (synonyms.length) clues.push({ type: 'synonyms', text: synonyms.join(', ') });
    if (sentence) clues.push({ type: 'sentence', text: `“${mask(sentence.trim())}”` });
    if (antonyms.length) clues.push({ type: 'antonyms', text: antonyms.join(', ') });
    clues.push({
        type: 'letters',
        text: `Starts with “${word[0].toUpperCase()}” and ends with “${word.slice(-1).toUpperCase()}”.`,
    });

    if (clues.length < 3) return null;
    return { id: lowerWord, word, item, clues };
};

/* Picks random playable cases, shortest word first so the run builds in difficulty. */
const pickCases = (candidates) => {
    const picked = [];
    for (const item of shuffle(candidates)) {
        const gameCase = buildCase(item);
        if (gameCase) picked.push(gameCase);
        if (picked.length === CASES_PER_RUN) break;
    }
    return picked.sort((first, second) => first.word.length - second.word.length);
};

const SaveWordButton = ({ item, onAdd, isSaved }) => (
    <button
        className="word-detective__save"
        type="button"
        disabled={isSaved}
        onClick={() => onAdd?.(item, { roundName: 'Word Detective', roundId: 'worddetective' })}
    >
        {isSaved ? <BookmarkCheck size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />}
        {isSaved ? 'Saved' : 'Save word'}
    </button>
);

/* ---------- Page ---------- */
const WordDetectivePage = ({
    vocabulary = [],
    onBackHome,
    onAddToMyWordlist,
    isWordInMyWordlist,
}) => {
    const [phase, setPhase] = useState('intro'); // intro | playing | summary
    const [cases, setCases] = useState([]);
    const [caseIndex, setCaseIndex] = useState(0);
    const [revealed, setRevealed] = useState(1);
    const [lives, setLives] = useState(MAX_LIVES);
    const [guess, setGuess] = useState('');
    const [wrongGuesses, setWrongGuesses] = useState([]);
    const [outcome, setOutcome] = useState(null); // null | solved | failed
    const [earned, setEarned] = useState({ base: 0, bonus: 0 });
    const [results, setResults] = useState([]);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [best, setBest] = useState(readBest);
    const [isRecord, setIsRecord] = useState(false);
    const [shake, setShake] = useState(false);
    const inputRef = useRef(null);

    /* Cheap pre-filter once; the heavier clue building only runs for the cases actually played. */
    const candidates = useMemo(() => {
        const seen = new Set();
        return vocabulary.filter((item) => {
            const word = item?.word?.trim();
            if (!word || typeof item.definition !== 'string' || item.definition.trim().length < 12) return false;
            if (!/^[a-z]{4,12}$/i.test(word)) return false;
            const key = word.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [vocabulary]);

    const current = cases[caseIndex];
    const isLastCase = caseIndex === cases.length - 1;
    const potential = Math.max(MIN_POINTS, BASE_POINTS - CLUE_COST * (revealed - 1));
    const streakBonus = Math.min(MAX_STREAK_BONUS, streak * STREAK_BONUS);

    useEffect(() => {
        if (phase === 'playing' && !outcome) inputRef.current?.focus();
    }, [phase, caseIndex, outcome]);

    const resetCase = () => {
        setRevealed(1);
        setLives(MAX_LIVES);
        setGuess('');
        setWrongGuesses([]);
        setOutcome(null);
        setEarned({ base: 0, bonus: 0 });
        setShake(false);
    };

    const startGame = useCallback(() => {
        const picked = pickCases(candidates);
        if (!picked.length) return;
        setCases(picked);
        setCaseIndex(0);
        setResults([]);
        setScore(0);
        setStreak(0);
        setBestStreak(0);
        setIsRecord(false);
        resetCase();
        setPhase('playing');
    }, [candidates]);

    const closeCase = (result, base = 0, bonus = 0) => {
        setOutcome(result);
        setEarned({ base, bonus });
        setResults((previous) => [...previous, result]);
    };

    const submitGuess = (event) => {
        event.preventDefault();
        if (outcome || !guess) return;

        if (guess.toLowerCase() === current.word.toLowerCase()) {
            const base = potential;
            setScore((total) => total + base + streakBonus);
            setStreak((value) => value + 1);
            setBestStreak((value) => Math.max(value, streak + 1));
            closeCase('solved', base, streakBonus);
            return;
        }

        setWrongGuesses((previous) => [...previous, guess.toLowerCase()]);
        setGuess('');
        setShake(true);
        if (lives - 1 <= 0) {
            setLives(0);
            setStreak(0);
            closeCase('failed');
        } else {
            setLives(lives - 1);
        }
    };

    const revealClue = () => {
        if (!outcome && revealed < current.clues.length) setRevealed((value) => value + 1);
    };

    const skipCase = () => {
        if (outcome) return;
        setStreak(0);
        closeCase('failed');
    };

    const nextCase = () => {
        if (isLastCase) {
            const record = score > best;
            setIsRecord(record);
            if (record) {
                setBest(score);
                writeBest(score);
            }
            setPhase('summary');
            return;
        }
        setCaseIndex((value) => value + 1);
        resetCase();
    };

    const solvedCount = results.filter((result) => result === 'solved').length;
    const rank = RANKS.find((entry) => score >= entry.min) || RANKS[RANKS.length - 1];

    return (
        <main className="word-detective-page">
            <div className="word-detective__shell">
                <button className="word-detective__back" onClick={onBackHome} type="button">
                    <ArrowLeft size={17} aria-hidden="true" /> Back to Home
                </button>

                {phase === 'intro' && (
                    <>
                        <header className="word-detective__hero">
                            <span className="word-detective__eyebrow"><Fingerprint size={16} aria-hidden="true" /> Case files open</span>
                            <h1>Word Detective</h1>
                            <p>
                                Crack {CASES_PER_RUN} cases by uncovering hidden words from their clues. Fewer clues used means a bigger reward, and a streak of solved cases adds bonus points.
                            </p>
                        </header>

                        <section className="word-detective__rules" aria-label="How it works">
                            <article>
                                <span>01</span>
                                <h2>Read the clue</h2>
                                <p>Every case starts with a definition and a row of empty letter slots.</p>
                            </article>
                            <article>
                                <span>02</span>
                                <h2>Reveal more if stuck</h2>
                                <p>Extra clues unlock one at a time, and each one lowers the reward by {CLUE_COST} points.</p>
                            </article>
                            <article>
                                <span>03</span>
                                <h2>Guard the lives</h2>
                                <p>{MAX_LIVES} lives per case. A wrong guess costs one, and zero closes the case.</p>
                            </article>
                        </section>

                        <div className="word-detective__start">
                            <button
                                className="word-detective__primary"
                                type="button"
                                onClick={startGame}
                                disabled={candidates.length === 0}
                            >
                                <Play size={18} aria-hidden="true" /> Open the case files
                            </button>
                            {best > 0 && (
                                <span className="word-detective__best"><Trophy size={16} aria-hidden="true" /> Personal best: {best}</span>
                            )}
                            {candidates.length === 0 && (
                                <p className="word-detective__note">Not enough vocabulary is available to build cases yet.</p>
                            )}
                        </div>
                    </>
                )}

                {phase === 'playing' && current && (
                    <>
                        <section className="word-detective__hud" aria-label="Game status">
                            <div className="word-detective__stat">
                                <span><Trophy size={15} aria-hidden="true" /> Score</span>
                                <strong>{score}</strong>
                            </div>
                            <div className={`word-detective__stat word-detective__stat--streak${streak > 0 ? ' is-hot' : ''}`}>
                                <span><Flame size={15} aria-hidden="true" /> Streak</span>
                                <strong>{streak}</strong>
                            </div>
                            <div className="word-detective__stat">
                                <span>Lives</span>
                                <div className="word-detective__hearts" role="img" aria-label={`${lives} of ${MAX_LIVES} lives left`}>
                                    {Array.from({ length: MAX_LIVES }, (_, index) => (
                                        <Heart
                                            key={index}
                                            size={20}
                                            aria-hidden="true"
                                            className={index < lives ? 'is-full' : 'is-empty'}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>

                        <ol className="word-detective__progress" aria-label="Case progress">
                            {cases.map((gameCase, index) => {
                                const state = results[index] || (index === caseIndex ? 'current' : 'upcoming');
                                return (
                                    <li key={gameCase.id} className={`is-${state}`}>
                                        <span className="sr-only">Case {index + 1}: {state}</span>
                                    </li>
                                );
                            })}
                        </ol>

                        <section className="word-detective__case" aria-live="polite">
                            <div className="word-detective__case-top">
                                <span className="word-detective__tag">
                                    <Fingerprint size={16} aria-hidden="true" /> Case {caseIndex + 1} of {cases.length}
                                </span>
                                {!outcome && (
                                    <span className="word-detective__worth">
                                        Worth {potential} pts{streakBonus > 0 && ` + ${streakBonus} streak bonus`}
                                    </span>
                                )}
                            </div>

                            <div
                                className={`word-detective__slots${shake ? ' is-shaking' : ''}`}
                                onAnimationEnd={() => setShake(false)}
                            >
                                <span className="sr-only">Hidden word with {current.word.length} letters</span>
                                {current.word.split('').map((letter, index) => {
                                    const isEdge = index === 0 || index === current.word.length - 1;
                                    const hintShown = revealed >= current.clues.length && isEdge;
                                    let shown = '';
                                    let state = '';
                                    if (outcome) {
                                        shown = letter;
                                        state = outcome === 'solved' ? 'is-solved' : 'is-failed';
                                    } else if (guess[index]) {
                                        shown = guess[index];
                                        state = 'is-typing';
                                    } else if (hintShown) {
                                        shown = letter;
                                        state = 'is-hint';
                                    }
                                    return (
                                        <span className={`word-detective__slot ${state}`} key={index} aria-hidden="true">
                                            {shown}
                                        </span>
                                    );
                                })}
                            </div>

                            <ul className="word-detective__clues">
                                {current.clues.map((clue, index) => {
                                    const { label, Icon } = CLUE_META[clue.type];
                                    if (index >= revealed) {
                                        return (
                                            <li className="word-detective__clue is-locked" key={clue.type}>
                                                <span className="word-detective__clue-label">
                                                    <Lock size={14} aria-hidden="true" /> Clue {index + 1} locked
                                                </span>
                                            </li>
                                        );
                                    }
                                    return (
                                        <li className="word-detective__clue" key={clue.type}>
                                            <span className="word-detective__clue-label">
                                                <Icon size={14} aria-hidden="true" /> {label}
                                            </span>
                                            <p>{clue.text}</p>
                                        </li>
                                    );
                                })}
                            </ul>

                            {!outcome && (
                                <>
                                    <form className="word-detective__form" onSubmit={submitGuess}>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={guess}
                                            maxLength={current.word.length}
                                            onChange={(event) => setGuess(event.target.value.replace(/[^a-z]/gi, ''))}
                                            placeholder="Type the hidden word"
                                            aria-label={`Type the hidden word, ${current.word.length} letters`}
                                            autoComplete="off"
                                            autoCapitalize="none"
                                            spellCheck={false}
                                        />
                                        <button className="word-detective__primary" type="submit" disabled={!guess}>
                                            Submit guess
                                        </button>
                                    </form>

                                    {wrongGuesses.length > 0 && (
                                        <p className="word-detective__misses">
                                            Ruled out:
                                            {wrongGuesses.map((miss, index) => (
                                                <span key={`${miss}-${index}`}>{miss}</span>
                                            ))}
                                        </p>
                                    )}

                                    <div className="word-detective__actions">
                                        <button
                                            className="word-detective__secondary"
                                            type="button"
                                            onClick={revealClue}
                                            disabled={revealed >= current.clues.length}
                                        >
                                            <Lightbulb size={16} aria-hidden="true" /> Reveal next clue (-{CLUE_COST})
                                        </button>
                                        <button className="word-detective__ghost" type="button" onClick={skipCase}>
                                            <SkipForward size={16} aria-hidden="true" /> Skip case
                                        </button>
                                    </div>
                                </>
                            )}

                            {outcome && (
                                <div className={`word-detective__result word-detective__result--${outcome}`}>
                                    <h2>{outcome === 'solved' ? 'Case solved' : 'Case unsolved'}</h2>
                                    <p className="word-detective__earned">
                                        {outcome === 'solved'
                                            ? `+${earned.base + earned.bonus} points${earned.bonus > 0 ? ` (includes ${earned.bonus} streak bonus)` : ''}`
                                            : 'The word got away this time. Studying it now makes the next case easier.'}
                                    </p>
                                    <div className="word-detective__reveal">
                                        <h3>{current.word}</h3>
                                        <p>{current.item.definition}</p>
                                    </div>
                                    <div className="word-detective__actions">
                                        <SaveWordButton
                                            item={current.item}
                                            onAdd={onAddToMyWordlist}
                                            isSaved={Boolean(isWordInMyWordlist?.(current.item))}
                                        />
                                        <button className="word-detective__primary" type="button" onClick={nextCase}>
                                            {isLastCase ? 'See results' : 'Next case'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </>
                )}

                {phase === 'summary' && (
                    <>
                        <header className="word-detective__hero word-detective__hero--summary">
                            <span className="word-detective__eyebrow"><Trophy size={16} aria-hidden="true" /> Investigation complete</span>
                            <h1>{rank.title}</h1>
                            <p>{rank.note}</p>
                        </header>

                        <section className="word-detective__summary-stats" aria-label="Final results">
                            <div><span>Final score</span><strong>{score}</strong></div>
                            <div><span>Cases solved</span><strong>{solvedCount}/{cases.length}</strong></div>
                            <div><span>Best streak</span><strong>{bestStreak}</strong></div>
                            <div><span>Personal best</span><strong>{best}</strong></div>
                        </section>
                        {isRecord && <p className="word-detective__record">New personal best.</p>}

                        <section className="word-detective__files" aria-label="Case files">
                            <h2>Case files</h2>
                            <ul>
                                {cases.map((gameCase, index) => (
                                    <li key={gameCase.id} className={`is-${results[index] || 'failed'}`}>
                                        <div>
                                            <strong>{gameCase.word}</strong>
                                            <p>{gameCase.item.definition}</p>
                                        </div>
                                        <SaveWordButton
                                            item={gameCase.item}
                                            onAdd={onAddToMyWordlist}
                                            isSaved={Boolean(isWordInMyWordlist?.(gameCase.item))}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <div className="word-detective__start">
                            <button className="word-detective__primary" type="button" onClick={startGame}>
                                <RotateCcw size={18} aria-hidden="true" /> New investigation
                            </button>
                            <button className="word-detective__secondary" type="button" onClick={onBackHome}>
                                Back to Home
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default WordDetectivePage;