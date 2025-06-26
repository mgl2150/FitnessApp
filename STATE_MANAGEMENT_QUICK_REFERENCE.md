# FitBody State Management Quick Reference

## Context Providers Overview

| Context | State Type | Key Features | Persistence |
|---------|------------|--------------|-------------|
| **AuthContext** | useState | User session, authentication | localStorage |
| **UserDataContext** | useState | Profile setup, temporary data | localStorage |
| **WorkoutContext** | useReducer | Workouts, favorites, cache | API + cache |
| **ArticleContext** | useReducer | Articles, favorites, search | API + cache |
| **NutritionContext** | useReducer | Meals, plans, filters | API + localStorage |
| **PostContext** | useReducer | Community posts, comments | API only |

## Action Type Patterns

### Consistent Naming Convention
```javascript
// Pattern: FEATURE_ACTION_STATE
FETCH_WORKOUTS_START
FETCH_WORKOUTS_SUCCESS
FETCH_WORKOUTS_ERROR

// Or with constants object
const NUTRITION_ACTIONS = {
  FETCH_MEALS_START: 'FETCH_MEALS_START',
  FETCH_MEALS_SUCCESS: 'FETCH_MEALS_SUCCESS',
  FETCH_MEALS_ERROR: 'FETCH_MEALS_ERROR',
};
```

### Standard Action Structure
```javascript
// Loading action
{ type: 'FETCH_DATA_START' }

// Success action
{ 
  type: 'FETCH_DATA_SUCCESS', 
  payload: { data: [...], pagination: {...} }
}

// Error action
{ type: 'FETCH_DATA_ERROR', payload: 'Error message' }
```

## Reducer Patterns

### Basic Reducer Structure
```javascript
const featureReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_DATA_START':
      return { ...state, loading: true, error: null };
    
    case 'FETCH_DATA_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
        lastFetch: Date.now()
      };
    
    case 'FETCH_DATA_ERROR':
      return { ...state, loading: false, error: action.payload };
    
    default:
      return state;
  }
};
```

### Array Update Patterns
```javascript
// Replace array
workouts: action.payload

// Append to array (pagination)
workouts: [...state.workouts, ...action.payload]

// Update item in array
workouts: state.workouts.map(workout => 
  workout._id === action.payload.id
    ? { ...workout, ...action.payload.updates }
    : workout
)

// Add to array
favorites: [...state.favorites, action.payload.id]

// Remove from array
favorites: state.favorites.filter(id => id !== action.payload.id)
```

## Context Integration Patterns

### Standard Context Provider
```javascript
export const FeatureProvider = ({ children }) => {
  const [state, dispatch] = useReducer(featureReducer, initialState);
  const { user } = useAuth(); // Access auth context

  const fetchData = useCallback(async () => {
    dispatch({ type: 'FETCH_DATA_START' });
    try {
      const result = await featureAPI.getData();
      if (result.success) {
        dispatch({ type: 'FETCH_DATA_SUCCESS', payload: result.data });
      } else {
        dispatch({ type: 'FETCH_DATA_ERROR', payload: result.error });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_DATA_ERROR', payload: error.message });
    }
  }, []);

  const value = { ...state, fetchData };
  
  return (
    <FeatureContext.Provider value={value}>
      {children}
    </FeatureContext.Provider>
  );
};
```

### Custom Hook Pattern
```javascript
export const useFeature = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeature must be used within FeatureProvider');
  }
  return context;
};
```

## Component Usage Patterns

### Basic Context Consumption
```javascript
const Component = () => {
  const { data, loading, error, fetchData } = useFeature();
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return <DataList data={data} />;
};
```

### Multi-Context Usage
```javascript
const Component = () => {
  const { user } = useAuth();
  const { workouts, fetchWorkouts } = useWorkout();
  const { articles, fetchArticles } = useArticle();

  useEffect(() => {
    if (user) {
      fetchWorkouts();
      fetchArticles();
    }
  }, [user, fetchWorkouts, fetchArticles]);
};
```

## Persistence Strategies

### Authentication Persistence
```javascript
// Save on login
localStorage.setItem('user', JSON.stringify(userData));

// Load on app start
const savedUser = localStorage.getItem('user');
if (savedUser) {
  setUser(JSON.parse(savedUser));
  setIsAuthenticated(true);
}

// Clear on logout
localStorage.removeItem('user');
```

### Temporary Data Persistence
```javascript
// Auto-save during profile setup
useEffect(() => {
  localStorage.setItem('profileData', JSON.stringify(profileData));
}, [profileData]);

// Clear after completion
const clearProfileSetupData = () => {
  localStorage.removeItem('profileData');
  localStorage.removeItem('currentStep');
};
```

### Cache-Based Persistence
```javascript
// In-memory caching
const initialState = {
  cache: new Map(),
  lastFetch: null,
};

// Check cache before API call
if (state.cache.has(id)) {
  return { success: true, data: state.cache.get(id) };
}

// Update cache after successful fetch
const newCache = new Map(state.cache);
newCache.set(id, data);
```

## Performance Optimization

### useCallback for Actions
```javascript
const fetchData = useCallback(async (filters = {}) => {
  // Implementation
}, []); // Empty deps - function never changes

const updateFilter = useCallback((filter) => {
  dispatch({ type: 'SET_FILTER', payload: filter });
}, []); // Simple dispatch - no deps needed
```

### useMemo for Computed Values
```javascript
const filteredData = useMemo(() => {
  return state.data.filter(item => 
    item.category === state.activeFilter
  );
}, [state.data, state.activeFilter]);
```

### Cache Optimization
```javascript
// Cache with TTL
const isCacheValid = (lastFetch, maxAge = 5 * 60 * 1000) => {
  return lastFetch && (Date.now() - lastFetch) < maxAge;
};

// Conditional fetching
if (!isCacheValid(state.lastFetch)) {
  await fetchData();
}
```

## Error Handling Patterns

### Component Error Handling
```javascript
const Component = () => {
  const { error, clearError } = useFeature();
  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
      });
      clearError();
    }
  }, [error, toast, clearError]);
};
```

### Optimistic Updates
```javascript
// Optimistic update
dispatch({ type: 'UPDATE_OPTIMISTIC', payload: newData });

try {
  const result = await api.update(newData);
  if (!result.success) {
    // Rollback on failure
    dispatch({ type: 'UPDATE_ROLLBACK', payload: originalData });
  }
} catch (error) {
  dispatch({ type: 'UPDATE_ROLLBACK', payload: originalData });
}
```

## Common State Structures

### Loading States
```javascript
{
  loading: false,        // General loading
  detailLoading: false,  // Specific operation loading
  createLoading: false,  // Create operation loading
}
```

### Error States
```javascript
{
  error: null,        // General error
  detailError: null,  // Specific operation error
  createError: null,  // Create operation error
}
```

### Pagination
```javascript
{
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  }
}
```

### Filters and Search
```javascript
{
  activeFilters: {
    category: 'all',
    difficulty: 'beginner',
  },
  searchQuery: '',
  activeCategory: 'all',
}
```

This quick reference provides the essential patterns and structures used throughout the FitBody application's state management system.
