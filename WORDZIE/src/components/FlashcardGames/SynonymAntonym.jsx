import React from 'react';
import { Type } from 'lucide-react';
import './spellingScramble.css';

/**
 * Placeholder for the Spelling Scramble game.
 * The goal is to unscramble letters to form the correct word.
 * @param {object} props - Component props
 * @param {Array<object>} props.words - The 10 words for the round.
 * @param {function({success: boolean})} props.onComplete - Callback function when the game ends.
 */
const SpellingScramble = ({ words, onComplete }) => {

    const handleFinish = () => {
        onComplete({ success: true, score: 100 }); 
    };

    return (
        <div className="spelling-game-container">
            <Type size={48} className="spelling-game-icon" />
            <h3 className="spelling-game-title">Spelling Scramble</h3>
            <p className="spelling-game-text">
                Game for **{words.length}** words from this round loaded successfully.
            </p>
            <p className="spelling-game-text" style={{ fontSize: '12px', color: '#9ca3af' }}>
                *The actual game content goes here.*
            </p>
            <button 
                onClick={handleFinish} 
                className="spelling-game-button"
            >
                Finish Game (Success Placeholder)
            </button>
        </div>
    );
};

export default SpellingScramble;
