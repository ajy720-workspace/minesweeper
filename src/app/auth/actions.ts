'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerTranslations } from '@/lib/server-translations';

export async function logout() {
  (await cookies()).set('session', '', { expires: new Date(0) });
  redirect('/');
}

export async function loginOrRegister(username: string, password?: string) {
  const { auth } = await getServerTranslations();

  if (!username || username.trim().length === 0) {
    return { error: auth.errors.usernameRequired };
  }

  if (username.length < 3 || username.length > 20) {
    return { error: auth.errors.usernameLength };
  }

  try {
    const supabase = await createClient();

    const { data: user, error: findError } = await supabase.from('users').select('*').eq('username', username).single();

    if (findError && findError.code !== 'PGRST116') {
      console.error('Error finding user:', findError);
      return { error: auth.errors.networkError };
    }

    if (user) {
      if (!password) {
        return { error: auth.errors.existingUser };
      }
      if (password.length < 6) {
        return { error: auth.errors.passwordLength };
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return { error: auth.errors.invalidCredentials };
      }
      await login({ id: user.id, username: user.username });
      return { user };
    } else {
      if (!password) {
        return { error: auth.errors.newUserPassword };
      }
      if (password.length < 6) {
        return { error: auth.errors.passwordLength };
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
          return { error: auth.errors.usernameTaken };
        }
        return { error: auth.errors.createAccountFailed };
      }
      await login({ id: newUser.id, username: newUser.username });
      return { user: newUser };
    }
  } catch (error) {
    console.error('Unexpected error in loginOrRegister:', error);
    return { error: auth.errors.unexpectedError };
  }
}

export async function saveGameRecord(
  userId: number,
  record: Omit<Database['public']['Tables']['game_records']['Insert'], 'user_id'>,
) {
  const { auth } = await getServerTranslations();

  if (!userId || userId <= 0) {
    return { error: auth.errors.userAuthError };
  }

  if (!record.difficulty || !['beginner', 'intermediate', 'expert'].includes(record.difficulty)) {
    return { error: auth.errors.invalidDifficulty };
  }

  if (typeof record.win !== 'boolean') {
    return { error: auth.errors.invalidGameResult };
  }

  if (typeof record.clear_time_ms !== 'number' || record.clear_time_ms < 0) {
    return { error: auth.errors.invalidTime };
  }

  if (typeof record.score !== 'number' || record.score < 0) {
    return { error: auth.errors.invalidScore };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('game_records').insert([{ ...record, user_id: userId }]);

    if (error) {
      console.error('Error saving game record:', error);
      return { error: auth.errors.saveRecordFailed };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in saveGameRecord:', error);
    return { error: auth.errors.saveError };
  }
}
