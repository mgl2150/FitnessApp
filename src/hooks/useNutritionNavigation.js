import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNutrition } from '../contexts/NutritionContext';

/**
 * Custom hook for nutrition navigation with conditional routing
 * 
 * Eliminates the intermediate /nutrition hub page by routing directly to:
 * - /nutrition/setup for new users (no meal plans)
 * - /nutrition/meals for existing users (have meal plans)
 */
export const useNutritionNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { checkSetupStatus } = useNutrition();

  const navigateToNutrition = useCallback(async () => {
    if (!user?._id) {
      console.warn('⚠️ User not authenticated, cannot navigate to nutrition');
      return;
    }

    try {
      console.log('🧭 Checking meal plan status for direct nutrition navigation...');
      
      // Check user's meal plan status
      const status = await checkSetupStatus();
      
      if (status.hasPlans) {
        console.log('✅ User has meal plans, navigating to /nutrition/meals');
        navigate('/nutrition/meals');
      } else {
        console.log('📝 User has no meal plans, navigating to /nutrition/setup');
        navigate('/nutrition/setup');
      }
      
    } catch (error) {
      console.error('❌ Error checking meal plan status:', error);
      // Fallback to setup page on error
      console.log('🔄 Fallback: navigating to /nutrition/setup');
      navigate('/nutrition/setup');
    }
  }, [user?._id, checkSetupStatus, navigate]);

  return {
    navigateToNutrition,
  };
};

export default useNutritionNavigation;
