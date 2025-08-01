// src/components/game/GameResultModal.tsx
'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

type GameState = 'won' | 'lost';

interface GameResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameResult: {
    status: GameState;
    time: number;
    score: number;
    difficulty: string;
  };
  session: { id: number; username: string } | null;
  onSaveRecord?: (username: string, password?: string) => Promise<void>;
  onPlayAgain: () => void;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
}

export function GameResultModal({ 
  isOpen, 
  onClose, 
  gameResult, 
  session, 
  onSaveRecord,
  onPlayAgain,
  saveStatus = 'idle'
}: GameResultModalProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onSaveRecord) return;
    
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    await onSaveRecord(username, password);
  };

  const handlePlayAgain = () => {
    onPlayAgain();
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getDifficultyDisplay = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {gameResult.status === 'won' ? '🎉 Congratulations!' : '💥 Game Over'}
          </DialogTitle>
        </DialogHeader>
        
        {/* Game Statistics */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{formatTime(gameResult.time)}</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{gameResult.score.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-lg font-semibold text-gray-700">
                {getDifficultyDisplay(gameResult.difficulty)} Mode
              </div>
              {gameResult.status === 'won' && (
                <div className="text-green-600 font-medium mt-1">
                  🏆 Victory achieved!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Auth Section for non-logged users */}
        {!session && onSaveRecord && (
          <form onSubmit={handleSubmit}>
            <DialogDescription className="mb-4">
              Save your score by logging in or creating a new account:
            </DialogDescription>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" name="username" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input id="password" name="password" type="password" className="col-span-3" required />
              </div>
            </div>
            {/* Save Status Messages */}
            {saveStatus === 'saving' && (
              <div className="text-center text-blue-600 font-medium">
                💾 Saving your score...
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="text-center text-green-600 font-medium mb-4">
                ✅ Score saved successfully!
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="text-center text-red-600 font-medium">
                ❌ Failed to save score. Please try again.
              </div>
            )}

            <div className="flex justify-between gap-3">
              <Button type="button" variant="outline" onClick={handlePlayAgain} className="flex-1">
                Play Again
              </Button>
              {saveStatus === 'saved' ? (
                <Button type="button" onClick={handlePlayAgain} className="flex-1">
                  New Game
                </Button>
              ) : (
                <Button type="submit" disabled={saveStatus === 'saving'} className="flex-1">
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Score'}
                </Button>
              )}
            </div>
          </form>
        )}

        {/* Logged in user actions */}
        {session && (
          <div className="space-y-4">
            {saveStatus === 'saving' && (
              <div className="text-center text-blue-600 font-medium">
                💾 Saving your score...
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="text-center text-green-600 font-medium">
                ✅ Score saved for <span className="font-semibold">{session.username}</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="text-center text-red-600 font-medium">
                ❌ Failed to save score. Please try again.
              </div>
            )}
            {saveStatus === 'idle' && (
              <div className="text-center text-sm text-gray-600">
                Score automatically saved for <span className="font-semibold">{session.username}</span>
              </div>
            )}
            <div className="flex justify-center gap-3">
              <Button onClick={handlePlayAgain} className="px-8">
                Play Again
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}