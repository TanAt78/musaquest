import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { updateChapter } from '../../actions'

export default async function EditChapterPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient()

  const { data: chapter } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', parseInt(id))
    .single()

  if (!chapter) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-lg max-w-3xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps mb-2">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span> Back to Dashboard
          </Link>
          <h1 className="font-display-lg text-[32px] text-primary">Edit Chapter {chapter.number}</h1>
        </div>
        <a 
          href={`/chapter/${chapter.id}`}
          target="_blank"
          className="bg-surface border border-surface-variant text-primary font-label-caps text-label-caps px-4 py-2 rounded-lg hover:bg-surface-container transition-colors inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">visibility</span> Preview
        </a>
      </header>

      <form action={updateChapter.bind(null, chapter.id)} className="bg-surface rounded-2xl p-lg border border-surface-variant flex flex-col gap-xl shadow-sm">
        
        {/* Core Info */}
        <section className="flex flex-col gap-md">
          <h2 className="font-headline-md text-primary border-b border-surface-variant pb-2">Basic Info</h2>
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="title">Title</label>
            <input className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none font-body-lg" name="title" defaultValue={chapter.title} required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="subtitle">Subtitle</label>
            <input className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none font-body-lg" name="subtitle" defaultValue={chapter.subtitle || ''} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="hero_image_url">Hero Image URL</label>
            <input className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none font-body-lg font-mono text-sm" name="hero_image_url" defaultValue={chapter.hero_image_url || ''} placeholder="https://..." />
            <p className="font-body-md text-xs text-on-surface-variant mt-1">Leave blank to use a fallback icon.</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="xp_reward">XP Reward</label>
            <input className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none font-body-lg w-32" type="number" name="xp_reward" defaultValue={chapter.xp_reward || 150} />
          </div>
        </section>

        {/* Story Content */}
        <section className="flex flex-col gap-md">
          <h2 className="font-headline-md text-primary border-b border-surface-variant pb-2">Story Text</h2>
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="body_md">Body Text</label>
            <textarea 
              className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none font-body-lg min-h-[300px] leading-relaxed" 
              name="body_md" 
              defaultValue={chapter.body_md || ''} 
              placeholder="Write the story here. Separate paragraphs with a blank line (Hit Enter twice)."
            />
            <p className="font-body-md text-xs text-on-surface-variant mt-1">The first paragraph will automatically get the large Drop-Cap styling.</p>
          </div>
        </section>

        {/* Quranic Verse */}
        <section className="flex flex-col gap-md">
          <h2 className="font-headline-md text-primary border-b border-surface-variant pb-2">Quranic Verse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-label-caps text-on-surface" htmlFor="surah">Surah Name</label>
              <input className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none font-body-lg" name="surah" defaultValue={chapter.surah || ''} placeholder="e.g. Al-Qasas" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-label-caps text-on-surface" htmlFor="verse_number">Verse Number</label>
              <input className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none font-body-lg" type="number" name="verse_number" defaultValue={chapter.verse_number || ''} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="arabic_verse">Arabic Text</label>
            <input className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none font-arabic-display text-right text-2xl" name="arabic_verse" defaultValue={chapter.arabic_verse || ''} dir="rtl" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="arabic_transliteration">Transliteration</label>
            <input className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none font-body-lg italic" name="arabic_transliteration" defaultValue={chapter.arabic_transliteration || ''} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="arabic_translation">Translation (English)</label>
            <input className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none font-body-lg" name="arabic_translation" defaultValue={chapter.arabic_translation || ''} />
          </div>
        </section>

        {/* Teaching layer — added in migration 002 */}
        <section className="flex flex-col gap-md">
          <h2 className="font-headline-md text-primary border-b border-surface-variant pb-2">Teaching Layer</h2>

          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="simple_meaning">Simple Meaning</label>
            <textarea
              className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none font-body-lg min-h-[80px] leading-relaxed"
              name="simple_meaning"
              defaultValue={chapter.simple_meaning || ''}
              placeholder="One or two sentences in plain language explaining the heart of the chapter."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="key_insights">Key Insights</label>
            <textarea
              className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none font-body-lg min-h-[120px] leading-relaxed"
              name="key_insights"
              defaultValue={(chapter.key_insights ?? []).join('\n')}
              placeholder={"One insight per line. Example:\nAllah protects whom He wills.\nTrusting Allah can be hard, but His promise is true."}
            />
            <p className="font-body-md text-xs text-on-surface-variant mt-1">Each line becomes a separate bullet on the chapter page.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="reflection_question">Reflection Question</label>
            <input
              className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none font-body-lg"
              name="reflection_question"
              defaultValue={chapter.reflection_question || ''}
              placeholder="A single question shown above the reader's reflection box."
            />
          </div>
        </section>

        <div className="flex justify-end pt-md border-t border-surface-variant mt-md">
          <button type="submit" className="bg-primary text-on-primary font-label-caps text-label-caps px-xl py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm inline-flex items-center gap-2 text-lg">
            <span className="material-symbols-outlined">save</span> Save Chapter
          </button>
        </div>

      </form>
    </div>
  )
}
