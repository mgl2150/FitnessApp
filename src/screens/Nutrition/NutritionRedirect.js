import { useEffect } from 'react';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import { useNutritionNavigation } from '../../hooks/useNutritionNavigation';

/**
 * NutritionRedirect - Handles the deprecated /nutrition route
 * 
 * This component automatically redirects users to the appropriate nutrition screen:
 * - New users (no meal plans) → /nutrition/setup
 * - Existing users (have meal plans) → /nutrition/meals
 * 
 * This eliminates the intermediate nutrition hub page for a more streamlined experience.
 */
const NutritionRedirect = () => {
  const { navigateToNutrition } = useNutritionNavigation();

  useEffect(() => {
    // Automatically redirect to the appropriate nutrition screen
    navigateToNutrition();
  }, [navigateToNutrition]);

  // Show loading state while redirecting
  return (
    <Box
      minH="100vh"
      bg="#232323"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={4}>
        <Spinner size="lg" color="primary.500" thickness="3px" />
        <Text color="white" fontSize="sm">
          Redirecting to your nutrition dashboard...
        </Text>
      </VStack>
    </Box>
  );
};

export default NutritionRedirect;
