import Link from "next/link";
import { markChapterComplete } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function Chapter({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: chapter } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', parseInt(id))
    .single();

  if (!chapter) {
    notFound();
  }

  // Handle line breaks in markdown body
  const bodyParagraphs = chapter.body_md?.split('\n\n') || [];

  return (
    <main className="max-w-[760px] mx-auto px-md py-lg flex flex-col gap-lg">

      {/* Breadcrumb / back */}
      <div className="flex items-center justify-between">
        <Link href="/stories" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span> All Stories
        </Link>
        <span className="font-label-caps text-label-caps text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">Chapter {chapter.number} of 12</span>
      </div>

      {/* Hero illustration */}
      <div className="relative rounded-xl overflow-hidden aspect-[16/10] border-2 border-secondary-fixed shadow-[0_8px_30px_rgba(15,76,92,0.08)]">
        {chapter.hero_image_url ? (
          <img className="w-full h-full object-cover" src={chapter.hero_image_url} alt={chapter.title} />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center">
             <span className="material-symbols-outlined text-[64px] text-surface-variant">landscape</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-lg">
          <span className="font-label-caps text-label-caps text-on-primary bg-primary-container/80 backdrop-blur-sm px-3 py-1 rounded-full">In Progress</span>
        </div>
      </div>

      {/* Title */}
      <header className="text-center md:text-left">
        <p className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.15em] mb-xs">Chapter {chapter.number}</p>
        <h1 className="font-display-lg text-display-lg text-primary mb-md leading-tight">{chapter.title}</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl">{chapter.subtitle}</p>
      </header>

      {/* Audio player bar */}
      <div className="bg-surface-container rounded-xl p-md flex items-center gap-md border border-surface-variant shadow-sm">
        <button className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_4px_12px_rgba(15,76,92,0.2)] hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
        </button>
        <div className="flex-1">
          <p className="font-body-lg text-body-lg text-primary font-bold">Listen along</p>
          <p className="font-label-caps text-label-caps text-on-surface-variant">Narrated by Yusuf Islam, 4 min 12s</p>
        </div>
        <button className="text-on-surface-variant hover:text-primary transition-colors p-2">
          <span className="material-symbols-outlined">graphic_eq</span>
        </button>
      </div>

      {/* Body text */}
      <article className="prose-musa flex flex-col gap-md">
        
        {bodyParagraphs.length > 0 && (
          <p className="font-headline-md text-[20px] text-on-surface drop-cap leading-relaxed">{bodyParagraphs[0]}</p>
        )}

        {bodyParagraphs.slice(1, 2).map((paragraph: string, idx: number) => (
          <p key={idx} className="font-body-lg text-[18px] text-on-surface leading-relaxed">{paragraph}</p>
        ))}

        {chapter.arabic_verse && (
          <blockquote className="border-l-4 border-secondary-container bg-surface-container-low px-lg py-md rounded-r-xl my-base group cursor-pointer transition-all hover:bg-surface-container">
            <div className="flex items-start justify-between gap-md mb-sm">
              <p className="font-arabic-display text-[28px] text-primary text-right leading-loose flex-1">{chapter.arabic_verse}</p>
              <span className="material-symbols-outlined text-secondary-container shrink-0 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>expand_more</span>
            </div>
            <p className="font-headline-md text-[18px] text-on-surface-variant italic">"{chapter.arabic_translation}"</p>
            <p className="font-label-caps text-label-caps text-secondary mt-sm">Surah {chapter.surah}, Verse {chapter.verse_number}. Tap to learn more</p>

            <div className="hidden group-hover:block mt-md pt-md border-t border-secondary-container/30 space-y-md">
              <div>
                <p className="font-label-caps text-label-caps text-secondary uppercase mb-xs">Transliteration</p>
                <p className="font-headline-md text-[18px] text-on-surface italic">{chapter.arabic_transliteration}</p>
              </div>
              <div className="flex items-center gap-sm pt-sm">
                <button className="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-md py-sm rounded-full inline-flex items-center gap-2 hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>volume_up</span> Hear it recited
                </button>
                <button className="bg-surface text-primary font-label-caps text-label-caps px-md py-sm rounded-full inline-flex items-center gap-2 hover:bg-surface-container-high transition-colors border border-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">school</span> Learn to memorize
                </button>
              </div>
            </div>
          </blockquote>
        )}

        {bodyParagraphs.slice(2).map((paragraph: string, idx: number) => (
          <p key={idx} className="font-body-lg text-[18px] text-on-surface leading-relaxed">{paragraph}</p>
        ))}

      </article>

      {/* Reflection prompt */}
      <section className="bg-secondary-fixed/20 border-2 border-secondary-fixed rounded-xl p-lg flex flex-col md:flex-row gap-md items-start">
        <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>self_improvement</span>
        </div>
        <div className="flex-1">
          <p className="font-label-caps text-label-caps text-secondary uppercase mb-xs">Reflection</p>
          <h3 className="font-headline-md text-[22px] text-primary mb-sm">What is a lesson you learned from {chapter.title}?</h3>
          <p className="font-body-md text-on-surface-variant mb-md">Take a moment to think. Write down your reflection in your journal.</p>
          <button className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps px-lg py-sm rounded-full hover:bg-secondary-fixed-dim transition-colors inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">edit_note</span> Write a reflection (+30 XP)
          </button>
        </div>
      </section>

      {/* Pagination / mark complete */}
      <div className="flex flex-col md:flex-row gap-md mt-lg">
        {chapter.number > 1 ? (
          <Link href={`/chapter/${chapter.number - 1}`} className="flex-1 bg-surface border-2 border-surface-variant rounded-xl p-md text-center hover:border-secondary-container transition-colors">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Previous</p>
            <p className="font-body-lg text-body-lg text-primary font-bold">Chapter {chapter.number - 1}</p>
          </Link>
        ) : (
           <div className="flex-1"></div>
        )}
        <form action={markChapterComplete.bind(null, parseInt(id))} className="flex-1 flex">
          <button type="submit" className="flex-1 bg-primary-container text-on-primary-container rounded-xl p-md text-center hover:bg-primary transition-colors flex flex-col items-center justify-center gap-1 shadow-[0_4px_12px_rgba(15,76,92,0.2)] w-full">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <p className="font-label-caps text-label-caps">Mark Chapter Complete (+{chapter.xp_reward} XP)</p>
          </button>
        </form>
      </div>

    </main>
  );
}
