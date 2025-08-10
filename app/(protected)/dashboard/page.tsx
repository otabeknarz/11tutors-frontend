"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useOnboarding } from "@/lib/OnboardingContext";

export default function DashboardPage() {
	const { user, loading: authLoading } = useAuth();
	const { t } = useLanguage();
	const { onboardingData } = useOnboarding();
	const router = useRouter();
	const [isRedirecting, setIsRedirecting] = useState(false);

	useEffect(() => {
		// Wait for auth to finish loading
		if (authLoading) return;

		// Debug logging
		console.log("Dashboard redirect logic:", {
			user: !!user,
			userId: user?.id,
			onboardingCompleted: onboardingData.completed,
			onboardingCurrentStep: onboardingData.currentStep,
			onboardingData: onboardingData
		});

		// If no user, redirect to login
		if (!user) {
			console.log("No user, redirecting to login");
			setIsRedirecting(true);
			router.replace("/login");
			return;
		}

		// If user exists but onboarding not completed, redirect to onboarding
		if (user && !onboardingData.completed) {
			console.log("User exists but onboarding not completed, redirecting to onboarding");
			setIsRedirecting(true);
			router.push("/onboarding/step1");
			return;
		}

		// If user exists and onboarding completed, redirect to dashboard home
		if (user && onboardingData.completed) {
			console.log("User exists and onboarding completed, redirecting to dashboard home");
			setIsRedirecting(true);
			router.replace("/dashboard/home");
			return;
		}
	}, [user, authLoading, onboardingData.completed, router]);

	// Show loading while auth is loading or while redirecting
	if (authLoading || isRedirecting) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-background">
				<div className="relative w-16 h-16">
					<div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
					<div className="absolute inset-2 rounded-full border-t-2 border-primary/50 animate-spin animate-reverse"></div>
				</div>
				<p className="mt-4 text-muted-foreground animate-pulse">
					{t("common.loading")}
				</p>
			</div>
		);
	}

	// This should never be reached, but just in case
	return null;
}
