import React from 'react';
import { Users } from 'lucide-react';
import './pairMatch.css';

/**
 * Placeholder for the Pair Match Memory game.
 * The goal is to match words with their definitions/synonyms.
 * @param {object} props - Component props
 * @param {Array<object>} props.words - The 10 words for the round.
 * @param {function({success: boolean})} props.onComplete - Callback function when the game ends.
 */
const PairMatch = ({ words, onComplete }) => {

    const handleFinish = () => {
        onComplete({ success: true, score: 100 });
    };

    return (
        <div className="pair-game-container">
            <Users size={48} className="pair-game-icon" />
            <h3 className="pair-game-title">Pair Match Memory (WIP)</h3>
            <p className="pair-game-text">
                Game for **{words.length}** words from this round loaded successfully.
            </p>
            <p className="pair-game-text" style={{ fontSize: '12px', color: '#9ca3af' }}>
                *The actual game content goes here.*
            </p>
            <button 
                onClick={handleFinish} 
                className="pair-game-button"
            >
                Finish Game (Success Placeholder)
            </button>
        </div>
    );
};

export default PairMatch;
