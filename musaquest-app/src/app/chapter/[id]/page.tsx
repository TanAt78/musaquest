import Link from "next/link";
import { markChapterComplete } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { getReadUserId } from "@/utils/supabase/auth";
import { notFound } from "next/navigation";
import ReflectionForm from "@/components/ReflectionForm";

export default async function Chapter({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapterId = parseInt(id, 10);
  const supabase = await createClient();
  const { userId, isAuthenticated } = await getReadUserId();

  const [{ data: chapter }, { data: progress }] = await Promise.all([
    supabase.from('chapters').select('*').eq('id', chapterId).single(),
    supabase
      .from('user_progress')
      .select('reflection_text, completed_at')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)
      .maybeSingle(),
  ]);

  if (!chapter) notFound();

  // Body paragraphs split on blank lines
  const bodyParagraphs: string[] = chapter.body_md?.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean) ?? [];
  const isCompleted = !!progress?.completed_at;
  const existingReflection = progress?.reflection_text ?? '';
  const reflectionQuestion = chapter.reflection_question || `What is one lesson you learned from ${chapter.title}?`;
  const keyInsights: string[] = Array.isArray(chapter.key_insights) ? chapter.key_insights : [];

  return (
    <main className="max-w-[760px] mx-auto px-md py-lg flex flex-col gap-lg">

      {/* Breadcrumb / chapter pill */}
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
          <span className="font-label-caps text-label-caps text-on-primary bg-primary-container/80 backdrop-blur-sm px-3 py-1 rounded-full">
            {isCompleted ? 'Completed' : 'In Progress'}
          </span>
        </div>
      </div>

      {/* Title */}
      <header className="text-center md:text-left">
        <p className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.15em] mb-xs">Chapter {chapter.number}</p>
        <h1 className="font-display-lg text-display-lg text-primary mb-md leading-tight">{chapter.title}</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl">{chapter.subtitle}</p>
      </header>

      {/* Body — drop cap on the first paragraph, plain on the rest */}
      <article className="flex flex-col gap-md">
        {bodyParagraphs.length > 0 && (
          <p className="font-headline-md text-[20px] text-on-surface drop-cap leading-relaxed">{bodyParagraphs[0]}</p>
        )}
        {bodyParagraphs.slice(1).map((paragraph, idx) => (
          <p key={idx} className="font-body-lg text-[18px] text-on-surface leading-relaxed">{paragraph}</p>
        ))}
      </article>

      {/* Quranic Moment */}
      {(chapter.arabic_verse || chapter.arabic_translation || chapter.surah) && (
        <section className="bg-surface-container-low border-2 border-secondary-fixed rounded-xl p-lg flex flex-col gap-sm">
          <header className="flex items-center gap-2 mb-xs">
            <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
            <h2 className="font-headline-md text-[22px] text-primary">Quranic Moment</h2>
          </header>
          {chapter.arabic_verse && (
            <p className="font-arabic-display text-[28px] text-primary text-right leading-loose">{chapter.arabic_verse}</p>
          )}
          {chapter.arabic_transliteration && (
            <p className="font-headline-md text-[16px] text-on-surface-variant italic">{chapter.arabic_transliteration}</p>
          )}
          {chapter.arabic_translation && (
            <p className="font-body-lg text-[18px] text-on-surface leading-relaxed">“{chapter.arabic_translation}”</p>
          )}
          {chapter.surah && (
            <p className="font-label-caps text-label-caps text-secondary mt-xs">
              Surah {chapter.surah}{chapter.verse_number ? `, verse ${chapter.verse_number}` : ''}
            </p>
          )}
        </section>
      )}

      {/* Simple Meaning */}
      {chapter.simple_meaning && (
        <section className="bg-secondary-fixed/15 border border-secondary-fixed rounded-xl p-lg flex flex-col gap-sm">
          <header className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            <h2 className="font-headline-md text-[22px] text-primary">Simple Meaning</h2>
          </header>
          <p className="font-body-lg text-[18px] text-on-surface leading-relaxed">{chapter.simple_meaning}</p>
        </section>
      )}

      {/* Key Insights */}
      {keyInsights.length > 0 && (
        <section className="bg-tertiary-container/10 border border-tertiary-container/30 rounded-xl p-lg flex flex-col gap-sm">
          <header className="flex items-center gap-2 mb-xs">
            <span className="material-symbols-outlined text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <h2 className="font-headline-md text-[22px] text-primary">Key Insights</h2>
          </header>
          <ul className="flex flex-col gap-sm">
            {keyInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-tertiary-container shrink-0 mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <p className="font-body-lg text-[17px] text-on-surface leading-relaxed">{insight}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Reflection — live form when signed in, sign-in prompt when guest */}
      {isAuthenticated ? (
        <ReflectionForm
          chapterId={chapter.id}
          question={reflectionQuestion}
          initial={existingReflection}
        />
      ) : (
        <section className="bg-secondary-fixed/15 border-2 border-secondary-fixed rounded-xl p-lg flex flex-col gap-md">
          <header className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>self_improvement</span>
            <h2 className="font-headline-md text-[22px] text-primary">Your Reflection</h2>
          </header>
          <p className="font-body-lg text-[18px] text-on-surface leading-relaxed">{reflectionQuestion}</p>
          <div className="bg-surface rounded-xl p-md border border-secondary-fixed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm">
            <p className="font-body-md text-on-surface-variant">
              Sign in to write a reflection and have it saved on your account.
            </p>
            <Link
              href={`/login?next=/chapter/${chapter.id}`}
              className="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-lg py-sm rounded-full hover:bg-primary transition-colors whitespace-nowrap"
            >
              Sign in to save
            </Link>
          </div>
        </section>
      )}

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
        <form action={markChapterComplete.bind(null, chapterId)} className="flex-1 flex">
          <button
            type="submit"
            disabled={isCompleted}
            className="flex-1 bg-primary-container text-on-primary-container rounded-xl p-md text-center hover:bg-primary disabled:bg-tertiary-container disabled:cursor-default transition-colors flex flex-col items-center justify-center gap-1 shadow-[0_4px_12px_rgba(15,76,92,0.2)] w-full"
          >
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <p className="font-label-caps text-label-caps">
              {isCompleted ? 'Chapter Complete' : `Mark Chapter Complete (+${chapter.xp_reward ?? 100} XP)`}
            </p>
          </button>
        </form>
      </div>

    </main>
  );
}
