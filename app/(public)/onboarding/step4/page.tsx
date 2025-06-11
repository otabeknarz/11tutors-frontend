'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/OnboardingContext';
import { useLanguage } from '@/lib/LanguageContext';
import OnboardingProgress from '@/components/OnboardingProgress';

export default function GraduationYearStep() {
  const { onboardingData, updateOnboardingData, nextStep, prevStep } = useOnboarding();
  const { t } = useLanguage();
  const router = useRouter();
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
  
  const [graduationYear, setGraduationYear] = useState(onboardingData.graduationYear?.toString() || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!graduationYear) {
      setError(t('errors.required'));
      return;
    }

    const yearNum = parseInt(graduationYear, 10);
    
    if (isNaN(yearNum) || yearNum < currentYear || yearNum > currentYear + 14) {
      setError(t('onboarding.graduationYear.invalid'));
      return;
    }

    updateOnboardingData({ graduationYear: yearNum });
    nextStep();
    router.push('/onboarding/step5');
  };

  const handleBack = () => {
    prevStep();
    router.push('/onboarding/step3');
  };

  return (
    <div className="space-y-6">
      <OnboardingProgress />
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('onboarding.graduationYear.title')}
        </h2>
        <p className="text-gray-500">
          {t('onboarding.graduationYear.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
            {t('onboarding.graduationYear.label')}
          </label>
          <select
            id="graduationYear"
            name="graduationYear"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={graduationYear}
            onChange={(e) => {
              setGraduationYear(e.target.value);
              setError('');
            }}
          >
            <option value="">{t('onboarding.graduationYear.placeholder')}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {t('onboarding.graduationYear.classOf')} {year}
              </option>
            ))}
          </select>
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
