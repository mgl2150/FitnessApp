// API Service Layer for FitBody Application
// Connected to real backend running on port 1200

// Use environment variable or fallback to local development server
// Remote API: https://fitbody.codewebdemo.top (currently not accessible)
// Local API: http://localhost:1200 (working)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1200';

// API Configuration
const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${apiConfig.baseURL}${endpoint}`;
  const config = {
    ...apiConfig,
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    },
  };
    
  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // Handle backend response format: {statusCode, message, data}
    if (!response.ok || (data.statusCode && data.statusCode >= 400)) {
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
        statusCode: data.statusCode || response.status,
      };
    }

    return {
      success: true,
      data: data.data , // Extract data field if present
      message: data.message,
      statusCode: data.statusCode || response.status,
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error.message || 'Network error occurred',
      statusCode: 0,
    };
  }
};

// Authentication API calls
export const authAPI = {
  // Login user
  login: async (username, password) => {
    console.log('🔄 API: Login attempt for', username);

    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // Register user
  signup: async (userData) => {
    console.log('🔄 API: Signup attempt for', userData.username);

    // For registration, we need to handle FormData for avatar upload
    // But for simplicity, we'll use JSON for now
    return apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Change password
  changePassword: async (userId, passwordData) => {
    console.log('🔄 API: Change password attempt for user', userId);

    return apiCall(`/api/auth/change-password/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
    });
  },

  // Forgot password (keeping simple mock for now since not implemented in backend)
  forgotPassword: async (email) => {
    console.log('🔄 Mock API: Forgot password for', email);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data: { message: 'Reset link sent' } };
  },

  // Reset password (keeping simple mock for now since not implemented in backend)
  resetPassword: async (token, newPassword) => {
    console.log('🔄 Mock API: Reset password with token', token);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data: { message: 'Password updated' } };
  },

  // Logout (simple client-side logout)
  logout: async () => {
    console.log('🔄 API: Logout');
    return { success: true };
  },
};

// User Profile API calls
export const profileAPI = {
  // Get user profile
  getProfile: async (userId) => {
    if (userId) {
      // REAL IMPLEMENTATION for specific user
      console.log('🔄 API: Get profile for user', userId);
      return apiCall(`/api/accounts/${userId}`);
    } else {
      // MOCK IMPLEMENTATION for backward compatibility
      console.log('🔄 Mock API: Get profile');
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockProfile = JSON.parse(localStorage.getItem('profileData') || '{}');
      return { success: true, data: mockProfile };
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    console.log('🔄 API: Update profile for user', userId, profileData);

    return apiCall(`/api/accounts/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },

  // Save complete profile setup
  saveProfileSetup: async (profileData) => {
    // MOCK IMPLEMENTATION
    console.log('🔄 Mock API: Save profile setup', profileData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, data: { message: 'Profile setup completed' } };
    
    // REAL IMPLEMENTATION:
    /*
    return apiCall('/profile/setup', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
    */
  },
};

// Fitness Data API calls
export const fitnessAPI = {
  // Get user progress data
  getProgress: async () => {
    // MOCK IMPLEMENTATION
    console.log('🔄 Mock API: Get progress data');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockProgress = {
      weeklyGoal: 5,
      completedWorkouts: 3,
      totalWorkouts: 12,
      caloriesBurned: 1250,
      weeklyCalorieGoal: 2000,
      currentStreak: 4,
      longestStreak: 7,
      weightHistory: [
        { date: '2024-01-01', weight: 75 },
        { date: '2024-01-15', weight: 73.5 },
        { date: '2024-01-30', weight: 72.7 },
      ],
    };
    
    return { success: true, data: mockProgress };
    
    // REAL IMPLEMENTATION:
    /*
    return apiCall('/fitness/progress');
    */
  },

  // Log workout
  logWorkout: async (workoutData) => {
    // MOCK IMPLEMENTATION
    console.log('🔄 Mock API: Log workout', workoutData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, data: { message: 'Workout logged successfully' } };
    
    // REAL IMPLEMENTATION:
    /*
    return apiCall('/fitness/workouts', {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
    */
  },

  // Get workout recommendations
  getWorkoutRecommendations: async () => {
    // MOCK IMPLEMENTATION
    console.log('🔄 Mock API: Get workout recommendations');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockRecommendations = [
      {
        id: 1,
        title: 'Full Body Strength',
        duration: 45,
        difficulty: 'Intermediate',
        calories: 300,
        exercises: ['Push-ups', 'Squats', 'Planks'],
      },
      {
        id: 2,
        title: 'Cardio Blast',
        duration: 30,
        difficulty: 'Beginner',
        calories: 250,
        exercises: ['Jumping Jacks', 'High Knees', 'Burpees'],
      },
    ];
    
    return { success: true, data: mockRecommendations };
    
    // REAL IMPLEMENTATION:
    /*
    return apiCall('/fitness/recommendations');
    */
  },
};

// Settings API calls
export const settingsAPI = {
  // Get user settings
  getSettings: async () => {
    // MOCK IMPLEMENTATION
    console.log('🔄 Mock API: Get settings');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    return { success: true, data: mockSettings };
    
    // REAL IMPLEMENTATION:
    /*
    return apiCall('/settings');
    */
  },

  // Update user settings
  updateSettings: async (settings) => {
    // MOCK IMPLEMENTATION
    console.log('🔄 Mock API: Update settings', settings);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.setItem('userSettings', JSON.stringify(settings));
    return { success: true, data: settings };
    
    // REAL IMPLEMENTATION:
    /*
    return apiCall('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    */
  },
};

// Export default API object
const api = {
  auth: authAPI,
  profile: profileAPI,
  fitness: fitnessAPI,
  settings: settingsAPI,
};

export default api;
