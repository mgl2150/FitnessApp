import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Progress,
  IconButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import AppContainer from '../../components/Layout/AppContainer';

const MotionBox = motion(Box);

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to FitBody",
    subtitle: "Your personal fitness companion",
    description: "Track your workouts, monitor your progress, and achieve your fitness goals with our comprehensive fitness app.",
    icon: "🏋️‍♂️",
    color: "primary.500"
  },
  {
    id: 2,
    title: "Track Your Progress",
    subtitle: "Monitor every step of your journey",
    description: "Keep track of your workouts, calories burned, and personal records. See your improvement over time with detailed analytics.",
    icon: "📊",
    color: "secondary.500"
  },
  {
    id: 3,
    title: "Personalized Workouts",
    subtitle: "Tailored to your fitness level",
    description: "Get custom workout plans designed specifically for your goals, fitness level, and available equipment.",
    icon: "🎯",
    color: "success.500"
  },
  {
    id: 4,
    title: "Stay Motivated",
    subtitle: "Achieve your fitness goals",
    description: "Set goals, earn achievements, and stay motivated with our community features and progress tracking.",
    icon: "🏆",
    color: "warning.500"
  }
];

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const textColor = 'white';

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/login');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <AppContainer>
      <Box
        display="flex"
        flexDirection="column"
        minH="948px"
      >
      {/* Header with progress and skip */}
      <HStack
        justify="space-between"
        align="center"
        p={6}
        pt={12}
      >
        <IconButton
          icon={<ChevronLeftIcon />}
          variant="ghost"
          size="lg"
          onClick={handlePrev}
          isDisabled={currentStep === 0}
          aria-label="Previous step"
        />
        
        <VStack spacing={2} flex={1} mx={4}>
          <Progress
            value={(currentStep + 1) / onboardingSteps.length * 100}
            size="sm"
            colorScheme="primary"
            bg="gray.200"
            borderRadius="full"
            w="full"
            maxW="200px"
          />
          <Text fontSize="sm" color="gray.500">
            {currentStep + 1} of {onboardingSteps.length}
          </Text>
        </VStack>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          color="gray.500"
        >
          Skip
        </Button>
      </HStack>

      {/* Main content */}
      <Box flex={1} display="flex" alignItems="center" justifyContent="center" px={6}>
        <AnimatePresence mode="wait">
          <MotionBox
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            w="full"
            maxW="400px"
            textAlign="center"
          >
            <VStack spacing={8}>
              {/* Icon */}
              <Box
                w="120px"
                h="120px"
                bg={currentStepData.color}
                borderRadius="30px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="4xl"
                boxShadow="0 20px 40px rgba(0,0,0,0.1)"
              >
                {currentStepData.icon}
              </Box>

              {/* Content */}
              <VStack spacing={4}>
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  color={textColor}
                  lineHeight="shorter"
                >
                  {currentStepData.title}
                </Text>
                
                <Text
                  fontSize="xl"
                  color="gray.500"
                  fontWeight="medium"
                >
                  {currentStepData.subtitle}
                </Text>
                
                <Text
                  fontSize="md"
                  color="gray.600"
                  lineHeight="tall"
                  textAlign="center"
                  maxW="350px"
                >
                  {currentStepData.description}
                </Text>
              </VStack>
            </VStack>
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* Bottom navigation */}
      <Box p={6} pb={12}>
        <HStack spacing={4} justify="center">
          {/* Dots indicator */}
          <HStack spacing={2}>
            {onboardingSteps.map((_, index) => (
              <Box
                key={index}
                w={index === currentStep ? "24px" : "8px"}
                h="8px"
                bg={index === currentStep ? "primary.500" : "gray.300"}
                borderRadius="full"
                transition="all 0.3s"
                cursor="pointer"
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </HStack>
        </HStack>

        <Button
          size="lg"
          colorScheme="primary"
          w="full"
          mt={6}
          onClick={handleNext}
          rightIcon={currentStep < onboardingSteps.length - 1 ? <ChevronRightIcon /> : undefined}
        >
          {currentStep < onboardingSteps.length - 1 ? 'Next' : 'Get Started'}
        </Button>
      </Box>
      </Box>
    </AppContainer>
  );
};

export default OnboardingFlow;
