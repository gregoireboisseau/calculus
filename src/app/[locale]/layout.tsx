import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { LangAttribute } from '@/components/LangAttribute';
import { LegalModal } from '@/components/LegalModal';
import { InstallBanner } from '@/components/InstallBanner';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr ? 'Jeu du jour' : 'Daily Game',
    description: isFr
      ? 'Atteignez le nombre cible en 100 secondes. Un nouveau tirage chaque jour, gratuit et sans inscription.'
      : 'Reach the target number in 100 seconds. A new draw every day, free and no sign-up.',
    openGraph: {
      locale: isFr ? 'fr_FR' : 'en_GB',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: '/fr', en: '/en' },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'fr' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <>
      <LangAttribute locale={locale} />
      <NextIntlClientProvider messages={messages}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {children}
          <footer style={{ marginTop: 12 }}>
            <LegalModal />
          </footer>
        </div>
        <InstallBanner />
      </NextIntlClientProvider>
    </>
  );
}
