import React from 'react';
import { MessageSquare } from 'lucide-react';
import './contextClues.css';

/**
 * Placeholder for the Context Clues game.
 * The goal is to choose the correct word that fits into a given sentence.
 * @param {object} props - Component props
 * @param {Array<object>} props.words - The 10 words for the round.
 * @param {function({success: boolean})} props.onComplete - Callback function when the game ends.
 */
const ContextClues = ({ words, onComplete }) => {
    // Simulate game completion
    const handleFinish = () => {
        onComplete({ success: true, score: 100 });
    };

    return (
        <div className="context-game-container">
            <MessageSquare size={48} className="context-game-icon" />
            <h3 className="context-game-title">Context Clues (WIP)</h3>
            <p className="context-game-text">
                Game for **{words.length}** words from this round loaded successfully.
            </p>
            <p className="context-game-text" style={{ fontSize: '12px', color: '#9ca3af' }}>
                *The actual game content goes here.*
            </p>
            <button 
                onClick={handleFinish} 
                className="context-game-button"
            >
                Finish Game (Success Placeholder)
            </button>
        </div>
    );
};

export default ContextClues;
