import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Switch,
  Card,
  CardBody,
  Divider,
  Button,
  Select,
  useColorMode,
  useToast,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  IconButton,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, ArrowBackIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUserData } from '../../contexts/UserDataContext';
import { useAuth } from '../../contexts/AuthContext';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { profileData, updateProfileData } = useUserData();
  const { colorMode, toggleColorMode } = useColorMode();
  const { changePassword, isLoading } = useAuth();
  const toast = useToast();
  const cardBg = '#2D3748';
  const textColor = 'white';

  const [settings, setSettings] = useState({
    notifications: profileData.notifications ?? true,
    workoutReminders: true,
    progressUpdates: true,
    socialSharing: false,
    dataSync: true,
    units: profileData.units || 'metric',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm();

  const newPassword = watch('newPassword');

  const handleBackNavigation = () => {
    navigate('/profile');
  };

  const onSubmitPasswordChange = async (data) => {
    try {
      const result = await changePassword(data.currentPassword, data.newPassword);

      if (result.success) {
        toast({
          title: 'Password Changed',
          description: 'Your password has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        reset();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to change password. Please try again.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    if (key === 'notifications' || key === 'units') {
      updateProfileData({ [key]: value });
    }

    toast({
      title: 'Setting updated',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const settingSections = [
    {
      title: 'Appearance',
      items: [
        {
          key: 'darkMode',
          label: 'Dark Mode',
          description: 'Switch between light and dark themes',
          type: 'switch',
          value: colorMode === 'dark',
          onChange: () => toggleColorMode(),
          icon: colorMode === 'dark' ? <MoonIcon /> : <SunIcon />
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          key: 'notifications',
          label: 'Push Notifications',
          description: 'Receive notifications on your device',
          type: 'switch',
          value: settings.notifications,
          onChange: (value) => handleSettingChange('notifications', value)
        },
        {
          key: 'workoutReminders',
          label: 'Workout Reminders',
          description: 'Get reminded about your scheduled workouts',
          type: 'switch',
          value: settings.workoutReminders,
          onChange: (value) => handleSettingChange('workoutReminders', value)
        },
        {
          key: 'progressUpdates',
          label: 'Progress Updates',
          description: 'Weekly progress and achievement notifications',
          type: 'switch',
          value: settings.progressUpdates,
          onChange: (value) => handleSettingChange('progressUpdates', value)
        }
      ]
    },
    {
      title: 'Privacy & Data',
      items: [
        {
          key: 'socialSharing',
          label: 'Social Sharing',
          description: 'Allow sharing achievements on social media',
          type: 'switch',
          value: settings.socialSharing,
          onChange: (value) => handleSettingChange('socialSharing', value)
        },
        {
          key: 'dataSync',
          label: 'Data Synchronization',
          description: 'Sync data across devices',
          type: 'switch',
          value: settings.dataSync,
          onChange: (value) => handleSettingChange('dataSync', value)
        }
      ]
    },
    {
      title: 'Units & Preferences',
      items: [
        {
          key: 'units',
          label: 'Measurement Units',
          description: 'Choose your preferred unit system',
          type: 'select',
          value: settings.units,
          options: [
            { value: 'metric', label: 'Metric (kg, cm)' },
            { value: 'imperial', label: 'Imperial (lbs, ft/in)' }
          ],
          onChange: (value) => handleSettingChange('units', value)
        }
      ]
    },
    {
      title: 'Support & Help',
      items: [
        {
          key: 'help',
          label: 'Help & FAQs',
          description: 'Get answers to common questions',
          type: 'button',
          action: () => navigate('/help'),
          buttonText: 'View Help'
        },
        {
          key: 'contact',
          label: 'Contact Support',
          description: 'Get in touch with our support team',
          type: 'button',
          action: () => {
            toast({
              title: 'Contact Support',
              description: 'Email us at support@fitnessapp.com',
              status: 'info',
              duration: 5000,
              isClosable: true,
            });
          },
          buttonText: 'Contact Us'
        }
      ]
    }
  ];

  return (
    <AppContainer hasBottomNav={true}>
      {}
      <Box bg="#232323" px={4} py={3} pt={6}>
        <HStack justify="space-between" align="center">
          <IconButton
            icon={<ArrowBackIcon />}
            variant="ghost"
            size="md"
            onClick={handleBackNavigation}
            aria-label="Go back"
            color={textColor}
          />
          <Text fontSize="lg" fontWeight="bold" color={textColor} noOfLines={1}>
            Settings
          </Text>
          <Box w="32px" />
        </HStack>
      </Box>

      {}
      <Box px={4} py={3} pb={20}>
        <VStack spacing={4} w="full">

          {}
          <Card bg={cardBg} w="full" borderRadius="lg">
            <CardBody p={4}>
              <VStack spacing={4} align="start">
                <Text fontSize="md" fontWeight="bold" color={textColor}>
                  Change Password
                </Text>

                <Box as="form" onSubmit={handleSubmit(onSubmitPasswordChange)} w="full">
                  <VStack spacing={3} w="full">
                    {}
                    <FormControl isInvalid={errors.currentPassword}>
                      <FormLabel fontSize="sm" color="gray.400">Current Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          placeholder="Enter current password"
                          bg="gray.700"
                          border="1px solid"
                          borderColor="gray.600"
                          color={textColor}
                          fontSize="sm"
                          _placeholder={{ color: 'gray.500' }}
                          _hover={{ borderColor: 'gray.500' }}
                          _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
                          {...register('currentPassword', {
                            required: 'Current password is required',
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters'
                            },
                            maxLength: {
                              value: 30,
                              message: 'Password must be no more than 30 characters'
                            }
                          })}
                        />
                        <InputRightElement>
                          <IconButton
                            variant="ghost"
                            size="sm"
                            icon={showCurrentPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            color="gray.400"
                            _hover={{ color: 'gray.300' }}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage fontSize="xs">
                        {errors.currentPassword && errors.currentPassword.message}
                      </FormErrorMessage>
                    </FormControl>

                    {}
                    <FormControl isInvalid={errors.newPassword}>
                      <FormLabel fontSize="sm" color="gray.400">New Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Enter new password"
                          bg="gray.700"
                          border="1px solid"
                          borderColor="gray.600"
                          color={textColor}
                          fontSize="sm"
                          _placeholder={{ color: 'gray.500' }}
                          _hover={{ borderColor: 'gray.500' }}
                          _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
                          {...register('newPassword', {
                            required: 'New password is required',
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters'
                            },
                            maxLength: {
                              value: 30,
                              message: 'Password must be no more than 30 characters'
                            }
                          })}
                        />
                        <InputRightElement>
                          <IconButton
                            variant="ghost"
                            size="sm"
                            icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            color="gray.400"
                            _hover={{ color: 'gray.300' }}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage fontSize="xs">
                        {errors.newPassword && errors.newPassword.message}
                      </FormErrorMessage>
                    </FormControl>

                    {}
                    <FormControl isInvalid={errors.confirmPassword}>
                      <FormLabel fontSize="sm" color="gray.400">Confirm New Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm new password"
                          bg="gray.700"
                          border="1px solid"
                          borderColor="gray.600"
                          color={textColor}
                          fontSize="sm"
                          _placeholder={{ color: 'gray.500' }}
                          _hover={{ borderColor: 'gray.500' }}
                          _focus={{ borderColor: 'primary.500', boxShadow: 'none' }}
                          {...register('confirmPassword', {
                            required: 'Please confirm your new password',
                            validate: value =>
                              value === newPassword || 'Passwords do not match'
                          })}
                        />
                        <InputRightElement>
                          <IconButton
                            variant="ghost"
                            size="sm"
                            icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            color="gray.400"
                            _hover={{ color: 'gray.300' }}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage fontSize="xs">
                        {errors.confirmPassword && errors.confirmPassword.message}
                      </FormErrorMessage>
                    </FormControl>

                    {}
                    <Button
                      type="submit"
                      bg="primary.500"
                      color="white"
                      size="md"
                      w="full"
                      isLoading={isSubmitting || isLoading}
                      loadingText="Changing Password..."
                      _hover={{ bg: 'primary.600' }}
                      _active={{ bg: 'primary.700' }}
                      borderRadius="lg"
                      h="40px"
                      fontSize="sm"
                      fontWeight="semibold"
                    >
                      Change Password
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {settingSections.map((section, sectionIndex) => (
            <Card key={section.title} bg={cardBg} w="full" borderRadius="lg">
              <CardBody p={4}>
                <VStack spacing={3} align="start">
                  <Text fontSize="md" fontWeight="bold" color={textColor}>
                    {section.title}
                  </Text>

                  <VStack spacing={3} w="full">
                    {section.items.map((item, itemIndex) => (
                      <Box key={item.key} w="full">
                        <HStack justify="space-between" align="start" w="full" spacing={3}>
                          <VStack spacing={1} align="start" flex={1} minW={0}>
                            <HStack spacing={2}>
                              {item.icon}
                              <Text fontSize="sm" fontWeight="semibold" color={textColor} noOfLines={1}>
                                {item.label}
                              </Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" noOfLines={2}>
                              {item.description}
                            </Text>
                          </VStack>

                          <Box minW="fit-content" flexShrink={0}>
                            {item.type === 'switch' ? (
                              <Switch
                                isChecked={item.value}
                                onChange={(e) => item.onChange(e.target.checked)}
                                colorScheme="primary"
                                size="md"
                              />
                            ) : item.type === 'select' ? (
                              <Select
                                value={item.value}
                                onChange={(e) => item.onChange(e.target.value)}
                                size="sm"
                                minW="120px"
                                bg="gray.700"
                                borderColor="gray.600"
                                color={textColor}
                                fontSize="xs"
                              >
                                {item.options.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </Select>
                            ) : item.type === 'button' ? (
                              <Button
                                size="sm"
                                colorScheme="primary"
                                variant="outline"
                                onClick={item.action}
                                fontSize="xs"
                                px={3}
                              >
                                {item.buttonText}
                              </Button>
                            ) : null}
                          </Box>
                        </HStack>

                        {itemIndex < section.items.length - 1 && <Divider mt={3} borderColor="gray.600" />}
                      </Box>
                    ))}
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          ))}

          {}
          <Card bg={cardBg} w="full" borderRadius="lg">
            <CardBody p={4}>
              <VStack spacing={3} align="start">
                <Text fontSize="md" fontWeight="bold" color={textColor}>
                  App Information
                </Text>

                <VStack spacing={2} w="full">
                  <HStack justify="space-between" w="full">
                    <Text fontSize="xs" color="gray.400">Version</Text>
                    <Text fontSize="xs" fontWeight="semibold" color={textColor}>
                      1.0.0
                    </Text>
                  </HStack>

                  <HStack justify="space-between" w="full">
                    <Text fontSize="xs" color="gray.400">Build</Text>
                    <Text fontSize="xs" fontWeight="semibold" color={textColor}>
                      2024.01.15
                    </Text>
                  </HStack>

                  <Divider borderColor="gray.600" />

                  <VStack spacing={1} w="full">
                    <Button variant="ghost" size="sm" w="full" fontSize="xs" h="32px" color="gray.300">
                      Privacy Policy
                    </Button>
                    <Button variant="ghost" size="sm" w="full" fontSize="xs" h="32px" color="gray.300">
                      Terms of Service
                    </Button>
                    <Button variant="ghost" size="sm" w="full" fontSize="xs" h="32px" color="gray.300">
                      Contact Support
                    </Button>
                    <Button variant="ghost" size="sm" w="full" fontSize="xs" h="32px" color="gray.300">
                      Rate App
                    </Button>
                  </VStack>
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          {}
          <Card bg={cardBg} w="full" borderColor="red.400" borderWidth="1px" borderRadius="lg">
            <CardBody p={4}>
              <VStack spacing={3} align="start">
                <Text fontSize="md" fontWeight="bold" color="red.400">
                  Danger Zone
                </Text>

                <VStack spacing={2} w="full">
                  <Button
                    colorScheme="red"
                    variant="outline"
                    size="sm"
                    w="full"
                    fontSize="xs"
                    h="36px"
                  >
                    Clear All Data
                  </Button>

                  <Button
                    colorScheme="red"
                    variant="solid"
                    size="sm"
                    w="full"
                    fontSize="xs"
                    h="36px"
                  >
                    Delete Account
                  </Button>
                </VStack>

                <Text fontSize="xs" color="gray.500" textAlign="center" w="full">
                  These actions cannot be undone. Please be careful.
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Box>

      <BottomNavigation />
    </AppContainer>
  );
};

export default SettingsScreen;
