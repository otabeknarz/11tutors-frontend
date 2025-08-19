"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/lib/OnboardingContext";
import { useLanguage } from "@/lib/LanguageContext";
import OnboardingProgress from "@/components/OnboardingProgress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Home } from "lucide-react";
import api from "@/lib/api";

// University interface based on API response
export interface University {
	id: number;
	name: string;
	description: string;
	logo: string | null;
	website: string;
	country: string;
	city: string;
	location: string;
	global_rank: number | null;
	country_rank: number | null;
	created_at: string;
	updated_at: string;
}

interface UniversityApiResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: University[];
}

export default function UniversityStep() {
	const { onboardingData, updateOnboardingData, nextStep } = useOnboarding();
	const { t } = useLanguage();
	const router = useRouter();

	const [university, setUniversity] = useState(
		typeof onboardingData.university === "string"
			? onboardingData.university
			: onboardingData.university?.name || ""
	);
	const [error, setError] = useState("");
	const [universities, setUniversities] = useState<University[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [apiError, setApiError] = useState("");

	// Fetch universities from API
	useEffect(() => {
		const fetchUniversities = async () => {
			try {
				setIsLoading(true);
				const response = await api.get("/api/core/universities/");

				if (!response.data) {
					throw new Error("Failed to fetch universities");
				}

				const data: UniversityApiResponse = response.data;
				setUniversities(data.results);
				setApiError("");
			} catch (err) {
				console.error("Error fetching universities:", err);
				setApiError("Failed to load universities. Please try again.");
				// Fallback to basic options if API fails
				setUniversities([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUniversities();
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!university) {
			setError(t("errors.required") || "This field is required");
			return;
		}

		// Find the selected university object
		const selectedUniversity = universities.find(
			(uni) => uni.name === university
		);

		if (!selectedUniversity) {
			setError("Selected university not found");
			return;
		}

		updateOnboardingData({ university: selectedUniversity });
		nextStep();
		router.push("/onboarding/step2");
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6 sm:space-y-8"
		>
			<OnboardingProgress />

			{/* Header Section */}
			<div className="text-center space-y-2 sm:space-y-3">
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
					className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4"
				>
					<GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
				</motion.div>
				<h1 className="text-2xl sm:text-3xl font-bold text-foreground px-2">
					{t("onboarding.university.title") || "What's your university?"}
				</h1>
				<p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto px-4">
					{t("onboarding.university.subtitle") ||
						"Help us personalize your learning experience"}
				</p>
			</div>

			{/* Form Section */}
			<motion.form
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
				onSubmit={handleSubmit}
				className="space-y-6"
			>
				<div className="space-y-3">
					<Label htmlFor="university" className="text-sm font-medium">
						{t("onboarding.university.select") || "Select your university"}
					</Label>

					{isLoading ? (
						<Skeleton className="h-12 w-full" />
					) : (
						<Select
							value={university}
							onValueChange={(value) => {
								setUniversity(value);
								setError("");
							}}
							disabled={isLoading}
						>
							<SelectTrigger className="h-12">
								<SelectValue
									placeholder={
										isLoading
											? "Loading universities..."
											: t("onboarding.university.placeholder") ||
											  "Choose your university"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{universities.map((uni: University) => (
									<SelectItem key={uni.id} value={uni.name}>
										<div className="flex flex-col">
											<span className="font-medium">{uni.name}</span>
											<span className="text-xs text-muted-foreground">
												{uni.city}, {uni.country}
												{uni.global_rank && ` • Rank #${uni.global_rank}`}
											</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}

					{apiError && (
						<Alert variant="destructive">
							<AlertDescription>{apiError}</AlertDescription>
						</Alert>
					)}
				</div>

				{error && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					</motion.div>
				)}

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push("/")}
						className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
					>
						<Home className="w-4 h-4 mr-2" />
						{t("onboarding.buttons.skip") || "Skip for now"}
					</Button>
					<Button
						type="submit"
						className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
						disabled={!university}
					>
						{t("onboarding.buttons.next") || "Continue"}
						<ArrowRight className="w-4 h-4 ml-2" />
					</Button>
				</div>
			</motion.form>
		</motion.div>
	);
}
