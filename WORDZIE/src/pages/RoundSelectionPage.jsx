import React from 'react';
import './RoundSelectionPage.css';
import { ArrowRight } from 'lucide-react';

const RoundSelectionPage = ({ selectedLetter, rounds, onRoundSelect, onBack }) => {
    return (
        <div className="round-selection-container">
            <header className="round-selection-header">
                <button onClick={onBack} className="back-button">
                    ← Back to Home
                </button>
                <h1 className="round-selection-title">
                    <span className="letter-title">Rounds for {selectedLetter.toUpperCase()}</span>
                </h1>
                <p className="round-selection-subtitle">
                    Select a round to begin your vocabulary journey.
                </p>
            </header>

            {rounds && rounds.length > 0 ? (
                <div className="round-cards-grid">
                    {rounds.map((round, index) => (
                        <div
                            key={index}
                            onClick={() => onRoundSelect(round)}
                            className="round-card"
                        >
                            <div className="card-header">
                                <h2 className="card-title">{round.name}</h2>
                                <span className="word-count-tag">{round.words.length} Words</span>
                            </div>
                            <p className="card-description">{round.description}</p>
                            <div className="card-footer">
                                <span className="start-text">Explore words</span>
                                <ArrowRight className="start-arrow" size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-rounds-message">
                    <p>No rounds found for this letter yet!</p>
                </div>
            )}
        </div>
    );
};

export default RoundSelectionPage;