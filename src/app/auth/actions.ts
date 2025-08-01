'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
  (await cookies()).set('session', '', { expires: new Date(0) });
  redirect('/');
}

export async function loginOrRegister(username: string, password?: string) {
  if (!username || username.trim().length === 0) {
    return { error: 'Username is required.' };
  }

  if (username.length < 3 || username.length > 20) {
    return { error: 'Username must be between 3 and 20 characters.' };
  }

  try {
    const supabase = await createClient();

    const { data: user, error: findError } = await supabase.from('users').select('*').eq('username', username).single();

    if (findError && findError.code !== 'PGRST116') {
      console.error('Error finding user:', findError);
      return { error: 'Database connection failed. Please try again.' };
    }

    if (user) {
      if (!password) {
        return { error: 'Password is required for existing users.' };
      }
      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters long.' };
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return { error: 'Invalid username or password.' };
      }
      await login({ id: user.id, username: user.username });
      return { user };
    } else {
      if (!password) {
        return { error: 'Password is required to create a new user.' };
      }
      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters long.' };
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ username, password: hashedPassword }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        if (createError.code === '23505') {
          return { error: 'Username already exists. Please choose a different username.' };
        }
        return { error: 'Failed to create account. Please try again.' };
      }
      await login({ id: newUser.id, username: newUser.username });
      return { user: newUser };
    }
  } catch (error) {
    console.error('Unexpected error in loginOrRegister:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function saveGameRecord(
  userId: number,
  record: Omit<Database['public']['Tables']['game_records']['Insert'], 'user_id'>,
) {
  if (!userId || userId <= 0) {
    return { error: 'Invalid user ID.' };
  }

  if (!record.difficulty || !['beginner', 'intermediate', 'expert'].includes(record.difficulty)) {
    return { error: 'Invalid difficulty level.' };
  }

  if (typeof record.win !== 'boolean') {
    return { error: 'Invalid game result.' };
  }

  if (typeof record.clear_time_ms !== 'number' || record.clear_time_ms < 0) {
    return { error: 'Invalid clear time.' };
  }

  if (typeof record.score !== 'number' || record.score < 0) {
    return { error: 'Invalid score.' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('game_records').insert([{ ...record, user_id: userId }]);

    if (error) {
      console.error('Error saving game record:', error);
      return { error: 'Failed to save game record. Please try again.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in saveGameRecord:', error);
    return { error: 'An unexpected error occurred while saving. Please try again.' };
  }
}
