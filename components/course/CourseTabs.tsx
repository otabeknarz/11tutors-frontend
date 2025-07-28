"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/lib/LanguageContext";
import { BookOpen, FileText, Star, Clock, Award } from "lucide-react";
import CourseCurriculum from "./CourseCurriculum";

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

interface CourseTabsProps {
	parts: CoursePart[];
	description: string;
	totalLessons: number;
	totalDuration: string;
	onLessonClick: (lesson: Lesson) => void;
}

export default function CourseTabs({
	parts,
	description,
	totalLessons,
	totalDuration,
	onLessonClick,
}: CourseTabsProps) {
	const { t } = useLanguage();

	return (
		<Tabs defaultValue="content" className="w-full">
			<TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/30 backdrop-blur-sm">
				<TabsTrigger
					value="content"
					className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
				>
					<BookOpen className="w-4 h-4" />
					{t("courseDetail.content")}
				</TabsTrigger>
				<TabsTrigger
					value="overview"
					className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
				>
					<FileText className="w-4 h-4" />
					{t("courseDetail.overview")}
				</TabsTrigger>
				<TabsTrigger
					value="reviews"
					className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
				>
					<Star className="w-4 h-4" />
					{t("courseDetail.reviews")}
				</TabsTrigger>
			</TabsList>

			<TabsContent value="content" className="mt-8">
				<CourseCurriculum
					parts={parts}
					totalLessons={totalLessons}
					totalDuration={totalDuration}
					onLessonClick={onLessonClick}
				/>
			</TabsContent>

			<TabsContent value="overview" className="mt-8">
				<div className="space-y-8">
					<div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8">
						<h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
							<div className="p-2 bg-primary/10 rounded-lg">
								<FileText className="w-5 h-5 text-primary" />
							</div>
							{t("courseDetail.aboutCourse")}
						</h3>
						<div className="prose prose-gray dark:prose-invert max-w-none">
							<p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
								{description}
							</p>
						</div>
					</div>

					{/* Course Stats */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<BookOpen className="w-6 h-6 text-primary" />
							</div>
							<div className="text-2xl font-bold text-foreground mb-2">
								{totalLessons}
							</div>
							<div className="text-sm text-muted-foreground">
								{t("courseDetail.lessons")}
							</div>
						</div>
						<div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center">
							<div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<Clock className="w-6 h-6 text-blue-500" />
							</div>
							<div className="text-2xl font-bold text-foreground mb-2">
								{totalDuration}
							</div>
							<div className="text-sm text-muted-foreground">
								Total Duration
							</div>
						</div>
						<div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center">
							<div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<Award className="w-6 h-6 text-green-500" />
							</div>
							<div className="text-2xl font-bold text-foreground mb-2">✓</div>
							<div className="text-sm text-muted-foreground">
								{t("courseDetail.certificate")}
							</div>
						</div>
					</div>
				</div>
			</TabsContent>

			<TabsContent value="reviews" className="mt-8">
				<div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-12">
					<div className="text-center space-y-6">
						<div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
							<Star className="w-8 h-8 text-muted-foreground" />
						</div>
						<div className="space-y-2">
							<h3 className="text-2xl font-semibold text-foreground">
								{t("courseDetail.noReviews")}
							</h3>
							<p className="text-muted-foreground text-lg">
								{t("courseDetail.beFirst")}
							</p>
						</div>
						<Button
							variant="outline"
							size="lg"
							className="bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
						>
							<Star className="w-4 h-4 mr-2" />
							{t("courseDetail.writeReview")}
						</Button>
					</div>
				</div>
			</TabsContent>
		</Tabs>
	);
}
