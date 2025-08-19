"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { University } from "@/app/(public)/onboarding/step1/page";
import api from "@/lib/api";

export interface OnboardingData {
	university?: University;
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
	clearOnboardingData: () => void;
	submitOnboardingAnswers: () => Promise<void>;
	checkOnboardingStatus: () => Promise<boolean>;
}

const defaultOnboardingData: OnboardingData = {
	university: undefined,
	age: undefined,
	degree: "",
	graduationYear: undefined,
	interests: [],
	completed: false,
	currentStep: 1,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
	undefined
);

export function useOnboarding() {
	const context = useContext(OnboardingContext);
	if (context === undefined) {
		throw new Error("useOnboarding must be used within an OnboardingProvider");
	}
	return context;
}

interface OnboardingProviderProps {
	children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
	const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
		// Check if we have stored onboarding data in localStorage
		if (typeof window !== "undefined") {
			const savedData = localStorage.getItem("11tutors-onboarding");
			const currentUserId = localStorage.getItem("currentUserId");
			const onboardingUserId = localStorage.getItem("onboardingUserId");

			// If the current user is different from the onboarding user, reset onboarding
			if (
				currentUserId &&
				onboardingUserId &&
				currentUserId !== onboardingUserId
			) {
				localStorage.removeItem("11tutors-onboarding");
				localStorage.setItem("onboardingUserId", currentUserId);
				return defaultOnboardingData;
			}

			// If we have a current user but no onboarding user ID set, this is a new user
			if (currentUserId && !onboardingUserId) {
				localStorage.setItem("onboardingUserId", currentUserId);
				// For new users, always start with fresh onboarding data
				if (savedData) {
					localStorage.removeItem("11tutors-onboarding");
				}
				return defaultOnboardingData;
			}

			if (savedData) {
				try {
					const parsedData = JSON.parse(savedData);
					// Validate that the data has the expected structure and isn't corrupted
					if (
						parsedData &&
						typeof parsedData === "object" &&
						typeof parsedData.completed === "boolean" &&
						typeof parsedData.currentStep === "number"
					) {
						return parsedData;
					} else {
						// Data is corrupted, reset to defaults
						console.warn("Onboarding data is corrupted, resetting to defaults");
						localStorage.removeItem("11tutors-onboarding");
						return defaultOnboardingData;
					}
				} catch (error) {
					console.error(
						"Failed to parse onboarding data from localStorage",
						error
					);
					localStorage.removeItem("11tutors-onboarding");
				}
			}
		}
		return defaultOnboardingData;
	});

	// Save onboarding data to localStorage whenever it changes
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem(
				"11tutors-onboarding",
				JSON.stringify(onboardingData)
			);
		}
	}, [onboardingData]);

	const updateOnboardingData = (data: Partial<OnboardingData>) => {
		setOnboardingData((prev) => ({ ...prev, ...data }));
	};

	const nextStep = () => {
		setOnboardingData((prev) => ({
			...prev,
			currentStep: prev.currentStep + 1,
		}));
	};

	const prevStep = () => {
		setOnboardingData((prev) => ({
			...prev,
			currentStep: prev.currentStep > 1 ? prev.currentStep - 1 : 1,
		}));
	};

	const resetOnboarding = () => {
		setOnboardingData(defaultOnboardingData);
		// Also clear localStorage data
		if (typeof window !== "undefined") {
			localStorage.removeItem("11tutors-onboarding");
			localStorage.removeItem("onboardingUserId");
		}
	};

	// Function to completely clear onboarding data (useful for testing)
	const clearOnboardingData = () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("11tutors-onboarding");
			localStorage.removeItem("onboardingUserId");
			localStorage.removeItem("currentUserId");
		}
		setOnboardingData(defaultOnboardingData);
	};

	// Submit onboarding answers to backend
	const submitOnboardingAnswers = async () => {
		if (
			!onboardingData.university ||
			!onboardingData.degree ||
			!onboardingData.graduationYear ||
			!onboardingData.interests
		) {
			throw new Error("Missing required onboarding data");
		}

		const payload = {
			university: onboardingData.university.id,
			degree: onboardingData.degree,
			graduation_year: onboardingData.graduationYear,
			interests: onboardingData.interests.join(","),
		};

		try {
			await api.post("/api/auth/onboarding-answers/", payload);
		} catch (error) {
			console.error("Failed to submit onboarding answers:", error);
			throw error;
		}
	};

	// Check if user has completed onboarding by fetching from backend
	const checkOnboardingStatus = async (): Promise<boolean> => {
		try {
			const response = await api.get("/api/auth/onboarding-answers/");
			// If we get data back, user has completed onboarding
			return response.data.results && response.data.results.length > 0;
		} catch (error) {
			console.error("Failed to check onboarding status:", error);
			// If error (like 404), user hasn't completed onboarding
			return false;
		}
	};

	const value = {
		onboardingData,
		updateOnboardingData,
		nextStep,
		prevStep,
		resetOnboarding,
		clearOnboardingData,
		submitOnboardingAnswers,
		checkOnboardingStatus,
	};

	return (
		<OnboardingContext.Provider value={value}>
			{children}
		</OnboardingContext.Provider>
	);
}
