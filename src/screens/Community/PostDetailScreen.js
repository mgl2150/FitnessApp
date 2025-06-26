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
  Textarea,
  Divider,
} from '@chakra-ui/react';
import { ArrowBackIcon, StarIcon, ChatIcon, ViewIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AppContainer from '../../components/Layout/AppContainer';
import { usePost } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';

const CommentCard = ({ comment, textColor, cardBg }) => {
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
    <Card bg={cardBg} borderRadius="lg" mb={3}>
      <CardBody p={3}>
        <HStack spacing={3} align="start">
          <Avatar
            size="sm"
            src={comment.author?.avatar}
            name={`${comment.author?.firstName || ''} ${comment.author?.lastName || ''}`}
          />
          <VStack align="start" spacing={1} flex={1}>
            <HStack spacing={2}>
              <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                {comment.author?.firstName} {comment.author?.lastName}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {formatTimeAgo(comment.createdAt)}
              </Text>
            </HStack>
            <Text fontSize="sm" color={textColor} lineHeight="1.4">
              {comment.content}
            </Text>
            {comment.image && (
              <Image
                src={comment.image}
                alt="Comment image"
                maxW="200px"
                maxH="150px"
                objectFit="cover"
                borderRadius="md"
                mt={2}
              />
            )}
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

const PostDetailScreen = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const {
    currentPost,
    comments,
    detailLoading,
    commentsLoading,
    detailError,
    commentsError,
    fetchPostById,
    fetchComments,
    createComment,
    toggleLike,
    clearCurrentPost,
  } = usePost();

  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const textColor = 'white';
  const cardBg = '#2D3748';

  useEffect(() => {
    if (postId) {
      fetchPostById(postId);
      fetchComments(postId);
    }

    return () => {
      clearCurrentPost();
    };
  }, [postId, fetchPostById, fetchComments, clearCurrentPost]);

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

  const handleToggleLike = async () => {
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
      const result = await toggleLike(postId, isLiked);
      if (result.success) {
        setIsLiked(!isLiked);
        toast({
          title: isLiked ? 'Post unliked' : 'Post liked',
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

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to comment',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: 'Comment Required',
        description: 'Please enter a comment',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmittingComment(true);
    try {
      const commentData = {
        content: commentText.trim(),
        post_id: postId,
        account_id: user._id,
      };

      const result = await createComment(commentData);
      if (result.success) {
        setCommentText('');
        toast({
          title: 'Comment Added',
          description: 'Your comment has been posted',
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
        description: 'Failed to post comment',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (detailLoading) {
    return (
      <AppContainer>
        <Box display="flex" justifyContent="center" alignItems="center" h="full">
          <Spinner size="lg" color="blue.500" />
        </Box>
      </AppContainer>
    );
  }

  if (detailError) {
    return (
      <AppContainer>
        <VStack spacing={4} p={4}>
          <Alert status="error" bg="red.900" color="white" borderRadius="xl">
            <AlertIcon />
            {detailError}
          </Alert>
          <Button onClick={() => navigate('/community')}>
            Back to Community
          </Button>
        </VStack>
      </AppContainer>
    );
  }

  if (!currentPost) {
    return (
      <AppContainer>
        <VStack spacing={4} p={4}>
          <Text color={textColor}>Post not found</Text>
          <Button onClick={() => navigate('/community')}>
            Back to Community
          </Button>
        </VStack>
      </AppContainer>
    );
  }

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
              onClick={() => navigate('/community')}
            />
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Post
            </Text>
          </HStack>
        </HStack>

        {}
        <Box flex={1} overflowY="auto" p={4}>
          <VStack spacing={4} align="stretch">
            {}
            <Card bg={cardBg} borderRadius="xl" overflow="hidden">
              <CardBody p={4}>
                {}
                <HStack spacing={3} mb={3}>
                  <Avatar
                    size="md"
                    src={currentPost.author?.avatar}
                    name={`${currentPost.author?.firstName || ''} ${currentPost.author?.lastName || ''}`}
                  />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="md" fontWeight="semibold" color={textColor}>
                      {currentPost.author?.firstName} {currentPost.author?.lastName}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      @{currentPost.author?.username} • {formatTimeAgo(currentPost.createdAt)}
                    </Text>
                  </VStack>
                </HStack>

                {}
                <Box mb={4}>
                  <Text color={textColor} mb={3} lineHeight="1.6" fontSize="md">
                    {currentPost.content}
                  </Text>

                  {}
                  {currentPost.image && (
                    <Image
                      src={currentPost.image}
                      alt="Post image"
                      w="full"
                      maxH="400px"
                      objectFit="cover"
                      borderRadius="lg"
                      mb={3}
                    />
                  )}
                </Box>

                {}
                <HStack justify="space-between" pt={2} borderTop="1px solid" borderColor="gray.600">
                  <HStack spacing={6}>
                    {}
                    <HStack spacing={2}>
                      <IconButton
                        icon={<StarIcon />}
                        size="md"
                        variant="ghost"
                        color={isLiked ? 'yellow.400' : 'gray.400'}
                        onClick={handleToggleLike}
                        _hover={{ color: 'yellow.400' }}
                      />
                      <Text fontSize="md" color="gray.400">
                        {currentPost.likes || 0}
                      </Text>
                    </HStack>

                    {}
                    <HStack spacing={2}>
                      <ChatIcon color="gray.400" w={5} h={5} />
                      <Text fontSize="md" color="gray.400">
                        {currentPost.commentCount || 0}
                      </Text>
                    </HStack>

                    {}
                    <HStack spacing={2}>
                      <ViewIcon color="gray.400" w={5} h={5} />
                      <Text fontSize="md" color="gray.400">
                        {currentPost.views || 0}
                      </Text>
                    </HStack>
                  </HStack>
                </HStack>
              </CardBody>
            </Card>

            <Divider borderColor="gray.600" />

            {}
            {isAuthenticated && (
              <Card bg={cardBg} borderRadius="xl">
                <CardBody p={4}>
                  <VStack spacing={3} align="stretch">
                    <HStack spacing={3}>
                      <Avatar
                        size="sm"
                        src={user?.avatar}
                        name={`${user?.firstName || ''} ${user?.lastName || ''}`}
                      />
                      <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                        Add a comment
                      </Text>
                    </HStack>
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts..."
                      bg="gray.700"
                      border="1px solid"
                      borderColor="gray.600"
                      color={textColor}
                      _placeholder={{ color: 'gray.400' }}
                      _focus={{
                        borderColor: 'blue.500',
                        boxShadow: '0 0 0 1px #3182ce',
                      }}
                      resize="vertical"
                      minH="80px"
                    />
                    <HStack justify="flex-end">
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={handleSubmitComment}
                        isLoading={isSubmittingComment}
                        loadingText="Posting..."
                        isDisabled={!commentText.trim()}
                      >
                        Post Comment
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            )}

            {}
            <VStack spacing={3} align="stretch">
              <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                Comments ({commentsLoading ? '...' : comments.length})
              </Text>

              {commentsLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <VStack spacing={2}>
                    <Spinner size="md" color="blue.500" />
                    <Text fontSize="sm" color="gray.400">Loading comments...</Text>
                  </VStack>
                </Box>
              ) : commentsError ? (
                <Alert status="error" bg="red.900" color="white" borderRadius="xl">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">Failed to load comments</Text>
                    <Text fontSize="sm">{commentsError}</Text>
                  </VStack>
                </Alert>
              ) : comments.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <VStack spacing={2}>
                    <Text color="gray.400" fontSize="lg">
                      💬
                    </Text>
                    <Text color="gray.400">
                      No comments yet. Be the first to comment!
                    </Text>
                  </VStack>
                </Box>
              ) : (
                <VStack spacing={3} align="stretch">
                  {comments.map((comment) => (
                    <CommentCard
                      key={comment.id || comment._id}
                      comment={comment}
                      textColor={textColor}
                      cardBg={cardBg}
                    />
                  ))}
                </VStack>
              )}
            </VStack>
          </VStack>
        </Box>
      </VStack>
    </AppContainer>
  );
};

export default PostDetailScreen;
