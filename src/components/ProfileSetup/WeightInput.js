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

const WeightInput = ({ onNext }) => {
  const { profileData, updateProfileData } = useUserData();
  const [weight, setWeight] = useState(profileData.weight || '');
  const [unit, setUnit] = useState(profileData.weightUnit || 'kg');
  const [error, setError] = useState('');
  const textColor = 'white';

  const handleWeightChange = (value) => {
    setWeight(value);
    setError('');
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);

    if (weight) {
      if (newUnit === 'lbs' && unit === 'kg') {
        setWeight(Math.round(parseFloat(weight) * 2.20462).toString());
      } else if (newUnit === 'kg' && unit === 'lbs') {
        setWeight(Math.round(parseFloat(weight) / 2.20462).toString());
      }
    }
  };

  const handleNext = () => {
    const weightNum = parseFloat(weight);

    if (!weight || isNaN(weightNum)) {
      setError('Please enter your weight');
      return;
    }

    const minWeight = unit === 'kg' ? 30 : 66;
    const maxWeight = unit === 'kg' ? 300 : 661;

    if (weightNum < minWeight || weightNum > maxWeight) {
      setError(`Please enter a valid weight between ${minWeight} and ${maxWeight} ${unit}`);
      return;
    }

    updateProfileData({
      weight: weightNum.toString(),
      weightUnit: unit
    });
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
            bg="success.100"
            borderRadius="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="2xl"
          >
            ⚖️
          </Box>

          <Text fontSize="3xl" fontWeight="bold" color={textColor}>
            What's your weight?
          </Text>
          <Text fontSize="md" color="gray.500" lineHeight="tall">
            This helps us calculate your BMI and recommend appropriate workout intensity
          </Text>
        </VStack>

        {}
        <HStack spacing={0} bg="gray.100" borderRadius="lg" p={1}>
          <Button
            size="sm"
            variant={unit === 'kg' ? 'solid' : 'ghost'}
            colorScheme={unit === 'kg' ? 'primary' : 'gray'}
            onClick={() => handleUnitChange('kg')}
            borderRadius="md"
          >
            kg
          </Button>
          <Button
            size="sm"
            variant={unit === 'lbs' ? 'solid' : 'ghost'}
            colorScheme={unit === 'lbs' ? 'primary' : 'gray'}
            onClick={() => handleUnitChange('lbs')}
            borderRadius="md"
          >
            lbs
          </Button>
        </HStack>

        {}
        <FormControl isInvalid={!!error} w="full">
          <NumberInput
            value={weight}
            onChange={handleWeightChange}
            min={unit === 'kg' ? 30 : 66}
            max={unit === 'kg' ? 300 : 661}
            precision={1}
            step={unit === 'kg' ? 0.5 : 1}
            size="lg"
          >
            <NumberInputField
              placeholder={`Enter weight in ${unit}`}
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
            Common weight ranges ({unit}):
          </Text>
          <HStack spacing={2} justify="center" flexWrap="wrap">
            {unit === 'kg'
              ? ['50-60', '60-70', '70-80', '80-90', '90+'].map((range) => (
                  <Button
                    key={range}
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    onClick={() => {
                      const midWeight = range === '90+' ? '95' :
                        Math.floor((parseInt(range.split('-')[0]) + parseInt(range.split('-')[1])) / 2).toString();
                      setWeight(midWeight);
                    }}
                  >
                    {range}
                  </Button>
                ))
              : ['110-130', '130-150', '150-180', '180-200', '200+'].map((range) => (
                  <Button
                    key={range}
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    onClick={() => {
                      const midWeight = range === '200+' ? '210' :
                        Math.floor((parseInt(range.split('-')[0]) + parseInt(range.split('-')[1])) / 2).toString();
                      setWeight(midWeight);
                    }}
                  >
                    {range}
                  </Button>
                ))
            }
          </HStack>
        </VStack>

        {}
        <Button
          size="lg"
          colorScheme="primary"
          w="full"
          onClick={handleNext}
          isDisabled={!weight}
        >
          Continue
        </Button>
      </VStack>
    </Box>
  );
};

export default WeightInput;
