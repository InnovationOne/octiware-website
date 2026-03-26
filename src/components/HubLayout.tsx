'use client';

import { motion, MotionConfig } from 'framer-motion';
import SplitPanel from './SplitPanel';

interface PanelData {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}

interface HubLayoutProps {
  siteTitle: string;
  tagline: string;
  gamePanel: PanelData;
  pcPanel: PanelData;
  footerRights: string;
}

export default function HubLayout({
  siteTitle,
  tagline,
  gamePanel,
  pcPanel,
  footerRights,
}: HubLayoutProps) {
  const year = new Date().getFullYear();

  return (
    // reducedMotion="user" disables all Framer Motion animations when the OS
    // "reduce motion" accessibility setting is enabled.
    <MotionConfig reducedMotion="user">
      <div className="relative w-full h-[100dvh] overflow-hidden bg-background">

        {/* ── Full-height split panels ──────────────────────────────────────── */}
        <div className="absolute inset-0">
          <SplitPanel gamePanel={gamePanel} pcPanel={pcPanel} />
        </div>

        {/* ── Floating header overlay ───────────────────────────────────────── */}
        <motion.header
          className="absolute top-0 left-0 right-0 z-20 pt-6 sm:pt-8 pb-8 sm:pb-10 text-center pointer-events-none select-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.20) 70%, transparent 100%)',
          }}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-[0.35em] text-white">
            {siteTitle}
          </h1>
          {/* Tagline + decorative lines — hidden on very small phones to avoid overflow */}
          <div className="mt-2 hidden xs:flex items-center justify-center gap-2 sm:gap-3">
            <div className="h-px w-4 sm:w-6" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <p
              className="text-[9px] sm:text-[10px] font-medium tracking-[0.2em] uppercase"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              {tagline}
            </p>
            <div className="h-px w-4 sm:w-6" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          </div>
        </motion.header>

        {/* ── Floating footer overlay ───────────────────────────────────────── */}
        <motion.footer
          className="absolute bottom-0 left-0 right-0 z-20 py-3 text-center pointer-events-none select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <p className="text-[10px] sm:text-xs tracking-wide" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © {year} Octiware. {footerRights}
          </p>
        </motion.footer>

      </div>
    </MotionConfig>
  );
}
