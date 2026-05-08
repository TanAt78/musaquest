-- Update RLS policies to allow the admin user to update the chapters table.
-- WARNING: This assumes you have already created a user in Supabase Auth 
-- with the email 'atif@calderpier.com'. If you haven't, go to Authentication > Users
-- and invite/create that user first.

-- Enable RLS on the chapters table if not already enabled (it should be)
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- Allow anyone to READ chapters (we did this in the first migration, but just in case)
CREATE POLICY "Enable read access for all users" ON public.chapters
    FOR SELECT USING (true);

-- Allow ONLY the admin email to UPDATE chapters
-- The admin will log in via the /login route, which sets auth.email()
CREATE POLICY "Allow admin to update chapters" ON public.chapters
    FOR UPDATE 
    USING (auth.email() = 'atif@calderpier.com')
    WITH CHECK (auth.email() = 'atif@calderpier.com');

-- (Optional) Allow ONLY the admin email to INSERT chapters
CREATE POLICY "Allow admin to insert chapters" ON public.chapters
    FOR INSERT 
    WITH CHECK (auth.email() = 'atif@calderpier.com');

-- (Optional) Allow ONLY the admin email to DELETE chapters
CREATE POLICY "Allow admin to delete chapters" ON public.chapters
    FOR DELETE 
    USING (auth.email() = 'atif@calderpier.com');
