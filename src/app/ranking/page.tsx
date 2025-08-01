// src/app/ranking/page.tsx
import { Suspense } from 'react';
import { getSession } from '@/lib/session';
import { getRanking } from '@/app/ranking/actions';
import DifficultyFilter from '@/components/ranking/DifficultyFilter';
import RankingTable from '@/components/ranking/RankingTable';
import UserStats from '@/components/ranking/UserStats';
import { Difficulty } from '@/types';

interface RankingPageProps {
  searchParams: Promise<{
    difficulty?: Difficulty;
  }>;
}

export default async function RankingPage({ searchParams }: RankingPageProps) {
  const session = await getSession();
  const difficulty = (await searchParams).difficulty || 'beginner';

  const { data: rankingData } = await getRanking(difficulty);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Ranking</h1>

      <DifficultyFilter />

      {session && (
        <Suspense fallback={<p>Loading your stats...</p>}>
          <UserStats userId={session.id} difficulty={difficulty} />
        </Suspense>
      )}

      <Suspense fallback={<p>Loading ranking...</p>}>
        <RankingTable data={rankingData} />
      </Suspense>
    </div>
  );
}
