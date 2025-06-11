'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/OnboardingContext';
import { useLanguage } from '@/lib/LanguageContext';
import OnboardingProgress from '@/components/OnboardingProgress';

export default function AgeStep() {
  const { onboardingData, updateOnboardingData, nextStep, prevStep } = useOnboarding();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [age, setAge] = useState(onboardingData.age?.toString() || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!age) {
      setError(t('errors.required'));
      return;
    }

    const ageNum = parseInt(age, 10);
    
    if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
      setError(t('onboarding.age.invalid'));
      return;
    }

    updateOnboardingData({ age: ageNum });
    nextStep();
    router.push('/onboarding/step3');
  };

  const handleBack = () => {
    prevStep();
    router.push('/onboarding/step1');
  };

  return (
    <div className="space-y-6">
      <OnboardingProgress />
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('onboarding.age.title')}
        </h2>
        <p className="text-gray-500">
          {t('onboarding.age.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            {t('onboarding.age.label')}
          </label>
          <input
            type="number"
            id="age"
            name="age"
            min="16"
            max="100"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              setError('');
            }}
            placeholder={t('onboarding.age.placeholder')}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {t('onboarding.buttons.back')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {t('onboarding.buttons.next')}
          </button>
        </div>
      </form>
    </div>
  );
}
