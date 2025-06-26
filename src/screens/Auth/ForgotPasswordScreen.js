import React from 'react';
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
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import AppContainer from '../../components/Layout/AppContainer';

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const { forgotPassword, isLoading } = useAuth();
  const toast = useToast();
  const textColor = 'white';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await forgotPassword(data.email);

    if (result.success) {
      toast({
        title: 'Reset link sent',
        description: 'Check your email for password reset instructions',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/set-password');
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to send reset link',
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
          Forgot Password
        </Text>
      </HStack>

      {}
      <Box px={6} py={8}>
        <VStack spacing={8} maxW="400px" mx="auto">
          {}
          <Box
            w="100px"
            h="100px"
            bg="primary.100"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="3xl"
          >
            🔒
          </Box>

          {}
          <VStack spacing={4} textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color={textColor}>
              Forgot Password?
            </Text>
            <Text fontSize="md" color="gray.500" lineHeight="tall">
              Don't worry! It happens. Please enter the email address associated with your account.
            </Text>
          </VStack>

          {}
          <Box w="full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={6}>
                {}
                <FormControl isInvalid={errors.email}>
                  <FormLabel color={textColor}>Email Address</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    size="lg"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>

                {}
                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  w="full"
                  isLoading={isSubmitting || isLoading}
                  loadingText="Sending..."
                >
                  Send Reset Link
                </Button>
              </VStack>
            </form>
          </Box>

          {}
          <HStack spacing={2}>
            <Text color="gray.500">Remember your password?</Text>
            <Button
              variant="link"
              color="primary.500"
              fontWeight="semibold"
              onClick={() => navigate('/login')}
            >
              Back to Sign In
            </Button>
          </HStack>
        </VStack>
      </Box>
    </AppContainer>
  );
};

export default ForgotPasswordScreen;
