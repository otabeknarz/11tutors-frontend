"use client";

import { useLanguage } from "@/lib/LanguageContext";

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

interface LessonContentProps {
	lesson: Lesson;
}

export const LessonContent = ({ lesson }: LessonContentProps) => {
	const { t } = useLanguage();

	return (
		<div className="flex flex-col gap-4">
			{/* Lesson Title */}
			<h1 className="text-2xl md:text-3xl font-bold">
				{lesson.title}
			</h1>

			{/* Lesson Description */}
			<div className="prose max-w-none">
				<h2 className="text-lg font-medium mb-2">
					{t("lessonDetail.about")}
				</h2>
				<div className="text-muted-foreground">
					{lesson.description || t("lessonDetail.noDescription")}
				</div>
			</div>
		</div>
	);
};
