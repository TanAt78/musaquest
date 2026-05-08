import { login } from './actions'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams;

  return (
    <main className="max-w-md mx-auto px-md py-xl flex flex-col gap-lg min-h-[70vh] justify-center">
      <div className="bg-surface rounded-2xl p-lg border-2 border-surface-variant shadow-[0_8px_30px_rgba(15,76,92,0.08)]">
        <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps mb-md">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span> Back to App
        </Link>
        <h1 className="font-display-lg text-display-lg text-primary mb-sm">Admin Access</h1>
        <p className="font-body-md text-on-surface-variant mb-lg">Log in to add and edit chapters.</p>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="email">Email</label>
            <input
              className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none transition-colors font-body-lg text-on-surface"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="password">Password</label>
            <input
              className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none transition-colors font-body-lg text-on-surface"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            formAction={login}
            className="mt-4 bg-primary text-on-primary font-label-caps text-label-caps px-md py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
          >
            Sign In
          </button>
          
          {message && (
            <p className="mt-4 text-center p-4 bg-error-container text-on-error-container rounded-xl font-body-md">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}
