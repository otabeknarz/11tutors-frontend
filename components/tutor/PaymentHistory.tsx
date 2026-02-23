"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	CreditCard,
	CheckCircle,
	Clock,
	Download,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function PaymentHistory() {
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
							<div className="mx-auto w-24 h-24 bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mb-6">
								<CreditCard className="h-12 w-12 text-blue-600 dark:text-blue-400" />
							</div>
							<h2 className="text-3xl font-bold mb-3">
								{t("tutor.payments.title") || "Payment History"}
							</h2>
							<Badge variant="secondary" className="mb-4">
								Coming Soon
							</Badge>
							<p className="text-muted-foreground text-lg max-w-md mx-auto">
								Detailed payment history, transaction tracking, and financial reports will be available soon.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto">
							<div className="p-4 border rounded-lg">
								<CheckCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
								<h3 className="font-semibold mb-1">Transaction History</h3>
								<p className="text-sm text-muted-foreground">View all payment transactions</p>
							</div>
							<div className="p-4 border rounded-lg">
								<Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
								<h3 className="font-semibold mb-1">Payment Status</h3>
								<p className="text-sm text-muted-foreground">Track payment statuses</p>
							</div>
							<div className="p-4 border rounded-lg">
								<Download className="h-8 w-8 mx-auto mb-2 text-primary" />
								<h3 className="font-semibold mb-1">Export Reports</h3>
								<p className="text-sm text-muted-foreground">Download financial reports</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
