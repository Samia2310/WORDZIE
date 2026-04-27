import React, { useEffect, useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import RoundSelectionPage from './pages/RoundSelectionPage.jsx';
import WordListPage from './pages/WordListPage.jsx';
import FlashcardSessionPage from './pages/FlashcardSessionPage.jsx';
import ChallengeMode from './components/ChallengeMode.jsx';
import './styles.css';
import './clean-theme.css';
import { wordDataByLetter } from './data/wordCollection.js';

const createRoundsForLetter = (letter, wordData) => {
    const words = wordData[letter] || [];
    const wordsPerRound = 10;
    const rounds = [];

    for (let i = 0; i < words.length; i += wordsPerRound) {
        const roundWords = words.slice(i, i + wordsPerRound);
        rounds.push({
            name: `Round: ${rounds.length + 1}`,
            description: '',
            words: roundWords,
            id: `${letter}-${rounds.length + 1}`,
        });
    }

    return rounds;
};

const createFeaturedFlashcardRound = (wordData) => {
    const previewWords = Object.keys(wordData)
        .flatMap((letter) => (wordData[letter] || []).slice(0, 2))
        .slice(0, 10);

    return {
        id: 'flashcard-preview',
        name: 'Interactive Flashcards Preview',
        description: 'A sample vocabulary deck from across the platform.',
        words: previewWords,
    };
};

const getRouteStateFromHash = (hash, wordData) => {
    const params = new URLSearchParams((hash || '').replace(/^#/, ''));
    const requestedView = params.get('view') || 'home';
    const selectedLetter = params.get('letter') || '';
    const selectedMode = params.get('mode') || '';
    const flashcardEntry = params.get('flashcardEntry') || 'words';
    const roundId = params.get('round') || '';

    let selectedRound = null;

    if (roundId === 'flashcard-preview') {
        selectedRound = createFeaturedFlashcardRound(wordData);
    } else if (selectedLetter && roundId) {
        selectedRound =
            createRoundsForLetter(selectedLetter, wordData).find((round) => round.id === roundId) || null;
    }

    let currentView = requestedView;

    if (
        (requestedView === 'rounds' || requestedView === 'words' || requestedView === 'flashcards') &&
        !selectedLetter &&
        roundId !== 'flashcard-preview'
    ) {
        currentView = 'home';
    }

    if ((requestedView === 'words' || requestedView === 'flashcards') && !selectedRound) {
        currentView = selectedLetter ? 'rounds' : 'home';
    }

    if (requestedView === 'quiz' && !selectedMode && !selectedLetter) {
        currentView = 'gameSelect';
    }

    return {
        currentView,
        selectedLetter,
        selectedRound,
        selectedMode,
        flashcardEntry,
    };
};

const UpdatedHomePage = ({
    onLetterClick,
    onNavigateToGameSelect,
    onOpenFlashcardPreview,
    selectedLetter,
    wordData,
}) => (
    <HomePage
        onLetterSelect={onLetterClick}
        onNavigateToGameSelect={onNavigateToGameSelect}
        onOpenFlashcardPreview={onOpenFlashcardPreview}
        selectedLetter={selectedLetter}
        wordData={wordData}
    />
);

const App = () => {
    const initialRouteState = getRouteStateFromHash(
        typeof window === 'undefined' ? '' : window.location.hash,
        wordDataByLetter,
    );

    const [currentView, setCurrentView] = useState(initialRouteState.currentView);
    const [selectedLetter, setSelectedLetter] = useState(initialRouteState.selectedLetter);
    const [selectedRound, setSelectedRound] = useState(initialRouteState.selectedRound);
    const [selectedMode, setSelectedMode] = useState(initialRouteState.selectedMode);
    const [flashcardEntry, setFlashcardEntry] = useState(initialRouteState.flashcardEntry);

    useEffect(() => {
        const handleHashChange = () => {
            const nextRouteState = getRouteStateFromHash(window.location.hash, wordDataByLetter);
            setCurrentView(nextRouteState.currentView);
            setSelectedLetter(nextRouteState.selectedLetter);
            setSelectedRound(nextRouteState.selectedRound);
            setSelectedMode(nextRouteState.selectedMode);
            setFlashcardEntry(nextRouteState.flashcardEntry);
        };

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();

        if (currentView !== 'home') {
            params.set('view', currentView);
        }

        if (selectedLetter) {
            params.set('letter', selectedLetter);
        }

        if (selectedRound?.id) {
            params.set('round', selectedRound.id);
        }

        if (selectedMode) {
            params.set('mode', selectedMode);
        }

        if (flashcardEntry !== 'words') {
            params.set('flashcardEntry', flashcardEntry);
        }

        const nextHash = params.toString();
        const nextUrl = `${window.location.pathname}${window.location.search}${nextHash ? `#${nextHash}` : ''}`;

        window.history.replaceState(null, '', nextUrl);
    }, [currentView, selectedLetter, selectedRound, selectedMode, flashcardEntry]);

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
        setSelectedRound(null);
        setSelectedMode('');
        setFlashcardEntry('words');
        setCurrentView('rounds');
    };

    const handleRoundSelect = (round) => {
        setSelectedRound(round);
        setCurrentView('words');
    };

    const handleNavigateToGameSelect = () => {
        setSelectedMode('');
        setCurrentView('gameSelect');
    };

    const handleBackToHome = () => {
        setCurrentView('home');
        setSelectedLetter('');
        setSelectedRound(null);
        setSelectedMode('');
        setFlashcardEntry('words');
    };

    const handleBackToRounds = () => {
        setCurrentView('rounds');
        setSelectedRound(null);
        setSelectedMode('');
        setFlashcardEntry('words');
    };

    const handleStartFlashcardSession = () => {
        setFlashcardEntry('words');
        setCurrentView('flashcards');
    };

    const handleOpenFlashcardPreview = () => {
        setSelectedLetter('');
        setSelectedMode('');
        setSelectedRound(createFeaturedFlashcardRound(wordDataByLetter));
        setFlashcardEntry('home');
        setCurrentView('flashcards');
    };

    const handleBackToWordList = () => {
        if (flashcardEntry === 'home') {
            handleBackToHome();
            return;
        }

        setCurrentView('words');
    };

    const handleRoundComplete = (roundId) => {
        console.log(`Round ${roundId} successfully mastered!`);

        if (flashcardEntry === 'home') {
            handleBackToHome();
            return;
        }

        handleBackToRounds();
    };

    const handleModeSelect = (mode) => {
        setSelectedMode(mode);
        setSelectedLetter('');
        setSelectedRound(null);
        setCurrentView('quiz');
    };

    const handleBackToGameSelect = () => {
        setCurrentView('gameSelect');
    };

    const handleBackToWords = () => {
        setCurrentView('words');
    };

    if (currentView === 'home') {
        return (
            <UpdatedHomePage
                onLetterClick={handleLetterClick}
                onNavigateToGameSelect={handleNavigateToGameSelect}
                onOpenFlashcardPreview={handleOpenFlashcardPreview}
                selectedLetter={selectedLetter}
                wordData={wordDataByLetter}
            />
        );
    }

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

    if (currentView === 'words') {
        const wordsForRound = selectedRound ? selectedRound.words : [];
        const roundName = selectedRound ? selectedRound.name : `Words for ${selectedLetter}`;

        return (
            <WordListPage
                wordsForRound={wordsForRound}
                roundName={roundName}
                selectedLetter={selectedLetter}
                handleBackToRounds={handleBackToRounds}
                handleStartFlashcard={handleStartFlashcardSession}
                handleBackToHome={handleBackToHome}
            />
        );
    }

    if (currentView === 'flashcards') {
        if (!selectedRound) {
            handleBackToRounds();
            return null;
        }

        return (
            <FlashcardSessionPage
                wordsForRound={selectedRound.words}
                roundName={selectedRound.name}
                handleBackToWordList={handleBackToWordList}
                handleRoundComplete={handleRoundComplete}
            />
        );
    }

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
