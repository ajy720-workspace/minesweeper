// src/components/game/DifficultySelector.tsx
import React from 'react';
import { Difficulty } from '@/types';

type DifficultySelectorProps = {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  currentDifficulty: Difficulty;
};

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelectDifficulty, currentDifficulty }) => {
  const difficulties: Difficulty[] = ['beginner', 'intermediate', 'expert'];
  return (
    <div className="flex justify-center space-x-4 mb-4">
      {difficulties.map(level => (
        <button 
          key={level}
          onClick={() => onSelectDifficulty(level)} 
          className={`px-4 py-2 rounded capitalize font-semibold ${
            currentDifficulty === level 
              ? 'bg-blue-700 text-white' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;
