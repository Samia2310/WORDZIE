// src/components/ChallengeMode.jsx

import React from 'react';
import { Play, BookOpen, Zap, Brain, Target, ArrowRight } from 'lucide-react'; 
import gameModes, { wordDataByLetter } from '../data/wordCollection.js'; 
import './ChallengeMode.css'; 

// --- GameSelectPage Component (Moved) ---
const GameSelectPage = ({ onModeSelect, onBackToHome }) => {
    const handleModeSelect = (modeKey) => {
        onModeSelect(modeKey);
    };

    // Calculate total word count for the stats section
    const totalWords = Object.values(wordDataByLetter).flat().length;

    return (
        <div className="game-select-container">
            {/* Back to Home Button */}
            <div className="game-select-header">
                <button onClick={onBackToHome} className="back-to-home-button">
                    ← Back to Home
                </button>
            </div>

            {/* Header */}
            <div className="game-select-title-section">
                <h1 className="game-select-main-title">Vocabulary Quiz</h1>
                <p className="game-select-subtitle">
                    Challenge yourself with our comprehensive vocabulary collection. Choose your difficulty level and start learning!
                </p>
            </div>

            {/* Game Mode Cards */}
            <div className="game-modes-grid">
                {Object.entries(gameModes).map(([modeKey, modeDetails]) => {
                    const IconComponent = modeDetails.icon || BookOpen;
                    return (
                        <div
                            key={modeKey}
                            onClick={() => handleModeSelect(modeKey)}
                            className={`game-mode-card ${modeKey}`}
                        >
                            <div className="game-mode-card-header">
                                <div className="game-mode-icon-wrapper">
                                    <IconComponent className="game-mode-icon" size={32} />
                                </div>
                                <span className="game-mode-difficulty">{modeDetails.difficulty || 'Standard'}</span>
                            </div>
                            
                            <h2 className="game-mode-title">{modeDetails.title}</h2>
                            <p className="game-mode-description">{modeDetails.description}</p>
                            
                            <div className="game-mode-footer">
                                <div className="game-mode-word-count">
                                    <div className="word-count-dot"></div>
                                    <span>{modeDetails.words.length} Words</span>
                                </div>
                                <div className="game-mode-start">
                                    <span>Start Quiz</span>
                                    <ArrowRight className="start-arrow" size={16} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Stats Section */}
            <div className="game-select-stats">
                <div className="stats-container">
                    <div className="stat-item">
                        <div className="stat-number">{totalWords}</div>
                        <div className="stat-label">Total Words</div>
                    </div>
                    <div className="stat-separator"></div>
                    <div className="stat-item">
                        <div className="stat-number">{Object.keys(wordDataByLetter).length}</div>
                        <div className="stat-label">Letter Categories</div>
                    </div>
                    <div className="stat-separator"></div>
                    <div className="stat-item">
                        <div className="stat-number">{Object.keys(gameModes).length}</div>
                        <div className="stat-label">Game Modes</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Quiz Page Component (Moved) ---
const QuizPage = ({ selectedLetter, selectedMode, handleBackToWords, handleBackToHome, handleBackToGameSelect }) => {
    const getQuizWords = () => {
        if (selectedLetter) {
            return wordDataByLetter[selectedLetter] || [];
        } else if (selectedMode && gameModes[selectedMode]) {
            return gameModes[selectedMode].words;
        }
        return [];
    };

    const getQuizTitle = () => {
        if (selectedLetter) {
            return `Quiz for "${selectedLetter.toUpperCase()}"`;
        } else if (selectedMode && gameModes[selectedMode]) {
            return `${gameModes[selectedMode].title} Quiz`;
        }
        return 'Quiz';
    };

    const quizWords = getQuizWords();

    return (
        <div className="quiz-page-container">
            <div className="quiz-wrapper">
                <header className="quiz-header">
                    {selectedLetter ? (
                        <button
                            onClick={handleBackToWords}
                            className="quiz-back-button"
                        >
                            ← Back to Words
                        </button>
                    ) : (
                        <button
                            onClick={handleBackToGameSelect}
                            className="quiz-back-button"
                        >
                            ← Back to Game Select
                        </button>
                    )}
                    <button
                        onClick={handleBackToHome}
                        className="quiz-home-button"
                    >
                        🏠 Home
                    </button>
                    <h1 className="quiz-title">
                        {getQuizTitle()}
                    </h1>
                    <p className="quiz-subtitle">
                        {quizWords.length} words in this quiz
                    </p>
                </header>
                
                <div className="quiz-content">
                    <div className="quiz-placeholder">
                        <h2>Quiz functionality coming soon!</h2>
                        <p>This quiz will include {quizWords.length} words.</p>
                        <div className="quiz-preview">
                            <h3>Preview of words in this quiz:</h3>
                            <div className="quiz-word-preview">
                                {quizWords.slice(0, 5).map((word, index) => (
                                    <span key={index} className="preview-word">
                                        {word.word}
                                    </span>
                                ))}
                                {quizWords.length > 5 && <span className="preview-more">+{quizWords.length - 5} more...</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- ChallengeMode Main Component (New) ---
const ChallengeMode = ({
    currentView,
    selectedLetter,
    selectedMode,
    onModeSelect,
    handleBackToHome,
    handleBackToWords,
    handleBackToGameSelect
}) => {
    if (currentView === 'gameSelect') {
        return (
            <GameSelectPage 
                onModeSelect={onModeSelect}
                onBackToHome={handleBackToHome}
            />
        );
    }

    if (currentView === 'quiz') {
        return (
            <QuizPage 
                selectedLetter={selectedLetter}
                selectedMode={selectedMode}
                handleBackToWords={handleBackToWords}
                handleBackToHome={handleBackToHome}
                handleBackToGameSelect={handleBackToGameSelect}
            />
        );
    }

    return null; // Should not happen with correct routing
};

export default ChallengeMode;