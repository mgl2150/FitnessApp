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
  Spinner,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon, TriangleUpIcon, StarIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';
import { useWorkout } from '../../contexts/WorkoutContext';
import { useAuth } from '../../contexts/AuthContext';

const WorkoutDetailScreen = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const toast = useToast();
  const {
    currentWorkout,
    detailLoading,
    detailError,
    fetchWorkoutById,
    clearCurrentWorkout,
    // Enhanced context methods
    guides,
    guidesLoading,
    fetchWorkoutGuides,
    favorites,
    favoritesLoading,
    fetchFavorites,
    toggleFavorite,
    logProgress
  } = useWorkout();

  const textColor = 'white';
  const cardBg = '#2D3748';
  const { user, isAuthenticated } = useAuth();

  // Timer state
  const [timerState, setTimerState] = useState('stopped'); // 'stopped', 'running', 'paused', 'completed'
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [totalDuration, setTotalDuration] = useState(0); // in seconds
  const timerRef = useRef(null);

  useEffect(() => {
    if (workoutId) {
      fetchWorkoutById(workoutId);
      fetchWorkoutGuides(workoutId);
    }

    // Fetch user favorites if authenticated
    if (isAuthenticated && user?._id) {
      fetchFavorites(user._id);
    }

    // Cleanup when component unmounts
    return () => {
      clearCurrentWorkout();
      // Clear timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [workoutId, fetchWorkoutById, fetchWorkoutGuides, clearCurrentWorkout, fetchFavorites, isAuthenticated, user]);

  // Timer effect
  useEffect(() => {
    if (timerState === 'running' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerState('completed');
            handleWorkoutComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerState, timeRemaining]);

  // Initialize timer when workout data is loaded
  useEffect(() => {
    if (currentWorkout && currentWorkout.minutes && timerState === 'stopped') {
      const durationInSeconds = currentWorkout.minutes * 60;
      setTotalDuration(durationInSeconds);
      setTimeRemaining(durationInSeconds);
    }
  }, [currentWorkout, timerState]);

  // Timer helper functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackNavigation = () => {
    // Stop timer if running
    if (timerState === 'running' || timerState === 'paused') {
      setTimerState('stopped');
      if (currentWorkout && currentWorkout.minutes) {
        setTimeRemaining(currentWorkout.minutes * 60);
      }
    }
    navigate('/workout'); // Go back to previous page
  };

  const handleStartWorkout = () => {
    if (timerState === 'stopped' || timerState === 'completed') {
      // Start new workout
      if (currentWorkout && currentWorkout.minutes) {
        const durationInSeconds = currentWorkout.minutes * 60;
        setTotalDuration(durationInSeconds);
        setTimeRemaining(durationInSeconds);
        setTimerState('running');

        toast({
          title: "Workout Started!",
          description: `${currentWorkout.name} - ${currentWorkout.minutes} minutes`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } else if (timerState === 'running') {
      // Pause workout
      setTimerState('paused');
    } else if (timerState === 'paused') {
      // Resume workout
      setTimerState('running');
    }
  };

  const handleStopWorkout = () => {
    setTimerState('stopped');
    if (currentWorkout && currentWorkout.minutes) {
      const durationInSeconds = currentWorkout.minutes * 60;
      setTimeRemaining(durationInSeconds);
    }

    toast({
      title: "Workout Stopped",
      description: "You can restart anytime!",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleWorkoutComplete = async () => {
    toast({
      title: "Workout Completed! 🎉",
      description: `Great job completing ${currentWorkout?.name}!`,
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    // Auto-log progress if authenticated
    if (isAuthenticated && user?._id && currentWorkout) {
      try {
        const progressData = {
          account_id: user._id,
          lesson_id: currentWorkout.id || currentWorkout._id,
          date: new Date().toISOString(),
          duration: totalDuration,
          calories_burned: currentWorkout.cal || 150,
          completed: true,
        };

        await logProgress(progressData);
        console.log('Workout completed and logged automatically');
      } catch (error) {
        console.error('Failed to log workout progress:', error);
      }
    }
  };

  // Handle favorite toggle
  const handleToggleFavorite = async () => {
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

    if (!currentWorkout) return;

    const workoutId = currentWorkout.id || currentWorkout._id;
    const isCurrentlyFavorited = favorites.includes(workoutId);

    try {
      const result = await toggleFavorite(workoutId, user._id);

      // Defensive check for result structure
      if (result && result.success) {
        const action = result.action || (isCurrentlyFavorited ? 'removed' : 'added');
        toast({
          title: action === 'added' ? "Added to Favorites" : "Removed from Favorites",
          description: action === 'added'
            ? `${currentWorkout.name || currentWorkout.title} has been saved to your favorites.`
            : `${currentWorkout.name || currentWorkout.title} has been removed from your favorites.`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        const errorMessage = result?.error || 'Failed to update favorites';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update favorites. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle workout completion
  const handleCompleteWorkout = async () => {
    if (!isAuthenticated || !user?._id || !currentWorkout) return;

    try {
      const progressData = {
        account_id: user._id,
        lesson_id: currentWorkout.id || currentWorkout._id,
        date: new Date().toISOString(),
        duration: currentWorkout.minutes ? currentWorkout.minutes * 60 : 1800, // Convert to seconds
        calories_burned: currentWorkout.cal || 150,
        completed: true,
      };

      await logProgress(progressData);

      toast({
        title: "Workout Completed!",
        description: `Great job completing ${currentWorkout.name}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      console.log('Workout completed and logged');
    } catch (error) {
      console.error('Failed to log workout progress:', error);
      toast({
        title: "Error",
        description: "Failed to log workout progress. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleExerciseClick = (exerciseId) => {
    navigate(`/workout/${workoutId}/exercise/${exerciseId}`);
  };

  if (detailLoading) {
    return (
      <AppContainer hasBottomNav={true}>
        <Box bg="#232323" px={4} py={3} pt={6}>
          <HStack justify="space-between" align="center">
            <IconButton
              icon={<ArrowBackIcon />}
              variant="ghost"
              size="md"
              onClick={handleBackNavigation}
              aria-label="Go back"
              color={textColor}
            />
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Workout Details
            </Text>
            <Box w="32px" />
          </HStack>
        </Box>
        <Box p={4} display="flex" justifyContent="center" alignItems="center" minH="300px">
          <Spinner size="lg" color="primary.500" />
        </Box>
        <BottomNavigation />
      </AppContainer>
    );
  }

  if (detailError) {
    return (
      <AppContainer hasBottomNav={true}>
        <Box bg="#232323" px={4} py={3} pt={6}>
          <HStack justify="space-between" align="center">
            <IconButton
              icon={<ArrowBackIcon />}
              variant="ghost"
              size="md"
              onClick={handleBackNavigation}
              aria-label="Go back"
              color={textColor}
            />
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Workout Details
            </Text>
            <Box w="32px" />
          </HStack>
        </Box>
        <Box p={4}>
          <Alert status="error" bg="red.900" color="white" borderRadius="lg">
            <AlertIcon />
            <Text fontSize="sm">{detailError}</Text>
          </Alert>
        </Box>
        <BottomNavigation />
      </AppContainer>
    );
  }

  if (!currentWorkout) {
    return (
      <AppContainer hasBottomNav={true}>
        <Box bg="#232323" px={4} py={3} pt={6}>
          <HStack justify="space-between" align="center">
            <IconButton
              icon={<ArrowBackIcon />}
              variant="ghost"
              size="md"
              onClick={handleBackNavigation}
              aria-label="Go back"
              color={textColor}
            />
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Workout Details
            </Text>
            <Box w="32px" />
          </HStack>
        </Box>
        <Box p={4}>
          <Alert status="info" bg="blue.900" color="white" borderRadius="lg">
            <AlertIcon />
            <Text fontSize="sm">Workout not found</Text>
          </Alert>
        </Box>
        <BottomNavigation />
      </AppContainer>
    );
  }

  return (
    <AppContainer hasBottomNav={true}>
      {/* Header */}
      <Box bg="#232323" px={4} py={3} pt={6}>
        <HStack justify="space-between" align="center">
          <IconButton
            icon={<ArrowBackIcon />}
            variant="ghost"
            size="md"
            onClick={handleBackNavigation}
            aria-label="Go back"
            color={textColor}
          />
          <Text fontSize="lg" fontWeight="bold" color={textColor} noOfLines={1}>
            Workout Details
          </Text>
          {isAuthenticated && currentWorkout && (
            <IconButton
              icon={<StarIcon />}
              variant="ghost"
              size="md"
              onClick={handleToggleFavorite}
              isLoading={favoritesLoading}
              color={favorites.includes(currentWorkout.id || currentWorkout._id) ? "yellow.400" : textColor}
              _hover={{
                color: favorites.includes(currentWorkout.id || currentWorkout._id) ? "yellow.300" : "yellow.400",
                bg: "whiteAlpha.100"
              }}
              _active={{
                color: favorites.includes(currentWorkout.id || currentWorkout._id) ? "yellow.500" : "yellow.500",
                bg: "whiteAlpha.200"
              }}
              transition="all 0.2s"
              aria-label={favorites.includes(currentWorkout.id || currentWorkout._id) ? "Remove from favorites" : "Add to favorites"}
            />
          )}
          {!isAuthenticated && <Box w="32px" />}
        </HStack>
      </Box>

      {/* Main Content */}
      <Box px={4} py={3} pb={20}>
        <VStack spacing={4} w="full">
          {/* Hero Image and Basic Info */}
          <Card bg={cardBg} w="full" borderRadius="lg" overflow="hidden">
            <CardBody p={0}>
              <Box position="relative">
                <Image
                  src={currentWorkout.avatar || '/api/placeholder/300/200'}
                  alt={currentWorkout.name}
                  w="full"
                  h="160px"
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
                <Badge
                  position="absolute"
                  top={3}
                  left={3}
                  bg={currentWorkout.level === 'beginner' ? 'green.500' :
                      currentWorkout.level === 'intermediate' ? 'orange.500' : 'red.500'}
                  color="white"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="md"
                >
                  {currentWorkout.level}
                </Badge>
              </Box>

              <Box p={4}>
                <VStack align="start" spacing={3}>
                  <Text fontSize="xl" fontWeight="bold" color={textColor} noOfLines={2}>
                    {currentWorkout.name}
                  </Text>

                  <VStack spacing={2} w="full">
                    <HStack spacing={4} justify="space-between" w="full">
                      <HStack spacing={1} flex={1} justify="center">
                        <Text fontSize="xs" color="gray.400">⏱</Text>
                        <Text fontSize="xs" color="gray.400">{currentWorkout.minutes} min</Text>
                      </HStack>
                      <HStack spacing={1} flex={1} justify="center">
                        <Text fontSize="xs" color="gray.400">🔥</Text>
                        <Text fontSize="xs" color="gray.400">{currentWorkout.cal} kcal</Text>
                      </HStack>
                    </HStack>
                    <HStack spacing={4} justify="space-between" w="full">
                      <HStack spacing={1} flex={1} justify="center">
                        <Text fontSize="xs" color="gray.400">💪</Text>
                        <Text fontSize="xs" color="gray.400">{currentWorkout.excercise || 0} exercises</Text>
                      </HStack>
                      {currentWorkout.equipment && (
                        <HStack spacing={1} flex={1} justify="center">
                          <Text fontSize="xs" color="gray.400">🏋️</Text>
                          <Text fontSize="xs" color="gray.400" noOfLines={1}>{currentWorkout.equipment}</Text>
                        </HStack>
                      )}
                    </HStack>
                  </VStack>

                  {currentWorkout.description && (
                    <Text fontSize="sm" color="gray.300" lineHeight="1.5" noOfLines={3}>
                      {currentWorkout.description}
                    </Text>
                  )}
                </VStack>
              </Box>
            </CardBody>
          </Card>

          {/* Timer Display */}
          {(timerState === 'running' || timerState === 'paused' || timerState === 'completed') && (
            <Card bg={cardBg} w="full" borderRadius="lg">
              <CardBody p={4}>
                <VStack spacing={3}>
                  <VStack spacing={1}>
                    <Text fontSize="xs" color="gray.400" textAlign="center" fontWeight="medium">
                      {timerState === 'completed' ? 'Workout Completed!' : 'Time Remaining'}
                    </Text>
                    <Text
                      fontSize="3xl"
                      fontWeight="bold"
                      color={timerState === 'completed' ? 'green.400' : 'primary.400'}
                      textAlign="center"
                      fontFamily="mono"
                      lineHeight="1"
                    >
                      {formatTime(timeRemaining)}
                    </Text>
                  </VStack>
                  {totalDuration > 0 && (
                    <Box w="full" bg="gray.600" borderRadius="full" h="1.5">
                      <Box
                        bg={timerState === 'completed' ? 'green.400' : 'primary.400'}
                        h="1.5"
                        borderRadius="full"
                        width={`${((totalDuration - timeRemaining) / totalDuration) * 100}%`}
                        transition="width 0.5s ease"
                      />
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Action Buttons */}
          <VStack spacing={2} w="full">
            {timerState === 'stopped' || timerState === 'completed' ? (
              <Button
                w="full"
                bg="primary.500"
                color="white"
                size="md"
                onClick={handleStartWorkout}
                _hover={{ bg: 'primary.600' }}
                borderRadius="lg"
                h="48px"
                fontSize="md"
                fontWeight="semibold"
                leftIcon={<TriangleUpIcon transform="rotate(90deg)" />}
              >
                {timerState === 'completed' ? 'Start Again' : 'Start Workout'}
              </Button>
            ) : (
              <HStack spacing={2} w="full">
                <Button
                  flex={1}
                  bg={timerState === 'running' ? 'orange.500' : 'green.500'}
                  color="white"
                  size="md"
                  onClick={handleStartWorkout}
                  _hover={{ bg: timerState === 'running' ? 'orange.600' : 'green.600' }}
                  borderRadius="lg"
                  h="48px"
                  fontSize="sm"
                  fontWeight="semibold"
                >
                  {timerState === 'running' ? 'Pause' : 'Resume'}
                </Button>
                <Button
                  flex={1}
                  variant="outline"
                  colorScheme="red"
                  size="md"
                  onClick={handleStopWorkout}
                  borderRadius="lg"
                  h="48px"
                  fontSize="sm"
                  fontWeight="semibold"
                >
                  Stop
                </Button>
              </HStack>
            )}

            {isAuthenticated && timerState === 'stopped' && (
              <Button
                w="full"
                variant="outline"
                colorScheme="primary"
                size="sm"
                onClick={handleCompleteWorkout}
                borderRadius="lg"
                h="40px"
                fontSize="sm"
                fontWeight="semibold"
              >
                Mark as Completed
              </Button>
            )}
          </VStack>

          {/* Target Muscles */}

          {/* Exercise List */}
          <Card bg={cardBg} w="full" borderRadius="lg">
            <CardBody p={4}>
              <VStack align="start" spacing={3}>
                <HStack justify="space-between" w="full">
                  <Text fontSize="md" fontWeight="bold" color={textColor}>
                    Exercises ({currentWorkout.excercise || guides.length})
                  </Text>
                  {guidesLoading && <Spinner size="sm" color="primary.500" />}
                </HStack>

                {guides.length > 0 ? (
                  <VStack spacing={2} w="full">
                    {guides.map((guide, index) => (
                      <Box
                        key={guide.id || guide._id || index}
                        w="full"
                        cursor="pointer"
                        onClick={() => handleExerciseClick(guide.id || guide._id)}
                        _hover={{ bg: 'gray.700' }}
                        transition="background 0.2s"
                        borderRadius="md"
                        p={3}
                        mx={-3}
                      >
                        <HStack justify="space-between" align="center" w="full" spacing={3}>
                          <VStack align="start" spacing={1} flex={1} minW={0}>
                            <Text fontSize="sm" fontWeight="semibold" color={textColor} noOfLines={1}>
                              {index + 1}. {guide.name || guide.title}
                            </Text>
                            <HStack spacing={3} wrap="wrap">
                              {guide.seconds && (
                                <Text fontSize="xs" color="gray.400">
                                  {Math.floor(guide.seconds / 60)}:{(guide.seconds % 60).toString().padStart(2, '0')}
                                </Text>
                              )}
                              {guide.reps && (
                                <Text fontSize="xs" color="gray.400">
                                  {guide.reps} reps
                                </Text>
                              )}
                              {guide.round && (
                                <Badge bg="primary.500" color="white" fontSize="xs" px={1} py={0.5} borderRadius="sm">
                                  R{guide.round}
                                </Badge>
                              )}
                            </HStack>
                            {guide.description && (
                              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                {guide.description}
                              </Text>
                            )}
                          </VStack>
                          <Box
                            w="6"
                            h="6"
                            bg="primary.500"
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                          >
                            <Text fontSize="xs" color="white">▶</Text>
                          </Box>
                        </HStack>
                        {index < guides.length - 1 && (
                          <Divider mt={2} borderColor="gray.600" />
                        )}
                      </Box>
                    ))}
                  </VStack>
                ) : currentWorkout.exerciseList?.length > 0 ? (
                  <VStack spacing={2} w="full">
                    {currentWorkout.exerciseList.map((exercise, index) => (
                      <Box key={index} w="full">
                        <HStack justify="space-between" align="center" w="full" spacing={3}>
                          <VStack align="start" spacing={1} flex={1} minW={0}>
                            <Text fontSize="sm" fontWeight="semibold" color={textColor} noOfLines={1}>
                              {index + 1}. {exercise.name}
                            </Text>
                            <HStack spacing={3}>
                              <Text fontSize="xs" color="gray.400">
                                {exercise.duration}
                              </Text>
                              <Text fontSize="xs" color="gray.400">
                                {exercise.reps}
                              </Text>
                            </HStack>
                          </VStack>
                          <Box
                            w="6"
                            h="6"
                            bg="primary.500"
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                          >
                            <Text fontSize="xs" color="white">▶</Text>
                          </Box>
                        </HStack>
                        {index < (currentWorkout.exerciseList?.length || 0) - 1 && (
                          <Divider mt={2} borderColor="gray.600" />
                        )}
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text fontSize="sm" color="gray.400">
                    No exercise details available
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Box>

      <BottomNavigation />
    </AppContainer>
  );
};

export default WorkoutDetailScreen;
