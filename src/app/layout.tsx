import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { getSession } from '@/lib/session';
import LogoutButton from '@/components/auth/LogoutButton';

export const metadata: Metadata = {
  title: 'Minesweeper',
  description: 'Minesweeper game built with Next.js',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-lg sm:text-xl">
              Minesweeper
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex space-x-4 items-center">
                <Link href="/ranking" className="hover:text-gray-300 transition-colors">Ranking</Link>
                <Link href="/profile" className="hover:text-gray-300 transition-colors">My Profile</Link>
              </div>
              <div className="sm:hidden flex space-x-2">
                <Link href="/ranking" className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors">Rank</Link>
                <Link href="/profile" className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors">Profile</Link>
              </div>
              {session ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm hidden sm:inline">Welcome, {session.username}!</span>
                  <span className="text-xs sm:hidden">{session.username}</span>
                  <LogoutButton />
                </div>
              ) : (
                <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">Not logged in</span>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-2 sm:p-4">{children}</main>
      </body>
    </html>
  );
}
