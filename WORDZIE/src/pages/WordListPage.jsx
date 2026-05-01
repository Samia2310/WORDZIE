import React, { useState } from 'react';
import {
    ArrowLeft,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Home,
    RefreshCw,
    Sparkles,
} from 'lucide-react';
import './WordListPage.css';

const SimpleWordCard = ({ wordItem, index }) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const ToggleIcon = isDetailsVisible ? ChevronUp : ChevronDown;

    return (
        <article className="word-list-card">
            <div className="word-list-card__header">
                <div className="word-list-card__heading">
                    <span className="word-list-card__eyebrow">Word {index + 1}</span>
                    <h3 className="word-list-card__title">{wordItem.word}</h3>
                </div>

                <button
                    onClick={() => setIsDetailsVisible((value) => !value)}
                    className="word-list-card__toggle"
                    aria-expanded={isDetailsVisible}
                    aria-controls={`details-${wordItem.word}`}
                    type="button"
                >
                    <ToggleIcon size={18} className="word-list-icon" />
                </button>
            </div>

            <p className="word-list-card__definition">
                <BookOpen size={15} className="word-list-icon" />
                <span>{wordItem.definition}</span>
            </p>

            <div
                className={`word-list-card__details ${isDetailsVisible ? 'is-visible' : ''}`}
                id={`details-${wordItem.word}`}
            >
                <div className="word-list-card__detail-row">
                    <strong>Synonyms</strong>
                    <span>{wordItem.synonyms?.join(', ') || 'N/A'}</span>
                </div>

                <div className="word-list-card__detail-row">
                    <strong>Antonyms</strong>
                    <span>{wordItem.antonyms?.join(', ') || 'N/A'}</span>
                </div>

                {wordItem.sentences?.length > 0 && (
                    <div className="word-list-card__detail-block">
                        <strong>Sentence</strong>
                        <ul className="word-list-card__sentences">
                            {wordItem.sentences.map((sentence, sentenceIndex) => (
                                <li key={sentenceIndex}>{sentence}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </article>
    );
};

const WordListPage = ({
    wordsForRound,
    roundName,
    selectedLetter,
    handleBackToRounds,
    handleStartFlashcard,
    handleBackToHome,
}) => {
    const words = wordsForRound || [];

    if (words.length === 0) {
        return (
            <div className="word-list-page">
                <div className="word-list-shell">
                    <section className="word-list-empty">
                        <div className="word-list-empty__actions">
                            <button onClick={handleBackToHome} className="word-list-ghost-button" type="button">
                                <Home size={18} /> Back to Home
                            </button>
                            <button onClick={handleBackToRounds} className="word-list-ghost-button" type="button">
                                <ArrowLeft size={18} /> Back to Pages
                            </button>
                        </div>

                        <h1>No words found for {roundName}</h1>
                        <p>Please return to the round selection page and choose another set.</p>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="word-list-page">
            <div className="word-list-shell">
                <header className="word-list-hero">
                    <div className="word-list-hero__top">
                        <button onClick={handleBackToRounds} className="word-list-ghost-button" type="button">
                            <ArrowLeft size={18} /> Back to Pages
                        </button>

                        <button onClick={handleBackToHome} className="word-list-ghost-button" type="button">
                            <Home size={18} /> Back to Home
                        </button>
                    </div>

                    <div className="word-list-hero__content">
                        <span className="word-list-kicker">
                            <Sparkles size={14} /> Focused Vocabulary Set
                        </span>
                        <h1 className="word-list-title">{roundName}</h1>
                        <p className="word-list-subtitle">
                            Review each word carefully, expand the details when you want more context,
                            then move into flashcards when you are ready to reinforce recall.
                        </p>
                    </div>

                    <div className="word-list-stats">
                        <article className="word-list-stat">
                            <span>Current round</span>
                            <strong>
                                {selectedLetter?.toUpperCase?.()
                                    ? `Round ${selectedLetter.toUpperCase()}`
                                    : 'Set'}
                            </strong>
                        </article>
                        <article className="word-list-stat">
                            <span>Total words</span>
                            <strong>{words.length}</strong>
                        </article>
                        <article className="word-list-stat">
                            <span>Next step</span>
                            <strong>Flashcards</strong>
                        </article>
                    </div>
                </header>

                <main className="word-list-grid">
                    {words.map((wordItem, index) => (
                        <SimpleWordCard key={wordItem.word} wordItem={wordItem} index={index} />
                    ))}
                </main>

                <footer className="word-list-footer">
                    <div className="word-list-footer__panel">
                        <div className="word-list-footer__copy">
                            <span className="word-list-kicker">Study Continuation</span>
                            <h2>Take this set into interactive flashcards</h2>
                            <p>
                                Switch from reading mode to active recall and practice what you just reviewed.
                            </p>
                        </div>

                        <button className="word-list-primary-button" onClick={handleStartFlashcard} type="button">
                            <RefreshCw size={20} className="word-list-icon" /> Start Flashcard Session
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default WordListPage;
