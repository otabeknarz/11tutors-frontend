import { initiatePayment } from "./payment";
import { Course } from "@/types/course";
import { User } from "./AuthContext";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Extended course interface to handle both API response formats
interface EnrollmentCourse {
	id: string;
	slug: string;
	title: string;
	price?: string | number;
	is_enrolled?: boolean; // API format
	isEnrolled?: boolean; // Type format
	parts?: Array<{
		id: string;
		title: string;
		lessons: Array<{
			id: string;
			title: string;
			slug?: string; // Some lessons have slug, some don't
			duration: string;
		}>;
	}>;
}

export interface EnrollmentOptions {
	user: User | null;
	router: AppRouterInstance;
	course: EnrollmentCourse;
	onError: (error: string) => void;
	onLoadingChange: (loading: boolean) => void;
	t: (key: string) => string;
}

export interface EnrollmentResult {
	success: boolean;
	redirectPath?: string;
	error?: string;
}

/**
 * Centralized enrollment manager that handles course enrollment logic
 * including authentication checks, payment processing, and navigation
 */
export class EnrollmentManager {
	/**
	 * Handle course enrollment with comprehensive logic
	 * - Checks user authentication
	 * - Handles already enrolled users (navigate to first lesson)
	 * - Initiates payment process for non-enrolled users
	 * - Provides proper error handling and loading states
	 */
	static async handleEnrollment(
		options: EnrollmentOptions
	): Promise<EnrollmentResult> {
		const { user, router, course, onError, onLoadingChange, t } = options;

		// Check if user is authenticated
		if (!user) {
			router.push("/login");
			return { success: false, redirectPath: "/login" };
		}

		// If already enrolled, navigate to first lesson
		const isEnrolled = course.is_enrolled || course.isEnrolled;
		if (isEnrolled) {
			const firstLesson = course.parts?.[0]?.lessons?.[0];
			if (firstLesson && firstLesson.slug) {
				const redirectPath = `/courses/${course.slug}/${firstLesson.slug}`;
				router.push(redirectPath);
				return { success: true, redirectPath };
			} else {
				// If no lessons available, show error message
				const errorMessage = t("courseDetail.noLessonsAvailable");
				onError(errorMessage);
				return { success: false, error: errorMessage };
			}
		}

		// If not enrolled, initiate payment process
		try {
			onLoadingChange(true);
			onError(""); // Clear any previous errors

			// Initiate payment process
			await initiatePayment(course.id);

			return { success: true };
		} catch (err) {
			console.error("Payment initiation failed:", err);
			const errorMessage = `${t("courseDetail.paymentError")}: ${
				(err as Error).message || String(err)
			}`;
			onError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			onLoadingChange(false);
		}
	}

	/**
	 * Simple enrollment handler for course listing pages
	 * where we just need basic enrollment without detailed course structure
	 */
	static async handleSimpleEnrollment(
		courseId: string,
		courseSlug: string,
		user: User | null,
		router: AppRouterInstance
	): Promise<EnrollmentResult> {
		// Check if user is authenticated
		if (!user) {
			router.push("/login");
			return { success: false, redirectPath: "/login" };
		}

		try {
			// For simple enrollment, redirect to course detail page
			// where the full enrollment logic will be handled
			const redirectPath = `/courses/${courseSlug}`;
			router.push(redirectPath);
			return { success: true, redirectPath };
		} catch (error) {
			console.error("Error during simple enrollment:", error);
			return {
				success: false,
				error: "Failed to navigate to course page",
			};
		}
	}

	/**
	 * Check if a course requires payment
	 * @param course Course object
	 * @returns true if course requires payment, false if free or already enrolled
	 */
	static requiresPayment(course: EnrollmentCourse): boolean {
		// If already enrolled, no payment needed
		const isEnrolled = course.is_enrolled || course.isEnrolled;
		if (isEnrolled) {
			return false;
		}

		// If course is free, no payment needed
		if (
			course.price === 0 ||
			course.price === null ||
			course.price === undefined
		) {
			return false;
		}

		return true;
	}

	/**
	 * Get the appropriate button text based on course enrollment status
	 * @param course Course object
	 * @param t Translation function
	 * @returns Appropriate button text
	 */
	static getEnrollmentButtonText(
		course: EnrollmentCourse,
		t: (key: string) => string
	): string {
		const isEnrolled = course.is_enrolled || course.isEnrolled;
		if (isEnrolled) {
			return t("courseDetail.continue");
		}

		if (this.requiresPayment(course)) {
			return t("courseDetail.enroll");
		}

		return t("courseDetail.enroll");
	}

	/**
	 * Get enrollment status text
	 * @param course Course object
	 * @param t Translation function
	 * @returns Status text or null if not enrolled
	 */
	static getEnrollmentStatus(
		course: EnrollmentCourse,
		t: (key: string) => string
	): string | null {
		const isEnrolled = course.is_enrolled || course.isEnrolled;
		if (isEnrolled) {
			return t("courseDetail.enrolled");
		}
		return null;
	}
}
