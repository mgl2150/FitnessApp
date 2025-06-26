# Complete API Endpoints List

## 🔐 Authentication APIs (`/api/auth`)

- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/register` - User registration (with avatar upload)
- **PATCH** `/api/auth/change-password/:id` - Change user password

## 👤 Account Management APIs (`/api/accounts`)

- **PATCH** `/api/accounts/:id` - Update account profile (with avatar upload)

## 📚 Articles APIs (`/api/articles`)

- **GET** `/api/articles` - Get all articles
- **POST** `/api/articles` - Create new article (with avatar upload)
- **GET** `/api/articles/:id` - Get article by ID
- **PATCH** `/api/articles/:id` - Update article (with avatar upload)
- **DELETE** `/api/articles/:id` - Delete article

## 🍽️ Meals APIs (`/api/meals`)

- **GET** `/api/meals` - Get meals (with filtering: dietary, allergies, type, cal_min, cal_max, minutes, number_of_servings)
- **POST** `/api/meals` - Create new meal (with avatar and video upload)
- **GET** `/api/meals/:id` - Get meal by ID
- **PATCH** `/api/meals/:id` - Update meal (with avatar and video upload)
- **DELETE** `/api/meals/:id` - Delete meal

## 🎓 Lessons APIs (`/api/lessons`)

- **GET** `/api/lessons` - Get all lessons
- **POST** `/api/lessons` - Create new lesson (with avatar upload)
- **GET** `/api/lessons/:id` - Get lesson by ID
- **PATCH** `/api/lessons/:id` - Update lesson (with avatar upload)
- **DELETE** `/api/lessons/:id` - Delete lesson

## 📖 Guides APIs (`/api/guides`)

- **POST** `/api/guides/lessons/:lesson_id` - Create guide for specific lesson (with video upload)
- **GET** `/api/guides/lessons/:lesson_id` - Get guides by lesson ID
- **GET** `/api/guides/:guide_id` - Get guide details
- **PATCH** `/api/guides/:guide_id` - Update guide (with video upload)
- **DELETE** `/api/guides/:guide_id` - Delete guide

## 📊 Process Tracking APIs (`/api/process-trackings`)

- **POST** `/api/process-trackings` - Create process tracking record
- **GET** `/api/process-trackings/:account_id` - Get process tracking by account ID

## 📝 Posts APIs (`/api/posts`)

- **GET** `/api/posts` - Get all posts
- **POST** `/api/posts` - Create new post (with image upload)
- **GET** `/api/posts/:id` - Get post by ID
- **PATCH** `/api/posts/:id` - Update post (with image upload)
- **DELETE** `/api/posts/:id` - Delete post

## 💬 Comments APIs (`/api/comments`)

- **POST** `/api/comments` - Create new comment (with image upload)
- **GET** `/api/comments/:post_id` - Get comments for specific post
- **DELETE** `/api/comments/:id` - Delete comment

## 🍽️ Meal Plans APIs (`/api/meal-plans`)

- **POST** `/api/meal-plans` - Save meal plan
- **GET** `/api/meal-plans/accounts/:account_id` - Get meal plans by account ID
- **DELETE** `/api/meal-plans/:id` - Delete meal plan

## 🔔 Notifications APIs (`/api/notifications`)

- **GET** `/api/notifications` - Get notifications (with filtering: account_id, type)
- **POST** `/api/notifications` - Create notification (with icon upload)
- **DELETE** `/api/notifications/:id` - Delete notification

## ❤️ Favorites APIs (`/api/favorite`)

### General Favorites

- **POST** `/api/favorite` - Add item to favorites
- **GET** `/api/favorite/accounts/:account_id` - Get favorites by account ID (with type filtering)
- **DELETE** `/api/favorite/:id` - Remove from favorites

### Article-Specific Favorites

- **POST** `/api/favorite/articles` - Add article to favorites
- **DELETE** `/api/favorite/articles/:articleId` - Remove article from favorites
- **GET** `/api/favorite/articles/user/:accountId` - Get user's favorite articles
