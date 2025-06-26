// Workout API Service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1200';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    // Handle the API's nested response structure
    // API returns: { statusCode: 200, message: "...", data: [...] }
    if (responseData.statusCode) {
      if (responseData.statusCode >= 200 && responseData.statusCode < 300) {
        return { success: true, data: responseData.data };
      } else {
        return { success: false, error: responseData.message || `API error: ${responseData.statusCode}` };
      }
    }

    // Fallback for direct data responses
    return { success: true, data: responseData };
  } catch (error) {
    console.error('API call failed:', error);
    return { success: false, error: error.message };
  }
};

// Workout API Service - Connected to fitbody-api backend

// Helper function to construct media URLs
const getMediaUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename; // Already a full URL
  return `${API_BASE_URL}/${filename}`;
};

export const workoutAPI = {
  // Get all workouts with optional filtering
  getWorkouts: async (filters = {}) => {
    console.log('🔄 Real API: Get workouts with filters', filters);

    try {
      const queryParams = new URLSearchParams();

      // Map frontend filters to backend query parameters
      if (filters.name || filters.search) {
        queryParams.append('name', filters.name || filters.search);
      }
      if (filters.level) {
        queryParams.append('level', filters.level);
      }
      if (filters.is_recommended !== undefined) {
        queryParams.append('is_recommended', filters.is_recommended.toString());
      }
      if (filters.is_challenge !== undefined) {
        queryParams.append('is_challenge', filters.is_challenge.toString());
      }
      if (filters.is_weekly_challenge !== undefined) {
        queryParams.append('is_weekly_challenge', filters.is_weekly_challenge.toString());
      }

      const endpoint = `/api/lessons${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await apiCall(endpoint);

      if (result.success) {
        // Transform backend data to include media URLs
        const workoutsWithMediaUrls = result.data.map(workout => ({
          ...workout,
          avatar: getMediaUrl(workout.avatar),
        }));

        return { success: true, data: workoutsWithMediaUrls };
      }

      return result;
    } catch (error) {
      console.error('Error fetching workouts:', error);
      return { success: false, error: error.message };
    }
  },

  // Get workout by ID
  getWorkoutById: async (workoutId) => {
    console.log('🔄 Real API: Get workout by ID', workoutId);

    try {
      const result = await apiCall(`/api/lessons/${workoutId}`);

      if (result.success && result.data) {
        // Transform backend data to include media URLs
        const workoutWithMediaUrls = {
          ...result.data,
          avatar: getMediaUrl(result.data.avatar),
        };

        return { success: true, data: workoutWithMediaUrls };
      }

      return result;
    } catch (error) {
      console.error('Error fetching workout by ID:', error);
      return { success: false, error: error.message };
    }
  },

  // Get workout exercises/guides
  getWorkoutGuides: async (workoutId) => {
    console.log('🔄 Real API: Get workout guides', workoutId);

    try {
      const result = await apiCall(`/api/guides/lessons/${workoutId}`);

      if (result.success && result.data) {
        // Transform backend data to include media URLs for videos
        const guidesWithMediaUrls = {};

        Object.keys(result.data).forEach(round => {
          guidesWithMediaUrls[round] = result.data[round].map(guide => ({
            ...guide,
            video: getMediaUrl(guide.video),
          }));
        });

        return { success: true, data: guidesWithMediaUrls };
      }

      return result;
    } catch (error) {
      console.error('Error fetching workout guides:', error);
      return { success: false, error: error.message };
    }
  },

  // Log workout completion
  logWorkout: async (workoutData) => {
    console.log('🔄 Real API: Log workout completion', workoutData);

    try {
      const result = await apiCall('/api/process-trackings', {
        method: 'POST',
        body: JSON.stringify(workoutData),
      });

      return result;
    } catch (error) {
      console.error('Error logging workout:', error);
      return { success: false, error: error.message };
    }
  },

  // Get popular workouts
  getPopularWorkouts: async () => {
    console.log('🔄 Real API: Get popular workouts');

    try {
      // Get all workouts and sort by popularity on frontend since backend doesn't support sort parameter
      const result = await apiCall('/api/lessons');

      if (result.success && Array.isArray(result.data)) {
        const popularWorkouts = result.data
          .sort((a, b) => (b.number_of_visits || 0) - (a.number_of_visits || 0))
          .slice(0, 5)
          .map(workout => ({
            ...workout,
            avatar: getMediaUrl(workout.avatar),
          }));

        return { success: true, data: popularWorkouts };
      }

      return result;
    } catch (error) {
      console.error('Error fetching popular workouts:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user favorites
  getFavorites: async (userId, type = 'video') => {
    console.log('🔄 Real API: Get user workout favorites', userId, type);

    try {
      const result = await apiCall(`/api/favorite/accounts/${userId}?type=${type}`);

      // Handle successful response with data
      if (result.success && result.data && Array.isArray(result.data)) {
        // Transform backend data to include media URLs for populated lesson data
        const favoritesWithMediaUrls = result.data.map(favorite => ({
          ...favorite,
          lesson_id: favorite.lesson_id && typeof favorite.lesson_id === 'object' ? {
            ...favorite.lesson_id,
            avatar: getMediaUrl(favorite.lesson_id.avatar),
          } : favorite.lesson_id,
        }));

        return { success: true, data: favoritesWithMediaUrls };
      }

      // Handle case where user has no favorites (404 response or empty data)
      if (result.success && (!result.data || result.data.length === 0)) {
        return {
          success: true,
          data: [], // Return empty array for no favorites
        };
      }

      // Handle API error responses (like 404 for no favorites)
      if (!result.success && result.error) {
        // If it's a "not found" error, treat as empty favorites list
        if (result.error.includes('404') || result.error.includes('not found') || result.error.includes('Không tìm thấy')) {
          return {
            success: true,
            data: [], // Return empty array for no favorites
          };
        }
      }

      return { success: false, error: result.error || 'Failed to fetch favorites' };
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      return { success: false, error: error.message };
    }
  },

  // Toggle favorite status
  toggleFavorite: async (workoutId, userId, type = 'video') => {
    console.log('🔄 Real API: Toggle workout favorite', workoutId, userId, type);

    try {
      // First, check if the workout is already favorited
      const existingFavorites = await apiCall(`/api/favorite/accounts/${userId}?type=${type}`);

      // Handle the case where user has favorites
      if (existingFavorites.success && existingFavorites.data && Array.isArray(existingFavorites.data)) {
        const existingFavorite = existingFavorites.data.find(fav =>
          (typeof fav.lesson_id === 'string' ? fav.lesson_id : fav.lesson_id?._id) === workoutId
        );

        if (existingFavorite) {
          // Remove favorite
          const result = await apiCall(`/api/favorite/${existingFavorite._id}`, {
            method: 'DELETE'
          });
          return { ...result, action: 'removed' };
        } else {
          // Add favorite
          const result = await apiCall('/api/favorite', {
            method: 'POST',
            body: JSON.stringify({
              account_id: userId,
              lesson_id: workoutId,
              type: type
            })
          });
          return { ...result, action: 'added' };
        }
      }

      // Handle the case where user has no existing favorites (404 response)
      // In this case, we should add the workout as a new favorite
      if (!existingFavorites.success && (
        existingFavorites.error?.includes('404') ||
        existingFavorites.error?.includes('not found') ||
        existingFavorites.error?.includes('Không tìm thấy') ||
        existingFavorites.error?.includes('status: 404')
      )) {
        console.log('🔄 User has no existing favorites, adding new favorite');
        // Add favorite since user has no existing favorites
        const result = await apiCall('/api/favorite', {
          method: 'POST',
          body: JSON.stringify({
            account_id: userId,
            lesson_id: workoutId,
            type: type
          })
        });
        return { ...result, action: 'added' };
      }

      // Handle case where user has empty favorites array
      if (existingFavorites.success && (!existingFavorites.data || existingFavorites.data.length === 0)) {
        console.log('🔄 User has empty favorites, adding new favorite');
        // Add favorite since user has no favorites
        const result = await apiCall('/api/favorite', {
          method: 'POST',
          body: JSON.stringify({
            account_id: userId,
            lesson_id: workoutId,
            type: type
          })
        });
        return { ...result, action: 'added' };
      }

      console.error('🔄 Unexpected favorites response:', existingFavorites);
      return { success: false, error: existingFavorites.error || 'Failed to fetch existing favorites' };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user progress tracking
  getProgress: async (userId, filters = {}) => {
    console.log('🔄 Real API: Get user progress', userId, filters);

    try {
      const queryParams = new URLSearchParams();
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.lesson_id) queryParams.append('lesson_id', filters.lesson_id);

      const endpoint = `/api/process-trackings/${userId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await apiCall(endpoint);

      return result;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return { success: false, error: error.message };
    }
  },

  // Log workout progress
  logProgress: async (progressData) => {
    console.log('🔄 Real API: Log workout progress', progressData);

    try {
      const result = await apiCall('/api/process-trackings', {
        method: 'POST',
        body: JSON.stringify(progressData)
      });

      return result;
    } catch (error) {
      console.error('Error logging workout progress:', error);
      return { success: false, error: error.message };
    }
  },
};

export default workoutAPI;
