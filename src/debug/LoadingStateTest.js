import React, { useEffect } from 'react';
import { Box, VStack, Text, Badge, HStack } from '@chakra-ui/react';
import { useArticle } from '../contexts/ArticleContext';
import { useWorkout } from '../contexts/WorkoutContext';

const LoadingStateTest = () => {
  const {
    loading: articlesLoading,
    detailLoading: articleDetailLoading,
    favoritesLoading: articleFavoritesLoading,
    articles,
    fetchArticles,
    fetchCategories,
  } = useArticle();

  const {
    loading: workoutsLoading,
    detailLoading: workoutDetailLoading,
    favoritesLoading: workoutFavoritesLoading,
    workouts,
    fetchWorkouts,
    fetchPopularWorkouts,
  } = useWorkout();

  useEffect(() => {
    console.log('LoadingStateTest: Triggering initial data fetch');
    fetchArticles();
    fetchCategories();
    fetchWorkouts({ level: 'beginner' });
    fetchPopularWorkouts();
  }, []);

  const getLoadingStatus = (isLoading) => (
    <Badge colorScheme={isLoading ? 'red' : 'green'}>
      {isLoading ? 'LOADING' : 'READY'}
    </Badge>
  );

  return (
    <Box p={6} bg="#232323" minH="100vh" color="white">
      <VStack spacing={6} align="start">
        <Text fontSize="2xl" fontWeight="bold">
          Loading State Debug Panel
        </Text>

        <Box w="full" p={4} bg="#2D3748" borderRadius="xl">
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Article Context States
          </Text>
          <VStack spacing={2} align="start">
            <HStack>
              <Text>Articles Loading:</Text>
              {getLoadingStatus(articlesLoading)}
              <Text fontSize="sm" color="gray.400">
                ({articles.length} articles loaded)
              </Text>
            </HStack>
            <HStack>
              <Text>Article Detail Loading:</Text>
              {getLoadingStatus(articleDetailLoading)}
            </HStack>
            <HStack>
              <Text>Article Favorites Loading:</Text>
              {getLoadingStatus(articleFavoritesLoading)}
            </HStack>
          </VStack>
        </Box>

        <Box w="full" p={4} bg="#2D3748" borderRadius="xl">
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Workout Context States
          </Text>
          <VStack spacing={2} align="start">
            <HStack>
              <Text>Workouts Loading:</Text>
              {getLoadingStatus(workoutsLoading)}
              <Text fontSize="sm" color="gray.400">
                ({workouts.length} workouts loaded)
              </Text>
            </HStack>
            <HStack>
              <Text>Workout Detail Loading:</Text>
              {getLoadingStatus(workoutDetailLoading)}
            </HStack>
            <HStack>
              <Text>Workout Favorites Loading:</Text>
              {getLoadingStatus(workoutFavoritesLoading)}
            </HStack>
          </VStack>
        </Box>

        <Box w="full" p={4} bg="#2D3748" borderRadius="xl">
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Debug Information
          </Text>
          <VStack spacing={2} align="start">
            <Text fontSize="sm">
              Check the browser console for detailed logs about data fetching.
            </Text>
            <Text fontSize="sm">
              If any loading states remain stuck on "LOADING", there's an issue with the context implementation.
            </Text>
            <Text fontSize="sm">
              Expected behavior: All states should show "READY" after initial data load.
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default LoadingStateTest;
