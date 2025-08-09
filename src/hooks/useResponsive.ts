import { useEffect, useState } from 'react';
import { breakpoints, breakpointUtils } from '../theme/breakpoints';

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoints.sm);
  const [isTablet, setIsTablet] = useState(() => window.innerWidth >= breakpoints.sm && window.innerWidth < breakpoints.lg);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= breakpoints.lg);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>(() => 
    breakpointUtils.getCurrentBreakpoint(window.innerWidth)
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia(`(max-width: ${breakpoints.sm - 1}px)`);
    const tabletQuery = window.matchMedia(`(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.lg - 1}px)`);
    const desktopQuery = window.matchMedia(`(min-width: ${breakpoints.lg}px)`);

    const updateResponsive = () => {
      const width = window.innerWidth;
      setIsMobile(mobileQuery.matches);
      setIsTablet(tabletQuery.matches);
      setIsDesktop(desktopQuery.matches);
      setCurrentBreakpoint(breakpointUtils.getCurrentBreakpoint(width));
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

  return { 
    isMobile, 
    isTablet, 
    isDesktop, 
    currentBreakpoint,
    breakpoints,
    // Funciones helper
    getResponsiveValue: <T>(values: { xs: T; sm?: T; md?: T; lg?: T; xl?: T }): T => 
      breakpointUtils.getResponsiveValue(values, currentBreakpoint),
    isXs: currentBreakpoint === 'xs',
    isSm: currentBreakpoint === 'sm',
    isMd: currentBreakpoint === 'md',
    isLg: currentBreakpoint === 'lg',
    isXl: currentBreakpoint === 'xl'
  };
} 