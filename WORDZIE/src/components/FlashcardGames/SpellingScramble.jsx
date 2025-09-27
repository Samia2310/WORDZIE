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
    
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        maxWidth: '400px',
        margin: '20px auto',
        borderTop: '4px solid #3b82f6' // Blue color
    };

    const iconStyle = { color: '#3b82f6', marginBottom: '16px' };
    const titleStyle = { fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' };
    const textStyle = { color: '#4b5563', textAlign: 'center', marginBottom: '24px' };
    
    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: '#3b82f6', // Blue
        color: 'white',
        fontWeight: '600',
        borderRadius: '9999px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease-in-out',
        boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
    };

    // Simulate game completion
    const handleFinish = () => {
        onComplete({ success: true, score: 100 }); 
    };

    return (
        <div style={containerStyle}>
            <Type size={48} style={iconStyle} />
            <h3 style={titleStyle}>Spelling Scramble</h3>
            <p style={textStyle}>
                Game for **{words.length}** words from this round loaded successfully.
            </p>
            <p style={{ ...textStyle, fontSize: '12px', color: '#9ca3af' }}>
                *The actual game content goes here.*
            </p>
            <button 
                onClick={handleFinish} 
                style={buttonStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
                Finish Game (Success Placeholder)
            </button>
        </div>
    );
};

export default SpellingScramble;
