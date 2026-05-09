import { createClient } from "./server";

/**
 * The seeded "demo" user. Anyone not signed in reads against this id so the
 * home page and chapters render with populated example state instead of
 * a blank slate. Server actions that write must NOT use this id — they
 * require a real authenticated user.
 */
export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

const ADMIN_EMAIL = 'atif@calderpier.com';

/**
 * Returns the authenticated user from the current request's cookies, or null
 * if there isn't one. Use this in server components / server actions.
 */
export async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Convenience helper for read paths: returns the real user when signed in,
 * and falls back to the demo user when not. Always safe for SELECT queries
 * (RLS lets anyone read the demo rows).
 */
export async function getReadUserId(): Promise<{ userId: string; isAuthenticated: boolean; email?: string }> {
  const user = await getAuthUser();
  if (user) {
    return { userId: user.id, isAuthenticated: true, email: user.email ?? undefined };
  }
  return { userId: DEMO_USER_ID, isAuthenticated: false };
}

export function isAdminEmail(email?: string | null) {
  return email === ADMIN_EMAIL;
}
