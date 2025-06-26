import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { workoutAPI } from '../services/workoutAPI';

const WorkoutContext = createContext();

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

const workoutReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_WORKOUTS_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'FETCH_WORKOUTS_SUCCESS':
      const newWorkouts = action.payload.data || action.payload;
      return {
        ...state,
        loading: false,
        workouts: action.payload.append ? [...state.workouts, ...newWorkouts] : newWorkouts,
        pagination: {
          ...state.pagination,
          ...action.payload.pagination,
        },
        error: null,
        lastFetch: Date.now()
      };

    case 'FETCH_WORKOUTS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case 'FETCH_WORKOUT_DETAIL_START':
      return {
        ...state,
        detailLoading: true,
        detailError: null
      };

    case 'FETCH_WORKOUT_DETAIL_SUCCESS':
      const workout = action.payload;

      const newCache = new Map(state.cache);
      newCache.set(workout._id || workout.id, workout);

      return {
        ...state,
        detailLoading: false,
        currentWorkout: workout,
        cache: newCache,
        detailError: null
      };

    case 'FETCH_WORKOUT_DETAIL_ERROR':
      return {
        ...state,
        detailLoading: false,
        detailError: action.payload
      };

    case 'SET_ACTIVE_FILTER':
      return {
        ...state,
        activeFilter: action.payload
      };

    case 'FETCH_POPULAR_WORKOUTS_SUCCESS':
      return {
        ...state,
        popularWorkouts: action.payload
      };

    case 'LOG_WORKOUT_SUCCESS':
      return {
        ...state,
        workoutHistory: [...state.workoutHistory, action.payload]
      };

    case 'CLEAR_CURRENT_WORKOUT':
      return {
        ...state,
        currentWorkout: null,
        guides: [],
        guidesError: null,
        detailError: null
      };

    case 'FETCH_GUIDES_START':
      return {
        ...state,
        guidesLoading: true,
      };

    case 'FETCH_GUIDES_SUCCESS':
      return {
        ...state,
        guidesLoading: false,
        guides: action.payload,
        guidesError: null,
      };

    case 'FETCH_GUIDES_ERROR':
      return {
        ...state,
        guidesLoading: false,
        guidesError: action.payload,
      };

    case 'FETCH_FAVORITES_SUCCESS':
      return {
        ...state,
        favoritesLoading: false,
        favorites: action.payload,
      };

    case 'TOGGLE_FAVORITE_SUCCESS':
      const { workoutId, isFavorite } = action.payload;
      return {
        ...state,
        favorites: isFavorite
          ? [...state.favorites, workoutId]
          : state.favorites.filter(id => id !== workoutId),
      };

    case 'FETCH_PROGRESS_SUCCESS':
      return {
        ...state,
        trackingLoading: false,
        progressTracking: action.payload,
      };

    case 'LOG_PROGRESS_SUCCESS':
      return {
        ...state,
        progressTracking: [...state.progressTracking, action.payload],
        workoutHistory: [...state.workoutHistory, action.payload],
      };

    case 'RESET_WORKOUTS':
      return {
        ...state,
        workouts: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          hasMore: false,
        },
      };

    default:
      return state;
  }
};

const initialState = {
  workouts: [],
  currentWorkout: null,
  popularWorkouts: [],
  workoutHistory: [],
  activeFilter: 'beginner',
  loading: false,
  detailLoading: false,
  error: null,
  detailError: null,

  guides: [],
  guidesLoading: false,
  guidesError: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
  favorites: [],
  favoritesLoading: false,
  progressTracking: [],
  trackingLoading: false,
  cache: new Map(),
  lastFetch: null,
};

export const WorkoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  const fetchWorkouts = useCallback(async (filters = {}, options = {}) => {
    const { page = 1, limit = 10, append = false } = options;

    dispatch({ type: 'FETCH_WORKOUTS_START' });
    try {

      const backendFilters = {
        name: filters.search || filters.title,
        level: filters.level || filters.difficulty?.toLowerCase(),
        is_recommended: filters.isRecommended,
        is_challenge: filters.isChallenge,
        is_weekly_challenge: filters.isWeeklyChallenge,
        page,
        limit,
        ...filters,
      };

      const result = await workoutAPI.getWorkouts(backendFilters);
      if (result.success) {
        const workouts = Array.isArray(result.data) ? result.data : [];

        const transformedWorkouts = workouts.map(workout => ({

          id: workout._id,

          name: workout.name,
          minutes: workout.minutes,
          cal: workout.cal,
          avatar: workout.avatar,
          level: workout.level,
          excercise: workout.excercise,

          is_recommended: workout.is_recommended,
          is_challenge: workout.is_challenge,
          is_weekly_challenge: workout.is_weekly_challenge,
          number_of_visits: workout.number_of_visits,

          createdAt: workout.createdAt,
          updatedAt: workout.updatedAt,

          description: 'Complete workout session',
          equipment: 'No equipment needed',
        }));

        const payload = {
          data: transformedWorkouts,
          pagination: {
            page,
            limit,
            total: result.total || transformedWorkouts.length,
            hasMore: transformedWorkouts.length === limit,
          },
          append,
        };
        dispatch({ type: 'FETCH_WORKOUTS_SUCCESS', payload });
      } else {
        dispatch({ type: 'FETCH_WORKOUTS_ERROR', payload: result.error });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_WORKOUTS_ERROR', payload: error.message });
    }
  }, []);

  const fetchWorkoutById = useCallback(async (workoutId) => {
    dispatch({ type: 'FETCH_WORKOUT_DETAIL_START' });
    try {
      const result = await workoutAPI.getWorkoutById(workoutId);
      if (result.success) {
        dispatch({ type: 'FETCH_WORKOUT_DETAIL_SUCCESS', payload: result.data });
      } else {
        dispatch({ type: 'FETCH_WORKOUT_DETAIL_ERROR', payload: result.error });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_WORKOUT_DETAIL_ERROR', payload: error.message });
    }
  }, []);

  const fetchPopularWorkouts = useCallback(async () => {
    try {
      const result = await workoutAPI.getPopularWorkouts();
      if (result.success) {
        dispatch({ type: 'FETCH_POPULAR_WORKOUTS_SUCCESS', payload: result.data });
      }
    } catch (error) {
      console.error('Failed to fetch popular workouts:', error);
    }
  }, []);

  const setActiveFilter = useCallback((filter) => {
    dispatch({ type: 'SET_ACTIVE_FILTER', payload: filter });
  }, []);

  const logWorkout = useCallback(async (workoutData) => {
    try {
      const result = await workoutAPI.logWorkout(workoutData);
      if (result.success) {
        dispatch({ type: 'LOG_WORKOUT_SUCCESS', payload: workoutData });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const clearCurrentWorkout = useCallback(() => {
    dispatch({ type: 'CLEAR_CURRENT_WORKOUT' });
  }, []);

  const fetchWorkoutGuides = useCallback(async (workoutId) => {
    if (!workoutId) return [];

    dispatch({ type: 'FETCH_GUIDES_START' });
    try {
      const result = await workoutAPI.getWorkoutGuides(workoutId);
      if (result.success) {

        const guidesData = result.data || {};
        const allGuides = Object.values(guidesData).flat();

        const transformedGuides = allGuides.map(guide => ({
          ...guide,
          id: guide._id || guide.id,
          duration: `${Math.floor(guide.seconds / 60)}:${(guide.seconds % 60).toString().padStart(2, '0')}`,
          reps: guide.repetitions,
          instructions: guide.description,
        }));

        dispatch({ type: 'FETCH_GUIDES_SUCCESS', payload: transformedGuides });
        return transformedGuides;
      } else {
        dispatch({ type: 'FETCH_GUIDES_ERROR', payload: result.error || 'Failed to fetch guides' });
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch workout guides:', error);
      dispatch({ type: 'FETCH_GUIDES_ERROR', payload: error.message });
      return [];
    }
  }, []);

  const fetchFavorites = useCallback(async (userId) => {
    if (!userId) return;

    try {
      const result = await workoutAPI.getFavorites(userId, 'video');
      if (result.success) {

        const favoriteIds = result.data.map(fav => {
          if (fav.lesson_id && typeof fav.lesson_id === 'object') {
            return fav.lesson_id._id || fav.lesson_id.id;
          }
          return fav.lesson_id;
        }).filter(Boolean);

        dispatch({ type: 'FETCH_FAVORITES_SUCCESS', payload: favoriteIds });
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  }, []);

  const toggleFavorite = useCallback(async (workoutId, userId) => {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    try {

      const result = await workoutAPI.toggleFavorite(workoutId, userId, 'video');

      if (result.success) {

        const action = result.action;
        const isFavorite = action === 'added';

        dispatch({
          type: 'TOGGLE_FAVORITE_SUCCESS',
          payload: { workoutId, isFavorite }
        });

        return {
          success: true,
          action,
          workoutId
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to toggle favorite'
        };
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      return {
        success: false,
        error: error.message || 'Failed to toggle favorite'
      };
    }
  }, []);

  const fetchProgress = useCallback(async (userId, filters = {}) => {
    if (!userId) return;

    try {
      const result = await workoutAPI.getProgress(userId, filters);
      if (result.success) {
        dispatch({ type: 'FETCH_PROGRESS_SUCCESS', payload: result.data });
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  }, []);

  const logProgress = useCallback(async (progressData) => {
    try {
      const result = await workoutAPI.logProgress(progressData);
      if (result.success) {
        dispatch({ type: 'LOG_PROGRESS_SUCCESS', payload: result.data });
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Failed to log progress:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const loadMoreWorkouts = useCallback(async (filters = {}) => {

    const currentState = state;
    if (currentState.loading || !currentState.pagination.hasMore) return;

    const nextPage = currentState.pagination.page + 1;
    await fetchWorkouts(filters, {
      page: nextPage,
      limit: currentState.pagination.limit,
      append: true
    });
  }, [fetchWorkouts]);

  const resetWorkouts = useCallback(() => {
    dispatch({ type: 'RESET_WORKOUTS' });
  }, []);

  const getFilteredWorkouts = useCallback((filterType = null) => {
    const filter = filterType || state.activeFilter;
    return state.workouts.filter(workout => workout.level === filter);
  }, [state.workouts, state.activeFilter]);

  const getWorkoutStats = useCallback(() => {
    const totalWorkouts = state.workouts.length;
    const beginnerCount = state.workouts.filter(w => w.level === 'beginner').length;
    const intermediateCount = state.workouts.filter(w => w.level === 'intermediate').length;
    const advancedCount = state.workouts.filter(w => w.level === 'advanced').length;
    const recommendedCount = state.workouts.filter(w => w.is_recommended).length;
    const challengeCount = state.workouts.filter(w => w.is_challenge).length;

    return {
      total: totalWorkouts,
      beginner: beginnerCount,
      intermediate: intermediateCount,
      advanced: advancedCount,
      recommended: recommendedCount,
      challenges: challengeCount,
    };
  }, [state.workouts]);

  const value = {

    workouts: state.workouts,
    currentWorkout: state.currentWorkout,
    popularWorkouts: state.popularWorkouts,
    workoutHistory: state.workoutHistory,
    activeFilter: state.activeFilter,
    loading: state.loading,
    detailLoading: state.detailLoading,
    error: state.error,
    detailError: state.detailError,

    guides: state.guides,
    guidesLoading: state.guidesLoading,
    guidesError: state.guidesError,
    pagination: state.pagination,
    favorites: state.favorites,
    favoritesLoading: state.favoritesLoading,
    progressTracking: state.progressTracking,
    trackingLoading: state.trackingLoading,
    cache: state.cache,
    lastFetch: state.lastFetch,

    fetchWorkouts,
    fetchWorkoutById,
    fetchPopularWorkouts,
    setActiveFilter,
    logWorkout,
    clearCurrentWorkout,

    fetchWorkoutGuides,
    fetchFavorites,
    toggleFavorite,
    fetchProgress,
    logProgress,
    loadMoreWorkouts,
    resetWorkouts,

    getFilteredWorkouts,
    getWorkoutStats,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;
