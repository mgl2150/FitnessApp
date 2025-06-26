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

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
  }, [profileData]);

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

  const clearProfileSetupData = () => {
    console.log('🧹 Clearing temporary profile setup data...');

    localStorage.removeItem('profileData');
    localStorage.removeItem('currentStep');

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

  const getProfileSetupData = () => {
    return { ...profileData };
  };

  const isProfileSetupComplete = () => {
    const requiredFields = ['gender', 'age', 'weight', 'height', 'goal', 'activityLevel'];
    return requiredFields.every(field => profileData[field] && profileData[field] !== '');
  };

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
    saveProfile,
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
