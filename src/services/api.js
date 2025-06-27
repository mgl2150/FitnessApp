const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1200';
const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

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
    console.log('🌐 API Call:', config.method || 'GET', url);
    const response = await fetch(url, config);
    const data = await response.json();

    console.log('📥 API Response:', response.status, data);

    if (!response.ok || (data.statusCode && data.statusCode >= 400)) {
      console.error('❌ API Error:', data);
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
        statusCode: data.statusCode || response.status,
      };
    }

    // Handle different response structures from backend
    const responseData = data.data !== undefined ? data.data : data;

    return {
      success: true,
      data: responseData,
      message: data.message,
      statusCode: data.statusCode || response.status,
    };
  } catch (error) {
    console.error('❌ API call failed:', error);
    return {
      success: false,
      error: error.message || 'Network error occurred',
      statusCode: 0,
    };
  }
};

export const authAPI = {
  login: async (username, password) => {
    console.log('🔄 API: Login attempt for', username);

    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  signup: async (userData) => {
    console.log('🔄 API: Signup attempt for', userData.username);

    return apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  changePassword: async (userId, passwordData) => {
    console.log('🔄 API: Change password attempt for user', userId);

    return apiCall(`/api/auth/change-password/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
    });
  },

  forgotPassword: async (email) => {
    console.log('🔄 Mock API: Forgot password for', email);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data: { message: 'Reset link sent' } };
  },

  resetPassword: async (token, newPassword) => {
    console.log('🔄 Mock API: Reset password with token', token);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data: { message: 'Password updated' } };
  },

  logout: async () => {
    console.log('🔄 API: Logout');
    return { success: true };
  },
};

export const profileAPI = {
  getProfile: async (userId) => {
    if (userId) {
      console.log('🔄 API: Get profile for user', userId);
      return apiCall(`/api/accounts/${userId}`);
    } else {
      console.log('🔄 Mock API: Get profile');
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockProfile = JSON.parse(localStorage.getItem('profileData') || '{}');
      return { success: true, data: mockProfile };
    }
  },

  updateProfile: async (userId, profileData) => {
    console.log('🔄 API: Update profile for user', userId);
    console.log('📤 Profile data being sent:', profileData);

    const result = await apiCall(`/api/accounts/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });

    console.log('📥 Profile update API result:', result);
    return result;
  },

  saveProfileSetup: async (profileData) => {
    console.log('🔄 Mock API: Save profile setup', profileData);
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, data: { message: 'Profile setup completed' } };
  },
};

export const fitnessAPI = {
  getProgress: async () => {
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
  },

  logWorkout: async (workoutData) => {
    console.log('🔄 Mock API: Log workout', workoutData);
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, data: { message: 'Workout logged successfully' } };
  },

  getWorkoutRecommendations: async () => {
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
  },
};

export const settingsAPI = {
  getSettings: async () => {
    console.log('🔄 Mock API: Get settings');
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    return { success: true, data: mockSettings };
  },

  updateSettings: async (settings) => {
    console.log('🔄 Mock API: Update settings', settings);
    await new Promise(resolve => setTimeout(resolve, 500));

    localStorage.setItem('userSettings', JSON.stringify(settings));
    return { success: true, data: settings };
  },
};

const api = {
  auth: authAPI,
  profile: profileAPI,
  fitness: fitnessAPI,
  settings: settingsAPI,
};

export default api;
