'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OnboardingData {
  university?: string;
  age?: number;
  degree?: string;
  graduationYear?: number;
  interests?: string[];
  completed: boolean;
  currentStep: number;
}

interface OnboardingContextType {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetOnboarding: () => void;
}

const defaultOnboardingData: OnboardingData = {
  university: '',
  age: undefined,
  degree: '',
  graduationYear: undefined,
  interests: [],
  completed: false,
  currentStep: 1,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
    // Check if we have stored onboarding data in localStorage
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('11tutors-onboarding');
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (error) {
          console.error('Failed to parse onboarding data from localStorage', error);
        }
      }
    }
    return defaultOnboardingData;
  });

  // Save onboarding data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('11tutors-onboarding', JSON.stringify(onboardingData));
    }
  }, [onboardingData]);

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setOnboardingData(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const prevStep = () => {
    setOnboardingData(prev => ({ 
      ...prev, 
      currentStep: prev.currentStep > 1 ? prev.currentStep - 1 : 1 
    }));
  };

  const resetOnboarding = () => {
    setOnboardingData(defaultOnboardingData);
  };

  const value = {
    onboardingData,
    updateOnboardingData,
    nextStep,
    prevStep,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}
