import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getReadUserId } from "@/utils/supabase/auth";

export default async function Stories() {
  const supabase = await createClient();
  const { userId } = await getReadUserId();

  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .order('number', { ascending: true });

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const progressMap = new Map<number, any>();
  progress?.forEach(p => progressMap.set(p.chapter_id, p));

  const completedCount = progress?.filter(p => p.percent_read === 100).length || 0;
  const totalChapters = 12;
  const overallPercent = Math.round((completedCount / totalChapters) * 100);

  // Fallback icon per chapter when no hero_image_url is set
  const fallbackIcons = ['water', 'castle', 'local_fire_department', 'groups', 'stadium', 'auto_fix_high', 'storm', 'water_drop', 'terrain', 'heart_broken', 'landscape', 'stars'];

  return (
    <main className="max-w-container-max mx-auto px-md py-lg flex flex-col gap-lg">
      <header className="text-center md:text-left mb-md">
        <p className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.15em] mb-xs">The Library</p>
        <h1 className="font-display-lg text-display-lg text-primary mb-sm">The Story of Musa</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl">Twelve chapters in the life of Prophet Musa, peace be upon him. From a basket on the Nile to the promised land.</p>
      </header>

      {/* Progress strip */}
      <div className="bg-surface-container rounded-xl p-md flex items-center justify-between gap-md border border-surface-variant">
        <div className="flex items-center gap-md flex-1">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="font-body-lg text-body-lg text-primary font-bold">{completedCount} of {totalChapters} chapters complete</p>
              <p className="font-label-caps text-label-caps text-on-surface-variant">{overallPercent}% read</p>
            </div>
            <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-tertiary-container rounded-full" style={{ width: `${overallPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter pills (visual only for now) */}
      <nav className="flex gap-sm overflow-x-auto pb-2 -mx-md px-md">
        <button className="font-label-caps text-label-caps bg-primary-container text-on-primary-container px-lg py-sm rounded-full whitespace-nowrap shadow-[0_4px_12px_rgba(15,76,92,0.15)]">All Chapters</button>
        <button className="font-label-caps text-label-caps bg-surface-container text-on-surface-variant hover:bg-surface-container-high px-lg py-sm rounded-full whitespace-nowrap transition-colors">Completed</button>
        <button className="font-label-caps text-label-caps bg-surface-container text-on-surface-variant hover:bg-surface-container-high px-lg py-sm rounded-full whitespace-nowrap transition-colors">In Progress</button>
        <button className="font-label-caps text-label-caps bg-surface-container text-on-surface-variant hover:bg-surface-container-high px-lg py-sm rounded-full whitespace-nowrap transition-colors">Locked</button>
      </nav>

      {/* Chapters grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
        {chapters?.map((chapter) => {
          const chapProgress = progressMap.get(chapter.id);
          const percentRead = chapProgress?.percent_read || 0;
          const isCompleted = percentRead === 100;
          const isLocked = chapter.number > 1 && !(progressMap.get(chapter.id - 1)?.percent_read === 100);
          const isInProgress = !isCompleted && !isLocked && percentRead > 0;
          const isNextUp = !isCompleted && !isLocked && percentRead === 0;
          const fallbackIcon = fallbackIcons[(chapter.number - 1) % fallbackIcons.length];

          // Hero strip — image when available, gradient + glyph as fallback. Same
          // visual language across all three states; only the overlay differs.
          const HeroStrip = (
            <div className="h-32 relative overflow-hidden">
              {chapter.hero_image_url ? (
                <img
                  className={`w-full h-full object-cover ${isLocked ? 'grayscale opacity-60' : ''}`}
                  src={chapter.hero_image_url}
                  alt={chapter.title}
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${
                  isLocked ? 'from-tertiary-fixed-dim to-tertiary-container' :
                  isCompleted ? 'from-primary-fixed-dim to-primary-container' :
                  'from-secondary-container to-secondary'
                }`}>
                  <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[64px] text-on-primary opacity-90" style={{ fontVariationSettings: "'FILL' 1" }}>{fallbackIcon}</span>
                </div>
              )}
              {/* State badges + overlays */}
              {isLocked && (
                <>
                  <div className="absolute inset-0 bg-on-surface/30" />
                  <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[40px] text-surface drop-shadow" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </>
              )}
              {isCompleted && (
                <div className="absolute top-2 right-2 bg-tertiary-container text-on-tertiary-container font-label-caps text-label-caps px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Done
                </div>
              )}
              {isInProgress && (
                <div className="absolute top-2 right-2 bg-secondary-container text-on-secondary-container font-label-caps text-label-caps px-3 py-1 rounded-full shadow-sm">Continue</div>
              )}
              {isNextUp && chapter.number === completedCount + 1 && (
                <div className="absolute top-2 right-2 bg-surface text-secondary font-label-caps text-label-caps px-3 py-1 rounded-full shadow-sm border border-secondary-fixed">Next up</div>
              )}
            </div>
          );

          // Locked: render as a non-link div but still tap-to-preview
          if (isLocked) {
            return (
              <div
                key={chapter.id}
                className="bg-surface-container border-2 border-surface-variant rounded-xl overflow-hidden flex flex-col opacity-80 relative cursor-not-allowed"
                aria-disabled="true"
              >
                {HeroStrip}
                <div className="p-md flex flex-col flex-1">
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Chapter {chapter.number}</p>
                  <h4 className="font-headline-md text-[20px] text-primary font-bold mb-xs flex items-center gap-2">
                    {chapter.title}
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">lock</span>
                  </h4>
                  <p className="font-body-md text-sm text-on-surface-variant mb-md flex-1">{chapter.subtitle}</p>
                  <div className="pt-md border-t border-surface-variant">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Complete Chapter {chapter.number - 1} to unlock</span>
                  </div>
                </div>
              </div>
            );
          }

          // Completed
          if (isCompleted) {
            return (
              <Link
                key={chapter.id}
                href={`/chapter/${chapter.id}`}
                className="bg-surface border-2 border-surface-variant rounded-xl overflow-hidden hover:border-secondary-container transition-all hover:-translate-y-1 group cursor-pointer flex flex-col"
              >
                {HeroStrip}
                <div className="p-md flex flex-col flex-1">
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Chapter {chapter.number}</p>
                  <h4 className="font-headline-md text-[20px] text-primary font-bold mb-xs">{chapter.title}</h4>
                  <p className="font-body-md text-sm text-on-surface-variant mb-md flex-1">{chapter.subtitle}</p>
                  <div className="flex items-center justify-between pt-md border-t border-surface-variant">
                    <span className="text-tertiary-container font-label-caps text-label-caps flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Completed
                    </span>
                    <span className="font-label-caps text-label-caps text-secondary">+{chapter.xp_reward} XP</span>
                  </div>
                </div>
              </Link>
            );
          }

          // In Progress / Next up (open chapter, available to read)
          return (
            <Link
              key={chapter.id}
              href={`/chapter/${chapter.id}`}
              className={`bg-surface border-2 rounded-xl overflow-hidden hover:-translate-y-1 transition-all group cursor-pointer flex flex-col shadow-[0_8px_30px_rgba(15,76,92,0.08)] relative ${
                isInProgress ? 'border-secondary-container' : 'border-surface-variant hover:border-secondary-container'
              }`}
            >
              {HeroStrip}
              <div className="p-md flex flex-col flex-1">
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Chapter {chapter.number}</p>
                <h4 className="font-headline-md text-[20px] text-primary font-bold mb-xs">{chapter.title}</h4>
                <p className="font-body-md text-sm text-on-surface-variant mb-md flex-1">{chapter.subtitle}</p>
                {isInProgress ? (
                  <>
                    <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary-container rounded-full" style={{ width: `${percentRead}%` }}></div>
                    </div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mt-2">{percentRead}% read</p>
                  </>
                ) : (
                  <div className="flex items-center justify-between pt-md border-t border-surface-variant">
                    <span className="font-label-caps text-label-caps text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span> Read
                    </span>
                    <span className="font-label-caps text-label-caps text-secondary">+{chapter.xp_reward} XP</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </section>

      {/* Foot section: completion bonus tease */}
      <section className="bg-primary-container/10 border-2 border-dashed border-primary-fixed-dim rounded-xl p-lg text-center mt-md">
        <span className="material-symbols-outlined text-secondary-container text-[48px] mb-sm" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
        <h3 className="font-headline-md text-[24px] text-primary mb-xs">Complete all 12 chapters</h3>
        <p className="font-body-md text-on-surface-variant max-w-xl mx-auto">Earn the Pilgrim badge, unlock the audio storybook to share with family, and reveal a special chapter on the lessons of Musa for our own time.</p>
      </section>

    </main>
  );
}
