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
      px={4}
      py={2}
      borderBottomRadius="xl"
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      zIndex={1000}
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
              minW="60px"
              py={1}
            >
              <IconComponent
                w="24px"
                h="24px"
                color={isActive ? activeColor : inactiveColor}
                transition="color 0.2s"
              />
              <Text
                fontSize="xs"
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
