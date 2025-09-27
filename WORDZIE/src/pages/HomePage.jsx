import React from 'react';
import { Play, BookOpen, Zap, Award, ArrowRight, Gamepad2 } from 'lucide-react';
import './HomePage.css'; 

// NOTE: wordData is expected to be passed from App.jsx as a prop.
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// --- getLetterPosition helper function (needed for CircularLetterSelector) ---
const getLetterPosition = (index, total) => {
    const radius = 135; 
    const centerX = 160; 
    const centerY = 160; 
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
    return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
    };
};

// --- Sub-component: GameModeCallout ---
const GameModeCallout = ({ onNavigateToGameSelect }) => {
    return (
        <div className="game-mode-callout">
            <Gamepad2 className="game-mode-icon" size={32} />
            <div className="game-mode-text">
                <h3 className="game-mode-title-gradient">Challenge Modes</h3>
                <p className="game-mode-description">
                    Ready for a quiz? Play a quick game based on difficulty, topic, or word types!
                </p>
            </div>
            <button 
                className="game-mode-button"
                onClick={onNavigateToGameSelect}
            >
                Start a Quiz <ArrowRight className="button-icon" />
            </button>
        </div>
    );
};

// --- Sub-component: CircularLetterSelector (ADJUSTED FOR CONSISTENT LOOK) ---
const CircularLetterSelector = ({ onLetterSelect, selectedLetter, wordData }) => { 
    const isLetterAvailable = (letter) => {
        return true; 
    };
    
    // Handler that calls the navigation function passed from App.jsx
    const handleCircleClick = (letter) => {
        onLetterSelect(letter); 
    };

    // Standard center coordinates for the 320x320 viewBox
    const centerX = 160;

    return (
        <div className="circular-selector-wrapper">
            <svg viewBox="0 0 320 320" className="circular-selector-svg"> 
                
                {/* Center Circle and Text - Adjusted Y coordinates for better vertical spacing */}
                <circle cx={centerX} cy={centerX} r="50" className="center-circle" /> 
                <text x={centerX} y={centerX - 15} textAnchor="middle" className="center-text-top">Choose a</text>
                <text x={centerX} y={centerX + 10} textAnchor="middle" className="center-text-middle">LETTER</text>
                <text x={centerX} y={centerX + 32} textAnchor="middle" className="center-text-bottom">to start!</text> {/* Adjusted to 32 */}

                {/* Letter Circles */}
                {alphabet.map((letter, index) => {
                    const { x, y } = getLetterPosition(index, alphabet.length);
                    const isAvailable = isLetterAvailable(letter);
                    const isSelected = selectedLetter === letter;

                    let circleClasses = 'letter-circle';
                    let textClasses = 'letter-text';

                    if (isAvailable) {
                        circleClasses += ' available';
                        textClasses += ' available';
                        if (isSelected) {
                            circleClasses += ' selected';
                        }
                    } else {
                        circleClasses += ' unavailable';
                        textClasses += ' unavailable';
                    }

                    return (
                        <g 
                            key={letter} 
                            onClick={() => isAvailable && handleCircleClick(letter)} 
                            style={{ cursor: isAvailable ? 'pointer' : 'not-allowed' }}
                        >
                            {/* Circle radius is 15 (defined by original JS) */}
                            <circle cx={x} cy={y} r="15" className={circleClasses} transform={`translate(0, 0)`} /> 
                            {/* Text Y offset is 5 (defined by original JS) */}
                            <text x={x} y={y + 5} textAnchor="middle" className={textClasses}>{letter}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// --- Sub-component: FeatureCard / StatsCard ---
const FeatureCard = ({ icon: Icon, title, description, color, delay }) => {
    return (
        <div className="feature-card" style={{ animationDelay: `${delay}ms` }}>
            <div className={`feature-icon-container ${color}`}><Icon className="feature-icon" /></div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </div>
    );
};

// --- Main Component: HomePage (CREDENTIAL MOVED OUTSIDE MAIN WRAPPER) ---
const HomePage = ({ onLetterSelect, onNavigateToGameSelect, selectedLetter, wordData }) => { 
    
    return (
        <div className="homepage-container">
            {/* Header */}
            <header className="header-container">
                <div className="header-content-wrapper">
                    <h1 className="header-title">WORDZIE</h1>
                    <div className="header-separator">
                        <div className="separator-line-left"></div>
                        <Zap className="separator-icon" />
                        <div className="separator-line-right"></div>
                    </div>
                    <p className="header-subtitle">Expand your vocabulary, one word at a time</p>
                    <div className="streak-info-container">
                        <div className="streak-info">
                            <div className="streak-dot"></div>
                            <span className="streak-text">Daily Streak: 7 Days</span>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Main Content */}
            <main className="main-content-wrapper">
                
                {/* Game Mode Callout Section */}
                <section className="game-mode-select-section">
                    <GameModeCallout onNavigateToGameSelect={onNavigateToGameSelect} />
                </section>
                
                {/* Letter Selector Section */}
                <section className="letter-selector-section">
                    <h2 className="section-title">Choose by Letter</h2>
                    <p className="section-subtitle">Select a letter for a focused learning session</p>
                    <CircularLetterSelector 
                        onLetterSelect={onLetterSelect} 
                        selectedLetter={selectedLetter}
                        wordData={wordData}
                    />
                    
                    {/* Call to Action - Moved under circular selector */}
                    <div className="cta-card-compact">
                        <h2 className="cta-title-compact">Ready to Expand Your Vocabulary?</h2>
                        <p className="cta-subtitle-compact">Join thousands of learners improving their vocabulary daily</p>
                        <div className="cta-buttons-compact">
                            <button className="cta-button-primary-compact" onClick={onNavigateToGameSelect}>Start Quiz Challenge</button>
                            <button className="cta-button-secondary-compact" onClick={() => alert('Feature coming soon!')}>Learn More</button>
                        </div>
                    </div>
                </section>

                <section className="features-section">
                    <h2 className="section-title">Discover Amazing Features</h2>
                    <div className="features-grid"> 
                        <FeatureCard icon={BookOpen} title="Interactive Flashcards" description="Learn words with engaging flashcards that show definitions, synonyms, and antonyms" color="blue" delay={0}/>
                        <FeatureCard icon={Play} title="Fun Quizzes" description="Test your knowledge with interactive quizzes and track your learning progress" color="purple" delay={150}/>
                        <FeatureCard icon={Award} title="Achievement System" description="Earn badges and maintain streaks as you master new vocabulary words" color="pink" delay={300}/>
                    </div>
                </section>
            </main>

            {/* Credential Watermark Section - NOW OUTSIDE MAIN WRAPPER */}
            <section className="credential-section">
                <div className="credential-watermark">
                    <div className="credential-main">
                        <div>Crafted with passion by</div>
                        <div>Samia Tabassum Chowdhury</div>
                    </div>
                    <div className="credential-subtitle">4th Year Undergrad Student, BRAC University</div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;