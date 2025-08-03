// src/app/ranking/page.tsx
import { getSession } from '@/lib/session';
import { getRanking, getUserRankingStats } from '@/app/ranking/actions';
import { RankingPageContent } from '@/components/ranking/RankingPageContent';
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
  const { data: userStats } = session ? await getUserRankingStats(session.id, difficulty) : { data: null };

  return (
    <RankingPageContent session={session} difficulty={difficulty} rankingData={rankingData} userStats={userStats} />
  );
}
