'use server';

import { createClient } from '@/lib/supabase/server';

type GameRecord = {
  id: number;
  difficulty: string;
  win: boolean;
  clear_time_ms: number;
  score: number;
  played_at: string;
};

type ProfileData = {
  gameHistory: GameRecord[];
  totalGames: number;
  winRate: number;
  totalWins: number;
};

export async function getUserProfile(
  userId: number,
  difficulty: string,
): Promise<{ data: ProfileData | null; error: string | null }> {
  const supabase = await createClient();

  try {
    // Get user's game history for the specific difficulty
    const { data: gameHistory, error: historyError } = await supabase
      .from('game_records')
      .select('id, difficulty, win, clear_time_ms, score, played_at')
      .eq('user_id', userId)
      .eq('difficulty', difficulty)
      .order('played_at', { ascending: false })
      .limit(50); // Limit to recent 50 games

    if (historyError) {
      console.error('Error fetching game history:', historyError);
      return { error: 'Database error while fetching game history.', data: null };
    }

    // Calculate statistics
    const totalGames = gameHistory?.length || 0;
    const totalWins = gameHistory?.filter((game) => game.win).length || 0;
    const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;

    const profileData: ProfileData = {
      gameHistory: gameHistory || [],
      totalGames,
      winRate,
      totalWins,
    };

    return { data: profileData, error: null };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return { error: 'Failed to fetch profile data.', data: null };
  }
}

type DifficultyStats = {
  totalGames: number;
  wins: number;
  bestTime: number | null;
  totalScore: number;
};

export async function getUserOverallStats(
  userId: number,
): Promise<{ data: Record<string, DifficultyStats> | null; error: string | null }> {
  const supabase = await createClient();

  try {
    // Get overall statistics across all difficulties
    const { data: overallStats, error } = await supabase
      .from('game_records')
      .select('difficulty, win, clear_time_ms, score')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching overall stats:', error);
      return { error: 'Database error while fetching overall statistics.', data: null };
    }

    // Group by difficulty and calculate stats
    const statsByDifficulty = (overallStats || []).reduce((acc: Record<string, DifficultyStats>, record) => {
      if (!acc[record.difficulty]) {
        acc[record.difficulty] = {
          totalGames: 0,
          wins: 0,
          bestTime: null,
          totalScore: 0,
        };
      }

      acc[record.difficulty].totalGames++;
      if (record.win) {
        acc[record.difficulty].wins++;
        acc[record.difficulty].totalScore += record.score;

        if (!acc[record.difficulty].bestTime || record.clear_time_ms < acc[record.difficulty].bestTime!) {
          acc[record.difficulty].bestTime = record.clear_time_ms;
        }
      }

      return acc;
    }, {});

    return { data: statsByDifficulty, error: null };
  } catch (error) {
    console.error('Error in getUserOverallStats:', error);
    return { error: 'Failed to fetch overall statistics.', data: null };
  }
}
