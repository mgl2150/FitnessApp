import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Card,
  CardBody,
  Image,
  Avatar,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, StarIcon, ChatIcon, ViewIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BottomNavigation from '../../components/Navigation/BottomNavigation';
import AppContainer from '../../components/Layout/AppContainer';
import { usePost } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';

const PostCard = ({ post, onSelect, onToggleLike, isLiked, textColor, cardBg }) => {
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card bg={cardBg} borderRadius="xl" overflow="hidden" mb={4}>
      <CardBody p={4}>
        {}
        <HStack spacing={3} mb={3}>
          <Avatar
            size="sm"
            src={post.author?.avatar}
            name={`${post.author?.firstName || ''} ${post.author?.lastName || ''}`}
          />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              {post.author?.firstName} {post.author?.lastName}
            </Text>
            <Text fontSize="xs" color="gray.400">
              @{post.author?.username} • {formatTimeAgo(post.createdAt)}
            </Text>
          </VStack>
        </HStack>

        {}
        <Box mb={3} cursor="pointer" onClick={() => onSelect(post.id)}>
          <Text color={textColor} mb={3} lineHeight="1.5">
            {post.content}
          </Text>

          {}
          {post.image && (
            <Image
              src={post.image}
              alt="Post image"
              w="full"
              maxH="300px"
              objectFit="cover"
              borderRadius="lg"
              mb={3}
            />
          )}
        </Box>

        {}
        <HStack justify="space-between" pt={2}>
          <HStack spacing={4}>
            {}
            <HStack spacing={1}>
              <IconButton
                icon={<StarIcon />}
                size="sm"
                variant="ghost"
                color={isLiked ? 'yellow.400' : 'gray.400'}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(post.id, isLiked);
                }}
                _hover={{ color: 'yellow.400' }}
              />
              <Text fontSize="sm" color="gray.400">
                {post.likes || 0}
              </Text>
            </HStack>

            {}
            <HStack spacing={1}>
              <IconButton
                icon={<ChatIcon />}
                size="sm"
                variant="ghost"
                color="gray.400"
                onClick={() => onSelect(post.id)}
                _hover={{ color: 'blue.400' }}
              />
              <Text fontSize="sm" color="gray.400">
                {post.commentCount || 0}
              </Text>
            </HStack>

            {}
            <HStack spacing={1}>
              <ViewIcon color="gray.400" w={4} h={4} />
              <Text fontSize="sm" color="gray.400">
                {post.views || 0}
              </Text>
            </HStack>
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

const CommunityFeedScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const {
    posts,
    loading,
    error,
    fetchPosts,
    toggleLike,
    incrementView,
    loadMorePosts,
    pagination,
    lastFetch,
  } = usePost();

  const [likedPosts, setLikedPosts] = useState(new Set());
  const textColor = 'white';
  const cardBg = '#2D3748';

  useEffect(() => {
    const shouldRefresh = !lastFetch || (Date.now() - lastFetch > 30000);

    if (location.pathname === '/community' && (shouldRefresh || posts.length === 0)) {
      fetchPosts();
    }
  }, [location.pathname, fetchPosts, lastFetch, posts.length]);

  useEffect(() => {
    const handlePopState = () => {
      fetchPosts();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [fetchPosts]);

  const handlePostSelect = async (postId) => {

    await incrementView(postId);
    navigate(`/community/post/${postId}`);
  };

  const handleToggleLike = async (postId, currentLikeStatus) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to like posts',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const result = await toggleLike(postId, currentLikeStatus);
      if (result.success) {

        const newLikedPosts = new Set(likedPosts);
        if (currentLikeStatus) {
          newLikedPosts.delete(postId);
        } else {
          newLikedPosts.add(postId);
        }
        setLikedPosts(newLikedPosts);

        toast({
          title: currentLikeStatus ? 'Post unliked' : 'Post liked',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to create posts',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    navigate('/community/create');
  };

  const handleLoadMore = () => {
    if (!loading && pagination.hasMore) {
      loadMorePosts();
    }
  };

  return (
    <AppContainer>
      <VStack spacing={0} align="stretch" h="full">
        {}
        <HStack justify="space-between" p={4} borderBottom="1px solid" borderColor="gray.600">
          <HStack spacing={3}>
            <IconButton
              icon={<ArrowBackIcon />}
              variant="ghost"
              color={textColor}
              onClick={() => navigate('/home')}
            />
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Community
            </Text>
          </HStack>
          <HStack spacing={2}>
            <IconButton
              icon={<AddIcon />}
              colorScheme="blue"
              size="sm"
              onClick={handleCreatePost}
            />
          </HStack>
        </HStack>

        {}
        <Box flex={1} overflowY="auto" p={4} pb="100px">
          {loading && posts.length === 0 ? (
            <Box display="flex" justifyContent="center" py={8}>
              <Spinner size="lg" color="blue.500" />
            </Box>
          ) : error ? (
            <Alert status="error" bg="red.900" color="white" borderRadius="xl">
              <AlertIcon />
              {error}
            </Alert>
          ) : posts.length === 0 ? (
            <VStack spacing={4} py={8} textAlign="center">
              <Text color="gray.400" fontSize="lg">
                No posts yet
              </Text>
              <Text color="gray.500" fontSize="sm">
                Be the first to share something with the community!
              </Text>
              <Button colorScheme="blue" onClick={handleCreatePost}>
                Create First Post
              </Button>
            </VStack>
          ) : (
            <VStack spacing={0} align="stretch">
              {posts.map((post) => (
                <PostCard
                  key={post.id || post._id}
                  post={post}
                  onSelect={handlePostSelect}
                  onToggleLike={handleToggleLike}
                  isLiked={likedPosts.has(post.id || post._id)}
                  textColor={textColor}
                  cardBg={cardBg}
                />
              ))}

              {}
              {pagination.hasMore && (
                <Box textAlign="center" py={4}>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    onClick={handleLoadMore}
                    isLoading={loading}
                    loadingText="Loading more..."
                  >
                    Load More Posts
                  </Button>
                </Box>
              )}

              {}
              {loading && posts.length > 0 && (
                <Box display="flex" justifyContent="center" py={4}>
                  <Spinner size="md" color="blue.500" />
                </Box>
              )}
            </VStack>
          )}
        </Box>
      </VStack>

      <BottomNavigation />
    </AppContainer>
  );
};

export default CommunityFeedScreen;
