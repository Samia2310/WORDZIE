import React from 'react';
import {
    ArrowRight,
    Award,
    BookOpen,
    Gamepad2,
    Play,
    Zap,
} from 'lucide-react';
import './HomePage.css';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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

const CircularLetterSelector = ({ onLetterSelect, selectedLetter, wordData, completedLetters }) => {
    const isLetterAvailable = (letter) => Boolean(wordData?.[letter]?.length);

    return (
        <div className="alphabet-selector">
            <svg viewBox="0 0 320 320" className="alphabet-selector__svg">
                <circle cx="160" cy="160" r="52" className="alphabet-selector__core" />
                <text x="160" y="145" textAnchor="middle" className="alphabet-selector__core-line alphabet-selector__core-line--top">
                    Choose a
                </text>
                <text x="160" y="171" textAnchor="middle" className="alphabet-selector__core-line alphabet-selector__core-line--middle">
                    LETTER
                </text>
                <text x="160" y="196" textAnchor="middle" className="alphabet-selector__core-line alphabet-selector__core-line--bottom">
                    to start!
                </text>

                {alphabet.map((letter, index) => {
                    const { x, y } = getLetterPosition(index, alphabet.length);
                    const isAvailable = isLetterAvailable(letter);
                    const isSelected = selectedLetter === letter;
                    const isMarked = Boolean(completedLetters?.[letter]);

                    let circleClassName = 'alphabet-selector__letter-ring';
                    let textClassName = 'alphabet-selector__letter-text';

                    if (isAvailable) {
                        circleClassName += ' is-available';
                        textClassName += ' is-available';
                    } else {
                        circleClassName += ' is-unavailable';
                        textClassName += ' is-unavailable';
                    }

                    if (isSelected) {
                        circleClassName += ' is-selected';
                        textClassName += ' is-selected';
                    }

                    if (isMarked) {
                        circleClassName += ' is-marked';
                        textClassName += ' is-marked';
                    }

                    return (
                        <g
                            key={letter}
                            onClick={() => isAvailable && onLetterSelect(letter)}
                            style={{ cursor: isAvailable ? 'pointer' : 'not-allowed' }}
                        >
                            <circle cx={x} cy={y} r="15" className={circleClassName} />
                            <text x={x} y={y + 5} textAnchor="middle" className={textClassName}>
                                {letter}
                            </text>
                            {isMarked && (
                                <circle
                                    cx={x + 10}
                                    cy={y - 10}
                                    r="4"
                                    className="alphabet-selector__marked-dot"
                                />
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

const ExperienceCard = ({
    icon: Icon,
    eyebrow,
    title,
    description,
    footer,
    onClick,
    actionLabel,
}) => {
    const isInteractive = Boolean(onClick);
    const Tag = isInteractive ? 'button' : 'article';

    return (
        <Tag
            className={isInteractive ? 'home-card home-card--interactive' : 'home-card'}
            onClick={onClick}
            type={isInteractive ? 'button' : undefined}
        >
            <div className="home-card__icon">
                <Icon size={20} />
            </div>
            <span className="home-card__eyebrow">{eyebrow}</span>
            <h3 className="home-card__title">{title}</h3>
            <p className="home-card__description">{description}</p>
            <div className="home-card__footer">
                <span>{footer}</span>
                {isInteractive && (
                    <span className="home-card__action">
                        {actionLabel} <ArrowRight size={16} />
                    </span>
                )}
            </div>
        </Tag>
    );
};

const HomePage = ({
    onLetterSelect,
    onNavigateToGameSelect,
    onOpenFlashcardPreview,
    onOpenQuickQuiz,
    completedLetters,
    selectedLetter,
    wordData,
}) => {
    const totalWords = Object.values(wordData || {}).flat().length;
    const availableLetters = Object.values(wordData || {}).filter((words) => words?.length).length;

    return (
        <div className="home-page">
            <div className="home-shell">
                <header className="home-topbar">
                    <div className="home-brand">
                        <h1>WORDZIE</h1>
                        <p>Vocabulary learning, made focused and memorable.</p>
                    </div>
                </header>

                <section className="home-hero home-hero--banner">
                    <div className="home-hero__copy home-hero__copy--full">
                        <div className="home-badge">
                            <Zap size={16} />
                            <span>Vocabulary studio for focused daily learning</span>
                        </div>

                        <h1 className="home-title">Build vocabulary with clarity and purpose</h1>

                        <p className="home-description">
                            WORDZIE combines alphabet-based study, interactive flashcards, and challenge
                            modes into one polished learning space. Start from the circular selector or
                            explore a guided preview instantly.
                        </p>

                        <div className="home-actions">
                            <button className="home-button home-button--primary" onClick={onOpenFlashcardPreview}>
                                <BookOpen size={18} /> Open Flashcard Preview
                            </button>
                            <button className="home-button home-button--secondary" onClick={onNavigateToGameSelect}>
                                <Gamepad2 size={18} /> Explore Challenge Modes
                            </button>
                            <button className="home-button home-button--tertiary" onClick={onOpenQuickQuiz}>
                                <Award size={18} /> Start Quick Quiz
                            </button>
                        </div>

                        <div className="home-metrics">
                            <article className="home-metric">
                                <strong>{totalWords}+</strong>
                                <span>Vocabulary entries</span>
                            </article>
                            <article className="home-metric">
                                <strong>{availableLetters}</strong>
                                <span>Active letter tracks</span>
                            </article>
                            <article className="home-metric">
                                <strong>4</strong>
                                <span>Challenge games</span>
                            </article>
                            <article className="home-metric">
                                <strong>7 days</strong>
                                <span>Current streak</span>
                            </article>
                        </div>
                    </div>
                </section>

                <section className="home-selector-stage">
                    <div className="home-selector-card">
                        <div className="home-selector-card__header">
                            <span className="home-section-kicker">Alphabet Navigator</span>
                            <h2>Choose a round to start practicing</h2>
                            <p>
                                Each letter opens its own round with multiple study pages, so learning feels structured,
                                approachable, and easy to continue.
                            </p>
                        </div>

                        <CircularLetterSelector
                            onLetterSelect={onLetterSelect}
                            selectedLetter={selectedLetter}
                            wordData={wordData}
                            completedLetters={completedLetters}
                        />
                    </div>
                </section>

                <section className="home-experiences">
                    <div className="home-section-heading">
                        <h2>Choose the learning style that fits your next step.</h2>
                    </div>

                    <div className="home-card-grid">
                        <ExperienceCard
                            icon={BookOpen}
                            eyebrow="Interactive"
                            title="Flashcard Studio"
                            description="Preview definitions, synonyms, antonyms, and usage in an experience designed around recall and confidence."
                            onClick={onOpenFlashcardPreview}
                            actionLabel="Try now"
                        />
                        <ExperienceCard
                            icon={Play}
                            eyebrow="Practice"
                            title="Challenge Modes"
                            description="Move from review to action with quiz-style practice that turns vocabulary into something more dynamic."
                            onClick={onNavigateToGameSelect}
                            actionLabel="Open modes"
                        />
                        <ExperienceCard
                            icon={Award}
                            eyebrow="Test"
                            title="Quick Quiz"
                            description="Choose a quiz mode and get instant feedback that helps you understand what you already know and what needs more practice."
                            onClick={onOpenQuickQuiz}
                            actionLabel="Start quiz"
                        />
                    </div>
                </section>

                <section className="home-lower-grid">
                    <article className="home-journey-card">
                        <span className="home-section-kicker">How It Flows</span>
                        <h2>A simple path from discovery to practice.</h2>

                        <div className="home-steps">
                            <div className="home-step">
                                <span className="home-step__number">01</span>
                                <div>
                                    <h3>Pick a round</h3>
                                    <p>Use the circular selector to jump into a focused vocabulary round by letter.</p>
                                </div>
                            </div>
                            <div className="home-step">
                                <span className="home-step__number">02</span>
                                <div>
                                    <h3>Study with intention</h3>
                                    <p>Read the words, then reinforce memory through the flashcard studio.</p>
                                </div>
                            </div>
                            <div className="home-step">
                                <span className="home-step__number">03</span>
                                <div>
                                    <h3>Test and revisit</h3>
                                    <p>Switch to challenge mode and quiz when you want to convert recognition into recall.</p>
                                </div>
                            </div>
                        </div>
                    </article>

                    <aside className="home-signature-card home-credential-card">
                        <div className="home-credential-card__frame">
                            <span className="home-credential-card__label">Creator Credential</span>
                            <strong className="home-credential-card__name">Samia Tabassum Chowdhury</strong>
                            <span className="home-credential-card__role">
                                4th Year Undergrad Student, BRAC University
                            </span>
                        </div>
                    </aside>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
