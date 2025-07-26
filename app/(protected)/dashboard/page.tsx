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
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user && !onboardingData.completed) {
			router.push("/onboarding");
		} else {
			setLoading(false);
		}
	}, [user, onboardingData, router]);

	if (loading || authLoading) {
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

	if (!user && typeof window !== "undefined") {
		router.replace("/login");
		return null;
	} else {
		router.replace("/dashboard/home");
		return null;
	}
}
