import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Card,
  CardBody,
  Input,
  FormControl,
  FormLabel,
  Select,
  SimpleGrid,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';

const CreateRoutineScreen = () => {
  const navigate = useNavigate();
  const textColor = 'white';
  const cardBg = '#2D3748';

  const [routineData, setRoutineData] = useState({
    name: '',
    duration: '',
    difficulty: '',
    description: '',
    exercises: [],
  });

  const handleBackNavigation = () => {
    navigate('/workout/beginner');
  };

  const handleInputChange = (field, value) => {
    setRoutineData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveRoutine = () => {
    // TODO: Implement save functionality
    console.log('Saving routine:', routineData);
    navigate('/workout/beginner');
  };

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
            Create Routine
          </Text>
          <Box w="40px" /> {/* Spacer for centering */}
        </HStack>
      </Box>

      {/* Main Content */}
      <Box p={6} pb={24}>
        <VStack spacing={6} w="full">

          {/* Header Section */}
          <Box w="full" textAlign="center">
            <Text fontSize="xl" fontWeight="bold" color={textColor} mb={2}>
              Build Your Custom Routine
            </Text>
            <Text fontSize="sm" color="gray.400" mb={6}>
              Create a personalized workout that fits your goals
            </Text>
          </Box>

          {/* Quick Setup Options */}
          <VStack spacing={4} w="full">
            <Text fontSize="lg" fontWeight="bold" color={textColor} alignSelf="start">
              Quick Setup
            </Text>

            <Card bg={cardBg} w="full" borderRadius="xl">
              <CardBody p={6}>
                <VStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel color="gray.400" fontSize="sm" mb={3}>Routine Name</FormLabel>
                    <Input
                      value={routineData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="My Custom Workout"
                      bg="#1A202C"
                      border="1px solid"
                      borderColor="gray.600"
                      color={textColor}
                      _placeholder={{ color: 'gray.500' }}
                      borderRadius="lg"
                      h="48px"
                    />
                  </FormControl>

                  <HStack spacing={4} w="full">
                    <FormControl>
                      <FormLabel color="gray.400" fontSize="sm" mb={3}>Duration</FormLabel>
                      <Select
                        value={routineData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        bg="#1A202C"
                        border="1px solid"
                        borderColor="gray.600"
                        color={textColor}
                        borderRadius="lg"
                        h="48px"
                      >
                        <option value="">Select</option>
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.400" fontSize="sm" mb={3}>Level</FormLabel>
                      <Select
                        value={routineData.difficulty}
                        onChange={(e) => handleInputChange('difficulty', e.target.value)}
                        bg="#1A202C"
                        border="1px solid"
                        borderColor="gray.600"
                        color={textColor}
                        borderRadius="lg"
                        h="48px"
                      >
                        <option value="">Select</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </Select>
                    </FormControl>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>

          {/* Exercise Categories */}
          <Box w="full">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Choose Exercise Types
            </Text>
            <SimpleGrid columns={2} spacing={3} w="full">
              {[
                { name: 'Upper Body', icon: '💪', color: 'blue.500' },
                { name: 'Lower Body', icon: '🦵', color: 'green.500' },
                { name: 'Core', icon: '🎯', color: 'purple.500' },
                { name: 'Cardio', icon: '❤️', color: 'red.500' },
                { name: 'Flexibility', icon: '🧘‍♀️', color: 'orange.500' },
                { name: 'Full Body', icon: '🏃‍♂️', color: 'teal.500' },
              ].map((category, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  cursor="pointer"
                  _hover={{ transform: 'scale(1.05)', bg: '#3A4A5C' }}
                  transition="all 0.2s"
                  borderRadius="xl"
                  h="80px"
                >
                  <CardBody display="flex" alignItems="center" justifyContent="center" p={4}>
                    <VStack spacing={2}>
                      <Text fontSize="2xl">{category.icon}</Text>
                      <Text fontSize="xs" fontWeight="semibold" color={textColor} textAlign="center">
                        {category.name}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Action Buttons */}
          <VStack spacing={3} w="full" mt={6}>
            <Button
              colorScheme="primary"
              size="lg"
              w="full"
              onClick={handleSaveRoutine}
              isDisabled={!routineData.name || !routineData.duration || !routineData.difficulty}
              borderRadius="xl"
              h="56px"
            >
              Create Routine
            </Button>
            <Button
              variant="ghost"
              color="gray.400"
              size="md"
              onClick={handleBackNavigation}
            >
              Cancel
            </Button>
          </VStack>
        </VStack>
      </Box>

      <BottomNavigation />
    </AppContainer>
  );
};

export default CreateRoutineScreen;
