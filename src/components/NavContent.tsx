'use client';

import Link from 'next/link';
import { useNavigationTranslation } from '@/hooks/useTranslation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import LogoutButton from '@/components/auth/LogoutButton';
import Logo from '@/components/ui/logo';

interface NavContentProps {
  session: { id: number; username: string } | null;
}

export function NavContent({ session }: NavContentProps) {
  const tNav = useNavigationTranslation();

  return (
    <div className="container mx-auto flex justify-between items-center">
      <Link href="/" className="hover:opacity-80 transition-opacity">
        <Logo size="md" showText={true} />
      </Link>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex gap-4 items-center">
          <Link href="/ranking" className="hover:text-muted-foreground transition-colors">
            {tNav('ranking')}
          </Link>
          <Link href="/profile" className="hover:text-muted-foreground transition-colors">
            {tNav('profile')}
          </Link>
        </div>
        <div className="sm:hidden flex gap-2">
          <Link
            href="/ranking"
            className="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors"
          >
            {tNav('rankShort')}
          </Link>
          <Link
            href="/profile"
            className="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors"
          >
            {tNav('profileShort')}
          </Link>
        </div>
        <LanguageSelector variant="toggle" />
        <ThemeToggle />
        {session ? (
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm hidden sm:inline">
              {tNav('welcome', { username: session.username })}
            </span>
            <span className="text-xs sm:hidden">{session.username}</span>
            <LogoutButton />
          </div>
        ) : (
          <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">{tNav('notLoggedIn')}</span>
        )}
      </div>
    </div>
  );
}
