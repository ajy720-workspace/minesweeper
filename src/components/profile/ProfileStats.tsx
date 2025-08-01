// src/components/profile/ProfileStats.tsx
import { getUserRankingStats } from '@/app/ranking/actions';
import { getUserOverallStats } from '@/app/profile/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileStatsProps {
  userId: number;
  difficulty: string;
}

export default async function ProfileStats({ userId, difficulty }: ProfileStatsProps) {
  const [rankingResult, overallResult] = await Promise.all([
    getUserRankingStats(userId, difficulty),
    getUserOverallStats(userId),
  ]);

  const { data: rankingStats } = rankingResult;
  const { data: overallStats } = overallResult;

  const currentDifficultyStats = overallStats?.[difficulty];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Overall Stats for Current Difficulty */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentDifficultyStats?.totalGames || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
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
              <CardTitle className="text-sm font-medium">Best Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(rankingStats.best_time_ms / 1000).toFixed(2)}s</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Ranking</CardTitle>
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
              <CardTitle className="text-sm font-medium">Best Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">No wins yet</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Ranking</CardTitle>
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
