"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import api from "@/lib/api";
import { EnrollmentManager } from "@/lib/enrollmentManager";

// Components
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CourseHero from "@/components/course/CourseHero";
import CourseThumbnailCard from "@/components/course/CourseThumbnailCard";
import CourseTabs from "@/components/course/CourseTabs";
import {
	LoadingState,
	ErrorState,
	NotFoundState,
} from "@/components/course/CourseStates";

// Define types based on the API response
interface Tutor {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
}

interface Lesson {
	id: string;
	title: string;
	slug: string;
	order: number;
	duration: string;
	created_at: string;
}

interface CoursePart {
	id: string;
	title: string;
	order: number;
	lessons: Lesson[];
}

interface CourseDetail {
	id: string;
	title: string;
	slug: string;
	description: string;
	thumbnail: string;
	tutors: Tutor[];
	parts: CoursePart[];
	created_at: string;
	updated_at: string;
	level?: string;
	rating?: number;
	students?: number;
	duration?: string;
	price?: string | number;
	is_enrolled?: boolean;
}

export default function CourseDetailPage() {
	const { slug } = useParams();
	const { t } = useLanguage();
	const { user } = useAuth();
	const [course, setCourse] = useState<CourseDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [paymentLoading, setPaymentLoading] = useState(false);

	// Calculate total duration of the course
	const getTotalDuration = (parts: CoursePart[]): string => {
		let totalMinutes = 0;
		let totalSeconds = 0;

		parts.forEach((part) => {
			part.lessons.forEach((lesson) => {
				const [hours, minutes, seconds] = lesson.duration
					.split(":")
					.map(Number);
				totalMinutes += hours * 60 + minutes;
				totalSeconds += seconds;
			});
		});

		// Adjust for overflow seconds
		totalMinutes += Math.floor(totalSeconds / 60);
		totalSeconds = totalSeconds % 60;

		const hours = Math.floor(totalMinutes / 60);
		const mins = totalMinutes % 60;

		if (hours > 0) {
			return `${hours}h ${mins}m`;
		}
		return `${mins}m`;
	};

	// Count total lessons
	const getTotalLessons = (parts: CoursePart[]): number => {
		return parts.reduce((total, part) => total + part.lessons.length, 0);
	};

	const handleLessonClick = (lesson: Lesson) => {
		router.push(`/courses/${slug}/${lesson.slug}`);
	};

	// Handle enrollment/payment or continue learning
	const handleEnrollment = async () => {
		if (!course) return;

		// Use the centralized enrollment manager
		await EnrollmentManager.handleEnrollment({
			user,
			router,
			course,
			onError: (error) => setError(error),
			onLoadingChange: (loading) => setPaymentLoading(loading),
			t,
		});
	};

	// Fetch course details
	useEffect(() => {
		const fetchCourseDetail = async () => {
			try {
				setLoading(true);
				setError(null);

				// Use the COURSE_DETAIL endpoint with the slug
				const response = await api.get(`/api/courses/courses/${slug}/`);

				setCourse(response.data);
			} catch (err) {
				console.error("Error fetching course details:", err);
				setError(
					`${t("courseDetail.errorFetching")}: ${
						(err as Error).message || String(err)
					}`
				);
			} finally {
				setLoading(false);
			}
		};

		if (slug) {
			fetchCourseDetail();
		}
	}, [slug, t]);

	// Error state
	if (error) {
		return (
			<div className="min-h-screen bg-background">
				<Navbar />
				<ErrorState error={error} onRetry={() => window.location.reload()} />
				<Footer />
			</div>
		);
	}

	// Loading state
	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<Navbar />
				<LoadingState />
				<Footer />
			</div>
		);
	}

	// Course not found state
	if (!course) {
		return (
			<div className="min-h-screen bg-background">
				<Navbar />
				<NotFoundState />
				<Footer />
			</div>
		);
	}

	// Calculate total lessons and total duration
	const totalDuration = getTotalDuration(course.parts);
	const totalLessons = getTotalLessons(course.parts);

	// Format course description or show placeholder
	const courseDescription =
		course.description || t("courseDetail.noDescription");

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			{/* Mobile-first Course Layout */}
			<div className="container mx-auto px-4 py-8">
				{/* Mobile: Thumbnail first, Desktop: Side by side */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Mobile: Course thumbnail card first */}
					<div className="lg:hidden">
						<CourseThumbnailCard
							thumbnail={course.thumbnail}
							title={course.title}
							price={course.price}
							totalLessons={totalLessons}
							totalDuration={totalDuration}
							onEnroll={handleEnrollment}
							paymentLoading={paymentLoading}
							isEnrolled={course.is_enrolled}
						/>
					</div>

					{/* Course Hero Section */}
					<div className="lg:col-span-2">
						<CourseHero
							title={course.title}
							description={courseDescription}
							tutors={course.tutors}
							totalLessons={totalLessons}
							totalDuration={totalDuration}
							updatedAt={course.updated_at}
						/>
					</div>

					{/* Desktop: Course thumbnail card on the side */}
					<div className="hidden lg:block">
						<div className="sticky top-24">
							<CourseThumbnailCard
								thumbnail={course.thumbnail}
								title={course.title}
								price={course.price}
								totalLessons={totalLessons}
								totalDuration={totalDuration}
								onEnroll={handleEnrollment}
								paymentLoading={paymentLoading}
								isEnrolled={course.is_enrolled}
							/>
						</div>
					</div>
				</div>

				{/* Course Content Tabs */}
				<div className="mt-12">
					<CourseTabs
						parts={course.parts}
						description={courseDescription}
						totalLessons={totalLessons}
						totalDuration={totalDuration}
						onLessonClick={handleLessonClick}
					/>
				</div>
			</div>

			<Footer />
		</div>
	);
}
