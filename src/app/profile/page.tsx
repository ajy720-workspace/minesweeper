// src/app/profile/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getUserProfile, getUserOverallStats } from './actions';
import { getUserRankingStats } from '@/app/ranking/actions';
import { ProfilePageContent } from '@/components/profile/ProfilePageContent';
import { Difficulty } from '@/types';

interface ProfilePageProps {
  searchParams: Promise<{
    difficulty?: Difficulty;
  }>;
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  const difficulty = (await searchParams).difficulty || 'beginner';

  const [profileResult, rankingResult, overallResult] = await Promise.all([
    getUserProfile(session.id, difficulty),
    getUserRankingStats(session.id, difficulty),
    getUserOverallStats(session.id),
  ]);

  const { data: profileData } = profileResult;
  const { data: rankingStats } = rankingResult;
  const { data: overallStats } = overallResult;

  return (
    <ProfilePageContent
      session={session}
      difficulty={difficulty}
      profileData={profileData}
      rankingStats={rankingStats}
      overallStats={overallStats}
    />
  );
}
