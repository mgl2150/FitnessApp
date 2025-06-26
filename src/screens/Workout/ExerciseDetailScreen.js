import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Card,
  CardBody,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  AspectRatio,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';
import VideoPlayer from '../../components/Video/VideoPlayer';
import { useWorkout } from '../../contexts/WorkoutContext';

const ExerciseDetailScreen = () => {
  const navigate = useNavigate();
  const { workoutId, exerciseId } = useParams();
  const toast = useToast();
  const {
    guides: workoutGuides,
    guidesLoading,
    guidesError,
    fetchWorkoutGuides
  } = useWorkout();

  const [exercise, setExercise] = useState(null);
  const cardBg = '#2D3748';
  const textColor = 'white';

  useEffect(() => {

    if (!workoutGuides || workoutGuides.length === 0) {
      fetchWorkoutGuides(workoutId);
    }
  }, [workoutId, workoutGuides, fetchWorkoutGuides]);

  useEffect(() => {

    if (workoutGuides && workoutGuides.length > 0) {
      const foundExercise = workoutGuides.find(guide =>
        (guide.id || guide._id) === exerciseId
      );
      setExercise(foundExercise);
    }
  }, [workoutGuides, exerciseId]);

  const handleBackNavigation = () => {
    navigate(`/workout/${workoutId}`);
  };

  const handlePlayVideo = () => {
    if (!exercise?.video) {
      toast({
        title: "Video Unavailable",
        description: "No demonstration video available for this exercise.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleVideoError = () => {
    console.error(`Failed to load video for exercise: ${exercise?.name}`);
    toast({
      title: "Video Error",
      description: "Failed to load exercise video. Please try again.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleVideoPlay = () => {
    console.log(`Playing video for exercise: ${exercise?.name}`);
  };

  const handleVideoEnded = () => {
    console.log(`Video ended for exercise: ${exercise?.name}`);
    toast({
      title: "Exercise Complete",
      description: "Great job! Ready for the next exercise?",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRepsDisplay = (exercise) => {
    return exercise.repetitions || exercise.reps || 1;
  };

  const getDurationDisplay = (exercise) => {
    if (exercise.duration) return exercise.duration;
    if (exercise.seconds) return formatDuration(exercise.seconds);
    return '0:30';
  };

  if (guidesLoading) {
    return (
      <AppContainer hasBottomNav={true}>
        <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
          <Spinner size="lg" color="primary.500" />
        </Box>
        <BottomNavigation />
      </AppContainer>
    );
  }

  if (guidesError) {
    return (
      <AppContainer hasBottomNav={true}>
        <Box p={6}>
          <Alert status="error" bg="red.900" color="white" borderRadius="xl">
            <AlertIcon />
            {guidesError}
          </Alert>
        </Box>
        <BottomNavigation />
      </AppContainer>
    );
  }

  if (!exercise) {
    return (
      <AppContainer hasBottomNav={true}>
        <Box p={6}>
          <Alert status="warning" bg="orange.900" color="white" borderRadius="xl">
            <AlertIcon />
            Exercise not found
          </Alert>
        </Box>
        <BottomNavigation />
      </AppContainer>
    );
  }

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
            aria-label="Go back to workout"
            color={textColor}
          />
          <Text fontSize="xl" fontWeight="bold" color={textColor} textAlign="center" flex={1}>
            Exercise Details
          </Text>
          <Box w="40px" /> {}
        </HStack>
      </Box>

      {}
      <Box p={6} pb={24}>
        <VStack spacing={6} w="full">

          {}
          <Box w="full" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={2}>
              {exercise.name}
            </Text>
            {exercise.round && (
              <Badge bg="primary.500" color="white" fontSize="sm" px={3} py={1} borderRadius="full">
                Round {exercise.round}
              </Badge>
            )}
          </Box>

          {}
          <Card bg={cardBg} w="full">
            <CardBody p={4}>
              {exercise.video ? (
                <VStack spacing={3} w="full">
                  <Text fontSize="lg" fontWeight="semibold" color={textColor} w="full" textAlign="center">
                    Exercise Demonstration
                  </Text>
                  <VideoPlayer
                    src={exercise.video}
                    title={exercise.name}
                    width="100%"
                    height="250px"
                    controls={true}
                    muted={false}
                    onError={handleVideoError}
                    onPlay={handleVideoPlay}
                    onEnded={handleVideoEnded}
                  />
                </VStack>
              ) : (
                <AspectRatio ratio={16 / 9} w="full">
                  <Box
                    bg="gray.800"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    cursor="pointer"
                    onClick={handlePlayVideo}
                    _hover={{ bg: 'gray.700' }}
                    transition="background 0.2s"
                  >
                    <VStack spacing={2}>
                      <IconButton
                        icon={<ChevronRightIcon />}
                        size="lg"
                        variant="solid"
                        colorScheme="primary"
                        borderRadius="full"
                        aria-label="Play exercise video"
                      />
                      <Text fontSize="sm" color="gray.400" textAlign="center">
                        No video available
                      </Text>
                    </VStack>
                  </Box>
                </AspectRatio>
              )}
            </CardBody>
          </Card>

          {}
          <Card bg={cardBg} w="full">
            <CardBody>
              <VStack spacing={4} w="full">
                <Text fontSize="lg" fontWeight="semibold" color={textColor} w="full">
                  Exercise Information
                </Text>

                <HStack justify="space-between" w="full">
                  <VStack spacing={1} align="center">
                    <Text fontSize="2xl" fontWeight="bold" color="primary.400">
                      {getDurationDisplay(exercise)}
                    </Text>
                    <Text fontSize="sm" color="gray.400">Duration</Text>
                  </VStack>

                  <Divider orientation="vertical" h="50px" borderColor="gray.600" />

                  <VStack spacing={1} align="center">
                    <Text fontSize="2xl" fontWeight="bold" color="orange.400">
                      {getRepsDisplay(exercise)}
                    </Text>
                    <Text fontSize="sm" color="gray.400">Repetitions</Text>
                  </VStack>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {}
          {exercise.description && (
            <Card bg={cardBg} w="full">
              <CardBody>
                <VStack spacing={3} align="start" w="full">
                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                    Instructions
                  </Text>
                  <Text fontSize="md" color="gray.300" lineHeight="1.6">
                    {exercise.description}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          )}

          {}
          <VStack spacing={3} w="full">
            {!exercise.video && (
              <Button
                onClick={handlePlayVideo}
                colorScheme="primary"
                size="lg"
                w="full"
                leftIcon={<ChevronRightIcon />}
              >
                Watch Demonstration
              </Button>
            )}

            <Button
              onClick={handleBackNavigation}
              variant="outline"
              colorScheme="gray"
              size="lg"
              w="full"
            >
              Back to Workout
            </Button>
          </VStack>
        </VStack>
      </Box>

      <BottomNavigation />
    </AppContainer>
  );
};

export default ExerciseDetailScreen;
