import React, { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Brain,
    CheckCircle2,
    Gamepad2,
    LayoutGrid,
    Sparkles,
    Target,
    Trophy,
} from 'lucide-react';
import { allWords, GAME_CATALOG, GAME_IDS } from './games/gameData.js';
import PuzzleBucketsGame from './games/PuzzleBucketsGame.jsx';
import MatchingGame from './games/MatchingGame.jsx';
import FillInTheBlanksGame from './games/FillInTheBlanksGame.jsx';
import WordBuilderGame from './games/WordBuilderGame.jsx';
import './ChallengeMode.css';

const gameIcons = {
    [GAME_IDS.PUZZLE]: LayoutGrid,
    [GAME_IDS.MATCHING]: Target,
    [GAME_IDS.FILL_BLANKS]: BookOpen,
    [GAME_IDS.WORD_BUILDER]: Brain,
};

const GameStudio = ({ onModeSelect, onBackToHome }) => {
    const [activeGameKey, setActiveGameKey] = useState(GAME_IDS.PUZZLE);
    const activeGame = GAME_CATALOG[activeGameKey];
    const ActiveIcon = gameIcons[activeGameKey];

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
                        <span className="game-studio__eyebrow">Interactive Vocabulary Games</span>
                        <h1>Choose a game style that fits the kind of learning you want.</h1>
                        <p>
                            Each game now lives in its own file and its own visual system, so the
                            experience can feel more intentional instead of one shared template.
                        </p>

                        <div className="game-studio__actions">
                            <button
                                className="game-studio__primary-button"
                                onClick={() => onModeSelect(activeGameKey)}
                            >
                                <Sparkles size={18} />
                                <span>Start {activeGame.title}</span>
                            </button>
                            <div className="game-studio__stat-pill">
                                <strong>4</strong>
                                <span>Different game experiences</span>
                            </div>
                            <div className="game-studio__stat-pill">
                                <strong>{allWords.length}+</strong>
                                <span>Vocabulary words available</span>
                            </div>
                        </div>
                    </div>

                    <aside className="game-studio__feature-card">
                        <div className="game-studio__feature-icon">
                            <ActiveIcon size={22} />
                        </div>
                        <span className="game-studio__feature-label">Featured right now</span>
                        <h2>{activeGame.title}</h2>
                        <p>{activeGame.description}</p>
                        <div className="game-studio__skill-list">
                            {activeGame.skills.map((skill) => (
                                <span key={skill}>{skill}</span>
                            ))}
                        </div>
                        <button
                            className="game-studio__secondary-button"
                            onClick={() => onModeSelect(activeGameKey)}
                        >
                            <span>Open this game</span>
                            <ArrowRight size={16} />
                        </button>
                    </aside>
                </section>

                <section className="game-studio__grid-section">
                    <div className="game-studio__heading">
                        <span className="game-studio__eyebrow">Pick a game</span>
                        <h2>Four separate game files. Four different visual identities.</h2>
                    </div>

                    <div className="game-studio__grid">
                        {Object.entries(GAME_CATALOG).map(([gameKey, game]) => {
                            const IconComponent = gameIcons[gameKey];
                            const isActive = activeGameKey === gameKey;

                            return (
                                <article
                                    key={gameKey}
                                    className={`game-studio__card ${isActive ? 'is-active' : ''}`}
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

                <section className="game-studio__benefits">
                    <div className="game-studio__benefit-card">
                        <Gamepad2 size={20} />
                        <div>
                            <h3>More than a quiz</h3>
                            <p>
                                Each game trains a different skill instead of forcing every activity
                                into one repeated format.
                            </p>
                        </div>
                    </div>
                    <div className="game-studio__benefit-card">
                        <CheckCircle2 size={20} />
                        <div>
                            <h3>Clearer maintenance</h3>
                            <p>
                                Separate files make it much easier to redesign or improve one game
                                without touching the others.
                            </p>
                        </div>
                    </div>
                    <div className="game-studio__benefit-card">
                        <Trophy size={20} />
                        <div>
                            <h3>Unique identity</h3>
                            <p>
                                Each game can now have its own look and mood instead of sharing one
                                global design system.
                            </p>
                        </div>
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
        if (selectedMode === GAME_IDS.PUZZLE) {
            return (
                <PuzzleBucketsGame
                    onBackToGameSelect={handleBackToGameSelect}
                    onBackToHome={handleBackToHome}
                />
            );
        }

        if (selectedMode === GAME_IDS.MATCHING) {
            return (
                <MatchingGame
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
