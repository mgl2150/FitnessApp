// Article API Service
// Note: Backend runs on port 1200, frontend on 3001
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1200';

// Helper function for API calls
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

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API call failed:', error);
    return { success: false, error: error.message };
  }
};

// Mock data for development - Simplified to match backend article model

export const articleAPI = {
  // Get all articles with optional filtering
  getArticles: async (filters = {}) => {
    console.log('🔄 API: Get articles with filters', filters);

    const queryParams = new URLSearchParams();
    if (filters.name || filters.search) {
      queryParams.append('name', filters.name || filters.search);
    }
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const endpoint = `/api/articles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall(endpoint);
  },

  // Get article by ID
  getArticleById: async (articleId) => {
    console.log('🔄 API: Get article by ID', articleId);
    return apiCall(`/api/articles/${articleId}`);
  },

  // Get featured articles (simplified - just return recent articles)
  getFeaturedArticles: async () => {
    console.log('🔄 API: Get featured articles (recent articles)');
    const result = await apiCall('/api/articles');

    if (result.success) {
      // Return first 4 articles as featured
      const featuredArticles = result.data.slice(0, 4);
      return { success: true, data: featuredArticles };
    }

    return result;
  },

  // Get popular articles (simplified - just return all articles)
  getPopularArticles: async () => {
    console.log('🔄 API: Get popular articles (all articles)');
    const result = await apiCall('/api/articles');

    if (result.success) {
      // Return first 5 articles as popular
      const popularArticles = result.data.slice(0, 5);
      return { success: true, data: popularArticles };
    }

    return result;
  },

  // Get article categories (removed - backend doesn't support categories)
  getCategories: async () => {
    // MOCK IMPLEMENTATION - Backend doesn't support categories
    console.log('🔄 Mock API: Get categories (not supported by backend)');
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return empty array since backend doesn't support categories
    return { success: true, data: [] };

    // REAL IMPLEMENTATION:
    /*
    // Categories not supported by backend
    return { success: true, data: [] };
    */
  },

  // Get user favorites
  getFavorites: async (userId, type = 'article') => {
    console.log('🔄 API: Get user favorites', userId, type);

    if (type === 'article') {
      return apiCall(`/api/favorite/articles/user/${userId}`);
    } else {
      return apiCall(`/api/favorite/accounts/${userId}?type=${type}`);
    }
  },

  // Toggle favorite status
  toggleFavorite: async (articleId, userId, type = 'article') => {
    console.log('🔄 API: Toggle favorite', articleId, userId, type);

    try {
      // First, check if the article is already favorited
      const favoritesResult = await apiCall(`/api/favorite/articles/user/${userId}`);

      if (favoritesResult.success) {
        const favorites = favoritesResult.data.data || favoritesResult.data;
        const existingFavorite = favorites.find(fav =>
          fav.articles_id && (fav.articles_id._id === articleId || fav.articles_id === articleId)
        );

        if (existingFavorite) {
          // Remove favorite
          console.log('🔄 API: Removing favorite', articleId);
          return apiCall(`/api/favorite/articles/${articleId}`, {
            method: 'DELETE',
            body: JSON.stringify({ account_id: userId })
          });
        } else {
          // Add favorite
          console.log('🔄 API: Adding favorite', articleId);
          return apiCall('/api/favorite/articles', {
            method: 'POST',
            body: JSON.stringify({
              account_id: userId,
              articles_id: articleId,
              type: type
            })
          });
        }
      } else {
        throw new Error('Failed to fetch current favorites');
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      return { success: false, error: error.message };
    }
  },

  // Add article to favorites
  addToFavorites: async (articleId, userId) => {
    console.log('🔄 API: Add article to favorites', articleId, userId);
    return apiCall('/api/favorite/articles', {
      method: 'POST',
      body: JSON.stringify({
        account_id: userId,
        articles_id: articleId,
        type: 'article'
      })
    });
  },

  // Remove article from favorites
  removeFromFavorites: async (articleId, userId) => {
    console.log('🔄 API: Remove article from favorites', articleId, userId);
    return apiCall(`/api/favorite/articles/${articleId}`, {
      method: 'DELETE',
      body: JSON.stringify({ account_id: userId })
    });
  },
};

export default articleAPI;
