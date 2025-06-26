import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Card,
  CardBody,
  Image,
  Badge,
  Divider,
  useToast,
  AspectRatio,
} from '@chakra-ui/react';
import { ArrowBackIcon, StarIcon, AddIcon, CheckIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useNutrition } from '../../contexts/NutritionContext';
import { useAuth } from '../../contexts/AuthContext';
import AppContainer from '../../components/Layout/AppContainer';
import NutritionNavigationGuard from '../../components/Nutrition/NutritionNavigationGuard';
import BottomNavigation from '../../components/Navigation/BottomNavigation';

const MealDetailScreen = () => {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const toast = useToast();
  const { user } = useAuth();
  const {
    currentMeal,
    mealPlans,
    detailLoading,
    detailError,
    fetchMealById,
    addToMealPlan,
    clearCurrentMeal,
  } = useNutrition();

  const textColor = 'white';
  const cardBg = '#2D3748';

  useEffect(() => {
    if (mealId) {
      fetchMealById(mealId);
    }

    return () => {
      clearCurrentMeal();
    };
  }, [mealId, fetchMealById, clearCurrentMeal]);

  const handleBackNavigation = () => {
    navigate('/nutrition/meals');
  };

  const isInMealPlan = () => {
    return mealPlans.some(plan => plan.meal_id?._id === currentMeal?._id);
  };

  const handleAddToMealPlan = async () => {
    if (!user?._id) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to add meals to your plan',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!currentMeal) return;

    try {
      const result = await addToMealPlan(currentMeal._id);
      
      if (result.success) {
        toast({
          title: 'Added to meal plan!',
          description: `${currentMeal.name} has been added to your meal plan`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Failed to add meal',
          description: result.error || 'Something went wrong',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add meal to plan',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getDietaryColor = (dietary) => {
    const colors = {
      'vegan': 'green',
      'vegetarian': 'teal',
      'gluten-free': 'orange',
      'keto': 'purple',
      'paleo': 'brown',
      'no-preferences': 'gray',
    };
    return colors[dietary] || 'gray';
  };

  const getMealTypeIcon = (type) => {
    const icons = {
      'breakfast': '🌅',
      'lunch': '☀️',
      'dinner': '🌙',
      'snack': '🍎',
    };
    return icons[type] || '🍽️';
  };

  if (detailLoading) {
    return (
      <AppContainer hasBottomNav={true}>
        <Box
          minH="100vh"
          bg="#232323"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack spacing={4}>
            <Text fontSize="2xl">🍽️</Text>
            <Text color={textColor}>Loading meal details...</Text>
          </VStack>
        </Box>
      </AppContainer>
    );
  }

  if (detailError || !currentMeal) {
    return (
      <AppContainer hasBottomNav={true}>
        <Box
          minH="100vh"
          bg="#232323"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={6}
        >
          <VStack spacing={4} textAlign="center">
            <Text fontSize="2xl">😕</Text>
            <Text color={textColor} fontSize="lg">Meal not found</Text>
            <Text color="gray.400" fontSize="sm">
              {detailError || 'The meal you\'re looking for doesn\'t exist'}
            </Text>
            <Button colorScheme="primary" onClick={handleBackNavigation}>
              Go Back
            </Button>
          </VStack>
        </Box>
      </AppContainer>
    );
  }

  return (
    <NutritionNavigationGuard>
      <AppContainer hasBottomNav={true}>
      {/* Header */}
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
            Meal Details
          </Text>
          <IconButton
            icon={<StarIcon />}
            variant="ghost"
            size="lg"
            aria-label="Add to favorites"
            color={textColor}
          />
        </HStack>
      </Box>

      {/* Main Content */}
      <Box p={6} pb={24}>
        <VStack spacing={6} w="full">
          
          {/* Hero Image */}
          <Card bg={cardBg} w="full">
            <CardBody p={0}>
              <Box position="relative">
                <Image
                  src={currentMeal.avatar}
                  alt={currentMeal.name}
                  w="full"
                  h="200px"
                  objectFit="cover"
                  borderTopRadius="md"
                  fallback={
                    <Box
                      w="full"
                      h="200px"
                      bg="gray.600"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderTopRadius="md"
                    >
                      <Text fontSize="4xl">🍽️</Text>
                    </Box>
                  }
                />
                <Badge
                  position="absolute"
                  top={3}
                  left={3}
                  bg="primary.500"
                  color="white"
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="md"
                >
                  {currentMeal.cal} calories
                </Badge>
                <Badge
                  position="absolute"
                  top={3}
                  right={3}
                  bg={getDietaryColor(currentMeal.dietary)}
                  color="white"
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="md"
                >
                  {currentMeal.dietary === 'no-preferences' ? 'All diets' : currentMeal.dietary}
                </Badge>
              </Box>
            </CardBody>
          </Card>

          {/* Meal Info */}
          <Box w="full">
            <VStack align="start" spacing={4}>
              <HStack spacing={3} align="center">
                <Text fontSize="2xl">
                  {getMealTypeIcon(currentMeal.type)}
                </Text>
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {currentMeal.name}
                  </Text>
                  <Text fontSize="sm" color="gray.400" textTransform="capitalize">
                    {currentMeal.type}
                  </Text>
                </VStack>
              </HStack>

              {/* Quick Stats */}
              <HStack spacing={6} w="full" justify="space-around">
                <VStack spacing={1}>
                  <Text fontSize="lg" fontWeight="bold" color="primary.400">
                    {currentMeal.minutes}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Minutes
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="lg" fontWeight="bold" color="primary.400">
                    {currentMeal.cal}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Calories
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="lg" fontWeight="bold" color="primary.400">
                    {currentMeal.number_of_servings}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Serving{currentMeal.number_of_servings > 1 ? 's' : ''}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>

          <Divider borderColor="gray.600" />

          {/* Description */}
          <Box w="full">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={3}>
              About This Meal
            </Text>
            <Text fontSize="sm" color="gray.300" lineHeight="1.6">
              {currentMeal.content}
            </Text>
          </Box>

          {/* Video Section */}
          {currentMeal.video && (
            <Box w="full">
              <Text fontSize="lg" fontWeight="bold" color={textColor} mb={3}>
                Preparation Video
              </Text>
              <Card bg={cardBg} w="full">
                <CardBody p={0}>
                  <AspectRatio ratio={16 / 9}>
                    {currentMeal.video && currentMeal.video.includes('.mp4') ? (
                      <video
                        controls
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '8px',
                        }}
                        poster={currentMeal.avatar}
                      >
                        <source src={currentMeal.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Box
                        bg="gray.700"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <VStack spacing={2}>
                          <Text fontSize="3xl">🎥</Text>
                          <Text fontSize="sm" color="gray.400">
                            Video coming soon
                          </Text>
                        </VStack>
                      </Box>
                    )}
                  </AspectRatio>
                </CardBody>
              </Card>
            </Box>
          )}

          {/* Nutrition Tips */}
          <Box w="full">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={3}>
              Nutrition Benefits
            </Text>
            <VStack spacing={2} align="start">
              <HStack spacing={3}>
                <Text color="green.400">•</Text>
                <Text fontSize="sm" color="gray.300">
                  Balanced macronutrients for sustained energy
                </Text>
              </HStack>
              <HStack spacing={3}>
                <Text color="green.400">•</Text>
                <Text fontSize="sm" color="gray.300">
                  Rich in essential vitamins and minerals
                </Text>
              </HStack>
              <HStack spacing={3}>
                <Text color="green.400">•</Text>
                <Text fontSize="sm" color="gray.300">
                  Supports your fitness and health goals
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Action Button */}
          <Button
            colorScheme={isInMealPlan() ? 'green' : 'primary'}
            size="lg"
            w="full"
            onClick={handleAddToMealPlan}
            isDisabled={isInMealPlan()}
            leftIcon={isInMealPlan() ? <CheckIcon /> : <AddIcon />}
          >
            {isInMealPlan() ? 'Added to Meal Plan' : 'Add to Meal Plan'}
          </Button>
        </VStack>
      </Box>

        <BottomNavigation />
      </AppContainer>
    </NutritionNavigationGuard>
  );
};

export default MealDetailScreen;
