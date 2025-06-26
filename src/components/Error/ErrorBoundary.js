import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // In production, you would send this to your error reporting service
    // Example: Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ onReset, error }) => {
  const bgColor = '#232323';
  const cardBg = '#2D3748';

  return (
    <Box minH="950px" bg={bgColor} display="flex" alignItems="center" justifyContent="center" p={6}>
      <Box maxW="500px" w="full">
        <VStack spacing={6} bg={cardBg} p={8} borderRadius="xl" boxShadow="lg">
          {/* Error Icon */}
          <Box fontSize="4xl">😵</Box>
          
          {/* Error Alert */}
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>Something went wrong!</AlertTitle>
              <AlertDescription>
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </AlertDescription>
            </Box>
          </Alert>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <Box
              w="full"
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              borderRadius="lg"
              p={4}
            >
              <Text fontSize="sm" fontWeight="bold" color="red.700" mb={2}>
                Error Details (Development):
              </Text>
              <Text fontSize="xs" color="red.600" fontFamily="mono" whiteSpace="pre-wrap">
                {error.toString()}
              </Text>
            </Box>
          )}

          {/* Action Buttons */}
          <VStack spacing={3} w="full">
            <Button
              colorScheme="primary"
              size="lg"
              w="full"
              onClick={onReset}
            >
              Try Again
            </Button>
            
            <Button
              variant="outline"
              size="md"
              w="full"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/'}
            >
              Go to Home
            </Button>
          </VStack>

          {/* Help Text */}
          <Text fontSize="sm" color="gray.500" textAlign="center">
            If this problem persists, please contact our support team.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default ErrorBoundary;
