"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { PlayIcon, ClockIcon } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

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

interface CourseCurriculumProps {
	parts: CoursePart[];
	totalLessons: number;
	totalDuration: string;
	onLessonClick: (lesson: Lesson) => void;
}

export default function CourseCurriculum({
	parts,
	totalLessons,
	totalDuration,
	onLessonClick,
}: CourseCurriculumProps) {
	const { t } = useLanguage();

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-xl md:text-2xl font-bold text-foreground">
					{t("courseDetail.courseContent")}
				</h2>
				<div className="text-sm text-muted-foreground">
					{totalLessons} {t("courseDetail.lessons")} • {totalDuration}
				</div>
			</div>

			{/* Curriculum Accordion */}
			<Accordion
				type="multiple"
				defaultValue={parts.map((_, index) => `part-${index}`)}
				className="w-full space-y-2"
			>
				{parts.map((part, index) => (
					<AccordionItem
						key={part.id}
						value={`part-${index}`}
						className="border border-border rounded-lg overflow-hidden"
					>
						<AccordionTrigger className="hover:bg-muted/50 px-4 py-4 text-left [&[data-state=open]>div]:text-primary">
							<div className="flex items-center justify-between w-full pr-4">
								<div className="flex items-center gap-3">
									<span className="font-semibold text-foreground">
										{part.title}
									</span>
									<Badge variant="secondary" className="text-xs">
										{part.lessons.length} {t("courseDetail.lessons")}
									</Badge>
								</div>
							</div>
						</AccordionTrigger>
						<AccordionContent className="px-0 pb-0">
							<div className="border-t border-border">
								{part.lessons.map((lesson, lessonIndex) => (
									<div
										key={lesson.id}
										className={`border-b border-border last:border-0 ${
											lessonIndex % 2 === 0 ? "bg-muted/20" : "bg-background"
										}`}
									>
										<Button
											variant="ghost"
											className="w-full justify-start py-4 px-6 h-auto rounded-none hover:bg-muted/50 transition-colors"
											onClick={() => onLessonClick(lesson)}
										>
											<div className="flex items-center justify-between w-full">
												<div className="flex items-center gap-3">
													<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
														<PlayIcon className="h-4 w-4 text-primary" />
													</div>
													<div className="text-left">
														<p className="font-medium text-foreground">
															{lesson.title}
														</p>
														<p className="text-xs text-muted-foreground">
															Lesson {lessonIndex + 1}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-1 text-muted-foreground">
													<ClockIcon className="h-4 w-4" />
													<span className="text-sm">{lesson.duration}</span>
												</div>
											</div>
										</Button>
									</div>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
