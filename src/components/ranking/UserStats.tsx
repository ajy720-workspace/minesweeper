// src/components/ranking/UserStats.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRankingTranslation, useGameTranslation } from '@/hooks/useTranslation';
import { Database } from '@/types/supabase';

type UserStatsData = Database['public']['Functions']['get_user_ranking_stats']['Returns'][number];

interface UserStatsProps {
  difficulty: string;
  userStats: UserStatsData | null;
}

export default function UserStats({ difficulty, userStats: stats }: UserStatsProps) {
  const tRanking = useRankingTranslation();
  const tGame = useGameTranslation();

  if (!stats || stats.best_time_ms === null) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {tRanking('yourStats')} - {tGame(`difficulty.${difficulty}`)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{tRanking('noData')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {tRanking('yourStats')} - {tGame(`difficulty.${difficulty}`)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>{tRanking('table.time')}:</strong> {(stats.best_time_ms / 1000).toFixed(2)}s
        </p>
        <p>
          <strong>{tRanking('table.rank')}:</strong> {stats.user_rank} / {stats.total_players}
        </p>
        <p>
          <strong>Percentile:</strong> Top {stats.percentile?.toFixed(2)}%
        </p>
      </CardContent>
    </Card>
  );
}
