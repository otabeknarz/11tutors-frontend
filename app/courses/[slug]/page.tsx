"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	ClockIcon,
	CalendarIcon,
	PlayIcon,
	CheckCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { COURSE_ENDPOINTS } from "@/lib/constants";
import axios from "axios";

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
}

export default function CourseDetailPage() {
	const { slug } = useParams();
	const { t } = useLanguage();
	const [course, setCourse] = useState<CourseDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

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

	// Fetch course details
	useEffect(() => {
		const fetchCourseDetail = async () => {
			try {
				setLoading(true);
				setError(null);

				// Use the COURSE_DETAIL endpoint with the slug
				const response = await axios.get<CourseDetail>(
					`${COURSE_ENDPOINTS.COURSES}${slug}/`
				);

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
			<div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
					<strong className="font-bold">{t("courseDetail.error")}</strong>
					<span className="block sm:inline"> {error}</span>
				</div>
				<Link href="/courses" className="mt-4 text-primary hover:underline">
					{t("courseDetail.goBack")}
				</Link>
			</div>
		);
	}

	// Loading state
	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
				<h2 className="text-xl font-semibold">{t("courseDetail.loading")}</h2>
			</div>
		);
	}

	// Course not found state
	if (!course) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
				<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-md">
					<strong className="font-bold">{t("courseDetail.notFound")}</strong>
					<span className="block sm:inline">
						{" "}
						{t("courseDetail.notFoundMessage")}
					</span>
				</div>
				<Link href="/courses" className="mt-4 text-primary hover:underline">
					{t("courseDetail.goBack")}
				</Link>
			</div>
		);
	}

	// Calculate total lessons and total duration
	const totalDuration = getTotalDuration(course.parts);
	const totalLessons = getTotalLessons(course.parts);

	// Format course description or show placeholder
	const courseDescription =
		course.description || t("courseDetail.noDescription");

	// Format price display with proper currency formatting
	const priceDisplay = course.price
		? new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
		  }).format(Number(course.price))
		: t("courseDetail.free");

	// Format tutor name
	const getTutorName = (tutor: Tutor): string => {
		const name = `${tutor.first_name} ${tutor.last_name}`.trim();
		return name || tutor.email;
	};

	// Get tutor initials for avatar
	const getTutorInitials = (tutor: Tutor): string => {
		if (tutor.first_name && tutor.last_name) {
			return `${tutor.first_name[0]}${tutor.last_name[0]}`.toUpperCase();
		}
		return tutor.email[0].toUpperCase();
	};

	// Format date
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			{/* Hero Section */}
			<section className="bg-muted/30 py-12">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Course Info */}
						<div className="lg:col-span-2">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
							>
								<h1 className="text-3xl md:text-4xl font-bold mb-4">
									{course.title}
								</h1>

								<div className="flex flex-wrap items-center gap-4 mb-6">
									<Badge variant="outline" className="text-sm">
										{totalLessons} {t("courseDetail.lessons")}
									</Badge>
									<div className="flex items-center gap-1 text-gray-600">
										<ClockIcon className="h-4 w-4" />
										<span>{totalDuration}</span>
									</div>
									<div className="flex items-center gap-1 text-gray-600">
										<CalendarIcon className="h-4 w-4" />
										<span>
											{t("courseDetail.updated")}{" "}
											{formatDate(course.updated_at)}
										</span>
									</div>
								</div>

								<div className="mb-6">
									<h2 className="text-lg font-medium mb-2">
										{t("courseDetail.instructors")}
									</h2>
									<div className="flex flex-wrap gap-4">
										{course.tutors.map((tutor) => (
											<div key={tutor.id} className="flex items-center gap-2">
												<Avatar>
													<AvatarFallback>
														{getTutorInitials(tutor)}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">{getTutorName(tutor)}</p>
													<p className="text-sm text-muted-foreground">
														{tutor.email}
													</p>
												</div>
											</div>
										))}
									</div>
								</div>

								<div className="mt-6">
									<h3 className="text-lg font-semibold mb-4">
										{t("courseDetail.aboutCourse")}
									</h3>
									<div className="prose max-w-none">
										<p>{courseDescription}</p>
									</div>
								</div>
							</motion.div>
						</div>

						{/* Course Card */}
						<div>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
							>
								<Card className="sticky top-24">
									<div className="aspect-video relative overflow-hidden rounded-t-lg">
										<Image
											src={course.thumbnail}
											alt={course.title}
											width={500}
											height={500}
											className="w-full h-full object-cover"
										/>
										<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
											<Button
												size="icon"
												variant="outline"
												className="rounded-full h-16 w-16 bg-white/20 hover:bg-white/30 border-white"
											>
												<PlayIcon className="h-8 w-8 text-white" />
											</Button>
										</div>
									</div>
									<CardContent className="p-6">
										<div className="mt-4 space-y-2">
											<div className="flex items-center justify-between">
												<span className="text-2xl font-bold">
													{priceDisplay}
												</span>
											</div>
											<p className="text-sm text-gray-600">
												{t("courseDetail.fullAccess")}
											</p>
											<Button className="w-full">
												{t("courseDetail.enroll")}
											</Button>
											<div className="mt-4 space-y-2">
												<div className="flex items-center gap-2">
													<CheckCircleIcon className="h-4 w-4 text-green-500" />
													<span className="text-sm">
														{totalLessons} {t("courseDetail.lessons")} (
														{totalDuration} {t("courseDetail.totalLength")})
													</span>
												</div>
												<div className="flex items-center gap-2">
													<CheckCircleIcon className="h-4 w-4 text-green-500" />
													<span className="text-sm">
														{t("courseDetail.lifetime")}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<CheckCircleIcon className="h-4 w-4 text-green-500" />
													<span className="text-sm">
														{t("courseDetail.certificate")}
													</span>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						</div>
					</div>
				</div>
			</section>

			{/* Course Content Section */}
			<section className="py-12">
				<div className="container mx-auto px-4">
					<Tabs defaultValue="content" className="mt-8">
						<TabsList>
							<TabsTrigger value="content">
								{t("courseDetail.courseContent")}
							</TabsTrigger>
							<TabsTrigger value="overview">
								{t("courseDetail.overview")}
							</TabsTrigger>
							<TabsTrigger value="reviews">
								{t("courseDetail.reviews")}
							</TabsTrigger>
						</TabsList>

						<TabsContent value="content" className="space-y-4">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-2xl font-bold">
									{t("courseDetail.courseContent")}
								</h2>
								<div className="text-sm text-gray-600">
									{totalLessons} {t("courseDetail.lessons")} • {totalDuration}
								</div>
							</div>

							<Accordion type="single" collapsible className="w-full">
								{course.parts.map((part, index) => (
									<AccordionItem key={part.id} value={`part-${index}`}>
										<AccordionTrigger className="hover:bg-muted/50 px-4 py-3 rounded-lg">
											<div className="flex items-center gap-2">
												<span className="font-medium">{part.title}</span>
												<Badge variant="outline" className="ml-2">
													{part.lessons.length} {t("courseDetail.lessons")}
												</Badge>
											</div>
										</AccordionTrigger>
										<AccordionContent>
											<ul className="space-y-1 pl-4 pr-2">
												{part.lessons.map((lesson) => (
													<li
														key={lesson.id}
														className="border-b border-muted last:border-0"
													>
														<Button
															variant="ghost"
															className="w-full justify-start py-3 px-2 h-auto"
															onClick={() => {
																handleLessonClick(lesson);
															}}
														>
															<div className="flex items-center justify-between w-full">
																<div className="flex items-center gap-3">
																	<PlayIcon className="h-4 w-4 text-primary" />
																	<span>{lesson.title}</span>
																</div>
																<div className="flex items-center gap-1 text-gray-600">
																	<ClockIcon className="h-4 w-4" />
																	<span>{lesson.duration}</span>
																</div>
															</div>
														</Button>
													</li>
												))}
											</ul>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</TabsContent>

						<TabsContent value="overview">
							<div className="prose max-w-none">
								<h2>{t("courseDetail.aboutCourse")}</h2>
								<p>{courseDescription}</p>
							</div>
						</TabsContent>

						<TabsContent value="reviews">
							<div className="text-center py-12">
								<h3 className="text-sm font-medium text-gray-500">
									{t("courseDetail.noReviews")}
								</h3>
								<p className="text-muted-foreground mb-4">
									{t("courseDetail.beFirst")}
								</p>
								<Button>{t("courseDetail.writeReview")}</Button>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</section>

			{/* Related Courses Section */}
			{/* <section className="py-12 bg-muted/30">
				<div className="container mx-auto px-4">
					<h2 className="text-2xl font-bold mb-6">
						{t("courseDetail.relatedCourses")}
					</h2>

					<div className="mt-12">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<Card className="flex items-center justify-center h-48 bg-gray-50">
								<div className="text-center">
									<ClockIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
									<p className="text-gray-500">
										{t("courseDetail.comingSoon")}
									</p>
								</div>
							</Card>
							<Card className="flex items-center justify-center h-48 bg-gray-50">
								<div className="text-center">
									<ClockIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
									<p className="text-gray-500">
										{t("courseDetail.comingSoon")}
									</p>
								</div>
							</Card>
							<Card className="flex items-center justify-center h-48 bg-gray-50">
								<div className="text-center">
									<ClockIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
									<p className="text-gray-500">
										{t("courseDetail.comingSoon")}
									</p>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</section> */}

			<Footer />
		</div>
	);
}
