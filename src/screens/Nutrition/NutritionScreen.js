import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Card,
  CardBody,
  Image,
  Badge,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';
import { ArrowBackIcon, SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useNutrition } from '../../contexts/NutritionContext';
import { useAuth } from '../../contexts/AuthContext';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';
import NutritionNavigationGuard from '../../components/Nutrition/NutritionNavigationGuard';

const NutritionScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSetupComplete, fetchMealPlans } = useNutrition();
  const textColor = 'white';
  const cardBg = '#2D3748';

  // Fetch meal plans on component mount to ensure we have latest data
  useEffect(() => {
    if (user?._id) {
      fetchMealPlans();
    }
  }, [user?._id, fetchMealPlans]);

  const handleBackNavigation = () => {
    navigate('/home');
  };

  const handleMealPlanSelect = () => {
    if (isSetupComplete) {
      navigate('/nutrition/meals');
    } else {
      navigate('/nutrition/setup');
    }
  };

  const handleRecipeSearch = () => {
    navigate('/nutrition/recipes');
  };

  const handleNutritionTracker = () => {
    navigate('/nutrition/tracker');
  };

  const mealPlans = [
    {
      id: 1,
      title: 'Weight Loss Plan',
      subtitle: 'Low Calorie & High Protein',
      calories: '1,200-1,500 cal/day',
      duration: '4 weeks',
      image: '/api/placeholder/300/200',
      color: 'green.500',
      meals: 21,
    },
    {
      id: 2,
      title: 'Muscle Gain Plan',
      subtitle: 'High Protein & Balanced',
      calories: '2,200-2,800 cal/day',
      duration: '6 weeks',
      image: '/api/placeholder/300/200',
      color: 'blue.500',
      meals: 35,
    },
    {
      id: 3,
      title: 'Balanced Nutrition',
      subtitle: 'Healthy & Sustainable',
      calories: '1,800-2,200 cal/day',
      duration: '8 weeks',
      image: '/api/placeholder/300/200',
      color: 'purple.500',
      meals: 42,
    },
    {
      id: 4,
      title: 'Keto Diet Plan',
      subtitle: 'Low Carb & High Fat',
      calories: '1,500-2,000 cal/day',
      duration: '4 weeks',
      image: '/api/placeholder/300/200',
      color: 'orange.500',
      meals: 28,
    },
  ];

  const quickActions = isSetupComplete ? [
    {
      title: 'My Meal Plan',
      icon: '🍽️',
      action: () => navigate('/nutrition/meals'),
      description: 'View your personalized meals',
    },
    {
      title: 'Recipe Search',
      icon: '🔍',
      action: handleRecipeSearch,
      description: 'Find healthy recipes',
    },
    {
      title: 'Nutrition Tracker',
      icon: '📊',
      action: handleNutritionTracker,
      description: 'Track your daily intake',
    },
    {
      title: 'Shopping List',
      icon: '🛒',
      action: () => navigate('/nutrition/shopping'),
      description: 'Generate shopping lists',
    },
  ] : [
    {
      title: 'Create Meal Plan',
      icon: '🍽️',
      action: handleMealPlanSelect,
      description: 'Get personalized meals',
    },
    {
      title: 'Recipe Search',
      icon: '🔍',
      action: handleRecipeSearch,
      description: 'Find healthy recipes',
    },
    {
      title: 'Nutrition Tracker',
      icon: '📊',
      action: handleNutritionTracker,
      description: 'Track your daily intake',
    },
    {
      title: 'Learn More',
      icon: '📚',
      action: () => navigate('/articles'),
      description: 'Nutrition tips & guides',
    },
  ];

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
            Nutrition
          </Text>
          <IconButton
            icon={<SearchIcon />}
            variant="ghost"
            size="lg"
            onClick={handleRecipeSearch}
            aria-label="Search recipes"
            color={textColor}
          />
        </HStack>
      </Box>

      {/* Main Content */}
      <Box p={6} pb={24}>
        <VStack spacing={6} w="full">
          
          {/* Welcome Section */}
          <Box w="full" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={2}>
              {isSetupComplete ? 'Your Nutrition Hub' : 'Nutrition & Meal Plans'}
            </Text>
            <Text fontSize="md" color="gray.400" mb={6}>
              {isSetupComplete
                ? 'Manage your personalized meal plan and nutrition goals'
                : 'Get started with personalized meal recommendations'
              }
            </Text>
          </Box>

          {/* Setup CTA for new users */}
          {!isSetupComplete && (
            <Box w="full">
              <Card
                bg="primary.500"
                cursor="pointer"
                onClick={handleMealPlanSelect}
                _hover={{ transform: 'scale(1.02)', bg: 'primary.600' }}
                transition="all 0.2s"
              >
                <CardBody p={6} textAlign="center">
                  <VStack spacing={4}>
                    <Text fontSize="3xl">🍽️</Text>
                    <Text fontSize="lg" fontWeight="bold" color="white">
                      Create Your Meal Plan
                    </Text>
                    <Text fontSize="sm" color="white" opacity={0.9}>
                      Tell us your preferences and we'll create a personalized meal plan just for you
                    </Text>
                    <Button
                      colorScheme="whiteAlpha"
                      variant="solid"
                      size="md"
                      onClick={handleMealPlanSelect}
                    >
                      Get Started
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          )}

          {/* Quick Actions */}
          <Box w="full">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Quick Actions
            </Text>
            <SimpleGrid columns={2} spacing={3} w="full">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  bg={cardBg} 
                  cursor="pointer" 
                  onClick={action.action}
                  _hover={{ transform: 'scale(1.02)', bg: '#3A4A5C' }} 
                  transition="all 0.2s"
                  h="80px"
                >
                  <CardBody display="flex" alignItems="center" justifyContent="center" p={3}>
                    <VStack spacing={1}>
                      <Text fontSize="2xl">{action.icon}</Text>
                      <Text fontSize="xs" fontWeight="semibold" color={textColor} textAlign="center">
                        {action.title}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Meal Plans Section */}
          <Box w="full">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Popular Meal Plans
            </Text>
            <VStack spacing={4} w="full">
              {mealPlans.map((plan) => (
                <Card 
                  key={plan.id}
                  bg={cardBg} 
                  w="full" 
                  cursor="pointer" 
                  onClick={() => handleMealPlanSelect(plan.id)}
                  _hover={{ transform: 'scale(1.02)', bg: '#3A4A5C' }} 
                  transition="all 0.2s"
                >
                  <CardBody p={0}>
                    <HStack spacing={0}>
                      <Box position="relative" w="120px">
                        <Image
                          src={plan.image}
                          alt={plan.title}
                          w="120px"
                          h="120px"
                          objectFit="cover"
                          borderLeftRadius="md"
                        />
                        <Badge
                          position="absolute"
                          top={2}
                          left={2}
                          bg={plan.color}
                          color="white"
                          fontSize="xs"
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          {plan.duration}
                        </Badge>
                      </Box>
                      
                      <Box flex={1} p={4}>
                        <VStack align="start" spacing={2}>
                          <Text fontSize="lg" fontWeight="bold" color={textColor}>
                            {plan.title}
                          </Text>
                          <Text fontSize="sm" color="gray.400">
                            {plan.subtitle}
                          </Text>
                          <VStack align="start" spacing={1}>
                            <HStack spacing={2}>
                              <Text fontSize="xs" color="gray.400">🔥</Text>
                              <Text fontSize="xs" color="gray.400">{plan.calories}</Text>
                            </HStack>
                            <HStack spacing={2}>
                              <Text fontSize="xs" color="gray.400">🍽</Text>
                              <Text fontSize="xs" color="gray.400">{plan.meals} meals included</Text>
                            </HStack>
                          </VStack>
                        </VStack>
                      </Box>
                      
                      <Box p={4} display="flex" alignItems="center">
                        <Box
                          w="8"
                          h="8"
                          bg="primary.500"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="sm" color="white">▶</Text>
                        </Box>
                      </Box>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>

          {/* Nutrition Tips */}
          <Box w="full" mt={6}>
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={3}>
              Nutrition Tips
            </Text>
            <VStack spacing={2} align="start">
              <HStack spacing={3}>
                <Text color="primary.500">•</Text>
                <Text fontSize="sm" color="gray.300">
                  Eat a variety of colorful fruits and vegetables
                </Text>
              </HStack>
              <HStack spacing={3}>
                <Text color="primary.500">•</Text>
                <Text fontSize="sm" color="gray.300">
                  Stay hydrated with 8-10 glasses of water daily
                </Text>
              </HStack>
              <HStack spacing={3}>
                <Text color="primary.500">•</Text>
                <Text fontSize="sm" color="gray.300">
                  Include lean protein in every meal
                </Text>
              </HStack>
              <HStack spacing={3}>
                <Text color="primary.500">•</Text>
                <Text fontSize="sm" color="gray.300">
                  Plan your meals ahead for better choices
                </Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>

        <BottomNavigation />
      </AppContainer>
    </NutritionNavigationGuard>
  );
};

export default NutritionScreen;
