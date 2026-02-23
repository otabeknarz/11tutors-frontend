"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { courseApi, type Category } from "@/lib/api/courseApi";
import { CourseFormData, CoursePartData, LessonData } from "@/types/course";

// Components
import CourseBasicInfo from "@/components/course-creation/CourseBasicInfo";
import CoursePartsManager from "@/components/course-creation/CoursePartsManager";
import CoursePreview from "@/components/course-creation/CoursePreview";

// UI Components
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ArrowLeft,
	Save,
	Upload,
	BookOpen,
	Settings,
	CheckCircle,
	Circle,
	Loader2,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { toast } from "sonner";

export default function CreateCoursePage() {
	const { user } = useAuth();
	const { t } = useLanguage();
	const router = useRouter();

	const [activeTab, setActiveTab] = useState("basic");
	const [categories, setCategories] = useState<Category[]>([]);
	const [courseData, setCourseData] = useState<CourseFormData>({
		title: "",
		description: "",
		category: "",
		slug: "",
		price: 0,
		thumbnail: null,
		parts: [],
		isPublished: false,
	});

	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [saveStatus, setSaveStatus] = useState<
		"idle" | "saving" | "saved" | "error"
	>("idle");
	const [error, setError] = useState<string | null>(null);

	// Load categories on component mount
	useEffect(() => {
		const loadCategories = async () => {
			try {
				const response = await api.get(API_ENDPOINTS.CATEGORIES);
				setCategories(response.data.results || response.data);
			} catch (error) {
				console.error("Failed to load categories:", error);
				setError("Failed to load categories");
			} finally {
				setIsLoading(false);
			}
		};

		loadCategories();
	}, []);

	// Calculate completion progress
	const getCompletionProgress = () => {
		const steps = [
			courseData.title.length > 0,
			courseData.description.length > 0,
			courseData.category.length > 0,
			courseData.thumbnail !== null,
			courseData.parts.length > 0,
			courseData.parts.some((part) => part.lessons.length > 0),
			courseData.parts.every((part) =>
				part.lessons.every((lesson) => lesson.uploadStatus === "completed"),
			) && courseData.parts.length > 0,
		];

		const progress = (steps.filter(Boolean).length / steps.length) * 100;
		return Math.round(progress);
	};

	const getTabStatus = (tab: string) => {
		switch (tab) {
			case "basic":
				return courseData.title && courseData.description && courseData.category
					? "completed"
					: "incomplete";
			case "content":
				return courseData.parts.length > 0 &&
					courseData.parts.some((part) => part.lessons.length > 0)
					? "completed"
					: "incomplete";
			case "preview":
				return getCompletionProgress() >= 80 ? "completed" : "incomplete";
			default:
				return "incomplete";
		}
	};

	const handleSaveDraft = async () => {
		setIsSaving(true);
		setSaveStatus("saving");
		setError(null);

		try {
			// Create the course first
			const course = await courseApi.createCourse({
				title: courseData.title,
				description: courseData.description,
				category: courseData.category,
				price: courseData.price,
				is_published: false,
			});

			// Upload thumbnail if provided
			if (courseData.thumbnail) {
				await courseApi.uploadCourseThumbnail(
					course.slug,
					courseData.thumbnail,
				);
			}

			// Create course parts and lessons
			for (const partData of courseData.parts) {
				const createdPart = await courseApi.createCoursePart({
					course: course.id,
					title: partData.title,
					description: partData.description,
					order: partData.order,
				});

				for (const lessonData of partData.lessons) {
					await courseApi.createLesson({
						part: createdPart.id,
						title: lessonData.title,
						description: lessonData.description,
						video_service_id: lessonData.videoServiceId || undefined,
						order: lessonData.order,
						duration: lessonData.duration
							? `${lessonData.duration}`
							: undefined,
						is_free_preview: lessonData.isFreePreview,
					});
				}
			}

			setSaveStatus("saved");
			toast.success("Course saved as draft successfully!");
			setTimeout(() => {
				setSaveStatus("idle");
				router.push("/dashboard/creator/courses");
			}, 1500);
		} catch (error) {
			console.error("Error saving course:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Failed to save course";
			setError(errorMessage);
			toast.error(errorMessage);
			setSaveStatus("error");
			setTimeout(() => setSaveStatus("idle"), 3000);
		} finally {
			setIsSaving(false);
		}
	};

	const handlePublishCourse = async () => {
		if (getCompletionProgress() < 100) {
			const errorMsg = "Please complete all required fields before publishing.";
			setError(errorMsg);
			toast.error(errorMsg);
			return;
		}

		setIsSaving(true);
		setError(null);

		try {
			toast.loading("Publishing course...");
			await handleSaveDraft();
			toast.success("Course published successfully!");
			setTimeout(() => {
				router.push("/dashboard/creator/courses");
			}, 1500);
		} catch (error) {
			console.error("Error publishing course:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Failed to publish course";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsSaving(false);
		}
	};

	const handleBasicInfoUpdate = (field: string, value: any) => {
		setCourseData((prev) => ({ ...prev, [field]: value }));
	};

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4">
					<Loader2 className="h-8 w-8 animate-spin mx-auto" />
					<h2 className="text-2xl font-semibold">Loading...</h2>
					<p className="text-muted-foreground">
						Please wait while we load the course creator
					</p>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4">
					<Loader2 className="h-8 w-8 animate-spin mx-auto" />
					<h2 className="text-xl font-semibold">Loading Course Creator...</h2>
					<p className="text-muted-foreground">Setting up your workspace</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8"
			>
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
					<div className="flex items-center space-x-4">
						<Button variant="ghost" size="sm" asChild>
							<Link
								href="/dashboard/creator/courses"
								className="flex items-center"
							>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Courses
							</Link>
						</Button>
						<div>
							<h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
								Create New Course
							</h1>
							<p className="text-muted-foreground">
								Build and publish your course content
							</p>
						</div>
					</div>

					<div className="flex items-center space-x-3">
						<div className="flex items-center space-x-2">
							<Progress value={getCompletionProgress()} className="w-24" />
							<span className="text-sm text-muted-foreground">
								{getCompletionProgress()}%
							</span>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleSaveDraft}
							disabled={isSaving || !courseData.title}
						>
							{isSaving ? (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							) : (
								<Save className="h-4 w-4 mr-2" />
							)}
							{saveStatus === "saving"
								? "Saving..."
								: saveStatus === "saved"
									? "Saved!"
									: "Save Draft"}
						</Button>
						<Button
							size="sm"
							onClick={handlePublishCourse}
							disabled={isSaving || getCompletionProgress() < 100}
						>
							{isSaving ? (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							) : (
								<Upload className="h-4 w-4 mr-2" />
							)}
							Publish Course
						</Button>
					</div>
				</div>

				{/* Error Display */}
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
					>
						<p className="text-sm text-red-700">{error}</p>
					</motion.div>
				)}
			</motion.div>

			{/* Main Content */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-card rounded-xl border shadow-sm overflow-hidden"
			>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					{/* Tab Navigation */}
					<div className="border-b bg-muted/30 p-6">
						<TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-background/60 backdrop-blur-sm">
							<TabsTrigger
								value="basic"
								className="flex items-center space-x-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
							>
								{getTabStatus("basic") === "completed" ? (
									<CheckCircle className="h-4 w-4 text-green-500" />
								) : (
									<Circle className="h-4 w-4" />
								)}
								<Settings className="h-4 w-4" />
								<span>Basic Info</span>
							</TabsTrigger>
							<TabsTrigger
								value="content"
								className="flex items-center space-x-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
							>
								{getTabStatus("content") === "completed" ? (
									<CheckCircle className="h-4 w-4 text-green-500" />
								) : (
									<Circle className="h-4 w-4" />
								)}
								<BookOpen className="h-4 w-4" />
								<span>Content & Videos</span>
							</TabsTrigger>
							<TabsTrigger
								value="preview"
								className="flex items-center space-x-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
							>
								{getTabStatus("preview") === "completed" ? (
									<CheckCircle className="h-4 w-4 text-green-500" />
								) : (
									<Circle className="h-4 w-4" />
								)}
								<Upload className="h-4 w-4" />
								<span>Preview & Publish</span>
							</TabsTrigger>
						</TabsList>
					</div>

					{/* Tab Content */}
					<div className="p-6">
						<TabsContent value="basic" className="mt-0">
							<CourseBasicInfo
								title={courseData.title}
								description={courseData.description}
								category={courseData.category}
								price={courseData.price}
								thumbnail={courseData.thumbnail}
								thumbnailUrl={courseData.thumbnailUrl}
								categories={categories}
								onUpdate={handleBasicInfoUpdate}
							/>
						</TabsContent>

						<TabsContent value="content" className="mt-0">
							<CoursePartsManager
								courseData={courseData}
								setCourseData={setCourseData}
								isEditMode={false}
							/>
						</TabsContent>

						<TabsContent value="preview" className="mt-0">
							<CoursePreview
								courseData={courseData}
								onPublish={handlePublishCourse}
								isPublishing={isSaving}
							/>
						</TabsContent>
					</div>
				</Tabs>
			</motion.div>
		</div>
	);
}
