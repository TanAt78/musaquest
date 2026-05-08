-- MusaQuest Supabase Schema & Seed Data

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_email text NOT NULL UNIQUE,
  child_name text NOT NULL,
  child_age integer,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.chapters (
  id integer PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  number integer NOT NULL,
  title text NOT NULL,
  subtitle text,
  body_md text,
  arabic_verse text,
  arabic_transliteration text,
  arabic_translation text,
  surah text,
  verse_number integer,
  hero_image_url text,
  audio_url text,
  xp_reward integer DEFAULT 100,
  is_published boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  chapter_id integer REFERENCES public.chapters(id) ON DELETE CASCADE,
  percent_read integer DEFAULT 0,
  completed_at timestamp with time zone,
  reflection_text text,
  PRIMARY KEY (user_id, chapter_id)
);

CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  total_xp integer DEFAULT 0,
  current_level integer DEFAULT 1,
  current_rank text DEFAULT 'The Seeker',
  current_streak_days integer DEFAULT 0,
  longest_streak_days integer DEFAULT 0,
  last_active_date date DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS public.badges (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  icon_name text,
  criteria_json jsonb
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id text REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at timestamp with time zone DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, badge_id)
);


-- 2. Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Chapters & Badges are readable by everyone
CREATE POLICY "Chapters are viewable by everyone" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Badges are viewable by everyone" ON public.badges FOR SELECT USING (true);

-- Users can only read and update their own data.
-- (For this prototype, we're assuming anon key usage where we might just pass user_id manually if auth isn't fully set up,
-- but normally auth.uid() is used. If we don't have Supabase Auth fully implemented yet, we might want to disable RLS or allow anon inserts for the prototype demo)
-- TO KEEP PROTOTYPE SIMPLE while matching requirements: we will allow all operations but filter by user_id in the app.
-- In production, replace `true` with `auth.uid() = user_id`.
CREATE POLICY "Users can manage their own data" ON public.users FOR ALL USING (true);
CREATE POLICY "Users can manage their own progress" ON public.user_progress FOR ALL USING (true);
CREATE POLICY "Users can manage their own stats" ON public.user_stats FOR ALL USING (true);
CREATE POLICY "Users can manage their own badges" ON public.user_badges FOR ALL USING (true);


-- 3. Seed Data
INSERT INTO public.chapters (id, slug, number, title, subtitle, body_md, arabic_verse, arabic_transliteration, arabic_translation, surah, verse_number, hero_image_url, xp_reward, is_published)
VALUES 
(1, 'the-river-cradle', 1, 'The River Cradle', 'A baby placed in a basket, set adrift on the Nile, and the queen who finds him.', 'Content for chapter 1...', '', '', '', 'Al-Qasas', 7, '', 150, true),
(2, 'the-palace-walls', 2, 'The Palace Walls', 'Growing up between two worlds, Musa begins to ask hard questions.', 'Content for chapter 2...', '', '', '', 'Al-Qasas', 14, '', 150, true),
(3, 'the-journey-to-midian', 3, 'The Journey to Midian', 'A story about courage when there is nowhere left to go, and the small kindnesses that change everything.', 'After everything that had happened, Musa knew he could not stay in Egypt any longer. Quietly, before the sun rose, he wrapped his cloak around his shoulders and walked out into the sleeping streets.

The desert lay beyond the city, vast and golden in the morning light. Musa walked, and walked, and walked. He had no map. He had no friends. He had only the prayer in his heart:

Days passed. The sun was hot. His feet ached. But Musa kept going, because sometimes the bravest thing is just to keep walking.

At last, he saw it: a small green oasis in the distance. A well with cool, clear water. People had gathered there to water their animals, the noise of bleating sheep and laughing children carrying across the warm air.

Musa rested under the shade of a tree, tired but safe. And then he noticed something. Two young women were standing back from the well, holding their sheep close, waiting their turn while the strong men pushed ahead. They looked patient. They looked tired. They had been waiting a long time.

Musa stood up.

He didn''t say much. He simply walked to the well, drew the water, and helped them. It was a small kindness in a tired moment. But that kindness was about to change his whole life.', 'رَبِّ نَجِّنِى مِنَ ٱلْقَوْمِ ٱلظَّـٰلِمِينَ', 'Rabbi najjini mina al-qawmi az-zalimeen', 'O my Lord, save me from the wrong-doing people.', 'Al-Qasas', 21, 'https://lh3.googleusercontent.com/aida-public/AB6AXuANTa9AT5a8m_64Fz_SPJIHhW_nZbxKj3AXaNFoVe_bpN_mHLrKclOjt0yusSrox-o467DqdRhE23u3DwaLT_kHl6mN3KOUH_EufO1Q3vO3NQRKq5_z-0q3KtE9Z6DY4k3VCJxM3Dy-YY3BS3uLM2_pX3W1u0zdaUE9Abp0SBMA2Hy2okVBkbjQ-G7Tgqix2kl5KPOC6eAYSOzScbT8oABCsKXVfqG_HQozTuEwR5nrva1P6OUsebPhvs3iG9Q25DEiE0VExJrW6XY', 150, true)
ON CONFLICT (id) DO NOTHING;

-- Create a dummy test user for the prototype
INSERT INTO public.users (id, parent_email, child_name, child_age)
VALUES ('00000000-0000-0000-0000-000000000000', 'parent@example.com', 'Musa', 10)
ON CONFLICT (parent_email) DO NOTHING;

-- Insert initial stats for the test user
INSERT INTO public.user_stats (user_id, total_xp, current_level, current_rank, current_streak_days, longest_streak_days)
VALUES ('00000000-0000-0000-0000-000000000000', 2450, 12, 'The Traveler', 5, 12)
ON CONFLICT (user_id) DO NOTHING;

-- Insert progress for the test user (Chapters 1 and 2 completed)
INSERT INTO public.user_progress (user_id, chapter_id, percent_read, completed_at)
VALUES 
('00000000-0000-0000-0000-000000000000', 1, 100, now()),
('00000000-0000-0000-0000-000000000000', 2, 100, now())
ON CONFLICT (user_id, chapter_id) DO NOTHING;
