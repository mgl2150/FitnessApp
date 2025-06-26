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

const HeightInput = ({ onNext }) => {
  const { profileData, updateProfileData } = useUserData();
  const [height, setHeight] = useState(profileData.height || '');
  const [unit, setUnit] = useState(profileData.heightUnit || 'cm');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [error, setError] = useState('');
  const textColor = 'white';

  React.useEffect(() => {
    if (profileData.height && unit === 'ft') {
      const totalInches = parseFloat(profileData.height);
      setFeet(Math.floor(totalInches / 12).toString());
      setInches((totalInches % 12).toString());
    }
  }, [profileData.height, unit]);

  const handleHeightChange = (value) => {
    setHeight(value);
    setError('');
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);

    if (height) {
      if (newUnit === 'ft' && unit === 'cm') {
        const totalInches = parseFloat(height) / 2.54;
        setFeet(Math.floor(totalInches / 12).toString());
        setInches(Math.round(totalInches % 12).toString());
        setHeight(totalInches.toString());
      } else if (newUnit === 'cm' && unit === 'ft') {
        const totalInches = parseFloat(feet || 0) * 12 + parseFloat(inches || 0);
        setHeight(Math.round(totalInches * 2.54).toString());
      }
    }
  };

  const handleFeetChange = (value) => {
    setFeet(value);
    const totalInches = parseFloat(value || 0) * 12 + parseFloat(inches || 0);
    setHeight(totalInches.toString());
    setError('');
  };

  const handleInchesChange = (value) => {
    setInches(value);
    const totalInches = parseFloat(feet || 0) * 12 + parseFloat(value || 0);
    setHeight(totalInches.toString());
    setError('');
  };

  const handleNext = () => {
    let heightValue;

    if (unit === 'cm') {
      heightValue = parseFloat(height);
      if (!height || isNaN(heightValue)) {
        setError('Please enter your height');
        return;
      }
      if (heightValue < 100 || heightValue > 250) {
        setError('Please enter a valid height between 100 and 250 cm');
        return;
      }
    } else {
      const feetNum = parseFloat(feet || 0);
      const inchesNum = parseFloat(inches || 0);

      if (!feet || feetNum < 3 || feetNum > 8) {
        setError('Please enter valid feet (3-8)');
        return;
      }
      if (inchesNum < 0 || inchesNum >= 12) {
        setError('Please enter valid inches (0-11)');
        return;
      }

      heightValue = feetNum * 12 + inchesNum;
    }

    updateProfileData({
      height: heightValue.toString(),
      heightUnit: unit
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
            bg="warning.100"
            borderRadius="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="2xl"
          >
            📏
          </Box>

          <Text fontSize="3xl" fontWeight="bold" color={textColor}>
            What's your height?
          </Text>
          <Text fontSize="md" color="gray.500" lineHeight="tall">
            Height helps us calculate your BMI and personalize your fitness goals
          </Text>
        </VStack>

        {}
        <HStack spacing={0} bg="gray.100" borderRadius="lg" p={1}>
          <Button
            size="sm"
            variant={unit === 'cm' ? 'solid' : 'ghost'}
            colorScheme={unit === 'cm' ? 'primary' : 'gray'}
            onClick={() => handleUnitChange('cm')}
            borderRadius="md"
          >
            cm
          </Button>
          <Button
            size="sm"
            variant={unit === 'ft' ? 'solid' : 'ghost'}
            colorScheme={unit === 'ft' ? 'primary' : 'gray'}
            onClick={() => handleUnitChange('ft')}
            borderRadius="md"
          >
            ft/in
          </Button>
        </HStack>

        {}
        <FormControl isInvalid={!!error} w="full">
          {unit === 'cm' ? (
            <NumberInput
              value={height}
              onChange={handleHeightChange}
              min={100}
              max={250}
              size="lg"
            >
              <NumberInputField
                placeholder="Enter height in cm"
                fontSize="xl"
                textAlign="center"
                h="60px"
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          ) : (
            <HStack spacing={4}>
              <VStack spacing={2} flex={1}>
                <Text fontSize="sm" color="gray.500">Feet</Text>
                <NumberInput
                  value={feet}
                  onChange={handleFeetChange}
                  min={3}
                  max={8}
                  size="lg"
                >
                  <NumberInputField
                    placeholder="5"
                    fontSize="xl"
                    textAlign="center"
                    h="60px"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </VStack>

              <VStack spacing={2} flex={1}>
                <Text fontSize="sm" color="gray.500">Inches</Text>
                <NumberInput
                  value={inches}
                  onChange={handleInchesChange}
                  min={0}
                  max={11}
                  size="lg"
                >
                  <NumberInputField
                    placeholder="8"
                    fontSize="xl"
                    textAlign="center"
                    h="60px"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </VStack>
            </HStack>
          )}
          <FormErrorMessage justifyContent="center">
            {error}
          </FormErrorMessage>
        </FormControl>

        {}
        <VStack spacing={2} w="full" opacity={0.7}>
          <Text fontSize="xs" color="gray.500" textAlign="center">
            Common heights ({unit}):
          </Text>
          <HStack spacing={2} justify="center" flexWrap="wrap">
            {unit === 'cm'
              ? ['150-160', '160-170', '170-180', '180-190', '190+'].map((range) => (
                  <Button
                    key={range}
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    onClick={() => {
                      const midHeight = range === '190+' ? '195' :
                        Math.floor((parseInt(range.split('-')[0]) + parseInt(range.split('-')[1])) / 2).toString();
                      setHeight(midHeight);
                    }}
                  >
                    {range}
                  </Button>
                ))
              : ["5'0\"", "5'4\"", "5'8\"", "6'0\"", "6'4\""].map((heightStr) => (
                  <Button
                    key={heightStr}
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    onClick={() => {
                      const [feetStr, inchesStr] = heightStr.replace(/['"]/g, '').split("'");
                      setFeet(feetStr);
                      setInches(inchesStr || '0');
                    }}
                  >
                    {heightStr}
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
          isDisabled={unit === 'cm' ? !height : (!feet || !inches)}
        >
          Continue
        </Button>
      </VStack>
    </Box>
  );
};

export default HeightInput;
