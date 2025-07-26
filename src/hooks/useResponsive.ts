import { useEffect, useState } from 'react';

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth > 900);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      setIsDesktop(!e.matches);
    };
    setIsMobile(mq.matches);
    setIsDesktop(!mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return { isMobile, isDesktop };
} 