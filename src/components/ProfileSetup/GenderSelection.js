import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { useUserData } from '../../contexts/UserDataContext';

const genderOptions = [
  { value: 'male', label: 'Male', icon: '👨', color: 'blue.500' },
  { value: 'female', label: 'Female', icon: '👩', color: 'pink.500' },
  { value: 'other', label: 'Other', icon: '👤', color: 'purple.500' },
];

const GenderSelection = ({ onNext }) => {
  const { profileData, updateProfileData } = useUserData();
  const textColor = 'white';

  const handleGenderSelect = (gender) => {
    updateProfileData({ gender });

    setTimeout(() => {
      onNext();
    }, 300);
  };

  return (
    <Box flex={1} display="flex" alignItems="center" justifyContent="center" px={6}>
      <VStack spacing={8} maxW="400px" w="full">
        {}
        <VStack spacing={4} textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" color={textColor}>
            What's your gender?
          </Text>
          <Text fontSize="md" color="gray.500" lineHeight="tall">
            This helps us provide more accurate fitness recommendations
          </Text>
        </VStack>

        {}
        <VStack spacing={4} w="full">
          {genderOptions.map((option) => (
            <Button
              key={option.value}
              size="lg"
              variant={profileData.gender === option.value ? 'solid' : 'outline'}
              colorScheme={profileData.gender === option.value ? 'primary' : 'gray'}
              w="full"
              h="80px"
              onClick={() => handleGenderSelect(option.value)}
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
              <Text fontSize="lg" fontWeight="semibold">
                {option.label}
              </Text>
            </Button>
          ))}
        </VStack>

        {}
        <Button
          variant="ghost"
          size="sm"
          color="gray.500"
          onClick={onNext}
        >
          Prefer not to say
        </Button>
      </VStack>
    </Box>
  );
};

export default GenderSelection;
