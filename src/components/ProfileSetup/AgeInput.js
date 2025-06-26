import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useUserData } from '../../contexts/UserDataContext';

const AgeInput = ({ onNext }) => {
  const { profileData, updateProfileData } = useUserData();
  const [age, setAge] = useState(profileData.age || '');
  const [error, setError] = useState('');
  const textColor = 'white';

  const handleAgeChange = (value) => {
    setAge(value);
    setError('');
  };

  const handleNext = () => {
    const ageNum = parseInt(age);

    if (!age || isNaN(ageNum)) {
      setError('Please enter your age');
      return;
    }

    if (ageNum < 13 || ageNum > 120) {
      setError('Please enter a valid age between 13 and 120');
      return;
    }

    updateProfileData({ age: ageNum.toString() });
    onNext();
  };

  return (
    <Box flex={1} display="flex" alignItems="center" justifyContent="center" px={6}>
      <VStack spacing={8} maxW="400px" w="full">
        {}
        <VStack spacing={4} textAlign="center">
          <Box
            w="80px"
            h="80px"
            bg="secondary.100"
            borderRadius="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="2xl"
          >
            🎂
          </Box>

          <Text fontSize="3xl" fontWeight="bold" color={textColor}>
            How old are you?
          </Text>
          <Text fontSize="md" color="gray.500" lineHeight="tall">
            Age helps us customize your fitness plan and track your progress appropriately
          </Text>
        </VStack>

        {}
        <FormControl isInvalid={!!error} w="full">
          <NumberInput
            value={age}
            onChange={handleAgeChange}
            min={13}
            max={120}
            size="lg"
          >
            <NumberInputField
              placeholder="Enter your age"
              fontSize="xl"
              textAlign="center"
              h="60px"
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage justifyContent="center">
            {error}
          </FormErrorMessage>
        </FormControl>

        {}
        <VStack spacing={2} w="full" opacity={0.7}>
          <Text fontSize="xs" color="gray.500" textAlign="center">
            Common age ranges:
          </Text>
          <HStack spacing={4} justify="center" flexWrap="wrap">
            {['18-25', '26-35', '36-45', '46-55', '55+'].map((range) => (
              <Button
                key={range}
                size="xs"
                variant="ghost"
                color="gray.400"
                onClick={() => {
                  const midAge = range === '55+' ? '60' :
                    Math.floor((parseInt(range.split('-')[0]) + parseInt(range.split('-')[1])) / 2).toString();
                  setAge(midAge);
                }}
              >
                {range}
              </Button>
            ))}
          </HStack>
        </VStack>

        {}
        <Button
          size="lg"
          colorScheme="primary"
          w="full"
          onClick={handleNext}
          isDisabled={!age}
        >
          Continue
        </Button>
      </VStack>
    </Box>
  );
};

export default AgeInput;
