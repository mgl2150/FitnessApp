/**
 * Progress Simulation Service
 * Provides realistic progress tracking data for frontend-only operation
 */

// Sample workout types with realistic calorie burns and durations
const WORKOUT_TYPES = [
  { name: 'Morning Cardio', calories: 180, duration: 25, type: 'cardio' },
  { name: 'Strength Training', calories: 220, duration: 35, type: 'strength' },
  { name: 'HIIT Workout', calories: 280, duration: 20, type: 'hiit' },
  { name: 'Yoga Flow', calories: 120, duration: 45, type: 'yoga' },
  { name: 'Full Body Circuit', calories: 250, duration: 30, type: 'circuit' },
  { name: 'Core Blast', calories: 150, duration: 15, type: 'core' },
  { name: 'Upper Body Focus', calories: 200, duration: 30, type: 'strength' },
  { name: 'Lower Body Power', calories: 240, duration: 35, type: 'strength' },
  { name: 'Flexibility & Stretch', calories: 80, duration: 20, type: 'flexibility' },
  { name: 'Dance Cardio', calories: 200, duration: 30, type: 'cardio' },
];

// Generate random date within a range
const getRandomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  // Add some random hours/minutes for variety
  date.setHours(Math.floor(Math.random() * 12) + 6); // 6 AM to 6 PM
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toISOString();
};

// Generate realistic workout history
const generateWorkoutHistory = (daysBack = 90, frequency = 0.6) => {
  const history = [];
  
  for (let i = 0; i < daysBack; i++) {
    // Skip some days to make it realistic (frequency determines how often)
    if (Math.random() > frequency) continue;
    
    // Sometimes do multiple workouts per day (20% chance)
    const workoutsToday = Math.random() < 0.2 ? 2 : 1;
    
    for (let j = 0; j < workoutsToday; j++) {
      const workout = WORKOUT_TYPES[Math.floor(Math.random() * WORKOUT_TYPES.length)];
      const variationFactor = 0.8 + Math.random() * 0.4; // ±20% variation
      
      history.push({
        id: `workout_${i}_${j}_${Date.now()}`,
        date: getRandomDate(i),
        lesson_id: `lesson_${Math.floor(Math.random() * 100)}`,
        workout_name: workout.name,
        duration: Math.floor(workout.duration * 60 * variationFactor), // Convert to seconds
        calories_burned: Math.floor(workout.calories * variationFactor),
        completed: Math.random() > 0.05, // 95% completion rate
        type: workout.type,
      });
    }
  }
  
  return history.sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Generate realistic weight history
const generateWeightHistory = (startWeight = 75, targetWeight = 70, daysBack = 90) => {
  const history = [];
  const totalChange = targetWeight - startWeight;
  const dailyChange = totalChange / daysBack;
  
  // Add some realistic fluctuation
  let currentWeight = startWeight;
  
  for (let i = 0; i < daysBack; i += 7) { // Weekly weigh-ins
    // Add some random fluctuation (±1kg)
    const fluctuation = (Math.random() - 0.5) * 2;
    const progressWeight = startWeight + (dailyChange * i);
    currentWeight = progressWeight + fluctuation;
    
    // Don't let weight go too far from realistic range
    currentWeight = Math.max(targetWeight - 5, Math.min(startWeight + 5, currentWeight));
    
    history.push({
      date: getRandomDate(daysBack - i),
      weight: Math.round(currentWeight * 10) / 10, // Round to 1 decimal
      unit: 'kg',
    });
  }
  
  return history.sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Generate realistic goals based on user profile
const generateRealisticGoals = (userProfile = {}) => {
  const baseGoals = {
    weeklyWorkouts: 4,
    weeklyCalories: 1500,
    dailyCalories: 250,
    targetWeight: null,
  };
  
  // Adjust goals based on user activity level
  if (userProfile.activityLevel === 'sedentary') {
    baseGoals.weeklyWorkouts = 3;
    baseGoals.weeklyCalories = 1000;
    baseGoals.dailyCalories = 200;
  } else if (userProfile.activityLevel === 'very_active') {
    baseGoals.weeklyWorkouts = 6;
    baseGoals.weeklyCalories = 2500;
    baseGoals.dailyCalories = 400;
  } else if (userProfile.activityLevel === 'active') {
    baseGoals.weeklyWorkouts = 5;
    baseGoals.weeklyCalories = 2000;
    baseGoals.dailyCalories = 350;
  }
  
  // Set target weight based on goal
  if (userProfile.goal === 'lose_weight' && userProfile.weight) {
    baseGoals.targetWeight = parseFloat(userProfile.weight) - 5;
  } else if (userProfile.goal === 'gain_weight' && userProfile.weight) {
    baseGoals.targetWeight = parseFloat(userProfile.weight) + 3;
  }
  
  return baseGoals;
};

// Main simulation service
export const progressSimulationService = {
  
  // Initialize progress data for a new user
  initializeProgressData: (userProfile = {}) => {
    const workoutHistory = generateWorkoutHistory(90, 0.6);
    const weightHistory = generateWeightHistory(
      parseFloat(userProfile.weight) || 75,
      parseFloat(userProfile.weight) - 3 || 72,
      90
    );
    const goals = generateRealisticGoals(userProfile);
    
    return {
      workoutHistory,
      weightHistory,
      goals,
      currentWeight: weightHistory[weightHistory.length - 1]?.weight || parseFloat(userProfile.weight) || 75,
      totalWorkouts: workoutHistory.filter(w => w.completed).length,
      lastUpdated: new Date().toISOString(),
    };
  },
  
  // Generate sample data for demo purposes
  generateSampleData: () => {
    const sampleProfile = {
      weight: '75',
      goal: 'lose_weight',
      activityLevel: 'moderately_active',
    };
    
    return progressSimulationService.initializeProgressData(sampleProfile);
  },
  
  // Simulate API delay for realistic feel
  simulateApiDelay: (minMs = 300, maxMs = 800) => {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise(resolve => setTimeout(resolve, delay));
  },
  
  // Mock API endpoints
  mockAPI: {
    getProgress: async (userId) => {
      await progressSimulationService.simulateApiDelay();
      
      // Try to get existing data from localStorage first
      const existingData = localStorage.getItem('fitness_progress_data');
      if (existingData) {
        try {
          const parsed = JSON.parse(existingData);
          return { success: true, data: parsed };
        } catch (error) {
          console.warn('Failed to parse existing progress data');
        }
      }
      
      // Generate new data if none exists
      const progressData = progressSimulationService.generateSampleData();
      return { success: true, data: progressData };
    },
    
    logProgress: async (progressData) => {
      await progressSimulationService.simulateApiDelay(200, 500);
      
      // Simulate occasional failures (5% chance)
      if (Math.random() < 0.05) {
        return { success: false, error: 'Network error - please try again' };
      }
      
      return { success: true, data: progressData };
    },
    
    updateGoals: async (goals) => {
      await progressSimulationService.simulateApiDelay(200, 400);
      return { success: true, data: goals };
    },
    
    updateWeight: async (weightData) => {
      await progressSimulationService.simulateApiDelay(200, 400);
      return { success: true, data: weightData };
    },
  },
  
  // Utility functions
  utils: {
    generateRandomWorkout: () => {
      const workout = WORKOUT_TYPES[Math.floor(Math.random() * WORKOUT_TYPES.length)];
      const variationFactor = 0.8 + Math.random() * 0.4;
      
      return {
        id: `workout_${Date.now()}`,
        date: new Date().toISOString(),
        lesson_id: `lesson_${Math.floor(Math.random() * 100)}`,
        workout_name: workout.name,
        duration: Math.floor(workout.duration * 60 * variationFactor),
        calories_burned: Math.floor(workout.calories * variationFactor),
        completed: true,
        type: workout.type,
      };
    },
    
    getWorkoutTypes: () => WORKOUT_TYPES,
    
    calculateRealisticCalories: (duration, workoutType = 'general') => {
      // Calories per minute for different workout types
      const caloriesPerMinute = {
        cardio: 7,
        strength: 6,
        hiit: 12,
        yoga: 3,
        circuit: 8,
        core: 8,
        flexibility: 2,
        general: 6,
      };
      
      const rate = caloriesPerMinute[workoutType] || caloriesPerMinute.general;
      return Math.floor(duration * rate * (0.8 + Math.random() * 0.4)); // ±20% variation
    },
  },
};

export default progressSimulationService;
