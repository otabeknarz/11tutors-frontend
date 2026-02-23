"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import {
	TrendingUp,
	Users,
	BookOpen,
	DollarSign,
	Star,
	Clock,
	Target,
	Award,
	Loader2,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { tutorApi, TutorStatistics } from "@/lib/api/tutorApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
	title: string;
	value: string;
	change: string;
	changeType: "positive" | "negative" | "neutral";
	icon: React.ReactNode;
	description?: string;
}

function StatCard({
	title,
	value,
	change,
	changeType,
	icon,
	description,
}: StatCardProps) {
	const changeColor = {
		positive: "text-green-600 dark:text-green-400",
		negative: "text-red-600 dark:text-red-400",
		neutral: "text-muted-foreground",
	}[changeType];

	return (
		<Card className="relative overflow-hidden">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<div className="h-4 w-4 text-muted-foreground">{icon}</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<div className={`text-xs ${changeColor} flex items-center gap-1`}>
					<TrendingUp className="h-3 w-3" />
					{change}
				</div>
				{description && (
					<p className="text-xs text-muted-foreground mt-1">{description}</p>
				)}
			</CardContent>
		</Card>
	);
}

export default function AnalyticsOverview() {
	const { t } = useLanguage();
	const [statistics, setStatistics] = useState<TutorStatistics | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadStatistics();
	}, []);

	const loadStatistics = async () => {
		try {
			setLoading(true);
			const data = await tutorApi.getQuickStatistics();
			setStatistics(data);
		} catch (error) {
			console.error("Failed to load statistics:", error);
			toast.error(t("tutor.analytics.failedToLoad"));
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{[1, 2, 3, 4].map((i) => (
						<Card key={i}>
							<CardHeader>
								<Skeleton className="h-4 w-24" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-8 w-32 mb-2" />
								<Skeleton className="h-3 w-40" />
							</CardContent>
						</Card>
					))}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{[1, 2, 3, 4].map((i) => (
						<Card key={i}>
							<CardHeader>
								<Skeleton className="h-5 w-48" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-[300px] w-full" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (!statistics) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<p className="text-muted-foreground">
					{t("tutor.analytics.noStatistics")}
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Stats Grid */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
			>
				<StatCard
					title={t("tutor.analytics.totalEarnings")}
					value={`$${statistics.total_earnings.toLocaleString()}`}
					change={
						statistics.recent_enrollments > 0
							? `+${statistics.recent_enrollments} ${t("tutor.analytics.newEnrollments")}`
							: t("tutor.analytics.noRecentEnrollments")
					}
					changeType={
						statistics.recent_enrollments > 0 ? "positive" : "neutral"
					}
					icon={<DollarSign className="h-4 w-4" />}
					description={t("tutor.analytics.totalRevenue")}
				/>
				<StatCard
					title={t("tutor.analytics.activeStudents")}
					value={statistics.active_students.toString()}
					change={
						statistics.recent_enrollments > 0
							? `+${statistics.recent_enrollments} ${t("tutor.analytics.thisWeek")}`
							: t("tutor.analytics.noNewStudents")
					}
					changeType={
						statistics.recent_enrollments > 0 ? "positive" : "neutral"
					}
					icon={<Users className="h-4 w-4" />}
					description={t("tutor.analytics.acrossAllCourses")}
				/>
				<StatCard
					title={t("tutor.analytics.coursesCreated")}
					value={(
						statistics.published_courses + statistics.draft_courses
					).toString()}
					change={`${statistics.published_courses} ${t("tutor.analytics.published")}`}
					changeType="positive"
					icon={<BookOpen className="h-4 w-4" />}
					description={`${statistics.draft_courses} ${t("tutor.analytics.inDraft")}`}
				/>
				<StatCard
					title={t("tutor.analytics.averageRating")}
					value={statistics.average_rating.toFixed(1)}
					change={`${statistics.total_reviews} ${t("tutor.analytics.reviews")}`}
					changeType="positive"
					icon={<Star className="h-4 w-4" />}
					description={t("tutor.analytics.basedOnFeedback")}
				/>
			</motion.div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Monthly Earnings Chart */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="h-5 w-5" />
								{t("tutor.analytics.monthlyEarnings")}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={statistics.monthly_earnings}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip
										formatter={(value, name) => [
											name === "earnings" ? `$${value}` : value,
											name === "earnings"
												? t("tutor.analytics.chartEarnings")
												: t("tutor.analytics.chartStudents"),
										]}
									/>
									<Bar
										dataKey="earnings"
										fill="#3b82f6"
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</motion.div>

				{/* Course Performance Chart */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Award className="h-5 w-5" />
								{t("tutor.analytics.coursePerformance")}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={statistics.course_performance.map(
											(course, index) => ({
												...course,
												name: course.title,
												color: [
													"#3b82f6",
													"#10b981",
													"#f59e0b",
													"#ef4444",
													"#8b5cf6",
													"#ec4899",
												][index % 6],
											}),
										)}
										cx="50%"
										cy="50%"
										outerRadius={80}
										dataKey="students"
										label={({ name, students }) => `${name}: ${students}`}
									>
										{statistics.course_performance.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={
													[
														"#3b82f6",
														"#10b981",
														"#f59e0b",
														"#ef4444",
														"#8b5cf6",
														"#ec4899",
													][index % 6]
												}
											/>
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</motion.div>

				{/* Weekly Teaching Hours */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Clock className="h-5 w-5" />
								{t("tutor.analytics.weeklyHours")}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col items-center justify-center h-[300px] text-center">
								<Clock className="h-12 w-12 text-muted-foreground mb-4" />
								<p className="text-muted-foreground">
									{t("tutor.analytics.weeklyHoursComingSoon")}
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Student Growth */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Target className="h-5 w-5" />
								{t("tutor.analytics.studentGrowth")}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={statistics.monthly_earnings}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip
										formatter={(value) => [
											`${value}`,
											t("tutor.analytics.chartStudents"),
										]}
									/>
									<Line
										type="monotone"
										dataKey="students"
										stroke="#f59e0b"
										strokeWidth={3}
										dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
