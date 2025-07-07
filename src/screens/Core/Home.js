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
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useArticle } from "../../contexts/ArticleContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import { useNutritionNavigation } from "../../hooks/useNutritionNavigation";
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

  useEffect(() => {
    fetchArticles({}, { limit: 2 });

    fetchWorkouts({}, { limit: 10 });

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

  console.log('All workouts:', workouts);
  console.log('Workouts length:', workouts.length);

  const weeklyChallenge = workouts.find(workout => workout.is_weekly_challenge === true) ||
    workouts.find(workout => workout.level === 'advanced');

  console.log('Weekly challenge found:', weeklyChallenge);

  const recommendedWorkouts = workouts.filter(workout => workout.is_recommended === true).slice(0, 2);

  const getMediaUrl = (filename) => {
    if (!filename) return null;
    if (filename.startsWith("http")) return filename;
    return 'http://localhost:1200/uploads/' + filename;
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

    navigate("/community");
  };

  const handleWorkoutSelect = (workoutId) => {
    navigate('/workout/' + workoutId);
  };

  const handleWeeklyChallengeClick = async (workoutId) => {
    try {

      const guides = await fetchWorkoutGuides(workoutId);

      if (guides && guides.length > 0) {


        navigate('/workout/' + workoutId);
      } else {

        toast({
          title: "No Exercises Found",
          description:
            "This workout has no exercises available. Redirecting to workout details.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        navigate('/workout/' + workoutId);
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
      navigate('/workout/' + workoutId);
    }
  };

  const handleToggleFavorite = async (workoutId, event) => {
    event.stopPropagation();

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
              ? workoutName + " has been saved to your favorites."
              : workoutName + " has been removed from your favorites.",
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

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <AppContainer hasBottomNav={true} responsive={true} hasSideNav={!isMobile}>
      {/* Header Section */}
      <Box
        bg="#232323"
        px={{ base: 6, md: 8, lg: 12 }}
        py={{ base: 4, md: 6 }}
        pt={{ base: 8, md: 10 }}
      >
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              color={textColor}
            >
              Good Morning
            </Text>
            <Text
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              color={textColor}
            >
              {user?.full_name?.split(" ")[0] || "User"}
            </Text>
          </VStack>

          <IconButton
            icon={
              <Avatar
                size={{ base: "md", md: "lg" }}
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
      <Box
        p={{ base: 6, md: 8, lg: 12 }}
        pb={{ base: 6, lg: 12 }}
      >
        <VStack spacing={{ base: 6, md: 8, lg: 10 }} w="full">
          {/* Quick Actions Grid */}
          <SimpleGrid
            columns={{ base: 4, md: 4, lg: 6 }}
            spacing={{ base: 6, md: 8, lg: 10 }}
            w="full"
            justifyItems="center"
          >
            <VStack
              spacing={{ base: 2, md: 3 }}
              cursor="pointer"
              onClick={handleWorkoutNavigation}
            >
              <Box
                w={{ base: "60px", md: "80px", lg: "100px" }}
                h={{ base: "60px", md: "80px", lg: "100px" }}
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
                <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>🏋️‍♂️</Text>
              </Box>
              <Text
                fontSize={{ base: "xs", md: "sm", lg: "md" }}
                color="white"
                fontWeight="semibold"
              >
                Workout
              </Text>
            </VStack>

            <VStack
              spacing={{ base: 2, md: 3 }}
              cursor="pointer"
              onClick={handleProgressNavigation}
            >
              <Box
                w={{ base: "60px", md: "80px", lg: "100px" }}
                h={{ base: "60px", md: "80px", lg: "100px" }}
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
                <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>📊</Text>
              </Box>
              <Text
                fontSize={{ base: "xs", md: "sm", lg: "md" }}
                color={textColor}
                fontWeight="semibold"
              >
                Progress
              </Text>
            </VStack>

            <VStack
              spacing={{ base: 2, md: 3 }}
              cursor="pointer"
              onClick={handleNutritionNavigation}
            >
              <Box
                w={{ base: "60px", md: "80px", lg: "100px" }}
                h={{ base: "60px", md: "80px", lg: "100px" }}
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
                <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>🍎</Text>
              </Box>
              <Text
                fontSize={{ base: "xs", md: "sm", lg: "md" }}
                color={textColor}
                fontWeight="semibold"
              >
                Nutrition
              </Text>
            </VStack>

            <VStack
              spacing={{ base: 2, md: 3 }}
              cursor="pointer"
              onClick={handleCommunityNavigation}
            >
              <Box
                w={{ base: "60px", md: "80px", lg: "100px" }}
                h={{ base: "60px", md: "80px", lg: "100px" }}
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
                <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>👥</Text>
              </Box>
              <Text
                fontSize={{ base: "xs", md: "sm", lg: "md" }}
                color={textColor}
                fontWeight="semibold"
              >
                Community
              </Text>
            </VStack>
          </SimpleGrid>

          {/* Recommendations Section */}
          <Box w="full">
            <Text
              fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="bold"
              color={textColor}
              mb={{ base: 4, md: 6 }}
            >
              Recommendations
            </Text>

            {workoutsLoading ? (
              <Box display="flex" justifyContent="center" py={8}>
                <Spinner size="lg" color="primary.500" />
              </Box>
            ) : (
              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
                spacing={{ base: 4, md: 6, lg: 8 }}
                w="full"
              >
                {recommendedWorkouts.map((workout) => {
                  const workoutId = workout.id || workout._id;
                  const isFavorited = favorites.includes(workoutId);

                  return (
                    <Box
                      key={workoutId}
                      position="relative"
                      w="full"
                      h={{ base: "200px", md: "250px", lg: "300px" }}
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
                            fontSize={{ base: "md", md: "lg", lg: "xl" }}
                            fontWeight="bold"
                            color="white"
                            noOfLines={1}
                          >
                            {workout.name}
                          </Text>
                          <HStack spacing={3}>
                            <HStack spacing={1}>
                              <Text fontSize={{ base: "xs", md: "sm" }} color="white">
                                ⏱
                              </Text>
                              <Text fontSize={{ base: "xs", md: "sm" }} color="white">
                                {workout.minutes} min
                              </Text>
                            </HStack>
                            <HStack spacing={1}>
                              <Text fontSize={{ base: "xs", md: "sm" }} color="white">
                                🔥
                              </Text>
                              <Text fontSize={{ base: "xs", md: "sm" }} color="white">
                                {workout.cal} kcal
                              </Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </Box>

                      {/* Recommended Badge */}
                      <Box
                        position="absolute"
                        top={{ base: 3, md: 4 }}
                        left={{ base: 3, md: 4 }}
                        px={{ base: 2, md: 3 }}
                        py={{ base: 1, md: 1.5 }}
                        bg="green.500"
                        borderRadius="md"
                      >
                        <Text
                          fontSize={{ base: "xs", md: "sm" }}
                          color="white"
                          fontWeight="semibold"
                        >
                          Recommended
                        </Text>
                      </Box>

                      {/* Favorite Button */}
                      {isAuthenticated && (
                        <IconButton
                          icon={<StarIcon />}
                          position="absolute"
                          top={{ base: 3, md: 4 }}
                          right={{ base: 3, md: 4 }}
                          size={{ base: "sm", md: "md" }}
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

                      {}
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

                {/* Placeholder cards for loading state */}
                {recommendedWorkouts.length === 0 &&
                  Array.from({ length: 4 }).map((_, index) => (
                    <Box
                      key={'placeholder-' + index}
                      position="relative"
                      w="full"
                      h={{ base: "200px", md: "250px", lg: "300px" }}
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
                        <Text
                          fontSize={{ base: "md", md: "lg" }}
                          fontWeight="bold"
                          color="white"
                        >
                          Loading...
                        </Text>
                      </Box>
                    </Box>
                  ))}
              </SimpleGrid>
            )}
          </Box>

          {/* Weekly Challenge Section */}
          <Box w="full">
            <Box
              position="relative"
              w="full"
              h={{ base: "200px", md: "250px", lg: "300px" }}
              borderRadius="xl"
              overflow="hidden"
              bg="linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)"
              cursor="default"
              transition="all 0.2s"
            >
              <Box
                position="absolute"
                left={{ base: 6, md: 8, lg: 12 }}
                top="50%"
                transform="translateY(-50%)"
                zIndex={2}
              >
                <VStack align="start" spacing={{ base: 3, md: 4 }}>
                  <Text
                    fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                    fontWeight="bold"
                    color="white"
                  >
                    Weekly
                  </Text>
                  <Text
                    fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                    fontWeight="bold"
                    color="white"
                    mt={-2}
                  >
                    Challenge
                  </Text>
                  <Text
                    fontSize={{ base: "md", md: "lg", lg: "xl" }}
                    color="white"
                    opacity={0.9}
                  >
                    Burn To Run
                  </Text>
                  {weeklyChallenge && (
                    <Button
                      size={{ base: "sm", md: "md", lg: "lg" }}
                      bg="rgba(255, 255, 255, 0.2)"
                      color="white"
                      borderRadius="full"
                      px={{ base: 6, md: 8, lg: 10 }}
                      py={{ base: 2, md: 3, lg: 4 }}
                      fontSize={{ base: "sm", md: "md", lg: "lg" }}
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
              <Box
                position="absolute"
                right={0}
                top={0}
                bottom={0}
                w={{ base: "40%", md: "45%", lg: "50%" }}
              >
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
                      <Text fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>💪</Text>
                    </Box>
                  }
                />
              </Box>

              {/* Favorite Button */}
              {isAuthenticated && weeklyChallenge && (
                <IconButton
                  icon={<StarIcon />}
                  position="absolute"
                  top={{ base: 3, md: 4 }}
                  right={{ base: 3, md: 4 }}
                  size={{ base: "sm", md: "md" }}
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
            <HStack justify="space-between" align="center" mb={{ base: 4, md: 6 }}>
              <Text
                fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                fontWeight="bold"
                color={textColor}
              >
                Articles & Tips
              </Text>
              <HStack
                spacing={1}
                cursor="pointer"
                onClick={() => navigate("/articles")}
              >
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="primary.400"
                  fontWeight="semibold"
                >
                  See All
                </Text>
                <ChevronRightIcon
                  color="primary.400"
                  w={{ base: 4, md: 5 }}
                  h={{ base: 4, md: 5 }}
                />
              </HStack>
            </HStack>

            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
              spacing={{ base: 4, md: 6, lg: 8 }}
              w="full"
            >
              {articles.slice(0, 4).map((article) => (
                <Box
                  key={article.id}
                  position="relative"
                  w="full"
                  h={{ base: "200px", md: "250px", lg: "300px" }}
                  borderRadius="xl"
                  overflow="hidden"
                  bg="gray.800"
                  cursor="pointer"
                  onClick={() => navigate('/articles/' + article.id)}
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
                  <Box
                    position="absolute"
                    bottom={{ base: 4, md: 6 }}
                    left={{ base: 4, md: 6 }}
                    right={{ base: 4, md: 6 }}
                  >
                    <Text
                      fontSize={{ base: "sm", md: "md", lg: "lg" }}
                      fontWeight="bold"
                      color="white"
                      noOfLines={2}
                    >
                      {article.title}
                    </Text>
                  </Box>
                  <Box
                    position="absolute"
                    top={{ base: 3, md: 4 }}
                    right={{ base: 3, md: 4 }}
                    w={{ base: "8", md: "10" }}
                    h={{ base: "8", md: "10" }}
                    bg="whiteAlpha.200"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={{ base: "sm", md: "md" }} color="white">
                      ⭐
                    </Text>
                  </Box>
                </Box>
              ))}

              {/* Placeholder articles for loading state */}
              {articles.length === 0 &&
                Array.from({ length: 4 }).map((_, index) => (
                  <Box
                    key={'placeholder-' + index}
                    position="relative"
                    w="full"
                    h={{ base: "200px", md: "250px", lg: "300px" }}
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
                    <Box
                      position="absolute"
                      bottom={{ base: 4, md: 6 }}
                      left={{ base: 4, md: 6 }}
                      right={{ base: 4, md: 6 }}
                    >
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontWeight="bold"
                        color="white"
                      >
                        Loading...
                      </Text>
                    </Box>
                  </Box>
                ))}
            </SimpleGrid>
          </Box>
        </VStack>
      </Box>
    </AppContainer>
  );
};

export default Home;
