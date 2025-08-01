'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';
import bcrypt from 'bcryptjs';

export async function loginOrRegister(username: string, password?: string) {
  const supabase = await createClient();

  // Find user by username
  const { data: user, error: findError } = await supabase.from('users').select('*').eq('username', username).single();

  if (findError && findError.code !== 'PGRST116') {
    // PGRST116 is "No rows found"
    console.error('Error finding user:', findError);
    return { error: 'Database error while finding user.' };
  }

  if (user) {
    // User exists, check password
    if (!password) {
      return { error: 'Password is required for existing users.' };
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { error: 'Invalid password.' };
    }
    return { user };
  } else {
    // User does not exist, create new user
    if (!password) {
      return { error: 'Password is required to create a new user.' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{ username, password: hashedPassword }])
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      return { error: 'Database error while creating user.' };
    }
    return { user: newUser };
  }
}

export async function saveGameRecord(
  userId: number,
  record: Omit<Database['public']['Tables']['game_records']['Insert'], 'user_id'>,
) {
  const supabase = await createClient();
  const { error } = await supabase.from('game_records').insert([{ ...record, user_id: userId }]);

  if (error) {
    console.error('Error saving game record:', error);
    return { error: 'Database error while saving game record.' };
  }

  return { success: true };
}
