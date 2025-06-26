import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  IconButton,

  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Image,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { ArrowBackIcon, StarIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';
import { useArticle } from '../../contexts/ArticleContext';
import { useWorkout } from '../../contexts/WorkoutContext';
import { useAuth } from '../../contexts/AuthContext';

const FavoritesScreen = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
    favorites: favoriteArticleIds,
    fetchFavorites: fetchArticleFavorites,
    toggleFavorite: toggleArticleFavorite,
  } = useArticle();
  const {
    workouts,
    loading: workoutsLoading,
    error: workoutsError,
    favorites: favoriteWorkoutIds,
    fetchFavorites: fetchWorkoutFavorites,
    toggleFavorite: toggleWorkoutFavorite,
    fetchWorkouts,
  } = useWorkout();

  const cardBg = '#2D3748';
  const textColor = 'white';

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchArticleFavorites(user._id);
      fetchWorkoutFavorites(user._id);
      // Fetch workouts to populate the workouts array for filtering
      fetchWorkouts({}, { limit: 50 }); // Fetch more workouts to ensure favorites are included
    }
  }, [isAuthenticated, user, fetchArticleFavorites, fetchWorkoutFavorites, fetchWorkouts]);

  const handleBackNavigation = () => {
    navigate('/profile');
  };

  // Filter articles and workouts to show only favorites
  const favoriteArticles = articles.filter(article =>
    favoriteArticleIds.includes(article.id || article._id)
  );

  const favoriteWorkouts = workouts.filter(workout =>
    favoriteWorkoutIds.includes(workout.id || workout._id)
  );



  const handleArticleSelect = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  const handleWorkoutSelect = (workoutId) => {
    navigate(`/workout/${workoutId}`);
  };

  const handleToggleArticleFavorite = async (articleId) => {
    if (!user?._id) return;
    try {
      await toggleArticleFavorite(articleId, user._id);
    } catch (error) {
      console.error('Failed to toggle article favorite:', error);
    }
  };

  const handleToggleWorkoutFavorite = async (workoutId) => {
    if (!user?._id) return;
    try {
      await toggleWorkoutFavorite(workoutId, user._id);
    } catch (error) {
      console.error('Failed to toggle workout favorite:', error);
    }
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
            Favorites
          </Text>
          <Box w="40px" /> {/* Spacer for centering */}
        </HStack>
      </Box>

      {/* Main Content */}
      <Box p={6} pb={24}>
        {!isAuthenticated ? (
          <Box textAlign="center" py={12}>
            <Text fontSize="6xl" mb={4}>🔒</Text>
            <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={2}>
              Login Required
            </Text>
            <Text fontSize="md" color="gray.400" maxW="300px" mx="auto">
              Please log in to view your favorite articles and workouts.
            </Text>
          </Box>
        ) : (
          <VStack spacing={6} w="full">
            {/* Tabbed Favorites */}
            <Tabs variant="soft-rounded" colorScheme="primary" w="full">
              <TabList bg={cardBg} p={2} borderRadius="xl" mb={6}>
                <Tab
                  flex={1}
                  color="gray.400"
                  _selected={{ color: 'white', bg: 'primary.500' }}
                  fontSize="sm"
                  fontWeight="semibold"
                >
                  📚 Articles ({favoriteArticles.length})
                </Tab>
                <Tab
                  flex={1}
                  color="gray.400"
                  _selected={{ color: 'white', bg: 'primary.500' }}
                  fontSize="sm"
                  fontWeight="semibold"
                >
                  💪 Workouts ({favoriteWorkouts.length})
                </Tab>
              </TabList>

              <TabPanels>
                {/* Articles Tab */}
                <TabPanel p={0}>
                  {articlesLoading ? (
                    <Box display="flex" justifyContent="center" py={8}>
                      <Spinner size="lg" color="primary.500" />
                    </Box>
                  ) : articlesError ? (
                    <Alert status="error" bg="red.900" color="white" borderRadius="xl">
                      <AlertIcon />
                      {articlesError}
                    </Alert>
                  ) : favoriteArticles.length > 0 ? (
                    <SimpleGrid columns={1} spacing={4} w="full">
                      {favoriteArticles.map((article) => (
                        <Card
                          key={article.id || article._id}
                          bg={cardBg}
                          cursor="pointer"
                          onClick={() => handleArticleSelect(article.id || article._id)}
                          _hover={{ transform: 'scale(1.02)' }}
                          transition="all 0.2s"
                          borderRadius="xl"
                          overflow="hidden"
                        >
                          <CardBody p={0}>
                            <HStack spacing={4} p={4}>
                              <Image
                                src={article.image || article.avatar || '/api/placeholder/300/200'}
                                alt={article.title || article.name}
                                w="80px"
                                h="80px"
                                objectFit="cover"
                                borderRadius="lg"
                              />
                              <VStack align="start" spacing={1} flex={1}>
                                <Text fontSize="md" fontWeight="bold" color={textColor} noOfLines={2}>
                                  {article.title || article.name}
                                </Text>
                                <Text fontSize="sm" color="gray.400" noOfLines={2}>
                                  {article.excerpt || article.description}
                                </Text>
                                {article.category && (
                                  <Badge bg="primary.500" color="white" fontSize="xs" px={2} py={1} borderRadius="md">
                                    {article.category}
                                  </Badge>
                                )}
                              </VStack>
                              <IconButton
                                icon={<StarIcon />}
                                size="sm"
                                variant="ghost"
                                color="yellow.400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleArticleFavorite(article.id || article._id);
                                }}
                                aria-label="Remove from favorites"
                              />
                            </HStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Box textAlign="center" py={12}>
                      <Text fontSize="6xl" mb={4}>📚</Text>
                      <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={2}>
                        No Favorite Articles
                      </Text>
                      <Text fontSize="md" color="gray.400" maxW="300px" mx="auto">
                        Start adding articles to your favorites to see them here.
                      </Text>
                    </Box>
                  )}
                </TabPanel>

                {/* Workouts Tab */}
                <TabPanel p={0}>
                  {workoutsLoading ? (
                    <Box display="flex" justifyContent="center" py={8}>
                      <Spinner size="lg" color="primary.500" />
                    </Box>
                  ) : workoutsError ? (
                    <Alert status="error" bg="red.900" color="white" borderRadius="xl">
                      <AlertIcon />
                      {workoutsError}
                    </Alert>
                  ) : favoriteWorkouts.length > 0 ? (
                    <SimpleGrid columns={2} spacing={4} w="full">
                      {favoriteWorkouts.map((workout) => (
                        <Card
                          key={workout.id || workout._id}
                          bg={cardBg}
                          cursor="pointer"
                          onClick={() => handleWorkoutSelect(workout.id || workout._id)}
                          _hover={{ transform: 'scale(1.05)' }}
                          transition="all 0.2s"
                          borderRadius="xl"
                          overflow="hidden"
                        >
                          <CardBody p={0}>
                            <Box position="relative">
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
                              <IconButton
                                position="absolute"
                                top={2}
                                right={2}
                                icon={<StarIcon />}
                                size="sm"
                                variant="ghost"
                                color="yellow.400"
                                bg="blackAlpha.600"
                                _hover={{ bg: "blackAlpha.700" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleWorkoutFavorite(workout.id || workout._id);
                                }}
                                aria-label="Remove from favorites"
                              />
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
                                </VStack>
                              </VStack>
                            </Box>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Box textAlign="center" py={12}>
                      <Text fontSize="6xl" mb={4}>💪</Text>
                      <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={2}>
                        No Favorite Workouts
                      </Text>
                      <Text fontSize="md" color="gray.400" maxW="300px" mx="auto">
                        Start adding workouts to your favorites to see them here.
                      </Text>
                    </Box>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        )}
      </Box>

      <BottomNavigation />
    </AppContainer>
  );
};

export default FavoritesScreen;
