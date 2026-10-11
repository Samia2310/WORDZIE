import React, { useRef } from 'react';
import {
    ArrowRight,
    Award,
    BookOpenText,
    Gamepad2,
    Layers3,
    Library,
    ScanSearch,
    SquareStack,
    Type,
    Zap,
} from 'lucide-react';
import './HomePage.css';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const CHALLENGE_GAME_COUNT = 4;

/* ---------- Circular letter selector (visual design unchanged) ---------- */
const getLetterPosition = (index, total) => {
    const radius = 135;
    const centerX = 160;
    const centerY = 160;
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;

    return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
    };
};

const CircularLetterSelector = ({ onLetterSelect, selectedLetter, wordData, completedLetters }) => {
    const isLetterAvailable = (letter) => Boolean(wordData?.[letter]?.length);

    return (
        <div className="alphabet-selector">
            <svg viewBox="0 0 320 320" className="alphabet-selector__svg">
                <circle cx="160" cy="160" r="52" className="alphabet-selector__core" />
                <text x="160" y="145" textAnchor="middle" className="alphabet-selector__core-line alphabet-selector__core-line--top">
                    Choose a
                </text>
                <text x="160" y="171" textAnchor="middle" className="alphabet-selector__core-line alphabet-selector__core-line--middle">
                    LETTER
                </text>
                <text x="160" y="196" textAnchor="middle" className="alphabet-selector__core-line alphabet-selector__core-line--bottom">
                    to start!
                </text>

                {alphabet.map((letter, index) => {
                    const { x, y } = getLetterPosition(index, alphabet.length);
                    const isAvailable = isLetterAvailable(letter);
                    const isSelected = selectedLetter === letter;
                    const isMarked = Boolean(completedLetters?.[letter]);

                    let circleClassName = 'alphabet-selector__letter-ring';
                    let textClassName = 'alphabet-selector__letter-text';

                    if (isAvailable) {
                        circleClassName += ' is-available';
                        textClassName += ' is-available';
                    } else {
                        circleClassName += ' is-unavailable';
                        textClassName += ' is-unavailable';
                    }

                    if (isSelected) {
                        circleClassName += ' is-selected';
                        textClassName += ' is-selected';
                    }

                    if (isMarked) {
                        circleClassName += ' is-marked';
                        textClassName += ' is-marked';
                    }

                    const select = () => {
                        if (isAvailable) onLetterSelect?.(letter);
                    };

                    return (
                        <g
                            key={letter}
                            className="alphabet-selector__letter"
                            role="button"
                            tabIndex={isAvailable ? 0 : -1}
                            aria-label={`Letter ${letter}${isMarked ? ', completed' : ''}${isAvailable ? '' : ', unavailable'}`}
                            aria-disabled={!isAvailable}
                            aria-pressed={isSelected}
                            onClick={select}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    select();
                                }
                            }}
                            style={{ cursor: isAvailable ? 'pointer' : 'not-allowed' }}
                        >
                            <circle cx={x} cy={y} r="15" className={circleClassName} />
                            <text x={x} y={y + 5} textAnchor="middle" className={textClassName}>
                                {letter}
                            </text>
                            {isMarked && (
                                <circle
                                    cx={x + 10}
                                    cy={y - 10}
                                    r="4"
                                    className="alphabet-selector__marked-dot"
                                />
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

/* ---------- Page ---------- */
const HomePage = ({
    onLetterSelect,
    onNavigateToGameSelect,
    onOpenMyWordlist,
    onOpenFlashcardPreview,
    onOpenWordThemes,
    onOpenStoryStudio,
    onOpenWordDetective,
    onOpenQuickQuiz,
    completedLetters,
    markedPageCount = 0,
    selectedLetter,
    wordData,
    myWordlistCount = 0,
}) => {
    const selectorRef = useRef(null);

    const totalWords = Object.values(wordData || {}).reduce((total, words) => total + (words?.length || 0), 0);
    const availableLetters = alphabet.filter((letter) => wordData?.[letter]?.length).length;
    const completedCount = alphabet.filter((letter) => wordData?.[letter]?.length && completedLetters?.[letter]).length;
    const progressPercent = availableLetters ? Math.round((completedCount / availableLetters) * 100) : 0;

    const scrollToSelector = () => {
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        selectorRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    };

    const savedLabel = `${myWordlistCount} saved ${myWordlistCount === 1 ? 'word' : 'words'}`;
    const stages = [
        {
            title: 'Discover',
            description: 'Meet new words by letter or by meaning, with definitions, synonyms and examples close at hand.',
            links: [
                { icon: Layers3, label: 'Word Themes', hint: 'Browse by meaning', onClick: onOpenWordThemes },
                { icon: Type, label: 'Alphabet rounds', hint: 'Study letter by letter', onClick: scrollToSelector },
            ],
        },
        {
            title: 'Read',
            description: 'See vocabulary at work inside short stories written at a chosen reading level.',
            links: [
                { icon: BookOpenText, label: 'Word Tales', hint: 'Words inside short stories', onClick: onOpenStoryStudio },
            ],
        },
        {
            title: 'Practice',
            description: 'Turn recognition into recall through clue-based cases and quiz-style challenge games.',
            links: [
                { icon: ScanSearch, label: 'Word Detective', hint: 'Solve cases from clues', onClick: onOpenWordDetective },
                { icon: Gamepad2, label: 'Challenge Modes', hint: 'Quiz-style games', onClick: onNavigateToGameSelect },
            ],
        },
        {
            title: 'Review',
            description: 'Revisit words through flashcards, quizzes and a personal wordlist until they stick.',
            links: [
                { icon: SquareStack, label: 'Flashcard Studio', hint: 'Definitions, synonyms and usage', onClick: onOpenFlashcardPreview },
                { icon: Award, label: 'Quick Quiz', hint: 'Instant feedback', onClick: onOpenQuickQuiz },
                { icon: Library, label: 'My Wordlist', hint: savedLabel, onClick: onOpenMyWordlist },
            ],
        },
    ];

    return (
        <div className="home-page">
            <div className="home-shell">
                {/* ---------- Hero ---------- */}
                <section className="home-hero home-hero--solo">
                    <div className="home-hero__copy">
                        <div className="home-badge">
                            <Zap size={16} aria-hidden="true" />
                            <span>Vocabulary studio for focused daily learning</span>
                        </div>

                        <h1 className="home-title">Build vocabulary with clarity and purpose</h1>

                        <p className="home-description">
                            WORDZIE brings alphabet-based study, flashcards, stories and games together in one focused learning space. Start with a letter, or explore vocabulary by meaning and situation.
                        </p>

                        <div className="home-actions">
                            <button className="home-button home-button--primary" type="button" onClick={onOpenWordThemes}>
                                <Layers3 size={18} aria-hidden="true" /> Explore Word Themes
                            </button>
                            <button className="home-button home-button--secondary" type="button" onClick={onOpenStoryStudio}>
                                <BookOpenText size={18} aria-hidden="true" /> Delve into Word Tales
                            </button>
                            <button className="home-button home-button--secondary" type="button" onClick={onOpenWordDetective}>
                                <ScanSearch size={18} aria-hidden="true" /> Word Detective
                            </button>
                            <button className="home-button home-button--secondary" type="button" onClick={onOpenMyWordlist}>
                                <Library size={18} aria-hidden="true" /> My Wordlist
                            </button>
                        </div>
                    </div>

                    <dl className="home-metrics">
                        <div className="home-metric">
                            <dd>{totalWords.toLocaleString()}+</dd>
                            <dt>Vocabulary entries</dt>
                        </div>
                        <div className="home-metric">
                            <dd>{availableLetters}</dd>
                            <dt>Active letter tracks</dt>
                        </div>
                        <div className="home-metric">
                            <dd>{CHALLENGE_GAME_COUNT}</dd>
                            <dt>Challenge games</dt>
                        </div>
                        <div className="home-metric">
                            <dd>{myWordlistCount}</dd>
                            <dt>Saved words</dt>
                        </div>
                    </dl>
                </section>

                {/* ---------- Alphabet navigator ---------- */}
                <section className="home-selector" ref={selectorRef} aria-labelledby="home-selector-heading">
                    <div className="home-selector__info">
                        <span className="home-section-kicker">Alphabet Navigator</span>
                        <h2 id="home-selector-heading">Choose a round to start practicing</h2>
                        <p>
                            Select a letter to begin a round. Each round brings a fresh set of study pages, built to keep progress steady as vocabulary takes shape.
                        </p>

                        <div className="home-progress">
                            <div className="home-progress__head">
                                <span>Rounds completed</span>
                                <strong>{completedCount} of {availableLetters}</strong>
                            </div>
                            <div
                                className="home-progress__bar"
                                role="progressbar"
                                aria-label="Rounds completed"
                                aria-valuemin={0}
                                aria-valuemax={availableLetters}
                                aria-valuenow={completedCount}
                            >
                                <span style={{ width: `${progressPercent}%` }} />
                            </div>
                        </div>

                        <ul className="home-legend" aria-label="Letter status key">
                            <li><span className="home-legend__dot is-available" /> Ready to study</li>
                            <li><span className="home-legend__dot is-selected" /> Selected</li>
                            <li><span className="home-legend__dot is-marked" /> Completed</li>
                            <li>
                                <span
                                    className={`home-legend__dot ${markedPageCount > 0 ? 'has-marked-pages' : 'is-no-pages'}`}
                                    aria-hidden="true"
                                />
                                {markedPageCount} Marked {markedPageCount === 1 ? 'Page' : 'Pages'}
                            </li>
                        </ul>
                    </div>

                    <div className="home-selector__dial">
                        <CircularLetterSelector
                            onLetterSelect={onLetterSelect}
                            selectedLetter={selectedLetter}
                            wordData={wordData}
                            completedLetters={completedLetters}
                        />
                    </div>
                </section>

                {/* ---------- Learning path ---------- */}
                <section className="home-path" aria-labelledby="home-path-heading">
                    <div className="home-path__heading">
                        <h2 id="home-path-heading">From first encounter to lasting recall</h2>
                        <p>Each stage builds on the last, moving new words from recognition to confident use.</p>
                    </div>

                    <ol className="home-path__track">
                        {stages.map((stage, index) => (
                            <li className="home-stage" key={stage.title}>
                                <span className="home-stage__number" aria-hidden="true">{index + 1}</span>
                                <h3 className="home-stage__title">{stage.title}</h3>
                                <p className="home-stage__description">{stage.description}</p>
                                <ul className="home-stage__links">
                                    {stage.links.map(({ icon: LinkIcon, label, hint, onClick }) => (
                                        <li key={label}>
                                            <button className="home-stage__link" type="button" onClick={() => onClick?.()}>
                                                {React.createElement(LinkIcon, { size: 18, 'aria-hidden': true })}
                                                <span>
                                                    <strong>{label}</strong>
                                                    <small>{hint}</small>
                                                </span>
                                                <ArrowRight className="home-stage__arrow" size={15} aria-hidden="true" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
