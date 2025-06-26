import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { articleAPI } from '../services/articleAPI';

const ArticleContext = createContext();

export const useArticle = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticle must be used within an ArticleProvider');
  }
  return context;
};

const articleReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_ARTICLES_START':
      return {
        ...state,
        loading: true,
        error: null,
        lastFetch: Date.now()
      };

    case 'FETCH_ARTICLES_SUCCESS':
      const newArticles = action.payload.data || action.payload;
      return {
        ...state,
        loading: false,
        articles: action.payload.append ? [...state.articles, ...newArticles] : newArticles,
        pagination: {
          ...state.pagination,
          ...action.payload.pagination,
        },
        error: null
      };

    case 'FETCH_ARTICLES_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case 'FETCH_ARTICLE_DETAIL_START':
      return {
        ...state,
        detailLoading: true,
        detailError: null
      };

    case 'FETCH_ARTICLE_DETAIL_SUCCESS':
      const article = action.payload;

      const newCache = new Map(state.cache);
      newCache.set(article._id || article.id, article);

      return {
        ...state,
        detailLoading: false,
        currentArticle: article,
        cache: newCache,
        detailError: null
      };

    case 'FETCH_ARTICLE_DETAIL_ERROR':
      return {
        ...state,
        detailLoading: false,
        detailError: action.payload
      };

    case 'FETCH_FEATURED_ARTICLES_SUCCESS':
      return {
        ...state,
        featuredArticles: action.payload
      };

    case 'FETCH_POPULAR_ARTICLES_SUCCESS':
      return {
        ...state,
        popularArticles: action.payload
      };

    case 'FETCH_CATEGORIES_SUCCESS':
      return {
        ...state,
        categories: action.payload
      };

    case 'SET_ACTIVE_CATEGORY':
      return {
        ...state,
        activeCategory: action.payload
      };

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      };

    case 'CLEAR_CURRENT_ARTICLE':
      return {
        ...state,
        currentArticle: null,
        detailError: null
      };

    case 'FETCH_FAVORITES_START':
      return {
        ...state,
        favoritesLoading: true,
      };

    case 'FETCH_FAVORITES_SUCCESS':
      return {
        ...state,
        favoritesLoading: false,
        favorites: action.payload,
      };

    case 'TOGGLE_FAVORITE_SUCCESS':
      const { articleId, isFavorite } = action.payload;
      return {
        ...state,
        favorites: isFavorite
          ? [...state.favorites, articleId]
          : state.favorites.filter(id => id !== articleId),
      };

    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };

    case 'RESET_ARTICLES':
      return {
        ...state,
        articles: [],
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

const initialState = {
  articles: [],
  currentArticle: null,
  featuredArticles: [],
  popularArticles: [],
  categories: [],
  activeCategory: 'all',
  searchQuery: '',
  loading: false,
  detailLoading: false,
  error: null,
  detailError: null,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
  favorites: [],
  favoritesLoading: false,
  cache: new Map(),
  lastFetch: null,
};

export const ArticleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(articleReducer, initialState);

  const fetchArticles = useCallback(async (filters = {}, options = {}) => {
    const { page = 1, limit = 10, append = false } = options;

    dispatch({ type: 'FETCH_ARTICLES_START' });
    try {

      const backendFilters = {
        name: filters.search || filters.name,
        page,
        limit,
      };

      const result = await articleAPI.getArticles(backendFilters);
      if (result.success) {
        const articles = Array.isArray(result.data) ? result.data : [];

        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1200';
        const transformedArticles = articles.map(article => ({
          ...article,
          id: article._id || article.id,
          title: article.name || article.title,
          excerpt: article.description || article.excerpt,
          image: article.avatar ? `${API_BASE_URL}/${article.avatar}` : '/api/placeholder/300/200',

          category: 'General',
          readTime: '5 min read',
          author: 'FitBody Team',
          tags: [],
          isFeatured: false,
          views: 0,
          likes: 0,
          publishedDate: article.createdAt || new Date().toISOString(),
        }));

        const payload = {
          data: transformedArticles,
          pagination: {
            page,
            limit,
            total: result.total || transformedArticles.length,
            hasMore: transformedArticles.length === limit,
          },
          append,
        };
        dispatch({ type: 'FETCH_ARTICLES_SUCCESS', payload });
      } else {
        dispatch({ type: 'FETCH_ARTICLES_ERROR', payload: result.error });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_ARTICLES_ERROR', payload: error.message });
    }
  }, []);

  const fetchArticleById = useCallback(async (articleId, forceRefresh = false) => {

    const currentCache = state.cache;

    if (!forceRefresh && currentCache.has(articleId)) {
      const cachedArticle = currentCache.get(articleId);
      dispatch({ type: 'FETCH_ARTICLE_DETAIL_SUCCESS', payload: cachedArticle });
      return;
    }

    dispatch({ type: 'FETCH_ARTICLE_DETAIL_START' });
    try {
      const result = await articleAPI.getArticleById(articleId);
      if (result.success) {

        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1200';
        const article = {
          ...result.data,
          id: result.data._id || result.data.id,
          title: result.data.name || result.data.title,
          excerpt: result.data.description || result.data.excerpt,
          image: result.data.avatar ? `${API_BASE_URL}/${result.data.avatar}` : '/api/placeholder/300/200',

          category: 'General',
          readTime: '5 min read',
          author: 'FitBody Team',
          tags: [],
          isFeatured: false,
          views: 0,
          likes: 0,
          publishedDate: result.data.createdAt || new Date().toISOString(),
        };
        dispatch({ type: 'FETCH_ARTICLE_DETAIL_SUCCESS', payload: article });
      } else {
        dispatch({ type: 'FETCH_ARTICLE_DETAIL_ERROR', payload: result.error });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_ARTICLE_DETAIL_ERROR', payload: error.message });
    }
  }, []);

  const fetchFeaturedArticles = useCallback(async () => {
    try {
      const result = await articleAPI.getFeaturedArticles();
      if (result.success) {
        dispatch({ type: 'FETCH_FEATURED_ARTICLES_SUCCESS', payload: result.data });
      }
    } catch (error) {
      console.error('Failed to fetch featured articles:', error);
    }
  }, []);

  const fetchPopularArticles = useCallback(async () => {
    try {
      const result = await articleAPI.getPopularArticles();
      if (result.success) {
        dispatch({ type: 'FETCH_POPULAR_ARTICLES_SUCCESS', payload: result.data });
      }
    } catch (error) {
      console.error('Failed to fetch popular articles:', error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const result = await articleAPI.getCategories();
      if (result.success) {
        dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: result.data });
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const setActiveCategory = useCallback((category) => {
    dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: category });
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const clearCurrentArticle = useCallback(() => {
    dispatch({ type: 'CLEAR_CURRENT_ARTICLE' });
  }, []);

  const fetchFavorites = useCallback(async (userId) => {
    if (!userId) return;

    dispatch({ type: 'FETCH_FAVORITES_START' });
    try {
      const result = await articleAPI.getFavorites(userId, 'article');
      if (result.success) {

        const favorites = result.data.data || result.data;

        const favoriteIds = favorites.map(fav => {
          if (fav.articles_id && typeof fav.articles_id === 'object') {
            return fav.articles_id._id;
          }
          return fav.articles_id;
        }).filter(Boolean);

        dispatch({ type: 'FETCH_FAVORITES_SUCCESS', payload: favoriteIds });
      } else {
        dispatch({ type: 'FETCH_FAVORITES_ERROR', payload: result.error });
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      dispatch({ type: 'FETCH_FAVORITES_ERROR', payload: error.message });
    }
  }, []);

  const toggleFavorite = useCallback(async (articleId, userId) => {
    if (!userId) return;

    try {

      const currentFavorites = state.favorites;
      const isFavorite = currentFavorites.includes(articleId);
      const result = await articleAPI.toggleFavorite(articleId, userId, 'article');

      if (result.success) {
        dispatch({
          type: 'TOGGLE_FAVORITE_SUCCESS',
          payload: { articleId, isFavorite: !isFavorite }
        });

        await fetchFavorites(userId);
      } else {
        console.error('Failed to toggle favorite:', result.error);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }, [fetchFavorites]);

  const loadMoreArticles = useCallback(async (filters = {}) => {

    const currentState = state;
    if (currentState.loading || !currentState.pagination.hasMore) return;

    const nextPage = currentState.pagination.page + 1;
    await fetchArticles(filters, {
      page: nextPage,
      limit: currentState.pagination.limit,
      append: true
    });
  }, [fetchArticles]);

  const resetArticles = useCallback(() => {
    dispatch({ type: 'RESET_ARTICLES' });
  }, []);

  const getFilteredArticles = useCallback((categoryFilter = null, searchFilter = null) => {
    let filtered = [...state.articles];

    const category = categoryFilter || state.activeCategory;
    const search = searchFilter || state.searchQuery;

    if (category && category !== 'all') {
      filtered = filtered.filter(article =>
        article.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    return filtered;
  }, [state.articles, state.activeCategory, state.searchQuery]);

  const getArticleStats = useCallback(() => {
    const totalArticles = state.articles.length;
    const featuredCount = state.articles.filter(a => a.isFeatured).length;
    const categoryStats = state.categories.reduce((acc, category) => {
      acc[category] = state.articles.filter(a => a.category === category).length;
      return acc;
    }, {});

    return {
      total: totalArticles,
      featured: featuredCount,
      categories: categoryStats,
    };
  }, [state.articles, state.categories]);

  const value = {

    articles: state.articles,
    currentArticle: state.currentArticle,
    featuredArticles: state.featuredArticles,
    popularArticles: state.popularArticles,
    categories: state.categories,
    activeCategory: state.activeCategory,
    searchQuery: state.searchQuery,
    loading: state.loading,
    detailLoading: state.detailLoading,
    error: state.error,
    detailError: state.detailError,

    pagination: state.pagination,
    favorites: state.favorites,
    favoritesLoading: state.favoritesLoading,
    cache: state.cache,
    lastFetch: state.lastFetch,

    fetchArticles,
    fetchArticleById,
    fetchFeaturedArticles,
    fetchPopularArticles,
    fetchCategories,
    setActiveCategory,
    setSearchQuery,
    clearCurrentArticle,

    fetchFavorites,
    toggleFavorite,
    loadMoreArticles,
    resetArticles,

    getFilteredArticles,
    getArticleStats,
  };

  return (
    <ArticleContext.Provider value={value}>
      {children}
    </ArticleContext.Provider>
  );
};

export default ArticleContext;
