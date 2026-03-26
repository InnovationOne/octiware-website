import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      type: 'website',
      url: 'https://octiware.com',
      siteName: 'Octiware',
      title: t('title'),
      description: t('description'),
      locale: locale === 'de' ? 'de_DE' : 'en_US',
    },
    icons: { icon: '/favicon.svg' },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://octiware.com/${locale}`,
      languages: {
        de: 'https://octiware.com/de',
        en: 'https://octiware.com/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as 'en' | 'de')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
