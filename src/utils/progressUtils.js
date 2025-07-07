/**
 * Progress Data Management Utilities
 * Functions for calculating streaks, aggregations, goal progress, and data transformations
 */

// Date utilities
export const dateUtils = {
  // Get start of week (Sunday)
  getWeekStart: (date = new Date()) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  },

  // Get start of month
  getMonthStart: (date = new Date()) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },

  // Get days between two dates
  getDaysBetween: (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
  },

  // Check if two dates are on the same day
  isSameDay: (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  },

  // Format date for display
  formatDate: (date, format = 'short') => {
    const d = new Date(date);
    if (format === 'short') {
      return d.toLocaleDateString();
    } else if (format === 'long') {
      return d.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return d.toISOString();
  },
};

// Streak calculation utilities
export const streakUtils = {
  // Calculate current and longest streaks from workout history
  calculateStreaks: (workoutHistory) => {
    if (!workoutHistory || workoutHistory.length === 0) {
      return { current: 0, longest: 0 };
    }

    // Get unique workout dates (completed workouts only)
    const workoutDates = workoutHistory
      .filter(workout => workout.completed)
      .map(workout => {
        const date = new Date(workout.date);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
      .filter((date, index, array) => array.indexOf(date) === index) // Remove duplicates
      .sort((a, b) => b - a); // Sort descending (most recent first)

    if (workoutDates.length === 0) {
      return { current: 0, longest: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let expectedDate = new Date();
    expectedDate.setHours(0, 0, 0, 0);

    for (const workoutTime of workoutDates) {
      const workoutDate = new Date(workoutTime);
      const daysDiff = dateUtils.getDaysBetween(expectedDate, workoutDate);

      if (daysDiff === 0) {
        // Workout on expected date
        if (currentStreak === tempStreak) {
          currentStreak++;
        }
        tempStreak++;
      } else if (daysDiff === 1) {
        // Workout on consecutive day
        if (currentStreak === tempStreak) {
          currentStreak++;
        }
        tempStreak++;
      } else {
        // Gap in workouts - streak broken
        if (currentStreak === tempStreak) {
          currentStreak = 0;
        }
        tempStreak = 1;
      }

      longestStreak = Math.max(longestStreak, tempStreak);
      expectedDate = new Date(workoutTime - 24 * 60 * 60 * 1000); // Previous day
    }

    return { current: currentStreak, longest: longestStreak };
  },

  // Get streak status message
  getStreakMessage: (currentStreak) => {
    if (currentStreak === 0) {
      return "Start your streak today!";
    } else if (currentStreak === 1) {
      return "Great start! Keep it going!";
    } else if (currentStreak < 7) {
      return `${currentStreak} days strong! 💪`;
    } else if (currentStreak < 30) {
      return `Amazing ${currentStreak}-day streak! 🔥`;
    } else {
      return `Incredible ${currentStreak}-day streak! You're unstoppable! 🏆`;
    }
  },
};

// Statistics calculation utilities
export const statsUtils = {
  // Calculate weekly statistics
  calculateWeeklyStats: (workoutHistory, weekStart = null) => {
    const start = weekStart || dateUtils.getWeekStart();
    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    const weekWorkouts = workoutHistory.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= start && workoutDate < end && workout.completed;
    });

    return {
      completedWorkouts: weekWorkouts.length,
      totalCalories: weekWorkouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0),
      totalDuration: weekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0),
      averageCalories: weekWorkouts.length > 0 ? 
        Math.round(weekWorkouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0) / weekWorkouts.length) : 0,
      averageDuration: weekWorkouts.length > 0 ? 
        Math.round(weekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / weekWorkouts.length) : 0,
      workoutTypes: statsUtils.getWorkoutTypeBreakdown(weekWorkouts),
    };
  },

  // Calculate monthly statistics
  calculateMonthlyStats: (workoutHistory, monthStart = null) => {
    const start = monthStart || dateUtils.getMonthStart();
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    const monthWorkouts = workoutHistory.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= start && workoutDate < end && workout.completed;
    });

    return {
      completedWorkouts: monthWorkouts.length,
      totalCalories: monthWorkouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0),
      totalDuration: monthWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0),
      averageCalories: monthWorkouts.length > 0 ? 
        Math.round(monthWorkouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0) / monthWorkouts.length) : 0,
      averageDuration: monthWorkouts.length > 0 ? 
        Math.round(monthWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / monthWorkouts.length) : 0,
      workoutTypes: statsUtils.getWorkoutTypeBreakdown(monthWorkouts),
      weeklyAverage: Math.round(monthWorkouts.length / 4),
    };
  },

  // Get workout type breakdown
  getWorkoutTypeBreakdown: (workouts) => {
    const breakdown = {};
    workouts.forEach(workout => {
      const type = workout.type || 'general';
      breakdown[type] = (breakdown[type] || 0) + 1;
    });
    return breakdown;
  },

  // Calculate all-time statistics
  calculateAllTimeStats: (workoutHistory) => {
    const completedWorkouts = workoutHistory.filter(w => w.completed);
    
    if (completedWorkouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalCalories: 0,
        totalDuration: 0,
        averageCalories: 0,
        averageDuration: 0,
        favoriteWorkoutType: null,
        workoutTypes: {},
      };
    }

    const totalCalories = completedWorkouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0);
    const totalDuration = completedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const workoutTypes = statsUtils.getWorkoutTypeBreakdown(completedWorkouts);
    const favoriteWorkoutType = Object.keys(workoutTypes).reduce((a, b) => 
      workoutTypes[a] > workoutTypes[b] ? a : b, null);

    return {
      totalWorkouts: completedWorkouts.length,
      totalCalories,
      totalDuration,
      averageCalories: Math.round(totalCalories / completedWorkouts.length),
      averageDuration: Math.round(totalDuration / completedWorkouts.length),
      favoriteWorkoutType,
      workoutTypes,
    };
  },
};

// Goal progress utilities
export const goalUtils = {
  // Calculate weekly goal progress
  calculateWeeklyProgress: (weeklyStats, goals) => {
    return {
      workouts: {
        completed: weeklyStats.completedWorkouts,
        goal: goals.weeklyWorkouts || 5,
        percentage: goals.weeklyWorkouts > 0 ? 
          Math.min(100, (weeklyStats.completedWorkouts / goals.weeklyWorkouts) * 100) : 0,
        remaining: Math.max(0, (goals.weeklyWorkouts || 5) - weeklyStats.completedWorkouts),
      },
      calories: {
        burned: weeklyStats.totalCalories,
        goal: goals.weeklyCalories || 2000,
        percentage: goals.weeklyCalories > 0 ? 
          Math.min(100, (weeklyStats.totalCalories / goals.weeklyCalories) * 100) : 0,
        remaining: Math.max(0, (goals.weeklyCalories || 2000) - weeklyStats.totalCalories),
      },
    };
  },

  // Calculate weight progress
  calculateWeightProgress: (weightHistory, targetWeight) => {
    if (!weightHistory || weightHistory.length === 0) {
      return {
        current: null,
        target: targetWeight,
        change: 0,
        progress: 0,
        trend: 'stable',
      };
    }

    const sortedHistory = [...weightHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstWeight = sortedHistory[0]?.weight;
    const currentWeight = sortedHistory[sortedHistory.length - 1]?.weight;
    
    let change = 0;
    let progress = 0;
    let trend = 'stable';

    if (firstWeight && currentWeight) {
      change = currentWeight - firstWeight;
      
      // Determine trend from last few entries
      if (sortedHistory.length >= 3) {
        const recent = sortedHistory.slice(-3);
        const recentChange = recent[recent.length - 1].weight - recent[0].weight;
        trend = recentChange > 0.5 ? 'increasing' : recentChange < -0.5 ? 'decreasing' : 'stable';
      }
    }

    if (firstWeight && currentWeight && targetWeight) {
      const totalChange = targetWeight - firstWeight;
      const currentChange = currentWeight - firstWeight;
      progress = totalChange !== 0 ? (currentChange / totalChange) * 100 : 0;
    }

    return {
      current: currentWeight,
      target: targetWeight,
      change: Math.round(change * 10) / 10, // Round to 1 decimal
      progress: Math.min(100, Math.max(0, progress)),
      trend,
    };
  },

  // Get goal achievement status
  getAchievementStatus: (progress) => {
    if (progress >= 100) return 'achieved';
    if (progress >= 80) return 'almost_there';
    if (progress >= 50) return 'on_track';
    if (progress >= 25) return 'getting_started';
    return 'just_started';
  },

  // Get motivational message based on progress
  getMotivationalMessage: (progress, type = 'workout') => {
    const status = goalUtils.getAchievementStatus(progress);
    
    const messages = {
      workout: {
        achieved: "🎉 Goal smashed! You're crushing it!",
        almost_there: "🔥 So close! Just a few more workouts!",
        on_track: "💪 Great progress! Keep up the momentum!",
        getting_started: "🌟 Good start! You're building a great habit!",
        just_started: "🚀 Every journey starts with a single step!",
      },
      calories: {
        achieved: "🔥 Calorie goal destroyed! Amazing work!",
        almost_there: "⚡ Almost there! Push through!",
        on_track: "💯 Burning calories like a champion!",
        getting_started: "🎯 Good progress on your calorie goal!",
        just_started: "🔥 Time to turn up the heat!",
      },
    };

    return messages[type]?.[status] || messages.workout[status];
  },
};

// Data validation utilities
export const validationUtils = {
  // Validate workout data
  validateWorkout: (workout) => {
    const errors = [];
    
    if (!workout.date) errors.push('Date is required');
    if (!workout.duration || workout.duration < 0) errors.push('Valid duration is required');
    if (!workout.calories_burned || workout.calories_burned < 0) errors.push('Valid calories burned is required');
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Validate weight entry
  validateWeight: (weight, unit = 'kg') => {
    const errors = [];
    
    if (!weight || isNaN(weight)) errors.push('Valid weight is required');
    if (weight < 20 || weight > 300) errors.push('Weight must be between 20-300 kg');
    if (!['kg', 'lbs'].includes(unit)) errors.push('Unit must be kg or lbs');
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Validate goals
  validateGoals: (goals) => {
    const errors = [];
    
    if (goals.weeklyWorkouts && (goals.weeklyWorkouts < 1 || goals.weeklyWorkouts > 14)) {
      errors.push('Weekly workouts must be between 1-14');
    }
    if (goals.weeklyCalories && (goals.weeklyCalories < 100 || goals.weeklyCalories > 10000)) {
      errors.push('Weekly calories must be between 100-10000');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Data migration utilities
export const migrationUtils = {
  // Migrate old progress data format to new format
  migrateProgressData: (oldData) => {
    // Handle different versions of data structure
    if (!oldData) return null;
    
    const migrated = {
      workoutHistory: oldData.workoutHistory || [],
      weightHistory: oldData.weightHistory || [],
      goals: oldData.goals || {
        weeklyWorkouts: 5,
        weeklyCalories: 2000,
        targetWeight: null,
        dailyCalories: 300,
      },
      currentWeight: oldData.currentWeight || null,
      totalWorkouts: oldData.totalWorkouts || 0,
      currentStreak: oldData.currentStreak || 0,
      longestStreak: oldData.longestStreak || 0,
      lastUpdated: oldData.lastUpdated || new Date().toISOString(),
    };
    
    return migrated;
  },

  // Check if data needs migration
  needsMigration: (data) => {
    if (!data) return false;
    
    // Check for old format indicators
    const hasOldFormat = !data.lastUpdated || !data.goals || !Array.isArray(data.workoutHistory);
    return hasOldFormat;
  },
};

const progressUtils = {
  dateUtils,
  streakUtils,
  statsUtils,
  goalUtils,
  validationUtils,
  migrationUtils,
};

export default progressUtils;
