// src/components/ranking/UserStats.tsx
import { getUserRankingStats } from '@/app/ranking/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserStatsProps {
  userId: number;
  difficulty: string;
}

export default async function UserStats({ userId, difficulty }: UserStatsProps) {
  const { data: stats } = await getUserRankingStats(userId, difficulty);

  if (!stats || stats.best_time_ms === null) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Stats for {difficulty}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You have no records for this difficulty yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Your Stats for {difficulty}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>Best Time:</strong> {(stats.best_time_ms / 1000).toFixed(2)}s
        </p>
        <p>
          <strong>Rank:</strong> {stats.user_rank} / {stats.total_players}
        </p>
        <p>
          <strong>Percentile:</strong> Top {stats.percentile?.toFixed(2)}%
        </p>
      </CardContent>
    </Card>
  );
}
