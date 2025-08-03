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
    return { error: '사용자명을 입력해주세요.' };
  }

  if (username.length < 3 || username.length > 20) {
    return { error: '사용자명은 3글자 이상 20글자 이하로 입력해주세요.' };
  }

  try {
    const supabase = await createClient();

    const { data: user, error: findError } = await supabase.from('users').select('*').eq('username', username).single();

    if (findError && findError.code !== 'PGRST116') {
      console.error('Error finding user:', findError);
      return { error: '네트워크 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.' };
    }

    if (user) {
      if (!password) {
        return { error: '기존 사용자입니다. 비밀번호를 입력해주세요.' };
      }
      if (password.length < 6) {
        return { error: '비밀번호는 6글자 이상이어야 합니다.' };
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return { error: '사용자명 또는 비밀번호가 올바르지 않습니다.' };
      }
      await login({ id: user.id, username: user.username });
      return { user };
    } else {
      if (!password) {
        return { error: '새 계정을 만들려면 비밀번호를 입력해주세요.' };
      }
      if (password.length < 6) {
        return { error: '비밀번호는 6글자 이상이어야 합니다.' };
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
          return { error: '이미 사용 중인 사용자명입니다. 다른 이름을 선택해주세요.' };
        }
        return { error: '계정 생성에 실패했습니다. 잠시 후 다시 시도해주세요.' };
      }
      await login({ id: newUser.id, username: newUser.username });
      return { user: newUser };
    }
  } catch (error) {
    console.error('Unexpected error in loginOrRegister:', error);
    return { error: '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' };
  }
}

export async function saveGameRecord(
  userId: number,
  record: Omit<Database['public']['Tables']['game_records']['Insert'], 'user_id'>,
) {
  if (!userId || userId <= 0) {
    return { error: '사용자 인증에 문제가 있습니다. 다시 로그인해주세요.' };
  }

  if (!record.difficulty || !['beginner', 'intermediate', 'expert'].includes(record.difficulty)) {
    return { error: '게임 난이도 정보가 올바르지 않습니다.' };
  }

  if (typeof record.win !== 'boolean') {
    return { error: '게임 결과 정보가 올바르지 않습니다.' };
  }

  if (typeof record.clear_time_ms !== 'number' || record.clear_time_ms < 0) {
    return { error: '게임 시간 정보가 올바르지 않습니다.' };
  }

  if (typeof record.score !== 'number' || record.score < 0) {
    return { error: '점수 정보가 올바르지 않습니다.' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('game_records').insert([{ ...record, user_id: userId }]);

    if (error) {
      console.error('Error saving game record:', error);
      return { error: '게임 기록 저장에 실패했습니다. 네트워크를 확인하고 다시 시도해주세요.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in saveGameRecord:', error);
    return { error: '기록 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' };
  }
}
