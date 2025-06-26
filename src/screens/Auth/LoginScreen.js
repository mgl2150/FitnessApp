import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
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
  IconButton,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import AppContainer from '../../components/Layout/AppContainer';

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const toast = useToast();
  const textColor = 'white';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data.username, data.password);

    if (result.success) {
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Navigate to the intended destination or home
      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });
    } else {
      toast({
        title: 'Login failed',
        description: result.error || 'Invalid username or password',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <AppContainer>
      {/* Header */}
      <HStack p={6} pt={12}>
        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
          Sign In
        </Text>
      </HStack>

      {/* Main Content */}
      <Box alignSelf={'center'} px={6} py={8} mt={20}>
        <VStack spacing={8} maxW="400px" mx="auto">
          {/* Welcome Text */}
          <VStack spacing={2} textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color={textColor}>
              Welcome Back
            </Text>
            <Text fontSize="md" color="gray.500">
              Sign in to continue your fitness journey
            </Text>
          </VStack>

          {/* Login Form */}
          <Box w="full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={6}>
                {/* Username Field */}
                <FormControl isInvalid={errors.username}>
                  <FormLabel color={textColor}>Username</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter your username"
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
                  <FormErrorMessage>
                    {errors.username && errors.username.message}
                  </FormErrorMessage>
                </FormControl>

                {/* Password Field */}
                <FormControl isInvalid={errors.password}>
                  <FormLabel color={textColor}>Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
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
                  <FormErrorMessage>
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>

                {/* Forgot Password Link */}
                <HStack w="full" justify="flex-end">
                  <Link
                    as={RouterLink}
                    to="/forgot-password"
                    color="primary.500"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    Forgot Password?
                  </Link>
                </HStack>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  w="full"
                  isLoading={isSubmitting || isLoading}
                  loadingText="Signing In..."
                >
                  Sign In
                </Button>
              </VStack>
            </form>
          </Box>

          {/* Sign Up Link */}
          <HStack spacing={2}>
            <Text color="gray.500">Don't have an account?</Text>
            <Link
              as={RouterLink}
              to="/signup"
              color="primary.500"
              fontWeight="semibold"
            >
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </AppContainer>
  );
};

export default LoginScreen;
