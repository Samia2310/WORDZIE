import React, { useState } from 'react'; 
import {RefreshCw, ArrowLeft, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'; 
import './WordListPage.css'; 

const SimpleWordCard = ({ wordItem }) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    const toggleDetails = () => {
        setIsDetailsVisible(!isDetailsVisible);
    };

    const ToggleIcon = isDetailsVisible ? ChevronUp : ChevronDown;

    return (
        <div className="word-list-card">
            <div className="word-list-card-header">
                <h3 className="word-list-word-title">{wordItem.word}</h3>
                
                <button 
                    onClick={toggleDetails} 
                    className="word-list-toggle-button"
                    aria-expanded={isDetailsVisible}
                    aria-controls={`details-${wordItem.word}`}
                >
                    <ToggleIcon size={20} className="word-list-icon" />
                </button>
            </div>
            
            <p className="word-list-word-definition">
                <BookOpen size={14} className="word-list-icon" /> {wordItem.definition}
            </p>

            <div 
                className={`word-list-word-details ${isDetailsVisible ? 'visible' : 'hidden'}`}
                id={`details-${wordItem.word}`}
            >
                <span className="word-list-detail-tag">
                    <strong className="word-list-detail-label">Synonyms:</strong> {wordItem.synonyms?.join(', ') || 'N/A'}
                </span>
                <span className="word-list-detail-tag">
                    <strong className="word-list-detail-label">Antonyms:</strong> {wordItem.antonyms?.join(', ') || 'N/A'}
                </span>
                
                {wordItem.sentences && wordItem.sentences.length > 0 && (
                    <div className="word-list-detail-tag">
                        <strong className="word-list-detail-label">Sentences:</strong>
                        <ul className="word-list-sentences">
                            {wordItem.sentences.map((sentence, index) => (
                                <li key={index} className="word-list-sentence">{sentence}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

const WordListPage = ({ 
    wordsForRound, 
    roundName, 
    selectedLetter, 
    handleBackToRounds, 
    handleStartFlashcard, // ✅ CORRECT: This is the prop name expected from App.jsx
    handleBackToHome 
}) => {
    
    const words = wordsForRound;

    const startFlashcardSession = () => { // ✅ CORRECT: Descriptive internal handler
        handleStartFlashcard(); // ✅ CORRECT: Calls the new prop
    };

    if (!words || words.length === 0) {
        return (
            <div className="word-list-container word-list-no-words">
                <button onClick={handleBackToHome} className="word-list-home-button">
                    Back to Home <ArrowLeft size={20} className="word-list-icon" />
                </button>
                <h1 className="word-list-title">No Words Found for Round "{roundName}"</h1>
                <p className="word-list-subtitle">Please return to the round selection page.</p>
                <button onClick={handleBackToRounds} className="word-list-back-button">
                    <ArrowLeft size={20} className="word-list-icon" /> Back to Rounds
                </button>
            </div>
        );
    }

    return (
        <div className="word-list-container">
            <header className="word-list-header">
                <button onClick={handleBackToRounds} className="word-list-back-button">
                    ← Back to Rounds
                </button>
                <button onClick={handleBackToHome} className="word-list-home-button">
                    Back to Home →
                </button>
                <h1 className="word-list-title">{roundName}</h1> 
            </header>
            
            <main className="word-list-grid">
                {words.map((wordItem) => (
                    <SimpleWordCard key={wordItem.word} wordItem={wordItem} />
                ))}
            </main>
            
            <footer className="word-list-footer-cta">
                <button 
                    className="word-list-primary-button"
                    onClick={startFlashcardSession} // ✅ CORRECT: Calls the handler
                >
                    <RefreshCw size={24} className="word-list-icon" /> Start Flashcard Session
                     
                </button>
            </footer>
        </div>
    );
};

export default WordListPage;