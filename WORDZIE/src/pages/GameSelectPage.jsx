// pages/GameSelectPage.jsx

import React from 'react';
import gameModes from '../data/wordCollection';
import { Link } from 'react-router-dom'; 

const GameSelectPage = () => {
  return (
    <div className="game-select-container">
      <h1>Select a Game Mode</h1>
      <div className="mode-list">
        {Object.entries(gameModes).map(([modeKey, modeDetails]) => (
          <Link to={`/quiz-page/${modeKey}`} key={modeKey}>
            <div className="game-card">
              <h2>{modeDetails.title}</h2>
              <p>{modeDetails.description}</p>
              <span>Total Words: {modeDetails.words.length}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GameSelectPage;