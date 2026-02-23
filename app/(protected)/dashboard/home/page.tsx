"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ArrowRightIcon,
	BookOpenIcon,
	Clock,
	StarIcon,
	PlayCircle,
	Sparkles,
	GraduationCap,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";

// Types
interface Course {
	id: string;
	title: string;
	description?: string;
	thumbnail?: string;
	image?: string;
	duration?: string;
	progress?: number;
	rating?: number;
	price?: string;
	is_free?: boolean;
	last_accessed?: string;
	slug?: string;
	tutor?: {
		name?: string;
		avatar?: string;
	};
}

interface CourseCardProps {
	course: Course;
	index?: number;
}

const stagger = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.08 },
	},
};

const fadeInUp = {
	hidden: { opacity: 0, y: 16 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const },
	},
};

// Enrolled Course Card
function EnrolledCourseCard({ course, index = 0 }: CourseCardProps) {
	const { t } = useLanguage();
	const progress = course.progress || 0;

	return (
		<motion.div variants={fadeInUp}>
			<Card className="overflow-hidden h-full flex flex-col group card-highlight">
				<div className="aspect-video relative overflow-hidden">
					{course.thumbnail ? (
						<Image
							src={course.thumbnail}
							alt={course.title}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					) : (
						<div className="absolute inset-0 bg-linear-to-br from-amber-600 to-orange-700 flex items-center justify-center">
							<BookOpenIcon className="h-12 w-12 text-white/80" />
						</div>
					)}

					{course.rating && (
						<div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
							<StarIcon className="h-3 w-3 fill-amber-400 text-amber-400" />
							<span className="text-xs font-semibold">
								{course.rating.toFixed(1)}
							</span>
						</div>
					)}

					{/* Play overlay */}
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
						<PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100" />
					</div>

					{/* Progress bar */}
					<div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
						<div
							className="h-full bg-primary transition-all duration-500 ease-out"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>

				<CardHeader className="pb-2">
					<h3 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
						{course.title}
					</h3>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Clock className="h-3.5 w-3.5" />
						{progress === 100 ? (
							<span className="text-green-600 dark:text-green-400 font-medium">
								{t("home.completed") || "Completed"}
							</span>
						) : (
							<span>
								{progress}% {t("home.completed") || "completed"}
							</span>
						)}
					</div>
				</CardHeader>

				<CardContent className="flex-1">
					<p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
						{course.description}
					</p>
				</CardContent>

				<CardFooter className="pt-0">
					<Button className="w-full btn-glow" size="sm" asChild>
						<Link href={`/courses/${course.slug}`}>
							<PlayCircle className="h-4 w-4 mr-2" />
							{t("home.continueButton") || "Continue Learning"}
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</motion.div>
	);
}

// Popular Course Card
function PopularCourseCard({ course, index = 0 }: CourseCardProps) {
	const { t } = useLanguage();

	return (
		<motion.div variants={fadeInUp}>
			<Card className="overflow-hidden h-full group card-highlight">
				<div className="aspect-video relative overflow-hidden">
					{course.thumbnail ? (
						<Image
							src={course.thumbnail}
							alt={course.title}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					) : (
						<div className="absolute inset-0 bg-linear-to-br from-amber-600 to-orange-700 flex items-center justify-center">
							<BookOpenIcon className="h-12 w-12 text-white/80" />
						</div>
					)}

					{course.rating && (
						<div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
							<StarIcon className="h-3 w-3 fill-amber-400 text-amber-400" />
							<span className="text-xs font-semibold">
								{course.rating.toFixed(1)}
							</span>
						</div>
					)}

					{/* Hover overlay */}
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
				</div>

				<CardHeader className="pb-2">
					<h3 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
						{course.title}
					</h3>
					{course.tutor && (
						<div className="flex items-center gap-2">
							<Avatar className="h-5 w-5">
								<AvatarImage
									src={course.tutor.avatar}
									alt={course.tutor.name}
								/>
								<AvatarFallback className="text-[10px] bg-primary/10 text-primary">
									{course.tutor.name?.[0]}
								</AvatarFallback>
							</Avatar>
							<span className="text-xs text-muted-foreground">
								{course.tutor.name}
							</span>
						</div>
					)}
				</CardHeader>

				<CardContent className="flex-1">
					<p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
						{course.description}
					</p>
				</CardContent>

				<CardFooter className="flex justify-between items-center pt-0">
					<div>
						{course.price && Number(course.price) > 0 ? (
							<span className="text-lg font-bold text-foreground">
								{new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: "USD",
								}).format(Number(course.price))}
							</span>
						) : (
							<Badge
								variant="secondary"
								className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-0"
							>
								{t("courses.free") || "Free"}
							</Badge>
						)}
					</div>
					<Button size="sm" variant="outline" asChild>
						<Link href={`/courses/${course.slug || course.id}`}>
							{t("home.details") || "View Course"}
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</motion.div>
	);
}

// Skeleton Card
function CourseCardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<div className="aspect-video">
				<Skeleton className="h-full w-full rounded-none" />
			</div>
			<CardHeader className="pb-2">
				<Skeleton className="h-5 w-4/5" />
				<Skeleton className="h-4 w-2/5 mt-2" />
			</CardHeader>
			<CardContent>
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-3/4 mt-2" />
			</CardContent>
		</Card>
	);
}

export default function Home() {
	const { user } = useAuth();
	const { t } = useLanguage();

	const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
	const [popularCourses, setPopularCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCourses = async () => {
		if (!user) return;

		setLoading(true);
		try {
			const enrolledResponse = await api.get(`/api/courses/enrollments/`);
			const enrollments = enrolledResponse.data.results || [];
			const transformedEnrollments = enrollments.map((enrollment: any) => ({
				id: enrollment.course.id,
				title: enrollment.course.title,
				description: enrollment.course.description,
				thumbnail: enrollment.course.thumbnail,
				slug: enrollment.course.slug,
				progress: Math.floor(Math.random() * 100), // TODO: Replace with actual progress data when available
				price: enrollment.course.price,
				last_accessed: enrollment.enrolled_at,
				tutor: enrollment.course.tutors?.[0]
					? {
							name: `${enrollment.course.tutors[0].first_name} ${enrollment.course.tutors[0].last_name}`,
							avatar: null, // TODO: Add avatar when available
						}
					: undefined,
			}));

			setEnrolledCourses(transformedEnrollments);
		} catch (err) {
			console.error("Error fetching courses:", err);
			setError("Failed to load courses");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) {
			fetchCourses();
		}
	}, [user]);

	return (
		<div className="space-y-10">
			{/* Welcome Section */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
							{t("home.welcome") || "Welcome back"},{" "}
							<span className="text-primary">{user?.first_name}</span>
						</h1>
						<p className="text-muted-foreground mt-2 text-base">
							{t("home.subtitle") ||
								"Continue your learning journey or explore new courses"}
						</p>
					</div>
				</div>
			</motion.div>

			{/* Quick Stats */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.05 }}
				className="grid grid-cols-1 sm:grid-cols-3 gap-4"
			>
				<Card className="card-premium">
					<CardContent className="flex items-center gap-4 py-5 px-5">
						<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
							<GraduationCap className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="text-2xl font-bold">{enrolledCourses.length}</p>
							<p className="text-xs text-muted-foreground">
								{t("home.enrolledCourses") || "Enrolled Courses"}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card className="card-premium">
					<CardContent className="flex items-center gap-4 py-5 px-5">
						<div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
							<TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
						</div>
						<div>
							<p className="text-2xl font-bold">
								{
									enrolledCourses.filter((c) => (c.progress || 0) === 100)
										.length
								}
							</p>
							<p className="text-xs text-muted-foreground">
								{t("home.completed") || "Completed"}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card className="card-premium">
					<CardContent className="flex items-center gap-4 py-5 px-5">
						<div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
							<Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
						</div>
						<div>
							<p className="text-2xl font-bold">
								{enrolledCourses.length > 0
									? Math.round(
											enrolledCourses.reduce(
												(acc, c) => acc + (c.progress || 0),
												0,
											) / enrolledCourses.length,
										)
									: 0}
								%
							</p>
							<p className="text-xs text-muted-foreground">Avg. Progress</p>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Enrolled Courses Section */}
			<motion.section
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<div className="flex justify-between items-center mb-6">
					<div>
						<h2 className="text-xl font-bold tracking-tight">
							{t("home.enrolledCourses") || "My Courses"}
						</h2>
						<p className="text-sm text-muted-foreground mt-0.5">
							Pick up where you left off
						</p>
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="btn-underline text-muted-foreground"
						asChild
					>
						<Link
							href="/dashboard/courses"
							className="flex items-center gap-1.5"
						>
							{t("home.viewAll") || "View all"}
							<ArrowRightIcon className="h-3.5 w-3.5" />
						</Link>
					</Button>
				</div>

				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(3)].map((_, i) => (
							<CourseCardSkeleton key={i} />
						))}
					</div>
				) : error ? (
					<Card className="border-destructive/30 bg-destructive/5">
						<CardContent className="py-6 text-center">
							<p className="text-destructive text-sm">{error}</p>
							<Button
								variant="outline"
								size="sm"
								className="mt-3"
								onClick={() => fetchCourses()}
							>
								Try again
							</Button>
						</CardContent>
					</Card>
				) : enrolledCourses.length === 0 ? (
					<Card className="card-premium">
						<CardContent className="py-16 text-center">
							<div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
								<BookOpenIcon className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-lg font-semibold mb-2">
								{t("home.noCoursesYet") || "No courses enrolled yet"}
							</h3>
							<p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
								{t("home.exploreAndEnroll") ||
									"Explore our catalog and enroll in courses to start learning"}
							</p>
							<Button className="btn-glow" asChild>
								<Link href="/courses">
									<Sparkles className="h-4 w-4 mr-2" />
									{t("home.exploreCourses") || "Explore Courses"}
								</Link>
							</Button>
						</CardContent>
					</Card>
				) : (
					<motion.div
						variants={stagger}
						initial="hidden"
						animate="show"
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					>
						{enrolledCourses.map((course, i) => (
							<EnrolledCourseCard key={course.id} course={course} index={i} />
						))}
					</motion.div>
				)}
			</motion.section>

			{/* Popular Courses Section */}
			<motion.section
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<div className="flex justify-between items-center mb-6">
					<div>
						<h2 className="text-xl font-bold tracking-tight">
							{t("home.popularCourses") || "Popular Courses"}
						</h2>
						<p className="text-sm text-muted-foreground mt-0.5">
							Trending in our community
						</p>
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="btn-underline text-muted-foreground"
						asChild
					>
						<Link href="/courses" className="flex items-center gap-1.5">
							{t("home.viewAll") || "View all"}
							<ArrowRightIcon className="h-3.5 w-3.5" />
						</Link>
					</Button>
				</div>

				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(3)].map((_, i) => (
							<CourseCardSkeleton key={i} />
						))}
					</div>
				) : error ? (
					<Card className="border-destructive/30 bg-destructive/5">
						<CardContent className="py-6 text-center">
							<p className="text-destructive text-sm">{error}</p>
						</CardContent>
					</Card>
				) : popularCourses.length === 0 ? (
					<Card className="card-premium">
						<CardContent className="py-12 text-center">
							<p className="text-muted-foreground text-sm">
								Popular courses will appear here soon.
							</p>
						</CardContent>
					</Card>
				) : (
					<motion.div
						variants={stagger}
						initial="hidden"
						animate="show"
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					>
						{popularCourses.map((course, i) => (
							<PopularCourseCard key={course.id} course={course} index={i} />
						))}
					</motion.div>
				)}
			</motion.section>
		</div>
	);
}
