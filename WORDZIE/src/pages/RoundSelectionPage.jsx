import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Layers3, Sparkles } from 'lucide-react';
import './RoundSelectionPage.css';

const RoundSelectionPage = ({
    selectedLetter,
    rounds,
    markedPages = {},
    onRoundSelect,
    onTogglePageMarked,
    onBack,
}) => {
    const totalWords = (rounds || []).reduce((total, round) => total + (round.words?.length || 0), 0);
    const markedPageCount = (rounds || []).filter((round, index) =>
        markedPages[round.id || `${selectedLetter}-${index}`],
    ).length;

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
                        <article className="round-page-stat">
                            <span>Marked pages</span>
                            <strong>{markedPageCount}/{rounds?.length || 0}</strong>
                        </article>
                    </div>
                </header>

                {rounds && rounds.length > 0 ? (
                    <section className="round-page-grid">
                        {rounds.map((round, index) => {
                            const pageKey = round.id || `${selectedLetter}-${index}`;
                            const isPageMarked = Boolean(markedPages[pageKey]);

                            return (
                                <article
                                    key={pageKey}
                                    className={`round-page-card ${isPageMarked ? 'is-marked' : ''}`}
                                >
                                    <div className="round-page-card__header">
                                        <div>
                                            <span className="round-page-card__eyebrow">Page {index + 1}</span>
                                            <h2 className="round-page-card__title">{round.name}</h2>
                                        </div>
                                        <div className="round-page-card__badges">
                                            <span className="round-page-card__count">{round.words.length} words</span>
                                        </div>
                                    </div>
                                    <div className="round-page-card__meta">
                                        <span className="round-page-card__tag">
                                            <Layers3 size={14} /> Study set
                                        </span>
                                        <button
                                            className={`round-page-card__mark ${
                                                isPageMarked ? 'is-marked' : ''
                                            }`}
                                            onClick={() => onTogglePageMarked?.(pageKey)}
                                            type="button"
                                        >
                                            <CheckCircle2 size={15} />
                                            {isPageMarked ? 'MARKED' : 'MARK'}
                                        </button>
                                        <button
                                            className="round-page-card__cta"
                                            onClick={() => onRoundSelect(round)}
                                            type="button"
                                        >
                                            Open page <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
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
