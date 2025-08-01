// src/components/ranking/DifficultyFilter.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Difficulty } from '@/types';

export default function DifficultyFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDifficulty = (searchParams.get('difficulty') as Difficulty) || 'beginner';

  const handleValueChange = (value: string) => {
    router.push(`/ranking?difficulty=${value}`);
  };

  return (
    <div className="mb-4 w-48">
      <Select onValueChange={handleValueChange} defaultValue={currentDifficulty}>
        <SelectTrigger>
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="beginner">Beginner</SelectItem>
          <SelectItem value="intermediate">Intermediate</SelectItem>
          <SelectItem value="expert">Expert</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
