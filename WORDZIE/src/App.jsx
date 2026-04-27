import React, { useCallback, useEffect, useState } from 'react';
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

const buildHashFromRouteState = ({
    currentView,
    selectedLetter,
    selectedRound,
    selectedMode,
    flashcardEntry,
}) => {
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

    return params.toString();
};

const scrollPageToTop = () => {
    if (typeof window === 'undefined') {
        return;
    }

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
    });
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

    const applyRouteState = useCallback((nextRouteState) => {
        setCurrentView(nextRouteState.currentView);
        setSelectedLetter(nextRouteState.selectedLetter);
        setSelectedRound(nextRouteState.selectedRound);
        setSelectedMode(nextRouteState.selectedMode);
        setFlashcardEntry(nextRouteState.flashcardEntry);
    }, []);

    const navigateToRoute = useCallback(
        (nextRouteState, options = {}) => {
            const normalizedRouteState = {
                flashcardEntry: 'words',
                selectedLetter: '',
                selectedRound: null,
                selectedMode: '',
                ...nextRouteState,
            };
            const nextHash = buildHashFromRouteState(normalizedRouteState);
            const nextUrl = `${window.location.pathname}${window.location.search}${
                nextHash ? `#${nextHash}` : ''
            }`;
            const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

            applyRouteState(normalizedRouteState);

            if (nextUrl !== currentUrl) {
                if (options.replace) {
                    window.history.replaceState(null, '', nextUrl);
                } else {
                    window.history.pushState(null, '', nextUrl);
                }
            }

            scrollPageToTop();
        },
        [applyRouteState],
    );

    useEffect(() => {
        const syncRouteFromLocation = () => {
            const nextRouteState = getRouteStateFromHash(window.location.hash, wordDataByLetter);
            applyRouteState(nextRouteState);
            scrollPageToTop();
        };

        window.addEventListener('hashchange', syncRouteFromLocation);
        window.addEventListener('popstate', syncRouteFromLocation);

        return () => {
            window.removeEventListener('hashchange', syncRouteFromLocation);
            window.removeEventListener('popstate', syncRouteFromLocation);
        };
    }, [applyRouteState]);

    useEffect(() => {
        navigateToRoute(initialRouteState, { replace: true });
        // We only want to normalize the initial URL once on mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (currentView === 'flashcards' && !selectedRound) {
            navigateToRoute({
                currentView: selectedLetter ? 'rounds' : 'home',
                selectedLetter,
                selectedRound: null,
                selectedMode: '',
                flashcardEntry: 'words',
            }, { replace: true });
        }
    }, [currentView, navigateToRoute, selectedLetter, selectedRound]);

    const handleLetterClick = (letter) => {
        navigateToRoute({
            currentView: 'rounds',
            selectedLetter: letter,
            selectedRound: null,
            selectedMode: '',
            flashcardEntry: 'words',
        });
    };

    const handleRoundSelect = (round) => {
        navigateToRoute({
            currentView: 'words',
            selectedLetter,
            selectedRound: round,
            selectedMode: '',
            flashcardEntry: 'words',
        });
    };

    const handleNavigateToGameSelect = () => {
        navigateToRoute({
            currentView: 'gameSelect',
            selectedLetter: '',
            selectedRound: null,
            selectedMode: '',
            flashcardEntry: 'words',
        });
    };

    const handleBackToHome = () => {
        navigateToRoute({
            currentView: 'home',
            selectedLetter: '',
            selectedRound: null,
            selectedMode: '',
            flashcardEntry: 'words',
        });
    };

    const handleBackToRounds = () => {
        navigateToRoute({
            currentView: 'rounds',
            selectedLetter,
            selectedRound: null,
            selectedMode: '',
            flashcardEntry: 'words',
        });
    };

    const handleStartFlashcardSession = () => {
        navigateToRoute({
            currentView: 'flashcards',
            selectedLetter,
            selectedRound,
            selectedMode: '',
            flashcardEntry: 'words',
        });
    };

    const handleOpenFlashcardPreview = () => {
        navigateToRoute({
            currentView: 'flashcards',
            selectedLetter: '',
            selectedRound: createFeaturedFlashcardRound(wordDataByLetter),
            selectedMode: '',
            flashcardEntry: 'home',
        });
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
        navigateToRoute({
            currentView: 'quiz',
            selectedLetter: '',
            selectedRound: null,
            selectedMode: mode,
            flashcardEntry: 'words',
        });
    };

    const handleBackToGameSelect = () => {
        navigateToRoute({
            currentView: 'gameSelect',
            selectedLetter: '',
            selectedRound: null,
            selectedMode: '',
            flashcardEntry: 'words',
        });
    };

    const handleBackToWords = () => {
        navigateToRoute({
            currentView: 'words',
            selectedLetter,
            selectedRound,
            selectedMode: '',
            flashcardEntry: 'words',
        });
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
