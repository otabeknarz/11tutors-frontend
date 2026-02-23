"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, CreditCard, Wallet } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function EarningsTracker() {
	const { t } = useLanguage();

	return (
		<div className="space-y-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex flex-col items-center justify-center min-h-[600px] text-center"
			>
				<Card className="max-w-2xl w-full">
					<CardContent className="pt-16 pb-16">
						<div className="mb-8">
							<div className="mx-auto w-24 h-24 bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full flex items-center justify-center mb-6">
								<DollarSign className="h-12 w-12 text-green-600 dark:text-green-400" />
							</div>
							<h2 className="text-3xl font-bold mb-3">
								{t("tutor.earnings.title") || "Earnings & Payouts"}
							</h2>
							<Badge variant="secondary" className="mb-4">
								{t("tutor.earnings.comingSoon")}
							</Badge>
							<p className="text-muted-foreground text-lg max-w-md mx-auto">
								{t("tutor.earnings.comingSoonDescription")}
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto">
							<div className="p-4 border rounded-lg">
								<Wallet className="h-8 w-8 mx-auto mb-2 text-primary" />
								<h3 className="font-semibold mb-1">
									{t("tutor.earnings.payoutTracking")}
								</h3>
								<p className="text-sm text-muted-foreground">
									{t("tutor.earnings.payoutTrackingDescription")}
								</p>
							</div>
							<div className="p-4 border rounded-lg">
								<TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
								<h3 className="font-semibold mb-1">
									{t("tutor.earnings.financialReports")}
								</h3>
								<p className="text-sm text-muted-foreground">
									{t("tutor.earnings.financialReportsDescription")}
								</p>
							</div>
							<div className="p-4 border rounded-lg">
								<CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
								<h3 className="font-semibold mb-1">
									{t("tutor.earnings.payoutMethods")}
								</h3>
								<p className="text-sm text-muted-foreground">
									{t("tutor.earnings.payoutMethodsDescription")}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
