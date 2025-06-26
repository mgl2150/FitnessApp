import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { postAPI, commentAPI } from '../services/postAPI';

const PostContext = createContext();

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

// Post reducer for state management
const postReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_POSTS_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'FETCH_POSTS_SUCCESS':
      const newPosts = action.payload.data || action.payload;
      return {
        ...state,
        loading: false,
        posts: action.payload.append ? [...state.posts, ...newPosts] : newPosts,
        pagination: {
          ...state.pagination,
          ...action.payload.pagination,
        },
        error: null,
        lastFetch: Date.now(),
      };

    case 'FETCH_POSTS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'FETCH_POST_DETAIL_START':
      return {
        ...state,
        detailLoading: true,
        detailError: null,
      };

    case 'FETCH_POST_DETAIL_SUCCESS':
      return {
        ...state,
        detailLoading: false,
        currentPost: action.payload,
        detailError: null,
      };

    case 'FETCH_POST_DETAIL_ERROR':
      return {
        ...state,
        detailLoading: false,
        detailError: action.payload,
      };

    case 'CREATE_POST_START':
      return {
        ...state,
        createLoading: true,
        createError: null,
      };

    case 'CREATE_POST_SUCCESS':
      return {
        ...state,
        createLoading: false,
        posts: [action.payload, ...state.posts], // Add new post to beginning
        createError: null,
      };

    case 'CREATE_POST_ERROR':
      return {
        ...state,
        createLoading: false,
        createError: action.payload,
      };

    case 'UPDATE_POST_SUCCESS':
      const updatedPosts = state.posts.map(post =>
        post._id === action.payload._id ? action.payload : post
      );
      return {
        ...state,
        posts: updatedPosts,
        currentPost: state.currentPost?._id === action.payload._id ? action.payload : state.currentPost,
      };

    case 'DELETE_POST_SUCCESS':
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
        currentPost: state.currentPost?._id === action.payload ? null : state.currentPost,
      };

    case 'FETCH_COMMENTS_START':
      return {
        ...state,
        commentsLoading: true,
        commentsError: null,
      };

    case 'FETCH_COMMENTS_SUCCESS':
      return {
        ...state,
        commentsLoading: false,
        comments: action.payload,
        commentsError: null,
      };

    case 'FETCH_COMMENTS_ERROR':
      return {
        ...state,
        commentsLoading: false,
        commentsError: action.payload,
      };

    case 'CREATE_COMMENT_SUCCESS':
      return {
        ...state,
        comments: [action.payload, ...state.comments], // Add new comment to beginning
        // Update comment count in current post
        currentPost: state.currentPost ? {
          ...state.currentPost,
          comment: (state.currentPost.comment || 0) + 1,
        } : state.currentPost,
      };

    case 'DELETE_COMMENT_SUCCESS':
      return {
        ...state,
        comments: state.comments.filter(comment => comment._id !== action.payload),
        // Update comment count in current post
        currentPost: state.currentPost ? {
          ...state.currentPost,
          comment: Math.max((state.currentPost.comment || 0) - 1, 0),
        } : state.currentPost,
      };

    case 'CLEAR_CURRENT_POST':
      return {
        ...state,
        currentPost: null,
        comments: [],
        detailLoading: false,
        commentsLoading: false,
        detailError: null,
        commentsError: null,
      };

    case 'RESET_POSTS':
      return {
        ...state,
        posts: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          hasMore: false,
        },
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  posts: [],
  currentPost: null,
  comments: [],
  loading: false,
  detailLoading: false,
  createLoading: false,
  commentsLoading: false,
  error: null,
  detailError: null,
  createError: null,
  commentsError: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
  lastFetch: null,
};

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);
  const stateRef = useRef(state);

  // Keep ref updated with current state
  stateRef.current = state;

  // Fetch posts with optional filtering and pagination
  const fetchPosts = useCallback(async (filters = {}, options = {}) => {
    const { page = 1, limit = 10, append = false } = options;

    dispatch({ type: 'FETCH_POSTS_START' });
    try {
      const result = await postAPI.getPosts({
        page,
        limit,
        ...filters,
      });

      if (result.success) {
        const posts = Array.isArray(result.data) ? result.data : [];
        
        // Transform backend data to standardized frontend format
        const transformedPosts = posts.map(post => ({
          ...post,
          id: post._id,
          // Ensure user data is properly structured
          author: post.user || {
            id: post.account_id?._id,
            username: post.account_id?.username,
            firstName: post.account_id?.full_name?.split(' ')[0] || post.account_id?.username,
            lastName: post.account_id?.full_name?.split(' ').slice(1).join(' ') || '',
            avatar: post.account_id?.avatar,
          },
          // Format timestamps
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          // Ensure numeric fields
          likes: post.star || 0,
          views: post.view || 0,
          commentCount: post.comment || 0,
        }));

        const payload = {
          data: transformedPosts,
          pagination: {
            page,
            limit,
            total: result.total || transformedPosts.length,
            hasMore: transformedPosts.length === limit,
          },
          append,
        };
        dispatch({ type: 'FETCH_POSTS_SUCCESS', payload });
      } else {
        dispatch({ type: 'FETCH_POSTS_ERROR', payload: result.error });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_POSTS_ERROR', payload: error.message });
    }
  }, []);

  // Fetch post by ID
  const fetchPostById = useCallback(async (postId) => {
    dispatch({ type: 'FETCH_POST_DETAIL_START' });
    try {
      const result = await postAPI.getPostById(postId);
      if (result.success) {
        const transformedPost = {
          ...result.data,
          id: result.data._id,
          author: result.data.user || {
            id: result.data.account_id?._id,
            username: result.data.account_id?.username,
            firstName: result.data.account_id?.full_name?.split(' ')[0] || result.data.account_id?.username,
            lastName: result.data.account_id?.full_name?.split(' ').slice(1).join(' ') || '',
            avatar: result.data.account_id?.avatar,
          },
          likes: result.data.star || 0,
          views: result.data.view || 0,
          commentCount: result.data.comment || 0,
        };

        dispatch({ type: 'FETCH_POST_DETAIL_SUCCESS', payload: transformedPost });
      } else {
        dispatch({ type: 'FETCH_POST_DETAIL_ERROR', payload: result.error });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_POST_DETAIL_ERROR', payload: error.message });
    }
  }, []);

  // Create new post
  const createPost = useCallback(async (postData) => {
    dispatch({ type: 'CREATE_POST_START' });
    try {
      const result = await postAPI.createPost(postData);
      if (result.success) {
        const transformedPost = {
          ...result.data,
          id: result.data._id,
          likes: result.data.star || 0,
          views: result.data.view || 0,
          commentCount: result.data.comment || 0,
        };

        dispatch({ type: 'CREATE_POST_SUCCESS', payload: transformedPost });
        return { success: true, data: transformedPost };
      } else {
        dispatch({ type: 'CREATE_POST_ERROR', payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      dispatch({ type: 'CREATE_POST_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  // Toggle like on post
  const toggleLike = useCallback(async (postId, currentLikeStatus = false) => {
    try {
      const result = await postAPI.toggleLike(postId, !currentLikeStatus);
      if (result.success) {
        const updatedPost = {
          ...result.data,
          id: result.data._id,
          likes: result.data.star || 0,
        };
        dispatch({ type: 'UPDATE_POST_SUCCESS', payload: updatedPost });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Increment view count
  const incrementView = useCallback(async (postId) => {
    try {
      const result = await postAPI.incrementView(postId);
      if (result.success) {
        const updatedPost = {
          ...result.data,
          id: result.data._id,
          views: result.data.view || 0,
        };
        dispatch({ type: 'UPDATE_POST_SUCCESS', payload: updatedPost });
      }
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  }, []);

  // Delete post
  const deletePost = useCallback(async (postId) => {
    try {
      const result = await postAPI.deletePost(postId);
      if (result.success) {
        dispatch({ type: 'DELETE_POST_SUCCESS', payload: postId });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Fetch comments for a post
  const fetchComments = useCallback(async (postId) => {
    dispatch({ type: 'FETCH_COMMENTS_START' });
    try {
      const result = await commentAPI.getComments(postId);
      if (result.success) {
        const commentsData = Array.isArray(result.data) ? result.data : [];
        const transformedComments = commentsData.map(comment => ({
          ...comment,
          id: comment._id,
          author: comment.user || {
            id: comment.account_id?._id,
            username: comment.account_id?.username,
            firstName: comment.account_id?.full_name?.split(' ')[0] || comment.account_id?.username,
            lastName: comment.account_id?.full_name?.split(' ').slice(1).join(' ') || '',
            avatar: comment.account_id?.avatar,
          },
        }));

        dispatch({ type: 'FETCH_COMMENTS_SUCCESS', payload: transformedComments });
      } else {
        dispatch({ type: 'FETCH_COMMENTS_ERROR', payload: result.error });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_COMMENTS_ERROR', payload: error.message });
    }
  }, []);

  // Create comment
  const createComment = useCallback(async (commentData) => {
    try {
      const result = await commentAPI.createComment(commentData);
      if (result.success) {
        const transformedComment = {
          ...result.data,
          id: result.data._id,
        };

        dispatch({ type: 'CREATE_COMMENT_SUCCESS', payload: transformedComment });
        return { success: true, data: transformedComment };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Delete comment
  const deleteComment = useCallback(async (commentId) => {
    try {
      const result = await commentAPI.deleteComment(commentId);
      if (result.success) {
        dispatch({ type: 'DELETE_COMMENT_SUCCESS', payload: commentId });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Clear current post
  const clearCurrentPost = useCallback(() => {
    dispatch({ type: 'CLEAR_CURRENT_POST' });
  }, []);

  // Reset posts
  const resetPosts = useCallback(() => {
    dispatch({ type: 'RESET_POSTS' });
  }, []);

  // Load more posts (pagination)
  const loadMorePosts = useCallback(async (filters = {}) => {
    // Use ref to get current state without dependency issues
    const currentState = stateRef.current;
    if (currentState.loading || !currentState.pagination.hasMore) return;

    await fetchPosts(filters, {
      page: currentState.pagination.page + 1,
      limit: currentState.pagination.limit,
      append: true,
    });
  }, [fetchPosts]);

  // Get posts by user
  const fetchPostsByUser = useCallback(async (userId, options = {}) => {
    return await fetchPosts({ account_id: userId }, options);
  }, [fetchPosts]);

  const value = {
    // State
    posts: state.posts,
    currentPost: state.currentPost,
    comments: state.comments,
    loading: state.loading,
    detailLoading: state.detailLoading,
    createLoading: state.createLoading,
    commentsLoading: state.commentsLoading,
    error: state.error,
    detailError: state.detailError,
    createError: state.createError,
    commentsError: state.commentsError,
    pagination: state.pagination,
    lastFetch: state.lastFetch,

    // Actions
    fetchPosts,
    fetchPostById,
    createPost,
    toggleLike,
    incrementView,
    deletePost,
    fetchComments,
    createComment,
    deleteComment,
    clearCurrentPost,
    resetPosts,
    loadMorePosts,
    fetchPostsByUser,
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};

export default PostContext;
