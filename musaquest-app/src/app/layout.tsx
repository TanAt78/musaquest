import type { Metadata } from "next";
import "./globals.css";
import TopNavBar from "@/components/TopNavBar";
import BottomMobileNav from "@/components/BottomMobileNav";
import { getAuthUser, isAdminEmail } from "@/utils/supabase/auth";

export const metadata: Metadata = {
  title: "MusaQuest - The Traveler",
  description: "Gamified Islamic storytelling app for Muslim children",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthUser();
  const authState = {
    isAuthenticated: !!user,
    email: user?.email ?? null,
    isAdmin: isAdminEmail(user?.email),
  };

  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Literata:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-background text-on-background font-body-md text-body-md min-h-screen pb-[100px] md:pb-0 selection:bg-secondary-container selection:text-on-secondary-container antialiased"
      >
        <TopNavBar auth={authState} />
        {children}
        <BottomMobileNav />
      </body>
    </html>
  );
}
