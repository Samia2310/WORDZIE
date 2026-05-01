import React from 'react';
import { ArrowLeft, ArrowRight, Layers3, Sparkles } from 'lucide-react';
import './RoundSelectionPage.css';

const RoundSelectionPage = ({ selectedLetter, rounds, onRoundSelect, onBack }) => {
    const totalWords = (rounds || []).reduce((total, round) => total + (round.words?.length || 0), 0);

    return (
        <div className="round-selection-container">
            <div className="round-selection-shell">
                <header className="round-page-hero">
                    <div className="round-page-hero__top">
                        <button onClick={onBack} className="round-page-back-button" type="button">
                            <ArrowLeft size={18} /> Back to Home
                        </button>
                    </div>

                    <div className="round-page-hero__content">
                        <span className="round-page-kicker">
                            <Sparkles size={14} /> Vocabulary Round
                        </span>
                        <h1 className="round-page-title">
                            Round <span>{selectedLetter.toUpperCase()}</span>
                        </h1>
                        <p className="round-page-subtitle">
                            Choose a page to start a focused study session. Each page inside this round groups a manageable
                            set of words so learning feels organized and easy to continue.
                        </p>
                    </div>

                    <div className="round-page-stats">
                        <article className="round-page-stat">
                            <span>Current round</span>
                            <strong>Round {selectedLetter.toUpperCase()}</strong>
                        </article>
                        <article className="round-page-stat">
                            <span>Total pages</span>
                            <strong>{rounds?.length || 0}</strong>
                        </article>
                        <article className="round-page-stat">
                            <span>Total words</span>
                            <strong>{totalWords}</strong>
                        </article>
                    </div>
                </header>

                {rounds && rounds.length > 0 ? (
                    <section className="round-page-grid">
                        {rounds.map((round, index) => (
                            <button
                                key={round.id || `${selectedLetter}-${index}`}
                                onClick={() => onRoundSelect(round)}
                                className="round-page-card"
                                type="button"
                            >
                                <div className="round-page-card__header">
                                    <div>
                                        <span className="round-page-card__eyebrow">Page {index + 1}</span>
                                        <h2 className="round-page-card__title">{round.name}</h2>
                                    </div>
                                    <span className="round-page-card__count">{round.words.length} words</span>
                                </div>
                                <div className="round-page-card__meta">
                                    <span className="round-page-card__tag">
                                        <Layers3 size={14} /> Study set
                                    </span>
                                    <span className="round-page-card__cta">
                                        Open page <ArrowRight size={16} />
                                    </span>
                                </div>
                            </button>
                        ))}
                    </section>
                ) : (
                    <section className="round-page-empty">
                        <h2>No pages available yet</h2>
                        <p>We could not find any vocabulary pages for this letter right now.</p>
                    </section>
                )}
            </div>
        </div>
    );
};

export default RoundSelectionPage;
