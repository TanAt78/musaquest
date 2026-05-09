'use server'

import { createClient } from '@/utils/supabase/server'
import { isAdminEmail } from '@/utils/supabase/auth'
import { redirect } from 'next/navigation'

function safeNext(next: string | null | undefined) {
  // Only allow internal redirects, never to an external host
  if (!next || !next.startsWith('/') || next.startsWith('//')) return null;
  return next;
}

export async function login(formData: FormData) {
  const email = (formData.get('email') as string ?? '').trim();
  const password = formData.get('password') as string;
  const next = safeNext(formData.get('next') as string | null);
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return redirect('/login?message=Could not authenticate user');
  }

  // Admin email goes straight to /admin; everyone else goes to `next` or home.
  if (isAdminEmail(email)) {
    return redirect('/admin');
  }
  return redirect(next ?? '/');
}

export async function signup(formData: FormData) {
  const email = (formData.get('email') as string ?? '').trim();
  const password = formData.get('password') as string;
  const next = safeNext(formData.get('next') as string | null);

  if (!email) {
    return redirect('/login?mode=signup&message=Email is required.');
  }
  if (!password || password.length < 8) {
    return redirect('/login?mode=signup&message=Password must be at least 8 characters.');
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // After email confirmation, Supabase sends users back here.
      emailRedirectTo: undefined, // uses Site URL configured in Supabase dashboard
    },
  });

  if (error) {
    return redirect(`/login?mode=signup&message=${encodeURIComponent(error.message)}`);
  }

  // If email confirmation is OFF in Supabase, the user is signed in already
  // and we land them where they were headed. If confirmation is ON, signUp
  // returns success without a session — show a "check your inbox" message.
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    return redirect(next ?? '/');
  }

  return redirect('/login?message=Account created. Check your inbox to confirm your email, then sign in.');
}
