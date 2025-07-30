// src/types/index.ts
export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export const DIFFICULTY_SETTINGS: {
  [key in Difficulty]: { width: number; height: number; mineCount: number };
} = {
  beginner: { width: 9, height: 9, mineCount: 10 },
  intermediate: { width: 16, height: 16, mineCount: 40 },
  expert: { width: 30, height: 16, mineCount: 99 },
};
