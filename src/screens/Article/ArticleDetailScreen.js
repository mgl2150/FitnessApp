import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Image,
  Badge,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon, StarIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';
import { useArticle } from '../../contexts/ArticleContext';
import { useAuth } from '../../contexts/AuthContext';

const ArticleDetailScreen = () => {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const {
    currentArticle,
    detailLoading,
    detailError,
    fetchArticleById,
    clearCurrentArticle,
    // Enhanced context methods
    favorites,
    favoritesLoading,
    fetchFavorites,
    toggleFavorite
  } = useArticle();

  const textColor = 'white';
  const cardBg = '#2D3748';

  useEffect(() => {
    if (articleId) {
      fetchArticleById(articleId);
    }
    console.log(currentArticle);
    
    
    // Fetch user favorites if authenticated
    if (isAuthenticated && user?._id) {
      fetchFavorites(user._id);
    }

    // Cleanup when component unmounts
    return () => {
      clearCurrentArticle();
    };
  }, [articleId, fetchArticleById, clearCurrentArticle, fetchFavorites, isAuthenticated, user]);

  const handleBackNavigation = () => {
    navigate(-1); // Go back to previous page
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !user?._id) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add articles to favorites',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!currentArticle) return;

    try {
      await toggleFavorite(currentArticle.id || currentArticle._id, user._id);
      const isFavorite = favorites.includes(currentArticle.id || currentArticle._id);
      toast({
        title: 'Success',
        description: isFavorite
          ? 'Article removed from favorites'
          : 'Article added to favorites',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderContent = (content) => {
    // Simple markdown-like rendering for content
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <Text key={index} fontSize="2xl" fontWeight="bold" color={textColor} mt={6} mb={4}>
            {line.substring(2)}
          </Text>
        );
      } else if (line.startsWith('## ')) {
        return (
          <Text key={index} fontSize="xl" fontWeight="bold" color={textColor} mt={5} mb={3}>
            {line.substring(3)}
          </Text>
        );
      } else if (line.startsWith('### ')) {
        return (
          <Text key={index} fontSize="lg" fontWeight="semibold" color={textColor} mt={4} mb={2}>
            {line.substring(4)}
          </Text>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <Text key={index} fontSize="md" fontWeight="bold" color={textColor} mb={2}>
            {line.substring(2, line.length - 2)}
          </Text>
        );
      } else if (line.trim() === '') {
        return <Box key={index} h={2} />;
      } else if (line.startsWith('- ')) {
        return (
          <Text key={index} fontSize="md" color="gray.300" mb={1} pl={4}>
            • {line.substring(2)}
          </Text>
        );
      } else {
        return (
          <Text key={index} fontSize="md" color="gray.300" mb={3} lineHeight="1.6">
            {line}
          </Text>
        );
      }
    });
  };

  if (detailLoading) {
    return (
      <AppContainer hasBottomNav={true}>
        <Box bg="#232323" px={6} py={4} pt={8}>
          <HStack justify="space-between" align="center">
            <IconButton
              icon={<ArrowBackIcon />}
              variant="ghost"
              size="lg"
              onClick={handleBackNavigation}
              aria-label="Go back"
              color={textColor}
            />
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Article
            </Text>
            <Box w="40px" />
          </HStack>
        </Box>
        <Box p={6} display="flex" justifyContent="center" alignItems="center" minH="400px">
          <Spinner size="xl" color="primary.500" />
        </Box>
        <BottomNavigation />
      </AppContainer>
    );
  }

  if (detailError) {
    return (
      <AppContainer hasBottomNav={true}>
        <Box bg="#232323" px={6} py={4} pt={8}>
          <HStack justify="space-between" align="center">
            <IconButton
              icon={<ArrowBackIcon />}
              variant="ghost"
              size="lg"
              onClick={handleBackNavigation}
              aria-label="Go back"
              color={textColor}
            />
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Article
            </Text>
            <Box w="40px" />
          </HStack>
        </Box>
        <Box p={6}>
          <Alert status="error" bg="red.900" color="white">
            <AlertIcon />
            {detailError}
          </Alert>
        </Box>
        <BottomNavigation />
      </AppContainer>
    );
  }

  if (!currentArticle) {
    return (
      <AppContainer hasBottomNav={true}>
        <Box bg="#232323" px={6} py={4} pt={8}>
          <HStack justify="space-between" align="center">
            <IconButton
              icon={<ArrowBackIcon />}
              variant="ghost"
              size="lg"
              onClick={handleBackNavigation}
              aria-label="Go back"
              color={textColor}
            />
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Article
            </Text>
            <Box w="40px" />
          </HStack>
        </Box>
        <Box p={6}>
          <Alert status="info" bg="blue.900" color="white">
            <AlertIcon />
            Article not found
          </Alert>
        </Box>
        <BottomNavigation />
      </AppContainer>
    );
  }

  return (
    <AppContainer hasBottomNav={true}>
      {/* Header */}
      <Box bg="#232323" px={6} py={4} pt={8}>
        <HStack justify="space-between" align="center">
          <IconButton
            icon={<ArrowBackIcon />}
            variant="ghost"
            size="lg"
            onClick={handleBackNavigation}
            aria-label="Go back"
            color={textColor}
          />
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Article
          </Text>
          
          {isAuthenticated && (
            <IconButton
              icon={<StarIcon />}
              variant="ghost"
              size="lg"
              onClick={handleToggleFavorite}
              isLoading={favoritesLoading}
              color={currentArticle && favorites.includes(currentArticle.id || currentArticle._id) ? "yellow.400" : textColor}
              aria-label={currentArticle && favorites.includes(currentArticle.id || currentArticle._id) ? "Remove from favorites" : "Add to favorites"}
            />
          )}
        </HStack>
      </Box>

      {/* Main Content */}
      <Box p={6} pb={24}>
        <VStack spacing={6} w="full" align="start">
          {/* Hero Image */}
          <Box position="relative" w="full" borderRadius="xl" overflow="hidden">
            <Image
              src={currentArticle.image || '/api/placeholder/300/200'}
              alt={currentArticle.title || currentArticle.name}
              w="full"
              h="250px"
              objectFit="cover"
            />
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.300"
            />
            {currentArticle.category && (
              <Badge
                position="absolute"
                top={4}
                left={4}
                bg="primary.500"
                color="white"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="md"
              >
                {currentArticle.category}
              </Badge>
            )}
            {currentArticle.isFeatured && (
              <Box
                position="absolute"
                top={4}
                right={4}
                w="10"
                h="10"
                bg="yellow.500"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="lg" color="white">⭐</Text>
              </Box>
            )}
          </Box>

          {/* Article Header */}
          <VStack align="start" spacing={4} w="full">
            <Text fontSize="2xl" fontWeight="bold" color={textColor} lineHeight="1.3">
              {currentArticle.title || currentArticle.name}
            </Text>
            
            <HStack justify="space-between" w="full" wrap="wrap">
              <VStack align="start" spacing={1}>
                {currentArticle.author && (
                  <Text fontSize="md" color="gray.300">
                    By {currentArticle.author}
                  </Text>
                )}
                {currentArticle.publishedDate && (
                  <Text fontSize="sm" color="gray.400">
                    {formatDate(currentArticle.publishedDate)}
                  </Text>
                )}
              </VStack>

              <HStack spacing={4}>
                {currentArticle.readTime && (
                  <HStack spacing={1}>
                    <Text fontSize="sm" color="gray.400">📖</Text>
                    <Text fontSize="sm" color="gray.400">{currentArticle.readTime}</Text>
                  </HStack>
                )}
                {currentArticle.views && (
                  <HStack spacing={1}>
                    <Text fontSize="sm" color="gray.400">👁</Text>
                    <Text fontSize="sm" color="gray.400">{currentArticle.views}</Text>
                  </HStack>
                )}
                {currentArticle.likes && (
                  <HStack spacing={1}>
                    <Text fontSize="sm" color="gray.400">❤️</Text>
                    <Text fontSize="sm" color="gray.400">{currentArticle.likes}</Text>
                  </HStack>
                )}
              </HStack>
            </HStack>
          </VStack>

          <Divider borderColor="gray.600" />

          {/* Article Content */}
          <Box w="full">
            {renderContent(currentArticle.content)}
          </Box>

          <Divider borderColor="gray.600" />

          {/* Tags */}
          {currentArticle.tags && currentArticle.tags.length > 0 && (
            <Box w="full">
              <Text fontSize="md" fontWeight="semibold" color={textColor} mb={3}>
                Tags
              </Text>
              <HStack spacing={2} wrap="wrap">
                {currentArticle.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    bg="gray.700"
                    color="gray.300"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    #{tag}
                  </Badge>
                ))}
              </HStack>
            </Box>
          )}

          {/* Action Buttons */}
          <HStack spacing={4} w="full" pt={4}>
            <Button
              flex={1}
              bg="primary.500"
              color="white"
              _hover={{ bg: 'primary.600' }}
              borderRadius="xl"
              onClick={handleToggleFavorite}
              isDisabled={!isAuthenticated}
            >
              {currentArticle && favorites.includes(currentArticle.id || currentArticle._id) ? '⭐ Favorited' : '⭐ Add to Favorites'}
            </Button>
          </HStack>
        </VStack>
      </Box>

      <BottomNavigation />
    </AppContainer>
  );
};

export default ArticleDetailScreen;
