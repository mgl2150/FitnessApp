import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  CircularProgress,
  CircularProgressLabel,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../contexts/UserDataContext';
import AppContainer from '../../components/Layout/AppContainer';
import { useProgress } from '../../contexts/ProgressContext';
import { useAuth } from '../../contexts/AuthContext';
import { progressSimulationService } from '../../services/progressSimulationService';
import { goalUtils } from '../../utils/progressUtils';

const ProgressScreen = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const { profileData } = useUserData();
  const {
    loading,
    error,
    workoutHistory,
    currentStreak,
    longestStreak,
    totalWorkouts,
    getWeeklyProgress,
    getCalorieProgress,
    getWeightProgress,
    setLoading,
    setError,
  } = useProgress();

  const [initializing, setInitializing] = useState(false);
  const initializationAttempted = useRef(false);

  const cardBg = '#2D3748';
  const textColor = 'white';

  // Initialize progress data if user is authenticated and no data exists
  useEffect(() => {
    const initializeProgressData = async () => {
      if (isAuthenticated && workoutHistory.length === 0 && !initializing && !initializationAttempted.current) {
        initializationAttempted.current = true;
        setInitializing(true);
        setLoading(true);

        try {
          // Use simulation service to get initial data
          const result = await progressSimulationService.mockAPI.getProgress(user?._id);

          if (result.success && result.data.workoutHistory?.length > 0) {
            // Data will be loaded through the context's localStorage mechanism
            console.log('Progress data initialized from simulation service');
          }
        } catch (error) {
          console.error('Failed to initialize progress data:', error);
          setError('Failed to load progress data');
          toast({
            title: "Error",
            description: "Failed to load progress data. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
          setInitializing(false);
        }
      }
    };

    initializeProgressData();
  }, [isAuthenticated, workoutHistory.length, user?._id, setLoading, setError, toast, initializing]);

  const handleBackNavigation = () => {
    navigate('/profile');
  };

  // Get computed progress values
  const weeklyProgress = getWeeklyProgress();
  const calorieProgress = getCalorieProgress();
  const weightProgress = getWeightProgress();

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <AppContainer hasBottomNav={true} responsive={true} hasSideNav={!isMobile}>
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
            Progress
          </Text>
          <Box w="40px" /> {}
        </HStack>
      </Box>

      {}
      <Box p={6} pb={24}>
        {!isAuthenticated ? (
          <Box textAlign="center" py={12}>
            <Text fontSize="6xl" mb={4}>🔒</Text>
            <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={2}>
              Login Required
            </Text>
            <Text fontSize="md" color="gray.200" maxW="300px" mx="auto">
              Please log in to view your workout progress and statistics.
            </Text>
          </Box>
        ) : error ? (
          <Alert status="error" bg="red.900" color="white" borderRadius="lg">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Error Loading Progress</Text>
              <Text fontSize="sm">{error}</Text>
            </Box>
          </Alert>
        ) : loading || initializing ? (
          <Box display="flex" justifyContent="center" py={8}>
            <VStack spacing={4}>
              <Spinner size="lg" color="primary.500" />
              <Text color="gray.200">
                {initializing ? 'Setting up your progress...' : 'Loading progress data...'}
              </Text>
            </VStack>
          </Box>
        ) : (
          <VStack spacing={6} w="full">
            {/* Recent Activity */}
            {workoutHistory.length > 0 && (
              <Card bg={cardBg} w="full">
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      Recent Activity
                    </Text>
                    <SimpleGrid columns={1} spacing={3} w="full">
                      {workoutHistory
                        .filter(workout => workout.completed)
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 5)
                        .map((workout, index) => (
                        <Box key={workout.id || index} p={3} bg="gray.700" borderRadius="lg">
                          <HStack justify="space-between" w="full">
                            <VStack align="start" spacing={1}>
                              <Text fontSize="md" fontWeight="semibold" color={textColor}>
                                {workout.workout_name || 'Workout Completed'}
                              </Text>
                              <Text fontSize="sm" color="gray.200">
                                {new Date(workout.date).toLocaleDateString()}
                              </Text>
                            </VStack>
                            <VStack align="end" spacing={1}>
                              <Text fontSize="sm" color="primary.400">
                                {Math.floor((workout.duration || 0) / 60)} min
                              </Text>
                              <Text fontSize="sm" color="orange.400">
                                {workout.calories_burned || 0} kcal
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Weekly Progress */}
            <Card bg={cardBg} w="full">
              <CardBody>
                <VStack spacing={4} align="start">
                  <HStack justify="space-between" w="full">
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      This Week
                    </Text>
                    <Text fontSize="sm" color="gray.200">
                      {goalUtils.getMotivationalMessage(weeklyProgress.percentage, 'workout')}
                    </Text>
                  </HStack>

                <SimpleGrid columns={2} spacing={4} w="full">
                  <VStack spacing={2} align="start">
                    <Text fontSize="sm" color="gray.200">Workouts</Text>
                    <HStack spacing={2} align="center">
                      <CircularProgress
                        value={weeklyProgress.percentage}
                        color="primary.500"
                        size="60px"
                        thickness="8px"
                      >
                        <CircularProgressLabel fontSize="sm" fontWeight="bold" color={textColor}>
                          {weeklyProgress.completed}/{weeklyProgress.goal}
                        </CircularProgressLabel>
                      </CircularProgress>
                      <VStack spacing={0} align="start">
                        <Text fontSize="lg" fontWeight="bold" color={textColor}>
                          {weeklyProgress.completed} completed
                        </Text>
                        <Text fontSize="sm" color="gray.200">
                          {weeklyProgress.remaining} remaining
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>

                  <VStack spacing={2} align="start">
                    <Text fontSize="sm" color="gray.200">Calories Burned</Text>
                    <VStack spacing={2} align="start" w="full">
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        {calorieProgress.burned} kcal
                      </Text>
                      <Progress
                        value={calorieProgress.percentage}
                        colorScheme="orange"
                        size="lg"
                        w="full"
                        borderRadius="full"
                      />
                      <Text fontSize="sm" color="gray.200">
                        {calorieProgress.remaining} kcal to goal
                      </Text>
                    </VStack>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* Statistics Cards */}
          <SimpleGrid columns={{ base: 2, md: 2 }} spacing={4} w="full">
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel color="gray.200">Current Streak</StatLabel>
                  <StatNumber color="primary.500">{currentStreak}</StatNumber>
                  <StatHelpText color="gray.200">days</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel color="gray.200">Longest Streak</StatLabel>
                  <StatNumber color="secondary.500">{longestStreak}</StatNumber>
                  <StatHelpText color="gray.200">days</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel color="gray.200">Total Workouts</StatLabel>
                  <StatNumber color={textColor}>{totalWorkouts}</StatNumber>
                  <StatHelpText color="gray.200">completed</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel color="gray.200">Weight Change</StatLabel>
                  <StatNumber color={textColor}>
                    {weightProgress.change !== 0 && (
                      <StatArrow type={weightProgress.change < 0 ? 'decrease' : 'increase'} />
                    )}
                    {Math.abs(weightProgress.change)} {profileData?.weightUnit || 'kg'}
                  </StatNumber>
                  <StatHelpText color="gray.200">
                    {weightProgress.trend === 'decreasing' ? 'trending down' :
                     weightProgress.trend === 'increasing' ? 'trending up' : 'stable'}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Weight Progress */}
          {weightProgress.current && (
            <Card bg={cardBg} w="full">
              <CardBody>
                <VStack spacing={4} align="start">
                  <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    Weight Progress
                  </Text>

                  <HStack spacing={6} w="full" justify="space-between">
                    <VStack spacing={1} align="center">
                      <Text fontSize="sm" color="gray.200">Current</Text>
                      <Text fontSize="xl" fontWeight="bold" color={textColor}>
                        {weightProgress.current} {profileData?.weightUnit || 'kg'}
                      </Text>
                    </VStack>

                    {weightProgress.target && (
                      <>
                        <VStack spacing={2} flex={1} px={4}>
                          <Progress
                            value={weightProgress.progress}
                            colorScheme="green"
                            size="lg"
                            w="full"
                            borderRadius="full"
                          />
                          <Text fontSize="sm" color="gray.200" textAlign="center">
                            {Math.round(weightProgress.progress)}% to goal
                          </Text>
                        </VStack>

                        <VStack spacing={1} align="center">
                          <Text fontSize="sm" color="gray.200">Target</Text>
                          <Text fontSize="xl" fontWeight="bold" color="green.500">
                            {weightProgress.target} {profileData?.weightUnit || 'kg'}
                          </Text>
                        </VStack>
                      </>
                    )}
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Achievements */}
          {(currentStreak > 0 || weeklyProgress.completed > 0 || calorieProgress.burned > 500) && (
            <Card bg={cardBg} w="full">
              <CardBody>
                <VStack spacing={4} align="start">
                  <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    Recent Achievements
                  </Text>

                  <VStack spacing={3} w="full">
                    {currentStreak >= 7 && (
                      <HStack spacing={3} w="full" p={3} bg="green.500" borderRadius="lg">
                        <Text fontSize="2xl">🏆</Text>
                        <VStack spacing={0} align="start" flex={1}>
                          <Text fontSize="md" fontWeight="semibold" color={textColor}>
                            Week Warrior!
                          </Text>
                          <Text fontSize="sm" color="gray.100">
                            {currentStreak} day streak - keep it going!
                          </Text>
                        </VStack>
                      </HStack>
                    )}

                    {calorieProgress.burned >= 1000 && (
                      <HStack spacing={3} w="full" p={3} bg="orange.500" borderRadius="lg">
                        <Text fontSize="2xl">🔥</Text>
                        <VStack spacing={0} align="start" flex={1}>
                          <Text fontSize="md" fontWeight="semibold" color={textColor}>
                            Calorie Crusher
                          </Text>
                          <Text fontSize="sm" color="gray.100">
                            Burned {calorieProgress.burned} calories this week!
                          </Text>
                        </VStack>
                      </HStack>
                    )}

                    {weeklyProgress.percentage >= 100 && (
                      <HStack spacing={3} w="full" p={3} bg="purple.500" borderRadius="lg">
                        <Text fontSize="2xl">🎯</Text>
                        <VStack spacing={0} align="start" flex={1}>
                          <Text fontSize="md" fontWeight="semibold" color={textColor}>
                            Goal Achieved!
                          </Text>
                          <Text fontSize="sm" color="gray.100">
                            Completed your weekly workout goal
                          </Text>
                        </VStack>
                      </HStack>
                    )}
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          )}
          </VStack>
        )}
      </Box>


    </AppContainer>
  );
};

export default ProgressScreen;
