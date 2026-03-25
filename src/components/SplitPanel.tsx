'use client';

import { useState, useEffect } from 'react';
import BrandPanel from './BrandPanel';

interface PanelData {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}

interface SplitPanelProps {
  gamePanel: PanelData;
  pcPanel: PanelData;
}

export default function SplitPanel({ gamePanel, pcPanel }: SplitPanelProps) {
  const [hovered, setHovered] = useState<'game' | 'pc' | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getFlexBasis = (panel: 'game' | 'pc'): string => {
    if (isMobile || hovered === null) return '50%';
    return hovered === panel ? '55%' : '45%';
  };

  const transition = 'flex-basis 0.45s cubic-bezier(0.22, 1, 0.36, 1)';

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <div
        className="relative overflow-hidden"
        style={{
          ...(isMobile
            ? { flex: '1 1 0' }
            : { flexBasis: getFlexBasis('game'), flexShrink: 0, flexGrow: 0, transition }),
        }}
      >
        <BrandPanel
          variant="game"
          {...gamePanel}
          isHovered={hovered === 'game'}
          isSiblingHovered={hovered === 'pc'}
          onMouseEnter={() => !isMobile && setHovered('game')}
          onMouseLeave={() => setHovered(null)}
        />
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          ...(isMobile
            ? { flex: '1 1 0' }
            : { flexBasis: getFlexBasis('pc'), flexShrink: 0, flexGrow: 0, transition }),
        }}
      >
        <BrandPanel
          variant="pc"
          {...pcPanel}
          isHovered={hovered === 'pc'}
          isSiblingHovered={hovered === 'game'}
          onMouseEnter={() => !isMobile && setHovered('pc')}
          onMouseLeave={() => setHovered(null)}
        />
      </div>
    </div>
  );
}
