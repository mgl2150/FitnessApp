import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNutrition } from '../contexts/NutritionContext';

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

      console.log('🔄 Fallback: navigating to /nutrition/setup');
      navigate('/nutrition/setup');
    }
  }, [user?._id, checkSetupStatus, navigate]);

  return {
    navigateToNutrition,
  };
};

export default useNutritionNavigation;
