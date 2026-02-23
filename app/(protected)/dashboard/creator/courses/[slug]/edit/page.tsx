"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { Category } from "@/lib/api/courseApi";
import { CourseFormData } from "@/types/course";

// Components
import CourseBasicInfo from "@/components/course-creation/CourseBasicInfo";
import CoursePartsManager from "@/components/course-creation/CoursePartsManager";
import CoursePreview from "@/components/course-creation/CoursePreview";
import CourseAnalytics from "@/components/course-edit/CourseAnalytics";
import CourseSettings from "@/components/course-edit/CourseSettings";

// UI Components
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ArrowLeft,
	Save,
	Eye,
	BarChart3,
	Settings,
	BookOpen,
	Loader2,
} from "lucide-react";
import Link from "next/link";

export default function EditCoursePage() {
	const { slug } = useParams();
	const router = useRouter();

	const [courseData, setCourseData] = useState<CourseFormData>({
		title: "",
		description: "",
		category: "",
		price: 0,
		thumbnail: null,
		parts: [],
		isPublished: false,
		slug: "",
	});

	const [categories, setCategories] = useState<Category[]>([]);
	const [activeTab, setActiveTab] = useState("basic");
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [saveStatus, setSaveStatus] = useState<
		"idle" | "saving" | "saved" | "error"
	>("idle");
	const [error, setError] = useState<string | null>(null);

	// Load course data and categories
	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true);

				const categoriesResponse = await api.get(API_ENDPOINTS.CATEGORIES);
				setCategories(
					categoriesResponse.data.results || categoriesResponse.data,
				);

				const courseResponse = await api.get(
					API_ENDPOINTS.COURSE_DETAIL(slug as string),
				);
				const course = courseResponse.data;

				setCourseData({
					id: course.id,
					slug: course.slug || "",
					title: course.title || "",
					description: course.description || "",
					category: course.category?.id || "",
					price: Number(course.price) || 0,
					thumbnail: null,
					thumbnailUrl: course.thumbnail,
					parts: course.parts || [],
					isPublished: course.is_published || false,
					createdAt: course.created_at,
					updatedAt: course.updated_at,
				});
			} catch (error) {
				console.error("Failed to load course data:", error);
				setError("Failed to load course data");
			} finally {
				setIsLoading(false);
			}
		};

		if (slug) {
			loadData();
		}
	}, [slug]);

	const getCompletionProgress = () => {
		const steps = [
			courseData.title.length > 0,
			courseData.description.length > 0,
			courseData.category.length > 0,
			courseData.thumbnail !== null || !!courseData.thumbnailUrl,
			courseData.parts.length > 0,
			courseData.parts.some((part) => part.lessons.length > 0),
		];
		return Math.round((steps.filter(Boolean).length / steps.length) * 100);
	};

	const handleSave = async () => {
		if (!courseData.id) return;

		try {
			setIsSaving(true);
			setSaveStatus("saving");

			const formData = new FormData();
			formData.append("title", courseData.title);
			formData.append("description", courseData.description);
			formData.append("category", courseData.category);
			formData.append("price", courseData.price.toString());
			formData.append("is_published", courseData.isPublished.toString());

			if (courseData.thumbnail) {
				formData.append("thumbnail", courseData.thumbnail);
			}

			await api.patch(API_ENDPOINTS.COURSE_DETAIL(courseData.slug), formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setSaveStatus("saved");
			setTimeout(() => setSaveStatus("idle"), 2000);
		} catch (error) {
			console.error("Failed to save course:", error);
			setSaveStatus("error");
			setTimeout(() => setSaveStatus("idle"), 3000);
		} finally {
			setIsSaving(false);
		}
	};

	const handlePublishToggle = async () => {
		const newPublishStatus = !courseData.isPublished;
		setCourseData((prev) => ({ ...prev, isPublished: newPublishStatus }));

		try {
			await api.patch(API_ENDPOINTS.COURSE_DETAIL(courseData.slug), {
				is_published: newPublishStatus,
			});
		} catch (error) {
			console.error("Failed to update publish status:", error);
			setCourseData((prev) => ({ ...prev, isPublished: !newPublishStatus }));
		}
	};

	const handleBasicInfoUpdate = (field: string, value: any) => {
		setCourseData((prev) => ({ ...prev, [field]: value }));
	};

	if (isLoading) {
		return (
			<div className="space-y-8">
				<Skeleton className="h-12 w-64" />
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
					<p className="text-muted-foreground mb-4">{error}</p>
					<Button onClick={() => router.back()}>Go Back</Button>
				</div>
			</div>
		);
	}

	const completionProgress = getCompletionProgress();

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center space-x-4">
						<Link href="/dashboard/creator/courses">
							<Button variant="ghost" size="sm">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Courses
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-bold">Edit Course</h1>
							<p className="text-muted-foreground">
								Manage your course content, analytics, and settings
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<Badge variant={courseData.isPublished ? "default" : "secondary"}>
							{courseData.isPublished ? "Published" : "Draft"}
						</Badge>
						<Button
							onClick={handlePublishToggle}
							variant={courseData.isPublished ? "outline" : "default"}
							size="sm"
						>
							{courseData.isPublished ? "Unpublish" : "Publish"}
						</Button>
						<Button onClick={handleSave} disabled={isSaving} size="sm">
							{isSaving ? (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							) : (
								<Save className="h-4 w-4 mr-2" />
							)}
							{saveStatus === "saving"
								? "Saving..."
								: saveStatus === "saved"
									? "Saved!"
									: saveStatus === "error"
										? "Error"
										: "Save"}
						</Button>
					</div>
				</div>

				{/* Progress Bar */}
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">Course Completion</span>
						<span className="font-medium">{completionProgress}%</span>
					</div>
					<Progress value={completionProgress} className="h-2" />
				</div>
			</motion.div>

			{/* Main Content */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
			>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<div className="border-b bg-muted/30 p-6 rounded-t-xl">
						<TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-background/60 backdrop-blur-sm">
							<TabsTrigger
								value="basic"
								className="flex items-center space-x-2 py-3"
							>
								<BookOpen className="h-4 w-4" />
								<span className="hidden sm:inline">Basic Info</span>
							</TabsTrigger>
							<TabsTrigger
								value="content"
								className="flex items-center space-x-2 py-3"
							>
								<Settings className="h-4 w-4" />
								<span className="hidden sm:inline">Content</span>
							</TabsTrigger>
							<TabsTrigger
								value="analytics"
								className="flex items-center space-x-2 py-3"
							>
								<BarChart3 className="h-4 w-4" />
								<span className="hidden sm:inline">Analytics</span>
							</TabsTrigger>
							<TabsTrigger
								value="settings"
								className="flex items-center space-x-2 py-3"
							>
								<Settings className="h-4 w-4" />
								<span className="hidden sm:inline">Settings</span>
							</TabsTrigger>
							<TabsTrigger
								value="preview"
								className="flex items-center space-x-2 py-3"
							>
								<Eye className="h-4 w-4" />
								<span className="hidden sm:inline">Preview</span>
							</TabsTrigger>
						</TabsList>
					</div>

					<div className="mt-6">
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
								courseId={courseData.id}
								isEditMode={true}
							/>
						</TabsContent>

						<TabsContent value="analytics" className="mt-0">
							<CourseAnalytics courseSlug={courseData.slug} />
						</TabsContent>

						<TabsContent value="settings" className="mt-0">
							<CourseSettings
								courseData={courseData}
								setCourseData={setCourseData}
							/>
						</TabsContent>

						<TabsContent value="preview" className="mt-0">
							<CoursePreview
								courseData={courseData}
								onPublish={handlePublishToggle}
								isPublishing={isSaving}
							/>
						</TabsContent>
					</div>
				</Tabs>
			</motion.div>
		</div>
	);
}
