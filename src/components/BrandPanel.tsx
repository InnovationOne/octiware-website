'use client';

import { motion } from 'framer-motion';

interface BrandPanelProps {
  variant: 'game' | 'pc';
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  isHovered: boolean;
  isSiblingHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function BrandPanel({
  variant,
  eyebrow,
  title,
  description,
  cta,
  href,
  isHovered,
  isSiblingHovered,
  onMouseEnter,
  onMouseLeave,
}: BrandPanelProps) {
  const isGame = variant === 'game';
  const accentColor = isGame ? '#F9C84B' : '#3a80b8';
  const glowShadow = isGame
    ? '0 0 28px rgba(249,200,75,0.35)'
    : '0 0 28px rgba(43,110,160,0.45)';
  const borderGlow = isGame
    ? 'rgba(249,200,75,0.5)'
    : 'rgba(43,110,160,0.6)';

  return (
    <a
      href={href}

      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="block w-full h-full relative overflow-hidden"
      style={{ textDecoration: 'none' }}
    >
      {/* ── Background media (scales on hover) ─────────────────────── */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {isGame ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/media/index-hero-poster.jpg"
            className="w-full h-full object-cover"
            aria-hidden="true"
          >
            <source src="/media/index-hero.av1.webm" type="video/webm; codecs=av01" />
            <source src="/media/index-hero.vp9.webm" type="video/webm" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/pc-hero.jpg"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        )}
      </motion.div>

      {/* ── Permanent dark overlay (lightens on hover) ───────────────── */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none"
        animate={{ opacity: isHovered ? 0.28 : isSiblingHovered ? 0.68 : 0.52 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />

      {/* ── Bottom gradient for text legibility ──────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 38%, transparent 65%)',
        }}
      />

      {/* ── Colored accent gradient (subtle brand identity) ──────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0.5 }}
        transition={{ duration: 0.45 }}
        style={{
          background: isGame
            ? 'radial-gradient(ellipse at 20% 80%, rgba(249,200,75,0.12) 0%, transparent 55%)'
            : 'radial-gradient(ellipse at 80% 80%, rgba(43,110,160,0.14) 0%, transparent 55%)',
        }}
      />

      {/* ── Hover border glow ─────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{
          boxShadow: `inset 0 0 0 1px ${borderGlow}`,
        }}
      />

      {/* ── Vertical divider (right edge of game panel) ─────────────── */}
      {isGame && (
        <div
          className="absolute right-0 top-0 bottom-0 w-px pointer-events-none"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        />
      )}

      {/* ── Content — bottom-aligned, always visible ─────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-14">
        {/* Eyebrow */}
        <span
          className="block text-xs font-semibold uppercase tracking-[0.22em] mb-3"
          style={{ color: accentColor }}
        >
          {eyebrow}
        </span>

        {/* Title */}
        <motion.h2
          className="font-bold tracking-tight text-white leading-none text-4xl md:text-5xl lg:text-6xl"
          animate={{ y: isHovered ? -4 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h2>

        {/* Description — always visible */}
        <p className="text-white/70 text-sm md:text-base leading-relaxed mt-4 max-w-xs">
          {description}
        </p>

        {/* CTA */}
        <div className="mt-6">
          <motion.span
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border font-semibold text-sm"
            animate={
              isHovered
                ? {
                    boxShadow: glowShadow,
                    borderColor: `${accentColor}99`,
                  }
                : {
                    boxShadow: 'none',
                    borderColor: `${accentColor}44`,
                  }
            }
            transition={{ duration: 0.3 }}
            style={{ color: accentColor }}
          >
            {cta}
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </motion.svg>
          </motion.span>
        </div>
      </div>
    </a>
  );
}
