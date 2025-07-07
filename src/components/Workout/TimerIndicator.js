import React from 'react';
import {
  Box,
  HStack,
  Text,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { TimeIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useWorkoutTimer } from '../../contexts/WorkoutTimerContext';

/**
 * TimerIndicator - Shows a persistent timer indicator when a workout is in progress
 * Displays at the top of screens during workout sessions
 */
const TimerIndicator = () => {
  const navigate = useNavigate();
  const {
    timerState,
    timeRemaining,
    workoutId,
    workoutName,
    TIMER_STATES,
    formatTime,
    isTimerActive
  } = useWorkoutTimer();

  // Don't show if no timer is active
  if (!isTimerActive() || !workoutId) {
    return null;
  }

  const handleReturnToWorkout = () => {
    navigate(`/workout/${workoutId}`);
  };

  const getStatusColor = () => {
    switch (timerState) {
      case TIMER_STATES.RUNNING:
        return 'green';
      case TIMER_STATES.PAUSED:
        return 'orange';
      case TIMER_STATES.COMPLETED:
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStatusText = () => {
    switch (timerState) {
      case TIMER_STATES.RUNNING:
        return 'Running';
      case TIMER_STATES.PAUSED:
        return 'Paused';
      case TIMER_STATES.COMPLETED:
        return 'Completed';
      default:
        return 'Active';
    }
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bg="rgba(45, 55, 72, 0.95)"
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor="gray.600"
      zIndex={1001}
      px={4}
      py={2}
    >
      <HStack justify="space-between" align="center" maxW="450px" mx="auto">
        <HStack spacing={3} flex={1} minW={0}>
          <TimeIcon color="primary.400" />
          <Box flex={1} minW={0}>
            <Text fontSize="sm" fontWeight="semibold" color="white" noOfLines={1}>
              {workoutName || 'Workout'}
            </Text>
            <HStack spacing={2}>
              <Badge colorScheme={getStatusColor()} size="sm">
                {getStatusText()}
              </Badge>
              <Text fontSize="xs" color="gray.300" fontFamily="mono">
                {formatTime(timeRemaining)}
              </Text>
            </HStack>
          </Box>
        </HStack>
        
        <IconButton
          icon={<ArrowBackIcon />}
          size="sm"
          variant="ghost"
          color="white"
          onClick={handleReturnToWorkout}
          aria-label="Return to workout"
          _hover={{ bg: 'whiteAlpha.200' }}
        />
      </HStack>
    </Box>
  );
};

export default TimerIndicator;
