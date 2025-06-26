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
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ArrowBackIcon, StarIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';
import { useWorkout } from '../../contexts/WorkoutContext';
import { useAuth } from '../../contexts/AuthContext';

const WorkoutCard = ({ workout, onSelect, cardBg, textColor, onToggleFavorite, isFavorite, isAuthenticated }) => (
  <Card
    bg={cardBg}
    cursor="pointer"
    _hover={{ transform: 'scale(1.05)' }}
    transition="all 0.2s"
    borderRadius="xl"
    overflow="hidden"
  >
    <CardBody p={0}>
      <Box position="relative" onClick={() => onSelect(workout.id)}>
        <Image
          src={workout.avatar || '/api/placeholder/300/200'}
          alt={workout.name}
          w="full"
          h="120px"
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
          top={2}
          left={2}
          bg={workout.level === 'beginner' ? 'green.500' :
              workout.level === 'intermediate' ? 'orange.500' : 'red.500'}
          color="white"
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="md"
        >
          {workout.level}
        </Badge>
        {}
        {isAuthenticated && (
          <IconButton
            position="absolute"
            top={2}
            right={2}
            icon={<StarIcon />}
            size="sm"
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
          bottom={2}
          right={2}
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

      <Box p={3}>
        <VStack align="start" spacing={2}>
          <Text fontSize="sm" fontWeight="bold" color={textColor} noOfLines={1}>
            {workout.name}
          </Text>
          <VStack align="start" spacing={1} w="full">
            <HStack spacing={1}>
              <Text fontSize="xs" color="gray.400">⏱</Text>
              <Text fontSize="xs" color="gray.400">{workout.minutes} min</Text>
            </HStack>
            <HStack spacing={1}>
              <Text fontSize="xs" color="gray.400">🔥</Text>
              <Text fontSize="xs" color="gray.400">{workout.cal} kcal</Text>
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

  const [tabIndex, setTabIndex] = useState(0);
  const textColor = 'white';
  const cardBg = '#2D3748';

  const tabToFilter = ['beginner', 'intermediate', 'advanced'];
  const filterToTab = { beginner: 0, intermediate: 1, advanced: 2 };

  useEffect(() => {

    console.log('WorkoutsScreen: Initial data fetch');
    fetchWorkouts({ level: 'beginner' });
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

  return (
    <AppContainer hasBottomNav={true}>
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
            Workouts
          </Text>
          <Box w="40px" /> {}
        </HStack>
      </Box>

      {}
      <Box p={6} pb={24}>
        <VStack spacing={6} w="full">
          {}
          <Button
            w="full"
            bg="primary.500"
            color="white"
            size="lg"
            onClick={handleCreateRoutine}
            _hover={{ bg: 'primary.600' }}
            borderRadius="xl"
            h="56px"
            fontSize="md"
            fontWeight="semibold"
          >
            Create Your Own Routine
          </Button>

          {}
          <Tabs
            index={tabIndex}
            onChange={handleTabChange}
            variant="soft-rounded"
            colorScheme="primary"
            w="full"
          >
            <TabList bg={cardBg} p={2} borderRadius="xl" mb={6}>
              <Tab
                flex={1}
                color="gray.400"
                _selected={{ color: 'white', bg: 'primary.500' }}
                fontSize="sm"
                fontWeight="semibold"
              >
                🌱 Beginner
              </Tab>
              <Tab
                flex={1}
                color="gray.400"
                _selected={{ color: 'white', bg: 'primary.500' }}
                fontSize="sm"
                fontWeight="semibold"
              >
                🔥 Intermediate
              </Tab>
              <Tab
                flex={1}
                color="gray.400"
                _selected={{ color: 'white', bg: 'primary.500' }}
                fontSize="sm"
                fontWeight="semibold"
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
                    <SimpleGrid columns={2} spacing={4} w="full">
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
                    </SimpleGrid>

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
                    <SimpleGrid columns={2} spacing={4} w="full">
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
                    </SimpleGrid>

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
                    <SimpleGrid columns={2} spacing={4} w="full">
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
                    </SimpleGrid>

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

          {}
          {popularWorkouts && popularWorkouts.length > 0 && (
            <Box w="full" mt={4}>
              <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
                Popular This Week
              </Text>
              <VStack spacing={3} w="full">
                {popularWorkouts.slice(0, 3).map((workout) => (
                  <Card
                    key={workout.id}
                    bg={cardBg}
                    w="full"
                    borderRadius="xl"
                    cursor="pointer"
                    onClick={() => handleWorkoutSelect(workout.id)}
                    _hover={{ transform: 'scale(1.02)' }}
                    transition="all 0.2s"
                  >
                    <CardBody p={4}>
                      <HStack spacing={4}>
                        <Image
                          src={workout.avatar || '/api/placeholder/300/200'}
                          alt={workout.name}
                          w="80px"
                          h="80px"
                          objectFit="cover"
                          borderRadius="lg"
                        />
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontSize="md" fontWeight="bold" color={textColor}>
                            {workout.name}
                          </Text>
                          <Text fontSize="sm" color="gray.400" noOfLines={1}>
                            {workout.description}
                          </Text>
                          <HStack spacing={3}>
                            <HStack spacing={1}>
                              <Text fontSize="xs" color="gray.400">⏱</Text>
                              <Text fontSize="xs" color="gray.400">{workout.minutes} min</Text>
                            </HStack>
                            <HStack spacing={1}>
                              <Text fontSize="xs" color="gray.400">🔥</Text>
                              <Text fontSize="xs" color="gray.400">{workout.cal} kcal</Text>
                            </HStack>
                            <HStack spacing={1}>
                              <Text fontSize="xs" color="gray.400">💪</Text>
                              <Text fontSize="xs" color="gray.400">{workout.excercise || 0} exercises</Text>
                            </HStack>
                          </HStack>
                        </VStack>
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
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>

      <BottomNavigation />
    </AppContainer>
  );
};

export default WorkoutsScreen;
