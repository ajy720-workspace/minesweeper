// src/components/game/GameResultModal.tsx
'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { SubtleButtonMotion, ButtonMotion } from '@/components/ui/motion';
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useGameTranslation, useCommonTranslation, useErrorTranslation } from '@/hooks/useTranslation';

type GameState = 'won' | 'lost';

interface GameResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameResult: {
    status: GameState;
    time: number;
    timeMs?: number;
    score: number;
    difficulty: string;
  };
  session: { id: number; username: string } | null;
  onSaveRecord?: (username: string, password?: string) => Promise<void>;
  onPlayAgain: () => void;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
}

// Confetti component for win celebration
const Confetti = () => {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; rotation: number; color: string }>
  >([]);

  useEffect(() => {
    const colors = ['🎉', '🎊', '✨', '🌟', '💫'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 400,
      y: Math.random() * 300,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-2xl"
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: particle.rotation,
            opacity: 1,
            scale: 0,
          }}
          animate={{
            y: particle.y + 500,
            rotate: particle.rotation + 720,
            opacity: 0,
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            ease: 'easeOut',
            delay: Math.random() * 0.5,
          }}
        >
          {particle.color}
        </motion.div>
      ))}
    </div>
  );
};

export function GameResultModal({
  isOpen,
  onClose,
  gameResult,
  session,
  onSaveRecord,
  onPlayAgain,
  saveStatus = 'idle',
}: GameResultModalProps) {
  const tGame = useGameTranslation();
  const tCommon = useCommonTranslation();
  const tError = useErrorTranslation();

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

  const formatTime = (seconds: number, milliseconds?: number) => {
    if (milliseconds && milliseconds > 0) {
      const totalMs = milliseconds;
      const mins = Math.floor(totalMs / 60000);
      const secs = Math.floor((totalMs % 60000) / 1000);
      const ms = totalMs % 1000;

      if (mins > 0) {
        return `${mins}m ${secs}.${ms.toString().padStart(3, '0')}s`;
      } else {
        return `${secs}.${ms.toString().padStart(3, '0')}s`;
      }
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getDifficultyDisplay = (difficulty: string) => {
    return tGame(`difficulty.${difficulty}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden">
        {/* Confetti for wins */}
        <AnimatePresence>{gameResult.status === 'won' && <Confetti />}</AnimatePresence>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            delay: gameResult.status === 'won' ? 0.2 : 0,
          }}
        >
          <DialogHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                delay: 0.3,
              }}
            >
              <DialogTitle className="text-2xl text-center">
                {gameResult.status === 'won' ? (
                  <motion.span
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    {tGame('result.win')}
                  </motion.span>
                ) : (
                  <motion.span
                    animate={{
                      scale: [1, 0.95, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: 2,
                    }}
                  >
                    {tGame('result.lose')}
                  </motion.span>
                )}
              </DialogTitle>
            </motion.div>
          </DialogHeader>

          {/* Game Statistics */}
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      delay: 0.6,
                    }}
                  >
                    <div className="text-2xl font-bold text-blue-600">
                      {formatTime(gameResult.time, gameResult.timeMs)}
                    </div>
                    <div className="text-sm text-muted-foreground">{tCommon('time')}</div>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      delay: 0.8,
                    }}
                  >
                    <div className="text-2xl font-bold text-purple-600">{gameResult.score.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{tCommon('score')}</div>
                  </motion.div>
                </div>
                <motion.div
                  className="mt-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="text-lg font-semibold text-neutral-900">
                    {getDifficultyDisplay(gameResult.difficulty)} {tGame('ui.mode')}
                  </div>
                  {gameResult.status === 'won' && (
                    <motion.div
                      className="text-green-600 font-medium mt-1 bg-red"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 1.2,
                        type: 'spring',
                        stiffness: 400,
                      }}
                    >
                      {tGame('result.victoryAchieved')}
                    </motion.div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Auth Section for non-logged users */}
          {!session && onSaveRecord && (
            <form onSubmit={handleSubmit}>
              <DialogDescription className="mb-4 text-center">{tGame('actions.saveScorePrompt')}</DialogDescription>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    {tCommon('username')}
                  </Label>
                  <Input id="username" name="username" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    {tCommon('password')}
                  </Label>
                  <Input id="password" name="password" type="password" className="col-span-3" required />
                </div>
              </div>
              {/* Save Status Messages */}
              <AnimatePresence mode="wait">
                {saveStatus === 'saving' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-center"
                  >
                    <LoadingSpinner size="sm" message={tGame('loading.savingScore')} />
                  </motion.div>
                )}
                {saveStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: [1, 1.05, 1],
                    }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ scale: { duration: 0.3 } }}
                    className="text-center text-red-600 font-medium"
                  >
                    {tError('general')}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="flex justify-between gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <SubtleButtonMotion className="flex-1">
                  <Button type="button" variant="outline" onClick={handlePlayAgain} className="w-full">
                    {tCommon('playAgain')}
                  </Button>
                </SubtleButtonMotion>
                <SubtleButtonMotion className="flex-1">
                  <Button type="submit" disabled={saveStatus === 'saving'} className="w-full">
                    {saveStatus === 'saving' ? tCommon('saving') : tCommon('saveScore')}
                  </Button>
                </SubtleButtonMotion>
              </motion.div>
            </form>
          )}

          {/* Logged in user actions */}
          {session && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <AnimatePresence mode="wait">
                {saveStatus === 'saving' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <LoadingSpinner size="sm" message={tGame('loading.savingScore')} />
                  </motion.div>
                )}
                {saveStatus === 'saved' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-green-600 font-medium"
                  >
                    ✅{' '}
                    {tGame.rich('actions.scoreSavedFor', {
                      username: session.username,
                      strong: (chunks) => <span className="font-semibold">{chunks}</span>,
                    })}
                  </motion.div>
                )}
                {saveStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-red-600 font-medium"
                  >
                    {tError('general')}
                  </motion.div>
                )}
                {saveStatus === 'idle' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-sm text-muted-foreground"
                  >
                    {tGame.rich('actions.autoSaved', {
                      username: session.username,
                      strong: (chunks) => <span className="font-semibold">{chunks}</span>,
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                className="flex justify-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
              >
                <ButtonMotion>
                  <Button onClick={handlePlayAgain} className="px-8">
                    {tCommon('playAgain')}
                  </Button>
                </ButtonMotion>
                <ButtonMotion>
                  <Button variant="outline" onClick={onClose}>
                    {tCommon('close')}
                  </Button>
                </ButtonMotion>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
