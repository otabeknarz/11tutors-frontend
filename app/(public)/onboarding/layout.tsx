"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { t } = useLanguage();

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
			{/* Simplified Header - Mobile Optimized */}
			<header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-14 sm:h-16">
						<Link href="/" className="flex-shrink-0 flex items-center group">
							<span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-primary transition-all duration-200">
								{t("app.name") || "11tutors"}
							</span>
						</Link>
						<div className="flex items-center gap-2 sm:gap-3">
							<div className="scale-90 sm:scale-100">
								<LanguageSwitcher />
							</div>
							<div className="scale-90 sm:scale-100">
								<ThemeToggle />
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Main content with mobile-first responsive design */}
			<main className="flex-1 flex items-start sm:items-center justify-center px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-2xl"
				>
					<Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
						<div className="p-4 sm:p-6 lg:p-8 xl:p-12">{children}</div>
					</Card>
				</motion.div>
			</main>

			{/* Minimal Footer */}
			<footer className="border-t bg-background/50 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<p className="text-center text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} {t("app.name") || "11tutors"}.{" "}
						{t("footer.rights") || "All rights reserved."}
					</p>
				</div>
			</footer>
		</div>
	);
}
