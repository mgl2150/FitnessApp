import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import AppContainer from '../../components/Layout/AppContainer';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const LaunchScreen = () => {
  const navigate = useNavigate();
  const textColor = 'white';

  useEffect(() => {
    // Auto-navigate to onboarding after 3 seconds
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AppContainer>
      {/* Background gradient */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgGradient="linear(to-br, primary.500, secondary.500)"
        opacity="0.1"
        borderRadius="xl"
      />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="948px"
        position="relative"
      >
        <MotionVStack
        spacing={8}
        textAlign="center"
        zIndex={1}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* App Logo/Icon */}
        <MotionBox
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Box
            w="120px"
            h="120px"
            bg="primary.500"
            borderRadius="30px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 20px 40px rgba(0,0,0,0.1)"
          >
            <Text
              fontSize="4xl"
              fontWeight="bold"
              color="white"
            >
              💪
            </Text>
          </Box>
        </MotionBox>

        {/* App Name */}
        <MotionVStack
          spacing={2}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Text
            fontSize="4xl"
            fontWeight="bold"
            color={textColor}
            letterSpacing="tight"
          >
            FitBody
          </Text>
          <Text
            fontSize="lg"
            color="gray.500"
            fontWeight="medium"
          >
            Your Fitness Journey Starts Here
          </Text>
        </MotionVStack>

        {/* Loading Spinner */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Spinner
            size="lg"
            color="primary.500"
            thickness="3px"
            speed="0.8s"
          />
        </MotionBox>
      </MotionVStack>

      {/* Bottom decoration */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        h="100px"
        bgGradient="linear(to-t, primary.500, transparent)"
        opacity="0.1"
        borderRadius="xl"
      />
      </Box>
    </AppContainer>
  );
};

export default LaunchScreen;
