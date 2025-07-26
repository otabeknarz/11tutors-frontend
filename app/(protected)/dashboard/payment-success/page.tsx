"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	CheckCircle,
	ArrowRight,
	BookOpen,
	Calendar,
	Trophy,
} from "lucide-react";

export default function PaymentSuccessPage() {
	const { t } = useLanguage();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [courseSlug, setCourseSlug] = useState<string | null>(null);

	useEffect(() => {
		const slug = searchParams.get("course-slug");
		setCourseSlug(slug);
	}, [searchParams]);

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="max-w-2xl w-full"
			>
				<Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
					<CardHeader className="text-center pb-2">
						<motion.div
							variants={itemVariants}
							className="mx-auto mb-4 h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
						>
							<CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
						</motion.div>
						<motion.div variants={itemVariants}>
							<CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
								{t("payment.success.title") || "Payment Successful!"}
							</CardTitle>
							<p className="text-lg text-muted-foreground">
								{t("payment.success.subtitle") ||
									"Congratulations! Your enrollment was successful."}
							</p>
						</motion.div>
					</CardHeader>

					<CardContent className="space-y-6">
						<motion.div
							variants={itemVariants}
							className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
						>
							<h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
								{t("payment.success.enrollmentComplete") ||
									"Enrollment Complete"}
							</h3>
							<p className="text-green-700 dark:text-green-300">
								{t("payment.success.accessMessage") ||
									"You now have full access to all course materials, lessons, and resources."}
							</p>
						</motion.div>

						<motion.div
							variants={itemVariants}
							className="flex flex-col sm:flex-row gap-4 pt-4"
						>
							{courseSlug ? (
								<Button asChild className="flex-1" size="lg">
									<Link
										href={`/courses/${courseSlug}`}
										className="flex items-center justify-center gap-2"
									>
										{t("payment.success.startCourse") || "Start Course"}
										<ArrowRight className="h-4 w-4" />
									</Link>
								</Button>
							) : (
								<Button asChild className="flex-1" size="lg">
									<Link
										href="/dashboard/courses"
										className="flex items-center justify-center gap-2"
									>
										{t("payment.success.viewCourses") || "View My Courses"}
										<ArrowRight className="h-4 w-4" />
									</Link>
								</Button>
							)}
							<Button asChild variant="outline" className="flex-1" size="lg">
								<Link href="/dashboard">
									{t("payment.success.backToDashboard") || "Back to Dashboard"}
								</Link>
							</Button>
						</motion.div>

						<motion.div
							variants={itemVariants}
							className="text-center pt-4 border-t border-gray-200 dark:border-gray-700"
						>
							<p className="text-sm text-muted-foreground">
								{t("payment.success.supportMessage") ||
									"Need help? Contact our support team anytime."}
							</p>
							<Button variant="link" className="text-sm mt-2">
								{t("payment.success.contactSupport") || "Contact Support"}
							</Button>
						</motion.div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
