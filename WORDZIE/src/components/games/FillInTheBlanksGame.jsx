import React, { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    CircleHelp,
    Home,
    RefreshCw,
} from 'lucide-react';
import { createFillBlankSession, normalizeText } from './gameData.js';
import './FillInTheBlanksGame.css';

const FillInTheBlanksGame = ({ onBackToGameSelect, onBackToHome }) => {
    const [session, setSession] = useState(() => createFillBlankSession());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [hasChecked, setHasChecked] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);
    const [history, setHistory] = useState([]);

    const currentQuestion = session.questions[currentIndex];
    const isComplete = currentIndex >= session.questions.length;

    const restartGame = () => {
        setSession(createFillBlankSession());
        setCurrentIndex(0);
        setSelectedOption('');
        setHasChecked(false);
        setShowHint(false);
        setScore(0);
        setHistory([]);
    };

    const handleCheck = () => {
        if (!selectedOption || hasChecked || !currentQuestion) {
            return;
        }

        const isCorrect =
            normalizeText(selectedOption) === normalizeText(currentQuestion.word);
        setHasChecked(true);
        setHistory((current) => [
            ...current,
            {
                id: currentQuestion.id,
                word: currentQuestion.word,
                selected: selectedOption,
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
        setShowHint(false);
    };

    if (isComplete) {
        return (
            <div className="blanks-game">
                <div className="blanks-game__shell blanks-game__shell--summary">
                    <div className="blanks-game__summary">
                        <span className="blanks-game__eyebrow">Session complete</span>
                        <h1>Fill in the Blanks finished</h1>
                        <p>
                            You answered <strong>{score}</strong> out of{' '}
                            <strong>{session.questions.length}</strong> correctly.
                        </p>

                        <div className="blanks-game__review-list">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className={`blanks-game__review-item ${
                                        item.isCorrect ? 'is-correct' : 'is-wrong'
                                    }`}
                                >
                                    <strong>{item.word}</strong>
                                    <span>
                                        {item.isCorrect ? 'Correct' : `You chose: ${item.selected}`}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button className="blanks-game__primary-button" onClick={restartGame}>
                            Play again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isCorrectSelection =
        normalizeText(selectedOption) === normalizeText(currentQuestion.word);

    return (
        <div className="blanks-game">
            <div className="blanks-game__shell">
                <header className="blanks-game__topbar">
                    <button onClick={onBackToGameSelect} className="blanks-game__nav-button">
                        <ArrowLeft size={18} />
                        <span>Back to Games</span>
                    </button>
                    <button
                        onClick={onBackToHome}
                        className="blanks-game__nav-button blanks-game__nav-button--home"
                    >
                        <Home size={18} />
                        <span>Home</span>
                    </button>
                </header>

                <section className="blanks-game__hero">
                    <div>
                        <span className="blanks-game__eyebrow">Context Quest</span>
                        <h1>Fill in the Blanks</h1>
                        <p>
                            Choose the word that fits the sentence best. This mode is designed to
                            feel like a reading challenge rather than a plain quiz.
                        </p>
                    </div>
                    <div className="blanks-game__hero-stats">
                        <div>
                            <span>Score</span>
                            <strong>{score}</strong>
                        </div>
                        <div>
                            <span>Question</span>
                            <strong>{currentIndex + 1} / {session.questions.length}</strong>
                        </div>
                    </div>
                </section>

                <div className="blanks-game__layout">
                    <section className="blanks-game__question-card">
                        <div className="blanks-game__question-top">
                            <div>
                                <span className="blanks-game__panel-kicker">
                                    Question {currentIndex + 1}
                                </span>
                                <h2>Read the sentence and choose the strongest answer.</h2>
                            </div>
                            <button className="blanks-game__ghost-button" onClick={restartGame}>
                                <RefreshCw size={16} />
                                <span>Restart set</span>
                            </button>
                        </div>

                        <p className="blanks-game__sentence">{currentQuestion.sentence}</p>

                        <div className="blanks-game__option-grid">
                            {currentQuestion.options.map((option) => (
                                <button
                                    key={option}
                                    className={`blanks-game__option ${
                                        selectedOption === option ? 'is-selected' : ''
                                    } ${
                                        hasChecked
                                            ? normalizeText(option) ===
                                              normalizeText(currentQuestion.word)
                                                ? 'is-correct'
                                                : selectedOption === option
                                                  ? 'is-wrong'
                                                  : ''
                                            : ''
                                    }`}
                                    onClick={() => !hasChecked && setSelectedOption(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <div className="blanks-game__question-tools">
                            <button
                                className="blanks-game__secondary-button"
                                onClick={() => setShowHint((current) => !current)}
                            >
                                <CircleHelp size={16} />
                                <span>{showHint ? 'Hide hint' : 'Show hint'}</span>
                            </button>
                            <button
                                className="blanks-game__primary-button"
                                disabled={!selectedOption || hasChecked}
                                onClick={handleCheck}
                            >
                                Check answer
                            </button>
                        </div>

                        {showHint && (
                            <div className="blanks-game__hint-card">
                                <strong>Meaning hint</strong>
                                <p>{currentQuestion.definition}</p>
                                <small>Synonym hint: {currentQuestion.synonymHint}</small>
                            </div>
                        )}

                        {hasChecked && (
                            <div
                                className={`blanks-game__answer-feedback ${
                                    isCorrectSelection ? 'is-correct' : 'is-wrong'
                                }`}
                            >
                                <h3>{isCorrectSelection ? 'Correct choice' : 'Keep going'}</h3>
                                <p>
                                    The best answer is <strong>{currentQuestion.word}</strong>.
                                </p>
                                <small>{currentQuestion.sourceSentence}</small>
                                <button
                                    className="blanks-game__primary-button"
                                    onClick={handleNext}
                                >
                                    <span>
                                        {currentIndex === session.questions.length - 1
                                            ? 'Finish session'
                                            : 'Next question'}
                                    </span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        )}
                    </section>

                    <aside className="blanks-game__side">
                        <h3>Student support</h3>
                        <p>
                            This mode helps students move from memorizing words to actually reading
                            with them in context.
                        </p>

                        <div className="blanks-game__stat-card">
                            <span>Current score</span>
                            <strong>{score}</strong>
                        </div>

                        <div className="blanks-game__stat-card">
                            <span>Questions left</span>
                            <strong>{session.questions.length - currentIndex}</strong>
                        </div>

                        <div className="blanks-game__tip">
                            <CircleHelp size={16} />
                            <p>
                                Read the whole sentence before looking at the options. Context
                                usually removes at least two wrong answers quickly.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default FillInTheBlanksGame;
