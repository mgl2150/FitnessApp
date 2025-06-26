import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  IconButton,
  Image,
  Spinner,
  useToast,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useArticle } from "../../contexts/ArticleContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import { useNutritionNavigation } from "../../hooks/useNutritionNavigation";
import BottomNavigation from "../../components/Navigation/BottomNavigation";
import AppContainer from "../../components/Layout/AppContainer";
import { ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { articles, fetchArticles } = useArticle();
  const {
    workouts,
    loading: workoutsLoading,
    fetchWorkouts,
    favorites,
    favoritesLoading,
    fetchFavorites,
    toggleFavorite,
    fetchWorkoutGuides,
  } = useWorkout();
  const { navigateToNutrition } = useNutritionNavigation();
  const toast = useToast();
  const textColor = "white";

  // Fetch data on component mount
  useEffect(() => {
    fetchArticles({}, { limit: 2 }); // Fetch only 2 articles for home page

    // Fetch workouts (both recommended and weekly challenge)
    // We need to fetch more workouts to include weekly challenge workouts
    fetchWorkouts({}, { limit: 10 }); // Fetch all workouts to find weekly challenge

    // Fetch user favorites if authenticated
    if (isAuthenticated && user?._id) {
      fetchFavorites(user._id);
    }
  }, [
    fetchArticles,
    fetchWorkouts,
    fetchFavorites,
    isAuthenticated,
    user?._id,
  ]);

  // Get weekly challenge workout
  console.log('All workouts:', workouts);
  console.log('Workouts length:', workouts.length);

  const weeklyChallenge = workouts.find(workout => workout.is_weekly_challenge === true) ||
    workouts.find(workout => workout.level === 'advanced');

  console.log('Weekly challenge found:', weeklyChallenge);

  // Get recommended workouts for the home page (limit to 2)
  const recommendedWorkouts = workouts.filter(workout => workout.is_recommended === true).slice(0, 2);

  // Helper function to construct media URLs
  const getMediaUrl = (filename) => {
    if (!filename) return null;
    if (filename.startsWith("http")) return filename;
    return `http://localhost:1200/${filename}`;
  };

  const handleProfileNavigation = () => {
    navigate("/profile");
  };

  const handleWorkoutNavigation = () => {
    navigate("/workout");
  };

  const handleNutritionNavigation = () => {
    navigateToNutrition();
  };

  const handleProgressNavigation = () => {
    navigate("/progress");
  };

  const handleCommunityNavigation = () => {
    // Placeholder for future implementation
    console.log("Community navigation - to be implemented");
  };

  const handleWorkoutSelect = (workoutId) => {
    navigate(`/workout/${workoutId}`);
  };

  const handleWeeklyChallengeClick = async (workoutId) => {
    try {
      // Fetch workout guides to get the first exercise
      const guides = await fetchWorkoutGuides(workoutId);

      if (guides && guides.length > 0) {
        // Navigate to the first exercise detail
        const firstExercise = guides[0];
        const exerciseId = firstExercise.id || firstExercise._id;
        navigate(`/workout/${workoutId}`);
      } else {
        // Fallback to workout detail if no exercises found
        toast({
          title: "No Exercises Found",
          description:
            "This workout has no exercises available. Redirecting to workout details.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        navigate(`/workout/${workoutId}`);
      }
    } catch (error) {
      console.error(
        "Failed to fetch workout guides for weekly challenge:",
        error
      );
      toast({
        title: "Error",
        description:
          "Failed to load workout exercises. Redirecting to workout details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/workout/${workoutId}`);
    }
  };

  const handleToggleFavorite = async (workoutId, event) => {
    event.stopPropagation(); // Prevent navigation when clicking heart

    if (!isAuthenticated || !user?._id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save workouts to your favorites.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const isCurrentlyFavorited = favorites.includes(workoutId);

    try {
      const result = await toggleFavorite(workoutId, user._id);

      if (result && result.success) {
        const action =
          result.action || (isCurrentlyFavorited ? "removed" : "added");
        const workout = workouts.find((w) => (w.id || w._id) === workoutId);
        const workoutName = workout?.name || workout?.title || "Workout";

        toast({
          title:
            action === "added"
              ? "Added to Favorites"
              : "Removed from Favorites",
          description:
            action === "added"
              ? `${workoutName} has been saved to your favorites.`
              : `${workoutName} has been removed from your favorites.`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        const errorMessage = result?.error || "Failed to update favorites";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update favorites. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <AppContainer hasBottomNav={true}>
      {/* Header */}
      <Box bg="#232323" px={6} py={4} pt={8}>
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              Good Morning
            </Text>
            <Text fontSize="lg" color={textColor}>
              {user?.full_name?.split(" ")[0] || "User"}
            </Text>
          </VStack>

          <IconButton
            icon={
              <Avatar
                size="md"
                name={user?.full_name || "User"}
                bg="primary.500"
                color="white"
              />
            }
            variant="ghost"
            onClick={handleProfileNavigation}
            aria-label="Go to profile"
            _hover={{ bg: "transparent" }}
          />
        </HStack>
      </Box>

      {/* Main Content */}
      <Box p={6} pb={24}>
        <VStack spacing={6} w="full">
          {/* Category Icons */}
          <HStack spacing={6} w="full" justify="center">
            <VStack
              spacing={2}
              cursor="pointer"
              onClick={handleWorkoutNavigation}
            >
              <Box
                w="60px"
                h="60px"
                bg="#0EA5E9"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{
                  bg: "#0EA5E9",
                  transform: "scale(1.05)",
                }}
                transition="all 0.2s"
              >
                <Text fontSize="2xl">🏋️‍♂️</Text>
              </Box>
              <Text fontSize="xs" color="white" fontWeight="semibold">
                Workout
              </Text>
            </VStack>

            <VStack
              spacing={2}
              cursor="pointer"
              onClick={handleProgressNavigation}
            >
              <Box
                w="60px"
                h="60px"
                bg="#0EA5E9"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{
                  bg: "#0EA5E9",
                  transform: "scale(1.05)",
                }}
                transition="all 0.2s"
              >
                <Text fontSize="2xl">📊</Text>
              </Box>
              <Text fontSize="xs" color={textColor} fontWeight="semibold">
                Progress
              </Text>
            </VStack>

            <VStack
              spacing={2}
              cursor="pointer"
              onClick={handleNutritionNavigation}
            >
              <Box
                w="60px"
                h="60px"
                bg="#0EA5E9"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{
                  bg: "#0EA5E9",
                  transform: "scale(1.05)",
                }}
                transition="all 0.2s"
              >
                <Text fontSize="2xl">🍎</Text>
              </Box>
              <Text fontSize="xs" color={textColor} fontWeight="semibold">
                Nutrition
              </Text>
            </VStack>

            <VStack
              spacing={2}
              cursor="pointer"
              onClick={handleCommunityNavigation}
            >
              <Box
                w="60px"
                h="60px"
                bg="#0EA5E9"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{
                  bg: "#0EA5E9",
                  transform: "scale(1.05)",
                }}
                transition="all 0.2s"
              >
                <Text fontSize="2xl">👥</Text>
              </Box>
              <Text fontSize="xs" color={textColor} fontWeight="semibold">
                Community
              </Text>
            </VStack>
          </HStack>

          {/* Recommendations Section */}
          <Box w="full">
            <HStack justify="space-between" align="center" mb={4}>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                Recommendations
              </Text>
              <HStack spacing={1} cursor="pointer">
                <Text fontSize="sm" color="primary.400" fontWeight="semibold">
                  See All
                </Text>
                <ChevronRightIcon color="primary.400" />
              </HStack>
            </HStack>

            {workoutsLoading ? (
              <Box display="flex" justifyContent="center" py={8}>
                <Spinner size="lg" color="primary.500" />
              </Box>
            ) : (
              <HStack spacing={4} w="full">
                {recommendedWorkouts.map((workout) => {
                  const workoutId = workout.id || workout._id;
                  const isFavorited = favorites.includes(workoutId);

                  return (
                    <Box
                      key={workoutId}
                      position="relative"
                      w="48%"
                      h="200px"
                      borderRadius="xl"
                      overflow="hidden"
                      bg="gray.800"
                      cursor="pointer"
                      onClick={() => handleWorkoutSelect(workoutId)}
                      _hover={{ transform: "scale(1.02)" }}
                      transition="all 0.2s"
                    >
                      <Image
                        src={
                          getMediaUrl(workout.avatar) ||
                          "/api/placeholder/200/200"
                        }
                        alt={workout.name}
                        w="full"
                        h="full"
                        objectFit="cover"
                        fallback={
                          <Box
                            w="full"
                            h="full"
                            bg="gray.600"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Text fontSize="2xl">🏋️‍♂️</Text>
                          </Box>
                        }
                      />
                      <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        bg="blackAlpha.400"
                      />
                      <Box position="absolute" bottom={4} left={4} right={4}>
                        <VStack align="start" spacing={1}>
                          <Text
                            fontSize="md"
                            fontWeight="bold"
                            color="white"
                            noOfLines={1}
                          >
                            {workout.name}
                          </Text>
                          <HStack spacing={3}>
                            <HStack spacing={1}>
                              <Text fontSize="xs" color="white">
                                ⏱
                              </Text>
                              <Text fontSize="xs" color="white">
                                {workout.minutes} min
                              </Text>
                            </HStack>
                            <HStack spacing={1}>
                              <Text fontSize="xs" color="white">
                                🔥
                              </Text>
                              <Text fontSize="xs" color="white">
                                {workout.cal} kcal
                              </Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </Box>

                      {/* Recommended Badge */}
                      <Box
                        position="absolute"
                        top={3}
                        left={3}
                        px={2}
                        py={1}
                        bg="green.500"
                        borderRadius="md"
                      >
                        <Text fontSize="xs" color="white" fontWeight="semibold">
                          Recommended
                        </Text>
                      </Box>

                      {/* Favorite Star Icon */}
                      {isAuthenticated && (
                        <IconButton
                          icon={<StarIcon />}
                          position="absolute"
                          top={3}
                          right={3}
                          size="sm"
                          variant="ghost"
                          bg="whiteAlpha.200"
                          color={isFavorited ? "yellow.400" : "white"}
                          _hover={{
                            color: isFavorited ? "yellow.300" : "yellow.400",
                            bg: "whiteAlpha.300",
                          }}
                          _active={{
                            color: isFavorited ? "yellow.500" : "yellow.500",
                            bg: "whiteAlpha.400",
                          }}
                          transition="all 0.2s"
                          onClick={(e) => handleToggleFavorite(workoutId, e)}
                          isLoading={favoritesLoading}
                          aria-label={
                            isFavorited
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        />
                      )}

                      {/* Play Button */}
                      <Box
                        position="absolute"
                        bottom={4}
                        right={4}
                        w="8"
                        h="8"
                        bg="primary.500"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        _hover={{ bg: "primary.600" }}
                        transition="all 0.2s"
                      >
                        <Text fontSize="sm" color="white">
                          ▶
                        </Text>
                      </Box>
                    </Box>
                  );
                })}

                {/* Show placeholders if less than 2 recommended workouts */}
                {recommendedWorkouts.length < 2 &&
                  Array.from({ length: 2 - recommendedWorkouts.length }).map(
                    (_, index) => (
                      <Box
                        key={`placeholder-${index}`}
                        position="relative"
                        w="48%"
                        h="200px"
                        borderRadius="xl"
                        overflow="hidden"
                        bg="gray.800"
                      >
                        <Image
                          src="/api/placeholder/200/200"
                          alt="Loading workout..."
                          w="full"
                          h="full"
                          objectFit="cover"
                        />
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          bottom={0}
                          bg="blackAlpha.400"
                        />
                        <Box position="absolute" bottom={4} left={4} right={4}>
                          <Text fontSize="md" fontWeight="bold" color="white">
                            Loading...
                          </Text>
                        </Box>
                      </Box>
                    )
                  )}
              </HStack>
            )}
          </Box>

          {/* Weekly Challenge Section */}
          <Box w="full">
            <Box
              position="relative"
              w="full"
              h="200px"
              borderRadius="xl"
              overflow="hidden"
              bg="linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)"
              cursor="default"
              transition="all 0.2s"
            >
              <Box
                position="absolute"
                left={6}
                top="50%"
                transform="translateY(-50%)"
                zIndex={2}
              >
                <VStack align="start" spacing={3}>
                  <Text fontSize="2xl" fontWeight="bold" color="white">
                    Weekly
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="white" mt={-2}>
                    Challenge
                  </Text>
                  <Text fontSize="md" color="white" opacity={0.9}>
                    Burn To Run
                  </Text>
                  {weeklyChallenge && (
                    <Button
                      size="sm"
                      bg="rgba(255, 255, 255, 0.2)"
                      color="white"
                      borderRadius="full"
                      px={6}
                      py={2}
                      fontSize="sm"
                      fontWeight="semibold"
                      _hover={{
                        bg: "rgba(255, 255, 255, 0.3)",
                        transform: "translateY(-1px)",
                      }}
                      _active={{
                        bg: "rgba(255, 255, 255, 0.4)",
                        transform: "translateY(0px)",
                      }}
                      transition="all 0.2s"
                      onClick={() =>
                        handleWeeklyChallengeClick(
                          weeklyChallenge.id || weeklyChallenge._id
                        )
                      }
                    >
                      Let's Get Started
                    </Button>
                  )}
                </VStack>
              </Box>

              {/* Challenge Image */}
              <Box position="absolute" right={0} top={0} bottom={0} w="50%">
                <Image
                  src={
                    weeklyChallenge
                      ? getMediaUrl(weeklyChallenge.avatar) ||
                        "/workouts/fitness2.png"
                      : "/workouts/fitness2.png"
                  }
                  alt={
                    weeklyChallenge?.title ||
                    weeklyChallenge?.name ||
                    "Weekly Challenge"
                  }
                  w="full"
                  h="full"
                  objectFit="cover"
                  fallback={
                    <Box
                      w="full"
                      h="full"
                      bg="rgba(255, 255, 255, 0.1)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="4xl">💪</Text>
                    </Box>
                  }
                />
              </Box>

              {/* Favorite Star Icon for Weekly Challenge */}
              {isAuthenticated && weeklyChallenge && (
                <IconButton
                  icon={<StarIcon />}
                  position="absolute"
                  top={3}
                  right={3}
                  size="sm"
                  variant="ghost"
                  bg="whiteAlpha.200"
                  color={
                    favorites.includes(
                      weeklyChallenge.id || weeklyChallenge._id
                    )
                      ? "yellow.400"
                      : "white"
                  }
                  _hover={{
                    color: favorites.includes(
                      weeklyChallenge.id || weeklyChallenge._id
                    )
                      ? "yellow.300"
                      : "yellow.400",
                    bg: "whiteAlpha.300",
                  }}
                  _active={{
                    color: favorites.includes(
                      weeklyChallenge.id || weeklyChallenge._id
                    )
                      ? "yellow.500"
                      : "yellow.500",
                    bg: "whiteAlpha.400",
                  }}
                  transition="all 0.2s"
                  onClick={(e) =>
                    handleToggleFavorite(
                      weeklyChallenge.id || weeklyChallenge._id,
                      e
                    )
                  }
                  isLoading={favoritesLoading}
                  aria-label={
                    favorites.includes(
                      weeklyChallenge.id || weeklyChallenge._id
                    )
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                />
              )}
            </Box>
          </Box>

          {/* Articles & Tips Section */}
          <Box w="full">
            <HStack justify="space-between" align="center" mb={4}>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                Articles & Tips
              </Text>
              <HStack
                spacing={1}
                cursor="pointer"
                onClick={() => navigate("/articles")}
              >
                <Text fontSize="sm" color="primary.400" fontWeight="semibold">
                  See All
                </Text>
                <ChevronRightIcon color="primary.400" />
              </HStack>
            </HStack>

            <HStack spacing={4} w="full">
              {articles.slice(0, 2).map((article, index) => (
                <Box
                  key={article.id}
                  position="relative"
                  w="48%"
                  h="200px"
                  borderRadius="xl"
                  overflow="hidden"
                  bg="gray.800"
                  cursor="pointer"
                  onClick={() => navigate(`/articles/${article.id}`)}
                  _hover={{ transform: "scale(1.02)" }}
                  transition="all 0.2s"
                >
                  <Image
                    src={article.image || "/api/placeholder/200/200"}
                    alt={article.title}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="blackAlpha.600"
                  />
                  <Box position="absolute" bottom={4} left={4} right={4}>
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color="white"
                      noOfLines={2}
                    >
                      {article.title}
                    </Text>
                  </Box>
                  <Box
                    position="absolute"
                    top={3}
                    right={3}
                    w="8"
                    h="8"
                    bg="whiteAlpha.200"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="sm" color="white">
                      ⭐
                    </Text>
                  </Box>
                </Box>
              ))}

              {/* Show placeholder if less than 2 articles */}
              {articles.length < 2 &&
                Array.from({ length: 2 - articles.length }).map((_, index) => (
                  <Box
                    key={`placeholder-${index}`}
                    position="relative"
                    w="48%"
                    h="200px"
                    borderRadius="xl"
                    overflow="hidden"
                    bg="gray.800"
                  >
                    <Image
                      src="/api/placeholder/200/200"
                      alt="Loading..."
                      w="full"
                      h="full"
                      objectFit="cover"
                    />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="blackAlpha.600"
                    />
                    <Box position="absolute" bottom={4} left={4} right={4}>
                      <Text fontSize="sm" fontWeight="bold" color="white">
                        Loading...
                      </Text>
                    </Box>
                  </Box>
                ))}
            </HStack>
          </Box>
        </VStack>
      </Box>

      <BottomNavigation />
    </AppContainer>
  );
};

export default Home;
