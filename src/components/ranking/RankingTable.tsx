// src/components/ranking/RankingTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getRanking } from '@/app/ranking/actions';

interface RankingTableProps {
  data: Awaited<ReturnType<typeof getRanking>>['data'];
}

export default function RankingTable({ data }: RankingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Clear Time (s)</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.rank}</TableCell>
            <TableCell>{row.username}</TableCell>
            <TableCell>{(row.clear_time_ms / 1000).toFixed(2)}</TableCell>
            <TableCell>{row.score}</TableCell>
            <TableCell>{new Date(row.played_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
