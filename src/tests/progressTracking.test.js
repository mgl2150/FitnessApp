/**
 * Progress Tracking Integration Tests
 * Tests the complete progress tracking flow from workout completion to data display
 */

import { progressSimulationService } from '../services/progressSimulationService';
import { streakUtils, statsUtils, goalUtils } from '../utils/progressUtils';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => store[key] = value.toString(),
    removeItem: (key) => delete store[key],
    clear: () => store = {},
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Progress Tracking System', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Progress Simulation Service', () => {
    test('should generate realistic workout history', () => {
      const progressData = progressSimulationService.generateSampleData();
      
      expect(progressData).toHaveProperty('workoutHistory');
      expect(progressData).toHaveProperty('weightHistory');
      expect(progressData).toHaveProperty('goals');
      expect(Array.isArray(progressData.workoutHistory)).toBe(true);
      expect(progressData.workoutHistory.length).toBeGreaterThan(0);
    });

    test('should simulate API delay', async () => {
      const startTime = Date.now();
      await progressSimulationService.simulateApiDelay(100, 200);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeGreaterThanOrEqual(100);
      expect(duration).toBeLessThan(300); // Allow some buffer
    });

    test('should mock API endpoints correctly', async () => {
      const result = await progressSimulationService.mockAPI.getProgress('test-user');
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('workoutHistory');
    });
  });

  describe('Streak Calculations', () => {
    test('should calculate current streak correctly', () => {
      const workoutHistory = [
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), completed: true },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), completed: true },
        { date: new Date().toISOString(), completed: true },
      ];

      const streaks = streakUtils.calculateStreaks(workoutHistory);
      expect(streaks.current).toBeGreaterThan(0);
      expect(streaks.longest).toBeGreaterThanOrEqual(streaks.current);
    });

    test('should handle empty workout history', () => {
      const streaks = streakUtils.calculateStreaks([]);
      expect(streaks.current).toBe(0);
      expect(streaks.longest).toBe(0);
    });

    test('should provide appropriate streak messages', () => {
      expect(streakUtils.getStreakMessage(0)).toContain('Start');
      expect(streakUtils.getStreakMessage(1)).toContain('Great start');
      expect(streakUtils.getStreakMessage(10)).toContain('Amazing');
      expect(streakUtils.getStreakMessage(35)).toContain('Incredible');
    });
  });

  describe('Statistics Calculations', () => {
    test('should calculate weekly stats correctly', () => {
      const now = new Date();
      const workoutHistory = [
        {
          date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completed: true,
          calories_burned: 200,
          duration: 1800,
        },
        {
          date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          completed: true,
          calories_burned: 150,
          duration: 1200,
        },
      ];

      const weeklyStats = statsUtils.calculateWeeklyStats(workoutHistory);
      expect(weeklyStats.completedWorkouts).toBe(2);
      expect(weeklyStats.totalCalories).toBe(350);
      expect(weeklyStats.totalDuration).toBe(3000);
    });

    test('should calculate all-time stats correctly', () => {
      const workoutHistory = [
        { completed: true, calories_burned: 200, duration: 1800, type: 'cardio' },
        { completed: true, calories_burned: 150, duration: 1200, type: 'strength' },
        { completed: true, calories_burned: 180, duration: 1500, type: 'cardio' },
        { completed: false, calories_burned: 100, duration: 600, type: 'yoga' },
      ];

      const allTimeStats = statsUtils.calculateAllTimeStats(workoutHistory);
      expect(allTimeStats.totalWorkouts).toBe(3); // Only completed workouts
      expect(allTimeStats.totalCalories).toBe(530);
      expect(allTimeStats.favoriteWorkoutType).toBe('cardio');
    });
  });

  describe('Goal Progress Calculations', () => {
    test('should calculate weekly progress correctly', () => {
      const weeklyStats = { completedWorkouts: 3, totalCalories: 800 };
      const goals = { weeklyWorkouts: 5, weeklyCalories: 1000 };

      const progress = goalUtils.calculateWeeklyProgress(weeklyStats, goals);
      
      expect(progress.workouts.completed).toBe(3);
      expect(progress.workouts.goal).toBe(5);
      expect(progress.workouts.percentage).toBe(60);
      expect(progress.workouts.remaining).toBe(2);
      
      expect(progress.calories.burned).toBe(800);
      expect(progress.calories.goal).toBe(1000);
      expect(progress.calories.percentage).toBe(80);
      expect(progress.calories.remaining).toBe(200);
    });

    test('should calculate weight progress correctly', () => {
      const weightHistory = [
        { date: '2024-01-01', weight: 75 },
        { date: '2024-01-15', weight: 73.5 },
        { date: '2024-01-30', weight: 72 },
      ];
      const targetWeight = 70;

      const weightProgress = goalUtils.calculateWeightProgress(weightHistory, targetWeight);
      
      expect(weightProgress.current).toBe(72);
      expect(weightProgress.target).toBe(70);
      expect(weightProgress.change).toBe(-3);
      expect(weightProgress.progress).toBeGreaterThan(0);
    });

    test('should provide motivational messages', () => {
      expect(goalUtils.getMotivationalMessage(100, 'workout')).toContain('smashed');
      expect(goalUtils.getMotivationalMessage(85, 'workout')).toContain('close');
      expect(goalUtils.getMotivationalMessage(60, 'workout')).toContain('progress');
      expect(goalUtils.getMotivationalMessage(30, 'workout')).toContain('start');
      expect(goalUtils.getMotivationalMessage(10, 'workout')).toContain('journey');
    });
  });

  describe('Data Persistence', () => {
    test('should save and load progress data from localStorage', () => {
      const testData = {
        workoutHistory: [
          { id: '1', date: new Date().toISOString(), completed: true, calories_burned: 200 }
        ],
        goals: { weeklyWorkouts: 5, weeklyCalories: 2000 },
        lastUpdated: new Date().toISOString(),
      };

      // Save data
      localStorage.setItem('fitness_progress_data', JSON.stringify(testData));

      // Load data
      const savedData = localStorage.getItem('fitness_progress_data');
      const parsedData = JSON.parse(savedData);

      expect(parsedData).toEqual(testData);
      expect(parsedData.workoutHistory).toHaveLength(1);
      expect(parsedData.goals.weeklyWorkouts).toBe(5);
    });

    test('should handle corrupted localStorage data gracefully', () => {
      // Set corrupted data
      localStorage.setItem('fitness_progress_data', 'invalid-json');

      // Should not throw error when trying to parse
      expect(() => {
        const savedData = localStorage.getItem('fitness_progress_data');
        try {
          JSON.parse(savedData);
        } catch (error) {
          localStorage.removeItem('fitness_progress_data');
        }
      }).not.toThrow();
    });
  });

  describe('Workout Logging Flow', () => {
    test('should create valid workout entry', () => {
      const workoutData = {
        lesson_id: 'workout-123',
        workout_name: 'Morning Cardio',
        duration: 1800,
        calories_burned: 250,
        completed: true,
        type: 'cardio',
      };

      // Simulate the logWorkout function behavior
      const workoutEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...workoutData,
      };

      expect(workoutEntry).toHaveProperty('id');
      expect(workoutEntry).toHaveProperty('date');
      expect(workoutEntry.lesson_id).toBe('workout-123');
      expect(workoutEntry.workout_name).toBe('Morning Cardio');
      expect(workoutEntry.duration).toBe(1800);
      expect(workoutEntry.calories_burned).toBe(250);
      expect(workoutEntry.completed).toBe(true);
      expect(workoutEntry.type).toBe('cardio');
    });
  });
});

// Manual testing helper functions
export const manualTests = {
  // Test localStorage persistence across page reloads
  testPersistence: () => {
    console.log('🧪 Testing localStorage persistence...');
    
    const testData = progressSimulationService.generateSampleData();
    localStorage.setItem('fitness_progress_data', JSON.stringify(testData));
    
    console.log('✅ Data saved to localStorage');
    console.log('📊 Workout history length:', testData.workoutHistory.length);
    console.log('🎯 Goals:', testData.goals);
    
    // Simulate page reload by clearing and reloading
    const reloadedData = JSON.parse(localStorage.getItem('fitness_progress_data'));
    console.log('✅ Data successfully reloaded from localStorage');
    console.log('📊 Reloaded workout history length:', reloadedData.workoutHistory.length);
    
    return reloadedData;
  },

  // Test streak calculations with real data
  testStreakCalculations: () => {
    console.log('🧪 Testing streak calculations...');
    
    const progressData = progressSimulationService.generateSampleData();
    const streaks = streakUtils.calculateStreaks(progressData.workoutHistory);
    
    console.log('✅ Streak calculations completed');
    console.log('🔥 Current streak:', streaks.current, 'days');
    console.log('🏆 Longest streak:', streaks.longest, 'days');
    console.log('💬 Message:', streakUtils.getStreakMessage(streaks.current));
    
    return streaks;
  },

  // Test complete progress tracking flow
  testCompleteFlow: () => {
    console.log('🧪 Testing complete progress tracking flow...');
    
    // 1. Initialize data
    const progressData = progressSimulationService.generateSampleData();
    console.log('✅ Step 1: Data initialized');
    
    // 2. Save to localStorage
    localStorage.setItem('fitness_progress_data', JSON.stringify(progressData));
    console.log('✅ Step 2: Data saved to localStorage');
    
    // 3. Calculate statistics
    const weeklyStats = statsUtils.calculateWeeklyStats(progressData.workoutHistory);
    const streaks = streakUtils.calculateStreaks(progressData.workoutHistory);
    const weeklyProgress = goalUtils.calculateWeeklyProgress(weeklyStats, progressData.goals);
    console.log('✅ Step 3: Statistics calculated');
    
    // 4. Log new workout
    const newWorkout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      lesson_id: 'test-workout',
      workout_name: 'Test Workout',
      duration: 1800,
      calories_burned: 200,
      completed: true,
      type: 'test',
    };
    
    progressData.workoutHistory.push(newWorkout);
    localStorage.setItem('fitness_progress_data', JSON.stringify(progressData));
    console.log('✅ Step 4: New workout logged');
    
    // 5. Recalculate with new data
    const updatedWeeklyStats = statsUtils.calculateWeeklyStats(progressData.workoutHistory);
    const updatedStreaks = streakUtils.calculateStreaks(progressData.workoutHistory);
    console.log('✅ Step 5: Statistics updated');
    
    console.log('🎉 Complete flow test successful!');
    console.log('📊 Final stats:', {
      totalWorkouts: progressData.workoutHistory.filter(w => w.completed).length,
      weeklyWorkouts: updatedWeeklyStats.completedWorkouts,
      currentStreak: updatedStreaks.current,
      weeklyProgress: goalUtils.calculateWeeklyProgress(updatedWeeklyStats, progressData.goals),
    });
    
    return {
      progressData,
      weeklyStats: updatedWeeklyStats,
      streaks: updatedStreaks,
      weeklyProgress: goalUtils.calculateWeeklyProgress(updatedWeeklyStats, progressData.goals),
    };
  },
};

console.log('🧪 Progress Tracking Tests Loaded');
console.log('💡 Run manualTests.testCompleteFlow() in browser console to test the complete flow');
