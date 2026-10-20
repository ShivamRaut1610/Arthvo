import type { Metadata, Viewport } from 'next';
import './globals.css';
import { EnvironmentProvider } from '@/contexts/EnvironmentContext';
import { UserProvider } from '@/contexts/UserContext';

export const metadata: Metadata = {
  title: 'Arthvo — Kya tu Arthvo hai?',
  description: 'India\'s first gamified financial awareness universe for young Indians. Paisa samjho. Zindagi jiyo.',
  keywords: ['NPS', 'retirement', 'financial literacy', 'India', 'pension', 'PFRDA', 'savings'],
  authors: [{ name: 'Shivam Dnyaneshwar Raut' }],
  openGraph: {
    title: 'Arthvo — Kya tu Arthvo hai?',
    description: 'India\'s first gamified financial awareness universe for young Indians.',
    url: 'https://arthvo.in',
    siteName: 'Arthvo',
    locale: 'hi_IN',
    type: 'website',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#F5A623',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" data-theme="dhoop" data-lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Hind:wght@400;500;600;700&family=Mukta+Malar:wght@400;500;700&family=Hind+Guntur:wght@400;500;700&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <EnvironmentProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </EnvironmentProvider>
      </body>
    </html>
  );
}
