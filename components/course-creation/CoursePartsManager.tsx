"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { CourseFormData, CoursePartData, LessonData } from "@/types/course";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";

// Components
import VideoUploader from "./VideoUploader";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
	Plus,
	Trash2,
	GripVertical,
	ChevronDown,
	ChevronRight,
	Play,
	Clock,
	Eye,
	Edit3,
	Save,
	X,
	AlertCircle,
	BookOpen,
} from "lucide-react";

interface CoursePartsManagerProps {
	courseData: CourseFormData;
	setCourseData: React.Dispatch<React.SetStateAction<CourseFormData>>;
	courseId?: string;
	isEditMode?: boolean;
}

function CoursePartsManager({
	courseData,
	setCourseData,
	courseId,
	isEditMode = false,
}: CoursePartsManagerProps) {
	const { t } = useLanguage();
	const [expandedParts, setExpandedParts] = useState<Set<string>>(new Set());
	const [editingPart, setEditingPart] = useState<string | null>(null);
	const [editingLesson, setEditingLesson] = useState<string | null>(null);

	// Part Management
	const addPart = () => {
		const newPart: CoursePartData = {
			id: `temp-part-${Date.now()}`,
			title: "",
			description: "",
			order: courseData.parts.length,
			lessons: [],
		};

		setCourseData((prev) => ({
			...prev,
			parts: [...prev.parts, newPart],
		}));

		setEditingPart(newPart.id!);
		setExpandedParts((prev) => new Set([...prev, newPart.id!]));
	};

	const savePart = async (partId: string) => {
		if (isEditMode && courseId && partId.startsWith("temp-")) {
			const part = courseData.parts.find((p) => p.id === partId);
			if (!part) return;

			try {
				const newPartData = {
					course: courseId,
					title: part.title || "New Part",
					description: part.description || "",
					order: part.order,
				};

				const response = await api.post(
					API_ENDPOINTS.COURSE_PARTS,
					newPartData,
				);

				const updatedPart: CoursePartData = {
					...part,
					id: response.data.id,
				};

				setCourseData((prev) => ({
					...prev,
					parts: prev.parts.map((p) => (p.id === partId ? updatedPart : p)),
				}));

				setEditingPart(null);
			} catch (error) {
				console.error("Failed to save course part:", error);
			}
		} else {
			setEditingPart(null);
		}
	};

	const cancelPartEdit = (partId: string) => {
		if (partId.startsWith("temp-")) {
			setCourseData((prev) => ({
				...prev,
				parts: prev.parts.filter((part) => part.id !== partId),
			}));
			setExpandedParts((prev) => {
				const newSet = new Set(prev);
				newSet.delete(partId);
				return newSet;
			});
		}
		setEditingPart(null);
	};

	const updatePart = async (
		partId: string,
		updates: Partial<CoursePartData>,
	) => {
		if (isEditMode && partId && !partId.startsWith("temp-")) {
			const part = courseData.parts.find((p) => p.id === partId);
			if (part?.slug) {
				try {
					await api.patch(API_ENDPOINTS.COURSE_PART_DETAIL(part.slug), {
						title: updates.title,
						description: updates.description,
						order: updates.order,
					});
				} catch (error) {
					console.error("Failed to update course part:", error);
				}
			}
		}

		setCourseData((prev) => ({
			...prev,
			parts: prev.parts.map((part) =>
				part.id === partId ? { ...part, ...updates } : part,
			),
		}));
	};

	const deletePart = async (partId: string) => {
		if (isEditMode && partId && !partId.startsWith("temp-")) {
			const part = courseData.parts.find((p) => p.id === partId);
			if (part?.slug) {
				try {
					await api.delete(API_ENDPOINTS.COURSE_PART_DETAIL(part.slug));
				} catch (error) {
					console.error("Failed to delete course part:", error);
					return;
				}
			}
		}

		setCourseData((prev) => ({
			...prev,
			parts: prev.parts.filter((part) => part.id !== partId),
		}));
		setExpandedParts((prev) => {
			const newSet = new Set(prev);
			newSet.delete(partId);
			return newSet;
		});
	};

	// Lesson Management
	const addLesson = (partId: string) => {
		const part = courseData.parts.find((p) => p.id === partId);
		if (!part) return;

		const newLesson: LessonData = {
			id: `temp-lesson-${Date.now()}`,
			title: "",
			description: "",
			videoFile: null,
			videoServiceId: null,
			duration: 0,
			order: part.lessons.length,
			isFreePreview: false,
			uploadProgress: 0,
			uploadStatus: "idle",
		};

		updatePart(partId, {
			lessons: [...part.lessons, newLesson],
		});

		setEditingLesson(newLesson.id!);
	};

	const updateLesson = async (
		partId: string,
		lessonId: string,
		updates: Partial<LessonData>,
	) => {
		if (isEditMode && !lessonId.startsWith("temp-")) {
			const part = courseData.parts.find((p) => p.id === partId);
			const lesson = part?.lessons.find((l) => l.id === lessonId);
			if (lesson?.slug) {
				try {
					await api.patch(API_ENDPOINTS.LESSON_DETAIL(lesson.slug), {
						title: updates.title,
						description: updates.description,
						order: updates.order,
						duration: updates.duration,
						is_free_preview: updates.isFreePreview,
						video_service_id: updates.videoServiceId,
					});
				} catch (error) {
					console.error("Failed to update lesson:", error);
				}
			}
		}

		const part = courseData.parts.find((p) => p.id === partId);
		if (!part) return;

		const updatedLessons = part.lessons.map((lesson) =>
			lesson.id === lessonId ? { ...lesson, ...updates } : lesson,
		);

		updatePart(partId, { lessons: updatedLessons });
	};

	const saveLesson = async (partId: string, lessonId: string) => {
		if (
			isEditMode &&
			!partId.startsWith("temp-") &&
			lessonId.startsWith("temp-")
		) {
			const part = courseData.parts.find((p) => p.id === partId);
			const lesson = part?.lessons.find((l) => l.id === lessonId);
			if (!part || !lesson) {
				console.error("Part or lesson not found", {
					partId,
					lessonId,
					part,
					lesson,
				});
				return;
			}

			try {
				const newLessonData = {
					part: part.id,
					title: lesson.title || "New Lesson",
					description: lesson.description || "",
					order: lesson.order,
					duration: lesson.duration ? `${lesson.duration}` : "0",
					is_free_preview: lesson.isFreePreview,
					video_service_id: lesson.videoServiceId || null,
				};

				console.log("Saving lesson with data:", newLessonData);
				const response = await api.post(API_ENDPOINTS.LESSONS, newLessonData);

				const updatedLessons = part.lessons.map((l) =>
					l.id === lessonId
						? {
								...l,
								id: response.data.id,
								slug: response.data.slug,
								uploadStatus: "completed" as const,
							}
						: l,
				);

				updatePart(partId, { lessons: updatedLessons });
				setEditingLesson(null);
			} catch (error) {
				console.error("Failed to save lesson:", error);
			}
		} else {
			setEditingLesson(null);
		}
	};

	const cancelLessonEdit = (partId: string, lessonId: string) => {
		if (lessonId.startsWith("temp-")) {
			const part = courseData.parts.find((p) => p.id === partId);
			if (!part) return;

			const updatedLessons = part.lessons.filter(
				(lesson) => lesson.id !== lessonId,
			);
			updatePart(partId, { lessons: updatedLessons });
		}
		setEditingLesson(null);
	};

	const deleteLesson = async (partId: string, lessonId: string) => {
		if (isEditMode && !lessonId.startsWith("temp-")) {
			const part = courseData.parts.find((p) => p.id === partId);
			const lesson = part?.lessons.find((l) => l.id === lessonId);
			if (lesson?.slug) {
				try {
					await api.delete(API_ENDPOINTS.LESSON_DETAIL(lesson.slug));
				} catch (error) {
					console.error("Failed to delete lesson:", error);
					return;
				}
			}
		}

		const part = courseData.parts.find((p) => p.id === partId);
		if (!part) return;

		updatePart(partId, {
			lessons: part.lessons.filter((lesson) => lesson.id !== lessonId),
		});
	};

	const togglePartExpansion = (partId: string) => {
		setExpandedParts((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(partId)) {
				newSet.delete(partId);
			} else {
				newSet.add(partId);
			}
			return newSet;
		});
	};

	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m ${secs}s`;
	};

	const getTotalDuration = () => {
		return courseData.parts.reduce(
			(total, part) =>
				total +
				part.lessons.reduce(
					(partTotal, lesson) => partTotal + lesson.duration,
					0,
				),
			0,
		);
	};

	const getTotalLessons = () => {
		return courseData.parts.reduce(
			(total, part) => total + part.lessons.length,
			0,
		);
	};

	const getCompletedVideos = () => {
		return courseData.parts.reduce(
			(total, part) =>
				total +
				part.lessons.filter((lesson) => lesson.uploadStatus === "completed")
					.length,
			0,
		);
	};

	return (
		<div className="space-y-6">
			{/* Header with Stats */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
				<div>
					<h2 className="text-2xl font-bold">Course Content</h2>
					<p className="text-muted-foreground">
						Organize your course into parts and lessons with video content
					</p>
				</div>

				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-4 text-sm text-muted-foreground">
						<span>{courseData.parts.length} Parts</span>
						<span>{getTotalLessons()} Lessons</span>
						<span>{formatDuration(getTotalDuration())}</span>
						<span>
							{getCompletedVideos()}/{getTotalLessons()} Videos Ready
						</span>
					</div>
					<Button onClick={addPart} className="flex items-center space-x-2">
						<Plus className="h-4 w-4" />
						<span>Add Part</span>
					</Button>
				</div>
			</div>

			{/* Course Parts */}
			<div className="space-y-4">
				<AnimatePresence>
					{courseData.parts.map((part, partIndex) => (
						<motion.div
							key={part.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="border rounded-lg overflow-hidden"
						>
							<Card>
								{/* Part Header */}
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3 flex-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => togglePartExpansion(part.id!)}
											>
												{expandedParts.has(part.id!) ? (
													<ChevronDown className="h-4 w-4" />
												) : (
													<ChevronRight className="h-4 w-4" />
												)}
											</Button>

											{editingPart === part.id ? (
												<div className="flex-1 space-y-3">
													<Input
														placeholder="Part title..."
														value={part.title}
														onChange={(e) =>
															updatePart(part.id!, { title: e.target.value })
														}
														className="font-semibold"
													/>
													<Textarea
														placeholder="Part description..."
														value={part.description}
														onChange={(e) =>
															updatePart(part.id!, {
																description: e.target.value,
															})
														}
														rows={2}
													/>
													<div className="flex space-x-2">
														<Button
															size="sm"
															onClick={() => savePart(part.id!)}
														>
															<Save className="h-4 w-4 mr-1" />
															Save
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => cancelPartEdit(part.id!)}
														>
															<X className="h-4 w-4 mr-1" />
															Cancel
														</Button>
													</div>
												</div>
											) : (
												<div className="flex-1">
													<div className="flex items-center space-x-3">
														<h3 className="font-semibold text-lg">
															{part.title || `Part ${partIndex + 1}`}
														</h3>
														<Badge variant="secondary">
															{part.lessons.length} lessons
														</Badge>
														<Badge variant="outline">
															<Clock className="h-3 w-3 mr-1" />
															{formatDuration(
																part.lessons.reduce(
																	(acc, lesson) => acc + lesson.duration,
																	0,
																),
															)}
														</Badge>
														{part.lessons.some(
															(lesson) => lesson.uploadStatus === "error",
														) && (
															<Badge variant="destructive" className="text-xs">
																<AlertCircle className="h-3 w-3 mr-1" />
																Upload Error
															</Badge>
														)}
													</div>
													{part.description && (
														<p className="text-sm text-muted-foreground mt-1">
															{part.description}
														</p>
													)}
												</div>
											)}
										</div>

										<div className="flex items-center space-x-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => setEditingPart(part.id!)}
											>
												<Edit3 className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => deletePart(part.id!)}
												className="text-destructive hover:text-destructive"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</CardHeader>

								{/* Part Content */}
								<AnimatePresence>
									{expandedParts.has(part.id!) && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.2 }}
										>
											<CardContent className="pt-0">
												{/* Lessons */}
												<div className="space-y-3">
													{part.lessons.map((lesson, lessonIndex) => (
														<motion.div
															key={lesson.id}
															initial={{ opacity: 0, x: -20 }}
															animate={{ opacity: 1, x: 0 }}
															className="border rounded-lg p-4 bg-muted/30"
														>
															{editingLesson === lesson.id ? (
																<div className="space-y-4">
																	<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																		<div>
																			<Label>Lesson Title *</Label>
																			<Input
																				placeholder="Lesson title..."
																				value={lesson.title}
																				onChange={(e) =>
																					updateLesson(part.id!, lesson.id!, {
																						title: e.target.value,
																					})
																				}
																			/>
																		</div>
																		<div className="flex items-center space-x-2">
																			<Switch
																				checked={lesson.isFreePreview}
																				onCheckedChange={(checked) =>
																					updateLesson(part.id!, lesson.id!, {
																						isFreePreview: checked,
																					})
																				}
																			/>
																			<Label className="text-sm">
																				Free Preview
																			</Label>
																		</div>
																	</div>

																	<div>
																		<Label>Lesson Description</Label>
																		<Textarea
																			placeholder="Lesson description..."
																			value={lesson.description}
																			onChange={(e) =>
																				updateLesson(part.id!, lesson.id!, {
																					description: e.target.value,
																				})
																			}
																			rows={3}
																		/>
																	</div>

																	<VideoUploader
																		lesson={lesson}
																		onVideoUpload={(
																			videoData: Partial<LessonData>,
																		) => {
																			updateLesson(
																				part.id!,
																				lesson.id!,
																				videoData,
																			);
																		}}
																	/>

																	<div className="flex space-x-2">
																		<Button
																			size="sm"
																			onClick={() =>
																				saveLesson(part.id!, lesson.id!)
																			}
																			disabled={
																				!lesson.title ||
																				lesson.uploadStatus === "uploading"
																			}
																		>
																			<Save className="h-4 w-4 mr-1" />
																			{lesson.uploadStatus === "uploading"
																				? "Uploading..."
																				: "Save Lesson"}
																		</Button>
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() =>
																				cancelLessonEdit(part.id!, lesson.id!)
																			}
																		>
																			<X className="h-4 w-4 mr-1" />
																			Cancel
																		</Button>
																	</div>
																</div>
															) : (
																<div className="flex items-center justify-between">
																	<div className="flex items-center space-x-3">
																		<div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
																			<Play className="h-4 w-4" />
																		</div>
																		<div>
																			<h4 className="font-medium">
																				{lesson.title ||
																					`Lesson ${lessonIndex + 1}`}
																			</h4>
																			<div className="flex items-center space-x-3 text-sm text-muted-foreground">
																				<span>
																					<Clock className="h-3 w-3 inline mr-1" />
																					{formatDuration(lesson.duration)}
																				</span>
																				{lesson.isFreePreview && (
																					<Badge
																						variant="outline"
																						className="text-xs"
																					>
																						<Eye className="h-3 w-3 mr-1" />
																						Free Preview
																					</Badge>
																				)}
																				{lesson.uploadStatus ===
																					"completed" && (
																					<Badge
																						variant="default"
																						className="text-xs"
																					>
																						Video Ready
																					</Badge>
																				)}
																				{lesson.uploadStatus ===
																					"uploading" && (
																					<Badge
																						variant="secondary"
																						className="text-xs"
																					>
																						Uploading {lesson.uploadProgress}%
																					</Badge>
																				)}
																				{lesson.uploadStatus === "error" && (
																					<Badge
																						variant="destructive"
																						className="text-xs"
																					>
																						Upload Failed
																					</Badge>
																				)}
																			</div>
																		</div>
																	</div>

																	<div className="flex items-center space-x-2">
																		<Button
																			variant="ghost"
																			size="sm"
																			onClick={() =>
																				setEditingLesson(lesson.id!)
																			}
																		>
																			<Edit3 className="h-4 w-4" />
																		</Button>
																		<Button
																			variant="ghost"
																			size="sm"
																			onClick={() =>
																				deleteLesson(part.id!, lesson.id!)
																			}
																			className="text-destructive hover:text-destructive"
																		>
																			<Trash2 className="h-4 w-4" />
																		</Button>
																	</div>
																</div>
															)}
														</motion.div>
													))}

													{/* Add Lesson Button */}
													<Button
														variant="outline"
														className="w-full"
														onClick={() => addLesson(part.id!)}
													>
														<Plus className="h-4 w-4 mr-2" />
														Add Lesson
													</Button>
												</div>
											</CardContent>
										</motion.div>
									)}
								</AnimatePresence>
							</Card>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{/* Empty State */}
			{courseData.parts.length === 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg"
				>
					<div className="space-y-4">
						<div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
							<BookOpen className="h-8 w-8 text-muted-foreground" />
						</div>
						<div>
							<h3 className="text-lg font-semibold">No course parts yet</h3>
							<p className="text-muted-foreground">
								Start by adding your first course part to organize your content
							</p>
						</div>
						<Button onClick={addPart}>
							<Plus className="h-4 w-4 mr-2" />
							Create First Part
						</Button>
					</div>
				</motion.div>
			)}
		</div>
	);
}

export default CoursePartsManager;
