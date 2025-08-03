'use client';

import { Suspense } from 'react';
import ProfileStats from '@/components/profile/ProfileStats';
import GameHistoryTable from '@/components/profile/GameHistoryTable';
import DifficultyFilter from '@/components/ranking/DifficultyFilter';
import { useProfileTranslation } from '@/hooks/useTranslation';
import { Difficulty } from '@/types';
import { Database } from '@/types/supabase';

type GameRecord = {
  id: number;
  difficulty: string;
  win: boolean;
  clear_time_ms: number;
  score: number;
  played_at: string;
};

type ProfileData = {
  gameHistory: GameRecord[];
  totalGames: number;
  winRate: number;
  totalWins: number;
};

type UserStatsData = Database['public']['Functions']['get_user_ranking_stats']['Returns'][number];
type DifficultyStats = {
  totalGames: number;
  wins: number;
  bestTime: number | null;
  totalScore: number;
};
type OverallStatsData = Record<string, DifficultyStats>;

interface ProfilePageContentProps {
  session: { id: number; username: string };
  difficulty: Difficulty;
  profileData: ProfileData | null;
  rankingStats: UserStatsData | null;
  overallStats: OverallStatsData | null;
}

export function ProfilePageContent({
  session,
  difficulty,
  profileData,
  rankingStats,
  overallStats,
}: ProfilePageContentProps) {
  const tProfile = useProfileTranslation();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{tProfile('title')}</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{tProfile('welcomeBack', { username: session.username })}</h2>
      </div>

      <DifficultyFilter />

      <ProfileStats difficulty={difficulty} rankingStats={rankingStats} overallStats={overallStats} />

      <Suspense fallback={<p>{tProfile('loading.gameHistory')}</p>}>
        <GameHistoryTable data={profileData?.gameHistory || []} difficulty={difficulty} />
      </Suspense>
    </div>
  );
}
