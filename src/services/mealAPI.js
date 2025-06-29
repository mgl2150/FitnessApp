const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1200';

const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: data,
      statusCode: response.status,
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

const constructMediaUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;

  return `${API_BASE_URL}/${filename}`;
};

const transformMealData = (meal) => {
  return {
    ...meal,
    avatar: constructMediaUrl(meal.avatar),
    video: constructMediaUrl(meal.video),
  };
};

export const mealAPI = {

  getMeals: async (filters = {}) => {
    try {
      console.log('🔄 API: Get meals with filters', filters);

      const queryParams = new URLSearchParams();

      if (filters.dietary && filters.dietary !== 'no-preferences') {
        queryParams.append('dietary', filters.dietary);
      }
      if (filters.type && filters.type !== 'all') {
        queryParams.append('type', filters.type);
      }
      if (filters.cal_min) queryParams.append('cal_min', filters.cal_min);
      if (filters.cal_max) queryParams.append('cal_max', filters.cal_max);
      if (filters.minutes) queryParams.append('minutes', filters.minutes);
      if (filters.number_of_servings) queryParams.append('number_of_servings', filters.number_of_servings);

      const endpoint = `/api/meals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await apiCall(endpoint);

      if (result.success) {

        const transformedMeals = result.data.map(transformMealData);
        return { success: true, data: transformedMeals };
      }

      return result;
    } catch (error) {
      console.error('❌ Error fetching meals:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch meals',
      };
    }
  },

  getMealById: async (mealId) => {
    try {
      console.log('🔄 API: Get meal by ID', mealId);

      const result = await apiCall(`/api/meals/${mealId}`);

      if (result.success) {

        const transformedMeal = transformMealData(result.data);
        return { success: true, data: transformedMeal };
      }

      return result;
    } catch (error) {
      console.error('❌ Error fetching meal details:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch meal details',
      };
    }
  },

  getMealPlans: async (accountId) => {
    try {
      console.log('🔄 API: Get meal plans for account', accountId);

      const result = await apiCall(`/api/meal-plans/accounts/${accountId}`);

      if (result.success) {

        const transformedMealPlans = result.data.map(plan => ({
          ...plan,
          meal_id: plan.meal_id ? transformMealData(plan.meal_id) : null,
        }));
        return { success: true, data: transformedMealPlans };
      }

      return result;
    } catch (error) {
      console.error('❌ Error fetching meal plans:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch meal plans',
      };
    }
  },

  addToMealPlan: async (mealId, accountId) => {
    try {
      console.log('🔄 API: Add meal to plan', { mealId, accountId });

      const result = await apiCall('/api/meal-plans', {
        method: 'POST',
        body: JSON.stringify({ meal_id: mealId, account_id: accountId }),
      });

      if (result.success) {

        const transformedMealPlan = {
          ...result.data,
          meal_id: result.data.meal_id ? transformMealData(result.data.meal_id) : null,
        };
        return { success: true, data: transformedMealPlan };
      }

      return result;
    } catch (error) {
      console.error('❌ Error adding meal to plan:', error);
      return {
        success: false,
        error: error.message || 'Failed to add meal to plan',
      };
    }
  },

  removeFromMealPlan: async (mealPlanId) => {
    try {
      console.log('🔄 API: Remove from meal plan', mealPlanId);

      const result = await apiCall(`/api/meal-plans/${mealPlanId}`, {
        method: 'DELETE',
      });

      return result;
    } catch (error) {
      console.error('❌ Error removing meal from plan:', error);
      return {
        success: false,
        error: error.message || 'Failed to remove meal from plan',
      };
    }
  },

  createMealPlans: async (mealIds, accountId) => {
    try {
      console.log('🔄 API: Create multiple meal plans', { mealIds, accountId });

      const results = [];
      const errors = [];

      for (const mealId of mealIds) {
        const result = await apiCall('/api/meal-plans', {
          method: 'POST',
          body: JSON.stringify({ meal_id: mealId, account_id: accountId }),
        });

        if (result.success) {
          results.push(result.data);
        } else {
          errors.push({ mealId, error: result.error });
        }
      }

      if (errors.length > 0) {
        console.warn('⚠️ Some meal plans failed to create:', errors);
      }

      return {
        success: results.length > 0,
        data: results,
        errors: errors.length > 0 ? errors : null,
        message: `Created ${results.length} meal plans${errors.length > 0 ? ` (${errors.length} failed)` : ''}`,
      };
    } catch (error) {
      console.error('❌ Error creating meal plans:', error);
      return {
        success: false,
        error: error.message || 'Failed to create meal plans',
      };
    }
  },
};
