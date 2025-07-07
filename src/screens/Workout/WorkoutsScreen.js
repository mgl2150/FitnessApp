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
  Spinner,
  Alert,
  AlertIcon,

  useBreakpointValue,
} from '@chakra-ui/react';
import { ArrowBackIcon, StarIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';
import { useWorkout } from '../../contexts/WorkoutContext';
import { useAuth } from '../../contexts/AuthContext';
import { ResponsiveGrid } from '../../components/Layout';

const WorkoutCard = ({ workout, onSelect, cardBg, textColor, onToggleFavorite, isFavorite, isAuthenticated }) => (
  <Card
    bg={cardBg}
    cursor="pointer"
    _hover={{ transform: 'scale(1.05)' }}
    transition="all 0.2s"
    borderRadius="xl"
    overflow="hidden"
    w="full"
  >
    <CardBody p={0}>
      <Box position="relative" onClick={() => onSelect(workout.id)}>
        <Image
          src={workout.avatar || '/api/placeholder/300/200'}
          alt={workout.name}
          w="full"
          h={{ base: "120px", md: "150px", lg: "180px" }}
          objectFit="cover"
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.300"
        />
        <Badge
          position="absolute"
          top={{ base: 2, md: 3 }}
          left={{ base: 2, md: 3 }}
          bg={workout.level === 'beginner' ? 'green.500' :
              workout.level === 'intermediate' ? 'orange.500' : 'red.500'}
          color="white"
          fontSize={{ base: "xs", md: "sm" }}
          px={{ base: 2, md: 3 }}
          py={{ base: 1, md: 1.5 }}
          borderRadius="md"
        >
          {workout.level}
        </Badge>
        {/* Favorite Button */}
        {isAuthenticated && (
          <IconButton
            position="absolute"
            top={{ base: 2, md: 3 }}
            right={{ base: 2, md: 3 }}
            icon={<StarIcon />}
            size={{ base: "sm", md: "md" }}
            variant="ghost"
            color={isFavorite ? "yellow.400" : "white"}
            bg={isFavorite ? "blackAlpha.600" : "blackAlpha.400"}
            _hover={{ bg: "blackAlpha.700" }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(workout.id || workout._id);
            }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          />
        )}
        <Box
          position="absolute"
          bottom={{ base: 2, md: 3 }}
          right={{ base: 2, md: 3 }}
          w={{ base: "8", md: "10" }}
          h={{ base: "8", md: "10" }}
          bg="primary.500"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize={{ base: "sm", md: "md" }} color="white">▶</Text>
        </Box>
      </Box>

      <Box p={{ base: 3, md: 4 }}>
        <VStack align="start" spacing={{ base: 2, md: 3 }}>
          <Text
            fontSize={{ base: "sm", md: "md", lg: "lg" }}
            fontWeight="bold"
            color={textColor}
            noOfLines={1}
          >
            {workout.name}
          </Text>
          <VStack align="start" spacing={1} w="full">
            <HStack spacing={1}>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">⏱</Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">{workout.minutes} min</Text>
            </HStack>
            <HStack spacing={1}>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">🔥</Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">{workout.cal} kcal</Text>
            </HStack>
            {workout.excercise && (
              <HStack spacing={1}>
                <Text fontSize="xs" color="gray.400">💪</Text>
                <Text fontSize="xs" color="gray.400">{workout.excercise} exercises</Text>
              </HStack>
            )}
            {workout.is_recommended && (
              <Text fontSize="xs" color="primary.400" fontWeight="semibold">
                ⭐ Recommended
              </Text>
            )}
          </VStack>
        </VStack>
      </Box>
    </CardBody>
  </Card>
);

const WorkoutsScreen = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    workouts,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    fetchWorkouts,
    fetchPopularWorkouts,
    popularWorkouts,

    pagination,
    favorites,
    favoritesLoading,
    fetchFavorites,
    toggleFavorite,
    loadMoreWorkouts,
    resetWorkouts
  } = useWorkout();

  const textColor = 'white';
  const cardBg = '#2D3748';

  const tabToFilter = ['beginner', 'intermediate', 'advanced'];
  const filterToTab = { beginner: 0, intermediate: 1, advanced: 2 };

  const getUserWorkoutLevel = () => {
    if (!user?.activityLevel) return 'beginner';

    if (user.activityLevel === 'beginer') return 'beginner';

    return user.activityLevel;
  };

  const getInitialTabIndex = () => {
    const userLevel = getUserWorkoutLevel();
    return filterToTab[userLevel] || 0;
  };

  const [tabIndex, setTabIndex] = useState(getInitialTabIndex);

  useEffect(() => {
    console.log('WorkoutsScreen: Initial data fetch');
    const userLevel = getUserWorkoutLevel();
    const initialTabIndex = filterToTab[userLevel] || 0;

    setTabIndex(initialTabIndex);
    setActiveFilter(userLevel);
    fetchWorkouts({ level: userLevel });
    fetchPopularWorkouts();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchFavorites(user._id);
    }
  }, [isAuthenticated, user?._id, fetchFavorites]);

  useEffect(() => {
    setTabIndex(filterToTab[activeFilter] || 0);
  }, [activeFilter, filterToTab]);

  const handleBackNavigation = () => {
    navigate('/home');
  };

  const handleCreateRoutine = () => {
    navigate('/workout/create-routine');
  };

  const handleWorkoutSelect = (workoutId) => {
    navigate(`/workout/${workoutId}`);
  };

  const handleTabChange = (index) => {
    setTabIndex(index);
    const newFilter = tabToFilter[index];
    setActiveFilter(newFilter);

    resetWorkouts();
    fetchWorkouts({ level: newFilter });
  };

  const handleToggleFavorite = async (workoutId) => {
    if (!isAuthenticated || !user?._id) {
      return;
    }

    try {
      await toggleFavorite(workoutId, user._id);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleLoadMore = () => {
    const currentLevel = tabToFilter[tabIndex];
    loadMoreWorkouts({ level: currentLevel });
  };

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, lg: false });


  return (
    <AppContainer hasBottomNav={true} responsive={true} hasSideNav={!isMobile}>
      {/* Header */}
      <Box
        bg="#232323"
        px={{ base: 6, md: 8, lg: 12 }}
        py={{ base: 4, md: 6 }}
        pt={{ base: 8, md: 10 }}
      >
        <HStack justify="space-between" align="center">
          <IconButton
            icon={<ArrowBackIcon />}
            variant="ghost"
            size={{ base: "lg", md: "xl" }}
            onClick={handleBackNavigation}
            aria-label="Go back"
            color={textColor}
          />
          <Text
            fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
            fontWeight="bold"
            color={textColor}
          >
            Workouts
          </Text>
          <Box w={{ base: "40px", md: "48px" }} /> {/* Spacer */}
        </HStack>
      </Box>

      {/* Main Content */}
      <Box
        p={{ base: 6, md: 8, lg: 12 }}
        pb={{ base: 24, lg: 12 }}
      >
        <VStack spacing={{ base: 6, md: 8, lg: 10 }} w="full">
          {/* Create Routine Button */}
          <Button
            w="full"
            maxW={{ base: "full", md: "400px", lg: "500px" }}
            bg="primary.500"
            color="white"
            size={{ base: "lg", md: "xl" }}
            onClick={handleCreateRoutine}
            _hover={{ bg: 'primary.600' }}
            borderRadius="xl"
            h={{ base: "56px", md: "64px", lg: "72px" }}
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            fontWeight="semibold"
          >
            Create Your Own Routine
          </Button>

          {/* Workout Level Tabs */}
          <Tabs
            index={tabIndex}
            onChange={handleTabChange}
            variant="soft-rounded"
            colorScheme="primary"
            w="full"
          >
            <TabList
              bg={cardBg}
              p={{ base: 2, md: 3 }}
              borderRadius="xl"
              mb={{ base: 6, md: 8 }}
            >
              <Tab
                flex={1}
                color="gray.400"
                _selected={{ color: 'white', bg: 'primary.500' }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="semibold"
                py={{ base: 2, md: 3 }}
              >
                🌱 Beginner
              </Tab>
              <Tab
                flex={1}
                color="gray.400"
                _selected={{ color: 'white', bg: 'primary.500' }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="semibold"
                py={{ base: 2, md: 3 }}
              >
                🔥 Intermediate
              </Tab>
              <Tab
                flex={1}
                color="gray.400"
                _selected={{ color: 'white', bg: 'primary.500' }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="semibold"
                py={{ base: 2, md: 3 }}
              >
                ⚡ Advanced
              </Tab>
            </TabList>

            <TabPanels>
              {}
              <TabPanel p={0}>
                {loading ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <Spinner size="lg" color="primary.500" />
                  </Box>
                ) : error ? (
                  <Alert status="error" bg="red.900" color="white" borderRadius="xl">
                    <AlertIcon />
                    {error}
                  </Alert>
                ) : (
                  <VStack spacing={4} w="full">
                    <ResponsiveGrid
                      columns={{ base: 2, md: 3, lg: 4, xl: 5 }}
                      spacing={{ base: 4, md: 6, lg: 8 }}
                      w="full"
                    >
                      {workouts.map((workout) => (
                        <WorkoutCard
                          key={workout.id || workout._id}
                          workout={workout}
                          onSelect={handleWorkoutSelect}
                          onToggleFavorite={handleToggleFavorite}
                          isFavorite={favorites.includes(workout.id || workout._id)}
                          isAuthenticated={isAuthenticated}
                          cardBg={cardBg}
                          textColor={textColor}
                        />
                      ))}
                    </ResponsiveGrid>

                    {}
                    {pagination.hasMore && (
                      <Button
                        onClick={handleLoadMore}
                        isLoading={loading}
                        loadingText="Loading more..."
                        variant="outline"
                        colorScheme="primary"
                        size="md"
                        w="full"
                        maxW="200px"
                      >
                        Load More Workouts
                      </Button>
                    )}
                  </VStack>
                )}
              </TabPanel>

              {}
              <TabPanel p={0}>
                {loading ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <Spinner size="lg" color="primary.500" />
                  </Box>
                ) : error ? (
                  <Alert status="error" bg="red.900" color="white" borderRadius="xl">
                    <AlertIcon />
                    {error}
                  </Alert>
                ) : (
                  <VStack spacing={4} w="full">
                    <ResponsiveGrid
                      columns={{ base: 2, md: 3, lg: 4, xl: 5 }}
                      spacing={{ base: 4, md: 6, lg: 8 }}
                      w="full"
                    >
                      {workouts.map((workout) => (
                        <WorkoutCard
                          key={workout.id || workout._id}
                          workout={workout}
                          onSelect={handleWorkoutSelect}
                          onToggleFavorite={handleToggleFavorite}
                          isFavorite={favorites.includes(workout.id || workout._id)}
                          isAuthenticated={isAuthenticated}
                          cardBg={cardBg}
                          textColor={textColor}
                        />
                      ))}
                    </ResponsiveGrid>

                    {}
                    {pagination.hasMore && (
                      <Button
                        onClick={handleLoadMore}
                        isLoading={loading}
                        loadingText="Loading more..."
                        variant="outline"
                        colorScheme="primary"
                        size="md"
                        w="full"
                        maxW="200px"
                      >
                        Load More Workouts
                      </Button>
                    )}
                  </VStack>
                )}
              </TabPanel>

              {}
              <TabPanel p={0}>
                {loading ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <Spinner size="lg" color="primary.500" />
                  </Box>
                ) : error ? (
                  <Alert status="error" bg="red.900" color="white" borderRadius="xl">
                    <AlertIcon />
                    {error}
                  </Alert>
                ) : (
                  <VStack spacing={4} w="full">
                    <ResponsiveGrid
                      columns={{ base: 2, md: 3, lg: 4, xl: 5 }}
                      spacing={{ base: 4, md: 6, lg: 8 }}
                      w="full"
                    >
                      {workouts.map((workout) => (
                        <WorkoutCard
                          key={workout.id || workout._id}
                          workout={workout}
                          onSelect={handleWorkoutSelect}
                          onToggleFavorite={handleToggleFavorite}
                          isFavorite={favorites.includes(workout.id || workout._id)}
                          isAuthenticated={isAuthenticated}
                          cardBg={cardBg}
                          textColor={textColor}
                        />
                      ))}
                    </ResponsiveGrid>

                    {}
                    {pagination.hasMore && (
                      <Button
                        onClick={handleLoadMore}
                        isLoading={loading}
                        loadingText="Loading more..."
                        variant="outline"
                        colorScheme="primary"
                        size="md"
                        w="full"
                        maxW="200px"
                      >
                        Load More Workouts
                      </Button>
                    )}
                  </VStack>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>
    </AppContainer>
  );
};

export default WorkoutsScreen;
