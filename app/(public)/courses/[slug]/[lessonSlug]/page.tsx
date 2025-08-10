"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { COURSE_ENDPOINTS } from "@/lib/constants";
import { motion } from "framer-motion";
import { useMediaQuery } from "../../../../../hooks/use-media-query";

// UI Components
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";

// Custom Lesson Components
import { VideoPlayer } from "@/components/lesson/VideoPlayer";
import { CourseNavigation } from "@/components/lesson/CourseNavigation";
import { LessonActions } from "@/components/lesson/LessonActions";
import { LessonContent } from "@/components/lesson/LessonContent";
import { CommentsSection } from "@/components/lesson/CommentsSection";
import { ShareOptions } from "@/components/lesson/ShareOptions";
import { LessonTabs } from "@/components/lesson/LessonTabs";

// Layout Components
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import api from "@/lib/api";

// Define types
interface Lesson {
	id: string;
	title: string;
	description: string;
	is_free_preview: boolean;
	order: number;
	otp: string;
	playbackInfo: string;
	duration: string;
	created_at: string;
}

interface Part {
	id: string;
	title: string;
	order: number;
	lessons: Lesson[];
}

interface Course {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	slug: string;
	parts: Part[];
	tutors: {
		first_name: string;
		last_name: string;
		avatar: string | null;
	}[];
	is_enrolled?: boolean;
}

export default function LessonPageRefactored() {
	const { slug, lessonSlug } = useParams();
	const { t } = useLanguage();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	// State
	const [lesson, setLesson] = useState<Lesson | null>(null);
	const [course, setCourse] = useState<Course | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showComments, setShowComments] = useState(false);
	const [showShare, setShowShare] = useState(false);

	// Fetch lesson and course data
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);

				// Fetch lesson data
				const lessonResponse = await api.get(
					`${COURSE_ENDPOINTS.LESSONS}${lessonSlug}/`
				);
				setLesson(lessonResponse.data);

				// Fetch course data
				const courseResponse = await api.get(
					`${COURSE_ENDPOINTS.COURSES}${slug}/`
				);
				setCourse(courseResponse.data);
			} catch (err) {
				console.error("Error fetching data:", err);
				setError(
					t("lessonDetail.errorFetching") || "Error fetching lesson details"
				);
			} finally {
				setLoading(false);
			}
		};

		if (slug && lessonSlug) {
			fetchData();
		}
	}, [slug, lessonSlug, t]);

	// Render comments UI based on device
	const renderCommentsUI = () => {
		if (!lesson) return null;

		if (isDesktop) {
			return (
				<Dialog open={showComments} onOpenChange={setShowComments}>
					<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>
								{t("lessonDetail.comments") || "Comments"}
							</DialogTitle>
							<DialogDescription>
								{t("lessonDetail.commentsDescription") ||
									"Share your thoughts about this lesson"}
							</DialogDescription>
						</DialogHeader>
						<CommentsSection lesson={lesson} />
					</DialogContent>
				</Dialog>
			);
		}

		return (
			<Drawer open={showComments} onOpenChange={setShowComments}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>
							{t("lessonDetail.comments") || "Comments"}
						</DrawerTitle>
						<DrawerDescription>
							{t("lessonDetail.commentsDescription") ||
								"Share your thoughts about this lesson"}
						</DrawerDescription>
					</DrawerHeader>
					<div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
						<CommentsSection lesson={lesson} />
					</div>
					<DrawerFooter />
				</DrawerContent>
			</Drawer>
		);
	};

	// Render share UI based on device
	const renderShareUI = () => {
		if (!lesson || !course) return null;

		if (isDesktop) {
			return (
				<Dialog open={showShare} onOpenChange={setShowShare}>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle>{t("lessonDetail.share") || "Share"}</DialogTitle>
							<DialogDescription>
								{t("lessonDetail.shareDescription") ||
									"Share this lesson with others"}
							</DialogDescription>
						</DialogHeader>
						<ShareOptions lesson={lesson} course={course} />
					</DialogContent>
				</Dialog>
			);
		}

		return (
			<Drawer open={showShare} onOpenChange={setShowShare}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>{t("lessonDetail.share") || "Share"}</DrawerTitle>
						<DrawerDescription>
							{t("lessonDetail.shareDescription") ||
								"Share this lesson with others"}
						</DrawerDescription>
					</DrawerHeader>
					<div className="px-4 pb-4">
						<ShareOptions lesson={lesson} course={course} />
					</div>
					<DrawerFooter />
				</DrawerContent>
			</Drawer>
		);
	};

	// Loading state
	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<Navbar />
				<main className="container mx-auto px-4 py-8">
					<div className="text-center">
						<p>{t("lessonDetail.loading") || "Loading lesson..."}</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	// Error state
	if (error || !lesson || !course) {
		return (
			<div className="min-h-screen bg-background">
				<Navbar />
				<main className="container mx-auto px-4 py-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold mb-4">
							{t("lessonDetail.error") || "Error"}
						</h1>
						<p className="text-muted-foreground mb-4">
							{error || t("lessonDetail.notFound") || "Lesson not found"}
						</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<main className="container mx-auto px-4 py-8">
				<section className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
						{/* Course Navigation - Left Sidebar */}
						<div className="lg:col-span-4 order-2 lg:order-1">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5 }}
							>
								<CourseNavigation
									course={course}
									currentLesson={lesson}
									courseSlug={slug as string}
								/>
							</motion.div>
						</div>

						{/* Video Player and Content - Right Side */}
						<div className="lg:col-span-8 order-1 lg:order-2">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
							>
								{/* Video Player */}
								<VideoPlayer
									lesson={lesson}
									courseId={course.id}
									isEnrolled={course.is_enrolled || false}
								/>

								{/* Lesson Actions */}
								<LessonActions
									onCommentsClick={() => setShowComments(true)}
									onShareClick={() => setShowShare(true)}
									className="mb-6"
								/>

								{/* Lesson Content */}
								<LessonContent lesson={lesson} />

								{/* Lesson Tabs */}
								<LessonTabs />
							</motion.div>
						</div>
					</div>
				</section>
			</main>

			{/* Render Modal/Drawer UIs */}
			{renderCommentsUI()}
			{renderShareUI()}

			<Footer />
		</div>
	);
}
