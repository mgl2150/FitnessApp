import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  FormControl,
  FormLabel,
  Input,
  Select,
  IconButton,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';

const EditProfileScreen = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const textColor = 'white';

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    weight: '',
    height: '',
    goal: '',
    level: '',
    firstName: '',
    lastName: '',
    activityLevel: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [dataError, setDataError] = useState(null);


  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; 
    } catch (error) {
      console.warn('Invalid date format:', dateString);
      return '';
    }
  };


  const constructFullName = (user) => {
    if (user.full_name) return user.full_name;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    return '';
  };

  useEffect(() => {
    const initializeFormData = async () => {
      setIsInitializing(true);
      setDataError(null);

      try {
        if (user) {
          console.log('🔄 Initializing form with user data:', user);

          // Map user data to form fields with fallbacks
          const initialData = {
            full_name: constructFullName(user),
            email: user.email || '',
            phone: user.phone || user.phoneNumber || '',
            gender: user.gender || '',
            dob: formatDateForInput(user.dob || user.dateOfBirth),
            weight: user.weight ? String(user.weight) : '',
            height: user.height ? String(user.height) : '',
            goal: user.goal || user.fitnessGoal || '',
            level: user.activityLevel || user.level || 'beginner', // Use activityLevel as primary
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            activityLevel: user.activityLevel || user.level || 'beginner', // Keep for consistency
          };

          setFormData(initialData);
          console.log('✅ Form initialized with data:', initialData);
        } else {
          console.warn('⚠️ No user data available for form initialization');
          setDataError('No user data available. Please try refreshing the page.');
        }
      } catch (error) {
        console.error('❌ Error initializing form data:', error);
        setDataError('Failed to load profile data. Please try again.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeFormData();
  }, [user]);

  const handleBackNavigation = () => {
    navigate('/profile');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear any existing error when user starts typing
    if (dataError) {
      setDataError(null);
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = [];

    if (!formData.full_name.trim()) {
      errors.push('Full name is required');
    }

    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (formData.weight && (isNaN(formData.weight) || Number(formData.weight) <= 0)) {
      errors.push('Weight must be a positive number');
    }

    if (formData.height && (isNaN(formData.height) || Number(formData.height) <= 0)) {
      errors.push('Height must be a positive number');
    }

    return errors;
  };

  const handleSave = async () => {
    setIsSaving(true);
    setDataError(null);

    try {
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        toast({
          title: 'Validation Error',
          description: validationErrors.join(', '),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setIsSaving(false);
        return;
      }

      console.log('🔄 Saving profile data:', formData);

      // Prepare data for API call with proper field mapping
      const profileUpdateData = {
        // Basic info
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        firstName: formData.firstName ? formData.firstName.trim() : undefined,
        lastName: formData.lastName ? formData.lastName.trim() : undefined,

        // Personal details
        gender: formData.gender,
        dob: formData.dob,

        // Physical measurements (convert to numbers)
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,

        // Fitness info
        goal: formData.goal,
        activityLevel: formData.level || formData.activityLevel, // Use consistent field name
      };

      // Remove empty fields to avoid overwriting existing data with empty values
      Object.keys(profileUpdateData).forEach(key => {
        if (profileUpdateData[key] === '' || profileUpdateData[key] === undefined || profileUpdateData[key] === null) {
          delete profileUpdateData[key];
        }
      });

      console.log('📤 Sending profile update:', profileUpdateData);

      const result = await updateProfile(profileUpdateData);

      if (result.success) {
        console.log('✅ Profile updated successfully:', result.data);

        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Navigate back to profile screen
        navigate('/profile');
      } else {
        console.error('❌ Profile update failed:', result.error);

        toast({
          title: 'Update Failed',
          description: result.error || 'Failed to update your profile. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);

      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update your profile. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

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
            aria-label="Go back"
            color={textColor}
          />
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Edit Profile
          </Text>
          <Box w="40px" /> {}
        </HStack>
      </Box>

      {/* Content */}
      <Box p={6} pb={24}>
        <VStack spacing={6} w="full">


          {isInitializing && (
            <VStack spacing={4} py={8}>
              <Spinner size="lg" color="primary.500" />
              <Text color="gray.400" fontSize="sm">Loading profile data...</Text>
            </VStack>
          )}

          {/* Error State */}
          {dataError && !isInitializing && (
            <Alert status="error" bg="red.900" color="white" borderRadius="xl">
              <AlertIcon />
              <VStack align="start" spacing={2} flex={1}>
                <Text fontWeight="semibold">Failed to load profile data</Text>
                <Text fontSize="sm">{dataError}</Text>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </VStack>
            </Alert>
          )}

          {/* {process.env.NODE_ENV === 'development' && user && (
            <Alert status="info" bg="blue.900" color="white" borderRadius="xl">
              <AlertIcon />
              <VStack align="start" spacing={1} fontSize="xs">
                <Text fontWeight="semibold">Debug: User Data Available</Text>
                <Text>Fields: {Object.keys(user).join(', ')}</Text>
                <Text>Full Name: {user.full_name || 'Not set'}</Text>
                <Text>Email: {user.email || 'Not set'}</Text>
                <Text>Weight: {user.weight || 'Not set'}</Text>
                <Text>Height: {user.height || 'Not set'}</Text>
              </VStack>
            </Alert>
          )} */}

          {!isInitializing && !dataError && (
            <>
          <VStack spacing={4}>
            <Avatar
              size="xl"
              name={formData.full_name}
              bg="primary.500"
              color="white"
            />
            <Button variant="outline" size="sm" color={textColor} borderColor="gray.600">
              Change Photo
            </Button>
          </VStack>

          {}
          <VStack spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Full Name *</FormLabel>
              <Input
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                bg="#2D3748"
                border="1px solid"
                borderColor="gray.600"
                color={textColor}
                _placeholder={{ color: 'gray.500' }}
                placeholder="Enter your full name (e.g., John Doe)"
                isInvalid={!formData.full_name.trim()}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Email *</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                bg="#2D3748"
                border="1px solid"
                borderColor="gray.600"
                color={textColor}
                _placeholder={{ color: 'gray.500' }}
                placeholder="Enter your email address"
                isInvalid={!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.400" fontSize="sm">Phone</FormLabel>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                bg="#2D3748"
                border="1px solid"
                borderColor="gray.600"
                color={textColor}
                _placeholder={{ color: 'gray.500' }}
                placeholder="Enter your phone number"
              />
            </FormControl>

            <HStack spacing={4} w="full">
              <FormControl>
                <FormLabel color="gray.400" fontSize="sm">Date of Birth</FormLabel>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  bg="#2D3748"
                  border="1px solid"
                  borderColor="gray.600"
                  color={textColor}
                  _placeholder={{ color: 'gray.500' }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color="gray.400" fontSize="sm">Gender</FormLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  bg="#2D3748"
                  border="1px solid"
                  borderColor="gray.600"
                  color={textColor}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </FormControl>
            </HStack>

            <HStack spacing={4} w="full">
              <FormControl>
                <FormLabel color="gray.400" fontSize="sm">Weight (kg)</FormLabel>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  bg="#2D3748"
                  border="1px solid"
                  borderColor="gray.600"
                  color={textColor}
                  _placeholder={{ color: 'gray.500' }}
                  placeholder="Enter weight in kg"
                />
              </FormControl>
              <FormControl>
                <FormLabel color="gray.400" fontSize="sm">Height (cm)</FormLabel>
                <Input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  bg="#2D3748"
                  border="1px solid"
                  borderColor="gray.600"
                  color={textColor}
                  _placeholder={{ color: 'gray.500' }}
                  placeholder="Enter height in cm"
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel color="gray.400" fontSize="sm">Fitness Goal</FormLabel>
              <Select
                value={formData.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
                bg="#2D3748"
                border="1px solid"
                borderColor="gray.600"
                color={textColor}
              >
                <option value="">Select Goal</option>
                <option value="lose_weight">Lose Weight</option>
                <option value="gain_muscle">Gain Muscle</option>
                <option value="maintain_fitness">Stay Fit</option>
                <option value="improve_endurance">Improve Endurance</option>
                <option value="general_health">General Health</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel color="gray.400" fontSize="sm">Fitness Level</FormLabel>
              <Select
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                bg="#2D3748"
                border="1px solid"
                borderColor="gray.600"
                color={textColor}
              >
                <option value="">Select Fitness Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </FormControl>
          </VStack>

          {}
          <Button
            colorScheme="primary"
            size="lg"
            w="full"
            onClick={handleSave}
            isLoading={isSaving}
            loadingText="Saving..."
            disabled={isSaving}
          >
            Save Changes
          </Button>

          </>
          )}
        </VStack>
      </Box>

      <BottomNavigation />
    </AppContainer>
  );
};

export default EditProfileScreen;
