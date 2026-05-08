'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateChapter(chapterId: number, formData: FormData) {
  const supabase = await createClient()

  // Verify Admin Session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'atif@calderpier.com') {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const subtitle = formData.get('subtitle') as string
  const hero_image_url = formData.get('hero_image_url') as string
  const body_md = formData.get('body_md') as string
  const arabic_verse = formData.get('arabic_verse') as string
  const arabic_translation = formData.get('arabic_translation') as string
  const arabic_transliteration = formData.get('arabic_transliteration') as string
  const surah = formData.get('surah') as string
  const verse_number = formData.get('verse_number') as string
  const xp_reward = parseInt(formData.get('xp_reward') as string, 10)

  const { error } = await supabase
    .from('chapters')
    .update({
      title,
      subtitle,
      hero_image_url,
      body_md,
      arabic_verse,
      arabic_translation,
      arabic_transliteration,
      surah,
      verse_number: verse_number ? parseInt(verse_number, 10) : null,
      xp_reward: isNaN(xp_reward) ? 150 : xp_reward
    })
    .eq('id', chapterId)

  if (error) {
    console.error('Error updating chapter:', error)
    throw new Error('Failed to update chapter')
  }

  revalidatePath('/admin')
  revalidatePath(`/chapter/${chapterId}`)
  revalidatePath('/stories')
  
  redirect('/admin')
}
