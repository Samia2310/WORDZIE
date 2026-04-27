import React, { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    CircleHelp,
    Home,
    RefreshCw,
} from 'lucide-react';
import { createWordBuilderSession, normalizeText } from './gameData.js';
import './WordBuilderGame.css';

const WordBuilderGame = ({ onBackToGameSelect, onBackToHome }) => {
    const [session, setSession] = useState(() => createWordBuilderSession());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [guess, setGuess] = useState('');
    const [hasChecked, setHasChecked] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);
    const [history, setHistory] = useState([]);

    const currentQuestion = session.questions[currentIndex];
    const isComplete = currentIndex >= session.questions.length;

    const restartGame = () => {
        setSession(createWordBuilderSession());
        setCurrentIndex(0);
        setGuess('');
        setHasChecked(false);
        setShowHint(false);
        setScore(0);
        setHistory([]);
    };

    const handleCheck = () => {
        if (!guess.trim() || hasChecked || !currentQuestion) {
            return;
        }

        const isCorrect = normalizeText(guess) === normalizeText(currentQuestion.word);
        setHasChecked(true);
        setHistory((current) => [
            ...current,
            {
                id: currentQuestion.id,
                word: currentQuestion.word,
                guess,
                isCorrect,
            },
        ]);

        if (isCorrect) {
            setScore((current) => current + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex === session.questions.length - 1) {
            setCurrentIndex(session.questions.length);
            return;
        }

        setCurrentIndex((current) => current + 1);
        setGuess('');
        setHasChecked(false);
        setShowHint(false);
    };

    if (isComplete) {
        return (
            <div className="builder-game">
                <div className="builder-game__shell builder-game__shell--summary">
                    <div className="builder-game__summary">
                        <span className="builder-game__eyebrow">Session complete</span>
                        <h1>Word Builder finished</h1>
                        <p>
                            You rebuilt <strong>{score}</strong> out of{' '}
                            <strong>{session.questions.length}</strong> words correctly.
                        </p>

                        <div className="builder-game__review-list">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className={`builder-game__review-item ${
                                        item.isCorrect ? 'is-correct' : 'is-wrong'
                                    }`}
                                >
                                    <strong>{item.word}</strong>
                                    <span>
                                        {item.isCorrect ? 'Correct' : `You wrote: ${item.guess}`}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button className="builder-game__primary-button" onClick={restartGame}>
                            Play again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isCorrectGuess = normalizeText(guess) === normalizeText(currentQuestion.word);

    return (
        <div className="builder-game">
            <div className="builder-game__shell">
                <header className="builder-game__topbar">
                    <button onClick={onBackToGameSelect} className="builder-game__nav-button">
                        <ArrowLeft size={18} />
                        <span>Back to Games</span>
                    </button>
                    <button onClick={onBackToHome} className="builder-game__nav-button">
                        <Home size={18} />
                        <span>Home</span>
                    </button>
                </header>

                <section className="builder-game__hero">
                    <div>
                        <span className="builder-game__eyebrow">Neon Builder</span>
                        <h1>Word Builder</h1>
                        <p>
                            Unscramble the letters, think through the definition, and build the
                            right vocabulary word from memory.
                        </p>
                    </div>
                    <div className="builder-game__hero-stats">
                        <div>
                            <span>Score</span>
                            <strong>{score}</strong>
                        </div>
                        <div>
                            <span>Round</span>
                            <strong>{currentIndex + 1} / {session.questions.length}</strong>
                        </div>
                    </div>
                </section>

                <div className="builder-game__layout">
                    <section className="builder-game__board">
                        <div className="builder-game__board-top">
                            <div>
                                <span className="builder-game__panel-kicker">
                                    Round {currentIndex + 1}
                                </span>
                                <h2>Rebuild the word from the shuffled letters.</h2>
                            </div>
                            <button className="builder-game__ghost-button" onClick={restartGame}>
                                <RefreshCw size={16} />
                                <span>Restart set</span>
                            </button>
                        </div>

                        <div className="builder-game__tiles">
                            {currentQuestion.shuffled.split('').map((letter, index) => (
                                <span
                                    key={`${currentQuestion.id}-${index}`}
                                    className="builder-game__tile"
                                >
                                    {letter}
                                </span>
                            ))}
                        </div>

                        <div className="builder-game__clue-card">
                            <strong>Definition</strong>
                            <p>{currentQuestion.definition}</p>
                            <small>{currentQuestion.example}</small>
                        </div>

                        <div className="builder-game__input-row">
                            <input
                                className="builder-game__input"
                                value={guess}
                                onChange={(event) => setGuess(event.target.value)}
                                placeholder="Type the correct word"
                                disabled={hasChecked}
                            />
                            <button
                                className="builder-game__primary-button"
                                disabled={!guess.trim() || hasChecked}
                                onClick={handleCheck}
                            >
                                Check word
                            </button>
                        </div>

                        <div className="builder-game__tools">
                            <button
                                className="builder-game__secondary-button"
                                onClick={() => setShowHint((current) => !current)}
                            >
                                <CircleHelp size={16} />
                                <span>{showHint ? 'Hide hint' : 'Show hint'}</span>
                            </button>
                        </div>

                        {showHint && (
                            <div className="builder-game__hint-card">
                                <strong>Study hint</strong>
                                <p>Synonym hint: {currentQuestion.synonymHint}</p>
                                <small>The answer has {currentQuestion.word.length} letters.</small>
                            </div>
                        )}

                        {hasChecked && (
                            <div
                                className={`builder-game__answer-feedback ${
                                    isCorrectGuess ? 'is-correct' : 'is-wrong'
                                }`}
                            >
                                <h3>{isCorrectGuess ? 'Well built' : 'Correct answer revealed'}</h3>
                                <p>
                                    The correct word is <strong>{currentQuestion.word}</strong>.
                                </p>
                                <button
                                    className="builder-game__primary-button"
                                    onClick={handleNext}
                                >
                                    <span>
                                        {currentIndex === session.questions.length - 1
                                            ? 'Finish session'
                                            : 'Next word'}
                                    </span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        )}
                    </section>

                    <aside className="builder-game__side">
                        <h3>Memory and spelling</h3>
                        <p>
                            This mode slows students down just enough to make them remember the real
                            letter structure of the word, not only its rough meaning.
                        </p>

                        <div className="builder-game__stat-card">
                            <span>Current score</span>
                            <strong>{score}</strong>
                        </div>

                        <div className="builder-game__stat-card">
                            <span>Words left</span>
                            <strong>{session.questions.length - currentIndex}</strong>
                        </div>

                        <div className="builder-game__tip">
                            <CircleHelp size={16} />
                            <p>
                                Look for familiar chunks inside the shuffled tiles before typing
                                the full answer. That makes long words easier to rebuild.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default WordBuilderGame;
