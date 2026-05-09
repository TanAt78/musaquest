"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AuthState = {
  isAuthenticated: boolean;
  email: string | null;
  isAdmin: boolean;
};

export default function TopNavBar({ auth }: { auth: AuthState }) {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path || (path === '/stories' && pathname.startsWith('/chapter'));
    return isActive
      ? "text-primary font-bold bg-surface-container-low transition-colors px-4 py-2 rounded-xl flex items-center gap-2"
      : "text-on-surface-variant hover:bg-surface-container-low transition-colors px-4 py-2 rounded-xl flex items-center gap-2";
  };

  const getIconFill = (path: string) => {
    const isActive = pathname === path || (path === '/stories' && pathname.startsWith('/chapter'));
    return isActive ? { fontVariationSettings: "'FILL' 1" } : {};
  };

  // Reasonable initial for the avatar — first letter of the email's local part
  const userInitial = auth.email ? auth.email.charAt(0).toUpperCase() : '?';

  return (
    <header className="bg-surface sticky top-0 z-40">
      <div className="flex justify-between items-center w-full px-md py-sm max-w-container-max mx-auto gap-sm">
        <Link href="/" className="flex items-center gap-sm group">
          <div className="w-12 h-12 rounded-full bg-surface-variant overflow-hidden border-2 border-secondary-container p-[2px] relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full border-[3px] border-tertiary-container border-t-transparent border-l-transparent transform rotate-45 z-10"></div>
            <img
              alt="MusaQuest"
              className="w-full h-full rounded-full object-cover relative z-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkaJWhSRS19h2gwOd7O46EGkN0k6bhg4ir6MNXhrqX2wWu1TnZxMQNzhCr562VAwolVjpClrg5FTv2tfi9DohmY0IkW5i4IAT0_Yx8j-4TS4VnP5OAlK6HRMaN_VMAUPFIYnzZdXsHSxo3xvmMc9i-d01p9OMd05-EW3FvhT2FObB8-tLJJ0EyArIL81RC-UinKywHphgLxMvsuRGYl7UOI5bPFIrwii6b0J6UjM_rpux350MkHNNRrwlgAWB01fB8GbrwF2x_agU"
            />
          </div>
          <span className="text-headline-md font-headline-md font-bold text-primary tracking-tight">
            MusaQuest
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-sm">
          <Link className={getLinkClasses("/")} href="/">
            <span className="material-symbols-outlined" style={getIconFill("/")}>home</span>
            <span className="font-label-caps text-label-caps">Home</span>
          </Link>
          <Link className={getLinkClasses("/stories")} href="/stories">
            <span className="material-symbols-outlined" style={getIconFill("/stories")}>menu_book</span>
            <span className="font-label-caps text-label-caps">Stories</span>
          </Link>
          <Link className={getLinkClasses("/profile")} href="/profile">
            <span className="material-symbols-outlined" style={getIconFill("/profile")}>person</span>
            <span className="font-label-caps text-label-caps">Profile</span>
          </Link>
          {auth.isAdmin && (
            <Link className={getLinkClasses("/admin")} href="/admin">
              <span className="material-symbols-outlined" style={getIconFill("/admin")}>admin_panel_settings</span>
              <span className="font-label-caps text-label-caps">Admin</span>
            </Link>
          )}
        </nav>

        {/* Right-side auth control */}
        {auth.isAuthenticated ? (
          <div className="flex items-center gap-sm">
            <Link
              href="/profile"
              title={auth.email ?? 'Profile'}
              className="hidden sm:flex w-10 h-10 rounded-full bg-primary-container text-on-primary-container items-center justify-center font-headline-md text-[16px] font-bold border-2 border-secondary-fixed hover:scale-105 transition-transform"
            >
              {userInitial}
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-full inline-flex items-center gap-1"
                title="Sign out"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span className="hidden md:inline">Sign out</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-sm">
            <Link
              href="/login"
              className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors px-md py-sm rounded-full"
            >
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className="hidden sm:inline-flex font-label-caps text-label-caps bg-primary-container text-on-primary-container hover:bg-primary px-lg py-sm rounded-full transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
