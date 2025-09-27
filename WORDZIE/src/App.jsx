import React, { useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import RoundSelectionPage from './pages/RoundSelectionPage.jsx'; 
import WordListPage from './pages/WordListPage.jsx'; 
import FlashcardSessionPage from './pages/FlashcardSessionPage.jsx'; 
import ChallengeMode from './components/ChallengeMode.jsx'; 
import './styles.css'; 
import { wordDataByLetter } from './data/wordCollection.js';

const createRoundsForLetter = (letter, wordData) => {
    const words = wordData[letter] || [];
    const wordsPerRound = 10;
    const rounds = [];
    
    for (let i = 0; i < words.length; i += wordsPerRound) {
        const roundWords = words.slice(i, i + wordsPerRound);
        rounds.push({
            name: `Round: ${rounds.length + 1}`,
            description: `A vocabulary challenge featuring.`,
            words: roundWords,
            // 🚨 OPTIONAL: Add a unique ID for better tracking (e.g., 'A-1', 'A-2')
            id: `${letter}-${rounds.length + 1}` 
        });
    }
    return rounds;
};

// --- Updated HomePage Component (Stays for clarity) ---
const UpdatedHomePage = ({ onLetterClick, onNavigateToGameSelect, selectedLetter, wordData }) => {
    return (
        <HomePage 
            onLetterSelect={onLetterClick} 
            onNavigateToGameSelect={onNavigateToGameSelect}
            selectedLetter={selectedLetter} 
            wordData={wordData} 
        />
    );
};

// --- Main App Component ---
const App = () => {
    // 🚨 MODIFIED VIEWS: added 'flashcards'
    const [currentView, setCurrentView] = useState('home'); 
    const [selectedLetter, setSelectedLetter] = useState('');
    const [selectedRound, setSelectedRound] = useState(null); 
    const [selectedMode, setSelectedMode] = useState('');

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
        setSelectedRound(null);
        setSelectedMode(''); 
        setCurrentView('rounds');
    };
    
    const handleRoundSelect = (round) => {
        setSelectedRound(round);
        setCurrentView('words');
    };

    const handleNavigateToGameSelect = () => {
        setCurrentView('gameSelect');
    };

    const handleBackToHome = () => {
        setCurrentView('home');
        setSelectedLetter('');
        setSelectedRound(null);
        setSelectedMode('');
    };

    const handleBackToRounds = () => {
        setCurrentView('rounds');
        setSelectedRound(null);
    };

    // 🚨 NEW HANDLER: Called by WordListPage's "Start Flashcard Session" button
    const handleStartFlashcardSession = () => {
        // Since selectedRound already holds the words, we just need to navigate
        setCurrentView('flashcards'); 
    };

    // 🚨 NEW HANDLER: To go back from the Flashcard Session to the Word List
    const handleBackToWordList = () => {
        setCurrentView('words');
    };
    
    // 🚨 NEW HANDLER: Placeholder for when a user completes all 5 games in a round
    const handleRoundComplete = (roundId) => {
        console.log(`Round ${roundId} successfully mastered!`);
        // Logic here to update global mastery state, give rewards, and return to round selection
        handleBackToRounds(); 
    };

    // --- Original Handlers (Adjusted handleStartQuiz name below) ---
    const handleModeSelect = (mode) => {
        setSelectedMode(mode);
        setSelectedLetter('');
        setCurrentView('quiz');
    };

    const handleBackToGameSelect = () => {
        setCurrentView('gameSelect');
    };

    const handleBackToWords = () => {
        setCurrentView('words');
    };

    // ⚠️ NOTE: Keeping the name `handleStartQuiz` for the Challenge Mode flow 
    // to distinguish it from `handleStartFlashcardSession`.
    const handleStartQuiz = (letter) => {
        setSelectedLetter(letter);
        setSelectedMode('');
        setCurrentView('quiz');
    };
    // -----------------------------

    /* =============================
    RENDERING LOGIC
    =============================
    */

    // VIEW 1: HOME PAGE
    if (currentView === 'home') {
        return (
            <UpdatedHomePage 
                onLetterClick={handleLetterClick}
                onNavigateToGameSelect={handleNavigateToGameSelect}
                selectedLetter={selectedLetter} 
                wordData={wordDataByLetter} 
            />
        );
    }

    // VIEW 2: ROUND SELECTION PAGE
    if (currentView === 'rounds') {
        const rounds = createRoundsForLetter(selectedLetter, wordDataByLetter);
        
        return (
            <RoundSelectionPage
                selectedLetter={selectedLetter}
                rounds={rounds}
                onRoundSelect={handleRoundSelect}
                onBack={handleBackToHome}
            />
        );
    }

    // VIEW 3: WORD LIST PAGE
    if (currentView === 'words') {
        const wordsForRound = selectedRound ? selectedRound.words : [];
        const roundName = selectedRound ? selectedRound.name : `Words for ${selectedLetter}`;

        return (
            <WordListPage 
                wordsForRound={wordsForRound}
                roundName={roundName} 
                selectedLetter={selectedLetter} 
                handleBackToRounds={handleBackToRounds}
                // 🚨 PROP CHANGE: Passing the new, dedicated handler
                handleStartFlashcard={handleStartFlashcardSession}
                handleBackToHome={handleBackToHome} 
                // NOTE: The original `handleStartQuiz` is now unused in the WordListPage props.
            />
        );
    }

    // 🚨 NEW VIEW 4: FLASHCARD SESSION PAGE (The Lottery Hub)
    if (currentView === 'flashcards') {
        if (!selectedRound) return handleBackToRounds(); // Safety check

        return (
            <FlashcardSessionPage 
                wordsForRound={selectedRound.words}
                roundName={selectedRound.name}
                handleBackToWordList={handleBackToWordList}
                handleRoundComplete={handleRoundComplete}
            />
        );
    }

    // VIEW 5: CHALLENGE MODES (INCLUDING QUIZ)
    if (currentView === 'gameSelect' || currentView === 'quiz') {
        return (
            <ChallengeMode
                currentView={currentView}
                selectedLetter={selectedLetter}
                selectedMode={selectedMode}
                onModeSelect={handleModeSelect}
                handleBackToHome={handleBackToHome}
                handleBackToWords={handleBackToWords}
                handleBackToGameSelect={handleBackToGameSelect}
            />
        );
    }

    return null;
};

export default App;