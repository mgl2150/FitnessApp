import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

// Timer states
const TIMER_STATES = {
  STOPPED: 'stopped',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed'
};

// Action types
const TIMER_ACTIONS = {
  START_TIMER: 'START_TIMER',
  PAUSE_TIMER: 'PAUSE_TIMER',
  RESUME_TIMER: 'RESUME_TIMER',
  STOP_TIMER: 'STOP_TIMER',
  COMPLETE_TIMER: 'COMPLETE_TIMER',
  TICK: 'TICK',
  SET_WORKOUT: 'SET_WORKOUT',
  RESET_TIMER: 'RESET_TIMER'
};

// Initial state
const initialState = {
  timerState: TIMER_STATES.STOPPED,
  timeRemaining: 0,
  totalDuration: 0,
  workoutId: null,
  workoutName: null,
  startTime: null,
  elapsedTime: 0
};

// Timer reducer
const timerReducer = (state, action) => {
  switch (action.type) {
    case TIMER_ACTIONS.SET_WORKOUT:
      const durationInSeconds = action.payload.minutes * 60;
      return {
        ...state,
        workoutId: action.payload.workoutId,
        workoutName: action.payload.workoutName,
        totalDuration: durationInSeconds,
        timeRemaining: durationInSeconds,
        timerState: TIMER_STATES.STOPPED,
        startTime: null,
        elapsedTime: 0
      };

    case TIMER_ACTIONS.START_TIMER:
      return {
        ...state,
        timerState: TIMER_STATES.RUNNING,
        startTime: Date.now() - (state.elapsedTime * 1000)
      };

    case TIMER_ACTIONS.PAUSE_TIMER:
      return {
        ...state,
        timerState: TIMER_STATES.PAUSED
      };

    case TIMER_ACTIONS.RESUME_TIMER:
      return {
        ...state,
        timerState: TIMER_STATES.RUNNING,
        startTime: Date.now() - (state.elapsedTime * 1000)
      };

    case TIMER_ACTIONS.STOP_TIMER:
      return {
        ...state,
        timerState: TIMER_STATES.STOPPED,
        timeRemaining: state.totalDuration,
        startTime: null,
        elapsedTime: 0
      };

    case TIMER_ACTIONS.COMPLETE_TIMER:
      return {
        ...state,
        timerState: TIMER_STATES.COMPLETED,
        timeRemaining: 0,
        elapsedTime: state.totalDuration
      };

    case TIMER_ACTIONS.TICK:
      if (state.timerState !== TIMER_STATES.RUNNING || !state.startTime) {
        return state;
      }

      const now = Date.now();
      const elapsed = Math.floor((now - state.startTime) / 1000);
      const remaining = Math.max(0, state.totalDuration - elapsed);

      if (remaining === 0) {
        return {
          ...state,
          timerState: TIMER_STATES.COMPLETED,
          timeRemaining: 0,
          elapsedTime: state.totalDuration
        };
      }

      return {
        ...state,
        timeRemaining: remaining,
        elapsedTime: elapsed
      };

    case TIMER_ACTIONS.RESET_TIMER:
      return {
        ...initialState
      };

    default:
      return state;
  }
};

// Create context
const WorkoutTimerContext = createContext();

// Custom hook to use the timer context
export const useWorkoutTimer = () => {
  const context = useContext(WorkoutTimerContext);
  if (!context) {
    throw new Error('useWorkoutTimer must be used within a WorkoutTimerProvider');
  }
  return context;
};

// Timer provider component
export const WorkoutTimerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const intervalRef = useRef(null);

  // Timer tick effect
  useEffect(() => {
    if (state.timerState === TIMER_STATES.RUNNING) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: TIMER_ACTIONS.TICK });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.timerState, state.startTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Action creators
  const setWorkout = (workoutId, workoutName, minutes) => {
    dispatch({
      type: TIMER_ACTIONS.SET_WORKOUT,
      payload: { workoutId, workoutName, minutes }
    });
  };

  const startTimer = () => {
    if (state.timerState === TIMER_STATES.STOPPED || state.timerState === TIMER_STATES.COMPLETED) {
      dispatch({ type: TIMER_ACTIONS.START_TIMER });
    } else if (state.timerState === TIMER_STATES.PAUSED) {
      dispatch({ type: TIMER_ACTIONS.RESUME_TIMER });
    } else if (state.timerState === TIMER_STATES.RUNNING) {
      dispatch({ type: TIMER_ACTIONS.PAUSE_TIMER });
    }
  };

  const pauseTimer = () => {
    dispatch({ type: TIMER_ACTIONS.PAUSE_TIMER });
  };

  const resumeTimer = () => {
    dispatch({ type: TIMER_ACTIONS.RESUME_TIMER });
  };

  const stopTimer = () => {
    dispatch({ type: TIMER_ACTIONS.STOP_TIMER });
  };

  const completeTimer = () => {
    dispatch({ type: TIMER_ACTIONS.COMPLETE_TIMER });
  };

  const resetTimer = () => {
    dispatch({ type: TIMER_ACTIONS.RESET_TIMER });
  };

  // Helper functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (state.totalDuration === 0) return 0;
    return ((state.totalDuration - state.timeRemaining) / state.totalDuration) * 100;
  };

  const isTimerActive = () => {
    return state.timerState === TIMER_STATES.RUNNING || 
           state.timerState === TIMER_STATES.PAUSED || 
           state.timerState === TIMER_STATES.COMPLETED;
  };

  const isWorkoutInProgress = (workoutId) => {
    return state.workoutId === workoutId && isTimerActive();
  };

  const value = {
    // State
    ...state,
    TIMER_STATES,
    
    // Actions
    setWorkout,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    completeTimer,
    resetTimer,
    
    // Helpers
    formatTime,
    getProgressPercentage,
    isTimerActive,
    isWorkoutInProgress
  };

  return (
    <WorkoutTimerContext.Provider value={value}>
      {children}
    </WorkoutTimerContext.Provider>
  );
};

export default WorkoutTimerContext;
