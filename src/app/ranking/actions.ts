'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';

type RankingData = Database['public']['Functions']['get_ranking']['Returns'];
type UserStatsData = Database['public']['Functions']['get_user_ranking_stats']['Returns'][number];

export async function getRanking(difficulty: string): Promise<{ data: RankingData | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_ranking', { p_difficulty: difficulty });

  if (error) {
    console.error('Error fetching ranking:', error);
    return { error: 'Database error while fetching ranking.', data: null };
  }
  return { data, error: null };
}

export async function getUserRankingStats(
  userId: number,
  difficulty: string,
): Promise<{ data: UserStatsData | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_user_ranking_stats', {
    p_user_id: userId,
    p_difficulty: difficulty,
  });

  if (error) {
    console.error('Error fetching user ranking stats:', error);
    return { error: 'Database error while fetching stats.', data: null };
  }
  return { data: data?.[0] || null, error: null };
}
