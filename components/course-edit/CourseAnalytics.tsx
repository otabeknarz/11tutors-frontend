"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
	AreaChart,
	Area,
} from "recharts";
import {
	Users,
	DollarSign,
	Star,
	TrendingUp,
	BookOpen,
	Clock,
	Award,
	Download,
	Eye,
	PlayCircle,
	Target,
} from "lucide-react";

interface CourseAnalyticsProps {
	courseSlug: string;
}

export default function CourseAnalytics({ courseSlug }: CourseAnalyticsProps) {
	const { t } = useLanguage();
	const [loading, setLoading] = useState(true);
	const [timeRange, setTimeRange] = useState("30d");
	const [analytics, setAnalytics] = useState<any>(null);

	useEffect(() => {
		loadAnalytics();
	}, [courseSlug, timeRange]);

	const loadAnalytics = async () => {
		setLoading(true);
		// TODO: Replace with actual API call
		// const data = await tutorApi.getCourseStatistics(courseSlug);
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Mock data for now
		setAnalytics({
			totalEnrollments: 156,
			totalRevenue: 4680,
			averageRating: 4.7,
			completionRate: 68,
			totalViews: 2340,
			avgWatchTime: "45m",
			enrollmentTrend: [
				{ date: "Week 1", enrollments: 12, revenue: 360 },
				{ date: "Week 2", enrollments: 18, revenue: 540 },
				{ date: "Week 3", enrollments: 25, revenue: 750 },
				{ date: "Week 4", enrollments: 22, revenue: 660 },
			],
			lessonCompletion: [
				{ name: "Lesson 1", completion: 95 },
				{ name: "Lesson 2", completion: 88 },
				{ name: "Lesson 3", completion: 76 },
				{ name: "Lesson 4", completion: 65 },
				{ name: "Lesson 5", completion: 52 },
			],
			ratingDistribution: [
				{ stars: "5 stars", count: 89 },
				{ stars: "4 stars", count: 42 },
				{ stars: "3 stars", count: 15 },
				{ stars: "2 stars", count: 7 },
				{ stars: "1 star", count: 3 },
			],
			studentProgress: [
				{ range: "0-25%", students: 18 },
				{ range: "25-50%", students: 32 },
				{ range: "50-75%", students: 45 },
				{ range: "75-100%", students: 61 },
			],
		});
		setLoading(false);
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
			</div>
		);
	}

	if (!analytics) return null;

	const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-6"
		>
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h2 className="text-2xl font-bold">Course Analytics</h2>
					<p className="text-muted-foreground">
						Track your course performance and student engagement
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger className="w-[140px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="7d">Last 7 days</SelectItem>
							<SelectItem value="30d">Last 30 days</SelectItem>
							<SelectItem value="90d">Last 90 days</SelectItem>
							<SelectItem value="all">All time</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="outline" size="sm">
						<Download className="h-4 w-4 mr-2" />
						Export
					</Button>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Enrollments
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{analytics.totalEnrollments}
						</div>
						<p className="text-xs text-green-600 flex items-center gap-1">
							<TrendingUp className="h-3 w-3" /> +12% from last period
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							${analytics.totalRevenue.toLocaleString()}
						</div>
						<p className="text-xs text-green-600 flex items-center gap-1">
							<TrendingUp className="h-3 w-3" /> +8% from last period
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Average Rating
						</CardTitle>
						<Star className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{analytics.averageRating}</div>
						<p className="text-xs text-muted-foreground">
							Based on{" "}
							{analytics.ratingDistribution.reduce(
								(a: number, b: any) => a + b.count,
								0,
							)}{" "}
							reviews
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Completion Rate
						</CardTitle>
						<Target className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{analytics.completionRate}%
						</div>
						<p className="text-xs text-muted-foreground">
							{analytics.totalViews} total views
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Enrollment Trend */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Enrollment Trend
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<AreaChart data={analytics.enrollmentTrend}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip />
								<Area
									type="monotone"
									dataKey="enrollments"
									stroke="#3b82f6"
									fill="#3b82f6"
									fillOpacity={0.1}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Lesson Completion */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<PlayCircle className="h-5 w-5" />
							Lesson Completion Rates
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={analytics.lessonCompletion}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip formatter={(value) => [`${value}%`, "Completion"]} />
								<Bar
									dataKey="completion"
									fill="#10b981"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Rating Distribution */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Star className="h-5 w-5" />
							Rating Distribution
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={analytics.ratingDistribution}
									cx="50%"
									cy="50%"
									outerRadius={80}
									dataKey="count"
									label={({ stars, count }) => `${stars}: ${count}`}
								>
									{analytics.ratingDistribution.map((_: any, index: number) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Student Progress */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Award className="h-5 w-5" />
							Student Progress Distribution
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={analytics.studentProgress}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="range" />
								<YAxis />
								<Tooltip formatter={(value) => [`${value}`, "Students"]} />
								<Bar dataKey="students" fill="#f59e0b" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</motion.div>
	);
}
