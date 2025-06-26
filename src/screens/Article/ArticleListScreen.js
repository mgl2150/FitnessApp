import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Card,
  CardBody,
  Image,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Button,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon, SearchIcon, StarIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';
import { useArticle } from '../../contexts/ArticleContext';
import { useAuth } from '../../contexts/AuthContext';

const ArticleCard = ({ article, onSelect, cardBg, textColor, onToggleFavorite, isFavorite, isAuthenticated }) => (
  <Card
    bg={cardBg}
    cursor="pointer"
    _hover={{ transform: 'scale(1.02)' }}
    transition="all 0.2s"
    borderRadius="xl"
    overflow="hidden"
    w="full"
  >
    <CardBody p={0}>
      <Box position="relative" onClick={() => onSelect(article.id)}>
        <Image
          src={article.image || '/api/placeholder/300/200'}
          alt={article.title || article.name}
          w="full"
          h="180px"
          objectFit="cover"
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.400"
        />
        {article.category && (
          <Badge
            position="absolute"
            top={3}
            left={3}
            bg="primary.500"
            color="white"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="md"
          >
            {article.category}
          </Badge>
        )}
        {article.isFeatured && (
          <Box
            position="absolute"
            top={3}
            right={12}
            w="8"
            h="8"
            bg="yellow.500"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="sm" color="white">⭐</Text>
          </Box>
        )}
        {}
        {isAuthenticated && (
          <IconButton
            position="absolute"
            top={3}
            right={3}
            icon={<StarIcon />}
            size="sm"
            variant="ghost"
            color={isFavorite ? "yellow.400" : "white"}
            bg={isFavorite ? "blackAlpha.600" : "blackAlpha.400"}
            _hover={{ bg: "blackAlpha.700" }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(article.id || article._id);
            }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          />
        )}
      </Box>

      <Box p={4}>
        <VStack align="start" spacing={3}>
          <Text fontSize="md" fontWeight="bold" color={textColor} noOfLines={2} lineHeight="1.3">
            {article.title || article.name}
          </Text>
          <Text fontSize="sm" color="gray.400" noOfLines={2} lineHeight="1.4">
            {article.excerpt || article.description}
          </Text>
          <HStack justify="space-between" w="full">
            <VStack align="start" spacing={1}>
              {article.author && (
                <Text fontSize="xs" color="gray.500">
                  By {article.author}
                </Text>
              )}
              <HStack spacing={3}>
                {article.readTime && (
                  <HStack spacing={1}>
                    <Text fontSize="xs" color="gray.400">📖</Text>
                    <Text fontSize="xs" color="gray.400">{article.readTime}</Text>
                  </HStack>
                )}
                {article.views && (
                  <HStack spacing={1}>
                    <Text fontSize="xs" color="gray.400">👁</Text>
                    <Text fontSize="xs" color="gray.400">{article.views}</Text>
                  </HStack>
                )}
                {article.likes && (
                  <HStack spacing={1}>
                    <Text fontSize="xs" color="gray.400">❤️</Text>
                    <Text fontSize="xs" color="gray.400">{article.likes}</Text>
                  </HStack>
                )}
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </Box>
    </CardBody>
  </Card>
);

const ArticleListScreen = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const {
    articles,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchArticles,

    pagination,
    favorites,
    fetchFavorites,
    toggleFavorite,
    loadMoreArticles,
    resetArticles
  } = useArticle();

  const textColor = 'white';
  const cardBg = '#2D3748';

  useEffect(() => {

    console.log('ArticleListScreen: Initial data fetch');
    fetchArticles();

    if (isAuthenticated && user?._id) {
      fetchFavorites(user._id);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchFavorites(user._id);
    }
  }, [isAuthenticated, user?._id, fetchFavorites]);

  const handleToggleFavorite = async (articleId) => {
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

    try {
      await toggleFavorite(articleId, user._id);
      toast({
        title: 'Success',
        description: favorites.includes(articleId)
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

  const handleLoadMore = () => {
    const filters = { search: searchQuery };

    loadMoreArticles(filters);
  };

  const handleBackNavigation = () => {
    navigate('/home');
  };

  const handleArticleSelect = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    resetArticles();
    const filters = { search: query };

    fetchArticles(filters);
  };

  return (
    <AppContainer hasBottomNav={true}>
      {}
      <Box bg="#232323" px={6} py={4} pt={8}>
        <HStack justify="space-between" align="center" mb={4}>
          <IconButton
            icon={<ArrowBackIcon />}
            variant="ghost"
            size="lg"
            onClick={handleBackNavigation}
            aria-label="Go back"
            color={textColor}
          />
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Articles & Tips
          </Text>
          <Box w="40px" />
        </HStack>

        {}
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearchChange}
            bg={cardBg}
            border="none"
            color={textColor}
            _placeholder={{ color: 'gray.400' }}
            _focus={{ bg: cardBg, boxShadow: '0 0 0 1px #4299E1' }}
          />
        </InputGroup>
      </Box>

      {}
      <Box p={6} pb={24}>
        <VStack spacing={6} w="full">
          {}
          <Box w="full">
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              All Articles
            </Text>

            {loading ? (
              <Box display="flex" justifyContent="center" py={8}>
                <Spinner size="lg" color="primary.500" />
              </Box>
            ) : error ? (
              <Alert status="error" bg="red.900" color="white" borderRadius="xl">
                <AlertIcon />
                {error}
              </Alert>
            ) : (
              <VStack spacing={4} w="full">
                <SimpleGrid columns={1} spacing={4} w="full">
                  {articles.map((article) => (
                    <ArticleCard
                      key={article.id || article._id}
                      article={article}
                      onSelect={handleArticleSelect}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favorites.includes(article.id || article._id)}
                      isAuthenticated={isAuthenticated}
                      cardBg={cardBg}
                      textColor={textColor}
                    />
                  ))}
                </SimpleGrid>

                {}
                {pagination.hasMore && (
                  <Button
                    onClick={handleLoadMore}
                    isLoading={loading}
                    loadingText="Loading more..."
                    variant="outline"
                    colorScheme="primary"
                    size="md"
                    w="full"
                    maxW="200px"
                  >
                    Load More Articles
                  </Button>
                )}
              </VStack>
            )}
          </Box>
        </VStack>
      </Box>

      <BottomNavigation />
    </AppContainer>
  );
};

export default ArticleListScreen;
