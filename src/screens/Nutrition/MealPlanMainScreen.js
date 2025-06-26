import { useEffect } from 'react';
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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  Button,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useNutrition } from '../../contexts/NutritionContext';
import { useAuth } from '../../contexts/AuthContext';
import AppContainer from '../../components/Layout/AppContainer';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import NutritionNavigationGuard from '../../components/Nutrition/NutritionNavigationGuard';

const MealPlanMainScreen = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const {
    mealPlans,
    activeMealType,
    planLoading,
    planError,
    fetchMealPlans,
    removeFromMealPlan,
    setActiveMealType,
  } = useNutrition();

  const textColor = 'white';
  const cardBg = '#2D3748';

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '☀️' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack', icon: '🍎' },
  ];

  useEffect(() => {
    // Only fetch user's meal plans - we don't need all meals here
    if (user?._id) {
      fetchMealPlans();
    }
  }, [fetchMealPlans, user?._id]);

  const handleBackNavigation = () => {
    navigate('/home');
  };

  const handleMealClick = (mealId) => {
    navigate(`/nutrition/meals/${mealId}`);
  };

  const handleRemoveFromMealPlan = async (mealPlan, event) => {
    event.stopPropagation(); // Prevent navigation to meal detail

    if (!user?._id) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to manage your meal plan',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const result = await removeFromMealPlan(mealPlan._id);

      if (result.success) {
        toast({
          title: 'Removed from meal plan!',
          description: `${mealPlan.meal_id.name} has been removed from your meal plan`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Failed to remove meal',
          description: result.error || 'Something went wrong',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove meal from plan',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTabChange = (index) => {
    const mealType = mealTypes[index].value;
    setActiveMealType(mealType);
  };

  const getCurrentTabIndex = () => {
    return mealTypes.findIndex(type => type.value === activeMealType);
  };

  const MealCard = ({ mealPlan }) => {
    const meal = mealPlan.meal_id;

    return (
    <Card
      bg={cardBg}
      cursor="pointer"
      onClick={() => handleMealClick(meal._id)}
      _hover={{ transform: 'scale(1.02)', bg: '#3A4A5C' }}
      transition="all 0.2s"
      position="relative"
    >
      <CardBody p={0}>
        <Box position="relative">
          <Image
            src={meal.avatar}
            alt={meal.name}
            w="full"
            h="120px"
            objectFit="cover"
            borderTopRadius="md"
            fallback={
              <Box
                w="full"
                h="120px"
                bg="gray.600"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderTopRadius="md"
              >
                <Text fontSize="2xl">🍽️</Text>
              </Box>
            }
          />
          <Badge
            position="absolute"
            top={2}
            left={2}
            bg="primary.500"
            color="white"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="md"
          >
            {meal.cal} cal
          </Badge>
          <IconButton
            icon={<CloseIcon />}
            size="sm"
            colorScheme="red"
            position="absolute"
            top={2}
            right={2}
            onClick={(e) => handleRemoveFromMealPlan(mealPlan, e)}
            aria-label="Remove from meal plan"
          />
        </Box>
        
        <Box p={3}>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="bold" color={textColor} noOfLines={2}>
              {meal.name}
            </Text>
            <HStack spacing={3} fontSize="xs" color="gray.400">
              <HStack spacing={1}>
                <Text>⏱</Text>
                <Text>{meal.minutes} min</Text>
              </HStack>
              <HStack spacing={1}>
                <Text>🍽</Text>
                <Text>{meal.number_of_servings} serving{meal.number_of_servings > 1 ? 's' : ''}</Text>
              </HStack>
            </HStack>
            {meal.dietary !== 'no-preferences' && (
              <Badge
                size="sm"
                colorScheme="green"
                variant="subtle"
                fontSize="xs"
              >
                {meal.dietary}
              </Badge>
            )}
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
  };

  if (planLoading && mealPlans.length === 0) {
    return (
      <NutritionNavigationGuard requiresSetup={true}>
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
              <Text color={textColor}>Loading your meal plan...</Text>
            </VStack>
          </Box>
        </AppContainer>
      </NutritionNavigationGuard>
    );
  }

  return (
    <NutritionNavigationGuard requiresSetup={true}>
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
            My Meal Plan
          </Text>
          <Box w="40px" /> {/* Spacer */}
        </HStack>
      </Box>

      {/* Main Content */}
      <Box p={6} pb={24}>
        <VStack spacing={6} w="full">
          
          {/* Welcome Section */}
          <Box w="full" textAlign="center">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={2}>
              Your Personalized Meals
            </Text>
            <Text fontSize="sm" color="gray.400">
              Your curated collection of personalized meals
            </Text>
          </Box>

          {/* Meal Type Tabs */}
          <Box w="full">
            <Tabs
              index={getCurrentTabIndex()}
              onChange={handleTabChange}
              variant="soft-rounded"
              colorScheme="primary"
            >
              <TabList justifyContent="center" mb={6}>
                {mealTypes.map((type) => (
                  <Tab
                    key={type.value}
                    color="gray.400"
                    _selected={{ color: 'white', bg: 'primary.500' }}
                    fontSize="sm"
                    px={4}
                    py={2}
                    mx={1}
                    cursor={'pointer'}
                  >
                    <HStack cursor={'pointer'} fontSize={'x-small'} spacing={2}>
                      <Text>{type.icon}</Text>
                      <Text>{type.label}</Text>
                    </HStack>
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                {mealTypes.map((type) => {
                  const typeMealPlans = mealPlans.filter(plan =>
                    plan.meal_id && plan.meal_id.type === type.value
                  );

                  return (
                    <TabPanel key={type.value} px={0}>
                      {typeMealPlans.length > 0 ? (
                        <SimpleGrid columns={2} spacing={4} w="full">
                          {typeMealPlans.map((mealPlan) => (
                            <MealCard key={mealPlan._id} mealPlan={mealPlan} />
                          ))}
                        </SimpleGrid>
                      ) : (
                        <Box textAlign="center" py={8}>
                          <Text fontSize="4xl" mb={4}>🍽️</Text>
                          <Text color="gray.400" fontSize="sm">
                            No {type.label.toLowerCase()} meals in your plan
                          </Text>
                          <Text color="gray.500" fontSize="xs" mt={2}>
                            Add meals from the discovery section
                          </Text>
                          <Button
                            size="sm"
                            colorScheme="primary"
                            mt={3}
                            onClick={() => navigate('/home')}
                          >
                            Go to Home
                          </Button>
                        </Box>
                      )}
                    </TabPanel>
                  );
                })}
              </TabPanels>
            </Tabs>
          </Box>

          {planError && (
            <Box
              w="full"
              bg="red.900"
              color="red.200"
              p={4}
              borderRadius="md"
              textAlign="center"
            >
              <Text fontSize="sm">{planError}</Text>
            </Box>
          )}
        </VStack>
      </Box>

        <BottomNavigation />
      </AppContainer>
    </NutritionNavigationGuard>
  );
};

export default MealPlanMainScreen;
