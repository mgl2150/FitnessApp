import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  HStack,
  VStack,
  Text,
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

const BottomNavigation = () => {
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
      borderTop="1px solid"
      borderColor={borderColor}
      px={{ base: 4, md: 6 }}
      py={{ base: 2, md: 3 }}
      borderBottomRadius={{ base: "xl", md: "none" }}
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex={1000}
      // Hide on desktop where side navigation is used
      display={{ base: "block", lg: "none" }}
    >
      <HStack justify="space-around" align="center">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;

          return (
            <VStack
              key={item.id}
              spacing={1}
              cursor="pointer"
              onClick={() => handleNavigation(item.path)}
              minW={{ base: "60px", md: "80px" }}
              py={{ base: 1, md: 2 }}
              px={{ base: 2, md: 3 }}
              borderRadius="md"
              _hover={{
                bg: 'gray.700',
              }}
              transition="all 0.2s"
            >
              <IconComponent
                w={{ base: "24px", md: "28px" }}
                h={{ base: "24px", md: "28px" }}
                color={isActive ? activeColor : inactiveColor}
                transition="color 0.2s"
              />
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={isActive ? activeColor : inactiveColor}
                fontWeight={isActive ? 'semibold' : 'normal'}
                transition="color 0.2s"
              >
                {item.label}
              </Text>
            </VStack>
          );
        })}
      </HStack>
    </Box>
  );
};

export default BottomNavigation;
