// pages/QuizPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
// Assuming you use a router (like React Router DOM)
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, XCircle, Home } from 'lucide-react';

// Import the game modes data from your collection
import gameModes from '../data/wordCollection';

// NOTE: You must replace this simulated component with your actual quiz component.
const QuizQuestionPlaceholder = ({ wordItem, onAnswer }) => (
    <div className="quiz-question-card">
        <h3>What is the definition of **{wordItem.word}**?</h3>
        <p className="definition-clue">{wordItem.definition}</p>
        <div className="answer-options">
            {/* These buttons simulate the user interaction (correct/incorrect answer) */}
            <button className="option-button correct" onClick={() => onAnswer(true)}>
                <CheckCircle /> I Know It!
            </button>
            <button className="option-button incorrect" onClick={() => onAnswer(false)}>
                <XCircle /> Need More Practice
            </button>
        </div>
    </div>
);


const QuizPage = () => {
    // Hooks for routing
    const { modeKey } = useParams();
    const navigate = useNavigate();
    
    // Load the corresponding word list from the exported data
    const gameData = gameModes[modeKey];

    // State for the Quiz
    const [wordsToQuiz, setWordsToQuiz] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    // Get the current word object based on the index
    const currentWord = wordsToQuiz[currentWordIndex];

    // -----------------------------------------------------------
    // INITIALIZATION (Shuffles words once when the mode changes)
    // -----------------------------------------------------------
    useEffect(() => {
        if (gameData && gameData.words.length > 0) {
            // Shuffle the word list and set it
            const shuffledWords = [...gameData.words].sort(() => 0.5 - Math.random());
            setWordsToQuiz(shuffledWords);
            setCurrentWordIndex(0);
            setScore(0);
            setIsQuizFinished(false);
        }
    }, [gameData]);

    // -----------------------------------------------------------
    // GAME LOGIC FUNCTIONS
    // -----------------------------------------------------------

    // Function to move to the next word or end the quiz
    const advanceQuiz = useCallback(() => {
        const nextIndex = currentWordIndex + 1;
        
        if (nextIndex < wordsToQuiz.length) {
            setCurrentWordIndex(nextIndex);
        } else {
            // Quiz is finished
            setIsQuizFinished(true);
        }
    }, [currentWordIndex, wordsToQuiz.length]);

    // Function to handle the user's answer
    const handleAnswer = (isCorrect) => {
        if (isCorrect) {
            setScore(prevScore => prevScore + 1);
        }
        // Whether correct or incorrect, move to the next word
        advanceQuiz();
    };

    // -----------------------------------------------------------
    // RENDER LOGIC
    // -----------------------------------------------------------

    // Handle case where an invalid mode is entered in the URL
    if (!gameData) {
        return (
            <div className="error-page">
                <h1>Game Mode not found! 😞</h1>
                <p>The mode key **"{modeKey}"** is invalid. Please return home.</p>
                <button onClick={() => navigate('/')} className="error-button">
                    <Home /> Go Home
                </button>
            </div>
        );
    }
    
    // RENDER: Quiz Finished Screen
    if (isQuizFinished) {
        return (
            <div className="quiz-results">
                <h1>✅ Quiz Complete!</h1>
                <h2>{gameData.title}</h2>
                <p>You finished the challenge with **{wordsToQuiz.length}** words!</p>
                <div className="final-score">
                    Your Score: **{score} / {wordsToQuiz.length}**
                </div>
                <button onClick={() => navigate('/')} className="primary-button finish-button">
                    <Home /> Return to Home
                </button>
            </div>
        );
    }

    // RENDER: Main Quiz Screen
    return (
        <div className="quiz-page-container">
            <header className="quiz-header">
                <h2>Playing: {gameData.title}</h2>
                <div className="quiz-stats">
                    <span className="stat-item">
                        Score: **{score}**
                    </span>
                    <span className="stat-item">
                        Progress: **{currentWordIndex + 1}** / **{wordsToQuiz.length}**
                    </span>
                </div>
            </header>

            <main className="quiz-main">
                {currentWord ? (
                    // This placeholder should be replaced by your actual component
                    <QuizQuestionPlaceholder 
                        wordItem={currentWord} 
                        onAnswer={handleAnswer} 
                    />
                ) : (
                    <p>Loading quiz content...</p>
                )}
            </main>

            <footer className="quiz-footer">
                <button onClick={() => navigate(-1)} className="secondary-button back-button">
                    <ArrowRight className="rotate-180" /> Back to Mode Select
                </button>
            </footer>
        </div>
    );
};

export default QuizPage;