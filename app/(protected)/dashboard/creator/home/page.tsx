"use client";

import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	BarChart3,
	BookOpen,
	DollarSign,
	CreditCard,
} from "lucide-react";

// Creator Components
import AnalyticsOverview from "@/components/tutor/AnalyticsOverview";
import CourseManagement from "@/components/tutor/CourseManagement";
import EarningsTracker from "@/components/tutor/EarningsTracker";
import PaymentHistory from "@/components/tutor/PaymentHistory";

export default function CreatorHome() {
	const { user } = useAuth();
	const { t } = useLanguage();

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h1 className="text-3xl font-bold">
					{t("tutor.welcome") || "Creator Dashboard"}
				</h1>
				<p className="text-muted-foreground mt-1">
					{t("tutor.welcomeSubtitle") || `Welcome back, ${user?.first_name}! Manage your courses and track performance.`}
				</p>
			</motion.div>

			{/* Tabs */}
			<Tabs defaultValue="analytics" className="space-y-6">
				<TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
					<TabsTrigger value="analytics" className="flex items-center gap-2">
						<BarChart3 className="h-4 w-4" />
						<span className="hidden sm:inline">
							{t("tutor.tabs.analytics") || "Analytics"}
						</span>
					</TabsTrigger>
					<TabsTrigger value="courses" className="flex items-center gap-2">
						<BookOpen className="h-4 w-4" />
						<span className="hidden sm:inline">
							{t("tutor.tabs.courses") || "Courses"}
						</span>
					</TabsTrigger>
					<TabsTrigger value="earnings" className="flex items-center gap-2">
						<DollarSign className="h-4 w-4" />
						<span className="hidden sm:inline">
							{t("tutor.tabs.earnings") || "Earnings"}
						</span>
					</TabsTrigger>
					<TabsTrigger value="payments" className="flex items-center gap-2">
						<CreditCard className="h-4 w-4" />
						<span className="hidden sm:inline">
							{t("tutor.tabs.payments") || "Payments"}
						</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="analytics">
					<AnalyticsOverview />
				</TabsContent>

				<TabsContent value="courses">
					<CourseManagement />
				</TabsContent>

				<TabsContent value="earnings">
					<EarningsTracker />
				</TabsContent>

				<TabsContent value="payments">
					<PaymentHistory />
				</TabsContent>
			</Tabs>
		</div>
	);
}
