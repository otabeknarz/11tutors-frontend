"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
	BookOpen,
	Clock,
	Users,
	Star,
	Search,
	Play,
	CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { EnrollmentManager } from "@/lib/enrollmentManager";

interface Course {
	id: string;
	title: string;
	slug: string;
	description: string;
	price: string;
	thumbnail: string;
	tutors?: {
		id: string;
		first_name: string;
		last_name: string;
		email: string;
	}[];
	is_enrolled: boolean;
	category: {
		id: number;
		name: string;
		slug: string;
	};
	parts?: {
		id: string;
		title: string;
		order: number;
	}[];
	created_at: string;
	updated_at: string;
	// UI-specific properties (not from API)
	progress?: number;
	rating?: number;
}

export default function CoursesPage() {
	const { user } = useAuth();
	const { t } = useLanguage();
	const router = useRouter();
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [enrollmentLoading, setEnrollmentLoading] = useState<string | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);

	// Animation variants
	const fadeIn = {
		initial: { opacity: 0 },
		animate: { opacity: 1, transition: { duration: 0.5 } },
	};

	const slideUp = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	};

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await api.get("/api/courses/courses/");
				// Add random progress for enrolled courses for demo purposes
				const coursesWithProgress = response.data.results.map(
					(course: Course) => ({
						...course,
						progress: course.is_enrolled
							? Math.floor(Math.random() * 100)
							: undefined,
						rating: parseFloat((3 + Math.random() * 2).toFixed(1)), // Random rating between 3-5
					})
				);
				setCourses(coursesWithProgress);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching courses:", error);
				setLoading(false);
			}
		};

		fetchCourses();
	}, []);

	// Handle course enrollment using the centralized manager
	const handleCourseEnrollment = async (course: Course) => {
		setEnrollmentLoading(course.id);
		setError(null);

		// Convert Course to EnrollmentCourse format
		const enrollmentCourse = {
			id: course.id,
			slug: course.slug,
			title: course.title,
			price: course.price,
			is_enrolled: course.is_enrolled,
			parts: [], // Dashboard doesn't have detailed course structure
		};

		await EnrollmentManager.handleEnrollment({
			user,
			router,
			course: enrollmentCourse,
			onError: (error) => setError(error),
			onLoadingChange: (loading) => {
				if (!loading) {
					setEnrollmentLoading(null);
				}
			},
			t,
		});
	};

	const filteredCourses = courses.filter((course) => {
		const matchesSearch =
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(course.description?.toLowerCase() || "").includes(
				searchQuery.toLowerCase()
			);
		const matchesCategory =
			selectedCategory === "all" ||
			course.category.name.toLowerCase() === selectedCategory.toLowerCase();
		return matchesSearch && matchesCategory;
	});

	// Extract unique categories from the courses data
	const categories = [
		"all",
		...Array.from(
			new Set(courses.map((course) => course.category.name.toLowerCase()))
		),
	];

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="space-y-8">
						<Skeleton className="h-12 w-64 mx-auto" />
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[...Array(6)].map((_, i) => (
								<Card key={i} className="overflow-hidden">
									<Skeleton className="h-48 w-full" />
									<CardContent className="p-6 space-y-4">
										<Skeleton className="h-6 w-full" />
										<Skeleton className="h-4 w-3/4" />
										<Skeleton className="h-4 w-1/2" />
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<motion.div {...fadeIn} className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8 space-y-8">
				{/* Header */}
				<motion.div {...slideUp} className="text-center space-y-4">
					<h1 className="text-4xl font-bold text-foreground">
						{t("courses.title")}
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						{t("courses.subtitle")}
					</p>
				</motion.div>

				{/* Search and Filter */}
				<motion.div
					{...slideUp}
					className="flex flex-col md:flex-row gap-4 items-center justify-between"
				>
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder={t("courses.searchPlaceholder")}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					<div className="flex gap-2 flex-wrap">
						{categories.map((category) => (
							<Button
								key={category}
								variant={selectedCategory === category ? "default" : "outline"}
								size="sm"
								onClick={() => setSelectedCategory(category)}
								className="capitalize"
							>
								{category}
							</Button>
						))}
					</div>
				</motion.div>

				{/* Error Display */}
				{error && (
					<motion.div {...slideUp} className="mb-6">
						<div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
							<div className="flex items-center gap-2 text-destructive">
								<CheckCircle className="h-4 w-4" />
								<span className="font-medium">Error</span>
							</div>
							<p className="text-sm text-destructive/80 mt-1">{error}</p>
							<Button
								variant="outline"
								size="sm"
								className="mt-2"
								onClick={() => setError(null)}
							>
								Dismiss
							</Button>
						</div>
					</motion.div>
				)}

				{/* Courses Grid */}
				<motion.div
					{...slideUp}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{filteredCourses.map((course, index) => (
						<motion.div
							key={course.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-border/50">
								<div className="relative overflow-hidden">
									<Image
										src={course.thumbnail}
										alt={course.title}
										width={400}
										height={240}
										className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
									/>
									{course.is_enrolled && (
										<Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
											<CheckCircle className="h-3 w-3 mr-1" />
											Enrolled
										</Badge>
									)}
									<div className="absolute top-3 right-3">
										<Badge
											variant="secondary"
											className="bg-black/50 text-white"
										>
											{course.category.name}
										</Badge>
									</div>
								</div>

								<CardHeader className="pb-3">
									<div className="flex items-start justify-between gap-2">
										<CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
											{course.title}
										</CardTitle>
										<div className="flex items-center gap-1 text-sm text-muted-foreground">
											<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											{course.rating}
										</div>
									</div>
									<CardDescription className="line-clamp-2">
										{course.description}
									</CardDescription>
								</CardHeader>

								<CardContent className="space-y-4">
									{course.is_enrolled && course.progress !== undefined && (
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span className="text-muted-foreground">Progress</span>
												<span className="font-medium">{course.progress}%</span>
											</div>
											<Progress value={course.progress} className="h-2" />
										</div>
									)}

									<div className="flex items-center justify-between text-sm text-muted-foreground">
										<div className="flex items-center gap-4">
											<div className="flex items-center gap-1">
												<Clock className="h-4 w-4" />
												{course.parts?.length || 0} parts
											</div>
											<div className="flex items-center gap-1">
												<Users className="h-4 w-4" />
												{Math.floor(Math.random() * 100) + 10} students
											</div>
										</div>
									</div>

									{course.tutors && course.tutors.length > 0 && (
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarImage src="" />
												<AvatarFallback>
													{course.tutors[0].first_name[0]}
													{course.tutors[0].last_name[0]}
												</AvatarFallback>
											</Avatar>
											<span className="text-sm font-medium">
												{course.tutors[0].first_name}{" "}
												{course.tutors[0].last_name}
											</span>
										</div>
									)}
								</CardContent>

								<CardFooter className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className="text-2xl font-bold text-foreground">
											${course.price}
										</span>
									</div>
									<Button
										className="gap-2"
										onClick={() => handleCourseEnrollment(course)}
										disabled={enrollmentLoading === course.id}
									>
										{enrollmentLoading === course.id ? (
											<>
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
												Loading...
											</>
										) : course.is_enrolled ? (
											<>
												<Play className="h-4 w-4" />
												{t("courseDetail.continue") || "Continue"}
											</>
										) : (
											<>
												<BookOpen className="h-4 w-4" />
												{t("courseDetail.enroll") || "Enroll Now"}
											</>
										)}
									</Button>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</motion.div>

				{filteredCourses.length === 0 && (
					<motion.div {...slideUp} className="text-center py-12">
						<BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-foreground mb-2">
							No courses found
						</h3>
						<p className="text-muted-foreground">
							Try adjusting your search or filter criteria
						</p>
					</motion.div>
				)}
			</div>
		</motion.div>
	);
}
