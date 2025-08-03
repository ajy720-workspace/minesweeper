// src/components/ranking/DifficultyFilter.tsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGameTranslation, useProfileTranslation } from '@/hooks/useTranslation';
import { Difficulty } from '@/types';

export default function DifficultyFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentDifficulty = (searchParams.get('difficulty') as Difficulty) || 'beginner';
  const tGame = useGameTranslation();
  const tProfile = useProfileTranslation();

  const handleValueChange = (value: string) => {
    router.push(`${pathname}?difficulty=${value}`);
  };

  return (
    <div className="mb-4 w-48">
      <label className="block text-sm font-medium mb-2">{tProfile('difficulty')}:</label>
      <Select onValueChange={handleValueChange} defaultValue={currentDifficulty}>
        <SelectTrigger>
          <SelectValue placeholder={tProfile('difficulty')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="beginner">{tGame('difficulty.beginner')}</SelectItem>
          <SelectItem value="intermediate">{tGame('difficulty.intermediate')}</SelectItem>
          <SelectItem value="expert">{tGame('difficulty.expert')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
