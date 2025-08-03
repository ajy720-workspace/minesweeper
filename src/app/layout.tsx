import type { Metadata } from 'next';
import './globals.css';
import { getSession } from '@/lib/session';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { HtmlLangUpdater } from '@/components/HtmlLangUpdater';
import { NavContent } from '@/components/NavContent';
import { IntlProvider } from '@/components/providers/IntlProvider';

export const metadata: Metadata = {
  title: 'Minesweeper',
  description: 'Clear the minefield by revealing all safe cells. Flag the mines and use logic to win!',
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
  },
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
        <LocaleProvider>
          <HtmlLangUpdater />
          <IntlProvider>
            <ThemeProvider>
              <nav className="bg-primary text-primary-foreground p-2">
                <NavContent session={session} />
              </nav>
              <main className="container mx-auto p-2 sm:p-4">{children}</main>
            </ThemeProvider>
          </IntlProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
