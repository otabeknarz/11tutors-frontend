"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	XCircle,
	ArrowLeft,
	RefreshCw,
	HelpCircle,
	ShoppingCart,
} from "lucide-react";

export default function PaymentCancelPage() {
	const { t } = useLanguage();
	const router = useRouter();
	const [countdown, setCountdown] = useState(10);

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					router.push("/dashboard");
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [router]);

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
		<div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
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
							className="mx-auto mb-4 h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
						>
							<XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
						</motion.div>
						<motion.div variants={itemVariants}>
							<CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
								{t("payment.cancel.title") || "Payment Cancelled"}
							</CardTitle>
							<p className="text-lg text-muted-foreground">
								{t("payment.cancel.subtitle") ||
									"Your payment was cancelled. No charges were made."}
							</p>
						</motion.div>
					</CardHeader>

					<CardContent className="space-y-6">
						<motion.div
							variants={itemVariants}
							className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
						>
							<h3 className="text-xl font-semibold text-orange-800 dark:text-orange-200 mb-2">
								{t("payment.cancel.noCharges") || "No Charges Applied"}
							</h3>
							<p className="text-orange-700 dark:text-orange-300">
								{t("payment.cancel.safeMessage") ||
									"Your payment method was not charged. You can try again anytime."}
							</p>
						</motion.div>

						<motion.div variants={itemVariants} className="space-y-4">
							<h4 className="text-lg font-semibold text-gray-900 dark:text-white">
								{t("payment.cancel.whatHappened") || "What happened?"}
							</h4>
							<div className="space-y-3">
								<div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
									<div className="h-2 w-2 bg-gray-400 rounded-full mt-2"></div>
									<p className="text-gray-700 dark:text-gray-300">
										{t("payment.cancel.reason1") ||
											"You chose to cancel the payment process"}
									</p>
								</div>
								<div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
									<div className="h-2 w-2 bg-gray-400 rounded-full mt-2"></div>
									<p className="text-gray-700 dark:text-gray-300">
										{t("payment.cancel.reason2") ||
											"The payment window was closed or timed out"}
									</p>
								</div>
								<div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
									<div className="h-2 w-2 bg-gray-400 rounded-full mt-2"></div>
									<p className="text-gray-700 dark:text-gray-300">
										{t("payment.cancel.reason3") ||
											"There was a technical issue with the payment"}
									</p>
								</div>
							</div>
						</motion.div>

						<motion.div variants={itemVariants} className="space-y-4">
							<h4 className="text-lg font-semibold text-gray-900 dark:text-white">
								{t("payment.cancel.nextSteps") || "What can you do next?"}
							</h4>
							<div className="grid gap-4 md:grid-cols-2">
								<div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
									<RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5" />
									<div>
										<h5 className="font-medium text-blue-800 dark:text-blue-200">
											{t("payment.cancel.tryAgain") || "Try Again"}
										</h5>
										<p className="text-sm text-blue-700 dark:text-blue-300">
											{t("payment.cancel.retryPayment") ||
												"Retry the payment process"}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
									<HelpCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5" />
									<div>
										<h5 className="font-medium text-green-800 dark:text-green-200">
											{t("payment.cancel.getHelp") || "Get Help"}
										</h5>
										<p className="text-sm text-green-700 dark:text-green-300">
											{t("payment.cancel.contactSupport") ||
												"Contact our support team"}
										</p>
									</div>
								</div>
							</div>
						</motion.div>

						<motion.div
							variants={itemVariants}
							className="flex flex-col sm:flex-row gap-4 pt-4"
						>
							<Button
								onClick={() => router.back()}
								className="flex-1"
								size="lg"
							>
								<RefreshCw className="h-4 w-4 mr-2" />
								{t("payment.cancel.tryAgainButton") || "Try Payment Again"}
							</Button>
							<Button asChild variant="outline" className="flex-1" size="lg">
								<Link href="/courses">
									<ShoppingCart className="h-4 w-4 mr-2" />
									{t("payment.cancel.browseCourses") || "Browse Courses"}
								</Link>
							</Button>
						</motion.div>

						<motion.div
							variants={itemVariants}
							className="text-center pt-4 border-t border-gray-200 dark:border-gray-700"
						>
							<p className="text-sm text-muted-foreground mb-2">
								{t("payment.cancel.autoRedirect") ||
									"Automatically redirecting to dashboard in"}{" "}
								<span className="font-semibold text-primary">{countdown}</span>{" "}
								{t("payment.cancel.seconds") || "seconds"}
							</p>
							<Button asChild variant="link" className="text-sm">
								<Link href="/dashboard">
									<ArrowLeft className="h-4 w-4 mr-1" />
									{t("payment.cancel.backToDashboard") ||
										"Back to Dashboard Now"}
								</Link>
							</Button>
						</motion.div>

						<motion.div
							variants={itemVariants}
							className="text-center pt-2 border-t border-gray-200 dark:border-gray-700"
						>
							<p className="text-sm text-muted-foreground">
								{t("payment.cancel.supportMessage") ||
									"Having trouble? Our support team is here to help."}
							</p>
							<Button variant="link" className="text-sm mt-2">
								{t("payment.cancel.contactSupportButton") || "Contact Support"}
							</Button>
						</motion.div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
