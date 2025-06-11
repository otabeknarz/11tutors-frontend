'use client';

import React from 'react';
import { useOnboarding } from '@/lib/OnboardingContext';
import { useLanguage } from '@/lib/LanguageContext';

export default function OnboardingProgress() {
  const { onboardingData } = useOnboarding();
  const { t } = useLanguage();
  
  const totalSteps = 5; // Total number of onboarding steps
  const currentStep = onboardingData.currentStep;
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-indigo-600">
          {t('onboarding.step')} {currentStep} {t('onboarding.of')} {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-500">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
