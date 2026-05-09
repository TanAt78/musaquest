'use server'

import { createClient } from '@/utils/supabase/server'
import { getAuthUser } from '@/utils/supabase/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveReflection(chapterId: number, reflectionText: string) {
  const user = await getAuthUser();
  if (!user) {
    return { ok: false as const, error: 'auth-required' };
  }

  const text = (reflectionText ?? '').trim();
  if (!text) return { ok: false as const, error: 'empty' };
  if (text.length > 2000) return { ok: false as const, error: 'too-long' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: user.id,
        chapter_id: chapterId,
        reflection_text: text,
      },
      { onConflict: 'user_id, chapter_id' }
    );

  if (error) {
    console.error('Error saving reflection:', error);
    return { ok: false as const, error: error.message };
  }

  revalidatePath(`/chapter/${chapterId}`);
  return { ok: true as const };
}

export async function markChapterComplete(chapterId: number, _formData?: FormData) {
  const user = await getAuthUser();
  if (!user) {
    // Visitor not signed in — bounce to login with a hint
    return redirect(`/login?message=Sign in to save your progress and earn XP.&next=/chapter/${chapterId}`);
  }

  const supabase = await createClient();

  // 1. Mark progress as 100%
  const { error: progressError } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: user.id,
        chapter_id: chapterId,
        percent_read: 100,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id, chapter_id' }
    );

  if (progressError) {
    console.error('Error updating progress:', progressError);
    throw new Error('Failed to update progress');
  }

  // 2. XP reward
  const { data: chapter } = await supabase
    .from('chapters')
    .select('xp_reward')
    .eq('id', chapterId)
    .single();

  const xpReward = chapter?.xp_reward || 100;

  const { data: stats } = await supabase
    .from('user_stats')
    .select('total_xp')
    .eq('user_id', user.id)
    .single();

  const currentXp = stats?.total_xp || 0;

  await supabase
    .from('user_stats')
    .update({ total_xp: currentXp + xpReward })
    .eq('user_id', user.id);

  revalidatePath('/');
  revalidatePath('/profile');
  revalidatePath('/stories');
  revalidatePath(`/chapter/${chapterId}`);

  redirect('/');
}
