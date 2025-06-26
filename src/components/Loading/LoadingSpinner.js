import React from 'react';
import {
  Box,
  VStack,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const LoadingSpinner = ({
  message = 'Loading...',
  size = 'xl',
  fullScreen = false,
  showMessage = true
}) => {
  const bgColor = '#232323';
  const textColor = 'white';

  const content = (
    <VStack spacing={4}>
      <MotionBox
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="primary.500"
          size={size}
        />
      </MotionBox>
      {showMessage && (
        <Text fontSize="md" color={textColor} textAlign="center">
          {message}
        </Text>
      )}
    </VStack>
  );

  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={bgColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={9999}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={8}
    >
      {content}
    </Box>
  );
};

export default LoadingSpinner;
