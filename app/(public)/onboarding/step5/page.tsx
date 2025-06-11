'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/OnboardingContext';
import { useLanguage } from '@/lib/LanguageContext';
import OnboardingProgress from '@/components/OnboardingProgress';

// List of common academic interests
const INTERESTS = [
  'Mathematics',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Business',
  'Economics',
  'Psychology',
  'Sociology',
  'Literature',
  'History',
  'Philosophy',
  'Art',
  'Music',
  'Medicine',
  'Law',
  'Political Science',
  'Environmental Science',
  'Languages'
];

export default function InterestsStep() {
  const { onboardingData, updateOnboardingData, prevStep } = useOnboarding();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>(onboardingData.interests || []);
  const [error, setError] = useState('');

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      } else {
        return [...prev, interest];
      }
    });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedInterests.length === 0) {
      setError(t('onboarding.interests.required'));
      return;
    }

    updateOnboardingData({ 
      interests: selectedInterests,
      completed: true,
      currentStep: 5
    });
    
    // Redirect to dashboard after completing onboarding
    router.push('/dashboard');
  };

  const handleBack = () => {
    prevStep();
    router.push('/onboarding/step4');
  };

  return (
    <div className="space-y-6">
      <OnboardingProgress />
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('onboarding.interests.title')}
        </h2>
        <p className="text-gray-500">
          {t('onboarding.interests.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('onboarding.interests.select')} ({t('onboarding.interests.selectMultiple')})
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INTERESTS.map((interest) => (
              <div 
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`
                  cursor-pointer p-3 border rounded-md text-sm text-center transition-colors
                  ${selectedInterests.includes(interest) 
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
                `}
              >
                {interest}
              </div>
            ))}
          </div>
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
            {t('onboarding.buttons.finish')}
          </button>
        </div>
      </form>
    </div>
  );
}
