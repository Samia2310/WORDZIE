import React, { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    CircleHelp,
    Home,
    RefreshCw,
} from 'lucide-react';
import {
    createMatchingSession,
    findNextUnassignedPrompt,
    getMatchingResults,
} from './gameData.js';
import './MatchingGame.css';

const MatchingGame = ({ onBackToGameSelect, onBackToHome }) => {
    const [session, setSession] = useState(() => createMatchingSession());
    const [activePromptId, setActivePromptId] = useState(session.prompts[0]?.id || '');
    const [assignments, setAssignments] = useState({});
    const [hasChecked, setHasChecked] = useState(false);
    const [draggedOptionId, setDraggedOptionId] = useState('');

    const isComplete = session.prompts.every((prompt) => assignments[prompt.id]);
    const results = hasChecked ? getMatchingResults(session, assignments) : null;

    const assignOptionToPrompt = (promptId, optionId) => {
        if (hasChecked || !promptId || !optionId) {
            return;
        }

        setAssignments((current) => {
            const next = { ...current };
            Object.keys(next).forEach((existingPromptId) => {
                if (next[existingPromptId] === optionId) {
                    delete next[existingPromptId];
                }
            });
            next[promptId] = optionId;
            return next;
        });
    };

    const handleOptionSelect = (optionId) => {
        if (hasChecked || !activePromptId) {
            return;
        }

        assignOptionToPrompt(activePromptId, optionId);

        const previewAssignments = {
            ...assignments,
            [activePromptId]: optionId,
        };
        setActivePromptId(findNextUnassignedPrompt(session.prompts, previewAssignments));
    };

    const clearPrompt = (promptId) => {
        if (hasChecked) {
            return;
        }

        setAssignments((current) => {
            const next = { ...current };
            delete next[promptId];
            return next;
        });
        setActivePromptId(promptId);
    };

    const restartGame = () => {
        const nextSession = createMatchingSession();
        setSession(nextSession);
        setAssignments({});
        setActivePromptId(nextSession.prompts[0]?.id || '');
        setHasChecked(false);
        setDraggedOptionId('');
    };

    return (
        <div className="matching-game">
            <div className="matching-game__shell">
                <header className="matching-game__topbar">
                    <button onClick={onBackToGameSelect} className="matching-game__nav-button">
                        <ArrowLeft size={18} />
                        <span>Back to Games</span>
                    </button>
                    <button onClick={onBackToHome} className="matching-game__nav-button">
                        <Home size={18} />
                        <span>Home</span>
                    </button>
                </header>

                <section className="matching-game__hero">
                    <div className="matching-game__hero-copy">
                        <span className="matching-game__eyebrow">Blue Match Lab</span>
                        <h1>Matching</h1>
                        <p>
                            Match each word to the right synonym or antonym. Drag tiles if you want
                            a more game-like feel, or click a prompt and assign the answer.
                        </p>
                    </div>

                    <div className="matching-game__hud">
                        <div className="matching-game__hud-card">
                            <span>Assigned</span>
                            <strong>
                                {Object.keys(assignments).length} / {session.prompts.length}
                            </strong>
                        </div>
                        <div className="matching-game__hud-card">
                            <span>Active prompt</span>
                            <strong>
                                {session.prompts.find((prompt) => prompt.id === activePromptId)?.word ||
                                    'None'}
                            </strong>
                        </div>
                        <div className="matching-game__hud-card">
                            <span>Drag mode</span>
                            <strong>{draggedOptionId ? 'Tile in hand' : 'Ready'}</strong>
                        </div>
                    </div>
                </section>

                <div className="matching-game__layout">
                    <section className="matching-game__board">
                        <div className="matching-game__board-top">
                            <div>
                                <span className="matching-game__panel-kicker">How to play</span>
                                <h2>Read the relation first, then match carefully.</h2>
                            </div>
                            <button className="matching-game__ghost-button" onClick={restartGame}>
                                <RefreshCw size={16} />
                                <span>New board</span>
                            </button>
                        </div>

                        <div className="matching-game__steps">
                            <span>1. Read the prompt</span>
                            <span>2. Drag or click a tile</span>
                            <span>3. Check the full board</span>
                        </div>

                        <div className="matching-game__board-grid">
                            <div className="matching-game__column">
                                <h3>Prompt cards</h3>
                                {session.prompts.map((prompt) => {
                                    const optionId = assignments[prompt.id];
                                    const assignedOption = session.options.find(
                                        (item) => item.id === optionId,
                                    );
                                    const promptResult = results?.promptResults.find(
                                        (item) => item.promptId === prompt.id,
                                    );

                                    return (
                                        <div
                                            key={prompt.id}
                                            className={`matching-game__prompt-card ${
                                                activePromptId === prompt.id ? 'is-active' : ''
                                            } ${
                                                hasChecked
                                                    ? promptResult?.isCorrect
                                                        ? 'is-correct'
                                                        : 'is-wrong'
                                                    : ''
                                            } ${draggedOptionId ? 'is-drop-target' : ''}`}
                                            onClick={() => setActivePromptId(prompt.id)}
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

                                                const droppedOptionId =
                                                    event.dataTransfer.getData('text/plain') ||
                                                    draggedOptionId;
                                                assignOptionToPrompt(prompt.id, droppedOptionId);
                                                const previewAssignments = {
                                                    ...assignments,
                                                    [prompt.id]: droppedOptionId,
                                                };
                                                setActivePromptId(
                                                    findNextUnassignedPrompt(
                                                        session.prompts,
                                                        previewAssignments,
                                                    ),
                                                );
                                                setDraggedOptionId('');
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' || event.key === ' ') {
                                                    event.preventDefault();
                                                    setActivePromptId(prompt.id);
                                                }
                                            }}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            <div className="matching-game__prompt-top">
                                                <strong>{prompt.word}</strong>
                                                <span>{prompt.relation}</span>
                                            </div>
                                            <p>{prompt.clue}</p>
                                            <div className="matching-game__answer-preview">
                                                <span>{assignedOption?.label || 'Drop a tile here'}</span>
                                                {assignedOption && !hasChecked && (
                                                    <button
                                                        className="matching-game__mini-button"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            clearPrompt(prompt.id);
                                                        }}
                                                    >
                                                        Clear
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="matching-game__column">
                                <h3>Answer tiles</h3>
                                <p className="matching-game__column-note">
                                    Drag tiles onto a prompt card, or select a prompt first and click
                                    a tile.
                                </p>
                                <div className="matching-game__option-grid">
                                    {session.options.map((option) => {
                                        const isUsed = Object.values(assignments).includes(option.id);

                                        return (
                                            <button
                                                key={option.id}
                                                className={`matching-game__option ${
                                                    isUsed ? 'is-used' : ''
                                                } ${draggedOptionId === option.id ? 'is-dragging' : ''}`}
                                                onClick={() => handleOptionSelect(option.id)}
                                                draggable={!hasChecked}
                                                onDragStart={(event) => {
                                                    if (hasChecked) {
                                                        event.preventDefault();
                                                        return;
                                                    }

                                                    setDraggedOptionId(option.id);
                                                    event.dataTransfer.effectAllowed = 'move';
                                                    event.dataTransfer.setData('text/plain', option.id);
                                                }}
                                                onDragEnd={() => setDraggedOptionId('')}
                                            >
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="matching-game__actions">
                            <button
                                className="matching-game__primary-button"
                                disabled={!isComplete || hasChecked}
                                onClick={() => setHasChecked(true)}
                            >
                                Check matches
                            </button>
                        </div>
                    </section>

                    <aside className="matching-game__side">
                        <h3>Friendly blue board</h3>
                        <p>
                            This board is designed to feel lighter and more playful, while still
                            training students to notice whether a prompt needs a synonym or antonym.
                        </p>

                        <div className="matching-game__stat-card">
                            <span>Assigned prompts</span>
                            <strong>
                                {Object.keys(assignments).length} / {session.prompts.length}
                            </strong>
                        </div>

                        <div className="matching-game__stat-card">
                            <span>Target skill</span>
                            <strong>Relation accuracy</strong>
                        </div>

                        {results ? (
                            <div className="matching-game__feedback">
                                <h4>Your result</h4>
                                <p>
                                    You matched <strong>{results.correctCount}</strong> out of{' '}
                                    <strong>{results.total}</strong> prompts correctly.
                                </p>
                                <button
                                    className="matching-game__secondary-button"
                                    onClick={restartGame}
                                >
                                    <span>Play another board</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="matching-game__tip">
                                <CircleHelp size={16} />
                                <p>
                                    A familiar-looking tile can still be wrong. Always check whether
                                    the card is asking for a synonym or an antonym.
                                </p>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default MatchingGame;
