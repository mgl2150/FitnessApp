import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { useUserData } from '../../contexts/UserDataContext';
import { useAuth } from '../../contexts/AuthContext';

const ProfileCompletion = ({ onNext }) => {
  const { profileData } = useUserData();
  const { isLoading } = useAuth();
  const textColor = 'white';
  const bgColor = '#2D3748';

  const getGoalDisplay = (goal) => {
    const goalMap = {
      lose_weight: { label: 'Lose Weight', icon: '🔥', color: 'red' },
      gain_muscle: { label: 'Gain Muscle', icon: '💪', color: 'blue' },
      maintain_fitness: { label: 'Stay Fit', icon: '⚖️', color: 'green' },
      improve_endurance: { label: 'Improve Endurance', icon: '🏃‍♂️', color: 'orange' },
      general_health: { label: 'General Health', icon: '❤️', color: 'pink' }
    };
    return goalMap[goal] || { label: 'Not specified', icon: '❓', color: 'gray' };
  };

  const getActivityDisplay = (level) => {
    const levelMap = {
      beginer: { label: 'Beginner', icon: '🪑' },
      intermediate: { label: 'Intermediate', icon: '🚶‍♂️' },
      advanced: { label: 'Advanced', icon: '🏃‍♂️' },
    };
    return levelMap[level] || { label: 'Not specified', icon: '❓' };
  };

  const goalInfo = getGoalDisplay(profileData.goal);
  const activityInfo = getActivityDisplay(profileData.activityLevel);

  return (
    <Box flex={1} display="flex" alignItems="center" justifyContent="center" px={6}>
      <VStack spacing={8} maxW="400px" w="full">
        {}
        <VStack spacing={4} textAlign="center">
          <Box
            w="100px"
            h="100px"
            bg="success.100"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="3xl"
          >
            🎉
          </Box>

          <Text fontSize="3xl" fontWeight="bold" color={textColor}>
            You're All Set!
          </Text>
          <Text fontSize="md" color="gray.500" lineHeight="tall">
            Here's a summary of your profile. Ready to start your fitness journey?
          </Text>
        </VStack>

        {}
        <Box
          bg={bgColor}
          borderRadius="xl"
          p={6}
          w="full"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <VStack spacing={4}>
            {}
            <HStack spacing={4} w="full">
              <Avatar
                size="lg"
                name={`${profileData.firstName} ${profileData.lastName}`}
                bg="primary.500"
                color="white"
              />
              <VStack align="start" spacing={1} flex={1}>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  {profileData.firstName} {profileData.lastName}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {profileData.email}
                </Text>
              </VStack>
            </HStack>

            <Divider />

            {}
            <VStack spacing={3} w="full">
              {}
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">Age</Text>
                <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                  {profileData.age || 'Not specified'} years
                </Text>
              </HStack>

              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">Gender</Text>
                <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                  {profileData.gender ?
                    profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1) :
                    'Not specified'
                  }
                </Text>
              </HStack>

              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">Weight</Text>
                <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                  {profileData.weight ?
                    `${profileData.weight} ${profileData.weightUnit}` :
                    'Not specified'
                  }
                </Text>
              </HStack>

              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">Height</Text>
                <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                  {profileData.height ?
                    profileData.heightUnit === 'cm' ?
                      `${profileData.height} cm` :
                      `${Math.floor(profileData.height / 12)}'${Math.round(profileData.height % 12)}"` :
                    'Not specified'
                  }
                </Text>
              </HStack>

              <Divider />

              {}
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">Primary Goal</Text>
                <Badge colorScheme={goalInfo.color} variant="subtle">
                  {goalInfo.icon} {goalInfo.label}
                </Badge>
              </HStack>

              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">Activity Level</Text>
                <Badge colorScheme="blue" variant="subtle">
                  {activityInfo.icon} {activityInfo.label}
                </Badge>
              </HStack>
            </VStack>
          </VStack>
        </Box>

        {}
        <Button
          size="lg"
          colorScheme="primary"
          w="full"
          onClick={onNext}
          isLoading={isLoading}
          loadingText="Setting up your profile..."
        >
          Complete Setup
        </Button>

        {}
        <Text fontSize="xs" color="gray.400" textAlign="center" lineHeight="tall">
          Your information is secure and will only be used to personalize your fitness experience.
        </Text>
      </VStack>
    </Box>
  );
};

export default ProfileCompletion;
