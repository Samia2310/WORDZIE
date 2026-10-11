import React, { useMemo, useState } from 'react';
import { ArrowLeft, Bookmark, Check, Home, Layers3, Search, Sparkles, X } from 'lucide-react';
import './WordThemesPage.css';

const normalize = (value = '') => value.trim().toLowerCase();

const themeCardDescriptions = {
    Praise: 'Expressions of admiration, approval, and recognition.',
    Criticism: 'Ways to point out faults, express disapproval, or condemn.',
    Uncertainty: 'Words for doubt, ambiguity, and unanswered questions.',
    Clarity: 'Language that makes an idea unmistakable and easy to understand.',
    Kindness: 'Qualities of compassion, generosity, and goodwill toward others.',
    Hostility: 'Words that express animosity, aggression, or ill will.',
    Stinginess: 'A reluctance to spend, share, or give freely.',
    Spending: 'Words for lavish or extravagant use of money and resources.',
    Frugality: 'Careful, sensible use of money and other resources.',
    Verbosity: 'A wordy style that uses more language than necessary.',
    Concision: 'Clear expression using only a few well-chosen words.',
    Productivity: 'The ability to produce, create, or generate in abundance.',
    Barrenness: 'A lack of growth, fertility, or useful results.',
    Difficulty: 'Challenges that demand effort, endurance, or skill.',
    Ease: 'Things that are simple, effortless, or basic to do.',
    Tradition: 'Established customs and familiar ways of doing things.',
    Originality: 'Fresh, unconventional ideas and distinctive approaches.',
    Diligence: 'Steady, careful effort applied to a task.',
    Laziness: 'A lack of energy, effort, or willingness to act.',
    Comfort: 'Actions and qualities that soothe distress or ease hardship.',
    Aggravation: 'Things that worsen a problem or increase irritation.',
    Decline: 'A gradual decrease, weakening, or fading away.',
    Growth: 'An increase, expansion, or development over time.',
    Stubbornness: 'An unwillingness to change an opinion or course of action.',
    Flexibility: 'The ability to adapt, adjust, or yield when needed.',
    Arrogance: 'An exaggerated sense of one’s own importance or ability.',
    Humility: 'A modest view of oneself and one’s accomplishments.',
    Honesty: 'Truthful, sincere, and direct communication or behavior.',
    Deception: 'Ways of misleading others or presenting something as true when it is not.',
    Caution: 'Careful judgment that helps avoid unnecessary risk.',
    Recklessness: 'Careless action taken without enough thought for danger.',
    Wisdom: 'Sound judgment, insight, and understanding.',
    Foolishness: 'Poor judgment, lack of sense, or easy acceptance of false ideas.',
    Boredom: 'A feeling of dullness caused by repetition or lack of interest.',
    Interest: 'Qualities that attract attention and keep someone engaged.',
    Happiness: 'Feelings of joy, delight, and positive well-being.',
    Sorrow: 'Feelings of sadness, grief, or deep disappointment.',
    Anger: 'Words for irritation, resentment, and open hostility.',
    Calmness: 'A peaceful, steady, and even-tempered state.',
    Transience: 'Things that last only briefly or pass quickly.',
    Permanence: 'Qualities of lasting, enduring, or unchanging states.',
    Abundance: 'A plentiful supply or more than enough of something.',
    Scarcity: 'A shortage or an amount too small to meet a need.',
    Wealth: 'Material prosperity and possession of valuable resources.',
    Poverty: 'A condition of lacking money or essential resources.',
    Support: 'Actions that endorse, strengthen, or provide evidence for someone or something.',
    Opposition: 'Actions that challenge, reject, or work against an idea.',
    Concealment: 'Hiding something or keeping it from being noticed.',
    Disclosure: 'Making information known or bringing something into view.',
    Commonness: 'Things that are widespread, familiar, or frequently encountered.',
    Rarity: 'Things that are unusual, uncommon, or seldom found.',
    Change: 'Variation, unpredictability, and movement from one state to another.',
    Stability: 'Consistency, firmness, and freedom from sudden change.',
    Obstruction: 'Anything that blocks, delays, or gets in the way of progress.',
    Assistance: 'Help that makes a task easier or helps progress along.',
    Benefit: 'Qualities and effects that are helpful, healthful, or advantageous.',
    Harm: 'Things that cause damage, danger, or an unhealthy effect.',
    Simplicity: 'Plainness and freedom from unnecessary detail or decoration.',
    Ornament: 'Decorative detail and richly embellished style.',
    Relevance: 'A direct connection to what matters or is needed.',
    Irrelevance: 'Details that are unrelated, unnecessary, or beside the point.',
    Flattery: 'Excessive praise, often offered to win someone’s favor.',
    Defiance: 'Open resistance to rules, authority, or expectations.',
    Peace: 'Harmony, goodwill, and efforts to settle disagreement.',
    Conflict: 'Disagreement, tension, or active opposition between people or ideas.',
};

const ThemeWordCard = ({
    word,
    theme,
    onAddToMyWordlist,
    onRemoveFromMyWordlist,
    isWordInMyWordlist,
}) => {
    const isSaved = isWordInMyWordlist(word);

    return (
        <article className="word-theme-word-card">
            <div className="word-theme-word-card__top">
                <div>
                    <span className="word-theme-word-card__letter">{word.word[0]}</span>
                    <h3>{word.word}</h3>
                </div>
                <button
                    className={`word-theme-save-button${isSaved ? ' is-saved' : ''}`}
                    onClick={() => (isSaved ? onRemoveFromMyWordlist(word) : onAddToMyWordlist(word, {
                        roundName: theme.title,
                        roundId: theme.id,
                    }))}
                    type="button"
                    aria-label={`${isSaved ? 'Remove' : 'Save'} ${word.word} ${isSaved ? 'from' : 'to'} My Wordlist`}
                >
                    {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
                    {isSaved ? 'Saved' : 'Save word'}
                </button>
            </div>
            <p className="word-theme-word-card__definition">{word.definition}</p>
            {word.synonyms?.length > 0 && (
                <p className="word-theme-word-card__synonyms">
                    <strong>Related words:</strong> {word.synonyms.join(', ')}
                </p>
            )}
            {word.sentences?.length > 0 && (
                <p className="word-theme-word-card__example">“{word.sentences[0]}”</p>
            )}
        </article>
    );
};

const WordThemesPage = ({
    themes,
    selectedTheme,
    wordDataByLetter,
    getWordsForTheme,
    onSelectTheme,
    onBackToThemes,
    onBackHome,
    onAddToMyWordlist,
    onRemoveFromMyWordlist,
    isWordInMyWordlist,
}) => {
    const [query, setQuery] = useState('');
    const normalizedQuery = normalize(query);
    const themeResults = useMemo(() => themes.map((theme) => ({
        theme,
        words: getWordsForTheme(theme, wordDataByLetter),
    })), [themes, wordDataByLetter, getWordsForTheme]);
    const allWords = useMemo(() => Object.values(wordDataByLetter || {}).flat(), [wordDataByLetter]);
    const themeIdsByWord = useMemo(() => {
        const idsByWord = new Map();

        for (const { theme, words } of themeResults) {
            for (const word of words) {
                const key = normalize(word.word);
                idsByWord.set(key, [...(idsByWord.get(key) || []), theme]);
            }
        }

        return idsByWord;
    }, [themeResults]);
    const visibleThemes = themeResults.filter(({ theme, words }) => {
        if (!normalizedQuery) return true;
        if (`${theme.title} ${theme.description}`.toLowerCase().includes(normalizedQuery)) return true;

        return words.some((word) =>
            `${word.word} ${word.definition} ${(word.synonyms || []).join(' ')} ${(word.antonyms || []).join(' ')}`
                .toLowerCase()
                .includes(normalizedQuery),
        );
    });
    const matchingWords = normalizedQuery
        ? allWords
              .filter((word) =>
                  `${word.word} ${word.definition} ${(word.synonyms || []).join(' ')} ${(word.antonyms || []).join(' ')}`
                      .toLowerCase()
                      .includes(normalizedQuery),
              )
              .sort((left, right) => {
                  const leftExact = normalize(left.word) === normalizedQuery ? 0 : 1;
                  const rightExact = normalize(right.word) === normalizedQuery ? 0 : 1;
                  return leftExact - rightExact || left.word.localeCompare(right.word);
              })
        : [];
    const visibleWordMatches = matchingWords.slice(0, 8);
    const selectedWords = selectedTheme
        ? getWordsForTheme(selectedTheme, wordDataByLetter)
        : [];

    return (
        <div className="word-themes-page">
            <div className="word-themes-shell">
                <header className="word-themes-hero">
                    <div className="word-themes-topbar">
                        <button className="word-themes-utility-button" onClick={selectedTheme ? onBackToThemes : onBackHome} type="button">
                            <ArrowLeft size={17} /> {selectedTheme ? 'All themes' : 'Back to Home'}
                        </button>
                        {selectedTheme && (
                            <button className="word-themes-utility-button" onClick={onBackHome} type="button">
                                <Home size={17} /> Home
                            </button>
                        )}
                    </div>

                    <div className="word-themes-intro">
                        <span className="word-themes-kicker"><Sparkles size={14} /> Vocabulary by meaning</span>
                        <h1>{selectedTheme ? selectedTheme.title : 'Explore Word Themes'}</h1>
                        <p>
                            {selectedTheme
                                ? `Words connected to ${selectedTheme.title.toLowerCase()}. Explore related words from across the WORDZIE dictionary.`
                                : 'Find the right word for a feeling, quality, action, or situation. Browse a theme or search the vocabulary.'}
                        </p>
                    </div>

                    {!selectedTheme && (
                        <div className="word-themes-search">
                            <Search size={19} aria-hidden="true" />
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search a word, meaning, or theme"
                                aria-label="Search themes or words"
                            />
                            {query && (
                                <button
                                    className="word-themes-search__clear"
                                    onClick={() => setQuery('')}
                                    type="button"
                                    aria-label="Clear search"
                                >
                                    <X size={17} />
                                </button>
                            )}
                            <span>{visibleThemes.length} themes</span>
                        </div>
                    )}

                    {selectedTheme && (
                        <div className="word-themes-summary">
                            <span><Layers3 size={16} /> Theme collection</span>
                            <strong>{selectedWords.length} {selectedWords.length === 1 ? 'word' : 'words'}</strong>
                        </div>
                    )}
                </header>

                {selectedTheme ? (
                    <>
                        {selectedWords.length > 0 ? (
                            <main className="word-themes-word-grid">
                                {selectedWords.map((word) => (
                                    <ThemeWordCard
                                        key={normalize(word.word)}
                                        word={word}
                                        theme={selectedTheme}
                                        onAddToMyWordlist={onAddToMyWordlist}
                                        onRemoveFromMyWordlist={onRemoveFromMyWordlist}
                                        isWordInMyWordlist={isWordInMyWordlist}
                                    />
                                ))}
                            </main>
                        ) : (
                            <section className="word-themes-empty">
                                <h2>No words in this theme yet</h2>
                                <p>Choose another theme to keep exploring the vocabulary.</p>
                            </section>
                        )}
                    </>
                ) : (
                    <>
                        {normalizedQuery && (
                            <section className="word-theme-search-results" aria-live="polite">
                                <div className="word-theme-search-results__heading">
                                    <div>
                                        <span className="word-themes-kicker">Dictionary matches</span>
                                        <h2>Words matching: {query.trim()}</h2>
                                    </div>
                                    <span>{matchingWords.length} {matchingWords.length === 1 ? 'word' : 'words'}</span>
                                </div>
                                {visibleWordMatches.length > 0 ? (
                                    <div className="word-theme-search-results__list">
                                        {visibleWordMatches.map((word) => {
                                            const matchingThemes = themeIdsByWord.get(normalize(word.word)) || [];
                                            return (
                                                <article className="word-theme-search-result" key={normalize(word.word)}>
                                                    <div>
                                                        <h3>{word.word}</h3>
                                                        <p>{word.definition}</p>
                                                    </div>
                                                    {matchingThemes.length > 0 ? (
                                                        <button
                                                            className="word-theme-search-result__theme"
                                                            onClick={() => onSelectTheme(matchingThemes[0].id)}
                                                            type="button"
                                                        >
                                                            In {matchingThemes[0].title}
                                                            {matchingThemes.length > 1 && ` +${matchingThemes.length - 1}`}
                                                            <ArrowLeft size={14} />
                                                        </button>
                                                    ) : (
                                                        <span className="word-theme-search-result__unassigned">No theme yet</span>
                                                    )}
                                                </article>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="word-theme-search-results__empty">No dictionary words match that search.</p>
                                )}
                                {matchingWords.length > visibleWordMatches.length && (
                                    <p className="word-theme-search-results__hint">
                                        Showing the first {visibleWordMatches.length} matches. Refine your search to narrow the list.
                                    </p>
                                )}
                            </section>
                        )}

                        <section className="word-theme-browse-section">
                            <div className="word-theme-browse-section__heading">
                                <h2>{normalizedQuery ? 'Matching themes' : 'Browse all themes'}</h2>
                                <span>{visibleThemes.length}</span>
                            </div>
                            {visibleThemes.length > 0 ? (
                                <main className="word-themes-grid">
                                    {visibleThemes.map(({ theme, words }) => (
                                        <button
                                            className="word-theme-card"
                                            key={theme.id}
                                            onClick={() => onSelectTheme(theme.id)}
                                            type="button"
                                        >
                                            <span className="word-theme-card__icon"><Layers3 size={19} /></span>
                                            <span className="word-theme-card__count">{words.length} words</span>
                                            <h2>{theme.title}</h2>
                                            <p>{themeCardDescriptions[theme.title] || theme.description}</p>
                                            <span className="word-theme-card__preview">
                                                {words.slice(0, 4).map((word) => word.word).join(' | ')}
                                            </span>
                                            <span className="word-theme-card__action">Explore theme <ArrowLeft size={15} /></span>
                                        </button>
                                    ))}
                                </main>
                            ) : (
                                <section className="word-themes-empty">
                                    <h2>No matching themes</h2>
                                    <p>Use a different search, or choose one of the matching dictionary words above.</p>
                                </section>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default WordThemesPage;
