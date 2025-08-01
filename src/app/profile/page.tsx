// src/app/profile/page.tsx
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getSession } from '@/lib/session';
import { getUserProfile } from './actions';
import ProfileStats from '@/components/profile/ProfileStats';
import GameHistoryTable from '@/components/profile/GameHistoryTable';
import DifficultyFilter from '@/components/ranking/DifficultyFilter';
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
  const { data: profileData } = await getUserProfile(session.id, difficulty);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome back, {session.username}!</h2>
      </div>

      <DifficultyFilter />

      <Suspense fallback={<p>Loading your statistics...</p>}>
        <ProfileStats userId={session.id} difficulty={difficulty} />
      </Suspense>

      <Suspense fallback={<p>Loading your game history...</p>}>
        <GameHistoryTable data={profileData?.gameHistory || []} difficulty={difficulty} />
      </Suspense>
    </div>
  );
}
