-- Migration 003: auth integration
-- Run in Supabase SQL Editor. Idempotent.
--
-- 1. A trigger that auto-creates `public.users` + `public.user_stats` rows
--    whenever an `auth.users` row is created — so every new sign-up has a
--    profile and a starting stats row without needing application code.
-- 2. Row-level security on user_progress, user_stats, and public.users so
--    each user can only read/write their own data, with one exception:
--    everyone can SELECT the demo user's rows so unauthenticated visitors
--    still see populated example state on the home page.
--
-- Demo user id is the zero-UUID '00000000-0000-0000-0000-000000000000',
-- which is already seeded in supabase_schema.sql.

-- ───────────────────────────────────────────────────────────────────────────
-- 1. Trigger: auto-provision profile + stats on new auth.users
-- ───────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, parent_email, child_name, child_age)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NULL
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ───────────────────────────────────────────────────────────────────────────
-- 2. RLS — demo user readable by all, real users read/write only their own
-- ───────────────────────────────────────────────────────────────────────────

ALTER TABLE public.users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats     ENABLE ROW LEVEL SECURITY;

-- public.users
DROP POLICY IF EXISTS "users_select_self_or_demo" ON public.users;
CREATE POLICY "users_select_self_or_demo" ON public.users
  FOR SELECT
  USING (
    auth.uid() = id
    OR id = '00000000-0000-0000-0000-000000000000'::uuid
  );

DROP POLICY IF EXISTS "users_insert_self" ON public.users;
CREATE POLICY "users_insert_self" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_self" ON public.users;
CREATE POLICY "users_update_self" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- public.user_progress
DROP POLICY IF EXISTS "user_progress_select_self_or_demo" ON public.user_progress;
CREATE POLICY "user_progress_select_self_or_demo" ON public.user_progress
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id = '00000000-0000-0000-0000-000000000000'::uuid
  );

DROP POLICY IF EXISTS "user_progress_insert_self" ON public.user_progress;
CREATE POLICY "user_progress_insert_self" ON public.user_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_progress_update_self" ON public.user_progress;
CREATE POLICY "user_progress_update_self" ON public.user_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_progress_delete_self" ON public.user_progress;
CREATE POLICY "user_progress_delete_self" ON public.user_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- public.user_stats
DROP POLICY IF EXISTS "user_stats_select_self_or_demo" ON public.user_stats;
CREATE POLICY "user_stats_select_self_or_demo" ON public.user_stats
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id = '00000000-0000-0000-0000-000000000000'::uuid
  );

DROP POLICY IF EXISTS "user_stats_insert_self" ON public.user_stats;
CREATE POLICY "user_stats_insert_self" ON public.user_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_stats_update_self" ON public.user_stats;
CREATE POLICY "user_stats_update_self" ON public.user_stats
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
