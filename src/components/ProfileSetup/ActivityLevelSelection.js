import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { useUserData } from '../../contexts/UserDataContext';

const activityLevels = [
  {
    value: 'beginer',
    title: 'Beginner',
    description: 'Little to no exercise, desk job',
    detail: 'Less than 1 hour per week',
    icon: '🪑',
    color: 'gray.500'
  },
  {
    value: 'intermediate',
    title: 'Intermediate',
    description: 'Light exercise 1-3 days per week',
    detail: '1-3 hours per week',
    icon: '🚶‍♂️',
    color: 'blue.500'
  },
  {
    value: 'advanced',
    title: 'Advanced',
    description: 'Moderate exercise 3-5 days per week',
    detail: '3-5 hours per week',
    icon: '🏃‍♂️',
    color: 'green.500'
  },
];

const ActivityLevelSelection = ({ onNext }) => {
  const { profileData, updateProfileData } = useUserData();
  const textColor = 'white';

  const handleActivitySelect = (activityLevel) => {
    updateProfileData({ activityLevel });

    setTimeout(() => {
      onNext();
    }, 300);
  };

  return (
    <Box flex={1} display="flex" alignItems="center" justifyContent="center" px={6}>
      <VStack spacing={8} maxW="400px" w="full">
        {}
        <VStack spacing={4} textAlign="center">
          <Box
            w="80px"
            h="80px"
            bg="success.100"
            borderRadius="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="2xl"
          >
            ⚡
          </Box>

          <Text fontSize="3xl" fontWeight="bold" color={textColor}>
            Activity Level
          </Text>
          <Text fontSize="md" color="gray.500" lineHeight="tall">
            How active are you currently? This helps us set the right intensity
          </Text>
        </VStack>

        {}
        <VStack spacing={3} w="full">
          {activityLevels.map((level) => (
            <Button
              key={level.value}
              size="lg"
              variant={profileData.activityLevel === level.value ? 'solid' : 'outline'}
              colorScheme={profileData.activityLevel === level.value ? 'primary' : 'gray'}
              w="full"
              h="auto"
              py={4}
              onClick={() => handleActivitySelect(level.value)}
              leftIcon={
                <Box fontSize="2xl" mr={2}>
                  {level.icon}
                </Box>
              }
              justifyContent="flex-start"
              px={6}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
            >
              <VStack spacing={1} align="start" flex={1}>
                <Text fontSize="lg" fontWeight="semibold" textAlign="left">
                  {level.title}
                </Text>
                <Text
                  fontSize="sm"
                  opacity={0.8}
                  textAlign="left"
                  color={profileData.activityLevel === level.value ? 'white' : 'gray.500'}
                >
                  {level.description}
                </Text>
                <Text
                  fontSize="xs"
                  opacity={0.6}
                  textAlign="left"
                  color={profileData.activityLevel === level.value ? 'white' : 'gray.400'}
                >
                  {level.detail}
                </Text>
              </VStack>
            </Button>
          ))}
        </VStack>

        {}
        <Box
          bg="blue.50"
          border="1px solid"
          borderColor="blue.200"
          borderRadius="lg"
          p={4}
          w="full"
        >
          <Text fontSize="sm" color="blue.700" textAlign="center">
            💡 Don't worry, you can always adjust this later as your fitness level improves!
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default ActivityLevelSelection;
