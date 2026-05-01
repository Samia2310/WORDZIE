import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CircleHelp, Home, RefreshCw } from 'lucide-react';
import { QUICK_QUIZ_MODES, createQuickQuizSession, normalizeText } from './gameData.js';
import './QuickQuizGame.css';

const QuickQuizGame = ({ onBackToGameSelect, onBackToHome }) => {
    const [selectedMode, setSelectedMode] = useState('mixed');
    const [session, setSession] = useState(() => createQuickQuizSession('mixed'));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [hasChecked, setHasChecked] = useState(false);
    const [score, setScore] = useState(0);
    const [history, setHistory] = useState([]);

    const currentQuestion = session.questions[currentIndex];
    const isComplete = currentIndex >= session.questions.length;

    const restartQuiz = (mode = selectedMode) => {
        setSession(createQuickQuizSession(mode));
        setCurrentIndex(0);
        setSelectedOption('');
        setHasChecked(false);
        setScore(0);
        setHistory([]);
    };

    const handleModeChange = (event) => {
        const nextMode = event.target.value;
        setSelectedMode(nextMode);
        restartQuiz(nextMode);
    };

    const handleCheck = () => {
        if (!currentQuestion || !selectedOption || hasChecked) {
            return;
        }

        const isCorrect =
            normalizeText(selectedOption) === normalizeText(currentQuestion.correctAnswer);

        setHasChecked(true);
        setHistory((current) => [
            ...current,
            {
                id: currentQuestion.id,
                typeLabel: currentQuestion.typeLabel,
                selectedOption,
                correctAnswer: currentQuestion.correctAnswer,
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
        setSelectedOption('');
        setHasChecked(false);
    };

    if (isComplete) {
        return (
            <div className="quick-quiz">
                <div className="quick-quiz__shell quick-quiz__shell--summary">
                    <section className="quick-quiz__summary">
                        <span className="quick-quiz__eyebrow">Set complete</span>
                        <h1>Quick Quiz finished</h1>
                        <p>
                            You answered <strong>{score}</strong> out of{' '}
                            <strong>{session.totalQuestions}</strong> questions correctly.
                        </p>

                        <div className="quick-quiz__summary-grid">
                            <article className="quick-quiz__summary-stat">
                                <span>Score</span>
                                <strong>{score} / {session.totalQuestions}</strong>
                            </article>
                            <article className="quick-quiz__summary-stat">
                                <span>Accuracy</span>
                                <strong>{Math.round((score / session.totalQuestions) * 100)}%</strong>
                            </article>
                            <article className="quick-quiz__summary-stat">
                                <span>Mode</span>
                                <strong>{session.modeLabel}</strong>
                            </article>
                        </div>

                        <div className="quick-quiz__review-list">
                            {history.map((item, index) => (
                                <article
                                    key={item.id}
                                    className={`quick-quiz__review-item ${
                                        item.isCorrect ? 'is-correct' : 'is-wrong'
                                    }`}
                                >
                                    <span>Q{index + 1} - {item.typeLabel}</span>
                                    <strong>
                                        {item.isCorrect
                                            ? `Correct: ${item.correctAnswer}`
                                            : `Your answer: ${item.selectedOption}`}
                                    </strong>
                                    {!item.isCorrect && <small>Correct answer: {item.correctAnswer}</small>}
                                </article>
                            ))}
                        </div>

                        <button className="quick-quiz__primary-button" onClick={restartQuiz}>
                            <RefreshCw size={16} />
                            <span>Reset set</span>
                        </button>
                    </section>
                </div>
            </div>
        );
    }

    const isCorrectSelection =
        normalizeText(selectedOption) === normalizeText(currentQuestion.correctAnswer);

    return (
        <div className="quick-quiz">
            <div className="quick-quiz__shell">
                <header className="quick-quiz__topbar">
                    <button onClick={onBackToGameSelect} className="quick-quiz__nav-button">
                        <ArrowLeft size={18} />
                        <span>Back to Games</span>
                    </button>
                    <button
                        onClick={onBackToHome}
                        className="quick-quiz__nav-button quick-quiz__nav-button--home"
                    >
                        <Home size={18} />
                        <span>Home</span>
                    </button>
                </header>

                <section className="quick-quiz__hero">
                    <div className="quick-quiz__hero-copy">
                        <span className="quick-quiz__eyebrow">Quick Quiz</span>
                        <h1>Test vocabulary understanding in the focused questions</h1>
                        <p>
                            This quiz keeps the screen black and white so your attention stays on
                            the question. Green appears only when you are correct, and red appears
                            only when something needs review
                        </p>
                    </div>

                    <div className="quick-quiz__hero-stats">
                        <article className="quick-quiz__hero-stat quick-quiz__hero-stat--question">
                            <span>Question</span>
                            <strong>{currentIndex + 1} / {session.totalQuestions}</strong>
                        </article>
                        <article className="quick-quiz__hero-stat quick-quiz__hero-stat--score">
                            <span>Score</span>
                            <strong>{score}</strong>
                        </article>
                        <article className="quick-quiz__hero-stat quick-quiz__hero-stat--mode">
                            <span>Mode</span>
                            <label className="quick-quiz__mode-field">
                                <select
                                    className="quick-quiz__mode-select"
                                    value={selectedMode}
                                    onChange={handleModeChange}
                                >
                                    {QUICK_QUIZ_MODES.map((mode) => (
                                        <option key={mode.id} value={mode.id}>
                                            {mode.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </article>
                    </div>
                </section>

                <div className="quick-quiz__layout">
                    <section className="quick-quiz__question-card">
                        <div className="quick-quiz__question-top">
                            <div>
                                <span className="quick-quiz__type-pill">{currentQuestion.typeLabel}</span>
                                <h2>{currentQuestion.prompt}</h2>
                            </div>
                            <button className="quick-quiz__ghost-button" onClick={restartQuiz}>
                                <RefreshCw size={16} />
                                <span>Reset set</span>
                            </button>
                        </div>

                        <div className="quick-quiz__option-grid">
                            {currentQuestion.options.map((option) => {
                                const isCorrectOption =
                                    normalizeText(option) === normalizeText(currentQuestion.correctAnswer);
                                const isWrongSelection =
                                    hasChecked &&
                                    selectedOption === option &&
                                    !isCorrectOption;

                                return (
                                    <button
                                        key={option}
                                        className={`quick-quiz__option ${
                                            selectedOption === option ? 'is-selected' : ''
                                        } ${hasChecked && isCorrectOption ? 'is-correct' : ''} ${
                                            isWrongSelection ? 'is-wrong' : ''
                                        }`}
                                        onClick={() => !hasChecked && setSelectedOption(option)}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="quick-quiz__actions">
                            <button
                                className="quick-quiz__primary-button"
                                disabled={!selectedOption || hasChecked}
                                onClick={handleCheck}
                            >
                                Check answer
                            </button>
                        </div>

                        {hasChecked && (
                            <div
                                className={`quick-quiz__feedback ${
                                    isCorrectSelection ? 'is-correct' : 'is-wrong'
                                }`}
                            >
                                <h3>{isCorrectSelection ? 'Correct answer' : 'Not quite right'}</h3>
                                <p>{currentQuestion.insight}</p>
                                <small>{currentQuestion.supportText}</small>
                                <button className="quick-quiz__primary-button" onClick={handleNext}>
                                    <span>
                                        {currentIndex === session.questions.length - 1
                                            ? 'Finish quiz'
                                            : 'Next question'}
                                    </span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        )}
                    </section>

                    <aside className="quick-quiz__side">
                        <h3>How this set works</h3>
                        <p>
                            {selectedMode === 'mixed'
                                ? 'Each reset creates a fresh ten-question mixed quiz from your vocabulary collection.'
                                : `Each reset creates a fresh ten-question ${session.modeLabel.toLowerCase()} set from your vocabulary collection.`}
                        </p>

                        <div className="quick-quiz__side-stat">
                            <span>Questions in set</span>
                            <strong>10</strong>
                        </div>

                        <div className="quick-quiz__side-stat">
                            <span>Current mode</span>
                            <strong>{session.modeLabel}</strong>
                        </div>

                        <div className="quick-quiz__tip">
                            <CircleHelp size={16} />
                            <p>
                                If two options feel close, slow down and re-read the clue. The quiz
                                is designed to reward precise understanding, not guessing speed.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default QuickQuizGame;
