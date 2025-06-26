import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { mealAPI } from '../services/mealAPI';
import { useAuth } from './AuthContext';

const NutritionContext = createContext();

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};

// Action types
const NUTRITION_ACTIONS = {
  // Loading states
  FETCH_MEALS_START: 'FETCH_MEALS_START',
  FETCH_MEALS_SUCCESS: 'FETCH_MEALS_SUCCESS',
  FETCH_MEALS_ERROR: 'FETCH_MEALS_ERROR',
  
  FETCH_MEAL_DETAIL_START: 'FETCH_MEAL_DETAIL_START',
  FETCH_MEAL_DETAIL_SUCCESS: 'FETCH_MEAL_DETAIL_SUCCESS',
  FETCH_MEAL_DETAIL_ERROR: 'FETCH_MEAL_DETAIL_ERROR',
  
  FETCH_MEAL_PLANS_START: 'FETCH_MEAL_PLANS_START',
  FETCH_MEAL_PLANS_SUCCESS: 'FETCH_MEAL_PLANS_SUCCESS',
  FETCH_MEAL_PLANS_ERROR: 'FETCH_MEAL_PLANS_ERROR',
  
  // Meal plan actions
  ADD_TO_MEAL_PLAN_START: 'ADD_TO_MEAL_PLAN_START',
  ADD_TO_MEAL_PLAN_SUCCESS: 'ADD_TO_MEAL_PLAN_SUCCESS',
  ADD_TO_MEAL_PLAN_ERROR: 'ADD_TO_MEAL_PLAN_ERROR',
  
  REMOVE_FROM_MEAL_PLAN_START: 'REMOVE_FROM_MEAL_PLAN_START',
  REMOVE_FROM_MEAL_PLAN_SUCCESS: 'REMOVE_FROM_MEAL_PLAN_SUCCESS',
  REMOVE_FROM_MEAL_PLAN_ERROR: 'REMOVE_FROM_MEAL_PLAN_ERROR',
  
  // Filter and search actions
  SET_FILTERS: 'SET_FILTERS',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_ACTIVE_MEAL_TYPE: 'SET_ACTIVE_MEAL_TYPE',
  
  // Pagination
  SET_PAGINATION: 'SET_PAGINATION',
  LOAD_MORE_MEALS: 'LOAD_MORE_MEALS',
  
  // Setup flow
  SET_SETUP_COMPLETE: 'SET_SETUP_COMPLETE',
  SET_SETUP_LOADING: 'SET_SETUP_LOADING',
  
  // Utility actions
  CLEAR_CURRENT_MEAL: 'CLEAR_CURRENT_MEAL',
  RESET_MEALS: 'RESET_MEALS',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer function
const nutritionReducer = (state, action) => {
  switch (action.type) {
    case NUTRITION_ACTIONS.FETCH_MEALS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case NUTRITION_ACTIONS.FETCH_MEALS_SUCCESS:
      return {
        ...state,
        loading: false,
        meals: action.payload.meals,
        pagination: {
          ...state.pagination,
          total: action.payload.total || action.payload.meals.length,
          hasMore: action.payload.hasMore || false,
        },
        lastFetch: Date.now(),
        error: null,
      };

    case NUTRITION_ACTIONS.FETCH_MEALS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case NUTRITION_ACTIONS.LOAD_MORE_MEALS:
      return {
        ...state,
        meals: [...state.meals, ...action.payload.meals],
        pagination: {
          ...state.pagination,
          page: state.pagination.page + 1,
          hasMore: action.payload.hasMore || false,
        },
      };

    case NUTRITION_ACTIONS.FETCH_MEAL_DETAIL_START:
      return {
        ...state,
        detailLoading: true,
        detailError: null,
      };

    case NUTRITION_ACTIONS.FETCH_MEAL_DETAIL_SUCCESS:
      return {
        ...state,
        detailLoading: false,
        currentMeal: action.payload,
        detailError: null,
        // Cache the meal detail
        cache: new Map(state.cache.set(action.payload._id, action.payload)),
      };

    case NUTRITION_ACTIONS.FETCH_MEAL_DETAIL_ERROR:
      return {
        ...state,
        detailLoading: false,
        detailError: action.payload,
      };

    case NUTRITION_ACTIONS.FETCH_MEAL_PLANS_START:
      return {
        ...state,
        planLoading: true,
        planError: null,
      };

    case NUTRITION_ACTIONS.FETCH_MEAL_PLANS_SUCCESS:
      return {
        ...state,
        planLoading: false,
        mealPlans: action.payload,
        planError: null,
      };

    case NUTRITION_ACTIONS.FETCH_MEAL_PLANS_ERROR:
      return {
        ...state,
        planLoading: false,
        planError: action.payload,
      };

    case NUTRITION_ACTIONS.ADD_TO_MEAL_PLAN_SUCCESS:
      return {
        ...state,
        mealPlans: [...state.mealPlans, action.payload],
      };

    case NUTRITION_ACTIONS.REMOVE_FROM_MEAL_PLAN_SUCCESS:
      return {
        ...state,
        mealPlans: state.mealPlans.filter(plan => plan._id !== action.payload),
      };

    case NUTRITION_ACTIONS.SET_FILTERS:
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          ...action.payload,
        },
      };

    case NUTRITION_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case NUTRITION_ACTIONS.SET_ACTIVE_MEAL_TYPE:
      return {
        ...state,
        activeMealType: action.payload,
      };

    case NUTRITION_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };

    case NUTRITION_ACTIONS.SET_SETUP_COMPLETE:
      return {
        ...state,
        isSetupComplete: action.payload,
      };

    case NUTRITION_ACTIONS.SET_SETUP_LOADING:
      return {
        ...state,
        setupLoading: action.payload,
      };

    case NUTRITION_ACTIONS.CLEAR_CURRENT_MEAL:
      return {
        ...state,
        currentMeal: null,
        detailError: null,
      };

    case NUTRITION_ACTIONS.RESET_MEALS:
      return {
        ...state,
        meals: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          hasMore: false,
        },
      };

    case NUTRITION_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
        detailError: null,
        planError: null,
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  meals: [],
  currentMeal: null,
  mealPlans: [],
  featuredMeals: [],
  activeFilters: {
    dietary: 'no-preferences',
    type: 'all',
    cal_min: null,
    cal_max: null,
    minutes: null,
    allergies: '',
  },
  activeMealType: 'breakfast', // For filtering in main interface
  searchQuery: '',
  loading: false,
  detailLoading: false,
  planLoading: false,
  setupLoading: false,
  error: null,
  detailError: null,
  planError: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
  cache: new Map(),
  lastFetch: null,
  isSetupComplete: false, // Track if user has completed initial setup
};

export const NutritionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(nutritionReducer, {
    ...initialState,
    // Initialize setup status from localStorage
    isSetupComplete: JSON.parse(localStorage.getItem('nutritionSetupComplete') || 'false'),
  });
  const { user } = useAuth();

  // Fetch meals with filtering
  const fetchMeals = useCallback(async (filters = {}, resetPagination = true) => {
    try {
      dispatch({ type: NUTRITION_ACTIONS.FETCH_MEALS_START });

      if (resetPagination) {
        dispatch({ type: NUTRITION_ACTIONS.RESET_MEALS });
      }

      const mergedFilters = {
        ...state.activeFilters,
        ...filters,
      };

      const result = await mealAPI.getMeals(mergedFilters);

      if (result.success) {
        dispatch({
          type: NUTRITION_ACTIONS.FETCH_MEALS_SUCCESS,
          payload: {
            meals: result.data,
            total: result.data.length,
            hasMore: false, // Backend doesn't support pagination yet
          },
        });
      } else {
        dispatch({
          type: NUTRITION_ACTIONS.FETCH_MEALS_ERROR,
          payload: result.error || 'Failed to fetch meals',
        });
      }
    } catch (error) {
      dispatch({
        type: NUTRITION_ACTIONS.FETCH_MEALS_ERROR,
        payload: error.message || 'Failed to fetch meals',
      });
    }
  }, [state.activeFilters]);

  // Fetch meal by ID
  const fetchMealById = useCallback(async (mealId) => {
    try {
      // Check cache first
      if (state.cache.has(mealId)) {
        dispatch({
          type: NUTRITION_ACTIONS.FETCH_MEAL_DETAIL_SUCCESS,
          payload: state.cache.get(mealId),
        });
        return;
      }

      dispatch({ type: NUTRITION_ACTIONS.FETCH_MEAL_DETAIL_START });

      const result = await mealAPI.getMealById(mealId);

      if (result.success) {
        dispatch({
          type: NUTRITION_ACTIONS.FETCH_MEAL_DETAIL_SUCCESS,
          payload: result.data,
        });
      } else {
        dispatch({
          type: NUTRITION_ACTIONS.FETCH_MEAL_DETAIL_ERROR,
          payload: result.error || 'Failed to fetch meal details',
        });
      }
    } catch (error) {
      dispatch({
        type: NUTRITION_ACTIONS.FETCH_MEAL_DETAIL_ERROR,
        payload: error.message || 'Failed to fetch meal details',
      });
    }
  }, [state.cache]);

  // Fetch user's meal plans
  const fetchMealPlans = useCallback(async () => {
    if (!user?._id) return;

    try {
      dispatch({ type: NUTRITION_ACTIONS.FETCH_MEAL_PLANS_START });

      const result = await mealAPI.getMealPlans(user._id);

      if (result.success) {
        dispatch({
          type: NUTRITION_ACTIONS.FETCH_MEAL_PLANS_SUCCESS,
          payload: result.data,
        });
      } else {
        dispatch({
          type: NUTRITION_ACTIONS.FETCH_MEAL_PLANS_ERROR,
          payload: result.error || 'Failed to fetch meal plans',
        });
      }
    } catch (error) {
      dispatch({
        type: NUTRITION_ACTIONS.FETCH_MEAL_PLANS_ERROR,
        payload: error.message || 'Failed to fetch meal plans',
      });
    }
  }, [user?._id]);

  // Add meal to user's plan
  const addToMealPlan = useCallback(async (mealId) => {
    if (!user?._id) return { success: false, error: 'User not authenticated' };

    try {
      dispatch({ type: NUTRITION_ACTIONS.ADD_TO_MEAL_PLAN_START });

      const result = await mealAPI.addToMealPlan(mealId, user._id);

      if (result.success) {
        dispatch({
          type: NUTRITION_ACTIONS.ADD_TO_MEAL_PLAN_SUCCESS,
          payload: result.data,
        });
        return { success: true };
      } else {
        dispatch({
          type: NUTRITION_ACTIONS.ADD_TO_MEAL_PLAN_ERROR,
          payload: result.error || 'Failed to add meal to plan',
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to add meal to plan';
      dispatch({
        type: NUTRITION_ACTIONS.ADD_TO_MEAL_PLAN_ERROR,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  }, [user?._id]);

  // Remove meal from user's plan
  const removeFromMealPlan = useCallback(async (mealPlanId) => {
    try {
      dispatch({ type: NUTRITION_ACTIONS.REMOVE_FROM_MEAL_PLAN_START });

      const result = await mealAPI.removeFromMealPlan(mealPlanId);

      if (result.success) {
        dispatch({
          type: NUTRITION_ACTIONS.REMOVE_FROM_MEAL_PLAN_SUCCESS,
          payload: mealPlanId,
        });
        return { success: true };
      } else {
        dispatch({
          type: NUTRITION_ACTIONS.REMOVE_FROM_MEAL_PLAN_ERROR,
          payload: result.error || 'Failed to remove meal from plan',
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to remove meal from plan';
      dispatch({
        type: NUTRITION_ACTIONS.REMOVE_FROM_MEAL_PLAN_ERROR,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({
      type: NUTRITION_ACTIONS.SET_FILTERS,
      payload: filters,
    });
  }, []);

  // Set search query
  const setSearchQuery = useCallback((query) => {
    dispatch({
      type: NUTRITION_ACTIONS.SET_SEARCH_QUERY,
      payload: query,
    });
  }, []);

  // Set active meal type for filtering
  const setActiveMealType = useCallback((mealType) => {
    dispatch({
      type: NUTRITION_ACTIONS.SET_ACTIVE_MEAL_TYPE,
      payload: mealType,
    });
  }, []);

  // Clear current meal
  const clearCurrentMeal = useCallback(() => {
    dispatch({ type: NUTRITION_ACTIONS.CLEAR_CURRENT_MEAL });
  }, []);

  // Set setup complete status
  const setSetupComplete = useCallback((isComplete) => {
    dispatch({
      type: NUTRITION_ACTIONS.SET_SETUP_COMPLETE,
      payload: isComplete,
    });
    // Store in localStorage for persistence
    localStorage.setItem('nutritionSetupComplete', JSON.stringify(isComplete));
  }, []);

  // Check if user has completed setup (based on existing meal plans)
  const checkSetupStatus = useCallback(async () => {
    if (!user?._id) return { hasPlans: false, isSetupComplete: false };

    try {
      console.log('🔍 Checking setup status for user:', user._id);

      const result = await mealAPI.getMealPlans(user._id);

      if (result.success) {
        const hasExistingPlans = result.data.length > 0;
        console.log(`📊 User has ${result.data.length} existing meal plans`);

        // Update setup status based on actual meal plans
        if (hasExistingPlans && !state.isSetupComplete) {
          console.log('✅ User has meal plans - marking setup as complete');
          setSetupComplete(true);
        } else if (!hasExistingPlans && state.isSetupComplete) {
          console.log('❌ User has no meal plans - marking setup as incomplete');
          setSetupComplete(false);
        }

        return {
          hasPlans: hasExistingPlans,
          isSetupComplete: hasExistingPlans,
          mealPlanCount: result.data.length
        };
      } else {
        console.warn('⚠️ Failed to fetch meal plans:', result.error);
        return { hasPlans: false, isSetupComplete: state.isSetupComplete };
      }
    } catch (error) {
      console.warn('❌ Failed to check setup status:', error);
      return { hasPlans: false, isSetupComplete: state.isSetupComplete };
    }
  }, [user?._id, state.isSetupComplete, setSetupComplete]);

  // Setup meal plan with user preferences
  const setupMealPlan = useCallback(async (preferences) => {
    if (!user?._id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      dispatch({ type: NUTRITION_ACTIONS.SET_SETUP_LOADING, payload: true });

      console.log('🔄 Setting up meal plan with preferences:', preferences);

      // Step 1: Set the filters based on user preferences
      dispatch({
        type: NUTRITION_ACTIONS.SET_FILTERS,
        payload: preferences,
      });

      // Step 2: Fetch meals for each selected meal type
      const selectedMeals = [];
      const mealTypeResults = {};

      for (const mealType of preferences.mealTypes) {
        console.log(`🔍 Fetching ${mealType} meals...`);

        const filters = {
          dietary: preferences.dietary,
          type: mealType,
          cal_min: preferences.cal_min,
          cal_max: preferences.cal_max,
          minutes: preferences.minutes,
        };

        const result = await mealAPI.getMeals(filters);

        if (result.success && result.data.length > 0) {
          mealTypeResults[mealType] = result.data;

          // Enhanced meal selection algorithm for better personalization
          const availableMeals = result.data;
          let selectedForType = [];

          if (availableMeals.length <= 3) {
            // If we have 3 or fewer meals, select all of them
            selectedForType = availableMeals;
          } else {
            // Smart selection algorithm for variety and balance
            const sortedByCalories = [...availableMeals].sort((a, b) => a.cal - b.cal);
            const lowCal = sortedByCalories.slice(0, Math.ceil(sortedByCalories.length / 3));
            const midCal = sortedByCalories.slice(Math.ceil(sortedByCalories.length / 3), Math.ceil(2 * sortedByCalories.length / 3));
            const highCal = sortedByCalories.slice(Math.ceil(2 * sortedByCalories.length / 3));

            // Select one from each calorie range for variety
            const selections = [];
            if (lowCal.length > 0) selections.push(lowCal[Math.floor(Math.random() * lowCal.length)]);
            if (midCal.length > 0) selections.push(midCal[Math.floor(Math.random() * midCal.length)]);
            if (highCal.length > 0) selections.push(highCal[Math.floor(Math.random() * highCal.length)]);

            // Add one more random meal if we have space and meals available
            const remaining = availableMeals.filter(meal => !selections.includes(meal));
            if (remaining.length > 0 && selections.length < 4) {
              selections.push(remaining[Math.floor(Math.random() * remaining.length)]);
            }

            selectedForType = selections;
          }

          selectedMeals.push(...selectedForType);
          console.log(`✅ Selected ${selectedForType.length} ${mealType} meals: ${selectedForType.map(m => `${m.name} (${m.cal}cal)`).join(', ')}`);
        } else {
          console.warn(`⚠️ No ${mealType} meals found matching criteria`);
          mealTypeResults[mealType] = [];
        }
      }

      // Step 3: Validate we have enough meals
      if (selectedMeals.length === 0) {
        dispatch({ type: NUTRITION_ACTIONS.SET_SETUP_LOADING, payload: false });

        // Provide specific feedback based on what was found
        const emptyTypes = preferences.mealTypes.filter(type =>
          !mealTypeResults[type] || mealTypeResults[type].length === 0
        );

        let errorMessage = 'No meals found matching your preferences.';
        if (emptyTypes.length > 0) {
          errorMessage += ` No ${emptyTypes.join(', ')} meals found with your dietary and calorie requirements.`;
        }
        errorMessage += ' Try adjusting your dietary preferences, calorie range, or preparation time.';

        return {
          success: false,
          error: errorMessage,
          details: {
            mealTypeResults: Object.fromEntries(
              Object.entries(mealTypeResults).map(([type, meals]) => [type, meals.length])
            ),
            emptyTypes,
          }
        };
      }

      console.log(`📋 Total selected meals: ${selectedMeals.length}`);

      // Step 4: Create meal plans for selected meals
      const mealIds = selectedMeals.map(meal => meal._id);
      const createResult = await mealAPI.createMealPlans(mealIds, user._id);

      if (!createResult.success) {
        dispatch({ type: NUTRITION_ACTIONS.SET_SETUP_LOADING, payload: false });
        return {
          success: false,
          error: createResult.error || 'Failed to create meal plans'
        };
      }

      console.log(`✅ Created ${createResult.data.length} meal plans`);

      // Step 5: Update state with all fetched meals and created meal plans
      const allMeals = Object.values(mealTypeResults).flat();
      dispatch({
        type: NUTRITION_ACTIONS.FETCH_MEALS_SUCCESS,
        payload: {
          meals: allMeals,
          total: allMeals.length,
          hasMore: false,
        },
      });

      // Step 6: Fetch updated meal plans to get populated data
      await fetchMealPlans();

      // Step 7: Mark setup as complete
      setSetupComplete(true);

      dispatch({ type: NUTRITION_ACTIONS.SET_SETUP_LOADING, payload: false });

      return {
        success: true,
        data: {
          mealsFound: allMeals.length,
          mealPlansCreated: createResult.data.length,
          mealTypeBreakdown: Object.fromEntries(
            Object.entries(mealTypeResults).map(([type, meals]) => [type, meals.length])
          ),
        }
      };
    } catch (error) {
      console.error('❌ Setup meal plan error:', error);
      dispatch({ type: NUTRITION_ACTIONS.SET_SETUP_LOADING, payload: false });
      return { success: false, error: error.message || 'Failed to setup meal plan' };
    }
  }, [user?._id, fetchMealPlans, setSetupComplete]);

  // Check setup status on mount and when user changes
  React.useEffect(() => {
    const setupComplete = localStorage.getItem('nutritionSetupComplete');
    if (setupComplete) {
      setSetupComplete(JSON.parse(setupComplete));
    }
  }, [setSetupComplete]);

  // Auto-check setup status when user changes
  React.useEffect(() => {
    if (user?._id) {
      checkSetupStatus();
    }
  }, [user?._id, checkSetupStatus]);

  // Get filtered meals by meal type
  const getFilteredMealsByType = useCallback((mealType) => {
    if (mealType === 'all') return state.meals;
    return state.meals.filter(meal => meal.type === mealType);
  }, [state.meals]);

  // Get meal plan by meal type
  const getMealPlanByType = useCallback((mealType) => {
    if (mealType === 'all') return state.mealPlans;
    return state.mealPlans.filter(plan => plan.meal_id?.type === mealType);
  }, [state.mealPlans]);

  // Clear all errors
  const clearError = useCallback(() => {
    dispatch({ type: NUTRITION_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    // State
    meals: state.meals,
    currentMeal: state.currentMeal,
    mealPlans: state.mealPlans,
    featuredMeals: state.featuredMeals,
    activeFilters: state.activeFilters,
    activeMealType: state.activeMealType,
    searchQuery: state.searchQuery,
    loading: state.loading,
    detailLoading: state.detailLoading,
    planLoading: state.planLoading,
    setupLoading: state.setupLoading,
    error: state.error,
    detailError: state.detailError,
    planError: state.planError,
    pagination: state.pagination,
    cache: state.cache,
    lastFetch: state.lastFetch,
    isSetupComplete: state.isSetupComplete,

    // Actions
    fetchMeals,
    fetchMealById,
    fetchMealPlans,
    addToMealPlan,
    removeFromMealPlan,
    setFilters,
    setSearchQuery,
    setActiveMealType,
    clearCurrentMeal,
    setSetupComplete,
    setupMealPlan,
    checkSetupStatus,
    clearError,

    // Computed values
    getFilteredMealsByType,
    getMealPlanByType,
  };

  return (
    <NutritionContext.Provider value={value}>
      {children}
    </NutritionContext.Provider>
  );
};

export default NutritionContext;
