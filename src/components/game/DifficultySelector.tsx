// src/components/game/DifficultySelector.tsx
import React from 'react';
import { Difficulty } from '@/types';
import { Button } from '@/components/ui/button';

type DifficultySelectorProps = {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  currentDifficulty: Difficulty;
};

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelectDifficulty, currentDifficulty }) => {
  const difficulties: Difficulty[] = ['beginner', 'intermediate', 'expert'];
  return (
    <div className="flex justify-center gap-4 mb-6">
      {difficulties.map((level) => (
        <Button
          key={level}
          onClick={() => onSelectDifficulty(level)}
          variant={currentDifficulty === level ? 'default' : 'secondary'}
          className="capitalize font-semibold"
          aria-pressed={currentDifficulty === level}
        >
          {level}
        </Button>
      ))}
    </div>
  );
};

export default DifficultySelector;
