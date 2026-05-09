import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const userId = '00000000-0000-0000-0000-000000000000'; // Dummy user

  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  const currentStreak = stats?.current_streak_days || 0;
  const bestStreak = stats?.longest_streak_days || 0;
  const rank = stats?.current_rank || 'The Seeker';
  const level = stats?.current_level || 1;
  const totalXp = stats?.total_xp || 0;
  const rankMaxXp = 3000; // Hardcoded for 'The Traveler' prototype logic
  const xpUntilNext = Math.max(0, rankMaxXp - totalXp);
  const progressPercent = Math.min(100, Math.round((totalXp / rankMaxXp) * 100));

  // Fixed historical timeline of Prophet Musa (peace be upon him).
  // Drawn from the Quranic narrative; ordered chronologically.
  const musaTimeline = [
    { label: "Born in Egypt",          icon: "child_friendly" },
    { label: "Cradle on the Nile",     icon: "water" },
    { label: "Raised in the Palace",   icon: "castle" },
    { label: "Flight to Midian",       icon: "directions_walk" },
    { label: "Years with Shu'ayb",     icon: "agriculture" },
    { label: "The Burning Bush",       icon: "local_fire_department" },
    { label: "Confronting Pharaoh",    icon: "shield" },
    { label: "The Magicians Believe",  icon: "auto_fix_high" },
    { label: "Signs Upon Egypt",       icon: "storm" },
    { label: "Parting of the Sea",     icon: "waves" },
    { label: "Mount Sinai & Tablets",  icon: "terrain" },
    { label: "Years in the Wilderness", icon: "landscape" },
  ];

  return (
    <main className="max-w-container-max mx-auto px-md py-lg flex flex-col gap-xl">
      {/* Welcome hero: explains what MusaQuest is for first-time visitors */}
      <section className="text-center flex flex-col items-center gap-sm pt-md">
        <span
          className="material-symbols-outlined text-secondary-container text-[40px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden="true"
        >
          auto_stories
        </span>
        <h1 className="font-display-lg text-primary text-[40px] md:text-display-lg leading-tight">
          Welcome to MusaQuest
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          A gentle, gamified way for Muslim children to journey through the life of Prophet Musa, peace be upon him. Read twelve illustrated chapters, earn XP and streaks for daily reflection, and unlock the Pilgrim badge by completing the full story.
        </p>
      </section>

      {/* Father-son credit ribbon */}
      <div className="flex items-center justify-center gap-2 -mt-2">
        <span className="material-symbols-outlined text-secondary-container text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        <p className="font-label-caps text-label-caps text-on-surface-variant">An idea by Musa Tanvir, age 10.</p>
        <span className="material-symbols-outlined text-secondary-container text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
      </div>

      {/* Life of Musa (peace be upon him) — fixed historical timeline drawn from the Quranic narrative */}
      <section className="bg-surface-container/40 border border-surface-variant rounded-xl p-md md:p-lg overflow-hidden">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-md gap-1 sm:gap-md">
          <div>
            <h2 className="font-headline-md text-[20px] md:text-[22px] text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
              The Life of Musa
            </h2>
            <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">peace be upon him · twelve milestones from the Quran</p>
          </div>
          <Link href="/stories" className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors whitespace-nowrap">
            Read the chapters
          </Link>
        </header>

        <div className="relative overflow-x-auto pb-3 -mx-md px-md">
          <ol className="relative flex items-start gap-0 min-w-max">
            {musaTimeline.map((event, idx) => (
              <li key={idx} className="flex flex-col items-center w-[92px] flex-shrink-0 relative">
                {idx < musaTimeline.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute top-[26px] left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 bg-primary-fixed-dim/60"
                  />
                )}
                <div className="relative z-10 w-[52px] h-[52px] rounded-full bg-primary-container text-on-primary-container border-4 border-surface flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {event.icon}
                  </span>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface-variant mt-2">{idx + 1}</span>
                <span className="font-body-md text-[11px] leading-tight text-on-surface text-center mt-1 line-clamp-2 px-1 max-w-[84px]">
                  {event.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Streak banner */}
      <div className="bg-tertiary-container/10 border-2 border-tertiary-container/30 rounded-xl p-md flex items-center justify-between gap-md">
        <div className="flex items-center gap-md">
          <div className="w-14 h-14 rounded-full bg-tertiary-container flex items-center justify-center shadow-[0_0_24px_rgba(121,45,38,0.3)] relative">
            <span className="material-symbols-outlined text-on-tertiary-container text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          </div>
          <div>
            <p className="font-headline-md text-[20px] text-primary font-bold leading-tight">{currentStreak} day streak</p>
            <p className="font-label-caps text-label-caps text-on-surface-variant">Read today to keep it alive</p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1">
          <div className="flex gap-1">
            <span className="w-3 h-3 rounded-full bg-tertiary-container"></span>
            <span className="w-3 h-3 rounded-full bg-tertiary-container"></span>
            <span className="w-3 h-3 rounded-full bg-tertiary-container"></span>
            <span className="w-3 h-3 rounded-full bg-tertiary-container"></span>
            <span className="w-3 h-3 rounded-full bg-tertiary-container"></span>
            <span className="w-3 h-3 rounded-full border-2 border-tertiary-container/40"></span>
            <span className="w-3 h-3 rounded-full border-2 border-surface-variant"></span>
          </div>
          <p className="font-label-caps text-label-caps text-on-surface-variant">Best: {bestStreak} days</p>
        </div>
      </div>

      {/* HeroRankBanner */}
      <Link href="/profile" className="block hover:scale-[1.005] transition-transform">
        <section className="bg-surface-container rounded-xl p-lg md:p-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-xl border-2 border-secondary-fixed shadow-[0_8px_30px_rgba(15,76,92,0.04)]">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary-fixed opacity-40 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-fixed-dim opacity-20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary-container flex items-center justify-center relative shrink-0 z-10 shadow-[0_10px_25px_rgba(15,76,92,0.15)] border-4 border-surface">
            <span className="material-symbols-outlined text-[64px] md:text-[80px] text-secondary-container drop-shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>landscape</span>
          </div>
          <div className="flex-1 w-full z-10 text-center md:text-left">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-[0.1em]">Current Rank</p>
            <h1 className="font-display-lg text-display-lg text-primary mb-md">{rank}</h1>
            <div className="flex items-center justify-between mb-sm mt-md px-2">
              <span className="font-body-lg text-body-lg text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span> Level {level}
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">{totalXp.toLocaleString()} / {rankMaxXp.toLocaleString()} XP</span>
            </div>
            <div className="h-5 w-full bg-surface-variant rounded-full overflow-hidden p-[2px]">
              <div className="h-full bg-tertiary-container rounded-full relative overflow-hidden" style={{ width: `${progressPercent}%` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full transform -translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant mt-sm">Only {xpUntilNext.toLocaleString()} XP until the next milestone. Keep exploring!</p>
          </div>
        </section>
      </Link>

      {/* Continue Story Card */}
      <section className="flex flex-col md:flex-row bg-surface border-2 border-secondary-fixed rounded-lg overflow-hidden relative group shadow-[0_4px_20px_rgba(15,76,92,0.06)] hover:shadow-[0_8px_30px_rgba(15,76,92,0.1)] transition-shadow duration-300">
        <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden">
          <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANTa9AT5a8m_64Fz_SPJIHhW_nZbxKj3AXaNFoVe_bpN_mHLrKclOjt0yusSrox-o467DqdRhE23u3DwaLT_kHl6mN3KOUH_EufO1Q3vO3NQRKq5_z-0q3KtE9Z6DY4k3VCJxM3Dy-YY3BS3uLM2_pX3W1u0zdaUE9Abp0SBMA2Hy2okVBkbjQ-G7Tgqix2kl5KPOC6eAYSOzScbT8oABCsKXVfqG_HQozTuEwR5nrva1P6OUsebPhvs3iG9Q25DEiE0VExJrW6XY" alt="Story preview" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent md:hidden"></div>
          <div className="absolute bottom-4 left-4 md:hidden">
            <span className="font-label-caps text-label-caps text-on-primary bg-primary-container/80 backdrop-blur-sm px-3 py-1 rounded-full">Up Next</span>
          </div>
        </div>
        <div className="p-lg md:p-xl flex-1 flex flex-col justify-center bg-surface-container-low relative z-10">
          <span className="hidden md:inline-block font-label-caps text-label-caps text-primary bg-primary-fixed/50 px-4 py-1.5 rounded-full w-fit mb-md border border-primary-fixed-dim">Up Next</span>
          <h2 className="font-headline-md text-headline-md text-primary mb-sm">The Journey to Midian</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-2xl">Follow the path across the vast desert as a new chapter begins. Discover the well of Midian and the enduring virtues of patience, resilience, and unexpected kindness.</p>
          <div>
            <Link href="/chapter/3" className="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-xl py-sm rounded-full hover:bg-primary transition-colors inline-flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,76,92,0.2)] hover:shadow-none active:scale-95 duration-200">
              Continue Reading <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        <section className="lg:col-span-5 bg-surface-container rounded-xl p-lg flex flex-col border border-surface-variant">
          <div className="flex items-center justify-between mb-lg">
            <h3 className="font-headline-md text-[28px] text-primary flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              Daily Quests
            </h3>
            <span className="font-label-caps text-label-caps text-on-surface-variant bg-surface px-3 py-1 rounded-full shadow-sm">1/3 Done</span>
          </div>
          <ul className="flex flex-col gap-sm flex-1">
            <li className="bg-surface rounded-lg p-md border-2 border-tertiary-container/20 flex items-center gap-md opacity-70 transition-opacity hover:opacity-100">
              <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 600" }}>check</span>
              </div>
              <div className="flex-1">
                <p className="font-body-lg text-[18px] text-on-surface font-bold line-through decoration-tertiary-container/50">Reflect on Patience</p>
                <p className="font-label-caps text-label-caps text-tertiary-container mt-1">+30 XP</p>
              </div>
            </li>
            <li className="bg-surface rounded-lg p-md border-2 border-surface-variant flex items-center gap-md shadow-sm hover:border-secondary-container transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full border-2 border-outline-variant flex items-center justify-center text-primary-container bg-surface shrink-0 group-hover:border-secondary-container transition-colors">
                <span className="material-symbols-outlined text-[20px] opacity-0 group-hover:opacity-50 transition-opacity">check</span>
              </div>
              <div className="flex-1">
                <p className="font-body-lg text-[18px] text-on-surface font-bold">Read 3 Verses</p>
                <p className="font-label-caps text-label-caps text-secondary mt-1">+50 XP</p>
              </div>
            </li>
            <li className="bg-surface rounded-lg p-md border-2 border-surface-variant flex items-center gap-md shadow-sm hover:border-secondary-container transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full border-2 border-outline-variant flex items-center justify-center text-primary-container bg-surface shrink-0 group-hover:border-secondary-container transition-colors">
                <span className="material-symbols-outlined text-[20px] opacity-0 group-hover:opacity-50 transition-opacity">check</span>
              </div>
              <div className="flex-1">
                <p className="font-body-lg text-[18px] text-on-surface font-bold">Complete a Chapter</p>
                <p className="font-label-caps text-label-caps text-secondary mt-1">+100 XP</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-md px-2">
            <h3 className="font-headline-md text-[24px] text-primary">Your Journey</h3>
            <Link href="/stories" className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md flex-1">
            <Link href="/chapter/1" className="bg-surface border-2 border-surface-variant rounded-xl p-md flex flex-col hover:border-secondary-container transition-colors cursor-pointer group relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-surface-container rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="w-12 h-12 rounded-full bg-primary-fixed/30 flex items-center justify-center mb-md group-hover:bg-primary-fixed transition-colors">
                <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
              </div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Chapter 1</p>
              <h4 className="font-body-lg text-body-lg text-primary font-bold mb-auto pr-8">The River Cradle</h4>
              <div className="mt-xl flex items-center justify-between pt-md border-t border-surface-variant">
                <span className="text-tertiary-container font-label-caps text-label-caps flex items-center gap-1"><span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Completed</span>
              </div>
            </Link>
            <Link href="/chapter/2" className="bg-surface border-2 border-surface-variant rounded-xl p-md flex flex-col hover:border-secondary-container transition-colors cursor-pointer group relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-surface-container rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="w-12 h-12 rounded-full bg-primary-fixed/30 flex items-center justify-center mb-md group-hover:bg-primary-fixed transition-colors">
                <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
              </div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Chapter 2</p>
              <h4 className="font-body-lg text-body-lg text-primary font-bold mb-auto pr-8">The Palace Walls</h4>
              <div className="mt-xl flex items-center justify-between pt-md border-t border-surface-variant">
                <span className="text-tertiary-container font-label-caps text-label-caps flex items-center gap-1"><span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Completed</span>
              </div>
            </Link>
            <div className="bg-secondary-fixed/20 border-2 border-secondary-container rounded-xl p-md flex flex-col cursor-not-allowed group relative overflow-hidden sm:col-span-2 opacity-80">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surface-container/30 to-surface-container-low opacity-50"></div>
              <div className="relative z-10 flex flex-row items-center justify-between w-full h-full gap-md">
                <div className="flex-1">
                  <p className="font-label-caps text-label-caps text-on-secondary-container mb-xs">Chapter 4</p>
                  <h4 className="font-headline-md text-[24px] text-secondary font-bold">The Burning Tree</h4>
                  <p className="font-body-md text-sm text-on-surface-variant mt-2 max-w-sm">Complete "The Journey to Midian" to unlock this chapter.</p>
                </div>
                <div className="w-14 h-14 shrink-0 rounded-full bg-surface border border-surface-variant flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-secondary opacity-60">lock</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer: discreet admin entry point — visible but unobtrusive */}
      <footer className="text-center pt-md pb-base">
        <Link
          href="/login"
          className="font-label-caps text-label-caps text-on-surface-variant/60 hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
          Admin
        </Link>
      </footer>
    </main>
  );
}
