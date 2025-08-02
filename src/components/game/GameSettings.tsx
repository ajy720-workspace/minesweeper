// src/components/game/GameSettings.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { audioManager } from '@/lib/audio';

interface GameSettingsProps {
  onRestart: () => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({ onRestart }) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(audioManager.isMutedState());
  }, []);

  const handleMuteToggle = () => {
    const newMutedState = audioManager.toggleMute();
    setIsMuted(newMutedState);
  };

  return (
    <div className="mt-4 max-w-fit mx-auto">
        <div className="flex items-center gap-3">
          {/* Audio Toggle */}
          <Button
            size="sm"
            variant={isMuted ? "outline" : "default"}
            onClick={handleMuteToggle}
            className="h-9 w-9 p-0"
            title={isMuted ? 'Enable sound effects' : 'Disable sound effects'}
          >
            {isMuted ? '🔇' : '🔊'}
          </Button>

          {/* Restart Game */}
          <Button
            size="sm"
            variant="outline"
            onClick={onRestart}
            className="h-9 w-9 p-0"
            title="Restart game"
          >
            🔄
          </Button>

          {/* Theme Toggle - Placeholder */}
          <Button
            size="sm"
            variant="outline"
            disabled
            className="h-9 w-9 p-0 opacity-50"
            title="Color theme (coming soon)"
          >
            🎨
          </Button>
        </div>
    </div>
  );
};

export default GameSettings;