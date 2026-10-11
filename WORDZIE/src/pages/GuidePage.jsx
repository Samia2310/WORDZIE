import React from 'react';
import {
    ArrowRight,
    Award,
    BookOpen,
    BookmarkCheck,
    Compass,
    Gamepad2,
    RotateCcw,
    UserRound,
} from 'lucide-react';
import './GuidePage.css';

const guideSteps = [
    {
        number: '01',
        icon: Compass,
        title: 'Discover words',
        description:
            'Start at Home and choose a letter from the circular navigator, or open Discover → Word Themes to explore vocabulary grouped by meaning and situation.',
        tip: 'Letter rounds are arranged in short pages. Themes collect related words across the whole vocabulary set.',
    },
    {
        number: '02',
        icon: BookOpen,
        title: 'Study the meaning',
        description:
            'Open a round to read each word with its definition, synonyms, antonyms, and example sentences. Save a word whenever you want to revisit it.',
        tip: 'Use the word list first when you want context; use flashcards when you are ready to test recall.',
    },
    {
        number: '03',
        icon: RotateCcw,
        title: 'Practice with flashcards',
        description:
            'Choose Flashcards from Activity to review a sample deck, or start a flashcard session from a letter round or a selected theme.',
        tip: 'Try to remember the meaning before revealing the answer, then review the supporting details.',
    },
    {
        number: '04',
        icon: Gamepad2,
        title: 'Build active recall',
        description:
            'Activity → Game Studio opens the vocabulary games. Choose a game for word families, matching, context clues, or spelling practice.',
        tip: 'Quick Quizzes are a separate, fast mixed review when you want a short check of what you know.',
    },
    {
        number: '05',
        icon: BookmarkCheck,
        title: 'Keep a personal list',
        description:
            'Save useful or difficult words to My Wordlist from a word list, theme, or flashcard. Open the list later to remove a word or return to its source.',
        tip: 'Your saved words and completed letter pages are stored in this browser on this device.',
    },
    {
        number: '06',
        icon: Award,
        title: 'Repeat and improve',
        description:
            'Move between discovery, study, and practice whenever you like. Revisit your saved words and marked pages to continue where you left off.',
        tip: 'There is no required order: choose the activity that suits the time and focus you have today.',
    },
];

const GuidePage = () => (
    <main className="guide-page">
        <div className="guide-page__shell">
            <header className="guide-hero">
                <span className="guide-eyebrow">Your WORDZIE guide</span>
                <h1>From discovery to confident recall.</h1>
                <p>
                    WORDZIE brings a large vocabulary collection into one learning path. Find words by
                    letter or theme, understand them in context, and strengthen memory through practice.
                </p>
                <a className="guide-hero__link" href="#view=home">
                    Start at Home <ArrowRight size={17} aria-hidden="true" />
                </a>
            </header>

            <section className="guide-steps" aria-labelledby="guide-steps-title">
                <div className="guide-section-heading">
                    <span className="guide-eyebrow">The learning flow</span>
                    <h2 id="guide-steps-title">A flexible way to learn, step by step.</h2>
                    <p>Pick up at any point and move between these tools as your learning needs change.</p>
                </div>
                <div className="guide-steps__list">
                    {guideSteps.map(({ number, icon, title, description, tip }) => (
                        <article className="guide-step" key={number}>
                            <span className="guide-step__number">{number}</span>
                            <div className="guide-step__body">
                                <div className="guide-step__title-row">
                                    {React.createElement(icon, { size: 21, 'aria-hidden': true })}
                                    <h3>{title}</h3>
                                </div>
                                <p>{description}</p>
                                <p className="guide-step__tip">{tip}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="guide-tools" aria-labelledby="guide-tools-title">
                <div>
                    <span className="guide-eyebrow">Choose a starting point</span>
                    <h2 id="guide-tools-title">Every tool has a clear role.</h2>
                </div>
                <div className="guide-tools__grid">
                    <article><strong>Discover</strong><span>Browse the collection by theme or alphabet.</span></article>
                    <article><strong>Activity</strong><span>Study with flashcards, quizzes, and vocabulary games.</span></article>
                    <article><strong>My Wordlist</strong><span>Keep a personal set of words you want to review.</span></article>
                </div>
            </section>

            <section className="guide-about" aria-labelledby="guide-about-title">
                <div className="guide-about__icon"><UserRound size={23} aria-hidden="true" /></div>
                <div>
                    <span className="guide-eyebrow">About WORDZIE</span>
                    <h2 id="guide-about-title">Created by Samia Tabassum Chowdhury</h2>
                    <p>4th Year Undergraduate Student, BRAC University</p>
                    <p className="guide-about__note">
                        WORDZIE does not require an account. Saved words and marked study progress stay in
                        this browser on this device; they are not synced to a user profile or cloud account.
                    </p>
                </div>
            </section>
        </div>
    </main>
);

export default GuidePage;
