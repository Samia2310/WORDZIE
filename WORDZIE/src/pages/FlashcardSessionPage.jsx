import React, { useEffect, useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Brain,
    Check,
    Lightbulb,
    RefreshCw,
    Shuffle,
    Sparkles,
    Target,
    Trophy,
} from 'lucide-react';
import './FlashcardSessionPage.css';

const CONFIDENCE_LEVELS = [
    {
        id: 'review',
        label: 'Need practice',
        shortLabel: 'Practice',
        description: 'Keep this card in your active rotation.',
    },
    {
        id: 'familiar',
        label: 'Getting there',
        shortLabel: 'Building',
        description: 'You understand it, but want another pass.',
    },
    {
        id: 'mastered',
        label: 'Know it',
        shortLabel: 'Mastered',
        description: 'You could confidently use this word in context.',
    },
];

const buildDeck = (words = []) =>
    words.map((wordItem, index) => ({
        ...wordItem,
        cardKey: `${wordItem.word}-${index}`,
    }));

const shuffleDeck = (deck) => {
    const shuffled = [...deck];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled;
};

const maskWordInSentence = (sentence = '', word = '') => {
    if (!sentence || !word) {
        return sentence;
    }

    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const maskedSentence = sentence.replace(new RegExp(escapedWord, 'ig'), '_____');

    return maskedSentence;
};

const FlashcardSessionPage = ({
    wordsForRound,
    roundName = 'Flashcard Session',
    handleBackToWordList,
    handleRoundComplete,
}) => {
    const [deck, setDeck] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [studyMode, setStudyMode] = useState('explore');
    const [isFlipped, setIsFlipped] = useState(false);
    const [confidenceByCard, setConfidenceByCard] = useState({});
    const [sessionStartedAt, setSessionStartedAt] = useState(Date.now());
    const [sessionCompletedAt, setSessionCompletedAt] = useState(null);

    useEffect(() => {
        const preparedDeck = buildDeck(wordsForRound);
        setDeck(preparedDeck);
        setCurrentIndex(0);
        setStudyMode('explore');
        setIsFlipped(false);
        setConfidenceByCard({});
        setSessionStartedAt(Date.now());
        setSessionCompletedAt(null);
    }, [wordsForRound]);

    const currentCard = deck[currentIndex] ?? null;
    const ratedCount = Object.keys(confidenceByCard).length;
    const reviewCount = Object.values(confidenceByCard).filter((value) => value === 'review').length;
    const familiarCount = Object.values(confidenceByCard).filter((value) => value === 'familiar').length;
    const masteredCount = Object.values(confidenceByCard).filter((value) => value === 'mastered').length;
    const remainingCount = Math.max(deck.length - ratedCount, 0);
    const progressPercent = deck.length ? Math.round((ratedCount / deck.length) * 100) : 0;
    const sessionComplete = deck.length > 0 && ratedCount === deck.length;
    const elapsedSeconds = Math.max(
        1,
        Math.round(((sessionCompletedAt ?? Date.now()) - sessionStartedAt) / 1000),
    );
    const currentConfidence = currentCard ? confidenceByCard[currentCard.cardKey] : null;
    const masteryScore = deck.length
        ? Math.round((((masteredCount * 1) + (familiarCount * 0.65)) / deck.length) * 100)
        : 0;

    useEffect(() => {
        if (sessionComplete && !sessionCompletedAt) {
            setSessionCompletedAt(Date.now());
        }
    }, [sessionComplete, sessionCompletedAt]);

    const moveToCard = (nextIndex) => {
        if (!deck.length) {
            return;
        }

        setCurrentIndex((nextIndex + deck.length) % deck.length);
        setIsFlipped(false);
    };

    const findNextUnratedIndex = (updatedConfidence, startIndex) => {
        for (let step = 1; step <= deck.length; step += 1) {
            const nextIndex = (startIndex + step) % deck.length;
            const nextCard = deck[nextIndex];

            if (nextCard && !updatedConfidence[nextCard.cardKey]) {
                return nextIndex;
            }
        }

        return startIndex;
    };

    const handleConfidenceSelect = (level) => {
        if (!currentCard) {
            return;
        }

        const updatedConfidence = {
            ...confidenceByCard,
            [currentCard.cardKey]: level,
        };

        setConfidenceByCard(updatedConfidence);

        if (Object.keys(updatedConfidence).length === deck.length) {
            setIsFlipped(false);
            return;
        }

        setCurrentIndex(findNextUnratedIndex(updatedConfidence, currentIndex));
        setIsFlipped(false);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            const target = event.target;

            if (
                !currentCard ||
                sessionComplete ||
                (target instanceof HTMLElement &&
                    (target.tagName === 'INPUT' ||
                        target.tagName === 'TEXTAREA' ||
                        target.isContentEditable))
            ) {
                return;
            }

            if (event.code === 'Space') {
                event.preventDefault();
                setIsFlipped((value) => !value);
                return;
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                moveToCard(currentIndex + 1);
                return;
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                moveToCard(currentIndex - 1);
                return;
            }

            if (!isFlipped) {
                return;
            }

            if (event.key === '1') {
                event.preventDefault();
                handleConfidenceSelect('review');
            }

            if (event.key === '2') {
                event.preventDefault();
                handleConfidenceSelect('familiar');
            }

            if (event.key === '3') {
                event.preventDefault();
                handleConfidenceSelect('mastered');
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentCard, currentIndex, isFlipped, sessionComplete]);

    const handleShuffle = () => {
        setDeck((previous) => shuffleDeck(previous));
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const handleRestart = () => {
        setDeck((previous) => [...previous]);
        setCurrentIndex(0);
        setStudyMode('explore');
        setIsFlipped(false);
        setConfidenceByCard({});
        setSessionStartedAt(Date.now());
        setSessionCompletedAt(null);
    };

    if (!wordsForRound || wordsForRound.length === 0) {
        return (
            <div className="flashcard-studio">
                <header className="flashcard-studio__header">
                    <button onClick={handleBackToWordList} className="flashcard-studio__ghost-button">
                        <ArrowLeft size={18} /> Back to Word List
                    </button>
                </header>
                <section className="flashcard-studio__empty-state">
                    <h1>No vocabulary cards available yet</h1>
                    <p>Choose a round with words first, then open the flashcard studio.</p>
                </section>
            </div>
        );
    }

    if (!currentCard) {
        return (
            <div className="flashcard-studio">
                <header className="flashcard-studio__header">
                    <button onClick={handleBackToWordList} className="flashcard-studio__ghost-button">
                        <ArrowLeft size={18} /> Back
                    </button>
                </header>
                <section className="flashcard-studio__empty-state">
                    <h1>Preparing your flashcards</h1>
                    <p>Your vocabulary deck is loading now.</p>
                </section>
            </div>
        );
    }

    if (sessionComplete) {
        return (
            <div className="flashcard-studio">
                <header className="flashcard-studio__header">
                    <button onClick={handleBackToWordList} className="flashcard-studio__ghost-button">
                        <ArrowLeft size={18} /> Back to Word List
                    </button>
                </header>

                <section className="flashcard-summary">
                    <div className="flashcard-summary__hero">
                        <div className="flashcard-summary__icon">
                            <Trophy size={34} />
                        </div>
                        <span className="flashcard-summary__eyebrow">Session complete</span>
                        <h1>{roundName}</h1>
                        <p>
                            You worked through all {deck.length} cards with a mastery score of{' '}
                            <strong>{masteryScore}%</strong>.
                        </p>
                    </div>

                    <div className="flashcard-summary__metrics">
                        <article>
                            <span>Mastered</span>
                            <strong>{masteredCount}</strong>
                        </article>
                        <article>
                            <span>Building</span>
                            <strong>{familiarCount}</strong>
                        </article>
                        <article>
                            <span>Review again</span>
                            <strong>{reviewCount}</strong>
                        </article>
                        <article>
                            <span>Time spent</span>
                            <strong>{elapsedSeconds}s</strong>
                        </article>
                    </div>

                    <div className="flashcard-summary__insight">
                        <h2>How this deck studied with you</h2>
                        <p>
                            Cards you marked as <strong>Need practice</strong> are the best place to
                            start next time. Cards marked <strong>Know it</strong> can be revisited in
                            a faster review round.
                        </p>
                    </div>

                    <div className="flashcard-summary__actions">
                        <button className="flashcard-studio__primary-button" onClick={handleRestart}>
                            <RefreshCw size={18} /> Study Again
                        </button>
                        <button
                            className="flashcard-studio__secondary-button"
                            onClick={handleBackToWordList}
                        >
                            <BookOpen size={18} /> Back to Word List
                        </button>
                        <button
                            className="flashcard-studio__ghost-button flashcard-studio__ghost-button--solid"
                            onClick={() => handleRoundComplete?.(roundName)}
                        >
                            <Target size={18} /> Finish Round
                        </button>
                    </div>
                </section>
            </div>
        );
    }

    const promptSentence = maskWordInSentence(currentCard?.sentences?.[0], currentCard?.word);

    return (
        <div className="flashcard-studio">
            <header className="flashcard-studio__header">
                <button onClick={handleBackToWordList} className="flashcard-studio__ghost-button">
                    <ArrowLeft size={18} /> Back to Word List
                </button>

                <div className="flashcard-studio__header-copy">
                    <span className="flashcard-studio__eyebrow">Vocabulary Flashcard Studio</span>
                    <h1>{roundName}</h1>
                    <p>Flip, reflect, and rate each word so the deck adapts to your confidence.</p>
                </div>

                <div className="flashcard-studio__header-actions">
                    <button
                        className="flashcard-studio__secondary-button"
                        onClick={handleShuffle}
                        type="button"
                    >
                        <Shuffle size={18} /> Shuffle
                    </button>
                    <button
                        className="flashcard-studio__secondary-button"
                        onClick={handleRestart}
                        type="button"
                    >
                        <RefreshCw size={18} /> Reset
                    </button>
                </div>
            </header>

            <section className="flashcard-studio__hero-grid">
                <article className="flashcard-studio__hero-card flashcard-studio__hero-card--progress">
                    <div className="flashcard-studio__metric-label">Deck progress</div>
                    <div className="flashcard-studio__progress-row">
                        <strong>{progressPercent}%</strong>
                        <span>{ratedCount} of {deck.length} rated</span>
                    </div>
                    <div className="flashcard-studio__progress-bar">
                        <span style={{ width: `${progressPercent}%` }} />
                    </div>
                </article>

                <article className="flashcard-studio__hero-card">
                    <div className="flashcard-studio__metric-icon">
                        <Check size={18} />
                    </div>
                    <div className="flashcard-studio__metric-copy">
                        <span>Mastered</span>
                        <strong>{masteredCount}</strong>
                    </div>
                </article>

                <article className="flashcard-studio__hero-card">
                    <div className="flashcard-studio__metric-icon">
                        <Brain size={18} />
                    </div>
                    <div className="flashcard-studio__metric-copy">
                        <span>Building</span>
                        <strong>{familiarCount}</strong>
                    </div>
                </article>

                <article className="flashcard-studio__hero-card">
                    <div className="flashcard-studio__metric-icon">
                        <Lightbulb size={18} />
                    </div>
                    <div className="flashcard-studio__metric-copy">
                        <span>Still reviewing</span>
                        <strong>{reviewCount + remainingCount}</strong>
                    </div>
                </article>
            </section>

            <main className="flashcard-studio__workspace">
                <aside className="flashcard-studio__sidebar">
                    <div className="flashcard-studio__panel">
                        <div className="flashcard-studio__panel-heading">
                            <Sparkles size={18} />
                            <h2>Study mode</h2>
                        </div>
                        <div className="flashcard-studio__mode-switch">
                            <button
                                type="button"
                                className={
                                    studyMode === 'explore'
                                        ? 'flashcard-studio__mode-button is-active'
                                        : 'flashcard-studio__mode-button'
                                }
                                onClick={() => {
                                    setStudyMode('explore');
                                    setIsFlipped(false);
                                }}
                            >
                                Explore
                            </button>
                            <button
                                type="button"
                                className={
                                    studyMode === 'recall'
                                        ? 'flashcard-studio__mode-button is-active'
                                        : 'flashcard-studio__mode-button'
                                }
                                onClick={() => {
                                    setStudyMode('recall');
                                    setIsFlipped(false);
                                }}
                            >
                                Recall
                            </button>
                        </div>
                        <p className="flashcard-studio__panel-note">
                            {studyMode === 'explore'
                                ? 'Explore mode shows the word first so learners can build meaning and confidence.'
                                : 'Recall mode hides the answer first, helping learners retrieve the word from clues and context.'}
                        </p>
                    </div>

                    <div className="flashcard-studio__panel">
                        <div className="flashcard-studio__panel-heading">
                            <Target size={18} />
                            <h2>How to use this deck</h2>
                        </div>
                        <ul className="flashcard-studio__tips">
                            <li>Think before flipping to strengthen memory, not just recognition.</li>
                            <li>Use examples and word families to connect the meaning with real usage.</li>
                            <li>Rate honestly so the next session shows you what still needs practice.</li>
                        </ul>
                    </div>

                    <div className="flashcard-studio__panel flashcard-studio__panel--compact">
                        <span className="flashcard-studio__panel-kicker">Keyboard shortcuts</span>
                        <p>`Space` flips, arrow keys move, and `1 2 3` rate the card.</p>
                    </div>
                </aside>

                <section className="flashcard-studio__main-stage">
                    <div className="flashcard-studio__card-meta">
                        <span>Card {currentIndex + 1} of {deck.length}</span>
                        {currentConfidence ? (
                            <span className={`flashcard-studio__status-pill is-${currentConfidence}`}>
                                {
                                    CONFIDENCE_LEVELS.find((level) => level.id === currentConfidence)
                                        ?.shortLabel
                                }
                            </span>
                        ) : (
                            <span className="flashcard-studio__status-pill">Not rated yet</span>
                        )}
                    </div>

                    <div
                        className={`flashcard-card ${isFlipped ? 'is-flipped' : ''}`}
                        onClick={() => setIsFlipped((value) => !value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                setIsFlipped((value) => !value);
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isFlipped}
                    >
                        <div className="flashcard-card__inner">
                            <article className="flashcard-card__face flashcard-card__face--front">
                                <div className="flashcard-card__badge">
                                    {studyMode === 'explore' ? 'See the word first' : 'Guess the word'}
                                </div>
                                {studyMode === 'explore' ? (
                                    <>
                                        <p className="flashcard-card__prompt">
                                            Say the meaning in your own words before you flip.
                                        </p>
                                        <h2 className="flashcard-card__word">{currentCard.word}</h2>
                                        <div className="flashcard-card__clues">
                                            <span>{currentCard.word.length} letters</span>
                                            <span>Starts with {currentCard.word[0]}</span>
                                            <span>{currentCard.synonyms?.[0] ?? 'Vocabulary builder'}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="flashcard-card__prompt">
                                            Which word matches this clue?
                                        </p>
                                        <h2 className="flashcard-card__definition">
                                            {currentCard.definition}
                                        </h2>
                                        <div className="flashcard-card__context-box">
                                            <span>Context clue</span>
                                            <p>{promptSentence || 'Think of a sentence where this word would fit naturally.'}</p>
                                        </div>
                                    </>
                                )}
                                <div className="flashcard-card__footer">
                                    <span>Click or press space to reveal</span>
                                    <ArrowRight size={18} />
                                </div>
                            </article>

                            <article className="flashcard-card__face flashcard-card__face--back">
                                <div className="flashcard-card__answer-header">
                                    <span className="flashcard-card__answer-label">Answer</span>
                                    <h2>{currentCard.word}</h2>
                                    <p>{currentCard.definition}</p>
                                </div>

                                <div className="flashcard-card__info-grid">
                                    <div className="flashcard-card__info-block">
                                        <span>Synonyms</span>
                                        <p>{currentCard.synonyms?.join(', ') || 'No synonyms listed yet.'}</p>
                                    </div>
                                    <div className="flashcard-card__info-block">
                                        <span>Antonyms</span>
                                        <p>{currentCard.antonyms?.join(', ') || 'No antonyms listed yet.'}</p>
                                    </div>
                                    <div className="flashcard-card__info-block flashcard-card__info-block--wide">
                                        <span>Use it in context</span>
                                        <p>{currentCard.sentences?.[0] || 'Example sentence coming soon.'}</p>
                                    </div>
                                </div>

                                <div className="flashcard-card__confidence">
                                    <div className="flashcard-card__confidence-copy">
                                        <h3>How did this one feel?</h3>
                                        <p>Rate the card to shape your next review session.</p>
                                    </div>
                                    <div className="flashcard-card__confidence-actions">
                                        {CONFIDENCE_LEVELS.map((level, index) => (
                                            <button
                                                key={level.id}
                                                type="button"
                                                className={`flashcard-card__confidence-button is-${level.id}`}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleConfidenceSelect(level.id);
                                                }}
                                            >
                                                <strong>{level.label}</strong>
                                                <span>{level.description}</span>
                                                <em>{index + 1}</em>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>

                    <div className="flashcard-studio__controls">
                        <button
                            type="button"
                            className="flashcard-studio__secondary-button"
                            onClick={() => moveToCard(currentIndex - 1)}
                        >
                            <ArrowLeft size={18} /> Previous
                        </button>
                        <button
                            type="button"
                            className="flashcard-studio__primary-button"
                            onClick={() => setIsFlipped((value) => !value)}
                        >
                            {isFlipped ? 'Hide answer' : 'Reveal answer'}
                        </button>
                        <button
                            type="button"
                            className="flashcard-studio__secondary-button"
                            onClick={() => moveToCard(currentIndex + 1)}
                        >
                            Next <ArrowRight size={18} />
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default FlashcardSessionPage;
