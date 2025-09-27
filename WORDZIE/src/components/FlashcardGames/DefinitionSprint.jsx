import React from 'react';
import { Play, CheckCircle } from 'lucide-react';
import './definitionSprint.css';

/**
 * Placeholder for the Definition Sprint game.
 * The goal is to quickly match definitions to words.
 * @param {object} props - Component props
 * @param {Array<object>} props.words - The 10 words for the round.
 * @param {function({success: boolean})} props.onComplete - Callback function when the game ends.
 */
const DefinitionSprint = ({ words, onComplete }) => {
    const handleFinish = () => {
        onComplete({ success: true, score: 100 });
    };

    return (
        <div className="definition-game-container">
            <Play size={48} className="definition-game-icon" />
            <h3 className="definition-game-title">Definition Sprint (WIP)</h3>
            <p className="definition-game-text">
                Game for **{words.length}** words from this round loaded successfully.
            </p>
            <p className="definition-game-text" style={{ fontSize: '12px', color: '#9ca3af' }}>
                *The actual game content goes here.*
            </p>
            <button 
                onClick={handleFinish} 
                className="definition-game-button"
            >
                <CheckCircle size={20} style={{ marginRight: '8px' }} /> Finish Game (Success Placeholder)
            </button>
        </div>
    );
};

export default DefinitionSprint;
