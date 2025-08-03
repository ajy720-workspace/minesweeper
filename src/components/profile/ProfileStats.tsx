// src/components/profile/ProfileStats.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfileTranslation } from '@/hooks/useTranslation';
import { Database } from '@/types/supabase';

type UserStatsData = Database['public']['Functions']['get_user_ranking_stats']['Returns'][number];
type DifficultyStats = {
  totalGames: number;
  wins: number;
  bestTime: number | null;
  totalScore: number;
};
type OverallStatsData = Record<string, DifficultyStats>;

interface ProfileStatsProps {
  difficulty: string;
  rankingStats: UserStatsData | null;
  overallStats: OverallStatsData | null;
}

export default function ProfileStats({ difficulty, rankingStats, overallStats }: ProfileStatsProps) {
  const tProfile = useProfileTranslation();

  const currentDifficultyStats = overallStats?.[difficulty];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Overall Stats for Current Difficulty */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{tProfile('stats.totalGames')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentDifficultyStats?.totalGames || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{tProfile('stats.winRate')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currentDifficultyStats && currentDifficultyStats.totalGames > 0
              ? `${((currentDifficultyStats.wins / currentDifficultyStats.totalGames) * 100).toFixed(1)}%`
              : '0%'}
          </div>
        </CardContent>
      </Card>

      {/* Best Time and Ranking */}
      {rankingStats && rankingStats.best_time_ms !== null ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{tProfile('stats.bestTime')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(rankingStats.best_time_ms / 1000).toFixed(2)}s</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{tProfile('stats.ranking')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{rankingStats.user_rank}</div>
              <p className="text-sm text-muted-foreground">Top {rankingStats.percentile?.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{tProfile('stats.bestTime')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{tProfile('noData')}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{tProfile('stats.ranking')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">Unranked</div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
