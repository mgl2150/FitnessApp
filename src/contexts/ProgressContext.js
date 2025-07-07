import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

// Action types
const PROGRESS_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOAD_PROGRESS_SUCCESS: 'LOAD_PROGRESS_SUCCESS',
  LOG_WORKOUT_SUCCESS: 'LOG_WORKOUT_SUCCESS',
  UPDATE_GOALS: 'UPDATE_GOALS',
  UPDATE_WEIGHT: 'UPDATE_WEIGHT',
  RESET_PROGRESS: 'RESET_PROGRESS',
  CALCULATE_STATS: 'CALCULATE_STATS',
  UNLOCK_ACHIEVEMENTS: 'UNLOCK_ACHIEVEMENTS',
  COMPLETE_WEEKLY_CHALLENGE: 'COMPLETE_WEEKLY_CHALLENGE',
};

// Helper functions for calculations
const calculateStreak = (workoutHistory) => {
  if (!workoutHistory || workoutHistory.length === 0) return { current: 0, longest: 0 };

  const sortedHistory = [...workoutHistory]
    .filter(workout => workout.completed)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sortedHistory.length === 0) return { current: 0, longest: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate = null;

  for (const workout of sortedHistory) {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);

    if (!lastDate) {
      // First workout
      currentStreak = 1;
      tempStreak = 1;
      lastDate = workoutDate;
    } else {
      const daysDiff = Math.floor((lastDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day
        if (currentStreak === tempStreak) {
          currentStreak++;
        }
        tempStreak++;
      } else if (daysDiff === 0) {
        // Same day, don't break streak but don't increment
        continue;
      } else {
        // Streak broken
        if (currentStreak === tempStreak) {
          currentStreak = 0; // Current streak is broken
        }
        tempStreak = 1;
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
      lastDate = workoutDate;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);
  return { current: currentStreak, longest: longestStreak };
};

const calculateWeeklyStats = (workoutHistory) => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Start of current week
  weekStart.setHours(0, 0, 0, 0);

  const thisWeekWorkouts = workoutHistory.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= weekStart && workout.completed;
  });

  const completedWorkouts = thisWeekWorkouts.length;
  const totalCalories = thisWeekWorkouts.reduce((sum, workout) => sum + (workout.calories_burned || 0), 0);
  const totalDuration = thisWeekWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);

  return {
    completedWorkouts,
    totalCalories,
    totalDuration: Math.floor(totalDuration / 60), // Convert to minutes
  };
};

// Achievement definitions
const ACHIEVEMENTS = [
  {
    id: 'first_workout',
    title: 'First Steps',
    description: 'Complete your first workout',
    icon: '🎯',
    condition: (state) => state.totalWorkouts >= 1,
    category: 'milestone'
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    icon: '🏆',
    condition: (state) => state.currentStreak >= 7,
    category: 'streak'
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Achieve a 30-day workout streak',
    icon: '🔥',
    condition: (state) => state.currentStreak >= 30,
    category: 'streak'
  },
  {
    id: 'calorie_crusher',
    title: 'Calorie Crusher',
    description: 'Burn 1000+ calories in a week',
    icon: '💪',
    condition: (state) => state.weeklyStats.totalCalories >= 1000,
    category: 'weekly'
  },
  {
    id: 'goal_achiever',
    title: 'Goal Achiever',
    description: 'Complete your weekly workout goal',
    icon: '🎯',
    condition: (state) => {
      const { completedWorkouts } = state.weeklyStats;
      const { weeklyWorkouts } = state.goals;
      return completedWorkouts >= weeklyWorkouts;
    },
    category: 'weekly'
  },
  {
    id: 'consistency_king',
    title: 'Consistency King',
    description: 'Complete 50 total workouts',
    icon: '👑',
    condition: (state) => state.totalWorkouts >= 50,
    category: 'milestone'
  },
  {
    id: 'weight_warrior',
    title: 'Weight Warrior',
    description: 'Track your weight for 30 days',
    icon: '⚖️',
    condition: (state) => state.weightHistory.length >= 30,
    category: 'tracking'
  },
  {
    id: 'weekly_champion',
    title: 'Weekly Champion',
    description: 'Complete a weekly challenge',
    icon: '🏅',
    condition: (state) => state.weeklyChallenge && state.weeklyChallenge.completed === true,
    category: 'challenge'
  }
];

// Check for new achievements
const checkAchievements = (state) => {
  const newAchievements = [];
  const unlockedIds = state.unlockedAchievements.map(a => a.id);

  ACHIEVEMENTS.forEach(achievement => {
    const isAlreadyUnlocked = unlockedIds.includes(achievement.id);
    const conditionMet = achievement.condition(state);

    if (!isAlreadyUnlocked && conditionMet) {
      newAchievements.push({
        ...achievement,
        unlockedAt: new Date().toISOString()
      });
    }
  });

  return newAchievements;
};

const calculateMonthlyStats = (workoutHistory) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonthWorkouts = workoutHistory.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= monthStart && workout.completed;
  });

  const completedWorkouts = thisMonthWorkouts.length;
  const totalCalories = thisMonthWorkouts.reduce((sum, workout) => sum + (workout.calories_burned || 0), 0);
  const totalDuration = thisMonthWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);

  return {
    completedWorkouts,
    totalCalories,
    totalDuration: Math.floor(totalDuration / 60), // Convert to minutes
  };
};

// Progress reducer
const progressReducer = (state, action) => {
  switch (action.type) {
    case PROGRESS_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case PROGRESS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case PROGRESS_ACTIONS.LOAD_PROGRESS_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      };

    case PROGRESS_ACTIONS.LOG_WORKOUT_SUCCESS:
      const newWorkoutHistory = [...state.workoutHistory, action.payload];
      const streaks = calculateStreak(newWorkoutHistory);
      const weeklyStats = calculateWeeklyStats(newWorkoutHistory);
      const monthlyStats = calculateMonthlyStats(newWorkoutHistory);

      let updatedState = {
        ...state,
        workoutHistory: newWorkoutHistory,
        currentStreak: streaks.current,
        longestStreak: streaks.longest,
        weeklyStats,
        monthlyStats,
        totalWorkouts: newWorkoutHistory.filter(w => w.completed).length,
        lastUpdated: new Date().toISOString(),
      };

      // Check if this workout was a weekly challenge
      if (action.payload.is_weekly_challenge === true && action.payload.completed === true) {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);

        updatedState.weeklyChallenge = {
          completed: true,
          completedDate: new Date().toISOString(),
          currentWeekStart: weekStart.toISOString(),
        };
      }

      // Check for new achievements
      const newAchievements = checkAchievements(updatedState);
      if (newAchievements.length > 0) {
        updatedState.unlockedAchievements = [...state.unlockedAchievements, ...newAchievements];
        updatedState.lastUpdated = new Date().toISOString();
      }

      return updatedState;

    case PROGRESS_ACTIONS.UPDATE_GOALS:
      return {
        ...state,
        goals: {
          ...state.goals,
          ...action.payload,
        },
        lastUpdated: new Date().toISOString(),
      };

    case PROGRESS_ACTIONS.UPDATE_WEIGHT:
      console.log('⚖️ UPDATE_WEIGHT action received:', action.payload);
      console.log('📊 Current weight state:', {
        currentWeight: state.currentWeight,
        weightHistoryLength: state.weightHistory.length,
        lastEntry: state.weightHistory[state.weightHistory.length - 1]
      });

      const newWeightEntry = {
        date: new Date().toISOString(),
        weight: action.payload.weight,
        unit: action.payload.unit || 'kg',
      };

      const updatedWeightState = {
        ...state,
        weightHistory: [...state.weightHistory, newWeightEntry],
        currentWeight: action.payload.weight,
        lastUpdated: new Date().toISOString(),
      };

      console.log('✅ Weight state updated:', {
        newCurrentWeight: updatedWeightState.currentWeight,
        newWeightHistoryLength: updatedWeightState.weightHistory.length,
        newEntry: newWeightEntry
      });

      return updatedWeightState;

    case PROGRESS_ACTIONS.CALCULATE_STATS:
      const calculatedStreaks = calculateStreak(state.workoutHistory);
      const calculatedWeeklyStats = calculateWeeklyStats(state.workoutHistory);
      const calculatedMonthlyStats = calculateMonthlyStats(state.workoutHistory);

      return {
        ...state,
        currentStreak: calculatedStreaks.current,
        longestStreak: calculatedStreaks.longest,
        weeklyStats: calculatedWeeklyStats,
        monthlyStats: calculatedMonthlyStats,
        totalWorkouts: state.workoutHistory.filter(w => w.completed).length,
      };

    case PROGRESS_ACTIONS.UNLOCK_ACHIEVEMENTS:
      return {
        ...state,
        unlockedAchievements: [...state.unlockedAchievements, ...action.payload],
        lastUpdated: new Date().toISOString(),
      };

    case PROGRESS_ACTIONS.COMPLETE_WEEKLY_CHALLENGE:
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const updatedWeeklyChallengeState = {
        ...state,
        weeklyChallenge: {
          completed: true,
          completedDate: new Date().toISOString(),
          currentWeekStart: weekStart.toISOString(),
        },
        lastUpdated: new Date().toISOString(),
      };

      // Check for new achievements after completing weekly challenge
      const newWeeklyChallengeAchievements = checkAchievements(updatedWeeklyChallengeState);
      if (newWeeklyChallengeAchievements.length > 0) {
        updatedWeeklyChallengeState.unlockedAchievements = [...state.unlockedAchievements, ...newWeeklyChallengeAchievements];
      }

      return updatedWeeklyChallengeState;

    case PROGRESS_ACTIONS.RESET_PROGRESS:
      return {
        ...initialState,
        goals: state.goals, // Keep goals when resetting
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  // Loading and error states
  loading: false,
  error: null,

  // Core progress data
  workoutHistory: [],
  totalWorkouts: 0,
  currentStreak: 0,
  longestStreak: 0,

  // Weekly and monthly statistics
  weeklyStats: {
    completedWorkouts: 0,
    totalCalories: 0,
    totalDuration: 0,
  },
  monthlyStats: {
    completedWorkouts: 0,
    totalCalories: 0,
    totalDuration: 0,
  },

  // Goals and targets
  goals: {
    weeklyWorkouts: 5,
    weeklyCalories: 2000,
    targetWeight: null,
    dailyCalories: 300,
  },

  // Weight tracking
  weightHistory: [],
  currentWeight: null,

  // Achievements
  achievements: [],
  unlockedAchievements: [],

  // Weekly challenges
  weeklyChallenge: {
    completed: false,
    completedDate: null,
    currentWeekStart: null,
  },

  // Metadata
  lastUpdated: null,
};

// LocalStorage key
const PROGRESS_STORAGE_KEY = 'fitness_progress_data';

// LocalStorage utilities
const saveToLocalStorage = (data) => {
  try {
    const dataToSave = {
      ...data,
      // Don't save loading and error states
      loading: false,
      error: null,
    };
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Failed to save progress data to localStorage:', error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const savedData = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Validate and merge with initial state to ensure all properties exist
      return {
        ...initialState,
        ...parsedData,
        loading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error('Failed to load progress data from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
  }
  return initialState;
};

// Progress Provider Component
export const ProgressProvider = ({ children }) => {
  const [state, dispatch] = useReducer(progressReducer, initialState, loadFromLocalStorage);

  // Save to localStorage whenever state changes (except loading/error states)
  useEffect(() => {
    if (state.lastUpdated) {
      saveToLocalStorage(state);
    }
  }, [state]);

  // Load initial data and calculate stats
  useEffect(() => {
    if (state.workoutHistory.length > 0) {
      dispatch({ type: PROGRESS_ACTIONS.CALCULATE_STATS });
    }
  }, [state.workoutHistory.length]);

  // Action creators
  const setLoading = useCallback((loading) => {
    dispatch({ type: PROGRESS_ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: PROGRESS_ACTIONS.SET_ERROR, payload: error });
  }, []);

  const logWorkout = useCallback((workoutData) => {
    try {
      const workoutEntry = {
        id: Date.now().toString(),
        date: workoutData.date || new Date().toISOString(),
        lesson_id: workoutData.lesson_id,
        duration: workoutData.duration || 0,
        calories_burned: workoutData.calories_burned || 0,
        completed: workoutData.completed || true,
        workout_name: workoutData.workout_name || 'Workout',
        ...workoutData,
      };

      dispatch({ type: PROGRESS_ACTIONS.LOG_WORKOUT_SUCCESS, payload: workoutEntry });
      return { success: true, data: workoutEntry };
    } catch (error) {
      console.error('Failed to log workout:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  }, [setError]);

  const updateGoals = useCallback((newGoals) => {
    dispatch({ type: PROGRESS_ACTIONS.UPDATE_GOALS, payload: newGoals });
  }, []);

  const updateWeight = useCallback((weight, unit = 'kg') => {
    console.log('⚖️ updateWeight function called with:', { weight, unit, type: typeof weight });
    try {
      dispatch({ type: PROGRESS_ACTIONS.UPDATE_WEIGHT, payload: { weight, unit } });
      console.log('✅ Weight update dispatch successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to update weight:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const resetProgress = useCallback(() => {
    dispatch({ type: PROGRESS_ACTIONS.RESET_PROGRESS });
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
  }, []);

  const recalculateStats = useCallback(() => {
    dispatch({ type: PROGRESS_ACTIONS.CALCULATE_STATS });
  }, []);

  const completeWeeklyChallenge = useCallback(() => {
    dispatch({ type: PROGRESS_ACTIONS.COMPLETE_WEEKLY_CHALLENGE });
  }, []);

  const unlockAchievements = useCallback((achievements) => {
    dispatch({ type: PROGRESS_ACTIONS.UNLOCK_ACHIEVEMENTS, payload: achievements });
  }, []);

  const refreshState = useCallback(() => {
    // Force a state recalculation to ensure UI is in sync
    dispatch({ type: PROGRESS_ACTIONS.CALCULATE_STATS });
  }, []);

  // Computed values
  const getWeeklyProgress = useCallback(() => {
    const { completedWorkouts } = state.weeklyStats;
    const { weeklyWorkouts } = state.goals;
    return {
      completed: completedWorkouts,
      goal: weeklyWorkouts,
      percentage: weeklyWorkouts > 0 ? (completedWorkouts / weeklyWorkouts) * 100 : 0,
      remaining: Math.max(0, weeklyWorkouts - completedWorkouts),
    };
  }, [state.weeklyStats, state.goals]);

  const getCalorieProgress = useCallback(() => {
    const { totalCalories } = state.weeklyStats;
    const { weeklyCalories } = state.goals;
    return {
      burned: totalCalories,
      goal: weeklyCalories,
      percentage: weeklyCalories > 0 ? (totalCalories / weeklyCalories) * 100 : 0,
      remaining: Math.max(0, weeklyCalories - totalCalories),
    };
  }, [state.weeklyStats, state.goals]);

  const getWeightProgress = useCallback(() => {
    if (state.weightHistory.length === 0) {
      return {
        current: state.currentWeight,
        target: state.goals.targetWeight,
        change: 0,
        progress: 0,
      };
    }

    const sortedHistory = [...state.weightHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstWeight = sortedHistory[0]?.weight;
    const currentWeight = state.currentWeight || sortedHistory[sortedHistory.length - 1]?.weight;
    const targetWeight = state.goals.targetWeight;

    let change = 0;
    let progress = 0;

    if (firstWeight && currentWeight) {
      change = currentWeight - firstWeight;
    }

    if (firstWeight && currentWeight && targetWeight) {
      const totalChange = targetWeight - firstWeight;
      const currentChange = currentWeight - firstWeight;
      progress = totalChange !== 0 ? (currentChange / totalChange) * 100 : 0;
    }

    return {
      current: currentWeight,
      target: targetWeight,
      change,
      progress: Math.min(100, Math.max(0, progress)),
    };
  }, [state.weightHistory, state.currentWeight, state.goals.targetWeight]);

  const value = {
    // State
    ...state,

    // Actions
    setLoading,
    setError,
    logWorkout,
    updateGoals,
    updateWeight,
    resetProgress,
    recalculateStats,
    completeWeeklyChallenge,
    unlockAchievements,
    refreshState,

    // Computed values
    getWeeklyProgress,
    getCalorieProgress,
    getWeightProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
