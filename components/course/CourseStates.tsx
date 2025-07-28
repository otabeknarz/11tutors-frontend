"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface LoadingStateProps {
	message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
	const { t } = useLanguage();

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
			<div className="relative">
				<div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
				<div className="absolute inset-0 flex items-center justify-center">
					<RefreshCw className="h-6 w-6 text-primary animate-pulse" />
				</div>
			</div>
			<h2 className="text-xl font-semibold text-foreground mt-4">
				{message || t("courseDetail.loading")}
			</h2>
			<p className="text-muted-foreground mt-2 text-center max-w-md">
				Please wait while we load the course details...
			</p>
		</div>
	);
}

interface ErrorStateProps {
	error: string;
	onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
	const { t } = useLanguage();

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
			<div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
				<AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
			</div>
			<h2 className="text-xl font-semibold text-foreground mb-2">
				{t("courseDetail.error")}
			</h2>
			<p className="text-muted-foreground text-center max-w-md mb-6">{error}</p>
			<div className="flex gap-3">
				{onRetry && (
					<Button onClick={onRetry} variant="outline">
						Try Again
					</Button>
				)}
				<Button asChild>
					<Link href="/courses">{t("courseDetail.goBack")}</Link>
				</Button>
			</div>
		</div>
	);
}

interface NotFoundStateProps {
	message?: string;
}

export function NotFoundState({ message }: NotFoundStateProps) {
	const { t } = useLanguage();

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
			<div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
				<span className="text-2xl">🔍</span>
			</div>
			<h2 className="text-xl font-semibold text-foreground mb-2">
				{t("courseDetail.notFound")}
			</h2>
			<p className="text-muted-foreground text-center max-w-md mb-6">
				{message || t("courseDetail.notFoundMessage")}
			</p>
			<Button asChild>
				<Link href="/courses">{t("courseDetail.goBack")}</Link>
			</Button>
		</div>
	);
}
