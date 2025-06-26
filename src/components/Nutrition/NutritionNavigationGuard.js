import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useNutrition } from '../../contexts/NutritionContext';

/**
 * NutritionNavigationGuard - Handles conditional navigation for nutrition feature
 * 
 * Logic:
 * - If user has NO meal plans: Redirect to /nutrition/setup
 * - If user has meal plans: Allow access to requested nutrition route
 * - Shows loading state while checking meal plan status
 */
const NutritionNavigationGuard = ({ children, requiresSetup = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { checkSetupStatus, isSetupComplete } = useNutrition();
  
  const [isChecking, setIsChecking] = useState(true);
  const [setupStatus, setSetupStatus] = useState(null);

  useEffect(() => {
    const performSetupCheck = async () => {
      if (!user?._id) {
        setIsChecking(false);
        return;
      }

      try {
        console.log('🔍 NutritionNavigationGuard: Checking setup status...');
        setIsChecking(true);
        
        const status = await checkSetupStatus();
        setSetupStatus(status);
        
        console.log('📊 Setup status result:', status);
        
        // Navigation logic based on current route and setup status
        const currentPath = location.pathname;
        const isOnSetupPage = currentPath === '/nutrition/setup';
        const isOnLoadingPage = currentPath === '/nutrition/loading';
        
        if (status.hasPlans && isOnSetupPage) {
          // User has meal plans but is on setup page - redirect to main interface
          console.log('🔄 User has meal plans, redirecting from setup to main interface');
          navigate('/nutrition/meals', { replace: true });
        } else if (!status.hasPlans && !isOnSetupPage && !isOnLoadingPage) {
          // User has no meal plans and is not on setup page - redirect to setup
          console.log('🔄 User has no meal plans, redirecting to setup');
          navigate('/nutrition/setup', { replace: true });
        } else if (requiresSetup && !status.hasPlans) {
          // Component requires setup but user hasn't completed it
          console.log('🔄 Component requires setup, redirecting to setup');
          navigate('/nutrition/setup', { replace: true });
        }
        
      } catch (error) {
        console.error('❌ Error checking setup status:', error);
        // On error, fall back to localStorage setup status
        if (!isSetupComplete && location.pathname !== '/nutrition/setup') {
          navigate('/nutrition/setup', { replace: true });
        }
      } finally {
        setIsChecking(false);
      }
    };

    performSetupCheck();
  }, [user?._id, location.pathname, navigate, checkSetupStatus, isSetupComplete, requiresSetup]);

  // Show loading state while checking setup status
  if (isChecking) {
    return (
      <Box
        minH="100vh"
        bg="#232323"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="lg" color="primary.500" thickness="3px" />
          <Text color="white" fontSize="sm">
            Checking your meal plan status...
          </Text>
        </VStack>
      </Box>
    );
  }

  // Render children if all checks pass
  return children;
};

export default NutritionNavigationGuard;
