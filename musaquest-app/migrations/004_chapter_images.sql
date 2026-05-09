-- Migration 004: per-chapter hero images
-- Run in Supabase SQL Editor. Idempotent.
--
-- Points each chapter row at the matching file in public/chapters/.
-- Where a real per-chapter image isn't ready yet, several chapters share
-- the same placeholder image (the "warm desert sunset" reference) so the
-- chapter pages and the home Continue Reading card still show artwork.
--
-- Files referenced live in musaquest-app/public/chapters/ and ship with
-- the repo, so the URLs are root-relative ("/chapters/...") — no Supabase
-- Storage upload required.

UPDATE public.chapters SET hero_image_url = '/chapters/chapter-1.png'  WHERE id = 1;
UPDATE public.chapters SET hero_image_url = '/chapters/chapter-2.png'  WHERE id = 2;

-- Chapters 3-7 share the warm-desert placeholder for now
UPDATE public.chapters SET hero_image_url = '/chapters/chapter-3.png'  WHERE id IN (3, 4, 5, 6, 7);

UPDATE public.chapters SET hero_image_url = '/chapters/chapter-8.png'  WHERE id = 8;
UPDATE public.chapters SET hero_image_url = '/chapters/chapter-9.png'  WHERE id = 9;
UPDATE public.chapters SET hero_image_url = '/chapters/chapter-10.png' WHERE id = 10;

-- Chapters 11-12 share the same image for now
UPDATE public.chapters SET hero_image_url = '/chapters/chapter-11.png' WHERE id IN (11, 12);

-- Sanity: should return 12 rows, all with a /chapters/ path
SELECT id, number, title, hero_image_url FROM public.chapters ORDER BY number;
