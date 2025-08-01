'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';

type RankingData = Database['public']['Functions']['get_ranking']['Returns'];
type UserStatsData = Database['public']['Functions']['get_user_ranking_stats']['Returns'][number];

export async function getRanking(difficulty: string): Promise<{ data: RankingData | null; error: string | null }> {
  if (!difficulty || !['beginner', 'intermediate', 'expert'].includes(difficulty)) {
    return { error: 'Invalid difficulty level.', data: null };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_ranking', { p_difficulty: difficulty });

    if (error) {
      console.error('Error fetching ranking:', error);
      return { error: 'Failed to load ranking data. Please try again.', data: null };
    }
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getRanking:', error);
    return { error: 'An unexpected error occurred while loading rankings. Please try again.', data: null };
  }
}

export async function getUserRankingStats(
  userId: number,
  difficulty: string,
): Promise<{ data: UserStatsData | null; error: string | null }> {
  if (!userId || userId <= 0) {
    return { error: 'Invalid user ID.', data: null };
  }

  if (!difficulty || !['beginner', 'intermediate', 'expert'].includes(difficulty)) {
    return { error: 'Invalid difficulty level.', data: null };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_user_ranking_stats', {
      p_user_id: userId,
      p_difficulty: difficulty,
    });

    if (error) {
      console.error('Error fetching user ranking stats:', error);
      return { error: 'Failed to load user statistics. Please try again.', data: null };
    }
    return { data: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Unexpected error in getUserRankingStats:', error);
    return { error: 'An unexpected error occurred while loading user statistics. Please try again.', data: null };
  }
}
