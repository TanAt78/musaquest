import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getReadUserId } from "@/utils/supabase/auth";

// Material Symbols mapped to chapter number — keeps the timeline visually
// distinct without relying on per-chapter icons in the database.
const TIMELINE_ICONS = [
  'child_friendly', 'castle', 'directions_walk', 'agriculture',
  'local_fire_department', 'auto_fix_high', 'shield', 'workspace_premium',
  'storm', 'waves', 'terrain', 'landscape',
];

type ChapterRow = {
  id: number;
  number: number;
  title: string;
  subtitle: string | null;
  hero_image_url: string | null;
};

export default async function Home() {
  const supabase = await createClient();
  const { userId, isAuthenticated } = await getReadUserId();

  const [{ data: stats }, { data: chaptersRaw }, { data: progressRaw }] = await Promise.all([
    supabase.from('user_stats').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('chapters').select('id, number, title, subtitle, hero_image_url').order('number', { ascending: true }),
    supabase.from('user_progress').select('chapter_id, completed_at').eq('user_id', userId),
  ]);

  const chapters: ChapterRow[] = chaptersRaw ?? [];
  const completedSet = new Set<number>();
  (progressRaw ?? []).forEach(p => { if (p.completed_at) completedSet.add(p.chapter_id); });

  const rank = stats?.current_rank || 'The Seeker';
  const level = stats?.current_level || 1;
  const totalXp = stats?.total_xp || 0;
  const rankMaxXp = 3000;
  const xpUntilNext = Math.max(0, rankMaxXp - totalXp);
  const progressPercent = Math.min(100, Math.round((totalXp / rankMaxXp) * 100));

  // Continue-reading: first chapter the user hasn't completed.
  const nextChapter = chapters.find(c => !completedSet.has(c.id));
  const allDone = chapters.length > 0 && !nextChapter;

  // "Your Journey" bento — last two completed chapters (most recent first), then the next unread.
  const completedChapters = chapters.filter(c => completedSet.has(c.id)).slice(-2).reverse();
  const journeyCards = [...completedChapters];
  if (nextChapter) journeyCards.push(nextChapter);

  return (
    <main className="max-w-container-max mx-auto px-md py-lg flex flex-col gap-xl">

      {/* Hero image — sets the tone above the welcome heading */}
      <section className="relative -mt-md md:-mt-lg overflow-hidden rounded-2xl aspect-[21/9] md:aspect-[2.4/1] shadow-[0_12px_40px_rgba(15,76,92,0.12)] bg-surface-container">
        <img
          src="/hero-musa.png"
          alt="The lands and miracles in the life of Prophet Musa, peace be upon him"
          className="hero-ken-burns absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent pointer-events-none" />
      </section>

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
          A gentle, gamified way for Muslim children to journey through the life of Prophet Musa, peace be upon him. Read twelve illustrated chapters, earn XP for daily reflection, and unlock the Pilgrim badge by completing the full story.
        </p>
      </section>

      {/* Father-son credit ribbon */}
      <div className="flex items-center justify-center gap-2 -mt-2">
        <span className="material-symbols-outlined text-secondary-container text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        <p className="font-label-caps text-label-caps text-on-surface-variant">An idea by Musa Tanvir, age 10.</p>
        <span className="material-symbols-outlined text-secondary-container text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
      </div>

      {/* Guest banner — visible only to unauthenticated visitors */}
      {!isAuthenticated && (
        <div className="bg-secondary-fixed/15 border border-secondary-fixed rounded-xl px-md py-sm flex flex-col sm:flex-row items-center justify-between gap-sm text-center sm:text-left">
          <p className="font-body-md text-on-surface-variant">
            You're reading as a guest. <span className="text-primary font-bold">Create an account</span> to save reflections and track your progress.
          </p>
          <div className="flex gap-sm">
            <Link
              href="/login?mode=signup"
              className="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-lg py-sm rounded-full hover:bg-primary transition-colors whitespace-nowrap"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="text-primary font-label-caps text-label-caps px-md py-sm hover:text-primary-container transition-colors whitespace-nowrap"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}

      {/* Life of Musa timeline — chapter titles as canonical milestones */}
      {chapters.length > 0 && (
        <section className="bg-surface-container/40 border border-surface-variant rounded-xl p-md md:p-lg overflow-hidden">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-md gap-1 sm:gap-md">
            <div>
              <h2 className="font-headline-md text-[20px] md:text-[22px] text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
                The Life of Musa
              </h2>
              <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">
                peace be upon him · twelve milestones from the Quran
              </p>
            </div>
            <Link href="/stories" className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors whitespace-nowrap">
              Read the chapters
            </Link>
          </header>

          <div className="relative overflow-x-auto pb-3 -mx-md px-md">
            <ol className="relative flex items-start gap-0 min-w-max">
              {chapters.map((chapter, idx) => {
                const isCompleted = completedSet.has(chapter.id);
                const icon = TIMELINE_ICONS[idx % TIMELINE_ICONS.length];
                return (
                  <li key={chapter.id} className="flex flex-col items-center w-[100px] flex-shrink-0 relative">
                    {idx < chapters.length - 1 && (
                      <div
                        aria-hidden="true"
                        className={`absolute top-[26px] left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 ${
                          isCompleted ? 'bg-tertiary-container/60' : 'bg-primary-fixed-dim/60'
                        }`}
                      />
                    )}
                    <Link href={`/chapter/${chapter.id}`} className="relative z-10 group">
                      <div className={`w-[52px] h-[52px] rounded-full border-4 border-surface flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${
                        isCompleted ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-primary-container text-on-primary-container'
                      }`}>
                        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                      </div>
                    </Link>
                    <span className="font-label-caps text-label-caps text-on-surface-variant mt-2">{chapter.number}</span>
                    <span className="font-body-md text-[11px] leading-tight text-on-surface text-center mt-1 line-clamp-2 px-1 max-w-[92px]">
                      {chapter.title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}

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
            <h2 className="font-display-lg text-display-lg text-primary mb-md">{rank}</h2>
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

      {/* Continue Reading — dynamically points to the next unread chapter */}
      {nextChapter ? (
        <section className="flex flex-col md:flex-row bg-surface border-2 border-secondary-fixed rounded-lg overflow-hidden relative group shadow-[0_4px_20px_rgba(15,76,92,0.06)] hover:shadow-[0_8px_30px_rgba(15,76,92,0.1)] transition-shadow duration-300">
          <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-surface-container">
            {nextChapter.hero_image_url ? (
              <img
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                src={nextChapter.hero_image_url}
                alt={nextChapter.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[80px] text-surface-variant">menu_book</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent md:hidden"></div>
            <div className="absolute bottom-4 left-4 md:hidden">
              <span className="font-label-caps text-label-caps text-on-primary bg-primary-container/80 backdrop-blur-sm px-3 py-1 rounded-full">Up Next</span>
            </div>
          </div>
          <div className="p-lg md:p-xl flex-1 flex flex-col justify-center bg-surface-container-low relative z-10">
            <span className="hidden md:inline-block font-label-caps text-label-caps text-primary bg-primary-fixed/50 px-4 py-1.5 rounded-full w-fit mb-md border border-primary-fixed-dim">
              {completedSet.size === 0 ? 'Start the journey' : 'Up Next'}
            </span>
            <h2 className="font-headline-md text-headline-md text-primary mb-sm">{nextChapter.title}</h2>
            {nextChapter.subtitle && (
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-2xl">{nextChapter.subtitle}</p>
            )}
            <div>
              <Link
                href={`/chapter/${nextChapter.id}`}
                className="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-xl py-sm rounded-full hover:bg-primary transition-colors inline-flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,76,92,0.2)] hover:shadow-none active:scale-95 duration-200"
              >
                {completedSet.size === 0 ? 'Begin Chapter 1' : 'Continue Reading'}
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      ) : allDone ? (
        <section className="bg-tertiary-container/15 border-2 border-tertiary-container/40 rounded-lg p-xl text-center flex flex-col items-center gap-sm">
          <span className="material-symbols-outlined text-tertiary-container text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
          <h2 className="font-headline-md text-headline-md text-primary">You've finished the journey</h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl">All twelve chapters complete. The Pilgrim badge is yours — revisit any chapter to reflect again.</p>
        </section>
      ) : null}

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

        {/* Your Journey — last 2 completed + the next unread */}
        <section className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-md px-2">
            <h3 className="font-headline-md text-[24px] text-primary">Your Journey</h3>
            <Link href="/stories" className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors">View All</Link>
          </div>
          {journeyCards.length === 0 ? (
            <div className="bg-surface-container/50 rounded-xl p-lg text-center text-on-surface-variant border border-surface-variant">
              <p className="font-body-lg">No chapters yet — once they're seeded, your progress shows up here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md flex-1">
              {journeyCards.map(card => {
                const cardCompleted = completedSet.has(card.id);
                const isNext = !cardCompleted && card.id === nextChapter?.id;
                return (
                  <Link
                    key={card.id}
                    href={`/chapter/${card.id}`}
                    className={`bg-surface border-2 rounded-xl p-md flex flex-col hover:border-secondary-container transition-colors cursor-pointer group relative overflow-hidden ${
                      isNext ? 'border-secondary-container' : 'border-surface-variant'
                    }`}
                  >
                    <div className="absolute right-0 top-0 w-24 h-24 bg-surface-container rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="w-12 h-12 rounded-full bg-primary-fixed/30 flex items-center justify-center mb-md group-hover:bg-primary-fixed transition-colors">
                      <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {cardCompleted ? 'check_circle' : 'menu_book'}
                      </span>
                    </div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Chapter {card.number}</p>
                    <h4 className="font-body-lg text-body-lg text-primary font-bold mb-auto pr-8">{card.title}</h4>
                    <div className="mt-xl flex items-center justify-between pt-md border-t border-surface-variant">
                      <span className={`font-label-caps text-label-caps flex items-center gap-1 ${cardCompleted ? 'text-tertiary-container' : 'text-secondary'}`}>
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {cardCompleted ? 'check_circle' : 'play_arrow'}
                        </span>
                        {cardCompleted ? 'Completed' : isNext ? 'Up Next' : 'Read'}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>

    </main>
  );
}
