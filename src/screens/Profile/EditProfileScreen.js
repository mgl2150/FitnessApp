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
  });

  const [isSaving, setIsSaving] = useState(false);

  // Load current profile data when component mounts or user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        dob: user.dob || '',
        weight: user.weight || '',
        height: user.height || '',
        goal: user.goal || '',
        level: user.level || 'beginner',
      });
    }
  }, [user]);

  const handleBackNavigation = () => {
    navigate('/profile');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Prepare data for backend (convert types as needed)
      const profileUpdateData = {
        ...formData,
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
      };

      // Remove empty fields
      Object.keys(profileUpdateData).forEach(key => {
        if (profileUpdateData[key] === '' || profileUpdateData[key] === undefined) {
          delete profileUpdateData[key];
        }
      });

      // Update profile via AuthContext (which calls the real API)
      const result = await updateProfile(profileUpdateData);

      if (result.success) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        navigate('/profile');
      } else {
        toast({
          title: 'Update Failed',
          description: result.error || 'Failed to update your profile. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update your profile. Please try again.',
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
            Edit Profile
          </Text>
          <Box w="40px" /> {/* Spacer for centering */}
        </HStack>
      </Box>

      {/* Main Content */}
      <Box p={6} pb={24}>
        <VStack spacing={6} w="full">
          
          {/* Avatar Section */}
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

          {/* Form Fields */}
          <VStack spacing={4} w="full">
            <FormControl>
              <FormLabel color="gray.400" fontSize="sm">Full Name</FormLabel>
              <Input
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                bg="#2D3748"
                border="1px solid"
                borderColor="gray.600"
                color={textColor}
                _placeholder={{ color: 'gray.500' }}
                placeholder="Enter your full name"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.400" fontSize="sm">Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                bg="#2D3748"
                border="1px solid"
                borderColor="gray.600"
                color={textColor}
                _placeholder={{ color: 'gray.500' }}
                placeholder="Enter your email"
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

          {/* Save Button */}
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
        </VStack>
      </Box>

      <BottomNavigation />
    </AppContainer>
  );
};

export default EditProfileScreen;
