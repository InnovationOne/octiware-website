import { getTranslations } from 'next-intl/server';
import HubLayout from '@/components/HubLayout';

export default async function HubPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale });

  return (
    <HubLayout
      siteTitle={t('site.title')}
      tagline={t('site.tagline')}
      gamePanel={{
        eyebrow: t('panels.game.eyebrow'),
        title: t('panels.game.title'),
        description: t('panels.game.description'),
        cta: t('panels.game.cta'),
        href: 'https://rusttohearth.octiware.com',
      }}
      pcPanel={{
        eyebrow: t('panels.pc.eyebrow'),
        title: t('panels.pc.title'),
        description: t('panels.pc.description'),
        cta: t('panels.pc.cta'),
        href: 'https://pc.octiware.com',
      }}
      footerRights={t('footer.rights')}
    />
  );
}
