"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Clock, Award, ArrowRight, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface CourseThumbnailCardProps {
	thumbnail: string;
	title: string;
	price: string | number | undefined;
	totalLessons: number;
	totalDuration: string;
	onEnroll: () => void;
	paymentLoading: boolean;
	isEnrolled?: boolean;
}

export default function CourseThumbnailCard({
	thumbnail,
	title,
	price,
	totalLessons,
	totalDuration,
	onEnroll,
	paymentLoading,
	isEnrolled = false,
}: CourseThumbnailCardProps) {
	const { t } = useLanguage();

	// Format price display with proper currency formatting
	const formattedPrice = price
		? new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
		  }).format(Number(price))
		: t("courseDetail.free");

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
				{/* Course Thumbnail */}
				<div className="relative group">
					<Image
						src={thumbnail}
						alt={title}
						width={400}
						height={240}
						className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				</div>

				{/* Course Info */}
				<CardContent className="p-6 space-y-6">
					{/* Price - Only show if not enrolled */}
					{!isEnrolled && (
						<div className="text-center space-y-2">
							<div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
								{formattedPrice}
							</div>
							{price && price !== 0 && (
								<p className="text-sm text-muted-foreground">One-time payment</p>
							)}
						</div>
					)}
					
					{/* Enrolled Status Badge */}
					{isEnrolled && (
						<div className="text-center">
							<div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
								<CheckCircle className="w-4 h-4" />
								<span className="text-sm font-medium">{t("courseDetail.enrolled") || "Enrolled"}</span>
							</div>
						</div>
					)}
					
					{/* Course Stats */}
					<div className="grid grid-cols-2 gap-4 text-center">
						<div className="space-y-1">
							<div className="flex items-center justify-center gap-1 text-muted-foreground">
								<BookOpen className="w-4 h-4" />
								<span className="text-sm">{t("courseDetail.lessons") || "Lessons"}</span>
							</div>
							<div className="font-semibold">{totalLessons}</div>
						</div>
						<div className="space-y-1">
							<div className="flex items-center justify-center gap-1 text-muted-foreground">
								<Clock className="w-4 h-4" />
								<span className="text-sm">{t("courseDetail.duration") || "Duration"}</span>
							</div>
							<div className="font-semibold">{totalDuration}</div>
						</div>
					</div>

					{/* Enroll/Continue Button */}
					<Button
						size="lg"
						className={`w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
							isEnrolled
								? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
								: "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
						}`}
						onClick={onEnroll}
						disabled={paymentLoading}
					>
						{paymentLoading ? (
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								{t("courseDetail.processing") || "Processing..."}
							</div>
						) : (
							<div className="flex items-center gap-2">
								{isEnrolled ? (
									<>
										<Play className="w-4 h-4" />
										<span>
											{t("courseDetail.continue") || "Continue Learning"}
										</span>
									</>
								) : (
									<>
										<span>{t("courseDetail.enroll") || "Enroll Now"}</span>
										<ArrowRight className="w-4 h-4" />
									</>
								)}
							</div>
						)}
					</Button>
				</CardContent>
			</Card>
		</motion.div>
	);
}
