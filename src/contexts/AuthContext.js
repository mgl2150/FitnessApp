import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const result = await api.auth.login(username, password);

      if (result.success) {
        const userData = result.data;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const result = await api.auth.signup(userData);

      if (result.success) {
        const newUser = result.data;
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    try {
      const result = await api.auth.forgotPassword(email);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setIsLoading(true);
    try {
      const result = await api.auth.resetPassword(token, newPassword);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user || !user._id) {
      return { success: false, error: 'User not authenticated' };
    }

    setIsLoading(true);
    try {
      const passwordData = {
        oldPassword: currentPassword,
        password: newPassword,
      };

      const result = await api.auth.changePassword(user._id, passwordData);

      if (result.success) {
        return { success: true, message: 'Password changed successfully' };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    if (!user || !user._id) {
      console.error('❌ UpdateProfile: User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    console.log('🔄 UpdateProfile: Starting update for user', user._id, 'with data:', profileData);
    setIsLoading(true);
    try {
      const result = await api.profile.updateProfile(user._id, profileData);
      console.log('📥 UpdateProfile: API response:', result);

      if (result.success) {
        console.log('✅ UpdateProfile: Success, updating user state');
        const updatedUser = { ...user, ...result.data };
        console.log('👤 UpdateProfile: Updated user data:', updatedUser);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true, data: updatedUser };
      } else {
        console.error('❌ UpdateProfile: API returned error:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ UpdateProfile: Exception occurred:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfileSetup = async (profileSetupData) => {
    if (!user || !user._id) {
      return { success: false, error: 'User not authenticated' };
    }

    setIsLoading(true);
    try {

      const profileData = {
        firstName: profileSetupData.firstName,
        lastName: profileSetupData.lastName,
        gender: profileSetupData.gender,
        age: parseInt(profileSetupData.age),
        weight: parseFloat(profileSetupData.weight),
        weightUnit: profileSetupData.weightUnit,
        height: parseFloat(profileSetupData.height),
        heightUnit: profileSetupData.heightUnit,
        goal: profileSetupData.goal,
        activityLevel: profileSetupData.activityLevel,
        bio: profileSetupData.bio || '',
        notifications: profileSetupData.notifications !== false,
        units: profileSetupData.units || 'metric',
      };

      if (profileSetupData.profilePicture) {
        profileData.profilePicture = profileSetupData.profilePicture;
      }

      const result = await api.profile.updateProfile(user._id, profileData);

      if (result.success) {

        const updatedUser = { ...user, ...result.data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        console.log('✅ Profile setup completed successfully:', updatedUser);
        return { success: true, data: updatedUser };
      } else {
        console.error('❌ Profile setup failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Profile setup error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (!user || !user._id) {
      return { success: false, error: 'User not authenticated' };
    }

    setIsLoading(true);
    try {
      const result = await api.profile.getProfile(user._id);

      if (result.success) {
        const updatedUser = { ...user, ...result.data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true, data: updatedUser };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    completeProfileSetup,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
