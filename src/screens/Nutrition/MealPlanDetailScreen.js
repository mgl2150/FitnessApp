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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { ArrowBackIcon, StarIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';

const MealPlanDetailScreen = () => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const textColor = 'white';
  const cardBg = '#2D3748';

  const handleBackNavigation = () => {
    navigate('/nutrition');
  };

  const handleStartPlan = () => {
    // TODO: Implement start plan functionality
    console.log('Starting meal plan:', planId);
  };

  // Mock data - in real app, this would be fetched based on planId
  const mealPlan = {
    id: planId,
    title: 'Weight Loss Plan',
    subtitle: 'Low Calorie & High Protein',
    calories: '1,200-1,500 cal/day',
    duration: '4 weeks',
    image: '/api/placeholder/400/200',
    rating: 4.8,
    reviews: 1234,
    description: 'A comprehensive weight loss meal plan designed to help you lose weight safely and sustainably. Features high-protein, low-calorie meals that keep you satisfied.',
    features: [
      'Balanced macronutrients',
      'Easy to prepare meals',
      'Shopping lists included',
      'Nutritionist approved',
    ],
    weeklyMeals: [
      {
        day: 'Monday',
        breakfast: 'Greek Yogurt with Berries',
        lunch: 'Grilled Chicken Salad',
        dinner: 'Baked Salmon with Vegetables',
        snack: 'Apple with Almond Butter',
      },
      {
        day: 'Tuesday',
        breakfast: 'Oatmeal with Banana',
        lunch: 'Turkey Wrap',
        dinner: 'Lean Beef Stir-fry',
        snack: 'Mixed Nuts',
      },
      // Add more days...
    ],
  };

  return (
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
            Meal Plan
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
          
          {/* Hero Section */}
          <Card bg={cardBg} w="full">
            <CardBody p={0}>
              <Box position="relative">
                <Image
                  src={mealPlan.image}
                  alt={mealPlan.title}
                  w="full"
                  h="200px"
                  objectFit="cover"
                  borderTopRadius="md"
                />
                <Badge
                  position="absolute"
                  top={3}
                  left={3}
                  bg="green.500"
                  color="white"
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="md"
                >
                  {mealPlan.duration}
                </Badge>
              </Box>
              
              <Box p={6}>
                <VStack align="start" spacing={3}>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {mealPlan.title}
                  </Text>
                  <Text fontSize="md" color="gray.400">
                    {mealPlan.subtitle}
                  </Text>
                  
                  <HStack spacing={4}>
                    <HStack spacing={1}>
                      <StarIcon color="yellow.400" w={4} h={4} />
                      <Text fontSize="sm" color={textColor}>{mealPlan.rating}</Text>
                      <Text fontSize="sm" color="gray.400">({mealPlan.reviews} reviews)</Text>
                    </HStack>
                    <Text fontSize="sm" color="primary.500" fontWeight="semibold">
                      {mealPlan.calories}
                    </Text>
                  </HStack>
                  
                  <Text fontSize="sm" color="gray.300" lineHeight="1.6">
                    {mealPlan.description}
                  </Text>
                </VStack>
              </Box>
            </CardBody>
          </Card>

          {/* Features */}
          <Box w="full">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={3}>
              What's Included
            </Text>
            <VStack spacing={2} align="start">
              {mealPlan.features.map((feature, index) => (
                <HStack key={index} spacing={3}>
                  <Text color="green.500">✓</Text>
                  <Text fontSize="sm" color="gray.300">
                    {feature}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>

          {/* Meal Preview */}
          <Box w="full">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Sample Week
            </Text>
            <Tabs variant="soft-rounded" colorScheme="primary">
              <TabList>
                <Tab color="gray.400" _selected={{ color: 'white', bg: 'primary.500' }}>
                  Week 1
                </Tab>
                <Tab color="gray.400" _selected={{ color: 'white', bg: 'primary.500' }}>
                  Week 2
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <VStack spacing={3} w="full">
                    {mealPlan.weeklyMeals.slice(0, 2).map((day, index) => (
                      <Card key={index} bg={cardBg} w="full">
                        <CardBody p={4}>
                          <VStack align="start" spacing={2}>
                            <Text fontSize="md" fontWeight="bold" color={textColor}>
                              {day.day}
                            </Text>
                            <VStack align="start" spacing={1} fontSize="sm">
                              <Text color="gray.300">
                                <Text as="span" color="primary.500" fontWeight="semibold">Breakfast:</Text> {day.breakfast}
                              </Text>
                              <Text color="gray.300">
                                <Text as="span" color="primary.500" fontWeight="semibold">Lunch:</Text> {day.lunch}
                              </Text>
                              <Text color="gray.300">
                                <Text as="span" color="primary.500" fontWeight="semibold">Dinner:</Text> {day.dinner}
                              </Text>
                              <Text color="gray.300">
                                <Text as="span" color="primary.500" fontWeight="semibold">Snack:</Text> {day.snack}
                              </Text>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </TabPanel>
                <TabPanel px={0}>
                  <Box textAlign="center" py={8}>
                    <Text color="gray.400">More meal plans coming soon...</Text>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Action Button */}
          <Button
            colorScheme="primary"
            size="lg"
            w="full"
            onClick={handleStartPlan}
          >
            Start This Plan
          </Button>
        </VStack>
      </Box>

      <BottomNavigation />
    </AppContainer>
  );
};

export default MealPlanDetailScreen;
