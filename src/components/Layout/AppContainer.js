import { Box } from '@chakra-ui/react';

const AppContainer = ({ children, hasBottomNav = false, ...props }) => {
  return (
    <Box
      minH="100vh"
      bg="#232323"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        border="1px solid white"
        borderRadius="xl"
        maxW="450px"
        minH="950px"
        maxH="950px"
        w="full"
        bg="#232323"
        overflow="hidden"
        position="relative"
        display="flex"
        flexDirection="column"
        {...props}
      >
        {/* Main content area with proper height constraints */}
        <Box
          flex="1"
          
          overflow="auto"
          height={hasBottomNav ? "calc(100% - 80px)" : "950px"}
          sx={{
            // Hide scrollbars while maintaining scroll functionality
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': {
              display: 'none', // Chrome, Safari, Edge
            },
          }}
        >
          {children}
        </Box>

        {/* Bottom navigation space reservation */}
        {hasBottomNav && (
          <Box
            height="80px"
            flexShrink={0}
            pointerEvents="none"
          />
        )}
      </Box>
    </Box>
  );
};

export default AppContainer;
