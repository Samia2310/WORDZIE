import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CircleHelp, Home, RefreshCw } from 'lucide-react';
import {
    PUZZLE_SLOT_TYPES,
    createPuzzleSession,
    getPuzzleResults,
} from './gameData.js';
import './PuzzleBucketsGame.css';

const PuzzleBucketsGame = ({ onBackToGameSelect, onBackToHome }) => {
    const [session, setSession] = useState(() => createPuzzleSession());
    const [selectedChipId, setSelectedChipId] = useState('');
    const [draggedChipId, setDraggedChipId] = useState('');
    const [placements, setPlacements] = useState({});
    const [hasChecked, setHasChecked] = useState(false);

    const usedChipIds = new Set(Object.values(placements));
    const availableChips = session.chips.filter((chip) => !usedChipIds.has(chip.id));
    const isComplete =
        Object.keys(placements).length === session.rows.length * PUZZLE_SLOT_TYPES.length;
    const results = hasChecked ? getPuzzleResults(session, placements) : null;
    const selectedChip = session.chips.find((chip) => chip.id === selectedChipId);

    const placeChipInSlot = (slotKey, chipId) => {
        if (hasChecked || !chipId) {
            return;
        }

        setPlacements((current) => {
            const next = { ...current };
            Object.keys(next).forEach((key) => {
                if (next[key] === chipId) {
                    delete next[key];
                }
            });
            next[slotKey] = chipId;
            return next;
        });
        setSelectedChipId('');
        setDraggedChipId('');
    };

    const clearSlot = (slotKey) => {
        if (hasChecked || !placements[slotKey]) {
            return;
        }

        setPlacements((current) => {
            const next = { ...current };
            delete next[slotKey];
            return next;
        });
    };

    const handlePlaceChip = (slotKey) => {
        if (placements[slotKey]) {
            clearSlot(slotKey);
            return;
        }

        if (!selectedChipId) {
            return;
        }

        placeChipInSlot(slotKey, selectedChipId);
    };

    const restartGame = () => {
        setSession(createPuzzleSession());
        setSelectedChipId('');
        setDraggedChipId('');
        setPlacements({});
        setHasChecked(false);
    };

    return (
        <div className="puzzle-game">
            <div className="puzzle-game__shell">
                <header className="puzzle-game__topbar">
                    <button onClick={onBackToGameSelect} className="puzzle-game__nav-button">
                        <ArrowLeft size={18} />
                        <span>Back to Games</span>
                    </button>
                    <button
                        onClick={onBackToHome}
                        className="puzzle-game__nav-button puzzle-game__nav-button--home"
                    >
                        <Home size={18} />
                        <span>Home</span>
                    </button>
                </header>

                <section className="puzzle-game__hero">
                    <div className="puzzle-game__hero-copy">
                        <span className="puzzle-game__eyebrow">Orange Arcade</span>
                        <h1>Puzzle Buckets</h1>
                        <p>
                            Sort the tiles fast and build four complete vocabulary families from
                            meaning, synonym, and antonym clues.
                        </p>
                    </div>

                    <div className="puzzle-game__hud">
                        <div className="puzzle-game__hud-card">
                            <span>Selected tile</span>
                            <strong>
                                {selectedChip?.label || (draggedChipId ? 'Tile in hand' : 'None selected')}
                            </strong>
                        </div>
                        <div className="puzzle-game__hud-card">
                            <span>Tiles left</span>
                            <strong>{availableChips.length}</strong>
                        </div>
                        <div className="puzzle-game__hud-card">
                            <span>Board progress</span>
                            <strong>{Object.keys(placements).length} / 12</strong>
                        </div>
                    </div>
                </section>

                <div className="puzzle-game__layout">
                    <section className="puzzle-game__board">
                        <div className="puzzle-game__board-top">
                            <div>
                                <span className="puzzle-game__panel-kicker">How to play</span>
                                <h2>Drag or select tiles into the right slots and complete all four buckets.</h2>
                            </div>
                            <button className="puzzle-game__ghost-button" onClick={restartGame}>
                                <RefreshCw size={16} />
                                <span>New puzzle</span>
                            </button>
                        </div>

                        <div className="puzzle-game__steps">
                            <span>1. Choose or select a tile</span>
                            <span>2. Drag or select to place it</span>
                            <span>3. Submit the board</span>
                        </div>

                        <p className="puzzle-game__manual-note">
                            Tiles shown in all capital letters represent the main vocabulary words
                            for each bucket.
                        </p>

                        <div className="puzzle-game__chip-bank">
                            {availableChips.map((chip) => (
                                <button
                                    key={chip.id}
                                    className={`puzzle-game__chip ${
                                        selectedChipId === chip.id ? 'is-selected' : ''
                                    }`}
                                    onClick={() =>
                                        setSelectedChipId((current) =>
                                            current === chip.id ? '' : chip.id,
                                        )
                                    }
                                    draggable={!hasChecked}
                                    onDragStart={(event) => {
                                        if (hasChecked) {
                                            event.preventDefault();
                                            return;
                                        }

                                        setDraggedChipId(chip.id);
                                        setSelectedChipId(chip.id);
                                        event.dataTransfer.effectAllowed = 'move';
                                        event.dataTransfer.setData('text/plain', chip.id);
                                    }}
                                    onDragEnd={() => setDraggedChipId('')}
                                >
                                    {chip.label}
                                </button>
                            ))}
                        </div>

                        <div className="puzzle-game__bucket-grid">
                            {session.rows.map((row, index) => {
                                const rowResult = results?.rowResults.find((item) => item.rowId === row.id);
                                const bucketLabel = `Bucket ${String(index + 1).padStart(2, '0')} clue`;

                                return (
                                    <article key={row.id} className="puzzle-game__bucket-card">
                                        <div className="puzzle-game__bucket-header">
                                            <span className="puzzle-game__bucket-label">{bucketLabel}</span>
                                            <p>{row.clue}</p>
                                            <small>{row.example}</small>
                                        </div>

                                        <div className="puzzle-game__slot-grid">
                                            {PUZZLE_SLOT_TYPES.map((type) => {
                                                const slotKey = `${row.id}-${type}`;
                                                const chipId = placements[slotKey];
                                                const chip = session.chips.find((item) => item.id === chipId);
                                                const slotResult = rowResult?.slotResults.find(
                                                    (item) => item.type === type,
                                                );

                                                return (
                                                    <button
                                                        key={slotKey}
                                                        className={`puzzle-game__slot ${
                                                            chip ? 'has-chip' : ''
                                                        } ${
                                                            !chip && draggedChipId ? 'is-drop-target' : ''
                                                        } ${
                                                            hasChecked
                                                                ? slotResult?.isCorrect
                                                                    ? 'is-correct'
                                                                    : 'is-wrong'
                                                                : ''
                                                        }`}
                                                        onClick={() => handlePlaceChip(slotKey)}
                                                        onDragOver={(event) => {
                                                            if (!hasChecked) {
                                                                event.preventDefault();
                                                            }
                                                        }}
                                                        onDrop={(event) => {
                                                            event.preventDefault();
                                                            if (hasChecked) {
                                                                return;
                                                            }

                                                            const droppedChipId =
                                                                event.dataTransfer.getData('text/plain') ||
                                                                draggedChipId;

                                                            if (!droppedChipId) {
                                                                return;
                                                            }

                                                            placeChipInSlot(slotKey, droppedChipId);
                                                        }}
                                                    >
                                                        <span className="puzzle-game__slot-label">{type}</span>
                                                        <strong>{chip?.label || 'Place a tile here'}</strong>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <div className="puzzle-game__actions">
                            <button
                                className="puzzle-game__primary-button"
                                disabled={!isComplete || hasChecked}
                                onClick={() => setHasChecked(true)}
                            >
                                Submit puzzle
                            </button>
                        </div>
                    </section>

                    <aside className="puzzle-game__side">
                         <h3>Friendly game mode</h3>
                        <p>
                            Build a whole word family in each bucket. The fastest way to win is to
                            spot the main word first and then pair its synonym and antonym.
                        </p>

                        <div className="puzzle-game__stat-card">
                            <span>Tiles remaining</span>
                            <strong>{availableChips.length}</strong>
                        </div>

                        <div className="puzzle-game__stat-card">
                            <span>Completed buckets</span>
                            <strong>{results ? results.completedBuckets : 0} / 4</strong>
                        </div>

                        {results ? (
                            <div className="puzzle-game__feedback">
                                <h4>Your result</h4>
                                <p>
                                    You placed <strong>{results.correctSlots}</strong> out of{' '}
                                    <strong>{results.totalSlots}</strong> items correctly.
                                </p>
                                <button className="puzzle-game__secondary-button" onClick={restartGame}>
                                    <span>Try another puzzle</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="puzzle-game__tip">
                                <CircleHelp size={16} />
                                <p>
                                    Solve the easiest clue first. Once the main word is obvious,
                                    the synonym and antonym usually become easier too.
                                </p>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default PuzzleBucketsGame;
