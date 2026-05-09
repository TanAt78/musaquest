import { login, signup } from './actions'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; mode?: string; next?: string }>
}) {
  const { message, mode, next } = await searchParams;
  const isSignup = mode === 'signup';
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '';

  return (
    <main className="max-w-md mx-auto px-md py-xl flex flex-col gap-lg min-h-[70vh] justify-center">
      <div className="bg-surface rounded-2xl p-lg border-2 border-surface-variant shadow-[0_8px_30px_rgba(15,76,92,0.08)]">
        <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps mb-md">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span> Back to App
        </Link>
        <h1 className="font-display-lg text-display-lg text-primary mb-sm">
          {isSignup ? 'Create your account' : 'Sign in'}
        </h1>
        <p className="font-body-md text-on-surface-variant mb-lg">
          {isSignup
            ? 'Track your reading, save reflections, and earn XP as you journey through the chapters.'
            : 'Welcome back. Sign in to pick up where you left off.'}
        </p>

        <form className="flex flex-col gap-4">
          {safeNext && <input type="hidden" name="next" value={safeNext} />}
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="email">Email</label>
            <input
              className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none transition-colors font-body-lg text-on-surface"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="password">
              Password{isSignup && ' (min 8 characters)'}
            </label>
            <input
              className="px-4 py-3 bg-surface-container rounded-xl border border-surface-variant focus:border-primary focus:outline-none transition-colors font-body-lg text-on-surface"
              type="password"
              name="password"
              placeholder="••••••••"
              minLength={isSignup ? 8 : undefined}
              required
            />
          </div>

          <button
            formAction={isSignup ? signup : login}
            className="mt-4 bg-primary text-on-primary font-label-caps text-label-caps px-md py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
          >
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>

          {message && (
            <p className={`mt-2 text-center p-4 rounded-xl font-body-md ${
              message.toLowerCase().includes('created') || message.toLowerCase().includes('check your inbox')
                ? 'bg-tertiary-container/20 text-tertiary-container'
                : 'bg-error-container text-on-error-container'
            }`}>
              {message}
            </p>
          )}
        </form>

        <div className="mt-md pt-md border-t border-surface-variant text-center">
          {isSignup ? (
            <Link
              href={`/login${safeNext ? `?next=${encodeURIComponent(safeNext)}` : ''}`}
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
            >
              Already have an account? Sign in
            </Link>
          ) : (
            <Link
              href={`/login?mode=signup${safeNext ? `&next=${encodeURIComponent(safeNext)}` : ''}`}
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
            >
              New to MusaQuest? Create an account
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
