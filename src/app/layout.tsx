import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Geist } from 'next/font/google';
import { PwaRegistration } from '@/components/PwaRegistration';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  metadataBase: new URL('https://calculus.netlify.app'),
  title: {
    template: '%s · Calculus',
    default: 'Calculus',
  },
  description: 'Le jeu de calcul mental quotidien. 100 secondes pour atteindre le nombre cible.',
  openGraph: {
    siteName: 'Calculus',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  appleWebApp: {
    capable: true,
    title: 'Calculus',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#cec8b6' },
    { media: '(prefers-color-scheme: dark)', color: '#202020' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={geist.variable} suppressHydrationWarning>
      <head>
        {/* Restore theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
