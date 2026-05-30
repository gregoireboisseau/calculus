import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Geist } from 'next/font/google';
import { PwaRegistration } from '@/components/PwaRegistration';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  metadataBase: new URL('https://calculus-game.netlify.app'),
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
    icon: [
      { url: '/icons/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
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
