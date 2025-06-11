'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/OnboardingContext';

export default function OnboardingPage() {
  const { onboardingData } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the current step
    if (onboardingData.completed) {
      router.push('/dashboard');
    } else {
      router.push(`/onboarding/step${onboardingData.currentStep}`);
    }
  }, [onboardingData, router]);

  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
}
