import { Box } from '@chakra-ui/react';

const AppContainer = ({ children, hasBottomNav = false, responsive = true, hasSideNav = false, ...props }) => {
  // Responsive styles when responsive=true, legacy styles when responsive=false
  const containerStyles = responsive ? {
    minH: "100vh",
    bg: "#232323",
    display: "flex",
    alignItems: { base: "center", md: "flex-start" },
    justifyContent: "center",
    p: { base: 0, md: 0 },
  } : {
    minH: "100vh",
    bg: "#232323",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 4,
  };

  const innerStyles = responsive ? {
    border: { base: "none", md: "none" },
    borderRadius: { base: "xl", md: "none" },
    maxW: { base: "550px", md: "768px", lg: "1200px", xl: "1440px" },
    minH: { base: "950px", md: "100vh" },
    maxH: { base: "950px", md: "none" },
    w: "full",
    bg: "#232323",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    // Add side navigation margin only when hasSideNav is true and on desktop
    ml: hasSideNav ? { base: 0, lg: "200px" } : 0,
  } : {
    borderRadius: "xl",
    maxW: "450px",
    minH: "950px",
    maxH: "950px",
    w: "full",
    bg: "#232323",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <Box {...containerStyles}>
      <Box {...innerStyles} {...props}>
        {/* Main content area */}
        <Box
          flex="1"
          overflow="auto"
          height={hasBottomNav ?
            (responsive ?
              { base: "calc(100% - 100px)", md: "calc(100vh - 80px)" } :
              "calc(100% - 100px)"
            ) :
            (responsive ?
              { base: "950px", md: "100vh" } :
              "950px"
            )
          }
          pb={hasBottomNav ? { base: 4, lg: 0 } : 0}
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
            height={{ base: "100px", lg: "80px" }}
            flexShrink={0}
            pointerEvents="none"
            // Hide spacer on desktop where navigation might be different
            display={responsive ? { base: "block", lg: "none" } : "block"}
          />
        )}
      </Box>
    </Box>
  );
};

export default AppContainer;
