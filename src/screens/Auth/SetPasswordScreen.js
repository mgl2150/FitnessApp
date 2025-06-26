import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import AppContainer from '../../components/Layout/AppContainer';

const SetPasswordScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useAuth();
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

    const token = 'mock-reset-token';
    const result = await resetPassword(token, data.password);

    if (result.success) {
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update password',
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
        <IconButton
          icon={<ArrowBackIcon />}
          variant="ghost"
          size="lg"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        />
        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
          Set New Password
        </Text>
      </HStack>

      {}
      <Box px={6} py={8}>
        <VStack spacing={8} maxW="400px" mx="auto">
          {}
          <Box
            w="100px"
            h="100px"
            bg="success.100"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="3xl"
          >
            🔑
          </Box>

          {}
          <VStack spacing={4} textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color={textColor}>
              Set New Password
            </Text>
            <Text fontSize="md" color="gray.500" lineHeight="tall">
              Your new password must be different from your previous password.
            </Text>
          </VStack>

          {}
          <Box w="full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={6}>
                {}
                <FormControl isInvalid={errors.password}>
                  <FormLabel color={textColor}>New Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Password must contain uppercase, lowercase, and number',
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

                {}
                <FormControl isInvalid={errors.confirmPassword}>
                  <FormLabel color={textColor}>Confirm New Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
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
                  <FormErrorMessage>
                    {errors.confirmPassword && errors.confirmPassword.message}
                  </FormErrorMessage>
                </FormControl>

                {}
                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  w="full"
                  isLoading={isSubmitting || isLoading}
                  loadingText="Updating..."
                >
                  Update Password
                </Button>
              </VStack>
            </form>
          </Box>

          {}
          <VStack spacing={2} w="full" align="start">
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              Password must contain:
            </Text>
            <VStack spacing={1} align="start" fontSize="sm" color="gray.500">
              <Text>• At least 8 characters</Text>
              <Text>• One uppercase letter</Text>
              <Text>• One lowercase letter</Text>
              <Text>• One number</Text>
            </VStack>
          </VStack>
        </VStack>
      </Box>
    </AppContainer>
  );
};

export default SetPasswordScreen;
