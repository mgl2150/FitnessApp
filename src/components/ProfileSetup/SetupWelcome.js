import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { useUserData } from '../../contexts/UserDataContext';

const SetupWelcome = ({ onNext }) => {
  const { profileData } = useUserData();
  const textColor = 'white';

  return (
    <Box flex={1} display="flex" alignItems="center" justifyContent="center" px={6}>
      <VStack spacing={8} maxW="400px" textAlign="center">
        {}
        <Box
          w="120px"
          h="120px"
          bg="primary.500"
          borderRadius="30px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="4xl"
          boxShadow="0 20px 40px rgba(0,0,0,0.1)"
        >
          🎯
        </Box>

        {}
        <VStack spacing={4}>
          <Text fontSize="3xl" fontWeight="bold" color={textColor} lineHeight="shorter">
            Let's Set Up Your Profile
          </Text>

          <Text fontSize="lg" color="gray.500" fontWeight="medium">
            Hi {profileData.firstName}! 👋
          </Text>

          <Text fontSize="md" color="gray.600" lineHeight="tall" textAlign="center">
            We'll ask you a few questions to personalize your fitness experience and create the perfect workout plan for you.
          </Text>
        </VStack>

        {}
        <VStack spacing={3} align="start" w="full">
          <HStack spacing={3}>
            <Box w="6px" h="6px" bg="primary.500" borderRadius="full" />
            <Text fontSize="sm" color="gray.600">
              Personalized workout recommendations
            </Text>
          </HStack>
          <HStack spacing={3}>
            <Box w="6px" h="6px" bg="primary.500" borderRadius="full" />
            <Text fontSize="sm" color="gray.600">
              Customized nutrition guidance
            </Text>
          </HStack>
          <HStack spacing={3}>
            <Box w="6px" h="6px" bg="primary.500" borderRadius="full" />
            <Text fontSize="sm" color="gray.600">
              Progress tracking and insights
            </Text>
          </HStack>
        </VStack>

        {}
        <Button
          size="lg"
          colorScheme="primary"
          w="full"
          onClick={onNext}
          mt={4}
        >
          Let's Get Started
        </Button>

        <Text fontSize="xs" color="gray.400" textAlign="center">
          This will only take 2-3 minutes
        </Text>
      </VStack>
    </Box>
  );
};

export default SetupWelcome;
