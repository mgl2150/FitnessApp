import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Card,
  CardBody,
  Divider,
  IconButton,
  useToast,
  SimpleGrid,
  useBreakpointValue,

} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';


const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { clearProfileSetupData } = useUserData();
  const toast = useToast();
  const cardBg = '#2D3748';
  const textColor = 'white';

  const handleBackNavigation = () => {
    navigate('/home');
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleFavorites = () => {
    navigate('/profile/favorites');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleHelp = () => {
    navigate('/help');
  };

  const handleLogout = () => {
    logout();
    clearProfileSetupData();
    console.log('User logged out:', user);
    toast({
      title: 'Logged out successfully',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    navigate('/login');
  };

  const calculateBMI = () => {
    if (!user?.weight || !user?.height) return null;

    const weightKg = parseFloat(user.weight);
    const heightM = parseFloat(user.height) / 100;

    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const bmi = calculateBMI();

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <AppContainer hasBottomNav={true} responsive={true} hasSideNav={!isMobile}>
      {/* Header */}
      <Box
        bg="#232323"
        px={{ base: 6, md: 8, lg: 12 }}
        py={{ base: 4, md: 6 }}
        pt={{ base: 8, md: 10 }}
      >
        <HStack justify="space-between" align="center">
          <IconButton
            icon={<ArrowBackIcon />}
            variant="ghost"
            size={{ base: "lg", md: "xl" }}
            onClick={handleBackNavigation}
            aria-label="Go back"
            color={textColor}
          />
          <Text
            fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
            fontWeight="bold"
            color={textColor}
          >
            Profile
          </Text>
          <Box w={{ base: "40px", md: "48px" }} /> {/* Spacer */}
        </HStack>
      </Box>

      {/* Main Content */}
      <Box
        p={{ base: 6, md: 8, lg: 12 }}
        pb={{ base: 24, lg: 12 }}
      >
        <VStack spacing={{ base: 6, md: 8, lg: 10 }} w="full">

          {/* Profile Card */}
          <Card bg={cardBg} w="full" maxW={{ base: "full", md: "600px", lg: "800px" }} mx="auto">
            <CardBody p={{ base: 6, md: 8, lg: 10 }}>
              <VStack spacing={{ base: 4, md: 6 }}>
                {/* Avatar */}
                <Avatar
                  size={{ base: "xl", md: "2xl" }}
                  name={user?.full_name || 'User'}
                  bg="primary.500"
                  color="white"
                />
                <VStack spacing={1} textAlign="center">
                  <Text
                    fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                    fontWeight="bold"
                    color={textColor}
                  >
                    {user?.full_name || 'User Name'}
                  </Text>
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color="gray.400"
                  >
                    {user?.email || 'No email provided'}
                  </Text>
                </VStack>

                <Divider />

                {/* Stats Grid */}
                <SimpleGrid
                  columns={3}
                  spacing={{ base: 4, md: 6, lg: 8 }}
                  w="full"
                >
                  <VStack spacing={1}>
                    <Text
                      fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                      fontWeight="bold"
                      color="primary.500"
                    >
                      {user?.level || 'Beginner'}
                    </Text>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color="gray.400"
                    >
                      Level
                    </Text>
                  </VStack>
                  <VStack spacing={1}>
                    <Text
                      fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                      fontWeight="bold"
                      color="primary.500"
                    >
                      {user?.weight ? `${user.weight}` : '70'}
                    </Text>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color="gray.400"
                    >
                      Weight (kg)
                    </Text>
                  </VStack>
                  <VStack spacing={1}>
                    <Text
                      fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                      fontWeight="bold"
                      color="primary.500"
                    >
                      {bmi || '22.5'}
                    </Text>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color="gray.400"
                    >
                      BMI
                    </Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {}
          <Box w="full">
            <Text fontSize="xl" fontWeight="bold"  color={textColor} mb={4}>
              Account
            </Text>
            <VStack spacing={3} w="full">
              <Button
                _hover={{ backgroundColor: 'grey' }}
                variant="outline"
                w="full"
                justifyContent="start"
                size="lg"
                color={textColor}
                borderColor="gray.600"
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>

              <Button
                _hover={{ backgroundColor: 'grey' }}
                variant="outline"
                w="full"
                justifyContent="start"
                size="lg"
                color={textColor}
                borderColor="gray.600"
                onClick={handleFavorites}
              >
                Favorites
              </Button>

              <Button
                _hover={{ backgroundColor: 'grey' }}
                variant="outline"
                w="full"
                justifyContent="start"
                size="lg"
                color={textColor}
                borderColor="gray.600"
                onClick={handleSettings}
              >
                Settings
              </Button>

              <Button
                _hover={{ backgroundColor: 'grey' }}
                variant="outline"
                w="full"
                justifyContent="start"
                size="lg"
                color={textColor}
                borderColor="gray.600"
                onClick={handleHelp}
              >
                Help & Support
              </Button>
              <Button
                _hover={{ backgroundColor: 'red.400' }}
                colorScheme="red"
                variant="outline"
                w="full"
                size="lg"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </AppContainer>
  );
};

export default ProfileScreen;
