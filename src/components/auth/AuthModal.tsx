// src/components/auth/AuthModal.tsx
'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameResult: {
    status: 'won' | 'lost';
    time: number;
    score: number;
    difficulty: string;
  };
  onSaveRecord: (username: string, password?: string) => Promise<void>;
}

export function AuthModal({ isOpen, onClose, gameResult, onSaveRecord }: AuthModalProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    await onSaveRecord(username, password);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{gameResult.status === 'won' ? 'Congratulations!' : 'Game Over'}</DialogTitle>
          <DialogDescription>
            {gameResult.status === 'won'
              ? `You won in ${gameResult.time} seconds with a score of ${gameResult.score}.`
              : `Your score: ${gameResult.score}.`}
            <br />
            Enter your username to save your score. If the username doesn&apos;t exist, a new account will be created.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
          <div className="flex justify-end">
            <Button type="submit">Save Score</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
