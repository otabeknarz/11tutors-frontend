"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

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
import { Skeleton } from "@/components/ui/skeleton";
import {
	ArrowRightIcon,
	BookOpenIcon,
	Clock,
	StarIcon,
	PlayCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

// Course Card Components
interface CourseCardProps {
	course: Course;
}

// Enrolled Course Card Component
function EnrolledCourseCard({ course }: CourseCardProps) {
	const { t } = useLanguage();
	const progress = course.progress || 0;

	return (
		<Card className="overflow-hidden h-full flex flex-col group">
			<div className="aspect-video relative overflow-hidden">
				{course.thumbnail ? (
					<Image
						src={course.thumbnail}
						alt={course.title}
						fill
						className="object-cover transition-transform group-hover:scale-105"
					/>
				) : (
					<div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
						<BookOpenIcon className="h-16 w-16 text-white/90" />
					</div>
				)}

				{/* Rating badge */}
				{course.rating && (
					<div className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 rounded-md px-2 py-1 flex items-center">
						<StarIcon className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
						<span className="text-xs font-medium">
							{course.rating.toFixed(1)}
						</span>
					</div>
				)}

				{/* Progress bar */}
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
					<div
						className="h-full bg-primary"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			<CardHeader className="pb-2">
				<h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
					{course.title}
				</h3>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Clock className="h-4 w-4" />
					{progress === 100 ? (
						<span>{t("home.completed") || "Completed"}</span>
					) : (
						<span>
							{progress}% {t("home.completed") || "completed"}
						</span>
					)}
				</div>
			</CardHeader>

			<CardContent>
				<p className="text-muted-foreground text-sm line-clamp-2">
					{course.description}
				</p>
			</CardContent>

			<CardFooter className="flex justify-between pt-2 border-t">
				<Button variant="ghost" size="sm" asChild>
					<Link href={`/courses/${course.id}/learn`}>
						{t("home.continueButton") || "Continue"}
					</Link>
				</Button>
				<Button variant="outline" size="sm" asChild>
					<Link href={`/courses/${course.id}`}>
						{t("home.details") || "Details"}
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}

// Popular Course Card Component
function PopularCourseCard({ course }: CourseCardProps) {
	const { t } = useLanguage();

	return (
		<Card className="overflow-hidden h-full group">
			<div className="aspect-video relative overflow-hidden">
				{course.thumbnail ? (
					<Image
						src={course.thumbnail}
						alt={course.title}
						fill
						className="object-cover transition-transform group-hover:scale-105"
					/>
				) : (
					<div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
						<BookOpenIcon className="h-16 w-16 text-white/90" />
					</div>
				)}

				{/* Rating badge */}
				{course.rating && (
					<div className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 rounded-md px-2 py-1 flex items-center">
						<StarIcon className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
						<span className="text-xs font-medium">
							{course.rating.toFixed(1)}
						</span>
					</div>
				)}
			</div>

			<CardHeader className="pb-2">
				<h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
					{course.title}
				</h3>
				{course.tutor && (
					<div className="flex items-center gap-2">
						<Avatar className="h-6 w-6">
							<AvatarImage src={course.tutor.avatar} alt={course.tutor.name} />
							<AvatarFallback>{course.tutor.name?.[0]}</AvatarFallback>
						</Avatar>
						<span className="text-sm text-muted-foreground">
							{course.tutor.name}
						</span>
					</div>
				)}
			</CardHeader>

			<CardContent>
				<p className="text-muted-foreground text-sm line-clamp-2">
					{course.description}
				</p>
			</CardContent>

			<CardFooter className="flex justify-between items-center pt-2 border-t">
				<div>
					{course.price ? (
						<span className="font-bold">
							{new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(Number(course.price))}
						</span>
					) : (
						<Badge
							variant="outline"
							className="bg-green-50 text-green-700 border-green-200"
						>
							{t("courses.free") || "Free"}
						</Badge>
					)}
				</div>
				<Button size="sm" asChild>
					<Link href={`/courses/${course.id}`}>
						{t("home.details") || "Details"}
					</Link>
				</Button>
			</CardFooter>
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
			// Fetch enrolled courses
			const enrolledResponse = await axios.get(
				`${API_BASE_URL}/courses/enrolled/`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					},
				}
			);

			// Fetch popular courses
			const popularResponse = await axios.get(
				`${API_BASE_URL}/courses/popular/`
			);

			setEnrolledCourses(enrolledResponse.data.results || []);
			setPopularCourses(popularResponse.data.results || []);
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
		<div className="container py-6 space-y-8">
			{/* Welcome Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mb-10"
			>
				<h1 className="text-3xl font-bold text-foreground">
					{t("home.welcome") || "Welcome back"}, {user?.first_name}!
				</h1>
				<p className="text-muted-foreground mt-2">
					{t("home.subtitle") ||
						"Continue your learning journey or explore new courses"}
				</p>
			</motion.div>

			{/* Enrolled Courses Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="mb-12"
			>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold">
						{t("home.enrolledCourses") || "My Enrolled Courses"}
					</h2>
					<Button variant="ghost" size="sm" asChild>
						<Link href="/courses/enrolled" className="flex items-center gap-1">
							{t("home.viewAll") || "View all"}
							<ArrowRightIcon className="h-4 w-4" />
						</Link>
					</Button>
				</div>

				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(3)].map((_, i) => (
							<Card key={i} className="overflow-hidden">
								<div className="aspect-video bg-muted">
									<Skeleton className="h-full w-full" />
								</div>
								<CardHeader>
									<Skeleton className="h-6 w-3/4 mb-2" />
									<Skeleton className="h-4 w-1/2" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-4 w-5/6" />
								</CardContent>
							</Card>
						))}
					</div>
				) : error ? (
					<div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg">
						{error}
					</div>
				) : enrolledCourses.length === 0 ? (
					<div className="bg-muted/50 rounded-lg p-8 text-center">
						<div className="flex justify-center mb-4">
							<BookOpenIcon className="h-12 w-12 text-muted-foreground/70" />
						</div>
						<h3 className="text-xl font-medium mb-2">
							{t("home.noCoursesYet") || "No courses enrolled yet"}
						</h3>
						<p className="text-muted-foreground mb-6">
							{t("home.exploreAndEnroll") ||
								"Explore our catalog and enroll in courses to start learning"}
						</p>
						<Button asChild>
							<Link href="/courses">
								{t("home.exploreCourses") || "Explore Courses"}
							</Link>
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{enrolledCourses.map((course) => (
							<EnrolledCourseCard key={course.id} course={course} />
						))}
					</div>
				)}
			</motion.div>

			{/* Popular Courses Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold">
						{t("home.popularCourses") || "Popular Courses"}
					</h2>
					<Button variant="ghost" size="sm" asChild>
						<Link href="/courses" className="flex items-center gap-1">
							{t("home.viewAll") || "View all"}
							<ArrowRightIcon className="h-4 w-4" />
						</Link>
					</Button>
				</div>

				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(3)].map((_, i) => (
							<Card key={i} className="overflow-hidden">
								<div className="aspect-video bg-muted">
									<Skeleton className="h-full w-full" />
								</div>
								<CardHeader>
									<Skeleton className="h-6 w-3/4 mb-2" />
									<Skeleton className="h-4 w-1/2" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-4 w-5/6" />
								</CardContent>
							</Card>
						))}
					</div>
				) : error ? (
					<div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg">
						{error}
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{popularCourses.map((course) => (
							<PopularCourseCard key={course.id} course={course} />
						))}
					</div>
				)}
			</motion.div>
		</div>
	);
}
