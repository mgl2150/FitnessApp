import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useNutrition } from '../../contexts/NutritionContext';

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

        const currentPath = location.pathname;
        const isOnSetupPage = currentPath === '/nutrition/setup';
        const isOnLoadingPage = currentPath === '/nutrition/loading';

        if (status.hasPlans && isOnSetupPage) {

          console.log('🔄 User has meal plans, redirecting from setup to main interface');
          navigate('/nutrition/meals', { replace: true });
        } else if (!status.hasPlans && !isOnSetupPage && !isOnLoadingPage) {

          console.log('🔄 User has no meal plans, redirecting to setup');
          navigate('/nutrition/setup', { replace: true });
        } else if (requiresSetup && !status.hasPlans) {

          console.log('🔄 Component requires setup, redirecting to setup');
          navigate('/nutrition/setup', { replace: true });
        }

      } catch (error) {
        console.error('❌ Error checking setup status:', error);

        if (!isSetupComplete && location.pathname !== '/nutrition/setup') {
          navigate('/nutrition/setup', { replace: true });
        }
      } finally {
        setIsChecking(false);
      }
    };

    performSetupCheck();
  }, [user?._id, location.pathname, navigate, checkSetupStatus, isSetupComplete, requiresSetup]);

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

  return children;
};

export default NutritionNavigationGuard;
