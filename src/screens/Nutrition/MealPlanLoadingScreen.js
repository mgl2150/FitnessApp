import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Spinner,
  Progress,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import AppContainer from '../../components/Layout/AppContainer';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const MealPlanLoadingScreen = () => {
  const navigate = useNavigate();
  const textColor = 'white';

  const loadingSteps = [
    'Analyzing your preferences...',
    'Finding perfect meals for you...',
    'Creating your personalized plan...',
    'Almost ready...',
  ];

  const [currentStep, setCurrentStep] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    const totalSteps = loadingSteps.length;
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < totalSteps - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 2;
        }
        return prev;
      });
    }, 100);

    // Navigate to meal plan after loading is complete
    const navigationTimer = setTimeout(() => {
      navigate('/nutrition/meals');
    }, 6000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(navigationTimer);
    };
  }, [navigate, loadingSteps.length]);

  return (
    <AppContainer>
      <Box
        minH="100vh"
        bg="#232323"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={6}
      >
        <VStack spacing={8} w="full" maxW="350px">
          
          {/* Main Loading Animation */}
          <Box textAlign="center">
            <Box
              w="120px"
              h="120px"
              mx="auto"
              mb={6}
              bg="primary.500"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: '-10px',
                left: '-10px',
                right: '-10px',
                bottom: '-10px',
                borderRadius: 'full',
                border: '2px solid',
                borderColor: 'primary.300',
                animation: `${fadeIn} 2s ease-in-out infinite alternate`,
              }}
            >
              <Text fontSize="4xl" color="white">
                🍽️
              </Text>
            </Box>
            
            <Spinner
              size="xl"
              color="primary.500"
              thickness="4px"
              speed="0.8s"
              mb={4}
            />
          </Box>

          {/* Loading Title */}
          <Box textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={2}>
              Creating Your Meal Plan
            </Text>
            <Text fontSize="md" color="gray.400" mb={6}>
              We're personalizing your nutrition journey
            </Text>
          </Box>

          {/* Progress Bar */}
          <Box w="full">
            <Progress
              value={progress}
              colorScheme="primary"
              size="lg"
              borderRadius="full"
              bg="gray.700"
              mb={4}
            />
            <Text fontSize="sm" color="gray.400" textAlign="center">
              {Math.round(progress)}% Complete
            </Text>
          </Box>

          {/* Loading Steps */}
          <Box w="full">
            <VStack spacing={3} align="start">
              {loadingSteps.map((step, index) => (
                <Box
                  key={index}
                  w="full"
                  opacity={index <= currentStep ? 1 : 0.3}
                  transition="opacity 0.5s ease"
                  animation={index === currentStep ? `${fadeIn} 0.5s ease-in-out` : 'none'}
                >
                  <Box display="flex" alignItems="center">
                    <Box
                      w="20px"
                      h="20px"
                      borderRadius="full"
                      bg={index <= currentStep ? 'primary.500' : 'gray.600'}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mr={3}
                      transition="background-color 0.3s ease"
                    >
                      {index < currentStep ? (
                        <Text fontSize="xs" color="white">✓</Text>
                      ) : index === currentStep ? (
                        <Spinner size="xs" color="white" />
                      ) : (
                        <Box w="8px" h="8px" bg="gray.400" borderRadius="full" />
                      )}
                    </Box>
                    <Text
                      fontSize="sm"
                      color={index <= currentStep ? textColor : 'gray.500'}
                      fontWeight={index === currentStep ? 'semibold' : 'normal'}
                    >
                      {step}
                    </Text>
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Fun Facts */}
          <Box
            w="full"
            bg="rgba(255, 255, 255, 0.05)"
            borderRadius="lg"
            p={4}
            textAlign="center"
            border="1px solid"
            borderColor="gray.700"
          >
            <Text fontSize="xs" color="primary.400" fontWeight="semibold" mb={2}>
              💡 DID YOU KNOW?
            </Text>
            <Text fontSize="sm" color="gray.300" lineHeight="1.5">
              Meal planning can help you save up to 40% on grocery costs and reduce food waste by 50%!
            </Text>
          </Box>

          {/* Loading Dots */}
          <Box display="flex" justifyContent="center" alignItems="center">
            {[0, 1, 2].map((dot) => (
              <Box
                key={dot}
                w="8px"
                h="8px"
                bg="primary.500"
                borderRadius="full"
                mx={1}
                animation={`${fadeIn} 1s ease-in-out infinite alternate`}
                style={{
                  animationDelay: `${dot * 0.3}s`,
                }}
              />
            ))}
          </Box>
        </VStack>
      </Box>
    </AppContainer>
  );
};

export default MealPlanLoadingScreen;
