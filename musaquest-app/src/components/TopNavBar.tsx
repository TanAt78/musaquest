"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNavBar() {
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

  return (
    <header className="bg-surface docked full-width top-0 flat no shadows sticky z-40">
      <div className="flex justify-between items-center w-full px-md py-sm max-w-container-max mx-auto">
        <Link href="/" className="flex items-center gap-sm group">
          <div className="w-12 h-12 rounded-full bg-surface-variant overflow-hidden border-2 border-secondary-container p-[2px] relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full border-[3px] border-tertiary-container border-t-transparent border-l-transparent transform rotate-45 z-10"></div>
            <img
              alt="Child profile"
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
          <Link className={getLinkClasses("/verses")} href="#">
            <span className="material-symbols-outlined" style={getIconFill("/verses")}>auto_stories</span>
            <span className="font-label-caps text-label-caps">Verses</span>
          </Link>
          <Link className={getLinkClasses("/reflect")} href="#">
            <span className="material-symbols-outlined" style={getIconFill("/reflect")}>self_improvement</span>
            <span className="font-label-caps text-label-caps">Reflect</span>
          </Link>
          <Link className={getLinkClasses("/profile")} href="/profile">
            <span className="material-symbols-outlined" style={getIconFill("/profile")}>person</span>
            <span className="font-label-caps text-label-caps">Profile</span>
          </Link>
        </nav>
        <div className="hidden md:flex text-on-surface-variant font-label-caps text-label-caps bg-surface-container px-4 py-2 rounded-full items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          14 Safar 1446
        </div>
      </div>
    </header>
  );
}
