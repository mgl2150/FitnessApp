import { useBreakpointValue } from '@chakra-ui/react';
import { useMemo } from 'react';

/**
 * Custom hook for responsive values with performance optimization
 */
export const useResponsive = () => {
  // Memoized breakpoint values for better performance
  const breakpoints = useMemo(() => ({
    isMobile: { base: true, md: false },
    isTablet: { base: false, md: true, lg: false },
    isDesktop: { base: false, lg: true },
    isLargeDesktop: { base: false, xl: true },
  }), []);

  const isMobile = useBreakpointValue(breakpoints.isMobile);
  const isTablet = useBreakpointValue(breakpoints.isTablet);
  const isDesktop = useBreakpointValue(breakpoints.isDesktop);
  const isLargeDesktop = useBreakpointValue(breakpoints.isLargeDesktop);

  // Common responsive values
  const spacing = useMemo(() => ({
    small: { base: 4, md: 6 },
    medium: { base: 6, md: 8, lg: 10 },
    large: { base: 8, md: 12, lg: 16 },
  }), []);

  const fontSize = useMemo(() => ({
    small: { base: 'sm', md: 'md' },
    medium: { base: 'md', md: 'lg', lg: 'xl' },
    large: { base: 'lg', md: 'xl', lg: '2xl' },
    heading: { base: 'xl', md: '2xl', lg: '3xl' },
  }), []);

  const gridColumns = useMemo(() => ({
    cards: { base: 2, md: 3, lg: 4, xl: 5 },
    features: { base: 1, sm: 2, md: 3, lg: 4 },
    stats: { base: 3, md: 3, lg: 3 },
  }), []);

  const containerSizes = useMemo(() => ({
    mobile: '450px',
    tablet: '768px',
    desktop: '1200px',
    wide: '1440px',
  }), []);

  return {
    // Breakpoint booleans
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    
    // Responsive values
    spacing,
    fontSize,
    gridColumns,
    containerSizes,
    
    // Navigation margin for desktop side nav
    navMargin: { base: 0, lg: "200px" },
    
    // Common padding patterns
    containerPadding: { base: 6, md: 8, lg: 12 },
    cardPadding: { base: 4, md: 6, lg: 8 },
    
    // Button sizes
    buttonSize: { base: "md", md: "lg" },
    iconButtonSize: { base: "lg", md: "xl" },
  };
};

export default useResponsive;
