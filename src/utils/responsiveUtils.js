/**
 * Responsive design utilities and performance helpers
 */

// Debounce function for resize events
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get current breakpoint
export const getCurrentBreakpoint = () => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1440) return 'desktop';
  return 'wide';
};

// Check if device supports hover (desktop/laptop vs touch devices)
export const supportsHover = () => {
  return window.matchMedia('(hover: hover)').matches;
};

// Get optimal image size based on screen size and device pixel ratio
export const getOptimalImageSize = (baseSize = 300) => {
  const breakpoint = getCurrentBreakpoint();
  const dpr = window.devicePixelRatio || 1;
  
  const sizeMultipliers = {
    mobile: 1,
    tablet: 1.2,
    desktop: 1.5,
    wide: 2,
  };
  
  return Math.round(baseSize * sizeMultipliers[breakpoint] * dpr);
};

// Performance monitoring for responsive components
export const measureResponsivePerformance = (componentName, operation) => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    const result = operation();
    const end = performance.now();
    
    console.log(`[Responsive Performance] ${componentName}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return operation();
};

// Responsive grid calculator
export const calculateGridColumns = (containerWidth, minItemWidth = 280, maxColumns = 6) => {
  const columns = Math.floor(containerWidth / minItemWidth);
  return Math.min(Math.max(columns, 1), maxColumns);
};

// Responsive spacing calculator
export const getResponsiveSpacing = (baseSpacing = 4) => {
  const breakpoint = getCurrentBreakpoint();
  
  const spacingMultipliers = {
    mobile: 1,
    tablet: 1.25,
    desktop: 1.5,
    wide: 2,
  };
  
  return baseSpacing * spacingMultipliers[breakpoint];
};

// Check if reduced motion is preferred
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Responsive font size calculator
export const getResponsiveFontSize = (baseFontSize = 16) => {
  const breakpoint = getCurrentBreakpoint();
  
  const fontSizeMultipliers = {
    mobile: 1,
    tablet: 1.1,
    desktop: 1.2,
    wide: 1.3,
  };
  
  return baseFontSize * fontSizeMultipliers[breakpoint];
};

// Lazy loading intersection observer options
export const getLazyLoadingOptions = () => {
  const breakpoint = getCurrentBreakpoint();
  
  // Adjust root margin based on screen size for better performance
  const rootMarginMap = {
    mobile: '50px',
    tablet: '100px',
    desktop: '200px',
    wide: '300px',
  };
  
  return {
    rootMargin: rootMarginMap[breakpoint],
    threshold: 0.1,
  };
};

// Responsive animation duration
export const getAnimationDuration = (baseDuration = 200) => {
  if (prefersReducedMotion()) return 0;
  
  const breakpoint = getCurrentBreakpoint();
  
  // Slightly longer animations on larger screens
  const durationMultipliers = {
    mobile: 1,
    tablet: 1.1,
    desktop: 1.2,
    wide: 1.2,
  };
  
  return baseDuration * durationMultipliers[breakpoint];
};

export default {
  debounce,
  getCurrentBreakpoint,
  supportsHover,
  getOptimalImageSize,
  measureResponsivePerformance,
  calculateGridColumns,
  getResponsiveSpacing,
  prefersReducedMotion,
  getResponsiveFontSize,
  getLazyLoadingOptions,
  getAnimationDuration,
};
