"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	BookOpen,
	Users,
	Star,
	DollarSign,
	MoreHorizontal,
	Edit,
	Eye,
	Trash2,
	Plus,
	Clock,
	PlayCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { tutorApi, TutorCourse } from "@/lib/api/tutorApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseCardProps {
	course: TutorCourse;
}

function CourseCard({ course }: CourseCardProps) {
	const { t } = useLanguage();

	const getStatusColor = (isPublished: boolean) => {
		return isPublished
			? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
			: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
	};

	return (
		<Card className="overflow-hidden hover:shadow-lg transition-shadow">
			<div className="aspect-video relative overflow-hidden">
				{course.thumbnail ? (
					<Image
						src={course.thumbnail}
						alt={course.title}
						fill
						className="object-cover"
					/>
				) : (
					<div className="absolute inset-0 bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center">
						<BookOpen className="h-16 w-16 text-white/90" />
					</div>
				)}
				<div className="absolute top-2 left-2">
					<Badge className={getStatusColor(course.is_published)}>
						{course.is_published ? "Published" : "Draft"}
					</Badge>
				</div>
				<div className="absolute top-2 right-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="secondary" size="sm" className="h-8 w-8 p-0">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<Eye className="h-4 w-4 mr-2" />
								{t("tutor.courses.viewCourse") || "View Course"}
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Edit className="h-4 w-4 mr-2" />
								{t("tutor.courses.editCourse") || "Edit Course"}
							</DropdownMenuItem>
							<DropdownMenuItem className="text-red-600">
								<Trash2 className="h-4 w-4 mr-2" />
								{t("tutor.courses.deleteCourse") || "Delete Course"}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<CardHeader className="pb-3">
				<CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
				<p className="text-sm text-muted-foreground line-clamp-2">
					{course.description}
				</p>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Course Stats */}
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div className="flex items-center gap-2">
						<Users className="h-4 w-4 text-muted-foreground" />
						<span>
							{course.students_count || 0}{" "}
							{t("tutor.courses.students") || "students"}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<PlayCircle className="h-4 w-4 text-muted-foreground" />
						<span>
							{course.lessons_count || 0}{" "}
							{t("tutor.courses.lessons") || "lessons"}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<DollarSign className="h-4 w-4 text-muted-foreground" />
						<span>${course.price}</span>
					</div>
					{course.rating && course.rating > 0 && (
						<div className="flex items-center gap-2">
							<Star className="h-4 w-4 text-amber-400 fill-current" />
							<span>
								{course.rating.toFixed(1)} ({course.reviews_count || 0})
							</span>
						</div>
					)}
				</div>

				{/* Earnings and Price */}
				<div className="flex justify-between items-center pt-2 border-t">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<DollarSign className="h-4 w-4 text-green-600" />
							<span className="font-semibold text-green-600">
								${course.earnings ? course.earnings.toFixed(2) : "0.00"}
							</span>
						</div>
						<div className="text-xs text-muted-foreground">
							{t("tutor.courses.totalEarnings") || "Total Earnings"}
						</div>
					</div>
					<div className="text-right space-y-1">
						<div className="text-xs text-muted-foreground">Updated</div>
						<div className="text-xs">
							{new Date(course.updated_at).toLocaleDateString()}
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-2 pt-2">
					<Button variant="outline" size="sm" className="flex-1" asChild>
						<Link href={`/dashboard/creator/courses/${course.slug}`}>
							{t("tutor.courses.viewCourse") || "View"}
						</Link>
					</Button>
					<Button size="sm" className="flex-1" asChild>
						<Link href={`/dashboard/creator/courses/${course.slug}/edit`}>
							{t("tutor.courses.manageCourse") || "Manage"}
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export default function CourseManagement() {
	const { t } = useLanguage();
	const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
	const [courses, setCourses] = useState<TutorCourse[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadCourses();
	}, []);

	const loadCourses = async () => {
		try {
			setLoading(true);
			const data = await tutorApi.getMyCourses();
			setCourses(data);
		} catch (error) {
			console.error("Failed to load courses:", error);
			toast.error("Failed to load courses");
		} finally {
			setLoading(false);
		}
	};

	const filteredCourses = courses.filter((course) => {
		if (filter === "all") return true;
		if (filter === "published") return course.is_published;
		if (filter === "draft") return !course.is_published;
		return true;
	});

	const totalStudents = courses.reduce(
		(sum, course) => sum + (course.students_count || 0),
		0,
	);
	const totalEarnings = courses.reduce(
		(sum, course) => sum + (course.earnings || 0),
		0,
	);
	const publishedCourses = courses.filter(
		(course) => course.is_published,
	).length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
			>
				<div>
					<h2 className="text-2xl font-bold">
						{t("tutor.courses.title") || "Course Management"}
					</h2>
					<p className="text-muted-foreground">
						{t("tutor.courses.description") ||
							"Manage your courses, track performance, and analyze earnings"}
					</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/creator/courses/create">
						<Plus className="h-4 w-4 mr-2" />
						{t("tutor.courses.createCourse") || "Create Course"}
					</Link>
				</Button>
			</motion.div>

			{/* Summary Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="grid grid-cols-1 md:grid-cols-3 gap-4"
			>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t("tutor.courses.publishedCourses") || "Published Courses"}
						</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{publishedCourses}</div>
						<p className="text-xs text-muted-foreground">
							{courses.length - publishedCourses}{" "}
							{t("tutor.courses.inDraft") || "in draft"}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t("tutor.courses.totalStudents") || "Total Students"}
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalStudents}</div>
						<p className="text-xs text-muted-foreground">
							{t("tutor.courses.acrossAllCourses") || "Across all courses"}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t("tutor.courses.totalEarnings") || "Total Earnings"}
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							${totalEarnings.toFixed(2)}
						</div>
						<p className="text-xs text-muted-foreground">
							{t("tutor.courses.thisMonth") || "This month"}
						</p>
					</CardContent>
				</Card>
			</motion.div>

			{/* Filter Tabs */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="flex gap-2"
			>
				<Button
					variant={filter === "all" ? "default" : "outline"}
					size="sm"
					onClick={() => setFilter("all")}
				>
					{t("tutor.courses.allCourses") || "All Courses"} ({courses.length})
				</Button>
				<Button
					variant={filter === "published" ? "default" : "outline"}
					size="sm"
					onClick={() => setFilter("published")}
				>
					{t("tutor.courses.published") || "Published"} ({publishedCourses})
				</Button>
				<Button
					variant={filter === "draft" ? "default" : "outline"}
					size="sm"
					onClick={() => setFilter("draft")}
				>
					{t("tutor.courses.drafts") || "Drafts"} (
					{courses.length - publishedCourses})
				</Button>
			</motion.div>

			{/* Courses Grid */}
			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3].map((i) => (
						<Card key={i}>
							<Skeleton className="aspect-video w-full" />
							<CardHeader>
								<Skeleton className="h-6 w-3/4" />
								<Skeleton className="h-4 w-full mt-2" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-20 w-full" />
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{filteredCourses.map((course, index) => (
						<motion.div
							key={course.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 * index }}
						>
							<CourseCard course={course} />
						</motion.div>
					))}
				</motion.div>
			)}

			{filteredCourses.length === 0 && !loading && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="text-center py-12"
				>
					<BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-semibold mb-2">
						{t("tutor.courses.noCourses") || "No courses found"}
					</h3>
					<p className="text-muted-foreground mb-4">
						{t("tutor.courses.noCoursesDescription") ||
							"Create your first course to start teaching students"}
					</p>
					<Button asChild>
						<Link href="/dashboard/creator/courses/create">
							<Plus className="h-4 w-4 mr-2" />
							{t("tutor.courses.createFirstCourse") ||
								"Create Your First Course"}
						</Link>
					</Button>
				</motion.div>
			)}
		</div>
	);
}
