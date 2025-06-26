import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { AuthProvider } from "./contexts/AuthContext";
import { UserDataProvider } from "./contexts/UserDataContext";
import { WorkoutProvider } from "./contexts/WorkoutContext";
import { ArticleProvider } from "./contexts/ArticleContext";
import { NutritionProvider } from "./contexts/NutritionContext";
import { PostProvider } from "./contexts/PostContext";
import ErrorBoundary from "./components/Error/ErrorBoundary";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

import LaunchScreen from "./screens/Core/LaunchScreen";
import Home from "./screens/Core/Home";
import HelpScreen from "./screens/Profile/HelpScreen";

import LoginScreen from "./screens/Auth/LoginScreen";
import SignUpScreen from "./screens/Auth/SignUpScreen";
import ForgotPasswordScreen from "./screens/Auth/ForgotPasswordScreen";
import SetPasswordScreen from "./screens/Auth/SetPasswordScreen";

import OnboardingFlow from "./screens/Onboarding/OnboardingFlow";
import ProfileSetupFlow from "./screens/Onboarding/ProfileSetupFlow";

import ProfileScreen from "./screens/Profile/ProfileScreen";
import EditProfileScreen from "./screens/Profile/EditProfileScreen";
import FavoritesScreen from "./screens/Profile/FavoritesScreen";
import ProgressScreen from "./screens/Profile/ProgressScreen";
import SettingsScreen from "./screens/Profile/SettingsScreen";

import WorkoutsScreen from "./screens/Workout/WorkoutsScreen";
import CreateRoutineScreen from "./screens/Workout/CreateRoutineScreen";
import WorkoutDetailScreen from "./screens/Workout/WorkoutDetailScreen";
import ExerciseDetailScreen from "./screens/Workout/ExerciseDetailScreen";

import ArticleListScreen from "./screens/Article/ArticleListScreen";
import ArticleDetailScreen from "./screens/Article/ArticleDetailScreen";

import NutritionRedirect from "./screens/Nutrition/NutritionRedirect";
import MealPlanDetailScreen from "./screens/Nutrition/MealPlanDetailScreen";
import MealPlanSetupScreen from "./screens/Nutrition/MealPlanSetupScreen";
import MealPlanLoadingScreen from "./screens/Nutrition/MealPlanLoadingScreen";
import MealPlanMainScreen from "./screens/Nutrition/MealPlanMainScreen";
import MealDetailScreen from "./screens/Nutrition/MealDetailScreen";

import CommunityFeedScreen from "./screens/Community/CommunityFeedScreen";
import CreatePostScreen from "./screens/Community/CreatePostScreen";
import PostDetailScreen from "./screens/Community/PostDetailScreen";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserDataProvider>
          <WorkoutProvider>
            <ArticleProvider>
              <NutritionProvider>
                <PostProvider>
                <Box maxW={"450px"} mx="auto" bgColor="#232323">
                  <Routes>
                    <Route path="/" element={<LaunchScreen />} />
                    <Route path="/onboarding" element={<OnboardingFlow />} />
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/signup" element={<SignUpScreen />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPasswordScreen />}
                    />
                    <Route
                      path="/set-password"
                      element={<SetPasswordScreen />}
                    />
                    <Route
                      path="/profile-setup"
                      element={<ProfileSetupFlow />}
                    />
                    <Route
                      path="/home"
                      element={
                        <ProtectedRoute>
                          <Home />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={<Navigate to="/home" replace />}
                    />
                    <Route
                      path="/progress"
                      element={
                        <ProtectedRoute>
                          <ProgressScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfileScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile/edit"
                      element={
                        <ProtectedRoute>
                          <EditProfileScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile/favorites"
                      element={
                        <ProtectedRoute>
                          <FavoritesScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <SettingsScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/help"
                      element={
                        <ProtectedRoute>
                          <HelpScreen />
                        </ProtectedRoute>
                      }
                    />

                    {}
                    <Route
                      path="/workout"
                      element={
                        <ProtectedRoute>
                          <WorkoutsScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/workout/create-routine"
                      element={
                        <ProtectedRoute>
                          <CreateRoutineScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/workout/:workoutId"
                      element={
                        <ProtectedRoute>
                          <WorkoutDetailScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/workout/:workoutId/exercise/:exerciseId"
                      element={
                        <ProtectedRoute>
                          <ExerciseDetailScreen />
                        </ProtectedRoute>
                      }
                    />

                    {}
                    <Route
                      path="/articles"
                      element={
                        <ProtectedRoute>
                          <ArticleListScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/articles/:articleId"
                      element={
                        <ProtectedRoute>
                          <ArticleDetailScreen />
                        </ProtectedRoute>
                      }
                    />

                    {}
                    <Route
                      path="/nutrition"
                      element={
                        <ProtectedRoute>
                          <NutritionRedirect />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/nutrition/setup"
                      element={
                        <ProtectedRoute>
                          <MealPlanSetupScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/nutrition/loading"
                      element={
                        <ProtectedRoute>
                          <MealPlanLoadingScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/nutrition/meals"
                      element={
                        <ProtectedRoute>
                          <MealPlanMainScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/nutrition/meals/:mealId"
                      element={
                        <ProtectedRoute>
                          <MealDetailScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/nutrition/meal-plan/:planId"
                      element={
                        <ProtectedRoute>
                          <MealPlanDetailScreen />
                        </ProtectedRoute>
                      }
                    />

                    {}
                    <Route
                      path="/community"
                      element={
                        <ProtectedRoute>
                          <CommunityFeedScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/community/create"
                      element={
                        <ProtectedRoute>
                          <CreatePostScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/community/post/:postId"
                      element={
                        <ProtectedRoute>
                          <PostDetailScreen />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Box>
                </PostProvider>
              </NutritionProvider>
            </ArticleProvider>
          </WorkoutProvider>
        </UserDataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
