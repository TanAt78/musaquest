'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = 'atif@calderpier.com'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=Could not authenticate user')
  }

  return redirect('/admin')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (email !== ADMIN_EMAIL) {
    return redirect('/login?mode=signup&message=Sign-up is restricted to the admin account.')
  }
  if (!password || password.length < 8) {
    return redirect('/login?mode=signup&message=Password must be at least 8 characters.')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return redirect(`/login?mode=signup&message=${encodeURIComponent(error.message)}`)
  }

  return redirect('/login?message=Account created. You can now sign in.')
}
