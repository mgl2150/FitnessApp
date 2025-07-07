import { Box, Container } from '@chakra-ui/react';

/**
 * ResponsiveContainer - A responsive wrapper that adapts to different screen sizes
 * while maintaining the mobile-first approach
 */
const ResponsiveContainer = ({ 
  children, 
  hasBottomNav = false, 
  variant = 'app',
  ...props 
}) => {
  return (
    <Box
      minH="100vh"
      bg="#232323"
      display="flex"
      alignItems={{ base: "center", md: "flex-start" }}
      justifyContent="center"
      p={{ base: 4, md: 0 }}
    >
      <Container
        variant={variant}
        position="relative"
        display="flex"
        flexDirection="column"
        {...props}
      >
        {/* Main content area */}
        <Box
          flex="1"
          overflow="auto"
          height={hasBottomNav ? 
            { base: "calc(100vh - 160px)", md: "auto" } : 
            { base: "950px", md: "auto" }
          }
          minH={hasBottomNav ? 
            { base: "calc(100vh - 160px)", md: "calc(100vh - 80px)" } : 
            { base: "950px", md: "100vh" }
          }
          sx={{
            // Hide scrollbar
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {children}
        </Box>

        {/* Bottom navigation spacer */}
        {hasBottomNav && (
          <Box
            height="80px"
            flexShrink={0}
            pointerEvents="none"
            display={{ base: "block", lg: "none" }} // Hide on desktop where nav might be different
          />
        )}
      </Container>
    </Box>
  );
};

export default ResponsiveContainer;
