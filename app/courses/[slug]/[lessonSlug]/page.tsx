"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { COURSE_ENDPOINTS } from "@/lib/constants";
import axios from "axios";
import { motion } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Icons
import {
	ArrowLeft,
	Clock as ClockIcon,
	Play,
	Lock,
	FileText,
	MessageCircle,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

// Define types based on the API response
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

export default function LessonPage() {
	const { slug, lessonSlug } = useParams();
	const { t } = useLanguage();
	const [lesson, setLesson] = useState<Lesson | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Format duration (e.g., "00:15:30" to "15m 30s")
	const formatDuration = (duration: string): string => {
		const [hours, minutes, seconds] = duration.split(":").map(Number);

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		if (minutes > 0) {
			return `${minutes}m ${seconds}s`;
		}
		return `${seconds}s`;
	};

	// Format date based on current language
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		const { language } = useLanguage();

		// Map language codes to locales
		const localeMap: Record<string, string> = {
			en: "en-US",
			ru: "ru-RU",
			es: "es-ES",
		};

		const locale = localeMap[language] || "en-US";

		return new Intl.DateTimeFormat(locale, {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(date);
	};

	// Fetch lesson details
	useEffect(() => {
		const fetchLessonDetail = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await axios.get<Lesson>(
					`${COURSE_ENDPOINTS.LESSONS}${lessonSlug}/`
				);

				setLesson(response.data);
			} catch (err) {
				console.error("Error fetching lesson details:", err);
				setError(
					`${t("lessonDetail.errorFetching")}: ${
						(err as Error).message || String(err)
					}`
				);
			} finally {
				setLoading(false);
			}
		};

		if (lessonSlug) {
			fetchLessonDetail();
		}
	}, [lessonSlug, t]);

	// Error state
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
					<strong className="font-bold">{t("lessonDetail.error")}</strong>
					<span className="block sm:inline"> {error}</span>
				</div>
				<Link
					href={`/courses/${slug}`}
					className="mt-4 text-primary hover:underline"
				>
					{t("lessonDetail.goBack")}
				</Link>
			</div>
		);
	}

	// Loading state
	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
				<h2 className="text-xl font-semibold">{t("lessonDetail.loading")}</h2>
			</div>
		);
	}

	// Lesson not found state
	if (!lesson) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
				<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-md">
					<strong className="font-bold">{t("lessonDetail.notFound")}</strong>
					<span className="block sm:inline">
						{" "}
						{t("lessonDetail.notFoundMessage")}
					</span>
				</div>
				<Link
					href={`/courses/${slug}`}
					className="mt-4 text-primary hover:underline"
				>
					{t("lessonDetail.goBack")}
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />

			<main className="flex-grow">
				{/* Lesson Header */}
				<section className="bg-muted/30 py-6">
					<div className="container mx-auto px-4">
						<div className="mb-4">
							<Link
								href={`/courses/${slug}`}
								className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
							>
								<ArrowLeft className="h-4 w-4 mr-1" />
								{t("lessonDetail.backToCourse")}
							</Link>
						</div>

						<div className="flex flex-wrap items-center justify-between gap-4">
							<h1 className="text-2xl md:text-3xl font-bold">{lesson.title}</h1>

							<div className="flex items-center gap-3">
								{lesson.is_free_preview ? (
									<Badge
										variant="outline"
										className="bg-green-50 text-green-700 border-green-200"
									>
										{t("lessonDetail.freePreview")}
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="bg-blue-50 text-blue-700 border-blue-200"
									>
										{t("lessonDetail.premium")}
									</Badge>
								)}

								<div className="flex items-center gap-1 text-muted-foreground">
									<ClockIcon className="h-4 w-4" />
									<span>
										{formatDuration(lesson.duration)}{" "}
										{t("lessonDetail.totalLength")}
									</span>
								</div>
							</div>
						</div>

						{/* Lesson metadata */}
						<div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<span>{t("lessonDetail.updated")}:</span>
								<span>{formatDate(lesson.created_at)}</span>
							</div>
						</div>
					</div>
				</section>

				{/* Lesson Content */}
				<section className="py-8">
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Video Player and Description */}
							<div className="lg:col-span-2">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
								>
									{/* Video Player */}
									<div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
										{lesson.otp ? (
											lesson.is_free_preview ? (
												// Embed video player (this is a placeholder - replace with actual video embed)
												<div className="w-full h-full flex items-center justify-center bg-gray-900">
													<iframe
														src={`https://player.vdocipher.com/v2/?otp=${lesson.otp}&playbackInfo=${lesson.playbackInfo}`}
														style={{
															border: "0",
															width: "100%",
															height: "100%",
														}}
														allow={"encrypted-media"}
														allowFullScreen
													></iframe>
												</div>
											) : (
												// Locked video preview for premium content
												<div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
													<Lock className="h-12 w-12 mb-4 opacity-70" />
													<h3 className="text-xl font-medium mb-2">
														{t("lessonDetail.premiumContent")}
													</h3>
													<p className="text-gray-400 mb-4 text-center max-w-md">
														{t("lessonDetail.enrollToUnlock")}
													</p>
													<Button>{t("lessonDetail.enrollNow")}</Button>
												</div>
											)
										) : (
											// No video available
											<div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
												<FileText className="h-12 w-12 mb-4 opacity-70" />
												<h3 className="text-xl font-medium">
													{t("lessonDetail.noVideo")}
												</h3>
											</div>
										)}
									</div>

									{/* Lesson Description */}
									<div className="prose max-w-none">
										<h2 className="text-xl font-semibold mb-4">
											{t("lessonDetail.about")}
										</h2>
										<div className="text-muted-foreground">
											{lesson.description || t("lessonDetail.noDescription")}
										</div>
									</div>

									{/* Discussion Tab */}
									<div className="mt-8">
										<Tabs defaultValue="discussion">
											<TabsList>
												<TabsTrigger value="discussion">
													{t("lessonDetail.discussion")}
												</TabsTrigger>
												<TabsTrigger value="notes">
													{t("lessonDetail.notes")}
												</TabsTrigger>
											</TabsList>

											<TabsContent value="discussion" className="py-4">
												<div className="text-center py-8">
													<MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
													<h3 className="text-lg font-medium">
														{t("lessonDetail.noComments")}
													</h3>
													<p className="text-muted-foreground mb-4">
														{t("lessonDetail.beFirstComment")}
													</p>
													<Button>{t("lessonDetail.addComment")}</Button>
												</div>
											</TabsContent>

											<TabsContent value="notes" className="py-4">
												<div className="text-center py-8">
													<FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
													<h3 className="text-lg font-medium">
														{t("lessonDetail.noNotes")}
													</h3>
													<p className="text-muted-foreground mb-4">
														{t("lessonDetail.addNoteDescription")}
													</p>
													<Button>{t("lessonDetail.addNote")}</Button>
												</div>
											</TabsContent>
										</Tabs>
									</div>
								</motion.div>
							</div>

							{/* Course Navigation Sidebar */}
							<div>
								<Card>
									<CardContent className="p-6">
										<h3 className="text-lg font-semibold mb-4">
											{t("lessonDetail.courseNavigation")}
										</h3>
										<p className="text-sm text-muted-foreground mb-4">
											{t("lessonDetail.navigationDescription")}
										</p>
										<Button asChild className="w-full mb-4">
											<Link href={`/courses/${slug}`}>
												{t("lessonDetail.backToCourse")}
											</Link>
										</Button>

										{/* Lesson Benefits */}
										<div className="mt-6 pt-6 border-t border-border">
											<h4 className="font-medium mb-4">
												{t("lessonDetail.benefits")}
											</h4>
											<ul className="space-y-3">
												<li className="flex items-start gap-2">
													<div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
														<svg
															className="h-3.5 w-3.5 text-green-600"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M5 13l4 4L19 7"
															/>
														</svg>
													</div>
													<span className="text-sm">
														{t("lessonDetail.lifetime")}
													</span>
												</li>
												<li className="flex items-start gap-2">
													<div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
														<svg
															className="h-3.5 w-3.5 text-green-600"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M5 13l4 4L19 7"
															/>
														</svg>
													</div>
													<span className="text-sm">
														{t("lessonDetail.certificate")}
													</span>
												</li>
												<li className="flex items-start gap-2">
													<div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
														<svg
															className="h-3.5 w-3.5 text-green-600"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M5 13l4 4L19 7"
															/>
														</svg>
													</div>
													<span className="text-sm">
														{t("lessonDetail.fullAccess")}
													</span>
												</li>
											</ul>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
