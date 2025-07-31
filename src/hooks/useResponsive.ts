import { useEffect, useState } from 'react';

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(() => window.innerWidth > 768 && window.innerWidth <= 1024);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth > 1024);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const tabletQuery = window.matchMedia('(min-width: 769px) and (max-width: 1024px)');
    const desktopQuery = window.matchMedia('(min-width: 1025px)');

    const updateResponsive = () => {
      setIsMobile(mobileQuery.matches);
      setIsTablet(tabletQuery.matches);
      setIsDesktop(desktopQuery.matches);
    };

    // Set initial values
    updateResponsive();

    // Add event listeners
    mobileQuery.addEventListener('change', updateResponsive);
    tabletQuery.addEventListener('change', updateResponsive);
    desktopQuery.addEventListener('change', updateResponsive);

    return () => {
      mobileQuery.removeEventListener('change', updateResponsive);
      tabletQuery.removeEventListener('change', updateResponsive);
      desktopQuery.removeEventListener('change', updateResponsive);
    };
  }, []);

  return { isMobile, isTablet, isDesktop };
} 