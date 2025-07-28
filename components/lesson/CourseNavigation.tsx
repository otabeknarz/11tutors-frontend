"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

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

interface Part {
	id: string;
	title: string;
	order: number;
	lessons: Lesson[];
}

interface Course {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	slug: string;
	parts: Part[];
	tutors: {
		first_name: string;
		last_name: string;
		avatar: string | null;
	}[];
}

interface CourseNavigationProps {
	course: Course;
	currentLesson: Lesson;
	courseSlug: string;
}

export const CourseNavigation = ({ course, currentLesson, courseSlug }: CourseNavigationProps) => {
	const { t } = useLanguage();

	// Format duration helper
	const formatDuration = (duration: string): string => {
		if (!duration) return "";
		const parts = duration.split(":");
		if (parts.length === 3) {
			const hours = parseInt(parts[0]);
			const minutes = parseInt(parts[1]);
			const seconds = parseInt(parts[2]);
			
			if (hours > 0) {
				return `${hours}h ${minutes}m`;
			} else {
				return `${minutes}m ${seconds}s`;
			}
		}
		return duration;
	};

	// Get all lessons for navigation
	const allLessons = course.parts
		.sort((a, b) => a.order - b.order)
		.flatMap(part => part.lessons.sort((a, b) => a.order - b.order));
	
	const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
	const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
	const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

	return (
		<Card className="h-fit">
			<CardContent className="p-6">
				{/* Back to Course Button */}
				<Link href={`/courses/${courseSlug}`}>
					<Button variant="ghost" className="w-full justify-start mb-4 p-2">
						<ArrowLeft className="h-4 w-4 mr-2" />
						{t("lessonDetail.backToCourse")}
					</Button>
				</Link>

				{/* Course Navigation */}
				<div className="space-y-4">
					<h4 className="font-medium mb-3">
						{t("lessonDetail.courseNavigation")}
					</h4>

					{/* Course Parts and Lessons */}
					<div className="space-y-3">
						{course.parts
							.sort((a, b) => a.order - b.order)
							.map((part) => {
								const sortedLessons = part.lessons.sort((a, b) => a.order - b.order);
								
								return (
									<div key={part.id} className="space-y-2">
										{/* Part Title */}
										<div className="font-medium text-sm text-muted-foreground px-2 py-1">
											{part.title}
										</div>
										
										{/* Lessons in this part */}
										{sortedLessons.map((lessonItem) => {
											const isCurrentLesson = lessonItem.id === currentLesson.id;
											const isAccessible = lessonItem.is_free_preview || true; // TODO: Add enrollment check
											const lessonSlugFromTitle = lessonItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
											
											return (
												<Link
													key={lessonItem.id}
													href={`/courses/${courseSlug}/${lessonSlugFromTitle}`}
													className={cn(
														"group block p-3 rounded-lg transition-all duration-200",
														isCurrentLesson
															? "bg-primary/10 border border-primary/20 shadow-sm"
															: isAccessible
															? "hover:bg-muted/50 border border-transparent hover:border-border/50"
															: "opacity-60 cursor-not-allowed"
													)}
													onClick={(e) => {
														if (!isAccessible) {
															e.preventDefault();
														}
													}}
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-3 flex-1 min-w-0">
															{/* Lesson Status Icon */}
															<div className="flex-shrink-0">
																{isCurrentLesson ? (
																	<div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
																		<Play className="h-4 w-4 text-primary-foreground" />
																	</div>
																) : isAccessible ? (
																	<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10">
																		<Play className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
																	</div>
																) : (
																	<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
																		<Lock className="h-4 w-4 text-muted-foreground" />
																	</div>
																)}
															</div>
															
															{/* Lesson Info */}
															<div className="flex-1 min-w-0">
																<div className="flex items-center justify-between">
																	<div className="min-w-0 flex-1">
																		<p className={cn(
																			"text-sm font-medium truncate",
																			isCurrentLesson ? "text-primary" : "text-foreground"
																		)}>
																			{lessonItem.title}
																		</p>
																		<div className="flex items-center space-x-2 mt-1">
																			<span className="text-xs text-muted-foreground">
																				{formatDuration(lessonItem.duration)}
																			</span>
																			{lessonItem.is_free_preview && (
																				<Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto bg-green-50 text-green-700 border-green-200">
																					{t("lessonDetail.freePreview") || "Free"}
																				</Badge>
																			)}
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</Link>
											);
										})}
									</div>
								);
							})}
					</div>
					
					{/* Lesson Navigation Buttons */}
					<div className="mt-6 pt-6 border-t border-border">
						<div className="flex justify-between gap-3">
							{/* Previous Lesson */}
							{previousLesson ? (
								<Link
									href={`/courses/${courseSlug}/${previousLesson.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
									className="flex-1 group"
								>
									<Button variant="outline" className="w-full justify-start p-3 h-auto group-hover:bg-muted/50">
										<div className="flex items-center gap-2">
											<ChevronLeft className="h-4 w-4" />
											<div className="text-left">
												<div className="text-xs text-muted-foreground">{t("lessonDetail.previous") || "Previous"}</div>
												<div className="text-sm font-medium truncate max-w-[120px]">{previousLesson.title}</div>
											</div>
										</div>
									</Button>
								</Link>
							) : (
								<div className="flex-1" />
							)}
							
							{/* Next Lesson */}
							{nextLesson ? (
								<Link
									href={`/courses/${courseSlug}/${nextLesson.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
									className="flex-1 group"
								>
									<Button variant="outline" className="w-full justify-end p-3 h-auto group-hover:bg-muted/50">
										<div className="flex items-center gap-2">
											<div className="text-right">
												<div className="text-xs text-muted-foreground">{t("lessonDetail.next") || "Next"}</div>
												<div className="text-sm font-medium truncate max-w-[120px]">{nextLesson.title}</div>
											</div>
											<ChevronRight className="h-4 w-4" />
										</div>
									</Button>
								</Link>
							) : (
								<div className="flex-1" />
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
