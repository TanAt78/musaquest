import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Protect the route
  if (!user || user.email !== 'atif@calderpier.com') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="bg-surface-container border-b border-surface-variant p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-display-lg text-primary text-[24px]">
            MusaQuest Admin
          </Link>
          <span className="font-label-caps text-label-caps bg-primary text-on-primary px-2 py-1 rounded-full">Secure</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">public</span> View App
          </Link>
          <form action="/auth/signout" method="post">
             <button className="font-label-caps text-label-caps text-error hover:text-error/80 transition-colors inline-flex items-center gap-1">
               <span className="material-symbols-outlined text-[18px]">logout</span> Sign out
             </button>
          </form>
        </div>
      </header>
      <main className="flex-1 max-w-container-max mx-auto w-full px-md py-lg">
        {children}
      </main>
    </div>
  )
}
