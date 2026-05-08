'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function markChapterComplete(chapterId: number, formData?: FormData) {
  const supabase = await createClient();
  const userId = '00000000-0000-0000-0000-000000000000'; // Dummy user

  // 1. Mark progress as 100%
  const { error: progressError } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      chapter_id: chapterId,
      percent_read: 100,
      completed_at: new Date().toISOString()
    }, { onConflict: 'user_id, chapter_id' })

  if (progressError) {
    console.error('Error updating progress:', progressError)
    throw new Error('Failed to update progress')
  }

  // 2. Fetch the XP reward for this chapter
  const { data: chapter } = await supabase
    .from('chapters')
    .select('xp_reward')
    .eq('id', chapterId)
    .single()
    
  const xpReward = chapter?.xp_reward || 100

  // 3. Update the user's total XP
  const { data: stats } = await supabase
    .from('user_stats')
    .select('total_xp')
    .eq('user_id', userId)
    .single()

  const currentXp = stats?.total_xp || 0

  await supabase
    .from('user_stats')
    .update({ total_xp: currentXp + xpReward })
    .eq('user_id', userId)

  // Revalidate the pages that show stats and progress
  revalidatePath('/')
  revalidatePath('/profile')
  revalidatePath('/stories')
  
  // Redirect back to home to see the updated stats
  redirect('/')
}
