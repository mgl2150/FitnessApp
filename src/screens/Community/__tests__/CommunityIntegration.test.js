import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '../../../contexts/AuthContext';
import { PostProvider } from '../../../contexts/PostContext';
import CommunityFeedScreen from '../CommunityFeedScreen';
import theme from '../../../theme';

// Mock the API calls
jest.mock('../../../services/postAPI', () => ({
  postAPI: {
    getPosts: jest.fn(() => Promise.resolve({
      success: true,
      data: [
        {
          _id: '1',
          content: 'Test post content',
          image: null,
          star: 5,
          comment: 2,
          view: 10,
          account_id: {
            _id: 'user1',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            avatar: null,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ]
    })),
    toggleLike: jest.fn(() => Promise.resolve({ success: true, data: {} })),
    incrementView: jest.fn(() => Promise.resolve({ success: true, data: {} })),
  },
  commentAPI: {
    getComments: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  }
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Test wrapper component
const TestWrapper = ({ children }) => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <AuthProvider>
        <PostProvider>
          {children}
        </PostProvider>
      </AuthProvider>
    </BrowserRouter>
  </ChakraProvider>
);

describe('Community Feature Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders community feed screen', async () => {
    render(
      <TestWrapper>
        <CommunityFeedScreen />
      </TestWrapper>
    );

    // Check if the community header is rendered
    expect(screen.getByText('Community')).toBeInTheDocument();
    
    // Check if the create post button is rendered
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('displays posts when loaded', async () => {
    render(
      <TestWrapper>
        <CommunityFeedScreen />
      </TestWrapper>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test post content')).toBeInTheDocument();
    });

    // Check if user info is displayed
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  test('handles post interaction buttons', async () => {
    render(
      <TestWrapper>
        <CommunityFeedScreen />
      </TestWrapper>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test post content')).toBeInTheDocument();
    });

    // Find and click the like button
    const likeButtons = screen.getAllByRole('button');
    const likeButton = likeButtons.find(button => 
      button.querySelector('svg') && button.getAttribute('aria-label') === undefined
    );
    
    if (likeButton) {
      fireEvent.click(likeButton);
    }

    // Check if like count is displayed
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(
      <TestWrapper>
        <CommunityFeedScreen />
      </TestWrapper>
    );

    // Should show loading spinner initially
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('handles navigation to create post', async () => {
    render(
      <TestWrapper>
        <CommunityFeedScreen />
      </TestWrapper>
    );

    // Find the create post button (plus icon)
    const createButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(createButton);

    // Should navigate to create post screen
    expect(mockNavigate).toHaveBeenCalledWith('/community/create');
  });
});

describe('PostContext Integration', () => {
  test('PostContext provides expected values', () => {
    let contextValue;
    
    const TestComponent = () => {
      const postContext = require('../../../contexts/PostContext').usePost();
      contextValue = postContext;
      return <div>Test</div>;
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Check if context provides expected methods and state
    expect(contextValue).toHaveProperty('posts');
    expect(contextValue).toHaveProperty('loading');
    expect(contextValue).toHaveProperty('fetchPosts');
    expect(contextValue).toHaveProperty('createPost');
    expect(contextValue).toHaveProperty('toggleLike');
    expect(contextValue).toHaveProperty('fetchComments');
    expect(contextValue).toHaveProperty('createComment');
  });
});

describe('API Integration', () => {
  test('postAPI service is properly configured', () => {
    const { postAPI } = require('../../../services/postAPI');
    
    // Check if API methods exist
    expect(postAPI).toHaveProperty('getPosts');
    expect(postAPI).toHaveProperty('createPost');
    expect(postAPI).toHaveProperty('toggleLike');
    expect(postAPI).toHaveProperty('incrementView');
    expect(postAPI).toHaveProperty('deletePost');
    
    // Check if methods are functions
    expect(typeof postAPI.getPosts).toBe('function');
    expect(typeof postAPI.createPost).toBe('function');
    expect(typeof postAPI.toggleLike).toBe('function');
  });

  test('commentAPI service is properly configured', () => {
    const { commentAPI } = require('../../../services/postAPI');
    
    // Check if API methods exist
    expect(commentAPI).toHaveProperty('getComments');
    expect(commentAPI).toHaveProperty('createComment');
    expect(commentAPI).toHaveProperty('deleteComment');
    
    // Check if methods are functions
    expect(typeof commentAPI.getComments).toBe('function');
    expect(typeof commentAPI.createComment).toBe('function');
    expect(typeof commentAPI.deleteComment).toBe('function');
  });
});
