import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  StarIcon,
  InfoIcon,
  ChatIcon
} from '@chakra-ui/icons';

const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    icon: HamburgerIcon,
    path: '/home',
  },
  {
    id: 'community',
    label: 'Community',
    icon: ChatIcon,
    path: '/community',
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: StarIcon,
    path: '/progress',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: InfoIcon,
    path: '/profile',
  },
];

const SideNavigation = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const bgColor = '#2D3748';
  const borderColor = 'gray.600';
  const activeColor = 'primary.500';
  const inactiveColor = 'gray.400';

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      w={collapsed ? "60px" : "200px"}
      h="100vh"
      position="fixed"
      left="0"
      top="0"
      zIndex={1000}
      transition="width 0.3s ease"
      display={{ base: "none", lg: "block" }}
    >
      <VStack spacing={2} p={4} align="stretch">
        {/* Logo/Brand area */}
        <Box mb={6} textAlign="center">
          <Text 
            fontSize={collapsed ? "lg" : "xl"} 
            fontWeight="bold" 
            color="white"
            transition="font-size 0.3s ease"
          >
            {collapsed ? "FB" : "FitBody"}
          </Text>
        </Box>

        {/* Navigation items */}
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;

          const navItem = (
            <HStack
              key={item.id}
              spacing={3}
              cursor="pointer"
              onClick={() => handleNavigation(item.path)}
              p={3}
              borderRadius="md"
              bg={isActive ? 'primary.500' : 'transparent'}
              color={isActive ? 'white' : inactiveColor}
              _hover={{
                bg: isActive ? 'primary.600' : 'gray.600',
                color: 'white',
              }}
              transition="all 0.2s"
              justify={collapsed ? "center" : "flex-start"}
            >
              <Icon as={IconComponent} w="20px" h="20px" />
              {!collapsed && (
                <Text fontSize="sm" fontWeight={isActive ? 'semibold' : 'normal'}>
                  {item.label}
                </Text>
              )}
            </HStack>
          );

          // Wrap with tooltip when collapsed
          return collapsed ? (
            <Tooltip key={item.id} label={item.label} placement="right">
              {navItem}
            </Tooltip>
          ) : navItem;
        })}
      </VStack>
    </Box>
  );
};

export default SideNavigation;
