import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Link,
  Divider,
  IconButton,
  InputGroup,
  InputRightElement,
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';
import AppContainer from '../../components/Layout/AppContainer';

const SignUpScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const { updateProfileData } = useUserData();
  const toast = useToast();
  const textColor = 'white';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {

    updateProfileData({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      password: data.password,
    });

    const signupData = {
      username: data.username,
      password: data.password,
      full_name: `${data.firstName} ${data.lastName}`,
      email: data.email,
    };

    const result = await signup(signupData);

    if (result.success) {
      toast({
        title: 'Account created successfully',
        description: 'Welcome to FitBody!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/profile-setup');
    } else {
      toast({
        title: 'Sign up failed',
        description: result.error || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <AppContainer>
      {}
      <HStack p={6} pt={12}>
        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
          Sign Up
        </Text>
      </HStack>

      {}
      <Box px={6} py={4}>
        <VStack spacing={6} maxW="400px" mx="auto">
          {}
          <VStack spacing={2} textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color={textColor}>
              Create Account
            </Text>
            <Text fontSize="md" color="gray.500">
              Join FitBody and start your fitness journey
            </Text>
          </VStack>

          {}
          <Box w="full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                {}
                <HStack spacing={3} w="full">
                  <FormControl isInvalid={errors.firstName}>
                    <FormLabel color={textColor} fontSize="sm">First Name</FormLabel>
                    <Input
                      placeholder="First name"
                      size="lg"
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: {
                          value: 2,
                          message: 'First name must be at least 2 characters',
                        },
                      })}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.firstName && errors.firstName.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.lastName}>
                    <FormLabel color={textColor} fontSize="sm">Last Name</FormLabel>
                    <Input
                      placeholder="Last name"
                      size="lg"
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: {
                          value: 2,
                          message: 'Last name must be at least 2 characters',
                        },
                      })}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.lastName && errors.lastName.message}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>

                {}
                <FormControl isInvalid={errors.username}>
                  <FormLabel color={textColor} fontSize="sm">Username</FormLabel>
                  <Input
                    type="text"
                    placeholder="Choose a username (6-20 characters)"
                    size="lg"
                    {...register('username', {
                      required: 'Username is required',
                      minLength: {
                        value: 6,
                        message: 'Username must be at least 6 characters',
                      },
                      maxLength: {
                        value: 20,
                        message: 'Username must be at most 20 characters',
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9]{6,20}$/,
                        message: 'Username must be 6-20 characters, letters and numbers only',
                      },
                    })}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.username && errors.username.message}
                  </FormErrorMessage>
                </FormControl>

                {}
                <FormControl isInvalid={errors.email}>
                  <FormLabel color={textColor} fontSize="sm">Email (Optional)</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    size="lg"
                    {...register('email', {
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>

                {}
                <FormControl isInvalid={errors.password}>
                  <FormLabel color={textColor} fontSize="sm">Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create password (6-30 characters)"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                        maxLength: {
                          value: 30,
                          message: 'Password must be at most 30 characters',
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9@$!%*.?&]{6,30}$/,
                          message: 'Password must be 6-30 characters, no spaces allowed',
                        },
                      })}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="xs">
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>

                {}
                <FormControl isInvalid={errors.confirmPassword}>
                  <FormLabel color={textColor} fontSize="sm">Confirm Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value =>
                          value === password || 'Passwords do not match',
                      })}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="xs">
                    {errors.confirmPassword && errors.confirmPassword.message}
                  </FormErrorMessage>
                </FormControl>

                {}
                <FormControl isInvalid={errors.terms}>
                  <Checkbox
                    size="sm"
                    {...register('terms', {
                      required: 'You must agree to the terms and conditions',
                    })}
                  >
                    <Text fontSize="sm" color="gray.600">
                      I agree to the{' '}
                      <Link color="primary.500" fontWeight="medium">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link color="primary.500" fontWeight="medium">
                        Privacy Policy
                      </Link>
                    </Text>
                  </Checkbox>
                  <FormErrorMessage fontSize="xs">
                    {errors.terms && errors.terms.message}
                  </FormErrorMessage>
                </FormControl>

                {}
                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  w="full"
                  isLoading={isSubmitting || isLoading}
                  loadingText="Creating Account..."
                >
                  Create Account
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Box>
    </AppContainer>
  );
};

export default SignUpScreen;
