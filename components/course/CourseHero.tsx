"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Clock, Calendar, Users, FileText } from "lucide-react";

interface Tutor {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
}

interface CourseHeroProps {
	title: string;
	description: string;
	tutors: Tutor[];
	totalLessons: number;
	totalDuration: string;
	updatedAt: string;
}

export default function CourseHero({
	title,
	description,
	tutors,
	totalLessons,
	totalDuration,
	updatedAt,
}: CourseHeroProps) {
	const { t } = useLanguage();

	const getTutorName = (tutor: Tutor): string => {
		const name = `${tutor.first_name} ${tutor.last_name}`.trim();
		return name || tutor.email;
	};

	const getTutorInitials = (tutor: Tutor): string => {
		if (tutor.first_name && tutor.last_name) {
			return `${tutor.first_name[0]}${tutor.last_name[0]}`.toUpperCase();
		}
		return tutor.email[0].toUpperCase();
	};

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="space-y-8"
		>
			{/* Course Title */}
			<div className="space-y-5">
				<motion.h1
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-[1.15] tracking-tight"
				>
					{title}
				</motion.h1>

				{/* Course Meta Info */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="flex flex-wrap items-center gap-4 text-sm"
				>
					<Badge variant="secondary" className="px-3 py-1.5 text-xs">
						<BookOpen className="w-3.5 h-3.5 mr-1.5" />
						{totalLessons} {t("courseDetail.lessons")}
					</Badge>
					<Badge variant="outline" className="px-3 py-1.5 text-xs">
						<Clock className="w-3.5 h-3.5 mr-1.5" />
						{totalDuration}
					</Badge>
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<Calendar className="w-3.5 h-3.5" />
						<span className="text-xs">
							{t("courseDetail.updated")} {formatDate(updatedAt)}
						</span>
					</div>
				</motion.div>
			</div>

			{/* Instructors Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				className="space-y-4"
			>
				<h3 className="text-base font-semibold text-foreground flex items-center gap-2.5">
					<div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
						<Users className="w-4 h-4 text-primary" />
					</div>
					{t("courseDetail.instructors")}
				</h3>
				<div className="flex flex-wrap gap-4">
					{tutors.map((tutor, index) => (
						<motion.div
							key={tutor.id}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
							className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/50 hover:border-border/80 transition-all duration-200"
						>
							<Avatar className="w-10 h-10">
								<AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
									{getTutorInitials(tutor)}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-medium text-sm text-foreground">
									{tutor.first_name} {tutor.last_name}
								</p>
								<p className="text-xs text-muted-foreground">{tutor.email}</p>
							</div>
						</motion.div>
					))}
				</div>
			</motion.div>

			{/* Course Description */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.5 }}
				className="space-y-4"
			>
				<h3 className="text-base font-semibold text-foreground flex items-center gap-2.5">
					<div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
						<FileText className="w-4 h-4 text-primary" />
					</div>
					{t("courseDetail.aboutCourse")}
				</h3>
				<div className="prose prose-sm dark:prose-invert max-w-none">
					<p className="text-muted-foreground leading-relaxed text-sm">
						{description}
					</p>
				</div>
			</motion.div>
		</motion.div>
	);
}
