import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';

import DefinitionSprint from '../components/FlashcardGames/DefinitionSprint.jsx';
import SpellingScramble from '../components/FlashcardGames/SpellingScramble.jsx';
import ContextClues from '../components/FlashcardGames/ContextClues.jsx';
import SynonymAntonym from '../components/FlashcardGames/SynonymAntonym.jsx';
import PairMatch from '../components/FlashcardGames/PairMatch.jsx';

const GAME_TYPES = [
    { id: 'sprint', name: 'Definition Sprint', component: DefinitionSprint },
    { id: 'scramble', name: 'Spelling Scramble', component: SpellingScramble },
    { id: 'context', name: 'Context Clues', component: ContextClues },
    { id: 'synant', name: 'Synonym/Antonym Challenge', component: SynonymAntonym },
    { id: 'match', name: 'Pair Match Memory', component: PairMatch },
];

const FlashcardSessionPage = ({ wordsForRound, handleBackToWordList, handleRoundComplete }) => {
    const [currentGame, setCurrentGame] = useState(null);
    const [gameResult, setGameResult] = useState(null);
    const [isGameActive, setIsGameActive] = useState(false);

    // Select a random game and start immediately when component mounts
    const selectAndStartRandomGame = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * GAME_TYPES.length);
        const selectedGame = GAME_TYPES[randomIndex];
        setCurrentGame(selectedGame);
        setIsGameActive(true);
        setGameResult(null);
    }, []);

    // Auto-start a random game when component mounts
    useEffect(() => {
        if (wordsForRound && wordsForRound.length > 0) {
            selectAndStartRandomGame();
        }
    }, [wordsForRound, selectAndStartRandomGame]);

    const handleGameCompletion = (result) => {
        setGameResult(result);
        setIsGameActive(false);
    };

    const handlePlayAgain = () => {
        selectAndStartRandomGame();
    };

    // Error state - no words
    if (!wordsForRound || wordsForRound.length === 0) {
        return (
            <div className="flashcard-container no-words">
                <header className="game-header">
                    <button onClick={handleBackToWordList} className="back-button">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <h2>No Words Available</h2>
                </header>
                <main className="error-message">
                    <p>Error: No words loaded for this round.</p>
                </main>
            </div>
        );
    }

    // Loading state - game not yet selected
    if (!currentGame) {
        return (
            <div className="flashcard-container loading">
                <header className="game-header">
                    <button onClick={handleBackToWordList} className="back-button">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <h2>Loading Game...</h2>
                </header>
                <main className="loading-message">
                    <p>Selecting your challenge...</p>
                </main>
            </div>
        );
    }

    // Active game state
    if (isGameActive && !gameResult) {
        const GameComponent = currentGame.component;
        return (
            <div className="flashcard-game-view">
                <header className="game-header">
                    <button onClick={handleBackToWordList} className="back-button">
                        <ArrowLeft size={20} /> Back to Word List
                    </button>
                    <h2>{currentGame.name}</h2>
                </header>
                <main className="game-area">
                    <GameComponent 
                        words={wordsForRound} 
                        onComplete={handleGameCompletion} 
                    />
                </main>
            </div>
        );
    }

    // Game completion state
    return (
        <div className="flashcard-session-container">
            <header className="session-header">
                <button onClick={handleBackToWordList} className="back-button">
                    <ArrowLeft size={20} /> Back to Word List
                </button>
                <h1>Game Complete!</h1>
            </header>

            <section className="game-completion-screen">
                <div className="result-display">
                    <Trophy 
                        size={60} 
                        className={gameResult?.success ? 'trophy-success' : 'trophy-neutral'} 
                    />
                    <h2>{gameResult?.success ? 'Excellent Work!' : 'Good Effort!'}</h2>
                    <div className="game-stats">
                        <p><strong>Game:</strong> {currentGame.name}</p>
                        {gameResult?.score && (
                            <p><strong>Score:</strong> {gameResult.score}</p>
                        )}
                        {gameResult?.timeSpent && (
                            <p><strong>Time:</strong> {Math.round(gameResult.timeSpent)}s</p>
                        )}
                    </div>
                </div>
                
                <div className="completion-actions">
                    <button 
                        className="play-again-button primary-action"
                        onClick={handlePlayAgain}
                    >
                        <RefreshCw size={20} /> Play Another Game
                    </button>
                    
                    <button 
                        className="back-button-secondary"
                        onClick={handleBackToWordList}
                    >
                        <ArrowLeft size={16} /> Back to Word List
                    </button>
                </div>
            </section>
        </div>
    );
};

export default FlashcardSessionPage;