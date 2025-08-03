// src/components/ranking/RankingTable.tsx
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getRanking } from '@/app/ranking/actions';
import { useRankingTranslation } from '@/hooks/useTranslation';

interface RankingTableProps {
  data: Awaited<ReturnType<typeof getRanking>>['data'];
}

export default function RankingTable({ data }: RankingTableProps) {
  const tRanking = useRankingTranslation();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">{tRanking('table.rank')}</TableHead>
          <TableHead>{tRanking('table.player')}</TableHead>
          <TableHead>{tRanking('table.time')}</TableHead>
          <TableHead>{tRanking('table.score')}</TableHead>
          <TableHead>{tRanking('table.date')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.rank}</TableCell>
            <TableCell>{row.username}</TableCell>
            <TableCell>{(row.clear_time_ms / 1000).toFixed(2)}s</TableCell>
            <TableCell>{row.score}</TableCell>
            <TableCell>{new Date(row.played_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
