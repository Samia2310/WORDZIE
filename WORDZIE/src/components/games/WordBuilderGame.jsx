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

const createEmptySlots = (question) => Array.from({ length: question?.word.length || 0 }, () => null);

const WordBuilderGame = ({ onBackToGameSelect, onBackToHome }) => {
    const [session, setSession] = useState(() => createWordBuilderSession());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answerSlots, setAnswerSlots] = useState(() => createEmptySlots(session.questions[0]));
    const [hasChecked, setHasChecked] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);
    const [history, setHistory] = useState([]);
    const [selectedTileId, setSelectedTileId] = useState('');
    const [draggedTileId, setDraggedTileId] = useState('');

    const currentQuestion = session.questions[currentIndex];
    const isComplete = currentIndex >= session.questions.length;
    const letterTiles = currentQuestion
        ? currentQuestion.shuffled.split('').map((letter, index) => ({
              id: `${currentQuestion.id}-tile-${index}`,
              letter,
          }))
        : [];
    const tileMap = new Map(letterTiles.map((tile) => [tile.id, tile]));
    const guess = answerSlots.map((tileId) => tileMap.get(tileId)?.letter || '').join('');
    const placedTileIds = answerSlots.filter(Boolean);
    const availableTiles = letterTiles.filter((tile) => !placedTileIds.includes(tile.id));

    const resetRoundState = (question) => {
        setAnswerSlots(createEmptySlots(question));
        setSelectedTileId('');
        setDraggedTileId('');
        setHasChecked(false);
        setShowHint(false);
    };

    const restartGame = () => {
        const nextSession = createWordBuilderSession();
        setSession(nextSession);
        setCurrentIndex(0);
        resetRoundState(nextSession.questions[0]);
        setScore(0);
        setHistory([]);
    };

    const placeTileInSlot = (slotIndex, tileId) => {
        if (hasChecked || slotIndex < 0 || !tileId) {
            return;
        }

        setAnswerSlots((current) => {
            const next = current.map((currentTileId) =>
                currentTileId === tileId ? null : currentTileId,
            );
            next[slotIndex] = tileId;
            return next;
        });
        setSelectedTileId('');
        setDraggedTileId('');
    };

    const clearSlot = (slotIndex) => {
        if (hasChecked) {
            return;
        }

        setAnswerSlots((current) => {
            if (!current[slotIndex]) {
                return current;
            }

            const next = [...current];
            next[slotIndex] = null;
            return next;
        });
    };

    const returnTileToBank = (tileId) => {
        if (hasChecked || !tileId) {
            return;
        }

        setAnswerSlots((current) =>
            current.map((currentTileId) => (currentTileId === tileId ? null : currentTileId)),
        );
        setSelectedTileId('');
        setDraggedTileId('');
    };

    const handleCheck = () => {
        if (!guess.trim() || hasChecked || !currentQuestion || answerSlots.includes(null)) {
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

        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        resetRoundState(session.questions[nextIndex]);
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
                                        {item.isCorrect ? 'Correct' : `You built: ${item.guess}`}
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
                    <button
                        onClick={onBackToHome}
                        className="builder-game__nav-button builder-game__nav-button--home"
                    >
                        <Home size={18} />
                        <span>Home</span>
                    </button>
                </header>

                <section className="builder-game__hero">
                    <div>
                        <span className="builder-game__eyebrow">Neon Builder</span>
                        <h1>Word Builder</h1>
                        <p>
                            Drag the shuffled letters into the answer slots, think through the
                            definition, and rebuild the right vocabulary word from memory.
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
                                <h2>Drag the letters into order and rebuild the word.</h2>
                            </div>
                            <button className="builder-game__ghost-button" onClick={restartGame}>
                                <RefreshCw size={16} />
                                <span>Restart set</span>
                            </button>
                        </div>

                        <div className="builder-game__build-card">
                            <div className="builder-game__answer-row">
                                {answerSlots.map((tileId, slotIndex) => {
                                    const tile = tileMap.get(tileId);
                                    const expectedLetter = currentQuestion.word[slotIndex];
                                    const isCorrectSlot =
                                        hasChecked &&
                                        tile &&
                                        tile.letter.toLowerCase() === expectedLetter.toLowerCase();

                                    return (
                                        <button
                                            key={`${currentQuestion.id}-slot-${slotIndex}`}
                                            className={`builder-game__answer-slot ${
                                                tile ? 'has-letter' : ''
                                            } ${
                                                hasChecked
                                                    ? isCorrectSlot
                                                        ? 'is-correct'
                                                        : tile
                                                          ? 'is-wrong'
                                                          : ''
                                                    : ''
                                            } ${draggedTileId ? 'is-drop-target' : ''}`}
                                            onClick={() => {
                                                if (selectedTileId) {
                                                    placeTileInSlot(slotIndex, selectedTileId);
                                                    return;
                                                }

                                                clearSlot(slotIndex);
                                            }}
                                            onDragOver={(event) => {
                                                if (!hasChecked) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            onDrop={(event) => {
                                                event.preventDefault();
                                                if (hasChecked) {
                                                    return;
                                                }

                                                const droppedTileId =
                                                    event.dataTransfer.getData('text/plain') ||
                                                    draggedTileId;
                                                placeTileInSlot(slotIndex, droppedTileId);
                                            }}
                                            draggable={!hasChecked && Boolean(tileId)}
                                            onDragStart={(event) => {
                                                if (hasChecked || !tileId) {
                                                    event.preventDefault();
                                                    return;
                                                }

                                                setDraggedTileId(tileId);
                                                setSelectedTileId(tileId);
                                                event.dataTransfer.effectAllowed = 'move';
                                                event.dataTransfer.setData('text/plain', tileId);
                                            }}
                                            onDragEnd={() => setDraggedTileId('')}
                                            disabled={hasChecked}
                                        >
                                            <span>{tile?.letter || ''}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div
                                className="builder-game__bank"
                                onDragOver={(event) => {
                                    if (!hasChecked) {
                                        event.preventDefault();
                                    }
                                }}
                                onDrop={(event) => {
                                    event.preventDefault();
                                    if (hasChecked) {
                                        return;
                                    }

                                    const droppedTileId =
                                        event.dataTransfer.getData('text/plain') || draggedTileId;
                                    returnTileToBank(droppedTileId);
                                }}
                            >
                                <div className="builder-game__bank-header">
                                    <strong>Letter bank</strong>
                                    <span>Drag or tap a letter, then place it into a slot.</span>
                                </div>

                                <div className="builder-game__tiles">
                                    {availableTiles.map((tile) => (
                                        <button
                                            key={tile.id}
                                            className={`builder-game__tile ${
                                                selectedTileId === tile.id ? 'is-selected' : ''
                                            } ${
                                                draggedTileId === tile.id ? 'is-dragging' : ''
                                            }`}
                                            onClick={() =>
                                                setSelectedTileId((current) =>
                                                    current === tile.id ? '' : tile.id,
                                                )
                                            }
                                            draggable={!hasChecked}
                                            onDragStart={(event) => {
                                                if (hasChecked) {
                                                    event.preventDefault();
                                                    return;
                                                }

                                                setDraggedTileId(tile.id);
                                                setSelectedTileId(tile.id);
                                                event.dataTransfer.effectAllowed = 'move';
                                                event.dataTransfer.setData('text/plain', tile.id);
                                            }}
                                            onDragEnd={() => setDraggedTileId('')}
                                        >
                                            {tile.letter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="builder-game__clue-card">
                            <strong>Definition</strong>
                            <p>{currentQuestion.definition}</p>
                            <small>{currentQuestion.example}</small>
                        </div>

                        <div className="builder-game__progress-card">
                            <span>Current build</span>
                            <strong>{guess || 'Start placing letters'}</strong>
                        </div>

                        <div className="builder-game__input-row">
                            <button
                                className="builder-game__primary-button"
                                disabled={!guess.trim() || hasChecked || answerSlots.includes(null)}
                                onClick={handleCheck}
                            >
                                Check word
                            </button>
                            <button
                                className="builder-game__secondary-button"
                                onClick={() => resetRoundState(currentQuestion)}
                                disabled={hasChecked}
                            >
                                Clear letters
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
                                Look for familiar chunks inside the letter bank before placing
                                every slot. That makes long words easier to rebuild.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default WordBuilderGame;
