"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomMobileNav() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path || (path === '/stories' && pathname.startsWith('/chapter'));
    return isActive
      ? "flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-5 py-2 scale-90 transition-all duration-300 ease-out shadow-sm"
      : "flex flex-col items-center justify-center text-on-surface-variant p-2 hover:text-primary transition-colors";
  };

  const getIconFill = (path: string) => {
    const isActive = pathname === path || (path === '/stories' && pathname.startsWith('/chapter'));
    return isActive ? { fontVariationSettings: "'FILL' 1" } : {};
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-md pb-md pt-base bg-surface-container shadow-[0_-4px_20px_rgba(15,76,92,0.08)] rounded-t-[2rem]">
      <Link className={getLinkClasses("/")} href="/">
        <span className="material-symbols-outlined mb-1" style={getIconFill("/")}>home</span>
        <span className="text-label-caps font-label-caps">Home</span>
      </Link>
      <Link className={getLinkClasses("/stories")} href="/stories">
        <span className="material-symbols-outlined mb-1" style={getIconFill("/stories")}>menu_book</span>
        <span className="text-label-caps font-label-caps">Stories</span>
      </Link>
      <Link className={getLinkClasses("/verses")} href="#">
        <span className="material-symbols-outlined mb-1" style={getIconFill("/verses")}>auto_stories</span>
        <span className="text-label-caps font-label-caps">Verses</span>
      </Link>
      <Link className={getLinkClasses("/reflect")} href="#">
        <span className="material-symbols-outlined mb-1" style={getIconFill("/reflect")}>self_improvement</span>
        <span className="text-label-caps font-label-caps">Reflect</span>
      </Link>
      <Link className={getLinkClasses("/profile")} href="/profile">
        <span className="material-symbols-outlined mb-1" style={getIconFill("/profile")}>person</span>
        <span className="text-label-caps font-label-caps">Profile</span>
      </Link>
    </nav>
  );
}
