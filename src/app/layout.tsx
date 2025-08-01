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
            <Link href="/" className="font-bold text-xl">
              Minesweeper
            </Link>
            <div className="space-x-4 flex items-center">
              <Link href="/ranking">Ranking</Link>
              <Link href="/profile">My Profile</Link>
              {session ? (
                <>
                  <span className="text-sm">Welcome, {session.username}!</span>
                  <LogoutButton />
                </>
              ) : (
                <span className="text-sm text-gray-400">Not logged in</span>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
