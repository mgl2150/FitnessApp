# FitBody API Reference

## Base Configuration

**Base URL**: `http://localhost:1200` (Development) | `https://fitbody.codewebdemo.top` (Production)

**Content-Type**: `application/json`

**Authentication**: Username/Password with account_id for user identification

## Authentication Endpoints

### POST /api/auth/login
Login user with username and password.

**Request Body:**
```json
{
  "username": "string (4-30 chars)",
  "password": "string (6-30 chars)"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "_id": "user_id",
    "username": "username",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "gender": "male",
    "age": 25,
    "weight": 70,
    "height": 175,
    "goal": "weight_loss",
    "activityLevel": "moderate"
  }
}
```

### POST /api/auth/register
Register new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string"
}
```

## User Profile Endpoints

### GET /api/accounts/:id
Get user profile information.

### PUT /api/accounts/:id
Update user profile data.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "gender": "male|female|other",
  "age": "number",
  "weight": "number",
  "height": "number",
  "goal": "weight_loss|muscle_gain|maintenance",
  "activityLevel": "sedentary|light|moderate|active|very_active"
}
```

## Workout Endpoints

### GET /api/lessons
Get workouts with optional filtering.

**Query Parameters:**
- `level`: beginner|intermediate|advanced
- `category`: strength|cardio|flexibility|sports
- `page`: number (pagination)
- `limit`: number (items per page)

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "lesson_id",
      "title": "Workout Title",
      "description": "Workout description",
      "level": "beginner",
      "duration": 30,
      "category": "strength",
      "avatar": "/uploads/workout_image.jpg",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /api/lessons/:id
Get specific workout details.

### GET /api/guides/lessons/:lesson_id
Get exercise guides for a specific workout.

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "guide_id",
      "lesson_id": "lesson_id",
      "title": "Exercise Name",
      "description": "Exercise instructions",
      "duration": 60,
      "reps": 12,
      "sets": 3,
      "video_url": "/uploads/exercise_video.mp4",
      "image_url": "/uploads/exercise_image.jpg"
    }
  ]
}
```

## Favorites Endpoints

### POST /api/favorites/lessons
Add workout to favorites.

**Request Body:**
```json
{
  "account_id": "user_id",
  "lesson_id": "workout_id"
}
```

### DELETE /api/favorites/lessons
Remove workout from favorites.

### GET /api/favorites/lessons/:account_id
Get user's favorite workouts.

### POST /api/favorites/articles
Add article to favorites.

### DELETE /api/favorites/articles
Remove article from favorites.

### GET /api/favorites/articles/:account_id
Get user's favorite articles.

## Article Endpoints

### GET /api/articles
Get articles with optional search and filtering.

**Query Parameters:**
- `name`: string (search term)
- `page`: number
- `limit`: number

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "article_id",
      "title": "Article Title",
      "content": "Article content...",
      "author": "Author Name",
      "category": "fitness",
      "featured_image": "/uploads/article_image.jpg",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /api/articles/:id
Get specific article content.

## Nutrition Endpoints

### GET /api/meals
Get meals with dietary filtering.

**Query Parameters:**
- `dietary`: vegetarian|vegan|keto|paleo|no-preferences
- `type`: breakfast|lunch|dinner|snack|all
- `cal_min`: number (minimum calories)
- `cal_max`: number (maximum calories)

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "meal_id",
      "title": "Meal Name",
      "description": "Meal description",
      "type": "breakfast",
      "dietary": "vegetarian",
      "calories": 350,
      "prep_time": 15,
      "image_url": "/uploads/meal_image.jpg",
      "ingredients": ["ingredient1", "ingredient2"],
      "instructions": ["step1", "step2"]
    }
  ]
}
```

### GET /api/meals/:id
Get specific meal details.

### POST /api/meal-plans
Create personalized meal plan.

**Request Body:**
```json
{
  "account_id": "user_id",
  "dietary_preferences": "vegetarian",
  "meal_types": ["breakfast", "lunch", "dinner", "snack"]
}
```

## Community Endpoints

### GET /api/posts
Get community posts.

### GET /api/posts/:id
Get specific post details.

### POST /api/posts
Create new community post.

## Media File Handling

### Static File URLs
All media files are served with the `/uploads/` prefix:
- Images: `/uploads/image_filename.jpg`
- Videos: `/uploads/video_filename.mp4`

### Frontend URL Construction
```javascript
const getMediaUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  return `${API_BASE_URL}/${filename}`;
};
```

## Error Responses

### Standard Error Format
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Common Status Codes
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (access denied)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

## Frontend Integration Examples

### Authentication Flow
```javascript
// Login
const result = await authAPI.login('username', 'password');
if (result.success) {
  localStorage.setItem('user', JSON.stringify(result.data));
}

// Access user data
const user = JSON.parse(localStorage.getItem('user'));
const accountId = user._id;
```

### API Call with Authentication
```javascript
// Add workout to favorites
const addToFavorites = async (workoutId) => {
  return apiCall('/api/favorites/lessons', {
    method: 'POST',
    body: JSON.stringify({
      account_id: user._id,
      lesson_id: workoutId
    })
  });
};
```

### Media URL Usage
```javascript
// Display workout image
<Image src={getMediaUrl(workout.avatar)} alt={workout.title} />

// Video player
<video src={getMediaUrl(exercise.video_url)} controls />
```
