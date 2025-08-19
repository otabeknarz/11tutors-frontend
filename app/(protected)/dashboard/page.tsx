"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useOnboarding } from "@/lib/OnboardingContext";

export default function DashboardPage() {
	const { user, loading: authLoading } = useAuth();
	const { t } = useLanguage();
	const { checkOnboardingStatus } = useOnboarding();
	const router = useRouter();
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);

	useEffect(() => {
		const checkUserAndOnboarding = async () => {
			// Wait for auth to finish loading
			if (authLoading) return;

			// If no user, redirect to login
			if (!user) {
				console.log("No user, redirecting to login");
				setIsRedirecting(true);
				router.replace("/login");
				return;
			}

			// Check onboarding status from backend
			setIsCheckingOnboarding(true);
			try {
				const hasCompletedOnboarding = await checkOnboardingStatus();

				console.log("Dashboard redirect logic:", {
					user: !!user,
					userId: user?.id,
					hasCompletedOnboarding,
				});

				if (!hasCompletedOnboarding) {
					console.log(
						"User exists but onboarding not completed, redirecting to onboarding"
					);
					setIsRedirecting(true);
					router.push("/onboarding/step1");
					return;
				}

				// If user exists and onboarding completed, redirect to dashboard home
				console.log(
					"User exists and onboarding completed, redirecting to dashboard home"
				);
				setIsRedirecting(true);
				router.replace("/dashboard/home");
			} catch (error) {
				console.error("Error checking onboarding status:", error);
				// On error, assume onboarding not completed
				setIsRedirecting(true);
				router.push("/onboarding/step1");
			} finally {
				setIsCheckingOnboarding(false);
			}
		};

		checkUserAndOnboarding();
	}, [user, authLoading, router, checkOnboardingStatus]);

	// Show loading while auth is loading, checking onboarding, or redirecting
	if (authLoading || isCheckingOnboarding || isRedirecting) {
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
