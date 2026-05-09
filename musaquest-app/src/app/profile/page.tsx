import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getReadUserId } from "@/utils/supabase/auth";

export default async function Profile() {
  const supabase = await createClient();
  const { userId, isAuthenticated, email } = await getReadUserId();

  const [{ data: stats }, { count: chaptersCompleted }] = await Promise.all([
    supabase.from('user_stats').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('percent_read', 100),
  ]);

  const rank = stats?.current_rank || 'The Seeker';
  const level = stats?.current_level || 1;
  const totalXp = stats?.total_xp || 0;
  const rankMaxXp = 3000; // Hardcoded for 'The Traveler' prototype logic
  const xpUntilNext = Math.max(0, rankMaxXp - totalXp);
  const progressPercent = Math.min(100, Math.round((totalXp / rankMaxXp) * 100));

  return (
    <main className="max-w-container-max mx-auto px-md py-lg flex flex-col gap-xl">

      {/* Account strip */}
      <section className="bg-surface-container/50 border border-surface-variant rounded-xl px-lg py-md flex flex-col sm:flex-row items-center justify-between gap-sm text-center sm:text-left">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary-container text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Signed in as</p>
                <p className="font-body-lg text-primary font-bold">{email}</p>
              </div>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1 px-md py-sm rounded-full border border-surface-variant hover:border-primary"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span> Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-[28px]">person_outline</span>
              <p className="font-body-md text-on-surface-variant">
                You're viewing the demo profile. <span className="text-primary font-bold">Sign in</span> to save your own progress.
              </p>
            </div>
            <div className="flex gap-sm">
              <Link
                href="/login?mode=signup&next=/profile"
                className="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-lg py-sm rounded-full hover:bg-primary transition-colors whitespace-nowrap"
              >
                Sign up
              </Link>
              <Link
                href="/login?next=/profile"
                className="text-primary font-label-caps text-label-caps px-md py-sm hover:text-primary-container transition-colors whitespace-nowrap"
              >
                Sign in
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Hero rank */}
      <section className="bg-surface-container rounded-xl p-lg md:p-xl relative overflow-hidden flex flex-col items-center gap-md border-2 border-secondary-fixed shadow-[0_8px_30px_rgba(15,76,92,0.04)]">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary-fixed opacity-40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-fixed-dim opacity-20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary-container flex items-center justify-center relative shrink-0 z-10 shadow-[0_10px_25px_rgba(15,76,92,0.15)] border-4 border-surface">
          <span className="material-symbols-outlined text-[64px] md:text-[80px] text-secondary-container drop-shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>landscape</span>
        </div>

        <div className="text-center z-10">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-[0.1em]">Current Rank</p>
          <h1 className="font-display-lg text-display-lg text-primary mb-md">{rank}</h1>
          <div className="flex items-center justify-center gap-lg mb-md">
            <div className="text-center">
              <p className="font-display-lg text-[32px] text-primary font-bold leading-none mb-1">{level}</p>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Level</p>
            </div>
            <div className="w-px h-12 bg-surface-variant"></div>
            <div className="text-center">
              <p className="font-display-lg text-[32px] text-primary font-bold leading-none mb-1">{totalXp.toLocaleString()}</p>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total XP</p>
            </div>
            <div className="w-px h-12 bg-surface-variant"></div>
            <div className="text-center">
              <p className="font-display-lg text-[32px] text-primary font-bold leading-none mb-1">{chaptersCompleted || 0}</p>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Chapters</p>
            </div>
          </div>
          <div className="w-full max-w-[400px] mx-auto mt-6">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="font-label-caps text-label-caps text-primary font-bold">Progress to Wanderer</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">{totalXp.toLocaleString()} / {rankMaxXp.toLocaleString()}</span>
            </div>
            <div className="h-5 w-full bg-surface-variant rounded-full overflow-hidden p-[2px]">
              <div className="h-full bg-tertiary-container rounded-full relative overflow-hidden" style={{ width: `${progressPercent}%` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full transform -translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant mt-sm">Only {xpUntilNext.toLocaleString()} XP until the next milestone.</p>
          </div>
        </div>
      </section>

      {/* Rank Ladder */}
      <section className="flex flex-col gap-md">
        <h2 className="font-headline-md text-[28px] text-primary flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
          The Path of Ranks
        </h2>

        <div className="bg-surface-container rounded-xl p-lg flex flex-col gap-md border border-surface-variant">

          {/* Rank: Seeker (completed) */}
          <div className="flex items-center gap-md p-md rounded-lg bg-surface border border-tertiary-container/30 opacity-80">
            <div className="w-14 h-14 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-headline-md text-[20px] text-primary font-bold">The Seeker</p>
                <span className="font-label-caps text-label-caps text-tertiary-container bg-tertiary-container/10 px-2 py-0.5 rounded-full">Achieved</span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant">Levels 1-5. The first steps of curiosity.</p>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant">0-500 XP</span>
          </div>

          {/* Rank: Scholar (completed) */}
          <div className="flex items-center gap-md p-md rounded-lg bg-surface border border-tertiary-container/30 opacity-80">
            <div className="w-14 h-14 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-headline-md text-[20px] text-primary font-bold">The Scholar of Light</p>
                <span className="font-label-caps text-label-caps text-tertiary-container bg-tertiary-container/10 px-2 py-0.5 rounded-full">Achieved</span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant">Levels 6-10. Learning grows steady and bright.</p>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant">500-2,000 XP</span>
          </div>

          {/* Rank: Traveler (current) */}
          <div className="flex items-center gap-md p-md rounded-lg bg-secondary-fixed/30 border-2 border-secondary-container shadow-[0_4px_20px_rgba(253,189,111,0.2)]">
            <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>landscape</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-headline-md text-[20px] text-primary font-bold">The Traveler</p>
                <span className="font-label-caps text-label-caps text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded-full">Current</span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant">Levels 11-15. Walking through new lands and stories.</p>
            </div>
            <span className="font-label-caps text-label-caps text-secondary font-bold">2,000-3,000 XP</span>
          </div>

          {/* Rank: Wanderer (locked) */}
          <div className="flex items-center gap-md p-md rounded-lg bg-surface border border-surface-variant opacity-50">
            <div className="w-14 h-14 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">lock</span>
            </div>
            <div className="flex-1">
              <p className="font-headline-md text-[20px] text-primary font-bold">The Wanderer</p>
              <p className="font-body-md text-sm text-on-surface-variant">Levels 16-20. The path becomes wider, the mountains taller.</p>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant">3,000-5,000 XP</span>
          </div>

          {/* Rank: Sage (locked) */}
          <div className="flex items-center gap-md p-md rounded-lg bg-surface border border-surface-variant opacity-50">
            <div className="w-14 h-14 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">lock</span>
            </div>
            <div className="flex-1">
              <p className="font-headline-md text-[20px] text-primary font-bold">The Sage</p>
              <p className="font-body-md text-sm text-on-surface-variant">Levels 21-25. Wisdom is shared, not just earned.</p>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant">5,000-8,000 XP</span>
          </div>

          {/* Rank: Pilgrim (locked) */}
          <div className="flex items-center gap-md p-md rounded-lg bg-surface border border-surface-variant opacity-50">
            <div className="w-14 h-14 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">lock</span>
            </div>
            <div className="flex-1">
              <p className="font-headline-md text-[20px] text-primary font-bold">The Pilgrim</p>
              <p className="font-body-md text-sm text-on-surface-variant">Levels 26+. The final ascent. Knowledge becomes light.</p>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant">8,000+ XP</span>
          </div>

        </div>
      </section>

      {/* Recent Activity & Badges Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">

        <section className="lg:col-span-7 flex flex-col gap-md">
          <h2 className="font-headline-md text-[24px] text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
            Recent Journey
          </h2>
          <div className="bg-surface-container rounded-xl p-md flex flex-col gap-sm border border-surface-variant">

            <div className="flex items-center gap-md p-sm rounded-lg hover:bg-surface transition-colors">
              <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-tertiary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <div className="flex-1">
                <p className="font-body-lg text-body-lg text-on-surface font-bold">Completed: Reflect on Patience</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant">Today, 9:14 AM</p>
              </div>
              <span className="font-label-caps text-label-caps text-secondary font-bold">+30 XP</span>
            </div>

            <div className="flex items-center gap-md p-sm rounded-lg hover:bg-surface transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary-container text-[20px]">menu_book</span>
              </div>
              <div className="flex-1">
                <p className="font-body-lg text-body-lg text-on-surface font-bold">Started: The Journey to Midian</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant">Yesterday, 7:30 PM</p>
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant">+10 XP</span>
            </div>

            <div className="flex items-center gap-md p-sm rounded-lg hover:bg-surface transition-colors">
              <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-tertiary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
              </div>
              <div className="flex-1">
                <p className="font-body-lg text-body-lg text-on-surface font-bold">Earned badge: Two Chapters Complete</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant">2 days ago</p>
              </div>
              <span className="font-label-caps text-label-caps text-secondary font-bold">+200 XP</span>
            </div>

            <div className="flex items-center gap-md p-sm rounded-lg hover:bg-surface transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <div className="flex-1">
                <p className="font-body-lg text-body-lg text-on-surface font-bold">Finished Chapter 2: The Palace Walls</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant">2 days ago</p>
              </div>
              <span className="font-label-caps text-label-caps text-secondary font-bold">+150 XP</span>
            </div>

            <div className="flex items-center gap-md p-sm rounded-lg hover:bg-surface transition-colors">
              <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-tertiary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              </div>
              <div className="flex-1">
                <p className="font-body-lg text-body-lg text-on-surface font-bold">Reached Level 12</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant">3 days ago</p>
              </div>
              <span className="font-label-caps text-label-caps text-secondary font-bold">Milestone</span>
            </div>

          </div>
        </section>

        <section className="lg:col-span-5 flex flex-col gap-md">
          <h2 className="font-headline-md text-[24px] text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
            Badges Earned
          </h2>
          <div className="grid grid-cols-3 gap-sm">

            <div className="aspect-square bg-surface-container rounded-xl flex flex-col items-center justify-center p-sm border-2 border-tertiary-container/30 hover:scale-105 transition-transform cursor-pointer">
              <span className="material-symbols-outlined text-tertiary-container text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
              <p className="font-label-caps text-label-caps text-primary font-bold mt-1 text-center">First Steps</p>
            </div>

            <div className="aspect-square bg-surface-container rounded-xl flex flex-col items-center justify-center p-sm border-2 border-tertiary-container/30 hover:scale-105 transition-transform cursor-pointer">
              <span className="material-symbols-outlined text-tertiary-container text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <p className="font-label-caps text-label-caps text-primary font-bold mt-1 text-center">3 Day Streak</p>
            </div>

            <div className="aspect-square bg-surface-container rounded-xl flex flex-col items-center justify-center p-sm border-2 border-tertiary-container/30 hover:scale-105 transition-transform cursor-pointer">
              <span className="material-symbols-outlined text-tertiary-container text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
              <p className="font-label-caps text-label-caps text-primary font-bold mt-1 text-center">Two Chapters</p>
            </div>

            <div className="aspect-square bg-surface border-2 border-dashed border-surface-variant rounded-xl flex flex-col items-center justify-center p-sm opacity-50">
              <span className="material-symbols-outlined text-on-surface-variant text-[40px]">lock</span>
              <p className="font-label-caps text-label-caps text-on-surface-variant mt-1 text-center">7 Day Streak</p>
            </div>

            <div className="aspect-square bg-surface border-2 border-dashed border-surface-variant rounded-xl flex flex-col items-center justify-center p-sm opacity-50">
              <span className="material-symbols-outlined text-on-surface-variant text-[40px]">lock</span>
              <p className="font-label-caps text-label-caps text-on-surface-variant mt-1 text-center">Five Chapters</p>
            </div>

            <div className="aspect-square bg-surface border-2 border-dashed border-surface-variant rounded-xl flex flex-col items-center justify-center p-sm opacity-50">
              <span className="material-symbols-outlined text-on-surface-variant text-[40px]">lock</span>
              <p className="font-label-caps text-label-caps text-on-surface-variant mt-1 text-center">First Reflection</p>
            </div>

          </div>
        </section>

      </div>

    </main>
  );
}
