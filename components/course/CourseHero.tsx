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
			<div className="space-y-6">
				<motion.h1
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight"
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
					<Badge
						variant="secondary"
						className="px-4 py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
					>
						<BookOpen className="w-4 h-4 mr-2" />
						{totalLessons} {t("courseDetail.lessons")}
					</Badge>
					<Badge
						variant="outline"
						className="px-4 py-2 border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors"
					>
						<Clock className="w-4 h-4 mr-2" />
						{totalDuration}
					</Badge>
					<div className="flex items-center gap-2 text-muted-foreground">
						<Calendar className="w-4 h-4" />
						<span className="text-sm">
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
				<h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
					<div className="p-2 bg-primary/10 rounded-lg">
						<Users className="w-5 h-5 text-primary" />
					</div>
					{t("courseDetail.instructors")}
				</h3>
				<div className="flex flex-wrap gap-6">
					{tutors.map((tutor, index) => (
						<motion.div
							key={tutor.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
							className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-all duration-200 hover:shadow-sm"
						>
							<Avatar className="w-14 h-14 ring-2 ring-primary/20 shadow-sm">
								<AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg">
									{getTutorInitials(tutor)}
								</AvatarFallback>
							</Avatar>
							<div className="space-y-1">
								<p className="font-semibold text-foreground text-base">
									{tutor.first_name} {tutor.last_name}
								</p>
								<p className="text-sm text-muted-foreground">{tutor.email}</p>
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
				<h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
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
			</motion.div>
		</motion.div>
	);
}
