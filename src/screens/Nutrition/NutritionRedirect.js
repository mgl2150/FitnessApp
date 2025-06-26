import { useEffect } from 'react';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import { useNutritionNavigation } from '../../hooks/useNutritionNavigation';

const NutritionRedirect = () => {
  const { navigateToNutrition } = useNutritionNavigation();

  useEffect(() => {

    navigateToNutrition();
  }, [navigateToNutrition]);

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
