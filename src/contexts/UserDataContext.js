import React, { createContext, useContext, useState, useEffect } from 'react';

const UserDataContext = createContext();

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export const UserDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    
    // Profile Setup Data
    gender: '',
    age: '',
    weight: '',
    weightUnit: 'kg',
    height: '',
    heightUnit: 'cm',
    goal: '',
    activityLevel: '',
    
    // Additional Profile Info
    profilePicture: null,
    bio: '',
    
    // Preferences
    notifications: true,
    units: 'metric', // metric or imperial
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading] = useState(false); // Keep for backward compatibility

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      setProfileData(JSON.parse(savedData));
    }
    
    const savedStep = localStorage.getItem('currentStep');
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
  }, [profileData]);

  // Save current step whenever it changes
  useEffect(() => {
    localStorage.setItem('currentStep', currentStep.toString());
  }, [currentStep]);

  const updateProfileData = (newData) => {
    setProfileData(prev => ({
      ...prev,
      ...newData,
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const resetProfileData = () => {
    setProfileData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      gender: '',
      age: '',
      weight: '',
      weightUnit: 'kg',
      height: '',
      heightUnit: 'cm',
      goal: '',
      activityLevel: '',
      profilePicture: null,
      bio: '',
      notifications: true,
      units: 'metric',
    });
    setCurrentStep(0);
    localStorage.removeItem('profileData');
    localStorage.removeItem('currentStep');
  };

  // Clear temporary profile setup data after successful completion
  const clearProfileSetupData = () => {
    console.log('🧹 Clearing temporary profile setup data...');

    // Remove from localStorage
    localStorage.removeItem('profileData');
    localStorage.removeItem('currentStep');

    // Reset state to initial values
    setCurrentStep(0);
    setProfileData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      gender: '',
      age: '',
      weight: '',
      weightUnit: 'kg',
      height: '',
      heightUnit: 'cm',
      goal: '',
      activityLevel: '',
      profilePicture: null,
      bio: '',
      notifications: true,
      units: 'metric',
    });

    console.log('✅ Profile setup data cleared successfully');
  };

  // Get current profile data for coordination with AuthContext
  const getProfileSetupData = () => {
    return { ...profileData };
  };

  // Check if profile setup is complete (has required fields)
  const isProfileSetupComplete = () => {
    const requiredFields = ['gender', 'age', 'weight', 'height', 'goal', 'activityLevel'];
    return requiredFields.every(field => profileData[field] && profileData[field] !== '');
  };

  // Legacy method for backward compatibility - now delegates to clearProfileSetupData
  const saveProfile = async () => {
    console.log('⚠️ saveProfile is deprecated, use clearProfileSetupData instead');
    clearProfileSetupData();
    return { success: true };
  };

  const value = {
    profileData,
    currentStep,
    isLoading,
    updateProfileData,
    nextStep,
    prevStep,
    goToStep,
    resetProfileData,
    saveProfile, // Legacy method
    clearProfileSetupData,
    getProfileSetupData,
    isProfileSetupComplete,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
