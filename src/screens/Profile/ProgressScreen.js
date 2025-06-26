import React, { useEffect } from 'react';
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
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../contexts/UserDataContext';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';
import { useWorkout } from '../../contexts/WorkoutContext';
import { useAuth } from '../../contexts/AuthContext';

const ProgressScreen = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { profileData } = useUserData();
  const {
    progressTracking,
    trackingLoading,
    fetchProgress,
    workoutHistory,
  } = useWorkout();

  const cardBg = '#2D3748';
  const textColor = 'white';

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchProgress(user._id);
    }
  }, [isAuthenticated, user, fetchProgress]);

  const handleBackNavigation = () => {
    navigate('/profile');
  };

  // Mock progress data - in real app, this would come from API
  const progressData = {
    weeklyGoal: 5,
    completedWorkouts: 3,
    totalWorkouts: 12,
    caloriesBurned: 1250,
    weeklyCalorieGoal: 2000,
    currentStreak: 4,
    longestStreak: 7,
    weightProgress: {
      current: parseFloat(profileData?.weight) || 70,
      target: (parseFloat(profileData?.weight) || 70) - 5,
      change: -2.3
    }
  };

  const weeklyProgress = (progressData.completedWorkouts / progressData.weeklyGoal) * 100;
  const calorieProgress = (progressData.caloriesBurned / progressData.weeklyCalorieGoal) * 100;

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
            Progress
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
              Please log in to view your workout progress and statistics.
            </Text>
          </Box>
        ) : trackingLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <Spinner size="lg" color="primary.500" />
          </Box>
        ) : (
          <VStack spacing={6} w="full">
            {/* Progress Summary */}
            {progressTracking.length > 0 && (
              <Card bg={cardBg} w="full">
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      Recent Activity
                    </Text>
                    <SimpleGrid columns={1} spacing={3} w="full">
                      {progressTracking.slice(0, 5).map((progress, index) => (
                        <Box key={progress._id || index} p={3} bg="gray.700" borderRadius="lg">
                          <HStack justify="space-between" w="full">
                            <VStack align="start" spacing={1}>
                              <Text fontSize="md" fontWeight="semibold" color={textColor}>
                                Workout Completed
                              </Text>
                              <Text fontSize="sm" color="gray.400">
                                {new Date(progress.date).toLocaleDateString()}
                              </Text>
                            </VStack>
                            <VStack align="end" spacing={1}>
                              <Text fontSize="sm" color="primary.400">
                                {Math.floor(progress.duration / 60)} min
                              </Text>
                              <Text fontSize="sm" color="orange.400">
                                {progress.calories_burned} kcal
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

            {/* Weekly Overview */}
            <Card bg={cardBg} w="full">
              <CardBody>
                <VStack spacing={4} align="start">
                  <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    This Week
                  </Text>
                
                <SimpleGrid columns={2} spacing={4} w="full">
                  <VStack spacing={2} align="start">
                    <Text fontSize="sm" color="gray.500">Workouts</Text>
                    <HStack spacing={2} align="center">
                      <CircularProgress 
                        value={weeklyProgress} 
                        color="primary.500" 
                        size="60px"
                        thickness="8px"
                      >
                        <CircularProgressLabel fontSize="sm" fontWeight="bold">
                          {progressData.completedWorkouts}/{progressData.weeklyGoal}
                        </CircularProgressLabel>
                      </CircularProgress>
                      <VStack spacing={0} align="start">
                        <Text fontSize="lg" fontWeight="bold" color={textColor}>
                          {progressData.completedWorkouts} completed
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {progressData.weeklyGoal - progressData.completedWorkouts} remaining
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>

                  <VStack spacing={2} align="start">
                    <Text fontSize="sm" color="gray.500">Calories Burned</Text>
                    <VStack spacing={2} align="start" w="full">
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        {progressData.caloriesBurned} kcal
                      </Text>
                      <Progress 
                        value={calorieProgress} 
                        colorScheme="orange" 
                        size="lg" 
                        w="full"
                        borderRadius="full"
                      />
                      <Text fontSize="sm" color="gray.500">
                        {progressData.weeklyCalorieGoal - progressData.caloriesBurned} kcal to goal
                      </Text>
                    </VStack>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full">
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Current Streak</StatLabel>
                  <StatNumber color="primary.500">{progressData.currentStreak}</StatNumber>
                  <StatHelpText>days</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Longest Streak</StatLabel>
                  <StatNumber color="secondary.500">{progressData.longestStreak}</StatNumber>
                  <StatHelpText>days</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Total Workouts</StatLabel>
                  <StatNumber>{progressData.totalWorkouts}</StatNumber>
                  <StatHelpText>completed</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Weight Change</StatLabel>
                  <StatNumber>
                    <StatArrow type={progressData.weightProgress.change < 0 ? 'decrease' : 'increase'} />
                    {Math.abs(progressData.weightProgress.change)} {profileData?.weightUnit || 'kg'}
                  </StatNumber>
                  <StatHelpText>this month</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Weight Progress */}
          <Card bg={cardBg} w="full">
            <CardBody>
              <VStack spacing={4} align="start">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Weight Progress
                </Text>
                
                <HStack spacing={6} w="full" justify="space-between">
                  <VStack spacing={1} align="center">
                    <Text fontSize="sm" color="gray.500">Current</Text>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      {progressData.weightProgress.current} {profileData?.weightUnit || 'kg'}
                    </Text>
                  </VStack>
                  
                  <VStack spacing={2} flex={1} px={4}>
                    <Progress 
                      value={75} 
                      colorScheme="green" 
                      size="lg" 
                      w="full"
                      borderRadius="full"
                    />
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      75% to goal
                    </Text>
                  </VStack>
                  
                  <VStack spacing={1} align="center">
                    <Text fontSize="sm" color="gray.500">Target</Text>
                    <Text fontSize="xl" fontWeight="bold" color="green.500">
                      {progressData.weightProgress.target} {profileData?.weightUnit || 'kg'}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Achievements */}
          <Card bg={cardBg} w="full">
            <CardBody>
              <VStack spacing={4} align="start">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Recent Achievements
                </Text>
                
                <VStack spacing={3} w="full">
                  <HStack spacing={3} w="full" p={3} bg="primary.50" borderRadius="lg">
                    <Text fontSize="2xl">🏆</Text>
                    <VStack spacing={0} align="start" flex={1}>
                      <Text fontSize="md" fontWeight="semibold" color={textColor}>
                        First Week Complete!
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Completed your first week of workouts
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <HStack spacing={3} w="full" p={3} bg="orange.50" borderRadius="lg">
                    <Text fontSize="2xl">🔥</Text>
                    <VStack spacing={0} align="start" flex={1}>
                      <Text fontSize="md" fontWeight="semibold" color={textColor}>
                        Calorie Crusher
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Burned 1000+ calories this week
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
          </VStack>
        )}
      </Box>

      <BottomNavigation />
    </AppContainer>
  );
};

export default ProgressScreen;
