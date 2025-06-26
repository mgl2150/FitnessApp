import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Card,
  CardBody,
  SimpleGrid,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,

  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useNutrition } from '../../contexts/NutritionContext';
import AppContainer from '../../components/Layout/AppContainer';

const MealPlanSetupScreen = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { setupMealPlan, setupLoading } = useNutrition();
  const textColor = 'white';
  const cardBg = '#2D3748';

  const [preferences, setPreferences] = useState({
    dietary: 'no-preferences',
    mealTypes: [],
    cal_min: 200,
    cal_max: 800,
    minutes: 30,
  });

  const handleBackNavigation = () => {
    navigate('/home');
  };

  const dietaryOptions = [
    { value: 'no-preferences', label: 'No Preferences', icon: '🍽️' },
    { value: 'vegan', label: 'Vegan', icon: '🌱' },
    { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { value: 'gluten-free', label: 'Gluten Free', icon: '🌾' },
    { value: 'keto', label: 'Keto', icon: '🥑' },
    { value: 'paleo', label: 'Paleo', icon: '🥩' },
  ];

  const mealTypeOptions = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '☀️' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack', icon: '🍎' },
  ];

  const handleDietarySelect = (dietary) => {
    setPreferences(prev => ({ ...prev, dietary }));
  };

  const handleMealTypeToggle = (mealType) => {
    setPreferences(prev => ({
      ...prev,
      mealTypes: prev.mealTypes.includes(mealType)
        ? prev.mealTypes.filter(type => type !== mealType)
        : [...prev.mealTypes, mealType]
    }));
  };

  const handleCalorieMinChange = (value) => {
    setPreferences(prev => ({
      ...prev,
      cal_min: value,
    }));
  };

  const handleCalorieMaxChange = (value) => {
    setPreferences(prev => ({
      ...prev,
      cal_max: value,
    }));
  };

  const handleTimeChange = (minutes) => {
    setPreferences(prev => ({ ...prev, minutes }));
  };

  const handleCreateMealPlan = async () => {

    if (preferences.mealTypes.length === 0) {
      toast({
        title: 'Please select meal types',
        description: 'Choose at least one meal type to continue',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (preferences.cal_min >= preferences.cal_max) {
      toast({
        title: 'Invalid calorie range',
        description: 'Maximum calories must be higher than minimum calories',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log('🚀 Creating meal plan with preferences:', preferences);

      const result = await setupMealPlan(preferences);

      if (result.success) {
        const data = result.data;
        const mealTypesText = preferences.mealTypes.join(', ');

        toast({
          title: 'Meal plan created successfully!',
          description: `Found ${data.mealsFound} meals and created ${data.mealPlansCreated} personalized meal plans for ${mealTypesText}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        navigate('/nutrition/loading');

        setTimeout(() => {
          navigate('/nutrition/meals');
        }, 2000);
      } else {
        toast({
          title: 'Setup failed',
          description: result.error || 'Failed to create meal plan',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('❌ Setup error:', error);
      toast({
        title: 'Setup failed',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <AppContainer>
      {}
      <Box bg="#232323" px={6} py={4} pt={8}>
        <HStack justify="space-between" align="center">
          <IconButton
            icon={<ArrowBackIcon />}
            variant="ghost"
            size="lg"
            onClick={handleBackNavigation}
            aria-label="Go back"
            color={textColor}
          />
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Meal Plan Setup
          </Text>
          <Box w="40px" /> {}
        </HStack>
      </Box>

      {}
      <Box p={6} pb={8}>
        <VStack spacing={8} w="full">

          {}
          <Box w="full" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={2}>
              Let's Create Your Meal Plan
            </Text>
            <Text fontSize="md" color="gray.400" mb={6}>
              Tell us your preferences to get personalized meal recommendations
            </Text>
          </Box>

          {}
          <Box w="full">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Dietary Preferences
            </Text>
            <SimpleGrid columns={2} spacing={3} w="full">
              {dietaryOptions.map((option) => (
                <Card
                  key={option.value}
                  bg={preferences.dietary === option.value ? 'primary.500' : cardBg}
                  cursor="pointer"
                  onClick={() => handleDietarySelect(option.value)}
                  _hover={{ transform: 'scale(1.02)' }}
                  transition="all 0.2s"
                  border={preferences.dietary === option.value ? '2px solid' : 'none'}
                  borderColor="primary.300"
                >
                  <CardBody display="flex" alignItems="center" justifyContent="center" p={4}>
                    <VStack spacing={2}>
                      <Text fontSize="2xl">{option.icon}</Text>
                      <Text fontSize="sm" fontWeight="semibold" color={textColor} textAlign="center">
                        {option.label}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {}
          <Box w="full">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Meal Types
            </Text>
            <Text fontSize="sm" color="gray.400" mb={2}>
              Select the meals you want in your plan
            </Text>
            {preferences.mealTypes.length > 0 && (
              <Text fontSize="sm" color="primary.400" mb={4}>
                Selected: {preferences.mealTypes.join(', ')}
              </Text>
            )}
            <SimpleGrid columns={2} spacing={3} w="full">
              {mealTypeOptions.map((option) => (
                <Card
                  key={option.value}
                  bg={preferences.mealTypes.includes(option.value) ? 'primary.500' : cardBg}
                  cursor="pointer"
                  onClick={() => handleMealTypeToggle(option.value)}
                  _hover={{ transform: 'scale(1.02)' }}
                  transition="all 0.2s"
                  border={preferences.mealTypes.includes(option.value) ? '2px solid' : 'none'}
                  borderColor="primary.300"
                >
                  <CardBody display="flex" alignItems="center" justifyContent="center" p={4}>
                    <VStack spacing={2}>
                      <Text fontSize="2xl">{option.icon}</Text>
                      <Text fontSize="sm" fontWeight="semibold" color={textColor} textAlign="center">
                        {option.label}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {}
          <Box w="full">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Calorie Range per Meal
            </Text>
            <Text fontSize="sm" color="gray.400" mb={4}>
              {preferences.cal_min} - {preferences.cal_max} calories
            </Text>
            <VStack spacing={4}>
              <Box w="full">
                <Text fontSize="sm" color="gray.300" mb={2}>
                  Minimum: {preferences.cal_min} calories
                </Text>
                <Slider
                  min={100}
                  max={800}
                  step={50}
                  value={preferences.cal_min}
                  onChange={handleCalorieMinChange}
                  colorScheme="primary"
                >
                  <SliderTrack bg="gray.600">
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
              </Box>
              <Box w="full">
                <Text fontSize="sm" color="gray.300" mb={2}>
                  Maximum: {preferences.cal_max} calories
                </Text>
                <Slider
                  min={preferences.cal_min + 50}
                  max={1000}
                  step={50}
                  value={preferences.cal_max}
                  onChange={handleCalorieMaxChange}
                  colorScheme="primary"
                >
                  <SliderTrack bg="gray.600">
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
              </Box>
            </VStack>
          </Box>

          {}
          <Box w="full">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Maximum Preparation Time
            </Text>
            <Text fontSize="sm" color="gray.400" mb={4}>
              Up to {preferences.minutes} minutes
            </Text>
            <Box px={4}>
              <Slider
                min={5}
                max={60}
                step={5}
                value={preferences.minutes}
                onChange={handleTimeChange}
                colorScheme="primary"
              >
                <SliderTrack bg="gray.600">
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
            </Box>
          </Box>

          {}
          {preferences.mealTypes.length > 0 && (
            <Box w="full" p={4} bg={cardBg} borderRadius="md" border="1px solid" borderColor="gray.600">
              <Text fontSize="md" fontWeight="bold" color={textColor} mb={2}>
                Setup Summary
              </Text>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="gray.300">
                  • Dietary: {dietaryOptions.find(opt => opt.value === preferences.dietary)?.label}
                </Text>
                <Text fontSize="sm" color="gray.300">
                  • Meal types: {preferences.mealTypes.join(', ')}
                </Text>
                <Text fontSize="sm" color="gray.300">
                  • Calories: {preferences.cal_min} - {preferences.cal_max} per meal
                </Text>
                <Text fontSize="sm" color="gray.300">
                  • Max prep time: {preferences.minutes} minutes
                </Text>
              </VStack>
            </Box>
          )}

          {}
          <Button
            colorScheme="primary"
            size="lg"
            w="full"
            onClick={handleCreateMealPlan}
            isLoading={setupLoading}
            loadingText="Finding perfect meals for you..."
            mt={4}
            isDisabled={preferences.mealTypes.length === 0}
          >
            {preferences.mealTypes.length === 0
              ? 'Select meal types to continue'
              : `Create My ${preferences.mealTypes.length === 1 ? 'Meal Plan' : 'Meal Plans'}`
            }
          </Button>
        </VStack>
      </Box>
    </AppContainer>
  );
};

export default MealPlanSetupScreen;
