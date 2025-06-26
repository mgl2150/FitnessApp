import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserData } from '../../contexts/UserDataContext';
import { useAuth } from '../../contexts/AuthContext';

// Import step components
import SetupWelcome from '../../components/ProfileSetup/SetupWelcome';
import GenderSelection from '../../components/ProfileSetup/GenderSelection';
import AgeInput from '../../components/ProfileSetup/AgeInput';
import WeightInput from '../../components/ProfileSetup/WeightInput';
import HeightInput from '../../components/ProfileSetup/HeightInput';
import GoalSelection from '../../components/ProfileSetup/GoalSelection';
import ActivityLevelSelection from '../../components/ProfileSetup/ActivityLevelSelection';
import ProfileCompletion from '../../components/ProfileSetup/ProfileCompletion';
import AppContainer from '../../components/Layout/AppContainer';

const MotionBox = motion(Box);

const profileSteps = [
  { id: 0, title: 'Welcome', component: SetupWelcome },
  { id: 1, title: 'Gender', component: GenderSelection },
  { id: 2, title: 'Age', component: AgeInput },
  { id: 3, title: 'Weight', component: WeightInput },
  { id: 4, title: 'Height', component: HeightInput },
  { id: 5, title: 'Goal', component: GoalSelection },
  { id: 6, title: 'Activity', component: ActivityLevelSelection },
  { id: 7, title: 'Complete', component: ProfileCompletion },
];

const ProfileSetupFlow = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    nextStep,
    prevStep,
    clearProfileSetupData,
    getProfileSetupData,
    isProfileSetupComplete
  } = useUserData();
  const { completeProfileSetup, user } = useAuth();
  const toast = useToast();


  const handleNext = async () => {
    if (currentStep < profileSteps.length - 1) {
      nextStep();
    } else {
      // Final step - complete profile setup with improved coordination
      if (!user || !user._id) {
        toast({
          title: 'Authentication Error',
          description: 'User not authenticated. Please log in again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
        return;
      }

      // Check if profile setup is complete
      if (!isProfileSetupComplete()) {
        toast({
          title: 'Incomplete Profile',
          description: 'Please complete all required fields before proceeding.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      try {
        console.log('🚀 Starting profile setup completion...');

        // Get current profile setup data
        const setupData = getProfileSetupData();
        console.log('📋 Profile setup data:', setupData);

        // Use the improved coordination method
        const result = await completeProfileSetup(setupData);

        if (result.success) {
          console.log('✅ Profile setup completed successfully');

          // Clear temporary setup data after successful completion
          clearProfileSetupData();

          toast({
            title: 'Profile Completed!',
            description: 'Welcome to FitBody! Your profile has been set up successfully.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });

          // Navigate to home with a small delay to ensure state updates
          setTimeout(() => {
            navigate('/home');
          }, 500);
        } else {
          console.error('❌ Profile setup failed:', result.error);
          toast({
            title: 'Setup Failed',
            description: result.error || 'Failed to complete profile setup. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('❌ Profile setup error:', error);
        toast({
          title: 'Unexpected Error',
          description: 'An unexpected error occurred. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      prevStep();
    } else {
      navigate('/signup');
    }
  };

  const CurrentStepComponent = profileSteps[currentStep]?.component || SetupWelcome;
  const progressPercentage = ((currentStep + 1) / profileSteps.length) * 100;

  return (
    <AppContainer>
      <Box display="flex" flexDirection="column" minH="948px">
      {/* Header with progress */}
      <VStack spacing={4} p={6} pt={12}>
        <HStack justify="space-between" align="center" w="full">
          <IconButton
            icon={<ChevronLeftIcon />}
            variant="ghost"
            size="lg"
            onClick={handlePrev}
            aria-label="Previous step"
          />
          
          <VStack spacing={2} flex={1} mx={4}>
            <Progress
              value={progressPercentage}
              size="sm"
              colorScheme="primary"
              bg="gray.200"
              borderRadius="full"
              w="full"
              maxW="300px"
            />
            <Text fontSize="sm" color="gray.500">
              Step {currentStep + 1} of {profileSteps.length}
            </Text>
          </VStack>

          <Box w="40px" /> {/* Spacer for balance */}
        </HStack>
      </VStack>

      {/* Main content area */}
      <Box flex={1} display="flex" flexDirection="column">
        <AnimatePresence mode="wait">
          <MotionBox
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            flex={1}
            display="flex"
            flexDirection="column"
          >
            <CurrentStepComponent onNext={handleNext} onPrev={handlePrev} />
          </MotionBox>
        </AnimatePresence>
      </Box>
      </Box>
    </AppContainer>
  );
};

export default ProfileSetupFlow;
