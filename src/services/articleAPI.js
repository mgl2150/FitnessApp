
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

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API call failed:', error);
    return { success: false, error: error.message };
  }
};

export const articleAPI = {

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

  getArticleById: async (articleId) => {
    console.log('🔄 API: Get article by ID', articleId);
    return apiCall(`/api/articles/${articleId}`);
  },

  getFeaturedArticles: async () => {
    console.log('🔄 API: Get featured articles (recent articles)');
    const result = await apiCall('/api/articles');

    if (result.success) {

      const featuredArticles = result.data.slice(0, 4);
      return { success: true, data: featuredArticles };
    }

    return result;
  },

  getPopularArticles: async () => {
    console.log('🔄 API: Get popular articles (all articles)');
    const result = await apiCall('/api/articles');

    if (result.success) {

      const popularArticles = result.data.slice(0, 5);
      return { success: true, data: popularArticles };
    }

    return result;
  },

  getCategories: async () => {

    console.log('🔄 Mock API: Get categories (not supported by backend)');
    await new Promise(resolve => setTimeout(resolve, 300));

    return { success: true, data: [] };

  },

  getFavorites: async (userId, type = 'article') => {
    console.log('🔄 API: Get user favorites', userId, type);

    if (type === 'article') {
      return apiCall(`/api/favorite/articles/user/${userId}`);
    } else {
      return apiCall(`/api/favorite/accounts/${userId}?type=${type}`);
    }
  },

  toggleFavorite: async (articleId, userId, type = 'article') => {
    console.log('🔄 API: Toggle favorite', articleId, userId, type);

    try {

      const favoritesResult = await apiCall(`/api/favorite/articles/user/${userId}`);

      if (favoritesResult.success) {
        const favorites = favoritesResult.data.data || favoritesResult.data;
        const existingFavorite = favorites.find(fav =>
          fav.articles_id && (fav.articles_id._id === articleId || fav.articles_id === articleId)
        );

        if (existingFavorite) {

          console.log('🔄 API: Removing favorite', articleId);
          return apiCall(`/api/favorite/articles/${articleId}`, {
            method: 'DELETE',
            body: JSON.stringify({ account_id: userId })
          });
        } else {

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

  removeFromFavorites: async (articleId, userId) => {
    console.log('🔄 API: Remove article from favorites', articleId, userId);
    return apiCall(`/api/favorite/articles/${articleId}`, {
      method: 'DELETE',
      body: JSON.stringify({ account_id: userId })
    });
  },
};

export default articleAPI;
