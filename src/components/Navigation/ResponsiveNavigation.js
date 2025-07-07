import { useBreakpointValue } from '@chakra-ui/react';
import BottomNavigation from './BottomNavigation';
import SideNavigation from './SideNavigation';

/**
 * ResponsiveNavigation - Switches between bottom navigation (mobile/tablet) 
 * and side navigation (desktop) based on screen size
 */
const ResponsiveNavigation = ({ sideNavCollapsed = false }) => {
  // Determine which navigation to show based on breakpoint
  const showSideNav = useBreakpointValue({ 
    base: false, 
    lg: true 
  });

  return (
    <>
      {showSideNav ? (
        <SideNavigation collapsed={sideNavCollapsed} />
      ) : (
        <BottomNavigation />
      )}
    </>
  );
};

export default ResponsiveNavigation;
