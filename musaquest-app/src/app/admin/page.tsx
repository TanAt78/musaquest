import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .order('number', { ascending: true })

  return (
    <div className="flex flex-col gap-lg">
      <header>
        <h1 className="font-display-lg text-[32px] text-primary mb-2">Chapter Content Manager</h1>
        <p className="font-body-md text-on-surface-variant">Update the content for the 12 chapters of MusaQuest here.</p>
      </header>

      <div className="bg-surface rounded-xl border border-surface-variant overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container text-on-surface-variant font-label-caps text-label-caps border-b border-surface-variant">
              <th className="p-4 font-normal">Ch.</th>
              <th className="p-4 font-normal">Title</th>
              <th className="p-4 font-normal">Content Status</th>
              <th className="p-4 font-normal">XP</th>
              <th className="p-4 font-normal text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {chapters?.map((chapter) => {
              // Basic check if the chapter has meaningful content
              const hasBody = chapter.body_md && chapter.body_md.length > 50;
              const hasVerse = !!chapter.arabic_verse;
              const isFilled = hasBody && hasVerse;

              return (
                <tr key={chapter.id} className="border-b border-surface-variant/50 hover:bg-surface-container-lowest transition-colors group">
                  <td className="p-4 font-body-md font-bold text-on-surface">{chapter.number}</td>
                  <td className="p-4">
                    <p className="font-body-lg text-primary font-bold">{chapter.title}</p>
                    <p className="font-body-md text-sm text-on-surface-variant truncate max-w-[300px]">{chapter.subtitle}</p>
                  </td>
                  <td className="p-4">
                    {isFilled ? (
                      <span className="inline-flex items-center gap-1 bg-tertiary-container/30 text-tertiary px-2 py-1 rounded-full font-label-caps text-[10px]">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> Drafted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-error-container/30 text-error px-2 py-1 rounded-full font-label-caps text-[10px]">
                        <span className="material-symbols-outlined text-[14px]">edit_note</span> Needs Content
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-body-md text-on-surface-variant">{chapter.xp_reward}</td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/chapter/${chapter.id}`}
                      className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container font-label-caps text-label-caps px-4 py-2 rounded-lg hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
