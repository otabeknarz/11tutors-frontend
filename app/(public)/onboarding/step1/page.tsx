'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/OnboardingContext';
import { useLanguage } from '@/lib/LanguageContext';
import OnboardingProgress from '@/components/OnboardingProgress';

// List of popular universities
const UNIVERSITIES = [
  'Harvard University',
  'Stanford University',
  'Massachusetts Institute of Technology',
  'University of Oxford',
  'University of Cambridge',
  'California Institute of Technology',
  'Princeton University',
  'Yale University',
  'Columbia University',
  'University of Chicago',
  'Other'
];

export default function UniversityStep() {
  const { onboardingData, updateOnboardingData, nextStep } = useOnboarding();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [university, setUniversity] = useState(onboardingData.university || '');
  const [otherUniversity, setOtherUniversity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!university) {
      setError(t('errors.required'));
      return;
    }

    const finalUniversity = university === 'Other' ? otherUniversity : university;
    
    if (university === 'Other' && !otherUniversity) {
      setError(t('errors.required'));
      return;
    }

    updateOnboardingData({ university: finalUniversity });
    nextStep();
    router.push('/onboarding/step2');
  };

  return (
    <div className="space-y-6">
      <OnboardingProgress />
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('onboarding.university.title')}
        </h2>
        <p className="text-gray-500">
          {t('onboarding.university.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
            {t('onboarding.university.select')}
          </label>
          <select
            id="university"
            name="university"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={university}
            onChange={(e) => {
              setUniversity(e.target.value);
              setError('');
            }}
          >
            <option value="">{t('onboarding.university.placeholder')}</option>
            {UNIVERSITIES.map((uni) => (
              <option key={uni} value={uni}>{uni}</option>
            ))}
          </select>
        </div>

        {university === 'Other' && (
          <div>
            <label htmlFor="otherUniversity" className="block text-sm font-medium text-gray-700 mb-1">
              {t('onboarding.university.other')}
            </label>
            <input
              type="text"
              id="otherUniversity"
              name="otherUniversity"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={otherUniversity}
              onChange={(e) => {
                setOtherUniversity(e.target.value);
                setError('');
              }}
              placeholder={t('onboarding.university.otherPlaceholder')}
            />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {t('onboarding.buttons.skip')}
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
