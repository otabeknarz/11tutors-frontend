"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	Play,
	Clock,
	Users,
	DollarSign,
	BookOpen,
	Star,
	Eye,
	Upload,
	CheckCircle,
	AlertCircle,
	Image as ImageIcon,
	Loader2,
} from "lucide-react";

interface CoursePartData {
	id?: string;
	title: string;
	description: string;
	order: number;
	lessons: LessonData[];
}

interface LessonData {
	id?: string;
	title: string;
	description: string;
	videoFile: File | null;
	videoServiceId: string | null;
	duration: number;
	order: number;
	isFreePreview: boolean;
	uploadProgress: number;
	uploadStatus: "idle" | "uploading" | "completed" | "error";
}

interface CourseFormData {
	title: string;
	description: string;
	category: string;
	price: number;
	thumbnail: File | null;
	parts: CoursePartData[];
	isPublished: boolean;
}

interface CoursePreviewProps {
	courseData: CourseFormData;
	onPublish: () => void;
	isPublishing: boolean;
}

function CoursePreview({
	courseData,
	onPublish,
	isPublishing,
}: CoursePreviewProps) {
	const { t } = useLanguage();

	// Calculate course statistics
	const totalLessons = courseData.parts.reduce(
		(acc, part) => acc + part.lessons.length,
		0,
	);
	const totalDuration = courseData.parts.reduce(
		(acc, part) =>
			acc +
			part.lessons.reduce(
				(lessonAcc, lesson) => lessonAcc + lesson.duration,
				0,
			),
		0,
	);
	const completedVideos = courseData.parts.reduce(
		(acc, part) =>
			acc +
			part.lessons.filter((lesson) => lesson.uploadStatus === "completed")
				.length,
		0,
	);
	const freePreviewLessons = courseData.parts.reduce(
		(acc, part) =>
			acc + part.lessons.filter((lesson) => lesson.isFreePreview).length,
		0,
	);
	const uploadingVideos = courseData.parts.reduce(
		(acc, part) =>
			acc +
			part.lessons.filter((lesson) => lesson.uploadStatus === "uploading")
				.length,
		0,
	);
	const failedVideos = courseData.parts.reduce(
		(acc, part) =>
			acc +
			part.lessons.filter((lesson) => lesson.uploadStatus === "error").length,
		0,
	);

	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	};

	// Validation checks
	const validationChecks = [
		{
			label: "Course title",
			isValid: courseData.title.length > 0,
			required: true,
		},
		{
			label: "Course description",
			isValid: courseData.description.length > 0,
			required: true,
		},
		{
			label: "Course category",
			isValid: courseData.category.length > 0,
			required: true,
		},
		{
			label: "Course thumbnail",
			isValid: courseData.thumbnail !== null,
			required: true,
		},
		{
			label: "At least one course part",
			isValid: courseData.parts.length > 0,
			required: true,
		},
		{
			label: "At least one lesson",
			isValid: totalLessons > 0,
			required: true,
		},
		{
			label: "All videos uploaded",
			isValid: completedVideos === totalLessons && totalLessons > 0,
			required: true,
		},
	];

	const requiredChecks = validationChecks.filter((check) => check.required);
	const passedChecks = requiredChecks.filter((check) => check.isValid).length;
	const completionPercentage = Math.round(
		(passedChecks / requiredChecks.length) * 100,
	);
	const isReadyToPublish = passedChecks === requiredChecks.length;

	return (
		<div className="space-y-8">
			{/* Course Preview Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center space-y-4"
			>
				<h2 className="text-3xl font-bold">Course Preview</h2>
				<p className="text-muted-foreground">
					Review your course before publishing to students
				</p>

				{/* Completion Status */}
				<div className="flex items-center justify-center space-x-4">
					<Progress value={completionPercentage} className="w-48" />
					<span className="text-sm font-medium">
						{completionPercentage}% Complete
					</span>
				</div>

				{/* Upload Status */}
				{uploadingVideos > 0 && (
					<div className="flex items-center justify-center space-x-2 text-amber-600">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span className="text-sm">
							{uploadingVideos} videos uploading...
						</span>
					</div>
				)}

				{failedVideos > 0 && (
					<div className="flex items-center justify-center space-x-2 text-red-600">
						<AlertCircle className="h-4 w-4" />
						<span className="text-sm">
							{failedVideos} videos failed to upload
						</span>
					</div>
				)}
			</motion.div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Course Card Preview */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.1 }}
					className="lg:col-span-2"
				>
					<Card className="overflow-hidden">
						<div className="aspect-video bg-muted flex items-center justify-center">
							{courseData.thumbnail ? (
								<img
									src={URL.createObjectURL(courseData.thumbnail)}
									alt={courseData.title}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="text-center space-y-2">
									<ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
									<p className="text-sm text-muted-foreground">
										No thumbnail uploaded
									</p>
								</div>
							)}
						</div>

						<CardContent className="p-6">
							<div className="space-y-4">
								<div>
									<h3 className="text-xl font-bold mb-2">
										{courseData.title || "Untitled Course"}
									</h3>
									<p className="text-muted-foreground line-clamp-3">
										{courseData.description || "No description provided"}
									</p>
								</div>

								{/* Course Stats */}
								<div className="flex flex-wrap gap-3">
									<Badge
										variant="secondary"
										className="flex items-center space-x-1"
									>
										<BookOpen className="h-3 w-3" />
										<span>{courseData.parts.length} Parts</span>
									</Badge>
									<Badge
										variant="secondary"
										className="flex items-center space-x-1"
									>
										<Play className="h-3 w-3" />
										<span>{totalLessons} Lessons</span>
									</Badge>
									<Badge
										variant="secondary"
										className="flex items-center space-x-1"
									>
										<Clock className="h-3 w-3" />
										<span>{formatDuration(totalDuration)}</span>
									</Badge>
									<Badge
										variant="secondary"
										className="flex items-center space-x-1"
									>
										<Eye className="h-3 w-3" />
										<span>{freePreviewLessons} Free</span>
									</Badge>
									<Badge
										variant="secondary"
										className="flex items-center space-x-1"
									>
										<Users className="h-3 w-3" />
										<span>0 Students</span>
									</Badge>
								</div>

								{/* Price */}
								<div className="flex items-center justify-between pt-4 border-t">
									<div className="flex items-center space-x-2">
										<DollarSign className="h-5 w-5 text-green-600" />
										<span className="text-2xl font-bold text-green-600">
											{courseData.price === 0
												? "Free"
												: `$${courseData.price.toFixed(2)}`}
										</span>
									</div>
									<Badge variant="outline">
										{courseData.category || "No category"}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Validation Checklist */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<CheckCircle className="h-5 w-5" />
								<span>Publishing Checklist</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{validationChecks.map((check, index) => (
								<div key={index} className="flex items-center space-x-3">
									{check.isValid ? (
										<CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
									) : (
										<AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
									)}
									<span
										className={`text-sm ${check.isValid ? "text-green-700" : "text-red-700"}`}
									>
										{check.label}
									</span>
								</div>
							))}

							{/* Video Upload Status */}
							<div className="pt-2 border-t space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span>Video Upload Progress</span>
									<span>
										{completedVideos}/{totalLessons}
									</span>
								</div>
								{totalLessons > 0 && (
									<Progress
										value={(completedVideos / totalLessons) * 100}
										className="w-full"
									/>
								)}
							</div>

							<div className="pt-4 border-t">
								<Button
									onClick={onPublish}
									disabled={
										!isReadyToPublish || isPublishing || uploadingVideos > 0
									}
									className="w-full"
									size="lg"
								>
									{isPublishing ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Publishing...
										</>
									) : uploadingVideos > 0 ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Videos Uploading...
										</>
									) : (
										<>
											<Upload className="h-4 w-4 mr-2" />
											Publish Course
										</>
									)}
								</Button>

								{!isReadyToPublish && (
									<p className="text-xs text-muted-foreground text-center mt-2">
										Complete all requirements to publish
									</p>
								)}

								{uploadingVideos > 0 && (
									<p className="text-xs text-amber-600 text-center mt-2">
										Wait for all videos to finish uploading
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Course Content Preview */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<Card>
					<CardHeader>
						<CardTitle>Course Content Structure</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{courseData.parts.map((part, partIndex) => (
								<div key={part.id || partIndex} className="space-y-3">
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
											{partIndex + 1}
										</div>
										<div>
											<h4 className="font-semibold">
												{part.title || `Part ${partIndex + 1}`}
											</h4>
											<p className="text-sm text-muted-foreground">
												{part.lessons.length} lessons •{" "}
												{formatDuration(
													part.lessons.reduce(
														(acc, lesson) => acc + lesson.duration,
														0,
													),
												)}
											</p>
										</div>
									</div>

									<div className="ml-11 space-y-2">
										{part.lessons.map((lesson, lessonIndex) => (
											<div
												key={lesson.id || lessonIndex}
												className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
											>
												<div className="flex items-center space-x-3">
													<Play className="h-4 w-4 text-muted-foreground" />
													<div>
														<p className="font-medium text-sm">
															{lesson.title || `Lesson ${lessonIndex + 1}`}
														</p>
														<div className="flex items-center space-x-2 text-xs text-muted-foreground">
															<Clock className="h-3 w-3" />
															<span>{formatDuration(lesson.duration)}</span>
															{lesson.isFreePreview && (
																<Badge variant="outline" className="text-xs">
																	Free
																</Badge>
															)}
														</div>
													</div>
												</div>

												<div className="flex items-center space-x-2">
													{lesson.uploadStatus === "completed" ? (
														<CheckCircle className="h-4 w-4 text-green-500" />
													) : lesson.uploadStatus === "uploading" ? (
														<div className="flex items-center space-x-1">
															<Loader2 className="w-4 h-4 animate-spin text-blue-500" />
															<span className="text-xs">
																{lesson.uploadProgress}%
															</span>
														</div>
													) : lesson.uploadStatus === "error" ? (
														<AlertCircle className="h-4 w-4 text-red-500" />
													) : (
														<AlertCircle className="h-4 w-4 text-amber-500" />
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							))}

							{courseData.parts.length === 0 && (
								<div className="text-center py-8 text-muted-foreground">
									<BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
									<p>No course content added yet</p>
									<p className="text-sm">
										Add parts and lessons in the Content tab
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}

export default CoursePreview;
