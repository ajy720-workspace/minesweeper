// src/components/profile/GameHistoryTable.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type GameRecord = {
  id: number;
  difficulty: string;
  win: boolean;
  clear_time_ms: number;
  score: number;
  played_at: string;
};

interface GameHistoryTableProps {
  data: GameRecord[];
  difficulty: string;
}

export default function GameHistoryTable({ data, difficulty }: GameHistoryTableProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Game History - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No games played for this difficulty yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Game History - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ({data.length} games)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Result</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((game) => (
              <TableRow key={game.id}>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      game.win
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {game.win ? 'Win' : 'Loss'}
                  </span>
                </TableCell>
                <TableCell>
                  {game.win ? (
                    <span className="font-mono">{(game.clear_time_ms / 1000).toFixed(2)}s</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-mono">{game.score.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(game.played_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
