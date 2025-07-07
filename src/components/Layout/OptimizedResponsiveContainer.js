import React, { memo, useMemo } from 'react';
import { Box, Container } from '@chakra-ui/react';
import { useResponsive } from '../../hooks/useResponsive';

/**
 * Performance-optimized responsive container with memoization
 */
const OptimizedResponsiveContainer = memo(({ 
  children, 
  hasBottomNav = false, 
  variant = 'app',
  enableSideNavMargin = true,
  ...props 
}) => {
  const { isMobile, navMargin, containerPadding } = useResponsive();

  // Memoize container styles for better performance
  const containerStyles = useMemo(() => ({
    minH: "100vh",
    bg: "#232323",
    display: "flex",
    alignItems: { base: "center", md: "flex-start" },
    justifyContent: "center",
    p: { base: 4, md: 0 },
  }), []);

  const innerStyles = useMemo(() => ({
    variant,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    // Add side navigation margin only on desktop and when enabled
    ml: enableSideNavMargin ? navMargin : 0,
    ...props,
  }), [variant, enableSideNavMargin, navMargin, props]);

  const contentStyles = useMemo(() => ({
    flex: "1",
    overflow: "auto",
    height: hasBottomNav ? 
      { base: "calc(100vh - 160px)", md: "calc(100vh - 80px)" } : 
      { base: "950px", md: "100vh" },
    minH: hasBottomNav ? 
      { base: "calc(100vh - 160px)", md: "calc(100vh - 80px)" } : 
      { base: "950px", md: "100vh" },
    sx: {
      // Hide scrollbar for cleaner look
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  }), [hasBottomNav]);

  const spacerStyles = useMemo(() => ({
    height: "80px",
    flexShrink: 0,
    pointerEvents: "none",
    // Hide spacer on desktop where navigation might be different
    display: { base: "block", lg: "none" },
  }), []);

  return (
    <Box {...containerStyles}>
      <Container {...innerStyles}>
        {/* Main content area */}
        <Box {...contentStyles}>
          {children}
        </Box>

        {/* Bottom navigation spacer */}
        {hasBottomNav && (
          <Box {...spacerStyles} />
        )}
      </Container>
    </Box>
  );
});

OptimizedResponsiveContainer.displayName = 'OptimizedResponsiveContainer';

export default OptimizedResponsiveContainer;
