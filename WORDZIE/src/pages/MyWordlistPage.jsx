import React, { useMemo, useState } from 'react';
import {
    ArrowLeft,
    Bookmark,
    BookOpen,
    CalendarDays,
    ExternalLink,
    Layers,
    Search,
    Trash2,
} from 'lucide-react';
import './MyWordlistPage.css';

const formatSavedDate = (dateValue) => {
    if (!dateValue) {
        return 'Recently added';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return 'Recently added';
    }

    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const normalizeText = (value) => String(value || '').toLowerCase();

const getSearchText = (wordItem) =>
    [
        wordItem.word,
        wordItem.definition,
        wordItem.sourceLetter,
        wordItem.sourceRoundName,
        ...(wordItem.synonyms || []),
        ...(wordItem.antonyms || []),
        ...(wordItem.sentences || []),
    ]
        .map(normalizeText)
        .join(' ');

const MyWordlistPage = ({
    savedWords = [],
    onBackHome,
    onRemoveWord,
    onStudySource,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeLetter, setActiveLetter] = useState('all');

    const availableLetters = useMemo(
        () =>
            Array.from(
                new Set(savedWords.map((wordItem) => wordItem.sourceLetter || wordItem.word?.[0] || '#')),
            ).sort(),
        [savedWords],
    );

    const filteredWords = useMemo(() => {
        const preparedSearchTerm = normalizeText(searchTerm).trim();

        return savedWords.filter((wordItem) => {
            const matchesLetter =
                activeLetter === 'all' ||
                (wordItem.sourceLetter || wordItem.word?.[0] || '#') === activeLetter;
            const matchesSearch =
                !preparedSearchTerm || getSearchText(wordItem).includes(preparedSearchTerm);

            return matchesLetter && matchesSearch;
        });
    }, [activeLetter, savedWords, searchTerm]);

    const groupedWords = useMemo(
        () =>
            filteredWords.reduce((groups, wordItem) => {
                const groupKey = wordItem.sourceLetter || wordItem.word?.[0] || '#';

                return {
                    ...groups,
                    [groupKey]: [...(groups[groupKey] || []), wordItem],
                };
            }, {}),
        [filteredWords],
    );

    const newestSavedWord = savedWords[0];
    const sourceCount = new Set(
        savedWords.map((wordItem) => wordItem.sourceRoundId || wordItem.sourceRoundName || wordItem.sourceLetter),
    ).size;

    return (
        <div className="my-wordlist-page">
            <div className="my-wordlist-shell">
                <header className="my-wordlist-hero">
                    <button className="my-wordlist-ghost-button" onClick={onBackHome} type="button">
                        <ArrowLeft size={18} /> Back to Home
                    </button>

                    <div className="my-wordlist-hero__content">
                        <span className="my-wordlist-kicker">
                            <Bookmark size={14} /> Personal vocabulary shelf
                        </span>
                        <h1>My Wordlist</h1>
                        <p>
                            Words saved from study pages and flashcards stay here with their meaning,
                            examples, and original source.
                        </p>
                    </div>

                    <div className="my-wordlist-stats">
                        <article>
                            <span>Saved words</span>
                            <strong>{savedWords.length}</strong>
                        </article>
                        <article>
                            <span>Source pages</span>
                            <strong>{sourceCount}</strong>
                        </article>
                        <article>
                            <span>Latest save</span>
                            <strong>{newestSavedWord ? newestSavedWord.word : 'None'}</strong>
                        </article>
                    </div>
                </header>

                <section className="my-wordlist-toolbar">
                    <label className="my-wordlist-search">
                        <Search size={18} />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search saved words"
                        />
                    </label>

                    <div className="my-wordlist-filter" aria-label="Filter saved words by letter">
                        <button
                            type="button"
                            className={activeLetter === 'all' ? 'is-active' : ''}
                            onClick={() => setActiveLetter('all')}
                        >
                            All
                        </button>
                        {availableLetters.map((letter) => (
                            <button
                                type="button"
                                key={letter}
                                className={activeLetter === letter ? 'is-active' : ''}
                                onClick={() => setActiveLetter(letter)}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </section>

                {savedWords.length === 0 ? (
                    <section className="my-wordlist-empty">
                        <div className="my-wordlist-empty__icon">
                            <BookOpen size={30} />
                        </div>
                        <h2>No saved words yet</h2>
                        <p>Use Add Wordlist on a word card to build your personal study set.</p>
                    </section>
                ) : filteredWords.length === 0 ? (
                    <section className="my-wordlist-empty">
                        <div className="my-wordlist-empty__icon">
                            <Search size={30} />
                        </div>
                        <h2>No matching words</h2>
                        <p>Try a different search or letter filter.</p>
                    </section>
                ) : (
                    <main className="my-wordlist-groups">
                        {Object.entries(groupedWords).map(([letter, words]) => (
                            <section className="my-wordlist-group" key={letter}>
                                <div className="my-wordlist-group__heading">
                                    <span>{letter}</span>
                                    <div>
                                        <h2>{letter} words</h2>
                                        <p>{words.length} saved {words.length === 1 ? 'entry' : 'entries'}</p>
                                    </div>
                                </div>

                                <div className="my-wordlist-grid">
                                    {words.map((wordItem) => (
                                        <article className="my-wordlist-card" key={wordItem.wordKey || wordItem.word}>
                                            <div className="my-wordlist-card__top">
                                                <div>
                                                    <span className="my-wordlist-card__source">
                                                        <Layers size={14} />
                                                        {wordItem.sourceRoundName || 'Vocabulary set'}
                                                    </span>
                                                    <h3>{wordItem.word}</h3>
                                                </div>

                                                <button
                                                    className="my-wordlist-card__remove"
                                                    onClick={() => onRemoveWord?.(wordItem.wordKey || wordItem.word)}
                                                    type="button"
                                                    aria-label={`Remove ${wordItem.word} from My Wordlist`}
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>

                                            <p className="my-wordlist-card__definition">{wordItem.definition}</p>

                                            <div className="my-wordlist-card__meta">
                                                <span>
                                                    <CalendarDays size={14} />
                                                    {formatSavedDate(wordItem.addedAt)}
                                                </span>
                                                {wordItem.sourceLetter && <span>Letter {wordItem.sourceLetter}</span>}
                                            </div>

                                            <div className="my-wordlist-card__details">
                                                <div>
                                                    <strong>Synonyms</strong>
                                                    <p>{wordItem.synonyms?.join(', ') || 'No synonyms listed.'}</p>
                                                </div>
                                                <div>
                                                    <strong>Antonyms</strong>
                                                    <p>{wordItem.antonyms?.join(', ') || 'No antonyms listed.'}</p>
                                                </div>
                                            </div>

                                            {wordItem.sentences?.[0] && (
                                                <blockquote className="my-wordlist-card__sentence">
                                                    {wordItem.sentences[0]}
                                                </blockquote>
                                            )}

                                            <button
                                                className="my-wordlist-card__source-button"
                                                type="button"
                                                onClick={() => onStudySource?.(wordItem)}
                                            >
                                                <ExternalLink size={16} /> Study source page
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </main>
                )}
            </div>
        </div>
    );
};

export default MyWordlistPage;
