const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1200';

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    if (responseData.statusCode) {
      if (responseData.statusCode >= 200 && responseData.statusCode < 300) {
        return { success: true, data: responseData.data };
      } else {
        return { success: false, error: responseData.message || `API error: ${responseData.statusCode}` };
      }
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error('API call failed:', error);
    return { success: false, error: error.message };
  }
};

const getMediaUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  return `${API_BASE_URL}/${filename}`;
};

export const postAPI = {

  getPosts: async (filters = {}) => {
    console.log('🔄 Real API: Get posts with filters', filters);

    try {
      const queryParams = new URLSearchParams();
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.account_id) queryParams.append('account_id', filters.account_id);

      const endpoint = `/api/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await apiCall(endpoint);

      if (result.success) {

        const postsWithMediaUrls = result.data.map(post => ({
          ...post,
          image: getMediaUrl(post.image),

          user: post.account_id ? {
            id: post.account_id._id,
            username: post.account_id.username,
            firstName: post.account_id.full_name?.split(' ')[0] || post.account_id.username,
            lastName: post.account_id.full_name?.split(' ').slice(1).join(' ') || '',
            avatar: getMediaUrl(post.account_id.avatar),
          } : null,
        }));

        return { success: true, data: postsWithMediaUrls };
      }

      return result;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { success: false, error: error.message };
    }
  },

  getPostById: async (postId) => {
    console.log('🔄 Real API: Get post by ID', postId);

    try {
      const result = await apiCall(`/api/posts/${postId}`);

      if (result.success && result.data) {

        const postWithMediaUrls = {
          ...result.data,
          image: getMediaUrl(result.data.image),
          user: result.data.account_id ? {
            id: result.data.account_id._id,
            username: result.data.account_id.username,
            firstName: result.data.account_id.full_name?.split(' ')[0] || result.data.account_id.username,
            lastName: result.data.account_id.full_name?.split(' ').slice(1).join(' ') || '',
            avatar: getMediaUrl(result.data.account_id.avatar),
          } : null,
        };

        return { success: true, data: postWithMediaUrls };
      }

      return result;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      return { success: false, error: error.message };
    }
  },

  createPost: async (postData) => {
    console.log('🔄 Real API: Create post', postData);

    try {

      let body;
      let headers = {};

      if (postData instanceof FormData) {
        body = postData;

      } else {
        body = JSON.stringify(postData);
        headers['Content-Type'] = 'application/json';
      }

      const result = await apiCall('/api/posts', {
        method: 'POST',
        headers,
        body,
      });

      if (result.success && result.data) {

        const transformedPost = {
          ...result.data,
          image: getMediaUrl(result.data.image),
        };

        return { success: true, data: transformedPost };
      }

      return result;
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: error.message };
    }
  },

  updatePost: async (postId, updateData) => {
    console.log('🔄 Real API: Update post', postId, updateData);

    try {
      const result = await apiCall(`/api/posts/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      if (result.success && result.data) {

        const transformedPost = {
          ...result.data,
          image: getMediaUrl(result.data.image),
        };

        return { success: true, data: transformedPost };
      }

      return result;
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, error: error.message };
    }
  },

  deletePost: async (postId) => {
    console.log('🔄 Real API: Delete post', postId);

    try {
      const result = await apiCall(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      return result;
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: error.message };
    }
  },

  toggleLike: async (postId, increment = true) => {
    console.log('🔄 Real API: Toggle post like', postId, increment);

    try {
      const result = await postAPI.updatePost(postId, {
        star: increment ? 1 : -1,
      });

      return result;
    } catch (error) {
      console.error('Error toggling post like:', error);
      return { success: false, error: error.message };
    }
  },

  incrementView: async (postId) => {
    console.log('🔄 Real API: Increment post view', postId);

    try {
      const result = await postAPI.updatePost(postId, {
        view: 1,
      });

      return result;
    } catch (error) {
      console.error('Error incrementing post view:', error);
      return { success: false, error: error.message };
    }
  },

  getPostsByUser: async (userId, filters = {}) => {
    console.log('🔄 Real API: Get posts by user', userId, filters);

    try {
      const result = await postAPI.getPosts({
        ...filters,
        account_id: userId,
      });

      return result;
    } catch (error) {
      console.error('Error fetching posts by user:', error);
      return { success: false, error: error.message };
    }
  },
};

export const commentAPI = {

  getComments: async (postId) => {
    console.log('🔄 Real API: Get comments for post', postId);

    try {
      const result = await apiCall(`/api/comments/${postId}`);

      if (result.success) {

        const commentsWithMediaUrls = result.data.map(comment => ({
          ...comment,
          image: getMediaUrl(comment.image),
          user: comment.account_id ? {
            id: comment.account_id._id,
            username: comment.account_id.username,
            firstName: comment.account_id.full_name?.split(' ')[0] || comment.account_id.username,
            lastName: comment.account_id.full_name?.split(' ').slice(1).join(' ') || '',
            avatar: getMediaUrl(comment.account_id.avatar),
          } : null,
        }));

        return { success: true, data: commentsWithMediaUrls };
      }

      return result;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return { success: false, error: error.message };
    }
  },

  createComment: async (commentData) => {
    console.log('🔄 Real API: Create comment', commentData);

    try {

      let body;
      let headers = {};

      if (commentData instanceof FormData) {
        body = commentData;

      } else {
        body = JSON.stringify(commentData);
        headers['Content-Type'] = 'application/json';
      }

      const result = await apiCall('/api/comments', {
        method: 'POST',
        headers,
        body,
      });

      if (result.success && result.data) {

        const transformedComment = {
          ...result.data,
          image: getMediaUrl(result.data.image),
        };

        return { success: true, data: transformedComment };
      }

      return result;
    } catch (error) {
      console.error('Error creating comment:', error);
      return { success: false, error: error.message };
    }
  },

  deleteComment: async (commentId) => {
    console.log('🔄 Real API: Delete comment', commentId);

    try {
      const result = await apiCall(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      return result;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { success: false, error: error.message };
    }
  },
};

const postAPIService = {
  posts: postAPI,
  comments: commentAPI,
};

export default postAPIService;
