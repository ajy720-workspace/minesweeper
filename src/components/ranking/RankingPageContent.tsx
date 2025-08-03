'use client';

import { Suspense } from 'react';
import DifficultyFilter from '@/components/ranking/DifficultyFilter';
import RankingTable from '@/components/ranking/RankingTable';
import UserStats from '@/components/ranking/UserStats';
import { useRankingTranslation } from '@/hooks/useTranslation';
import { Difficulty } from '@/types';
import { Database } from '@/types/supabase';

type RankingData = Database['public']['Functions']['get_ranking']['Returns'];
type UserStatsData = Database['public']['Functions']['get_user_ranking_stats']['Returns'][number];

interface RankingPageContentProps {
  session: { id: number; username: string } | null;
  difficulty: Difficulty;
  rankingData: RankingData | null;
  userStats: UserStatsData | null;
}

export function RankingPageContent({ session, difficulty, rankingData, userStats }: RankingPageContentProps) {
  const tRanking = useRankingTranslation();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{tRanking('title')}</h1>

      <DifficultyFilter />

      {session && <UserStats difficulty={difficulty} userStats={userStats} />}

      <Suspense fallback={<p>{tRanking('loading.ranking')}</p>}>
        <RankingTable data={rankingData} />
      </Suspense>
    </div>
  );
}
