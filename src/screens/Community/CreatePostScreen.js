import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Textarea,
  Image,
  Avatar,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import AppContainer from '../../components/Layout/AppContainer';
import { usePost } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';

const CreatePostScreen = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const { createPost, createLoading, createError } = usePost();

  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const textColor = 'white';
  const cardBg = '#2D3748';

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select an image file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please select an image smaller than 5MB',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };



  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please enter some content for your post',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {

      const formData = new FormData();
      formData.append('content', content.trim());
      formData.append('account_id', user._id);

      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const result = await createPost(formData);

      if (result.success) {
        toast({
          title: 'Post Created',
          description: 'Your post has been shared with the community!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/community');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Error Creating Post',
        description: error.message || 'Failed to create post. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const isSubmitDisabled = !content.trim() || createLoading;

  return (
    <AppContainer>
      <VStack spacing={0} align="stretch" h="full">
        <HStack justify="space-between" p={4} borderBottom="1px solid" borderColor="gray.600">
          <HStack spacing={3}>
            <IconButton
              icon={<ArrowBackIcon />}
              variant="ghost"
              color={textColor}
              onClick={() => navigate('/community')}
            />
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Create Post
            </Text>
          </HStack>
          <Button
            colorScheme="blue"
            size="sm"
            onClick={handleSubmit}
            isLoading={createLoading}
            loadingText="Posting..."
            isDisabled={isSubmitDisabled}
          >
            Post
          </Button>
        </HStack>

        <Box flex={1} overflowY="auto" p={4}>
          <VStack spacing={4} align="stretch">
            {createError && (
              <Alert status="error" bg="red.900" color="white" borderRadius="xl">
                <AlertIcon />
                {createError}
              </Alert>
            )}

            <HStack spacing={3} p={4} bg={cardBg} borderRadius="xl">
              <Avatar
                size="sm"
                src={user?.avatar}
                name={`${user?.firstName || ''} ${user?.lastName || ''}`}
              />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  @{user?.username}
                </Text>
              </VStack>
            </HStack>

            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel color={textColor} fontSize="sm">
                  What's on your mind?
                </FormLabel>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your fitness journey, tips, or thoughts with the community..."
                  bg={cardBg}
                  border="1px solid"
                  borderColor="gray.600"
                  color={textColor}
                  _placeholder={{ color: 'gray.400' }}
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px #3182ce',
                  }}
                  resize="vertical"
                  minH="120px"
                  maxLength={1000}
                />
                <Text fontSize="xs" color="gray.400" textAlign="right" mt={1}>
                  {content.length}/1000
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel color={textColor} fontSize="sm">
                  Add Image (Optional)
                </FormLabel>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  display="none"
                />
              </FormControl>

              {imagePreview && (
              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="white" mb={2}>
                  Image Preview:
                </Text>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  maxH="200px"
                  borderRadius="lg"
                  objectFit="cover"
                />
              </Box>
            )}

            <Box p={4} bg="blue.900" borderRadius="xl" borderLeft="4px solid" borderColor="blue.500">
                <Text fontSize="sm" fontWeight="semibold" color="blue.200" mb={2}>
                  Community Guidelines
                </Text>
                <VStack align="start" spacing={1}>
                  <Text fontSize="xs" color="blue.100">
                    • Be respectful and supportive to fellow members
                  </Text>
                  <Text fontSize="xs" color="blue.100">
                    • Share fitness tips, progress, and motivation
                  </Text>
                  <Text fontSize="xs" color="blue.100">
                    • Keep content appropriate and family-friendly
                  </Text>
                  <Text fontSize="xs" color="blue.100">
                    • No spam or promotional content
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </VStack>
        </Box>
      </VStack>
    </AppContainer>
  );
};

export default CreatePostScreen;
