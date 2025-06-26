import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { useUserData } from '../../contexts/UserDataContext';

const goalOptions = [
  {
    value: 'lose_weight',
    title: 'Lose Weight',
    description: 'Burn calories and reduce body fat',
    icon: '🔥',
    color: 'red.500'
  },
  {
    value: 'gain_muscle',
    title: 'Gain Muscle',
    description: 'Build strength and muscle mass',
    icon: '💪',
    color: 'blue.500'
  },
  {
    value: 'maintain_fitness',
    title: 'Stay Fit',
    description: 'Maintain current fitness level',
    icon: '⚖️',
    color: 'green.500'
  },
  {
    value: 'improve_endurance',
    title: 'Improve Endurance',
    description: 'Boost cardiovascular fitness',
    icon: '🏃‍♂️',
    color: 'orange.500'
  },
  {
    value: 'general_health',
    title: 'General Health',
    description: 'Overall wellness and health',
    icon: '❤️',
    color: 'pink.500'
  }
];

const GoalSelection = ({ onNext }) => {
  const { profileData, updateProfileData } = useUserData();
  const textColor = 'white';

  const handleGoalSelect = (goal) => {
    updateProfileData({ goal });
    // Auto-advance after selection
    setTimeout(() => {
      onNext();
    }, 300);
  };

  return (
    <Box flex={1} display="flex" alignItems="center" justifyContent="center" px={6}>
      <VStack spacing={8} maxW="400px" w="full">
        {/* Header */}
        <VStack spacing={4} textAlign="center">
          <Box
            w="80px"
            h="80px"
            bg="primary.100"
            borderRadius="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="2xl"
          >
            🎯
          </Box>
          
          <Text fontSize="3xl" fontWeight="bold" color={textColor}>
            What's your main goal?
          </Text>
          <Text fontSize="md" color="gray.500" lineHeight="tall">
            This helps us create a personalized workout plan just for you
          </Text>
        </VStack>

        {/* Goal Options */}
        <VStack spacing={3} w="full">
          {goalOptions.map((option) => (
            <Button
              key={option.value}
              size="lg"
              variant={profileData.goal === option.value ? 'solid' : 'outline'}
              colorScheme={profileData.goal === option.value ? 'primary' : 'gray'}
              w="full"
              h="auto"
              py={4}
              onClick={() => handleGoalSelect(option.value)}
              leftIcon={
                <Box fontSize="2xl" mr={2}>
                  {option.icon}
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
                  {option.title}
                </Text>
                <Text 
                  fontSize="sm" 
                  opacity={0.8} 
                  textAlign="left"
                  color={profileData.goal === option.value ? 'white' : 'gray.500'}
                >
                  {option.description}
                </Text>
              </VStack>
            </Button>
          ))}
        </VStack>

        {/* Skip Option */}
        <Button
          variant="ghost"
          size="sm"
          color="gray.500"
          onClick={onNext}
        >
          I'm not sure yet
        </Button>
      </VStack>
    </Box>
  );
};

export default GoalSelection;
