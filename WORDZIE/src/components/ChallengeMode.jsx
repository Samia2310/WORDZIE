import React, { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Award,
    BookOpen,
    Brain,
    Gamepad2,
    LayoutGrid,
    Sparkles,
    Target,
} from 'lucide-react';
import { allWords, GAME_CATALOG, GAME_IDS } from './games/gameData.js';
import WordBucketsGame from './games/WordBucketsGame.jsx';
import ConnectTheWordsGame from './games/ConnectTheWords.Game.jsx';
import FillInTheBlanksGame from './games/FillInTheBlanksGame.jsx';
import QuickQuizGame from './games/QuickQuizGame.jsx';
import WordBuilderGame from './games/WordBuilderGame.jsx';
import './ChallengeMode.css';

const gameIcons = {
    [GAME_IDS.WORD_BUCKETS]: LayoutGrid,
    [GAME_IDS.MATCHING]: Target,
    [GAME_IDS.FILL_BLANKS]: BookOpen,
    [GAME_IDS.QUICK_QUIZ]: Award,
    [GAME_IDS.WORD_BUILDER]: Brain,
};

const GameStudio = ({ onModeSelect, onBackToHome }) => {
    const [activeGameKey, setActiveGameKey] = useState(GAME_IDS.WORD_BUCKETS);

    return (
        <div className="game-studio">
            <div className="game-studio__shell">
                <header className="game-studio__topbar">
                    <button onClick={onBackToHome} className="game-studio__nav-button">
                        <ArrowLeft size={18} />
                        <span>Back to Home</span>
                    </button>
                    <div className="game-studio__label">WORDZIE Game Studio</div>
                </header>

                <section className="game-studio__hero">
                    <div className="game-studio__hero-copy">
                        <div className="game-studio__hero-top">
                            <span className="game-studio__eyebrow">Interactive Vocabulary Games</span>
                            <div className="game-studio__feature-icon">
                                <Gamepad2 size={22} />
                            </div>
                        </div>
                        <h1>Choose a vocabulary game for focused practice.</h1>
                        <p>
                            Challenge Mode brings five distinct practice styles into one place, so
                            you can open the activity that best matches the vocabulary skill you
                            want to build next.
                        </p>

                        <div className="game-studio__skill-list game-studio__skill-list--hero">
                            <span>Word families</span>
                            <span>Synonym and antonym practice</span>
                            <span>Context clues</span>
                            <span>Quick mixed quiz</span>
                            <span>Spelling recall</span>
                        </div>

                        <div className="game-studio__actions">
                            <button
                                className="game-studio__primary-button"
                                onClick={() => onModeSelect(activeGameKey)}
                            >
                                <Sparkles size={18} />
                                <span>Open selected game</span>
                            </button>
                            <div className="game-studio__stat-pill">
                                <strong>5</strong>
                                <span>Different game experiences</span>
                            </div>
                            <div className="game-studio__stat-pill">
                                <strong>{allWords.length}+</strong>
                                <span>Vocabulary words available</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="game-studio__grid-section">
                    <div className="game-studio__heading">
                        <span className="game-studio__eyebrow">Pick a game</span>
                    </div>

                    <div className="game-studio__grid">
                        {Object.entries(GAME_CATALOG).map(([gameKey, game]) => {
                            const IconComponent = gameIcons[gameKey];
                            const isActive = activeGameKey === gameKey;

                            return (
                                <article
                                    key={gameKey}
                                    className={`game-studio__card game-studio__card--${gameKey} ${
                                        isActive ? 'is-active' : ''
                                    }`}
                                    onMouseEnter={() => setActiveGameKey(gameKey)}
                                    onFocus={() => setActiveGameKey(gameKey)}
                                    onClick={() => setActiveGameKey(gameKey)}
                                    tabIndex={0}
                                >
                                    <div className="game-studio__card-top">
                                        <div className="game-studio__card-icon">
                                            <IconComponent size={22} />
                                        </div>
                                        <span className="game-studio__card-badge">
                                            {game.difficulty}
                                        </span>
                                    </div>

                                    <h3>{game.title}</h3>
                                    <p>{game.tagline}</p>

                                    <div className="game-studio__card-skills">
                                        {game.skills.map((skill) => (
                                            <span key={skill}>{skill}</span>
                                        ))}
                                    </div>

                                    <button
                                        className="game-studio__card-button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onModeSelect(gameKey);
                                        }}
                                    >
                                        <span>Play game</span>
                                        <ArrowRight size={16} />
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

const ChallengeMode = ({
    currentView,
    selectedMode,
    onModeSelect,
    handleBackToHome,
    handleBackToGameSelect,
}) => {
    if (currentView === 'gameSelect') {
        return <GameStudio onModeSelect={onModeSelect} onBackToHome={handleBackToHome} />;
    }

    if (currentView === 'quiz') {
        if (selectedMode === GAME_IDS.WORD_BUCKETS) {
            return (
                <WordBucketsGame
                    onBackToGameSelect={handleBackToGameSelect}
                    onBackToHome={handleBackToHome}
                />
            );
        }

        if (selectedMode === GAME_IDS.MATCHING) {
            return (
                <ConnectTheWordsGame
                    onBackToGameSelect={handleBackToGameSelect}
                    onBackToHome={handleBackToHome}
                />
            );
        }

        if (selectedMode === GAME_IDS.FILL_BLANKS) {
            return (
                <FillInTheBlanksGame
                    onBackToGameSelect={handleBackToGameSelect}
                    onBackToHome={handleBackToHome}
                />
            );
        }

        if (selectedMode === GAME_IDS.QUICK_QUIZ) {
            return (
                <QuickQuizGame
                    onBackToGameSelect={handleBackToGameSelect}
                    onBackToHome={handleBackToHome}
                />
            );
        }

        return (
            <WordBuilderGame
                onBackToGameSelect={handleBackToGameSelect}
                onBackToHome={handleBackToHome}
            />
        );
    }

    return null;
};

export default ChallengeMode;
